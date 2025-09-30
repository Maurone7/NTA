# Auto-Sizing HTML Test

This note demonstrates the new auto-sizing functionality for HTML iframes.

## Test 1: Embedded HTML Files

The HTML files now automatically resize to fit their content:

![Bouncing Ball Demo](./bouncing-ball-demo.html)

![Simple Demo](./demo.html)

## Test 2: Inline HTML Code Block

This HTML block should also auto-size to fit its content:

```html
<!DOCTYPE html>
<html>
<head>
    <style>
        body { 
            font-family: Arial, sans-serif; 
            padding: 20px; 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            margin: 0;
        }
        .card {
            background: rgba(255,255,255,0.1);
            padding: 30px;
            border-radius: 15px;
            backdrop-filter: blur(10px);
            text-align: center;
            margin: 20px 0;
        }
        button {
            background: #4CAF50;
            color: white;
            border: none;
            padding: 15px 30px;
            border-radius: 25px;
            font-size: 16px;
            cursor: pointer;
            margin: 10px;
            transition: transform 0.2s;
        }
        button:hover {
            transform: scale(1.05);
        }
        .content {
            margin: 20px 0;
            min-height: 100px;
            background: rgba(255,255,255,0.1);
            border-radius: 10px;
            padding: 20px;
        }
    </style>
</head>
<body>
    <div class="card">
        <h2>🎨 Auto-Sizing Test Widget</h2>
        <p>This content should resize the iframe automatically!</p>
        <button onclick="addContent()">Add More Content</button>
        <button onclick="removeContent()">Remove Content</button>
    </div>
    
    <div id="dynamic-content" class="content">
        <p>Initial content. Click the buttons to see auto-resizing in action!</p>
    </div>

    <script>
        let contentCount = 1;
        
        function addContent() {
            contentCount++;
            const container = document.getElementById('dynamic-content');
            const newParagraph = document.createElement('p');
            newParagraph.textContent = `Dynamic content item #${contentCount} - The iframe should resize to fit this!`;
            newParagraph.style.background = 'rgba(255,255,255,0.1)';
            newParagraph.style.padding = '10px';
            newParagraph.style.margin = '10px 0';
            newParagraph.style.borderRadius = '5px';
            container.appendChild(newParagraph);
        }
        
        function removeContent() {
            const container = document.getElementById('dynamic-content');
            const paragraphs = container.querySelectorAll('p');
            if (paragraphs.length > 1) {
                container.removeChild(paragraphs[paragraphs.length - 1]);
                contentCount = Math.max(1, contentCount - 1);
            }
        }
    </script>
</body>
</html>
```

## Expected Behavior

All HTML content should now:
- ✅ **Start with minimum height** (200px)
- ✅ **Auto-expand** to fit actual content height
- ✅ **Respond to dynamic changes** (like adding/removing content)
- ✅ **Have smooth transitions** when resizing
- ✅ **Cap at maximum height** (800px to prevent extremely tall content)
- ✅ **Work for both embedded files and code blocks**

The iframes should now perfectly fit their content without wasted space or content cutoff! 🎉