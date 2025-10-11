const assert = require('assert');
const { JSDOM } = require('jsdom');
const path = require('path');

function makeWindow() {
  const domHtml = `<!doctype html><html><body>
    <section class="editor-pane editor-pane--left" data-pane-id="left">
      <textarea id="note-editor-left"></textarea>
    </section>
    <section class="editor-pane editor-pane--right" data-pane-id="right">
      <textarea id="note-editor-right"></textarea>
    </section>
    <div id="workspace-content">
      <div id="preview"></div>
    </div>
    <button id="update-download-button" style="display: none;"></button>
    <button id="update-install-button" style="display: none;"></button>
    <button id="update-dismiss-button" style="display: none;"></button>
  </body></html>`;
  const dom = new JSDOM(domHtml, { runScripts: 'outside-only', url: 'http://localhost' });
  const w = new JSDOM(dom.serialize(), { runScripts: 'outside-only', url: 'http://localhost' }).window;
  // minimal stubs
  w.api = { on: () => {}, removeListener: () => {}, writeDebugLog: () => {}, resolveResource: async () => ({ value: '' }) };
  // Provide a robust matchMedia stub
  w.matchMedia = (query) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {}
  });
  w.localStorage = w.localStorage || { getItem: () => null, setItem: () => {}, removeItem: () => {} };
  // Minimal DOMPurify stub
  w.DOMPurify = { sanitize: (s) => s };
  // Minimal MutationObserver stub
  w.MutationObserver = function(callback) {
    this.observe = () => {};
    this.disconnect = () => {};
  };
  // Provide a robust matchMedia stub
  w.matchMedia = (query) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {}
  });
  // More complete marked stub for initialization
  w.marked = {
    parse: (s) => s || '',
    Renderer: function() { this.image = () => ''; },
    use: function(options) {
      // Minimal behavior: accept options and ensure parse exists
      if (options && typeof options.renderer !== 'undefined') {
        // no-op: renderer will be constructed by createRendererOverrides
      }
      w.marked.parse = (s) => s || '';
    }
  };
  return w;
}

