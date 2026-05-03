// app.js - main logic for web PWA MVP
// Libraries used: html5-qrcode, qrcodejs, browser-image-compression, jsPDF, html2canvas

// --- Basic tab navigation
document.querySelectorAll('.tabs button').forEach(btn=>{
btn.addEventListener('click', ()=> {
document.querySelectorAll('.tabs button').forEach(b=>b.classList.remove('active'));
btn.classList.add('active');
const target = btn.getAttribute('data-tab');
document.querySelectorAll('.tabpane').forEach(t=>t.classList.remove('active'));
document.getElementById('tab-' + target).classList.add('active');
});
});

// images
for(let i=0;i<pdfImageFiles.length;i++){
const file = pdfImageFiles[i];
const imgData = await fileToDataUrl(file);
// fit into page
const img = new Image();
await new Promise(r => { img.onload = r; img.src = imgData

// ----- Image compression (browser-image-compression)
const compressInput = document.getElementById('compress-input');
const qualityRange = document.getElementById('quality-range');
const qualityLabel = document.getElementById('quality-label');
const btnCompress = document.getElementById('btn-compress');
const compressResults = document.getElementById('compress-results');
const btnDownloadAll = document.getElementById('btn-download-all');

let compressFiles = [];
let compressedBlobs = [];

qualityRange.addEventListener('input', ()=>{
qualityLabel.textContent = (qualityRange.value / 100).toFixed(2);
});

compressInput.addEventListener('change', (e)=>{
compressFiles = Array.from(e.target.files || []);
compressResults.innerHTML = <p>Selected ${compressFiles.length} files</p>;
compressedBlobs = [];
btnDownloadAll.disabled = true;
});

btnCompress.addEventListener('click', async ()=>{
if(!compressFiles.length) return alert('Choose images first.');
compressResults.innerHTML = '

Compressing…

';
compressedBlobs = [];
for(const file of compressFiles){
const options = { maxSizeMB: 1, maxWidthOrHeight: 1920, useWebWorker: true, initialQuality: qualityRange.value / 100 };
try {
const compressedFile = await imageCompression(file, options);
compressedBlobs.push(compressedFile);
} catch(e){
console.error('compress error', e);
}
}

// show previews and sizes
compressResults.innerHTML = '';
compressedBlobs.forEach((b, i)=>{
const url = URL.createObjectURL(b);
const orig = compressFiles[i];
const wrap = document.createElement('div');
wrap.innerHTML = <div><img src="${url}" /><p>Original: ${formatBytes(orig.size)} → Compressed: ${formatBytes(b.size)}</p> <a href="${url}" download="compressed-${i}.jpg">Download</a></div>;
compressResults.appendChild(wrap);
});
if(compressedBlobs.length) btnDownloadAll.disabled = false;
});

btnDownloadAll.addEventListener('click', ()=>{
compressedBlobs.forEach((b, i)=>{
const url = URL.createObjectURL(b);
const a = document.createElement('a');
a.href = url;
a.download = compressed-${i}.jpg;
a.click();
});
});

function formatBytes(bytes, decimals = 2) {
if (bytes === 0) return '0 B';
const k = 1024;
const dm = decimals < 0 ? 0 : decimals;
const sizes = ['B','KB','MB','GB','TB'];
const i = Math.floor(Math.log(bytes)/Math.log(k));
return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

// --- Service worker registration for PWA
if('serviceWorker' in navigator){
window.addEventListener('load', ()=> {
navigator.serviceWorker.register('service-worker.js').catch(err => console.warn('SW failed', err));
});
}
