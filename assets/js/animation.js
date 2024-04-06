var canvas = document.getElementById("mycanvas");
var ctx = canvas.getContext("2d");
var w, h;
var lines = [];

var conf = {
  hue: 5,
  shadow: false,
  width: 1,
  length: 1,
  emitNum: 2,
  speed: 1,
  opacity: 0.6,
  maxLines: 300
};

var bgDots = [
  { rad: (w + h) / 2, x: w / 2, y: 0, hue: 0 },
  { rad: (w + h) / 2, x: 0, y: h, hue: -45 },
  { rad: (w + h) / 2, x: w, y: h, hue: -90 }
];

function emitLine() {
  if (conf.maxLines < lines.length) return;

  for (var i = 0; i < conf.emitNum; i++) {
    var rx = Math.random() * (w + 100);
    var ry = Math.random() * (h - 100);
    var length = (Math.random() * 180 + 80) * conf.length;
    var width = (Math.random() * 10 + 5) * conf.width;
    var v1 = (Math.random() * 2 + 2) * conf.speed;
    var v2 = (Math.random() * 0.5 + 0.5) * conf.speed;

    lines.push({ x1: rx, y1: ry, x2: rx, y2: ry, length, width, v1, v2, half: false, hue: Math.random() * 50 });
  }
}

function drawBackground() {
  ctx.globalCompositeOperation = "lighter";

  for (var i = 0; i < bgDots.length; i++) {
    var dot = bgDots[i];
    var hue = conf.hue + dot.hue;
    var grd = ctx.createRadialGradient(dot.x, dot.y, 0, dot.x, dot.y, dot.rad);
    grd.addColorStop(0, `hsla(${hue}, 100%, 60%, 0.3)`);
    grd.addColorStop(1, `hsla(${hue}, 100%, 50%, 0)`);

    ctx.beginPath();
    ctx.arc(dot.x, dot.y, dot.rad, 0, Math.PI * 2);
    ctx.fillStyle = grd;
    ctx.fill();
    ctx.closePath();
  }
}

function drawLines() {
  ctx.globalCompositeOperation = "lighter";

  for (var i = 0; i < lines.length; i++) {
    var line = lines[i];
    ctx.lineWidth = line.width;
    ctx.beginPath();
    ctx.moveTo(line.x1, line.y1);
    ctx.lineTo(line.x2, line.y2);
    ctx.strokeStyle = `hsla(${conf.hue - line.hue}, 100%, 50%, ${conf.opacity})`;
    ctx.lineCap = "round";
    ctx.stroke();
    ctx.closePath();

    if (!line.half) {
      line.x1 -= line.v1;
      line.y1 += line.v1;
      line.x2 -= line.v2;
      line.y2 += line.v2;

      if (dist(line.x1, line.y1, line.x2, line.y2) > line.length) {
        line.half = true;
      }
    } else {
      line.x1 -= line.v2;
      line.y1 += line.v2;
      line.x2 -= line.v1;
      line.y2 += line.v1;
    }
  }
}

function clear() {
  ctx.globalCompositeOperation = "source-over";
  ctx.clearRect(0, 0, w, h);
}

function checkLines() {
  emitLine();

  for (var i = lines.length - 1; i >= 0; i--) {
    var line = lines[i];
    if (line.half && dist(line.x1, line.y1, line.x2, line.y2) <= 10) {
      lines[i] = lines.pop();
    } else if (line.x1 < 0 && line.x2 < 0 && line.y1 > h && line.y2 > h) {
      lines[i] = lines.pop();
    }
  }
}

function dist(x1, y1, x2, y2) {
  return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
}

function resizeCanvas() {
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();

function render() {
  clear();
  drawBackground();
  drawLines();
  requestAnimationFrame(render);
}

render();