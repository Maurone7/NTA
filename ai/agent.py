import subprocess
import os
import sys
import json
import argparse
import hashlib
import time
import shutil
import difflib
from pathlib import Path

# Backups and run manifest
BACKUPS_DIR = Path(__file__).resolve().parent / "backups"
CURRENT_RUN_ID = None
MANIFEST = {}
DEBUG = False


def ask_llama(prompt: str) -> str:
    """Send prompt to local Ollama model and return the response text.

    Requires the `ollama` CLI to be installed and the `llama3` model available.
    """
    process = subprocess.Popen(
        ["ollama", "run", ask_llama.model],
        stdin=subprocess.PIPE,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True,
    )
    try:
        output, err = process.communicate(input=prompt, timeout=ask_llama.timeout)
    except subprocess.TimeoutExpired:
        try:
            process.kill()
        except Exception:
            pass
        process.communicate()
        raise RuntimeError(f"Ollama call timed out after {ask_llama.timeout} seconds")
    if process.returncode != 0:
        raise RuntimeError(f"Ollama failed: {err}")
    return output

# default timeout (seconds) used by ask_llama; can be overridden by CLI
ask_llama.timeout = 120
# default model used by ask_llama; can be overridden by CLI
ask_llama.model = "code-llama-7b-instruct"


def read_file(path: Path) -> str:
    return path.read_text(encoding="utf-8")


def write_file(path: Path, content: str):
    path.write_text(content, encoding="utf-8")


def make_backup(path: Path) -> Path:
    bak = path.with_suffix(path.suffix + ".bak")
    try:
        shutil.copy2(path, bak)
    except Exception:
        pass
    # also save into run-specific backups if a run is active
    try:
        if CURRENT_RUN_ID:
            # compute relative path under repo root if possible
            repo_root = MANIFEST.get('repo_root')
            if repo_root:
                try:
                    rel = path.relative_to(Path(repo_root))
                except Exception:
                    rel = Path(path.name)
            else:
                rel = Path(path.name)
            dest = BACKUPS_DIR / CURRENT_RUN_ID / rel.parent
            dest.mkdir(parents=True, exist_ok=True)
            shutil.copy2(path, dest / path.name)
            # record in manifest
            run_entry = MANIFEST.setdefault('runs', {}).setdefault(CURRENT_RUN_ID, {'ts': time.time(), 'instruction': MANIFEST.get('instruction', ''), 'files': []})
            run_entry['files'].append({'orig': str(path), 'backup': str((dest / path.name))})
    except Exception:
        pass
    return bak


def start_run(instruction: str, repo_root: Path):
    global CURRENT_RUN_ID, MANIFEST
    CURRENT_RUN_ID = time.strftime('%Y%m%d-%H%M%S')
    BACKUPS_DIR.mkdir(parents=True, exist_ok=True)
    manifest_file = BACKUPS_DIR / 'manifest.json'
    try:
        if manifest_file.exists():
            MANIFEST = json.loads(manifest_file.read_text(encoding='utf-8'))
        else:
            MANIFEST = {}
    except Exception:
        MANIFEST = {}
    # store repo root and instruction for convenience
    MANIFEST['repo_root'] = str(repo_root)
    MANIFEST['instruction'] = instruction
    MANIFEST.setdefault('runs', {})
    MANIFEST['runs'].setdefault(CURRENT_RUN_ID, {'ts': time.time(), 'instruction': instruction, 'files': []})
    return CURRENT_RUN_ID


def save_manifest():
    try:
        (BACKUPS_DIR / 'manifest.json').write_text(json.dumps(MANIFEST, indent=2), encoding='utf-8')
    except Exception:
        pass


def list_runs():
    runs = MANIFEST.get('runs', {})
    out = []
    for rid, info in runs.items():
        out.append((rid, info.get('ts'), info.get('instruction'), len(info.get('files', []))))
    out.sort(key=lambda x: x[1] or 0)
    return out


def undo_run(run_id: str):
    runs = MANIFEST.get('runs', {})
    if run_id not in runs:
        return 0, 0
    restored = 0
    total = 0
    for item in runs[run_id].get('files', []):
        total += 1
        orig = Path(item['orig'])
        backup = Path(item['backup'])
        if backup.exists():
            try:
                shutil.copy2(backup, orig)
                restored += 1
            except Exception:
                pass
    return restored, total


