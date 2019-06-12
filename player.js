// This is not good code and you should not look at it.

const canvas = document.getElementById("rainbow");
const ctx = canvas.getContext("2d");

const startTime = new Date();

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener("resize", resizeCanvas);

function curveThroughPoints(points) {
  ctx.moveTo(points[0].x, points[0].y);

  let i;
  for (i = 1; i < points.length - 2; i++) {
    var centerX = (points[i].x + points[i + 1].x) / 2;
    var centerY = (points[i].y + points[i + 1].y) / 2;
    ctx.quadraticCurveTo(points[i].x, points[i].y, centerX, centerY);
  }

  ctx.quadraticCurveTo(
    points[i].x,
    points[i].y,
    points[i + 1].x,
    points[i + 1].y
  );
}

function wiggle(dir, color, wiggleWidth, waveOffset) {
  const vectorCoordinates = (dir, r) => [Math.cos(dir) * r, Math.sin(dir) * r];
  const wigglePoints = (start, end, waveFreq, waveAmp, waveOffset) => {
    const pointCount = 15;
    let points = [];
    for (let i = 0; i < pointCount; i++) {
      const outwardX = start.x + (end.x - start.x) * (i / (pointCount - 1));
      const outwardY = start.y + (end.y - start.y) * (i / (pointCount - 1));

      const [perpX, perpY] = vectorCoordinates(
        Math.atan2(end.y - start.y, end.x - start.x) + Math.PI / 2,
        waveAmp *
          (i / (pointCount - 1)) *
          Math.sin(
            ((i / (pointCount - 1) + waveOffset) % 1) * Math.PI * waveFreq
          )
      );

      const screenDiagonalRadius = Math.hypot(
        canvas.width / 2,
        canvas.height / 2
      );
      points.push({
        x: screenDiagonalRadius * 1.5 * (outwardX + perpX) + canvas.width / 2,
        y: screenDiagonalRadius * 1.5 * (outwardY + perpY) + canvas.height / 2
      });
    }

    return points;
  };

  ctx.fillStyle = color;
  ctx.beginPath();

  const freq = 6;
  const amp = 0.2;
  const wiggle1 = wigglePoints(
    { x: 0, y: 0 },
    { x: Math.cos(dir), y: Math.sin(dir) },
    freq,
    amp,
    waveOffset
  );
  const wiggle2 = wigglePoints(
    { x: 0, y: 0 },
    { x: Math.cos(dir + wiggleWidth), y: Math.sin(dir + wiggleWidth) },
    freq,
    amp,
    waveOffset
  );
  wiggle2.reverse();
  curveThroughPoints([...wiggle1, ...wiggle2]);
  ctx.fill();
}

function draw() {
  const time = new Date() - startTime;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const rainbow = [
    "#ff1112",
    "#ffa70e",
    "#ffff08",
    "#3fff0e",
    "#12acff",
    "#7645ff"
  ];
  const colors = [...rainbow, ...rainbow];
  const sectionWidth = (2 * Math.PI) / colors.length;
  for (let i = 0; i < colors.length; i++) {
    wiggle(
      time / 1000 + sectionWidth * i,
      colors[i],
      sectionWidth,
      time / 2000
    );
  }

  window.requestAnimationFrame(draw);
}

draw();

const audio = document.getElementById("audio");
audio.addEventListener("play", () => {
  canvas.classList.add("visible");
});
audio.addEventListener("pause", () => {
  canvas.classList.remove("visible");
});
audio.addEventListener("timeupdate", e => {
  console.log(audio.currentTime);
  canvas.style.opacity = audio.currentTime / 4;
});
