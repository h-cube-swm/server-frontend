import React, { useEffect, useRef } from "react";

export default function Chaos() {
  const ref = useRef(null);

  const width = document.getElementById("root").offsetWidth + "";
  const height = document.getElementById("root").offsetHeight + "";

  useEffect(() => {
    function getConvertFunction(cnv, scale) {
      const hWidth = cnv.width / 2;
      const hHeight = cnv.height / 2;
      const func = function toCnvPos2D(point) {
        if (!point) return;
        point = mul(point, scale);
        point[0] += hWidth;
        point[1] = hHeight - point[1];
        return point;
      };
      return func;
    }

    //Draw line from canvas
    function drawLine(ctx, a, b) {
      ctx.moveTo(a[0], a[1]);
      ctx.lineTo(b[0], b[1]);
    }

    //3D graph
    function getGraph3D(canvas, scale = 32) {
      const convertFunction = getConvertFunction(canvas, scale);
      return {
        //Vars
        cnv: canvas,
        ctx: canvas.getContext("2d"),
        scale: scale,
        lines: [],
        dots: [],
        strs: [],
        camera: [
          [1, 1, 1],
          [1, 1, 1],
        ],
        cvt: convertFunction,

        //Setter
        setCameraPos: function (pos) {
          this.camera[0] = pos;
        },
        setCameraDir: function (dir) {
          this.camera[1] = dir;
        },
        setScale: function (scale) {
          this.cvt = getConvertFunction(this.cnv, scale);
        },

        //Render
        project: function (points) {
          return project3(this.camera[0], this.camera[1], points).map((x) =>
            this.cvt(x)
          );
        },
        render: function () {
          this.ctx.beginPath();

          //Draw lines
          this.lines.forEach((line) => {
            let cvt = this.project(line);
            for (var i = 0; i < cvt.length - 1; i++) {
              if (cvt[i] && cvt[i + 1]) drawLine(this.ctx, cvt[i], cvt[i + 1]);
            }
          });

          //Draw dots
          this.project(this.dots).forEach((dot) => {
            if (!dot) return;
            this.ctx.moveTo(dot[0], dot[1]);
            this.ctx.arc(dot[0], dot[1], 200 / dot[2], 0, Math.PI * 2);
          });

          //Draw texts
          this.strs.forEach((str) => {
            var pos = this.project([str[0]])[0];
            if (!pos) return;
            if (str[2])
              this.ctx.font = Math.round(3000 / pos[2]) + 1 + "px Arial";
            this.ctx.fillText(str[1], pos[0], pos[1]);
          });
          this.ctx.stroke();
        },
        clear: function () {
          this.ctx.fillStyle = "#FFFFFF";
          this.ctx.fillRect(0, 0, this.cnv.width, this.cnv.height);
          this.ctx.fillStyle = "#000000";
          // this.ctx.stroke()
        },
      };
    }

    // Sum of two vector
    const add = (a, b) => a.map((x, i) => x + b[i]);
    // Sub of two vector
    const sub = (a, b) => a.map((x, i) => x - b[i]);
    // Constant times
    const mul = (x, c) => x.map((x) => x * c);
    // Constant divide
    const div = (x, c) => x.map((x) => x / c);
    // Dot product = Inner product
    const dot = (a, b) => a.reduce((p, c, i) => p + c * b[i], 0);
    // Cross product = Outer product
    const crs = (a, b) => [
      a[1] * b[2] - a[2] * b[1],
      a[2] * b[0] - a[0] * b[2],
      a[0] * b[1] - a[1] * b[0],
    ];
    // Elemental wise product
    const ewp = (a, b) => a.map((x, i) => x * b[i]);
    // Square of length
    const len2 = (x) => dot(x, x);
    // Legth of vector
    const len = (x) => Math.sqrt(len2(x));
    // Unit vector of given direction
    const unt = (x) => div(x, len(x));
    // Apply function to each element of given vector
    const fnc = (x, f) => x.map((x, i) => f(x, i));

    function basis3(z) {
      var z = unt(z);
      var x = unt(crs(z, [0, 0, 1]));
      var y = unt(crs(x, z));
      return {
        x: x,
        y: y,
        z: z,
      };
    }

    function project3(pos, dir, points) {
      let base = basis3(dir);
      return points.map((point) => {
        // Convert to pos-center space
        point = sub(point, pos);
        // When point is behind pos
        if (dot(point, dir) < 0) return;

        let point_ = mul(point, len2(dir) / dot(dir, point));
        var x = dot(point_, base.x);
        var y = dot(point_, base.y);
        var z = len(point);
        return [x, y, z];
      });
    }

    function getRenderer(particles, func) {
      return {
        particles: particles,
        traceCount: 1000,
        traceList: particles.map((x) => [x]),
        func: func,
        time: 0,
        add: function (particle) {
          this.particles.push(particle);
          this.traceList += [particle];
        },
        remove: function (index) {
          this.particles.splice(index, 1);
          this.traceList.splice(index, 1);
        },
        step: function () {
          this.time++;
          this.particles = this.particles.map((x, i) => {
            this.traceList[i].push(x);
            if (this.traceList[i].length > this.traceCount)
              this.traceList[i].shift();
            return this.func(x, this.time);
          });
        },
      };
    }

    var particles = [
      [0, 0.1, 0],
      [0, 0.1, 0.01],
      [0, 0.1, 0.02]
    ];

    var renderer = getRenderer(particles, (p) => {
      var x = p[0];
      var y = p[1];
      var z = p[2];

      var dx = 10 * (y - x);
      var dy = x * (28 - z) - y;
      var dz = x * y - (8 * z) / 3;
      return add(p, mul([dx, dy, dz], 0.01));
    });
    var graph = getGraph3D(ref.current);
    var t = 0;
    const intervalId = setInterval(() => {
      //Calculation
      renderer.step();

      //Rendering
      var s = 200;
      var d = 40;
      var camPos = [
        d * Math.sin((t * 0.9) / s),
        d * Math.cos((t * 1.1) / s),
        d / 2 + (Math.sin((t * 1.3) / s) * d) / 4,
      ];
      var camDir = mul(unt(add(mul(camPos, -1), [0, 0, 30])), 20);

      graph.clear();
      graph.setCameraPos(camPos);
      graph.setCameraDir(camDir);
      graph.lines = renderer.traceList;
      graph.render();

      //Increase time
      t++;
    }, 10);
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return (
    <div className="chaos">
      <canvas ref={ref} width={width} height={height} />
    </div>
  );
}
