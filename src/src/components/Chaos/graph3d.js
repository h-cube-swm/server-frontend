import { mul, project3 } from "./linalg";

function getConvertFunction(cnv, scale) {
  const hWidth = cnv.width / 2;
  const hHeight = cnv.height / 2;
  const func = function toCnvPos2D(point) {
    if (!point) return null;
    const scaledPoint = mul(point, scale);
    scaledPoint[0] += hWidth;
    scaledPoint[1] = hHeight - scaledPoint[1];
    return scaledPoint;
  };
  return func;
}

// Draw line from canvas
function drawLine(ctx, a, b) {
  ctx.moveTo(a[0], a[1]);
  ctx.lineTo(b[0], b[1]);
}

// 3D graph
export default class Graph3D {
  constructor(canvas, scale = 32) {
    const convertFunction = getConvertFunction(canvas, scale);

    // Vars
    this.cnv = canvas;
    this.ctx = canvas.getContext("2d");
    this.scale = scale;
    this.lines = [];
    this.dots = [];
    this.strs = [];
    this.camera = [
      [1, 1, 1],
      [1, 1, 1],
    ];
    this.cvt = convertFunction;
  }

  // Setter
  set cameraPos(pos) {
    this.camera[0] = pos;
  }

  set cameraDir(dir) {
    this.camera[1] = dir;
  }

  set scale(scale) {
    this.cvt = getConvertFunction(this.cnv, scale);
  }

  // Render
  project(points) {
    return project3(this.camera[0], this.camera[1], points).map((x) => this.cvt(x));
  }

  render() {
    this.ctx.beginPath();

    // Draw lines
    this.lines.forEach((line) => {
      const cvt = this.project(line);
      for (let i = 0; i < cvt.length - 1; i++) {
        if (cvt[i] && cvt[i + 1]) drawLine(this.ctx, cvt[i], cvt[i + 1]);
      }
    });

    // Draw dots
    this.project(this.dots).forEach((dot) => {
      if (!dot) return;
      this.ctx.moveTo(dot[0], dot[1]);
      this.ctx.arc(dot[0], dot[1], 200 / dot[2], 0, Math.PI * 2);
    });

    // Draw texts
    this.strs.forEach((str) => {
      const pos = this.project([str[0]])[0];
      if (!pos) return;
      if (str[2]) this.ctx.font = `${Math.round(3000 / pos[2]) + 1}px Arial`;
      this.ctx.fillText(str[1], pos[0], pos[1]);
    });
    this.ctx.stroke();
  }

  clear() {
    this.ctx.fillStyle = "#FFFFFF";
    this.ctx.fillRect(0, 0, this.cnv.width, this.cnv.height);
    this.ctx.fillStyle = "#000000";
    // this.ctx.stroke()
  }
}
