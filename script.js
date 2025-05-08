// Variabili globali
let drawingArea = document.getElementById('drawingArea');
const svgCode = document.getElementById('svgCode');
const errorBox = document.getElementById('errorBox');
const lineNumbers = document.getElementById('lineNumbers');

const toolButtons = document.querySelectorAll('.tool-btn');
const toolCircle = document.getElementById('toolCircle');
const toolRect = document.getElementById('toolRect');
const toolTriangle = document.getElementById('toolTriangle');
const colorPicker = document.getElementById('colorPicker');
const strokeColor = document.getElementById('strokeColor');
const strokeWidth = document.getElementById('strokeWidth');
const sizePicker = document.getElementById('sizePicker');
const clearCanvas = document.getElementById('clearCanvas');

let currentTool = 'circle';
let currentColor = '#000000';
let currentStroke = '#000000';
let currentStrokeWidth = 0;
let currentSize = 60;
let addedFirst = false;

// Attiva il bottone selezionato
function setActiveTool(buttonId) {
  toolButtons.forEach(btn => btn.classList.remove('active'));
  document.getElementById(buttonId).classList.add('active');
}

// Eventi toolbar
toolCircle.addEventListener('click', () => { currentTool = 'circle'; setActiveTool('toolCircle'); });
toolRect.addEventListener('click', () => { currentTool = 'rect'; setActiveTool('toolRect'); });
toolTriangle.addEventListener('click', () => { currentTool = 'triangle'; setActiveTool('toolTriangle'); });
colorPicker.addEventListener('input', e => currentColor = e.target.value);
strokeColor.addEventListener('input', e => currentStroke = e.target.value);
strokeWidth.addEventListener('input', e => currentStrokeWidth = parseInt(e.target.value));
sizePicker.addEventListener('input', e => currentSize = parseInt(e.target.value));
clearCanvas.addEventListener('click', () => {
  drawingArea.innerHTML = '';
  svgCode.value = '';
  lineNumbers.innerHTML = '1';
  addedFirst = false;
});

// Click su canvas
function attachCanvasEvents() {
  drawingArea.addEventListener('click', (e) => {
    const rect = drawingArea.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;

    let el;
    if (currentTool === 'circle') {
      el = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      el.setAttribute('cx', x.toFixed(1));
      el.setAttribute('cy', y.toFixed(1));
      el.setAttribute('r', (currentSize / 2).toFixed(1));
    } else if (currentTool === 'rect') {
      el = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      el.setAttribute('x', (x - currentSize / 2).toFixed(1));
      el.setAttribute('y', (y - currentSize / 2).toFixed(1));
      el.setAttribute('width', currentSize.toFixed(1));
      el.setAttribute('height', currentSize.toFixed(1));
    } else if (currentTool === 'triangle') {
      el = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
      const h = currentSize * Math.sqrt(3) / 2;
      const points = `${x},${(y - h / 2).toFixed(1)} ${
        (x - currentSize / 2).toFixed(1)
      },${(y + h / 2).toFixed(1)} ${
        (x + currentSize / 2).toFixed(1)
      },${(y + h / 2).toFixed(1)}`;
      el.setAttribute('points', points);
    }

    if (el) {
      el.setAttribute('fill', currentColor);
      el.setAttribute('stroke', currentStroke);
      el.setAttribute('stroke-width', currentStrokeWidth);
      drawingArea.appendChild(el);
      updateCode();
    }
  });
}
attachCanvasEvents();

function updateCode() {
  const elements = Array.from(drawingArea.children).map(el => {
    const clone = el.cloneNode(true);
    clone.removeAttribute('xmlns');
    return clone.outerHTML;
  });
  svgCode.value = `<svg xmlns="http://www.w3.org/2000/svg" width="${drawingArea.getAttribute('width')}" height="${drawingArea.getAttribute('height')}">\n  ${elements.join('\n  ')}\n</svg>`;
  errorBox.classList.remove('visible');
  updateLineNumbers();
}

function updateLineNumbers() {
  const lines = svgCode.value.split('\n').length;
  lineNumbers.innerHTML = Array.from({ length: lines }, (_, i) => i + 1).join('\n');
  svgCode.rows = lines;
}

// Input manuale codice SVG
svgCode.addEventListener('input', () => {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(svgCode.value, 'image/svg+xml');
    const newSvg = doc.querySelector('svg');

    if (newSvg) {
      const cloned = newSvg.cloneNode(true);
      cloned.setAttribute('id', 'drawingArea');
      drawingArea.replaceWith(cloned);
      drawingArea = document.getElementById('drawingArea');
      attachCanvasEvents();
      errorBox.classList.remove('visible');
    } else {
      throw new Error('Invalid SVG');
    }
  } catch (e) {
    errorBox.classList.add('visible');
  }
  updateLineNumbers();
});

// Scroll sincronizzato
svgCode.addEventListener('scroll', () => {
  lineNumbers.scrollTop = svgCode.scrollTop;
});
document.addEventListener('DOMContentLoaded', () => {
  const links = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('.section');

  links.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href').substring(1);
      const targetSection = document.getElementById(targetId);

      // Nasconde tutte le sezioni
      sections.forEach(section => section.classList.remove('visible'));

      // Mostra solo quella selezionata
      if (targetSection) {
        targetSection.classList.add('visible');
      }

      // Gestione stato "active" del menu
      links.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
    });
  });
});
