# Terminal Quick Start Guide

## Installation

The terminal has been integrated into the app. No additional setup needed!

## Using the Terminal

### Open Terminal
Press: **`Ctrl+Shift+`` ` (Ctrl+Shift+Backtick)**

The terminal will appear at the bottom of your app window.

### Close Terminal
Press: **`Ctrl+Shift+`` ` again**

Or click outside the terminal area.

### What You Can Do

The terminal is a **real bash shell**. Everything works just like Terminal.app:

```bash
# List files
$ ls -la

# Navigate directories
$ cd /Users/mauro/Desktop

# Check current directory
$ pwd

# Create files
$ echo "hello" > test.txt

# Run Python scripts
$ python3 my_script.py

# Git operations
$ git status
$ git log

# Install packages
$ brew install package-name

# And everything else you can do in Terminal!
```

### Features

✅ Full bash shell access
✅ All Unix utilities available
✅ Command history (use ↑/↓ arrows)
✅ Tab completion
✅ Piping and redirection
✅ Environment variables
✅ 256 color support
✅ Interrupt with Ctrl+C

## Examples

### Python Development
```bash
$ python3 --version
Python 3.11.0

$ python3 -m venv myenv
$ source myenv/bin/activate
$ pip install requests
$ python3 script.py
```

### Git Workflow
```bash
$ git clone <repo>
$ cd <repo>
$ git checkout -b feature-branch
$ git status
$ git add .
$ git commit -m "My changes"
$ git push origin feature-branch
```

### File Operations
```bash
$ mkdir project
$ cd project
$ touch README.md
$ cat README.md
$ cp file1.txt file1.backup.txt
$ rm -rf unwanted-dir
```

## Terminal Environment

- **Shell**: bash (or your $SHELL)
- **Home Directory**: /Users/mauro
- **Terminal Type**: xterm-256color (full color support)
- **Initial Size**: 120×30 (resizes with window)

## Troubleshooting

### Terminal won't open
- Make sure you're pressing `Ctrl+Shift+`` (Ctrl + Shift + Backtick)
- Check that the app window is focused
- Restart the app if it's not responding

### Commands not working
- Remember it's a real bash shell - make sure you have the right permissions
- Use `which command-name` to check if a command is installed
- Use `pwd` to see your current directory

### Terminal is too small
- Resize the terminal container by dragging the top border
- Or close and reopen to reset to default size

## Tips & Tricks

### Quick Navigation
```bash
# Go back to home directory
$ cd ~

# Go to previous directory
$ cd -

# Use pushd/popd for directory stack
$ pushd /path1
$ pushd /path2
$ popd  # Back to /path1
```

### View Manual Pages
```bash
$ man ls
$ man grep
$ man python
```

### Find Files
```bash
$ find . -name "*.py"
$ find . -type f -name "test*"
$ grep -r "search-term" .
```

### Check System Info
```bash
$ uname -a
$ sw_vers
$ whoami
$ date
```

## Terminal Shortcuts

Inside the terminal, standard bash shortcuts work:

| Keys | Action |
|------|--------|
| `Ctrl+C` | Interrupt current command |
| `Ctrl+D` | Exit terminal |
| `Ctrl+Z` | Suspend current job |
| `Ctrl+A` | Go to start of line |
| `Ctrl+E` | Go to end of line |
| `Ctrl+L` | Clear screen |
| `↑` | Previous command |
| `↓` | Next command |
| `Tab` | Auto-complete |

## Getting Help

### Inside Terminal
```bash
# Get help for any command
$ man command-name

# Short help
$ command-name --help
$ command-name -h

# List directory contents
$ ls --help
```

### Examples
```bash
$ man ls
$ python3 --help
$ grep -h
```

## Performance

- Terminal opens instantly
- No lag when typing
- Handles large outputs smoothly
- Lightweight on system resources

## That's It!

You now have a powerful terminal integrated into your Note Taking App. Use it to run scripts, manage files, install packages, or whatever you need!

Enjoy! 🚀
