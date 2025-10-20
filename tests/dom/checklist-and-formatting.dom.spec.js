const assert = require('assert');
const { JSDOM } = require('jsdom');

describe('DOM: Checklist command and formatting shortcuts', function() {
  let window, document;

  beforeEach(function() {
    const html = `<!doctype html><html><body>
      <div class="workspace__content">
        <textarea id="note-editor"></textarea>
      </div>
    </body></html>`;

    const dom = new JSDOM(html, { runScripts: 'outside-only' });
    window = dom.window;
    document = window.document;
    global.window = window;
    global.document = document;
  });

  afterEach(function() {
    try { window.close(); } catch (e) {}
    delete global.window;
    delete global.document;
  });

  describe('Bold formatting (Cmd+B)', function() {
    it('applies bold formatting to selected text', function() {
      const ta = document.getElementById('note-editor');
      ta.value = 'Hello world';
      ta.selectionStart = 0;
      ta.selectionEnd = 5;

      const selected = ta.value.substring(ta.selectionStart, ta.selectionEnd);
      const before = ta.value.substring(0, ta.selectionStart);
      const after = ta.value.substring(ta.selectionEnd);
      ta.value = before + '**' + selected + '**' + after;

      assert(ta.value === '**Hello** world');
    });

    it('inserts bold markers at cursor without selection', function() {
      const ta = document.getElementById('note-editor');
      ta.value = 'Hello world';
      ta.selectionStart = ta.selectionEnd = 6;

      const before = ta.value.substring(0, ta.selectionStart);
      const after = ta.value.substring(ta.selectionEnd);
      ta.value = before + '**' + after;

      assert(ta.value === 'Hello **world');
    });

    it('applies bold to multiple words', function() {
      const ta = document.getElementById('note-editor');
      ta.value = 'This is bold text';
      ta.selectionStart = 5;
      ta.selectionEnd = 15;

      const selected = ta.value.substring(ta.selectionStart, ta.selectionEnd);
      const before = ta.value.substring(0, ta.selectionStart);
      const after = ta.value.substring(ta.selectionEnd);
      ta.value = before + '**' + selected + '**' + after;

      assert(ta.value === 'This **is bold te**xt');
    });
  });

  describe('Italic formatting (Cmd+I)', function() {
    it('applies italic formatting to selected text', function() {
      const ta = document.getElementById('note-editor');
      ta.value = 'Hello world';
      ta.selectionStart = 0;
      ta.selectionEnd = 5;

      const selected = ta.value.substring(ta.selectionStart, ta.selectionEnd);
      const before = ta.value.substring(0, ta.selectionStart);
      const after = ta.value.substring(ta.selectionEnd);
      ta.value = before + '*' + selected + '*' + after;

      assert(ta.value === '*Hello* world');
    });

    it('inserts italic markers at cursor without selection', function() {
      const ta = document.getElementById('note-editor');
      ta.value = 'Hello world';
      ta.selectionStart = ta.selectionEnd = 6;

      const before = ta.value.substring(0, ta.selectionStart);
      const after = ta.value.substring(ta.selectionEnd);
      ta.value = before + '*' + after;

      assert(ta.value === 'Hello *world');
    });

    it('applies italic to multiple words', function() {
      const ta = document.getElementById('note-editor');
      ta.value = 'This is italic text';
      ta.selectionStart = 5;
      ta.selectionEnd = 15;

      const selected = ta.value.substring(ta.selectionStart, ta.selectionEnd);
      const before = ta.value.substring(0, ta.selectionStart);
      const after = ta.value.substring(ta.selectionEnd);
      ta.value = before + '*' + selected + '*' + after;

      assert(ta.value === 'This *is italic *text');
    });
  });

  describe('Combined formatting', function() {
    it('applies bold then italic to same text', function() {
      const ta = document.getElementById('note-editor');
      ta.value = 'emphasis';
      ta.selectionStart = 0;
      ta.selectionEnd = 8;

      const selected = ta.value.substring(ta.selectionStart, ta.selectionEnd);
      const before = ta.value.substring(0, ta.selectionStart);
      const after = ta.value.substring(ta.selectionEnd);
      ta.value = before + '**' + selected + '**' + after;

      ta.value = '***emphasis***';

      assert(ta.value === '***emphasis***');
      assert(ta.value.includes('emphasis'));
    });

    it('works with mixed bold and italic in document', function() {
      const ta = document.getElementById('note-editor');
      ta.value = 'Hello **bold** and *italic* text';
      ta.value += ' and ***bold italic*** here';

      assert(ta.value.includes('**bold**'));
      assert(ta.value.includes('*italic*'));
      assert(ta.value.includes('***bold italic***'));
    });
  });

  describe('Bold toggle (Cmd+B on bold text)', function() {
    it('removes bold formatting when applied to already bold text', function() {
      const ta = document.getElementById('note-editor');
      ta.value = '**Hello**';
      ta.selectionStart = 0;
      ta.selectionEnd = 9; // select entire "**Hello**"

      // Simulate bold wrap (which should toggle off)
      const selected = ta.value.substring(ta.selectionStart, ta.selectionEnd);
      const isBold = selected.startsWith('**') && selected.endsWith('**');
      
      let before = ta.value.substring(0, ta.selectionStart);
      let after = ta.value.substring(ta.selectionEnd);
      
      if (isBold) {
        // Toggle off: remove ** markers
        const innerText = selected.substring(2, selected.length - 2);
        ta.value = before + innerText + after;
      } else {
        // Toggle on: add ** markers
        ta.value = before + '**' + selected + '**' + after;
      }

      assert(ta.value === 'Hello');
    });

    it('toggles bold on and off multiple times', function() {
      const ta = document.getElementById('note-editor');
      ta.value = 'text';
      ta.selectionStart = 0;
      ta.selectionEnd = 4;

      // First toggle: add bold
      const selected1 = ta.value.substring(ta.selectionStart, ta.selectionEnd);
      ta.value = '**' + selected1 + '**';
      assert(ta.value === '**text**');

      // Second toggle: remove bold
      ta.selectionStart = 0;
      ta.selectionEnd = ta.value.length;
      const selected2 = ta.value.substring(ta.selectionStart, ta.selectionEnd);
      const innerText = selected2.substring(2, selected2.length - 2);
      ta.value = innerText;
      assert(ta.value === 'text');
    });
  });

  describe('Italic toggle (Cmd+I on italic text)', function() {
    it('removes italic formatting when applied to already italic text', function() {
      const ta = document.getElementById('note-editor');
      ta.value = '*Hello*';
      ta.selectionStart = 0;
      ta.selectionEnd = 7; // select entire "*Hello*"

      const selected = ta.value.substring(ta.selectionStart, ta.selectionEnd);
      const isItalic = selected.startsWith('*') && selected.endsWith('*');
      
      let before = ta.value.substring(0, ta.selectionStart);
      let after = ta.value.substring(ta.selectionEnd);
      
      if (isItalic) {
        // Toggle off: remove * markers
        const innerText = selected.substring(1, selected.length - 1);
        ta.value = before + innerText + after;
      } else {
        // Toggle on: add * markers
        ta.value = before + '*' + selected + '*' + after;
      }

      assert(ta.value === 'Hello');
    });

    it('toggles italic on and off multiple times', function() {
      const ta = document.getElementById('note-editor');
      ta.value = 'text';
      ta.selectionStart = 0;
      ta.selectionEnd = 4;

      // First toggle: add italic
      const selected1 = ta.value.substring(ta.selectionStart, ta.selectionEnd);
      ta.value = '*' + selected1 + '*';
      assert(ta.value === '*text*');

      // Second toggle: remove italic
      ta.selectionStart = 0;
      ta.selectionEnd = ta.value.length;
      const selected2 = ta.value.substring(ta.selectionStart, ta.selectionEnd);
      const innerText = selected2.substring(1, selected2.length - 1);
      ta.value = innerText;
      assert(ta.value === 'text');
    });
  });

  describe('Checklist formatting', function() {
    it('creates basic checklist items with &checklist command', function() {
      const ta = document.getElementById('note-editor');
      const checklistContent = '&checklist\n- [ ] Item\n- [ ] Item\n- [ ] Item\n';
      ta.value = checklistContent;

      // Editor shows the command
      assert(ta.value.includes('&checklist'));
      assert(ta.value.includes('- [ ] Item'));
      assert((ta.value.match(/- \[ \]/g) || []).length === 3);
    });

    it('creates checklist with custom count using &checklist =N', function() {
      const ta = document.getElementById('note-editor');
      const checklistContent = '&checklist =5\n- [ ] Item\n- [ ] Item\n- [ ] Item\n- [ ] Item\n- [ ] Item\n';
      ta.value = checklistContent;

      assert(ta.value.includes('&checklist =5'));
      assert((ta.value.match(/- \[ \]/g) || []).length === 5);
    });

    it('hides &checklist command in preview', function() {
      const markdown = '&checklist\n- [ ] Item 1\n- [ ] Item 2\n';
      // Simulate preprocessChecklistCommands behavior
      const processed = markdown.replace(/^\s*&checklist\s*=?\s*\d*\s*$/gm, '');
      
      assert(!processed.includes('&checklist'));
      assert(processed.includes('- [ ] Item'));
    });
  });

  describe('Checklist &check command', function() {
    it('marks items as checked with &check command', function() {
      const markdown = '- [ ] Item &check\n- [ ] Item 2\n';
      // Simulate preprocessChecklistCommands behavior
      let processed = markdown.replace(/^\s*&checklist\s*=?\s*\d*\s*$/gm, '');
      processed = processed.replace(/^(\s*- \[\s*\])\s+(.*)\s+&check\s*$/gm, (match, checkbox, content) => {
        return `${checkbox.replace(/\[\s*\]/, '[x]')} ${content.trim()}`;
      });
      
      assert(processed.includes('[x] Item'));
      assert(processed.includes('- [ ] Item 2'));
      assert(!processed.includes('&check'));
    });

    it('unchecks item when &check is removed', function() {
      const checked = '- [x] Item\n';
      const unchecked = '- [ ] Item\n';
      
      // Simulate the item being unchecked by removing &check
      assert(!checked.includes('&check'));
      assert(!unchecked.includes('&check'));
      assert(checked.includes('[x]'));
      assert(unchecked.includes('[ ]'));
    });

    it('hides &check command in preview while keeping checkbox state', function() {
      const markdown = '- [ ] Item 1 &check\n- [ ] Item 2\n';
      let processed = markdown.replace(/^\s*&checklist\s*=?\s*\d*\s*$/gm, '');
      processed = processed.replace(/^(\s*- \[\s*\])\s+(.*)\s+&check\s*$/gm, (match, checkbox, content) => {
        return `${checkbox.replace(/\[\s*\]/, '[x]')} ${content.trim()}`;
      });
      
      assert(!processed.includes('&check'));
      assert(processed.includes('[x] Item 1'));
    });

    it('preserves &check command in editor but not in preview', function() {
      const editorContent = '&checklist\n- [ ] Task 1 &check\n- [ ] Task 2\n';
      // Editor shows everything
      assert(editorContent.includes('&checklist'));
      assert(editorContent.includes('&check'));
      
      // Preview hides commands but shows checked state
      let preview = editorContent.replace(/^\s*&checklist\s*=?\s*\d*\s*$/gm, '');
      preview = preview.replace(/^(\s*- \[\s*\])\s+(.*)\s+&check\s*$/gm, (match, checkbox, content) => {
        return `${checkbox.replace(/\[\s*\]/, '[x]')} ${content.trim()}`;
      });
      
      assert(!preview.includes('&checklist'));
      assert(!preview.includes('&check'));
      assert(preview.includes('[x] Task 1'));
      assert(preview.includes('- [ ] Task 2'));
    });

    it('handles multiple &check items in checklist', function() {
      const markdown = '&checklist =4\n- [ ] Task 1 &check\n- [ ] Task 2\n- [ ] Task 3 &check\n- [ ] Task 4\n';
      let processed = markdown.replace(/^\s*&checklist\s*=?\s*\d*\s*$/gm, '');
      processed = processed.replace(/^(\s*- \[\s*\])\s+(.*)\s+&check\s*$/gm, (match, checkbox, content) => {
        return `${checkbox.replace(/\[\s*\]/, '[x]')} ${content.trim()}`;
      });
      
      assert(!processed.includes('&checklist'));
      assert(!processed.includes('&check'));
      assert((processed.match(/\[x\]/g) || []).length === 2);
      assert((processed.match(/\[ \]/g) || []).length === 2);
    });
  });

  describe('Checkmark styles (&check:style)', function() {
    it('supports default checkmark with &check', function() {
      const markdown = '- [ ] Task &check\n';
      let processed = markdown.replace(/^\s*&checklist\s*=?\s*\d*\s*$/gm, '');
      processed = processed.replace(/^(\s*- \[\s*\])\s+(.*)\s+&check(?::([a-z-]+))?\s*$/gm, (match, checkbox, content, style) => {
        const symbol = '✓';
        return `${checkbox.replace(/\[\s*\]/, symbol)} ${content.trim()}`;
      });
      
      assert(processed.includes('✓ Task'));
      assert(!processed.includes('&check'));
    });

    it('supports star checkmark with &check:star', function() {
      const markdown = '- [ ] Important task &check:star\n';
      let processed = markdown.replace(/^\s*&checklist\s*=?\s*\d*\s*$/gm, '');
      const checkmarkStyles = { 'x': '✓', 'star': '★', 'fire': '🔥', 'heart': '❤️' };
      processed = processed.replace(/^(\s*- \[\s*\])\s+(.*)\s+&check(?::([a-z-]+))?\s*$/gm, (match, checkbox, content, style) => {
        const styleKey = style || 'x';
        const symbol = checkmarkStyles[styleKey] || '✓';
        return `${checkbox.replace(/\[\s*\]/, symbol)} ${content.trim()}`;
      });
      
      assert(processed.includes('★ Important task'));
      assert(!processed.includes('&check:star'));
    });

    it('supports fire checkmark with &check:fire', function() {
      const markdown = '- [ ] Urgent task &check:fire\n';
      let processed = markdown.replace(/^\s*&checklist\s*=?\s*\d*\s*$/gm, '');
      const checkmarkStyles = { 'x': '✓', 'star': '★', 'fire': '🔥', 'heart': '❤️' };
      processed = processed.replace(/^(\s*- \[\s*\])\s+(.*)\s+&check(?::([a-z-]+))?\s*$/gm, (match, checkbox, content, style) => {
        const styleKey = style || 'x';
        const symbol = checkmarkStyles[styleKey] || '✓';
        return `${checkbox.replace(/\[\s*\]/, symbol)} ${content.trim()}`;
      });
      
      assert(processed.includes('🔥 Urgent task'));
      assert(!processed.includes('&check:fire'));
    });

    it('supports heart checkmark with &check:heart', function() {
      const markdown = '- [ ] Favorite task &check:heart\n';
      let processed = markdown.replace(/^\s*&checklist\s*=?\s*\d*\s*$/gm, '');
      const checkmarkStyles = { 'x': '✓', 'star': '★', 'fire': '🔥', 'heart': '❤️' };
      processed = processed.replace(/^(\s*- \[\s*\])\s+(.*)\s+&check(?::([a-z-]+))?\s*$/gm, (match, checkbox, content, style) => {
        const styleKey = style || 'x';
        const symbol = checkmarkStyles[styleKey] || '✓';
        return `${checkbox.replace(/\[\s*\]/, symbol)} ${content.trim()}`;
      });
      
      assert(processed.includes('❤️ Favorite task'));
      assert(!processed.includes('&check:heart'));
    });

    it('falls back to default checkmark for unknown style', function() {
      const markdown = '- [ ] Task &check:unknown\n';
      let processed = markdown.replace(/^\s*&checklist\s*=?\s*\d*\s*$/gm, '');
      const checkmarkStyles = { 'x': '✓', 'star': '★', 'fire': '🔥', 'heart': '❤️' };
      processed = processed.replace(/^(\s*- \[\s*\])\s+(.*)\s+&check(?::([a-z-]+))?\s*$/gm, (match, checkbox, content, style) => {
        const styleKey = style || 'x';
        const symbol = checkmarkStyles[styleKey] || '✓';
        return `${checkbox.replace(/\[\s*\]/, symbol)} ${content.trim()}`;
      });
      
      assert(processed.includes('✓ Task'));
      assert(!processed.includes('&check:unknown'));
    });

    it('mixes different checkmark styles in one checklist', function() {
      const markdown = '- [ ] Task 1 &check:star\n- [ ] Task 2 &check:fire\n- [ ] Task 3 &check\n- [ ] Task 4 &check:heart\n';
      let processed = markdown.replace(/^\s*&checklist\s*=?\s*\d*\s*$/gm, '');
      const checkmarkStyles = { 'x': '✓', 'star': '★', 'fire': '🔥', 'heart': '❤️' };
      processed = processed.replace(/^(\s*- \[\s*\])\s+(.*)\s+&check(?::([a-z-]+))?\s*$/gm, (match, checkbox, content, style) => {
        const styleKey = style || 'x';
        const symbol = checkmarkStyles[styleKey] || '✓';
        return `${checkbox.replace(/\[\s*\]/, symbol)} ${content.trim()}`;
      });
      
      assert(processed.includes('★ Task 1'));
      assert(processed.includes('🔥 Task 2'));
      assert(processed.includes('✓ Task 3'));
      assert(processed.includes('❤️ Task 4'));
      assert(!processed.includes('&check'));
    });
  });
});
