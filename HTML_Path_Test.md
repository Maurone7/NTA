# HTML Embedding Test

This note tests if HTML files are properly resolved from the workspace folder.

## Test 1: Embed the bouncing ball demo

![Bouncing Ball Demo](./bouncing-ball-demo.html)

If this works, you should see:
- ✅ The bouncing ball demo loads properly
- ✅ No ERR_FILE_NOT_FOUND errors in the console
- ✅ Interactive controls working
- ✅ Canvas animations running

## Test 2: Embed the simple demo

![Simple Demo](./demo.html)

This should show:
- ✅ Interactive button demo
- ✅ Counter functionality
- ✅ Color changing animation

## Expected Behavior

The HTML files should now:
1. **Resolve correctly** from the workspace folder (not the app's internal directory)
2. **Load in sandboxed iframes** with script execution enabled
3. **Show interactive content** with working JavaScript
4. **No console errors** about file not found

If both demos load properly, the HTML embedding path resolution is fixed! 🎉