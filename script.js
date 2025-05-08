// ======= VARIABILI GLOBALI =======
const drawingArea = document.getElementById("drawingArea");
const svgCode = document.getElementById("svgCode");

let currentTool = "circle";
let fillColor = "#000000";
let strokeColor = "#000000";
let strokeWidth = 0;
let size = 60;

// ======= AGGIUNGI EVENTI AI TOOL =======
document.getElementById("toolCircle").addEventListener("click", () => setTool("circle"));
document.getElementById("toolRect").addEventListener("click", () => setTool("rect"));
document.getElementById("toolTriangle").addEventListener("click", () => setTool("triangle"));

document.getElementById("colorPicker").addEventListener("input", (e) => {
  fillColor = e.target.value;
  document.getElementById("fillIcon").style.backgroundColor = fillColor;
});

document.getElementById("strokeColor").addEventListener("input", (e) => {
  strokeColor = e.target.value;
  document.getElementById("strokeIcon").style.backgroundColor = strokeColor;
});

document.getElementById("strokeWidth").addEventListener("input", (e) => {
  strokeWidth = parseInt(e.target.value);
});

document.getElementById("sizePicker").addEventListener("input", (e) => {
  size = parseInt(e.target.value);
});

document.getElementById("clearCanvas").addEventListener("click", () => {
  drawingArea.innerHTML = "";
  svgCode.value = "";
});

// ======= FUNZIONE CAMBIO TOOL =======
function setTool(tool) {
  currentTool = tool;
  document.querySelectorAll(".tool-btn").forEach(btn => btn.classList.remove("active"));
  document.getElementById("tool" + capitalize(tool)).classList.add("active");
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// ======= DISEGNO FORME =======
drawingArea.addEventListener("click", (e) => {
  const pt = drawingArea.createSVGPoint();
  pt.x = e.clientX;
  pt.y = e.clientY;
  const svgP = pt.matrixTransform(drawingArea.getScreenCTM().inverse());

  let shape;
  if (currentTool === "circle") {
    shape = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    shape.setAttribute("cx", svgP.x);
    shape.setAttribute("cy", svgP.y);
    shape.setAttribute("r", size / 2);
  } else if (currentTool === "rect") {
    shape = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    shape.setAttribute("x", svgP.x - size / 2);
    shape.setAttribute("y", svgP.y - size / 2);
    shape.setAttribute("width", size);
    shape.setAttribute("height", size);
  } else if (currentTool === "triangle") {
    shape = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
    const x = svgP.x, y = svgP.y;
    const points = `${x},${y - size / 2} ${x - size / 2},${y + size / 2} ${x + size / 2},${y + size / 2}`;
    shape.setAttribute("points", points);
  }

  shape.setAttribute("fill", fillColor);
  shape.setAttribute("stroke", strokeColor);
  shape.setAttribute("stroke-width", strokeWidth);
  drawingArea.appendChild(shape);
  updateCode();
});

// ======= FUNZIONE AGGIORNA CODICE =======
function updateCode() {
  let code = `<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"600\" height=\"280\">\n`;
  drawingArea.childNodes.forEach(node => {
    code += "  " + node.outerHTML + "\n";
  });
  code += "</svg>";
  svgCode.value = code;
}

// ======= AGGIUNGI ASCOLTATORE PER MODIFICA MANUALE DEL CODICE =======
svgCode.addEventListener("input", function () {
  const code = this.value;
  const parser = new DOMParser();
  const svgDoc = parser.parseFromString(code, "image/svg+xml");
  const newSVG = svgDoc.documentElement;

  drawingArea.innerHTML = "";
  Array.from(newSVG.children).forEach(child => {
    drawingArea.appendChild(child);
  });
  updateCode();
});

// ======= CAMBIO SEZIONE (NAV) =======
document.querySelectorAll(".nav-link").forEach(link => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    document.querySelectorAll(".nav-link").forEach(l => l.classList.remove("active"));
    link.classList.add("active");

    document.querySelectorAll(".section").forEach(section => section.classList.remove("visible"));
    const target = document.querySelector(link.getAttribute("href"));
    if (target) {
      target.classList.add("visible");
    }
  });
});