const assert = require('assert');
const fs = require('fs').promises;
const path = require('path');

describe('Cmd+E export shortcut checkbox behavior', function() {
  it('handleGlobalShortcuts checks cmdEDirectExport setting for Cmd+E key', async function() {
    const appPath = path.join(__dirname, '..', '..', 'src', 'renderer', 'app.js');
    const src = await fs.readFile(appPath, 'utf8');

    // Check that handleGlobalShortcuts function exists
    assert(src.includes('const handleGlobalShortcuts = (event) => {'), 'handleGlobalShortcuts function should exist');

    // Check that it checks for Cmd+E
    assert(src.includes('} else if (key === \'e\') {'), 'handleGlobalShortcuts should check for key === \'e\'');

    // Check that it reads the cmdEDirectExport setting
    assert(src.includes('readStorage(storageKeys.cmdEDirectExport)'), 'handleGlobalShortcuts should read cmdEDirectExport setting');

    // Check that it has conditional logic for direct export vs dropdown
    assert(src.includes('if (directExportEnabled)'), 'handleGlobalShortcuts should have conditional logic based on directExportEnabled');
    assert(src.includes('handleExport'), 'handleGlobalShortcuts should call handleExport when direct export is enabled');
    assert(src.includes('exportButton.click'), 'handleGlobalShortcuts should click export button when direct export is disabled');
  });

  it('checkbox change event updates localStorage', async function() {
    const appPath = path.join(__dirname, '..', '..', 'src', 'renderer', 'app.js');
    const src = await fs.readFile(appPath, 'utf8');

    // Check that the checkbox has a change event listener
    assert(src.includes('cmdEDirectExportToggle.addEventListener(\'change\', (e) => {'), 'cmdEDirectExportToggle should have change event listener');

    // Check that it writes to storage
    assert(src.includes('writeStorage(storageKeys.cmdEDirectExport, e.target.checked)'), 'Change event should write checkbox value to storage');
  });

  it('settings initialization reads cmdEDirectExport from storage', async function() {
    const appPath = path.join(__dirname, '..', '..', 'src', 'renderer', 'app.js');
    const src = await fs.readFile(appPath, 'utf8');

    // Check that the code reads the cmdEDirectExport setting
    assert(src.includes('const cmdEDirect = readStorage(storageKeys.cmdEDirectExport);'), 'Code should read cmdEDirectExport setting');

    // Check that it sets the checkbox checked state
    assert(src.includes('elements.cmdEDirectExportToggle.checked = cmdEDirect === null ? true :'), 'Code should set checkbox checked state based on stored value');
  });
});