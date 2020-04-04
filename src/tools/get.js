module.exports = function get(obj, path) {
  var val = obj;

  for (var i = 0; i < path.length; i++) {
    val = val[path[i]];
    if (!val) return null
  }

  return val
};