def is_text_file(path: Path) -> bool:
    text_exts = {
        ".py",
        ".js",
        ".ts",
        ".json",
        ".md",
        ".txt",
        ".html",
        ".css",
        ".scss",
        ".yml",
        ".yaml",
        ".csv",
    }
    return path.suffix.lower() in text_exts


CODE_EXTS = {".py", ".js", ".ts", ".jsx", ".tsx", ".json", ".css", ".scss", ".html"}

DEFAULT_EXCLUDES = {".git", "node_modules", "dist", "build", "venv", ".venv", "__pycache__"}


def gather_files(target: Path, recursive: bool = True, exts=None, excludes=None):
    if excludes is None:
        excludes = DEFAULT_EXCLUDES
    # default to code extensions when caller doesn't supply explicit exts
    if exts is None:
        exts = CODE_EXTS
    # normalize extensions
    exts = {e if e.startswith('.') else f'.{e}' for e in exts}

    files = []
    if target.is_file():
        if target.suffix.lower() in exts and target.name.lower() not in {"readme.md", "readme"}:
            files = [target]
        else:
            files = []
    else:
        for root, dirs, filenames in os.walk(target):
            # prune excluded dirs
            dirs[:] = [d for d in dirs if d not in excludes]
            for fn in filenames:
                p = Path(root) / fn
                if p.suffix.lower() not in exts:
                    continue
                # skip README unless explicitly requested via --ext
                if p.name.lower() in {"readme.md", "readme"} and ('.md' not in exts):
                    continue
                files.append(p)
            if not recursive:
                break

    # prioritize code files first (stable sort)
    files.sort(key=lambda p: (0 if p.suffix.lower() in CODE_EXTS else 1, str(p)))
    return files


