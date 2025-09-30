# Embedded HTML Auto-Resize Test

This tests auto-resizing for HTML files embedded in markdown (not opened directly).

## Test: Bouncing Ball Demo Embedded

![Bouncing Ball Demo](./bouncing-ball-demo.html)

## Expected Behavior

The iframe above should:
- ✅ **Start with adequate height** (600px minimum, then auto-adjust)
- ✅ **Show the complete bouncing ball interface** without cutoff
- ✅ **Auto-resize** to fit the content properly
- ✅ **Display console logs** showing resize attempts

## Check Browser Console

Open Developer Tools (F12) and look for:
- `Auto-resizing iframe: file://...` 
- `Iframe resized to: XXXpx Content height was: XXX`

The logs will show if the auto-resize is working correctly for embedded HTML.

## What Should Be Visible

You should see the complete bouncing ball demo:
- Full title and description
- Complete canvas area (no cutoff)
- All control buttons (Start, Pause, Reset, Add Ball)
- Ball counter and instructions
- No "Unable to load" warnings

If the complete interface is visible and properly sized, the embedded HTML auto-resize is working! 🎉