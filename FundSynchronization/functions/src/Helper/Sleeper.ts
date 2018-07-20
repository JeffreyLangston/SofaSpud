export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function sleeper(ms) {
  return function (x) {
    return new Promise(resolve => setTimeout(() => resolve(x), ms));
  };
}
