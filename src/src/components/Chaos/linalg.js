// Sum of two vector
export const add = (a, b) => a.map((x, i) => x + b[i]);
// Sub of two vector
export const sub = (a, b) => a.map((x, i) => x - b[i]);
// Constant times
export const mul = (x, c) => x.map((e) => e * c);
// Constant divide
export const div = (x, c) => x.map((e) => e / c);
// Dot product = Inner product
export const dot = (a, b) => a.reduce((p, c, i) => p + c * b[i], 0);
// Cross product = Outer product
export const crs = (a, b) => [
  a[1] * b[2] - a[2] * b[1],
  a[2] * b[0] - a[0] * b[2],
  a[0] * b[1] - a[1] * b[0],
];
// Square of length
export const len2 = (x) => dot(x, x);
// Legth of vector
export const len = (x) => Math.sqrt(len2(x));
// Unit vector of given direction
export const unt = (x) => div(x, len(x));

export function basis3(z) {
  const uz = unt(z);
  const x = unt(crs(uz, [0, 0, 1]));
  const y = unt(crs(x, uz));
  return {
    x,
    y,
    z: uz,
  };
}

export function project3(pos, dir, points) {
  const base = basis3(dir);
  return points.map((point) => {
    // Convert to pos-center space
    const displacement = sub(point, pos);
    // When point is behind pos
    if (dot(displacement, dir) < 0) return null;

    const projected = mul(displacement, len2(dir) / dot(dir, displacement));
    const x = dot(projected, base.x);
    const y = dot(projected, base.y);
    const z = len(displacement);
    return [x, y, z];
  });
}
