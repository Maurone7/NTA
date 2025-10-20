# Video Support Test

This note demonstrates the new video support feature in the NoteTakingApp.

## How to Use Videos

You can embed videos using the same markdown syntax as images:

```markdown
![Video description](path/to/video.mp4)
![Another video](./videos/demo.webm "Video Title")
```

## Supported Video Formats

The app now supports the following video formats:
- MP4 (.mp4)
- WebM (.webm) 
- Ogg (.ogg, .ogv)
- AVI (.avi)
- MOV (.mov)
- WMV (.wmv)
- FLV (.flv)
- MKV (.mkv)
- M4V (.m4v)

## Features

- Videos are automatically detected based on file extension
- Video controls are included (play, pause, volume, etc.)
- Videos are responsive and scale with the preview
- Video files show with a 🎬 icon in the file explorer
- Videos are cached for better performance

## Example

If you had a video file called `demo.mp4` in your workspace, you could embed it like this:

```markdown
![My Demo Video](demo.mp4)
```

And it would render as a video player instead of trying to display it as an image.

## Notes

- Videos use the HTML5 `<video>` element with controls
- Videos are set to `preload="metadata"` for faster loading
- Videos have a fallback message for unsupported browsers
- The video will respect any width/height dimensions specified in the title (e.g., "Video Title 640x480")