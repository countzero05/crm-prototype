export const dot2num = dot => {
  let d = dot.split(".");
  return ((((((+d[0]) * 256) + (+d[1])) * 256) + (+d[2])) * 256) + (+d[3]);
};

export const num2dot = num => {
  let d = num % 256;
  for (let i = 3; i > 0; i--) {
    num = Math.floor(num / 256);
    d = num % 256 + "." + d;
  }
  return d;
};