// Test LaTeX environment auto-completion functionality
describe('DOM: LaTeX environment auto-completion', function() {
  it('should auto-complete LaTeX environments when pressing Enter', function(done) {
    const window = makeWindow();
    global.window = window; global.document = window.document; global.localStorage = window.localStorage; global.MutationObserver = window.MutationObserver;
    const app = require(path.join(__dirname, '..', '..', 'src', 'renderer', 'app.js'));
    const hooks = app.__test__;
    if (hooks.initialize) hooks.initialize();
    // Ensure editorPanes is properly initialized
    hooks.state.editorPanes = hooks.state.editorPanes || {};
    hooks.state.editorPanes.left = hooks.state.editorPanes.left || { noteId: null };
    hooks.state.editorPanes.right = hooks.state.editorPanes.right || { noteId: null };

    try {
      // Create a LaTeX note
      const latexNote = {
        id: 'test-latex',
        type: 'latex',
        content: '\\begin{figure}',
        absolutePath: '/tmp/test.tex',
        folderPath: '/tmp'
      };
      hooks.state.notes.set(latexNote.id, latexNote);
      hooks.state.activeNoteId = latexNote.id;
      hooks.state.editorPanes.right.noteId = latexNote.id;

      // Get the textarea
      const textarea = document.getElementById('note-editor-right');
      assert(textarea, 'Textarea should exist');

      // Set up the textarea content
      textarea.value = '\\begin{figure}';
      textarea.selectionStart = textarea.value.length;
      textarea.selectionEnd = textarea.value.length;

      // Focus the textarea
      textarea.focus();

      // Directly call the LaTeX auto-completion function
      const result = hooks.handleLatexEnvironmentAutoComplete(textarea);

      // Check the result
      assert(result === true, 'Function should return true for successful completion');
      assert(textarea.value.includes('\\end{figure}'), 'Should add closing environment tag');
      assert(textarea.value.includes('\\centering'), 'Should include centering');
      assert(textarea.value.includes('\\includegraphics{}'), 'Should include includegraphics');
      assert(textarea.value.includes('\\caption{}'), 'Should include caption');
      assert(textarea.value.includes('\\label{fig:}'), 'Should include label');
      assert.strictEqual(textarea.selectionStart, 36, 'Cursor should be positioned in includegraphics braces');

      done();
    } catch (e) {
      done(e);
    } finally {
      try { window.close(); } catch (e) {}
      delete global.window; delete global.document; delete global.localStorage; delete global.MutationObserver;
    }
  });

  it('should work with different environment names', function(done) {
    const window = makeWindow();
    global.window = window; global.document = window.document; global.localStorage = window.localStorage; global.MutationObserver = window.MutationObserver;
    const app = require(path.join(__dirname, '..', '..', 'src', 'renderer', 'app.js'));
    const hooks = app.__test__;
    if (hooks.initialize) hooks.initialize();
    // Ensure editorPanes is properly initialized
    hooks.state.editorPanes = hooks.state.editorPanes || {};
    hooks.state.editorPanes.left = hooks.state.editorPanes.left || { noteId: null };
    hooks.state.editorPanes.right = hooks.state.editorPanes.right || { noteId: null };

    try {
      const testCases = [
        { input: '\\begin{itemize}', expected: '\\begin{itemize}\n\\end{itemize}\n' },
        { input: '\\begin{enumerate}', expected: '\\begin{enumerate}\n\\end{enumerate}\n' }
      ];

      testCases.forEach(({ input, expected }) => {
        // Create a LaTeX note
        const latexNote = {
          id: 'test-latex-' + Math.random(),
          type: 'latex',
          content: input,
          absolutePath: '/tmp/test.tex',
          folderPath: '/tmp'
        };
        hooks.state.notes.set(latexNote.id, latexNote);
        hooks.state.activeNoteId = latexNote.id;
        hooks.state.editorPanes.right.noteId = latexNote.id;

        // Get the textarea
        const textarea = document.getElementById('note-editor-right');

        // Set up the textarea content
        textarea.value = input;
        textarea.selectionStart = textarea.value.length;
        textarea.selectionEnd = textarea.value.length;

        // Focus the textarea
        textarea.focus();

        // Directly call the LaTeX auto-completion function
        const result = hooks.handleLatexEnvironmentAutoComplete(textarea);

        // Check the result
        assert(result === true, 'Should return true for successful completion');
        assert.strictEqual(textarea.value, expected, `Should auto-complete ${input} correctly`);
      });

      done();
    } catch (e) {
      done(e);
    } finally {
      try { window.close(); } catch (e) {}
      delete global.window; delete global.document; delete global.localStorage; delete global.MutationObserver;
    }
  });

  it('should work for markdown files with LaTeX environments', function(done) {
    const window = makeWindow();
    global.window = window; global.document = window.document; global.localStorage = window.localStorage; global.MutationObserver = window.MutationObserver;
    const app = require(path.join(__dirname, '..', '..', 'src', 'renderer', 'app.js'));
    const hooks = app.__test__;
    if (hooks.initialize) hooks.initialize();
    // Ensure editorPanes is properly initialized
    hooks.state.editorPanes = hooks.state.editorPanes || {};
    hooks.state.editorPanes.left = hooks.state.editorPanes.left || { noteId: null };
    hooks.state.editorPanes.right = hooks.state.editorPanes.right || { noteId: null };

    try {
      // Create a Markdown note with LaTeX content
      const markdownNote = {
        id: 'test-markdown',
        type: 'markdown',
        content: '\\begin{figure}',
        absolutePath: '/tmp/test.md',
        folderPath: '/tmp'
      };
      hooks.state.notes.set(markdownNote.id, markdownNote);
      hooks.state.activeNoteId = markdownNote.id;
      hooks.state.editorPanes.right.noteId = markdownNote.id;

      // Get the textarea
      const textarea = document.getElementById('note-editor-right');
      assert(textarea, 'Textarea should exist');

      // Set up the textarea content
      textarea.value = '\\begin{figure}';
      textarea.selectionStart = textarea.value.length;
      textarea.selectionEnd = textarea.value.length;

      // Focus the textarea
      textarea.focus();

      // Directly call the LaTeX auto-completion function
      const result = hooks.handleLatexEnvironmentAutoComplete(textarea);

      // Check the result
      assert(result === true, 'Function should return true for successful completion in markdown files');
      assert(textarea.value.includes('\\end{figure}'), 'Should add closing environment tag');
      assert(textarea.value.includes('\\centering'), 'Should include centering');
      assert(textarea.value.includes('\\includegraphics{}'), 'Should include includegraphics');
      assert(textarea.value.includes('\\caption{}'), 'Should include caption');
      assert(textarea.value.includes('\\label{fig:}'), 'Should include label');

      done();
    } catch (e) {
      done(e);
    } finally {
      try { window.close(); } catch (e) {}
      delete global.window; delete global.document; delete global.localStorage; delete global.MutationObserver;
    }
  });
});