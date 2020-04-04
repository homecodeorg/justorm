module.exports = function set(obj, path, value) {
  const len = path.length;

  for (let i = 0; i < len - 1; i++) {
    const elem = path[i];
    if (!obj[elem] || typeof obj[elem] !== 'object') {
      obj[elem] = {};
    }
    obj = obj[elem];
  }

  obj[path[len - 1]] = value;
};
