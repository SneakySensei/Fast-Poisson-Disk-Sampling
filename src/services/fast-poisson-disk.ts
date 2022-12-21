interface Vector2D {
  x: number;
  y: number;
}

export function generatePoissonPointCloud({
  gridWidth,
  gridHeight,
  minRadius,
  iterations = 30,
}: {
  gridWidth: number;
  gridHeight: number;
  minRadius: number;
  iterations?: number;
}) {
  const grid: (Vector2D | undefined)[] = [];
  const active: Vector2D[] = [];

  const cellWidth = minRadius / Math.sqrt(2);
  const cols = Math.floor(gridWidth / cellWidth);
  const rows = Math.floor(gridHeight / cellWidth);

  for (let i = 0; i < cols * rows; i++) {
    grid.push(undefined);
  }

  let x = gridWidth / 2;
  let y = gridHeight / 2;
  let i = Math.floor(x / cellWidth);
  let j = Math.floor(y / cellWidth);
  let pos: Vector2D = { x, y };
  grid[i + j * cols] = pos;
  active.push(pos);

  while (active.length > 0) {
    const randIndex = Math.floor(Math.random() * active.length);
    const pos = active[randIndex];

    let found = false;
    for (let n = 0; n < iterations; n++) {
      // create random unit vector
      const angle = Math.random() * 2 * Math.PI;
      const sample = { x: Math.cos(angle), y: Math.sin(angle) };
      // scale it to be between minRadius and 2*minRadius
      const mag = Math.random() * minRadius + minRadius;
      sample.x *= mag;
      sample.y *= mag;
      // translate it to pos
      sample.x += pos.x;
      sample.y += pos.y;

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
              const d = Math.sqrt(
                (sample.x - neighbor.x) ** 2 + (sample.y - neighbor.y) ** 2
              );
              if (d < minRadius) {
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

  const res: Vector2D[] = [];
  grid.forEach((pos) => {
    if (pos) res.push(pos);
  });

  return res;
}
