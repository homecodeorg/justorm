function get(obj, path) {
  var val = obj;

  for (var i = 0; i < path.length; i++) {
    val = val[path[i]];
    if (!val) return null
  }

  return val
};

function set(obj, path, value) {
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


module.exports = { get, set }
