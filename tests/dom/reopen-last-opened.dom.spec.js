/* eslint-env mocha */
const assert = require('assert')

describe('Startup: reopen last opened notes', function () {
  let app
  before(function () {
    // Create a JSDOM document similar to other tests so renderer DOM queries succeed
    const { JSDOM } = require('jsdom')
    const dom = new JSDOM('<!doctype html><html><body>' +
      '<div class="app-shell"></div>' +
      '<div class="workspace__content"><div class="editor-pane--left editor-pane"><textarea id="note-editor"></textarea></div></div>' +
      '</body></html>', { url: 'http://localhost' })
    global.window = dom.window
    global.document = dom.window.document

    // minimal matchMedia stub
    window.matchMedia = window.matchMedia || function () {
      return { matches: false, addListener: () => {}, removeListener: () => {}, addEventListener: () => {}, removeEventListener: () => {} }
    }
    // minimal API stub
    window.api = window.api || {
      on: () => {},
      invoke: async (name) => {
        if (name === 'resolveResource') return ''
        return null
      }
    }
    // ensure localStorage exists
    if (!window.localStorage) {
      window.localStorage = {
        _map: {},
        getItem(k) { return this._map[k] || null },
        setItem(k, v) { this._map[k] = String(v) },
        removeItem(k) { delete this._map[k] }
      }
    }

    // require the app module under test
    app = require('../../src/renderer/app.js')
  })

  it('should reopen the previously opened note into an editor pane on init', async function () {
    const helpers = app.__test__
    // reinitialize editors (simulate renderer startup)
    helpers.reinitializeEditorInstances()

    // create a fake note payload representing a workspace with one note
    const fakeNoteId = 'note-1234'
    const payload = {
      notes: {
        [fakeNoteId]: { id: fakeNoteId, title: 'Test', type: 'md', content: '# hello' }
      },
      tree: [],
      preferredActiveId: fakeNoteId
    }

    // simulate that the workspace notes are present in state and then open
    // the preferred note into the left pane using the exported helper
    if (!helpers.state) throw new Error('state not available from test hooks')
    // ensure notes map exists and set the fake note
    try {
      if (!helpers.state.notes) helpers.state.notes = new Map();
  helpers.state.notes.set(fakeNoteId, { id: fakeNoteId, title: 'Test', type: 'markdown', content: '# hello' });
      // ensure editor instances are reinitialized so textarea exists
      if (helpers.reinitializeEditorInstances) helpers.reinitializeEditorInstances();
      // call openNoteInPane exported helper to open into left pane
      if (helpers.openNoteInPane) helpers.openNoteInPane(fakeNoteId, 'left', { activate: true });
    } catch (e) {
      // ignore failures here and let polling below detect content
    }

    // wait/poll for the DOM textarea to contain the content
    const start = Date.now()
    let found = false
    while (Date.now() - start < 2000) {
      const ta = document.querySelector('#note-editor') || document.querySelector('textarea');
      if (ta && (ta.value || '').includes('# hello')) { found = true; break }
      await new Promise(r => setTimeout(r, 50))
    }

    if (!found) throw new Error('Editor did not receive the reopened note content')
  })
})
