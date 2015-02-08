
var PropertyWatcher = (function() {

  return function() {
    this.objects = {};
    this.observerByUid = {};
    this.observersByPropPath = {};
    var self = this;

    this.generateUid = (function() {
      var _uid = 0;
      return function() {
        _uid++; return '' + _uid;
      };
    })();

    // TODO: this doesn't do anything currently?
    this.register = function(obj, propNames) {
      if (!obj._uid) {
        obj._uid = this.generateUid();
      }

      this.objects[obj._uid] = obj;
    };

    this.propDidChange = function(obj, propName) {
      _.each(this.getObservers(obj, propName), function(cb, i) {
        cb();
      });
    };

    this.getObservers = function(obj, propName) {
      var propPath = [obj._uid, propName].join('.');
      return this.observersByPropPath[propPath] || {};
    };

    this.removeObserver = function(obj, propName, uid) {
      var propPath = [obj._uid, propName].join('.');
      delete this.observersByPropPath[propPath][uid];

      if (Object.keys(this.observersByPropPath[propPath]).length === 0) {
        delete this.observersByPropPath[propPath];
      }
    };

    this.listAllObservers = function() {
      return _.reduce(this.observersByPropPath, function(observerList, observers, propPath) {
        observerList.push(propPath + ': ' + Object.keys(observers).join(', '));
        return observerList;
      }, []);
    };

    this.addOneTimeObserver = function(uid, obj, propName, cb) {
      var propertyPath = [obj._uid, propName].join('.');

      var wrappedCb = function() {
        delete self.observersByPropPath[propertyPath][uid];
        cb();
        //console.log('-- listAllObservers --', self.listAllObservers().join(' -- '));
      }

      var observersForPropPath = this.observersByPropPath[propertyPath];

      if (!observersForPropPath) {
        observersForPropPath = this.observersByPropPath[propertyPath] = {};
      }

      observersForPropPath[uid] = wrappedCb;
      //console.log('-- listAllObservers --', this.listAllObservers().join(' -- '));
    };
  };
})();


// PropertyWatcher singleton
var propertyWatcher = new PropertyWatcher();

// ----------
// PUBLIC API
// ----------

function observePropOnce(obj, propName, cb) {
  var uid = propertyWatcher.generateUid();
  propertyWatcher.addOneTimeObserver(uid, obj, propName, cb);
  return uid;
};

function removeObserver(obj, propName, uid) {
  propertyWatcher.removeObserver(obj, propName, uid);
}

// TODO: not fully implemented, haven't used this yet
function observeProp() {
  var args = Array.prototype.slice.call(arguments);
  var obj = args.slice(0,1); // first argument
  var propNames = args.slice(1, -1); // everything except first and last arg
  var cb = args.slice(-1); // last argument

  propertyWatcher.addObserver(obj, propName, cb)
};

function buildProperty(obj, propName) {
  var _propName = '_' + propName;
  var prop = {
    get: function() {
      return this[_propName];
    },
    set: function(val) {
      if (this[_propName] !== val) {
        propertyWatcher.propDidChange(this, propName);
      }
      this[_propName] = val;
    },
  };
  Object.defineProperty(obj, propName, prop);

  propertyWatcher.register(obj, [propName]);
}
