var P = require('preact');
var CORE = require('../');
var STORE = require('../store');

// helper for building ES5 components
function createClass(obj) {
  function C() {
    P.Component.apply(this, arguments);
    for (var i in obj) if (i!=='render' && typeof obj[i]==='function') this[i] = obj[i].bind(this);
    if (obj.init) obj.init.call(this);
  }
  C.prototype = new P.Component;
  for (var i in obj) C.prototype[i] = obj[i];
  C.prototype.constructor = C;
  return C;
}

module.exports.createStore = CORE.createStore;
module.exports.withStore = function withStore(config) {
  var entries = Object.entries(config);
  var store = entries.reduce(
    function (acc, s) {
      var name = s[0];
      return Object.assign(acc, { [name]: STORE[name] })
    },
    {}
  );

  return function(WrappedComponent) {
    return createClass({
      init: function() {
        this.state = { updated: null };
        entries.forEach(function (e) {
          var name = e[0];
          var fields = e[1];
          CORE.connect(name, fields, this.update);
        }.bind(this));
      },
      componentWillUnmount: function() {
        entries.forEach(function (e) {
          var name = e[0];
          var fields = e[1];
          CORE.disconnect(name, fields, this.update)
        }.bind(this));
      },
      update: function() {
        this.setState({ updated: Date.now() });
      },
      render: function(props) {
        return P.h(WrappedComponent, Object.assign(props, { store: store }));
      }
    });
  }
}
