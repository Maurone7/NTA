# HTML Script Support Demo

This note demonstrates the new HTML script capabilities in the note-taking app!

## 1. Embedded HTML File

You can embed an HTML file directly in your markdown by linking to it like an image:

![Interactive Demo](./demo.html)

The HTML file above contains interactive JavaScript that runs in a sandboxed iframe.

## 2. Inline HTML Code Blocks

You can also write HTML scripts directly in your markdown using code blocks:

```html
<!DOCTYPE html>
<html>
<head>
    <style>
        body { 
            font-family: Arial, sans-serif; 
            padding: 20px; 
            background: #f0f8ff;
            text-align: center;
        }
        .calculator {
            background: white;
            border-radius: 10px;
            padding: 20px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            display: inline-block;
        }
        input, button {
            margin: 5px;
            padding: 8px;
            font-size: 16px;
        }
        button {
            background: #007cba;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        }
        button:hover {
            background: #005a87;
        }
        #result {
            margin-top: 15px;
            font-size: 18px;
            font-weight: bold;
            color: #333;
        }
    </style>
</head>
<body>
    <div class="calculator">
        <h2>🧮 Simple Calculator</h2>
        <input type="number" id="num1" placeholder="First number">
        <input type="number" id="num2" placeholder="Second number">
        <br>
        <button onclick="calculate('add')">Add (+)</button>
        <button onclick="calculate('subtract')">Subtract (-)</button>
        <button onclick="calculate('multiply')">Multiply (×)</button>
        <button onclick="calculate('divide')">Divide (÷)</button>
        <div id="result">Result will appear here</div>
    </div>

    <script>
        function calculate(operation) {
            const num1 = parseFloat(document.getElementById('num1').value);
            const num2 = parseFloat(document.getElementById('num2').value);
            let result;
            
            if (isNaN(num1) || isNaN(num2)) {
                document.getElementById('result').textContent = 'Please enter valid numbers!';
                return;
            }
            
            switch(operation) {
                case 'add':
                    result = num1 + num2;
                    break;
                case 'subtract':
                    result = num1 - num2;
                    break;
                case 'multiply':
                    result = num1 * num2;
                    break;
                case 'divide':
                    if (num2 === 0) {
                        document.getElementById('result').textContent = 'Cannot divide by zero!';
                        return;
                    }
                    result = num1 / num2;
                    break;
            }
            
            document.getElementById('result').textContent = `Result: ${result}`;
        }
    </script>
</body>
</html>
```

## 3. Features

✅ **Secure Execution**: HTML scripts run in sandboxed iframes with controlled permissions
✅ **File Embedding**: Link to `.html` files using markdown image syntax
✅ **Inline Scripts**: Write HTML code directly in markdown using \`\`\`html code blocks
✅ **Interactive Content**: Full JavaScript support for dynamic, interactive demos
✅ **Memory Management**: Automatic cleanup of resources when switching notes

## 4. Use Cases

- **Tutorials**: Create interactive coding examples
- **Demos**: Embed working prototypes and demonstrations  
- **Tools**: Build small utilities like calculators, converters, etc.
- **Visualizations**: Create dynamic charts and interactive graphics
- **Learning**: Practice HTML/CSS/JavaScript within your notes

Happy scripting! 🚀