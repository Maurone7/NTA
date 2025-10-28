# Comprehensive Media & HTML Test

This markdown file tests all supported media types and HTML features in the Note-Taking App.

## 1. Images Test

### Markdown Image Syntax
![Test Image](https://via.placeholder.com/300x200?text=Test+Image)

### Wikilink Image Syntax
![[test-image.png|Optional Alt Text]]

---

## 2. Videos Test

### Markdown Video Syntax
![Test Video](test-video.mp4)

### Inline Video Element
<video width="320" height="240" controls>
  <source src="test-video.mp4" type="video/mp4">
  Your browser does not support the video tag.
</video>

### Video with Styling
<div style="border: 2px solid #333; border-radius: 8px; overflow: hidden; margin: 20px 0;">
  <video width="100%" height="auto" controls style="display: block;">
    <source src="test-video.mp4" type="video/mp4">
    Your browser does not support the video tag.
  </video>
</div>

---

## 3. Inline HTML Elements Test

### Text Styling
<span style="color: blue; font-weight: bold;">Blue bold text</span> inline with normal text

### Colored Boxes
<div style="background: #e3f2fd; color: #1976d2; padding: 15px; border-radius: 5px; margin: 10px 0;">
  <strong>Info Box:</strong> This is styled with inline CSS
</div>

### Table Test
<table style="border-collapse: collapse; width: 100%; margin: 20px 0;">
  <thead>
    <tr style="background: #f5f5f5;">
      <th style="border: 1px solid #ddd; padding: 8px;">Header 1</th>
      <th style="border: 1px solid #ddd; padding: 8px;">Header 2</th>
      <th style="border: 1px solid #ddd; padding: 8px;">Header 3</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="border: 1px solid #ddd; padding: 8px;">Data 1</td>
      <td style="border: 1px solid #ddd; padding: 8px;">Data 2</td>
      <td style="border: 1px solid #ddd; padding: 8px;">Data 3</td>
    </tr>
    <tr style="background: #fafafa;">
      <td style="border: 1px solid #ddd; padding: 8px;">Data 4</td>
      <td style="border: 1px solid #ddd; padding: 8px;">Data 5</td>
      <td style="border: 1px solid #ddd; padding: 8px;">Data 6</td>
    </tr>
  </tbody>
</table>

---

## 4. HTML Forms Test

### Basic Form
<form style="background: #fff3e0; padding: 20px; border-radius: 5px; margin: 20px 0;">
  <div style="margin-bottom: 15px;">
    <label for="name" style="display: block; margin-bottom: 5px; font-weight: bold;">Name:</label>
    <input type="text" id="name" name="name" placeholder="Enter your name" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 3px;">
  </div>
  
  <div style="margin-bottom: 15px;">
    <label for="email" style="display: block; margin-bottom: 5px; font-weight: bold;">Email:</label>
    <input type="email" id="email" name="email" placeholder="Enter your email" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 3px;">
  </div>
  
  <div style="margin-bottom: 15px;">
    <label for="message" style="display: block; margin-bottom: 5px; font-weight: bold;">Message:</label>
    <textarea id="message" name="message" placeholder="Enter your message" rows="4" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 3px;"></textarea>
  </div>
  
  <button type="submit" style="background: #ff9800; color: white; padding: 10px 20px; border: none; border-radius: 3px; cursor: pointer; font-weight: bold;">Submit</button>
</form>

---

## 5. Interactive Elements Test

### Buttons with Click Handlers
<div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; margin: 20px 0;">
  <button onclick="alert('Button 1 clicked!')" style="padding: 10px; background: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer;">Click 1</button>
  <button onclick="alert('Button 2 clicked!')" style="padding: 10px; background: #2196F3; color: white; border: none; border-radius: 4px; cursor: pointer;">Click 2</button>
  <button onclick="alert('Button 3 clicked!')" style="padding: 10px; background: #f44336; color: white; border: none; border-radius: 4px; cursor: pointer;">Click 3</button>
</div>

### Clickable Div
<div onclick="alert('Div clicked!')" style="background: #e91e63; color: white; padding: 20px; border-radius: 5px; cursor: pointer; text-align: center; font-weight: bold;">
  Click me!
</div>

---

## 6. Layout & CSS Test

### Grid Layout
<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 20px 0;">
  <div style="background: #ff9800; padding: 20px; border-radius: 5px; color: white;">Column 1</div>
  <div style="background: #2196F3; padding: 20px; border-radius: 5px; color: white;">Column 2</div>
</div>

### Flexbox Layout
<div style="display: flex; gap: 10px; justify-content: space-around; margin: 20px 0;">
  <div style="background: #4CAF50; color: white; padding: 15px; border-radius: 4px; flex: 1;">Flex 1</div>
  <div style="background: #2196F3; color: white; padding: 15px; border-radius: 4px; flex: 1;">Flex 2</div>
  <div style="background: #ff9800; color: white; padding: 15px; border-radius: 4px; flex: 1;">Flex 3</div>
</div>

---

## 7. PDF Embedding Test

### Wikilink PDF
![[sample.pdf|Click to view PDF]]

### Markdown Image PDF Syntax
![PDF Document](sample.pdf "800x600")

---

## 8. Nested HTML Test

### Complex Structure
<div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px; margin: 20px 0;">
  <h3 style="margin-top: 0;">Complex Nested Structure</h3>
  
  <div style="background: rgba(255, 255, 255, 0.1); padding: 15px; border-radius: 5px; margin: 15px 0;">
    <strong>Section 1:</strong> Nested content with styling
  </div>
  
  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
    <div style="background: rgba(255, 255, 255, 0.15); padding: 10px; border-radius: 3px;">Item 1</div>
    <div style="background: rgba(255, 255, 255, 0.15); padding: 10px; border-radius: 3px;">Item 2</div>
  </div>
  
  <button onclick="alert('Works!')" style="margin-top: 15px; background: white; color: #667eea; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer; font-weight: bold;">Test Button</button>
</div>

---

## Test Checklist

When viewing this file in the preview, verify the following:

- [ ] **Images**: Images load and display correctly
- [ ] **Videos**: Videos show play controls and can be played
- [ ] **Inline HTML**: Colored boxes and spans render with styles
- [ ] **Tables**: Table displays with borders and styling
- [ ] **Forms**: Form inputs are visible and clickable
- [ ] **Buttons**: Buttons are clickable and onclick handlers work
- [ ] **Layouts**: Grid and flexbox layouts display correctly
- [ ] **PDFs**: PDF embeds show as iframes
- [ ] **Nested HTML**: Complex nested structures render properly
- [ ] **Colors & Styles**: CSS colors, gradients, and layouts apply

### If Any Test Fails

1. **HTML shows as raw text**: DOMPurify configuration issue
2. **Videos don't load**: Missing `video` or `source` tag in whitelist
3. **Buttons don't work**: Missing `onclick` attribute or event handler issue
4. **Styling missing**: Missing `style` or `class` attribute in whitelist
5. **Forms not working**: Missing form element tags or attributes

---

*This comprehensive test file helps diagnose which features are working and which need fixes.*