def smoke_test_model(model: str, timeout: int = 5) -> bool:
    """Run a tiny smoke prompt against the given Ollama model to ensure it starts and produces output.

    Returns True if the model produced any output within timeout, False otherwise.
    """
    try:
        proc = subprocess.Popen([
            "ollama",
            "run",
            model,
        ], stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
        # send a tiny prompt
        prompt = "Hello from smoke test\n"
        out, err = proc.communicate(input=prompt, timeout=timeout)
        if proc.returncode != 0:
            print(f"[model test] Model run failed (rc={proc.returncode}): {err.strip()}")
            return False
        if out and out.strip():
            return True
        print("[model test] Model produced no output")
        return False
    except subprocess.TimeoutExpired:
        try:
            proc.kill()
            proc.communicate()
        except Exception:
            pass
        print(f"[model test] Model {model} timed out after {timeout}s")
        return False
    except Exception as e:
        print(f"[model test] Error testing model {model}: {e}")
        return False


def build_prompt(file_path: Path, content: str, instruction: str) -> str:
    return f"""
You are a coding assistant. Modify the file according to the user's instruction.

User instruction: {instruction}

File path: {file_path}

Original content:
```
{content}
```

Return only the full new file contents (no explanations, no markdown fences). If no change is needed, return the original content unchanged.
"""


def apply_agent_to_file(path: Path, instruction: str, dry_run: bool = True, auto_apply: bool = False, llm_timeout: int | None = None, model: str = None, retries: int = 0, backoff: float = 1.0, temperature: float | None = None):
    """Apply the agent to a single file. Returns tuple (ok: bool, new_content: Optional[str]).

    If no change is needed returns (True, None). If LLM fails returns (False, None).
    If changes detected and applied (or dry-run) returns (True, new_content).
    """
    try:
        orig = read_file(path)
    except Exception as e:
        print(f"[skip] Cannot read {path}: {e}")
        return False, None

    prompt = build_prompt(path, orig, instruction)
    # configure model and timeout for this call (restore originals after)
    prev_model = ask_llama.model
    prev_timeout = ask_llama.timeout
    if model:
        ask_llama.model = model
    if llm_timeout is not None:
        ask_llama.timeout = llm_timeout

    # retries with exponential backoff
    attempt = 0
    last_err = None
    while True:
        try:
            start_t = time.time()
            new = ask_llama(prompt)
            dur = time.time() - start_t
            if DEBUG:
                print(f"[debug] LLM call for {path} completed in {dur:.2f}s (attempt {attempt+1})")
            break
        except Exception as e:
            last_err = e
            attempt += 1
            if DEBUG:
                print(f"[debug] LLM error for {path} on attempt {attempt}: {e}")
            if attempt > retries:
                print(f"[error] LLM failed for {path}: {e}")
                # restore globals before returning
                ask_llama.model = prev_model
                ask_llama.timeout = prev_timeout
                return False, None
            sleep_time = backoff * (2 ** (attempt - 1))
            print(f"[warn] LLM call failed (attempt {attempt}/{retries}), retrying in {sleep_time}s...")
            time.sleep(sleep_time)

    # restore globals
    ask_llama.model = prev_model
    ask_llama.timeout = prev_timeout

    # Normalize line endings
    new = new.replace('\r\n', '\n')

    if new.strip() == orig.strip():
        print(f"[no change] {path}")
        return True, None

    diff = list(difflib.unified_diff(orig.splitlines(keepends=True), new.splitlines(keepends=True), fromfile=str(path), tofile=str(path)))
    print("".join(diff[:2000]))

    if dry_run and not auto_apply:
        print(f"[dry-run] Changes detected for {path} (not applied). Use --auto-apply to write changes or rerun with --apply.")
        return True, new

    # backup and write
    try:
        bak = make_backup(path)
        write_file(path, new)
        print(f"[updated] {path} (backup: {bak})")
        return True, new
    except Exception as e:
        print(f"[error] Failed to write {path}: {e}")
        return False, None


def parse_args():
    p = argparse.ArgumentParser(description="Local agent to edit files using a local LLM (ollama)")
    p.add_argument("target", nargs="?", default=None, help="File or directory to operate on. Defaults to repository root (parent of ai/)")
    p.add_argument("-i", "--instruction", default="""
(base) mauro@MacBook-Air NoteTakingApp % npm start

> note-taking-app@0.0.5 start
> electron .

App threw an error during load
/Users/mauro/Desktop/NoteTakingApp/src/main.js:51
          id: `file-${Buffer.from(full).toString('base64').slice(0, 12)}`,
               ^^^^

SyntaxError: Unexpected identifier 'file'
    at wrapSafe (node:internal/modules/cjs/loader:1288:20)
    at Module._compile (node:internal/modules/cjs/loader:1328:27)
    at Module._extensions..js (node:internal/modules/cjs/loader:1432:10)
    at Module.load (node:internal/modules/cjs/loader:1215:32)
    at Module._load (node:internal/modules/cjs/loader:1031:12)
    at c._load (node:electron/js2c/node_init:2:13801)
    at cjsLoader (node:internal/modules/esm/translators:352:17)
    at ModuleWrap.<anonymous> (node:internal/modules/esm/translators:297:7)
    at ModuleJob.run (node:internal/modules/esm/module_job:222:25)
    at async ModuleLoader.import (node:internal/modules/esm/loader:316:24)
^C/Users/mauro/Desktop/NoteTakingApp/node_modules/electron/dist/Electron.app/Contents/MacOS/Electron exited with signal SIGINT
                   
                   """, help="Instruction for the agent")
    p.add_argument("--recursive", dest="recursive", action="store_true", help="Recurse into directories")
    p.add_argument("--no-recursive", dest="recursive", action="store_false", help="Do not recurse into directories")
    p.set_defaults(recursive=None)
    p.add_argument("--dry-run", dest="dry_run", action="store_true", default=True, help="Do not write changes by default")
    p.add_argument("--apply", dest="dry_run", action="store_false", help="Write changes to disk (makes backups)")
    p.add_argument("--auto-apply", action="store_true", help="Automatically apply changes without prompting (implies --apply)")
    p.add_argument("--ext", nargs="*", help="Limit to these file extensions (e.g. .py .md)")
    p.add_argument("--exclude", nargs="*", help="Directories to exclude")
    p.add_argument("--confirm", action="store_true", help="Ask for confirmation per-file before applying changes")
    p.add_argument("--revert", action="store_true", help="Revert changes by restoring .bak backups (operates on target)")
    p.add_argument("--no-memory", action="store_true", help="Disable memory/cache; always re-run LLM")
    p.add_argument("--memory-file", default=None, help="Path to memory JSON file (defaults to ai/agent_memory.json)")
    p.add_argument("--invalidate-memory", action="store_true", help="Clear memory before running")
    p.add_argument("--llm-timeout", type=int, default=60, help="Seconds to wait for LLM response before timing out")
    p.add_argument("--model", default=ask_llama.model, help="Ollama model name to run (e.g. code-llama-7b-instruct)")
    p.add_argument("--retries", type=int, default=0, help="Number of retries for LLM calls on failure")
    p.add_argument("--backoff", type=float, default=2.0, help="Base backoff seconds for retries (exponential)")
    p.add_argument("--debug", action="store_true", help="Enable debug output (prints installed models and extra diagnostics)")
    p.add_argument("--temperature", type=float, default=None, help="Temperature parameter to pass to model if supported (not yet wired)")
    p.add_argument("--no-auto-model", action="store_true", help="Do not auto-select an installed code model if the requested model is missing")
    p.add_argument("--list-runs", action="store_true", help="List previous edit runs created by the agent")
    p.add_argument("--undo-run", default=None, help="Undo a previous run by id (restores files from that run)")
    return p.parse_args()


def main():
    args = parse_args()
    global DEBUG
    DEBUG = bool(args.debug)

    # memory file handling
    memory_file = Path(args.memory_file) if args.memory_file else (Path(__file__).resolve().parent / "agent_memory.json")
    memory = {}
    if args.invalidate_memory and memory_file.exists():
        try:
            memory_file.unlink()
            print(f"Memory invalidated: removed {memory_file}")
        except Exception:
            pass
    if memory_file.exists() and not args.no_memory:
        try:
            memory = json.loads(memory_file.read_text(encoding="utf-8"))
        except Exception as e:
            print(f"[memory] failed to load memory file {memory_file}: {e}")
            memory = {}

    # determine default target: parent of ai folder
    script_dir = Path(__file__).resolve().parent
    default_target = script_dir.parent

    target = Path(args.target) if args.target else default_target
    if not target.exists():
        print(f"Target does not exist: {target}")
        sys.exit(2)

    # model preflight: ensure requested model is installed; if not, optionally auto-select a code model
    def get_installed_models():
        try:
            out = subprocess.check_output(["ollama", "list"], text=True)
            lines = [l.strip() for l in out.splitlines() if l.strip()]
            names = []
            for l in lines[1:]:
                parts = l.split()
                if parts:
                    names.append(parts[0])
            return names
        except Exception:
            return []

    installed = get_installed_models()
    if DEBUG:
        print(f"[debug] Installed Ollama models: {installed}")
    if args.model not in installed:
        if args.no_auto_model:
            print(f"Requested model '{args.model}' is not installed. Installed models: {installed}")
            print("Use --model to pick one of the installed models or run `ollama pull <model>` to install.")
            return
        # pick a fallback from a prioritized list
        priority = ["qwen3-coder:30b", "code-llama-7b-instruct", "starcoder", "codegen-6b", "llama3:latest"]
        fallback = None
        for p in priority:
            if p in installed:
                fallback = p
                break
        if fallback:
            print(f"Requested model '{args.model}' is not installed. Falling back to installed model: {fallback}")
            args.model = fallback
        else:
            print(f"Requested model '{args.model}' is not installed and no suitable fallback found. Installed: {installed}")
            return

    # quick smoke-test: ensure the selected model responds before processing many files
    # Allow a longer smoke timeout derived from the requested llm-timeout (but cap it)
    # Respect user's --llm-timeout, but clamp to [5, 180]
    user_timeout = int(args.llm_timeout or ask_llama.timeout)
    smoke_timeout = max(5, min(180, user_timeout))
    print(f"Testing model '{args.model}' with a short smoke test (timeout {smoke_timeout}s)...")
    ok_model = smoke_test_model(args.model, timeout=smoke_timeout)
    if not ok_model:
        print(f"Selected model '{args.model}' failed the smoke test. Installed models: {installed}")
        if args.no_auto_model:
            print("Use --model to pick one of the installed models or run `ollama pull <model>` to install.")
            return
        # try to fallback to an installed priority list, testing each until one succeeds
        priority_list = ["qwen3-coder:30b", "code-llama-7b-instruct", "starcoder", "codegen-6b", "llama3:latest"]
        tried = []
        fallback = None
        # first try prioritized models that are installed
        for p in priority_list:
            if p in installed and p != args.model:
                tried.append(p)
                if DEBUG:
                    print(f"[debug] Trying fallback model: {p}")
                if smoke_test_model(p, timeout=smoke_timeout):
                    fallback = p
                    break
        # if none of the prioritized models worked, try any other installed model (excluding the requested one)
        if not fallback:
            if DEBUG:
                # print diagnostic info about installed variable and its items
                try:
                    print(f"[debug] installed repr: {installed!r} (type={type(installed).__name__})")
                    for idx, itm in enumerate(installed):
                        print(f"[debug] installed[{idx}] repr={itm!r} type={type(itm).__name__}")
                except Exception as _:
                    print(f"[debug] failed to introspect 'installed': {installed}")
            for p in installed:
                if p == args.model or p in tried:
                    continue
                tried.append(p)
                if DEBUG:
                    print(f"[debug] Trying non-priority installed model: {p!r}")
                if smoke_test_model(p, timeout=smoke_timeout):
                    fallback = p
                    break
        if fallback:
            print(f"Falling back to installed model: {fallback}")
            args.model = fallback
        else:
            print(f"No suitable installed fallback models succeeded (tried: {tried}). Aborting.")
            return

    # handle listing or undoing runs before doing any work
    manifest_file = BACKUPS_DIR / 'manifest.json'
    if args.list_runs:
        try:
            if manifest_file.exists():
                mf = json.loads(manifest_file.read_text(encoding='utf-8'))
            else:
                mf = {}
            runs = mf.get('runs', {})
            if not runs:
                print('No runs found')
                return
            for rid, info in runs.items():
                ts = info.get('ts')
                instr = info.get('instruction')
                count = len(info.get('files', []))
                print(f"{rid}: {time.ctime(ts)} - {count} files - {instr}")
        except Exception as e:
            print(f"Failed to read manifest: {e}")
        return

    if args.undo_run:
        try:
            if manifest_file.exists():
                MANIFEST = json.loads(manifest_file.read_text(encoding='utf-8'))
            else:
                MANIFEST = {}
        except Exception:
            MANIFEST = {}
        restored, total = undo_run(args.undo_run)
        print(f"Undo run {args.undo_run}: restored {restored}/{total} files")
        return

    exts = None
    if args.ext:
        exts = {e if e.startswith('.') else f'.{e}' for e in args.ext}

    excludes = set(args.exclude) if args.exclude else None

    # If recursive not explicitly set: default True when target is a dir
    if args.recursive is None:
        recursive = target.is_dir()
    else:
        recursive = args.recursive

    files = gather_files(target, recursive=recursive, exts=exts, excludes=excludes)

    if not files:
        print(f"No files found under {target}")
        return

    print(f"Found {len(files)} files. Running agent with instruction: {args.instruction!r}")

    # Determine dry_run/apply
    dry_run = args.dry_run
    if args.auto_apply:
        dry_run = False

    # Start a named run (so per-run backups are recorded)
    start_run(args.instruction, default_target)

    # Revert mode: restore backups
    if args.revert:
        restored = 0
        for idx, f in enumerate(files, start=1):
            bak = f.with_suffix(f.suffix + ".bak")
            if bak.exists():
                shutil.copy2(bak, f)
                print(f"[reverted] {f} (from {bak})")
                restored += 1
            else:
                print(f"[no backup] {f} (skipping)")
        print(f"Revert complete. Restored: {restored}/{len(files)}")
        return

    success = 0
    try:
        for idx, f in enumerate(files, start=1):
            if not f.exists():
                continue
            print(f"[{idx}/{len(files)}] processing {f}")
            # compute cache key based on instruction + file metadata
            stat = f.stat()
            key_src = f"{args.instruction}:{str(f)}:{stat.st_mtime}:{stat.st_size}"
            key = hashlib.sha256(key_src.encode('utf-8')).hexdigest()

            cached = None
            if (not args.no_memory) and key in memory:
                cached = memory[key]

            # If confirm mode: we want to show diff first. Use cached result if available, otherwise call LLM.
            if args.confirm:
                if cached:
                    new_content = cached.get('content')
                    # If no change
                    if new_content is None or new_content.strip() == read_file(f).strip():
                        print(f"[no change] {f}")
                        ok = True
                    else:
                        # print diff
                        orig = read_file(f)
                        diff = list(difflib.unified_diff(orig.splitlines(keepends=True), new_content.splitlines(keepends=True), fromfile=str(f), tofile=str(f)))
                        print("".join(diff[:2000]))
                        ans = input(f"Apply changes to {f}? [y/N]: ").strip().lower()
                        if ans not in ("y", "yes"):
                            print(f"[refused] {f}")
                            ok = False
                        else:
                            # write
                            try:
                                bak = make_backup(f)
                                write_file(f, new_content)
                                print(f"[updated] {f} (backup: {bak})")
                                ok = True
                            except Exception as e:
                                print(f"[error] Failed to write {f}: {e}")
                                ok = False
                else:
                    # not cached: call agent in dry-run to get suggested content and then ask
                    ok, new_content = apply_agent_to_file(
                        f,
                        args.instruction,
                        dry_run=True,
                        auto_apply=False,
                        llm_timeout=args.llm_timeout,
                        model=args.model,
                        retries=args.retries,
                        backoff=args.backoff,
                        temperature=args.temperature,
                    )
                    if not ok:
                        continue
                    if new_content is None:
                        # no change
                        continue
                    ans = input(f"Apply changes to {f}? [y/N]: ").strip().lower()
                    if ans not in ("y", "yes"):
                        print(f"[refused] {f}")
                        ok = False
                    else:
                        # apply using returned new_content (avoid re-calling LLM)
                        try:
                            bak = make_backup(f)
                            write_file(f, new_content)
                            print(f"[updated] {f} (backup: {bak})")
                            ok = True
                            # store in memory
                            if not args.no_memory:
                                memory[key] = {"content": new_content, "ts": time.time()}
                        except Exception as e:
                            print(f"[error] Failed to write {f}: {e}")
                            ok = False
            else:
                # non-confirm flow: consult cache first
                if cached:
                    new_content = cached.get('content')
                    if new_content is None or new_content.strip() == read_file(f).strip():
                        print(f"[no change] {f} (cached)")
                        ok = True
                    else:
                        if dry_run:
                            print(f"[dry-run] Changes detected for {f} (cached)")
                            ok = True
                        else:
                            try:
                                bak = make_backup(f)
                                write_file(f, new_content)
                                print(f"[updated] {f} (backup: {bak})")
                                ok = True
                            except Exception as e:
                                print(f"[error] Failed to write {f}: {e}")
                                ok = False
                else:
                    ok, new_content = apply_agent_to_file(
                        f,
                        args.instruction,
                        dry_run=dry_run,
                        auto_apply=args.auto_apply,
                        llm_timeout=args.llm_timeout,
                        model=args.model,
                        retries=args.retries,
                        backoff=args.backoff,
                        temperature=args.temperature,
                    )
                    if ok and new_content is not None and (not args.no_memory):
                        memory[key] = {"content": new_content, "ts": time.time()}

            if ok:
                success += 1
    except KeyboardInterrupt:
        print("\nInterrupted by user. Saving memory and exiting...")
        try:
            if not args.no_memory:
                memory_file.write_text(json.dumps(memory, indent=2), encoding='utf-8')
                print(f"Memory saved to {memory_file}")
        except Exception as e:
            print(f"[memory] Failed to save memory on interrupt: {e}")
        return

    # persist memory
    try:
        if not args.no_memory:
            memory_file.write_text(json.dumps(memory, indent=2), encoding='utf-8')
            print(f"Memory saved to {memory_file}")
    except Exception as e:
        print(f"[memory] Failed to save memory: {e}")

    print(f"Done. Processed {len(files)} files, successful: {success}")


if __name__ == '__main__':
    main()
