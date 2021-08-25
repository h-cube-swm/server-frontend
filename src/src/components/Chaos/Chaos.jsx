import React, { useEffect, useRef } from "react";
import Graph3D from "./graph3d";
import { add, mul, unt } from "./linalg";

export default function Chaos() {
  const ref = useRef(null);

  const width = `${document.getElementById("root").offsetWidth * 1.3}`;
  const height = `${document.getElementById("root").offsetHeight}`;

  class Renderer {
    constructor(particles, func) {
      this.particles = particles;
      this.traceCount = 1000;
      this.traceList = particles.map((x) => [x]);
      this.func = func;
      this.time = 0;
      this.func = func;
    }

    add(particle) {
      this.particles.push(particle);
      this.traceList += [particle];
    }

    remove(index) {
      this.particles.splice(index, 1);
      this.traceList.splice(index, 1);
    }

    step() {
      this.time++;
      this.particles = this.particles.map((x, i) => {
        this.traceList[i].push(x);
        if (this.traceList[i].length > this.traceCount) this.traceList[i].shift();
        return this.func(x, this.time);
      });
    }
  }

  useEffect(() => {
    const particles = [
      [0, 0.1, 0],
      [0, 0.1, 0.01],
      [0, 0.1, 0.02],
    ];

    const renderer = new Renderer(particles, (p) => {
      const [x, y, z] = p;

      const dx = 10 * (y - x);
      const dy = x * (28 - z) - y;
      const dz = x * y - (8 * z) / 3;
      return add(p, mul([dx, dy, dz], 0.01));
    });
    const graph = new Graph3D(ref.current);
    let t = 0;
    const intervalId = setInterval(() => {
      // Calculation
      renderer.step();

      // Rendering
      const s = 200;
      const d = 40;
      const camPos = [
        d * Math.sin((t * 0.9) / s),
        d * Math.cos((t * 1.1) / s),
        d / 2 + (Math.sin((t * 1.3) / s) * d) / 4,
      ];
      const camDir = mul(unt(add(mul(camPos, -1), [0, 0, 30])), 20);

      graph.clear();
      graph.cameraPos = camPos;
      graph.cameraDir = camDir;
      graph.lines = renderer.traceList;
      graph.render();

      // Increase time
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
