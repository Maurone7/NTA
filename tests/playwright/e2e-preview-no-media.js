const { _electron: electron } = require('playwright');
const path = require('path');
const fs = require('fs');

(async () => {
  console.log('Launching Electron app for preview-no-media test...');
  const app = await electron.launch({ args: ['.'] });
  const window = await app.firstWindow();
  await window.waitForLoadState('domcontentloaded');
  await window.waitForTimeout(400);

  const imgPath = path.join(process.cwd(), 'assets', 'NTA logo.png');
  const pdfPath = path.join(process.cwd(), 'test-folder', 'test-figure.pdf');
  if (!fs.existsSync(imgPath) || !fs.existsSync(pdfPath)) {
    console.error('Test assets missing', { imgPathExists: fs.existsSync(imgPath), pdfPathExists: fs.existsSync(pdfPath) });
    await app.close();
    process.exit(3);
  }

  // Helper to inspect central preview state
  const checkPreview = async () => await window.evaluate(() => {
    const img = document.getElementById('image-viewer-img');
    const pdf = document.getElementById('pdf-viewer');
    return {
      imageViewer_dataset_rawSrc: img ? (img.dataset ? (img.dataset.rawSrc || '') : '') : null,
      imageViewer_src_attr: img ? img.getAttribute('src') : null,
      pdf_viewer_src: pdf ? pdf.getAttribute('src') : null,
      pdf_viewer_visible: pdf ? pdf.classList.contains('visible') : false
    };
  });

  // Drop image into left pane
  const dropImage = await window.evaluate(async ({ filePath, fileName }) => {
    const paneEl = document.querySelector('.editor-pane--left') || document.querySelector('.editor-pane');
    if (!paneEl) return { ok: false, error: 'no-left' };
    const fakeDataTransfer = { files: [ { name: fileName, path: filePath } ] };
    const ev = new Event('drop', { bubbles: true, cancelable: true });
    try { ev.dataTransfer = fakeDataTransfer; } catch(e) { ev._dataTransfer = fakeDataTransfer; }
    paneEl.dispatchEvent(ev);
    return { ok: true };
  }, { filePath: imgPath, fileName: path.basename(imgPath) });

  if (!dropImage.ok) { console.error('Image drop failed', dropImage); await app.close(); process.exit(2); }
  // allow short time for any preview attempt
  await window.waitForTimeout(300);

  // Sanity check: per-pane image viewer should be present in the left pane
  let paneImagePresent = false;
  try {
    await window.waitForSelector('.editor-pane--left .pane-image-viewer', { timeout: 3000 });
    paneImagePresent = true;
  } catch (e) {
    paneImagePresent = false;
  }

  const afterImage = await checkPreview();
  console.log('after image drop preview state:', afterImage);

  // Expectations after image drop: central preview should NOT have loaded image
  const imageOk = (afterImage.imageViewer_dataset_rawSrc === '' || afterImage.imageViewer_dataset_rawSrc === null) && (!afterImage.imageViewer_src_attr || afterImage.imageViewer_src_attr === '');
  const pdfOk1 = (!afterImage.pdf_viewer_src || afterImage.pdf_viewer_src === '') && !afterImage.pdf_viewer_visible;

  if (!imageOk || !pdfOk1 || !paneImagePresent) {
    console.error('Preview loaded media unexpectedly after image drop or pane viewer missing', { imageOk, pdfOk1, paneImagePresent });
    await app.close();
    process.exit(2);
  }

  // Drop PDF into left pane
  const dropPdf = await window.evaluate(async ({ filePath, fileName }) => {
    const paneEl = document.querySelector('.editor-pane--left') || document.querySelector('.editor-pane');
    if (!paneEl) return { ok: false, error: 'no-left' };
    const fakeDataTransfer = { files: [ { name: fileName, path: filePath } ] };
    const ev = new Event('drop', { bubbles: true, cancelable: true });
    try { ev.dataTransfer = fakeDataTransfer; } catch(e) { ev._dataTransfer = fakeDataTransfer; }
    paneEl.dispatchEvent(ev);
    return { ok: true };
  }, { filePath: pdfPath, fileName: path.basename(pdfPath) });

  if (!dropPdf.ok) { console.error('PDF drop failed', dropPdf); await app.close(); process.exit(2); }
  await window.waitForTimeout(500);
  // Sanity check: per-pane PDF viewer should be present in the left pane
  let panePdfPresent = false;
  try {
    await window.waitForSelector('.editor-pane--left .pdf-pane-viewer', { timeout: 3000 });
    panePdfPresent = true;
  } catch (e) {
    panePdfPresent = false;
  }

  const afterPdf = await checkPreview();
  console.log('after pdf drop preview state:', afterPdf);

  const pdfOk = (!afterPdf.pdf_viewer_src || afterPdf.pdf_viewer_src === '') && !afterPdf.pdf_viewer_visible;
  const imageOk2 = (afterPdf.imageViewer_dataset_rawSrc === '' || afterPdf.imageViewer_dataset_rawSrc === null) && (!afterPdf.imageViewer_src_attr || afterPdf.imageViewer_src_attr === '');

  if (!pdfOk || !imageOk2) {
    console.error('Preview loaded media unexpectedly after pdf drop or pane viewer missing', { pdfOk, imageOk2, panePdfPresent });
    await app.close();
    process.exit(2);
  }

  console.log('Preview did not load images or PDFs. Test passed.');
  await app.close();
  process.exit(0);
})();
