import "./style.css";

import P5 from "p5";

const sketch = (p5: P5) => {
  let r = 8;
  const k = 30;
  let cols: number;
  let rows: number;

  let grid: (P5.Vector | undefined)[] = [];
  let active: P5.Vector[] = [];

  let cellWidth: number;

  const inputR = p5.createInput(r.toString(), "number");
  inputR.attribute("placeholder", "Radius in px");

  function resetSketch() {
    grid = [];
    active = [];
    r = Number(inputR.value());
    p5.setup();
  }
  p5.createButton("Recompute").mousePressed(resetSketch);

  p5.setup = function () {
    const canvas = p5.createCanvas(500, 500);
    canvas.parent("app");

    this.background(0);
    this.strokeWeight(2);

    // STEP 0
    cellWidth = r / Math.sqrt(2);
    cols = Math.floor(this.width / cellWidth);
    rows = Math.floor(this.height / cellWidth);
    for (let i = 0; i < cols * rows; i++) {
      grid[i] = undefined;
    }

    // STEP 1
    let x = this.width / 2;
    let y = this.height / 2;
    let i = Math.floor(x / cellWidth);
    let j = Math.floor(y / cellWidth);
    let pos = this.createVector(x, y);
    grid[i + j * cols] = pos;
    active.push(pos);
  };

  p5.draw = function () {
    this.background(0);

    for (let count = 0; count < 25; count++) {
      if (active.length > 0) {
        // choose a random sample from the list of active samples
        const randIndex = Math.floor(this.random(active.length));
        let pos = active[randIndex];
        let found = false;

        for (let n = 0; n < k; n++) {
          const sample = P5.Vector.random2D();
          const magnitude = this.random(r, 2 * r);
          sample.setMag(magnitude);
          sample.add(pos);

          const col = Math.floor(sample.x / cellWidth);
          const row = Math.floor(sample.y / cellWidth);

          if (
            col > -1 &&
            row > -1 &&
            col < cols &&
            row < rows &&
            !grid[col + row * cols]
          ) {
            let validSample = true;
            for (let i = -1; i <= 1; i++) {
              for (let j = -1; j <= 1; j++) {
                const index = col + i + (row + j) * cols;
                const neighbor = grid[index];
                if (neighbor) {
                  const d = P5.Vector.dist(sample, neighbor);
                  if (d < r) {
                    validSample = false;
                  }
                }
              }
            }

            if (validSample) {
              found = true;
              grid[col + row * cols] = sample;
              active.push(sample);
            }
          }
        }

        if (!found) {
          active.splice(randIndex, 1);
        }
      }
    }

    grid.forEach((pos) => {
      this.stroke(255);
      this.strokeWeight(2);
      if (pos) this.point(pos.x, pos.y);
    });

    active.forEach((sample) => {
      this.stroke(255, 0, 255);
      this.strokeWeight(2);
      this.point(sample.x, sample.y);
    });
  };
};

new P5(sketch);
