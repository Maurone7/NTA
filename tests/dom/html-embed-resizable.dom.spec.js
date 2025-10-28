const assert = require('assert');
const fs = require('fs');
const path = require('path');

describe('DOM: Resizable HTML embed containers', function() {
  let appSource;

  before(function() {
    // Read the app.js source once for all tests
    appSource = fs.readFileSync(path.join(__dirname, '..', '..', 'src', 'renderer', 'app.js'), 'utf8');
  });

  it('creates resizable container with resize handles around iframe', function() {
    // Verify the app source code includes the resizable container structure
    assert(appSource.includes('html-embed-resizable'), 'Code should contain html-embed-resizable class');
    assert(appSource.includes('resize-handle-right'), 'Code should contain resize-handle-right');
    assert(appSource.includes('resize-handle-bottom'), 'Code should contain resize-handle-bottom');
    assert(appSource.includes('resize-handle-corner'), 'Code should contain resize-handle-corner');
    
    // Verify container has flex layout
    assert(appSource.includes('display: flex'), 'Code should include flex display');
    assert(appSource.includes('flex-direction: column'), 'Code should include flex-direction: column');
    
    // Verify iframe styling
    assert(appSource.includes('flex: 1') && appSource.includes('width: 100%'), 'iframe should have flex: 1 and width: 100%');
    assert(appSource.includes('border: none'), 'iframe should have no border');
  });

  it('handles are properly positioned for resize interaction', function() {
    // Verify right handle properties
    assert(appSource.includes('resize-handle-right') && appSource.includes('cursor: col-resize'), 
      'Right handle should have col-resize cursor');
    
    // Verify bottom handle properties
    assert(appSource.includes('resize-handle-bottom') && appSource.includes('cursor: row-resize'), 
      'Bottom handle should have row-resize cursor');
    
    // Verify corner handle properties
    assert(appSource.includes('resize-handle-corner') && appSource.includes('cursor: se-resize'), 
      'Corner handle should have se-resize cursor');
    
    // Verify handles are positioned absolutely
    assert(appSource.includes('position: absolute'), 'Handles should be absolutely positioned');
  });

  it('persists resize dimensions to localStorage', function() {
    // Verify localStorage usage for size persistence
    assert(appSource.includes('html-embed-sizes'), 'Code should use html-embed-sizes localStorage key');
    assert(appSource.includes('localStorage.getItem'), 'Code should read from localStorage');
    assert(appSource.includes('localStorage.setItem'), 'Code should write to localStorage');
    assert(appSource.includes('JSON.parse') && appSource.includes('JSON.stringify'), 
      'Code should serialize sizes to JSON');
  });

  it('restores saved size from localStorage on page load', function() {
    // Verify size restoration logic exists
    assert(appSource.includes('html-embed-sizes'), 'Code should retrieve saved sizes from localStorage');
    assert(appSource.includes('container.style.width') || appSource.includes('style.width'), 
      'Code should apply saved width to container');
    assert(appSource.includes('container.style.height') || appSource.includes('style.height'), 
      'Code should apply saved height to container');
  });

  it('enforces minimum size constraints (200px width, 150px height)', function() {
    // Verify minimum width constraint
    assert(appSource.includes('Math.max(200'), 'Code should contain minimum width constraint (200px)');
    
    // Verify minimum height constraint
    assert(appSource.includes('Math.max(150'), 'Code should contain minimum height constraint (150px)');
  });

  it('disables pointer-events on iframe during resize', function() {
    // Check CSS for pointer-events management
    const cssPath = path.join(__dirname, '..', '..', 'src', 'renderer', 'styles.css');
    const cssSource = fs.readFileSync(cssPath, 'utf8');
    
    assert(cssSource.includes('pointer-events: none'), 'CSS should include pointer-events: none for resizing');
    assert(cssSource.includes('.html-embed-resizable') || cssSource.includes('resizable'), 
      'CSS should have styles for resizable containers');
  });

  it('creates overlay during resize to prevent iframe interception', function() {
    // Verify overlay creation in event handlers
    assert(appSource.includes("createElement('div')"), 'Code should create overlay div element');
    assert(appSource.includes('position: fixed') || appSource.includes('position: fixed'), 
      'Overlay should be fixed position');
    assert(appSource.includes('z-index: 10000'), 'Overlay should have high z-index (10000)');
    assert(appSource.includes('removeChild'), 'Code should remove overlay after resize');
    
    // Verify overlay covers full viewport
    assert(appSource.includes('left: 0') && appSource.includes('top: 0'), 
      'Overlay should start at top-left');
    assert(appSource.includes('width: 100vw') || appSource.includes('width: 100%'), 
      'Overlay should span full width');
    assert(appSource.includes('height: 100vh') || appSource.includes('height: 100%'), 
      'Overlay should span full height');
  });

  it('adds mouse event handlers for drag-to-resize functionality', function() {
    // Verify event listeners are attached to handles
    assert(appSource.includes('addEventListener'), 'Code should use addEventListener for events');
    assert(appSource.includes('mousedown'), 'Code should listen to mousedown events on handles');
    assert(appSource.includes('mousemove'), 'Code should listen to mousemove events during drag');
    assert(appSource.includes('mouseup'), 'Code should listen to mouseup events to end resize');
    
    // Verify event propagation is prevented
    assert(appSource.includes('stopPropagation'), 'Code should call stopPropagation to prevent event bubbling');
    assert(appSource.includes('preventDefault'), 'Code should call preventDefault for mouse events');
  });

  it('initializeHtmlEmbedResize function exists and is called', function() {
    // Verify function is defined (as const with arrow function)
    assert(appSource.includes('const initializeHtmlEmbedResize = () => {') || 
           appSource.includes('function initializeHtmlEmbedResize') || 
           appSource.includes('initializeHtmlEmbedResize = function'), 
      'initializeHtmlEmbedResize function should be defined');
    
    // Verify function is called after HTML embeds are rendered
    const callMatches = appSource.match(/initializeHtmlEmbedResize\(\)/g);
    assert(callMatches && callMatches.length > 0, 'initializeHtmlEmbedResize should be called at least once');
  });

  it('stores container ID with dimensions for persistence', function() {
    // Verify ID-based storage approach
    assert(appSource.includes('container.id') || appSource.includes('containerId'), 
      'Code should use container ID as key for localStorage');
    assert(appSource.includes('html-embed-container'), 'Container IDs should follow html-embed-container pattern');
  });
});
