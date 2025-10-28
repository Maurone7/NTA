const path = require('path');

async function getAppVersion(appObj) {
  try {
    // Prefer app.getVersion when available
    if (appObj && typeof appObj.getVersion === 'function') {
      try {
        const v = appObj.getVersion();
        if (v) return v;
      } catch (e) { /* ignore and fallback */ }
    }

    // Next prefer npm injected env var (useful during `npm start`)
    try {
      if (process && process.env && process.env.npm_package_version) return process.env.npm_package_version;
    } catch (e) { /* ignore */ }

    // Finally try to read package.json near project root or next to main
    try {
      // project root
      const pj = require(path.join(__dirname, '..', '..', 'package.json'));
      if (pj && pj.version) return pj.version;
    } catch (e) {
      try {
        const pj = require(path.join(__dirname, '..', 'package.json'));
        if (pj && pj.version) return pj.version;
      } catch (err) { /* ignore */ }
    }
  } catch (e) {
    // swallow
  }
  return 'Unknown';
}

module.exports = { getAppVersion };
