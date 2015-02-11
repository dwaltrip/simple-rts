
var TemplateManager = (function() {

  var uid = (function() {
    var _uid = 0;
    return function() {
      _uid++; return '' + _uid;
    };
  })();

  return function() {
    var self = this;

    this.templates = {
      unitDetails: {
        compile: Handlebars.compile([
          '<div class="unit-details">',
            '<div>Id: {{id}}</div>',
            '<div>Coords: {{prettyCoords}}</div>',
            '<div>Hitpoints: {{hitpoints}}</div>',
          '</div>'
          ].join('\n')),
        dependentKeys: ['x', 'y'],
        currentObservers: {}
      },
    };

    this.getTemplate = function(templateName) {
      return this.templates[templateName];
    };

    this.removeObserversForTemplate = function(templateName) {
      var template = this.getTemplate(templateName);
      _.each(template.currentObservers, function(observerDetails, observerId) {
        removeObserver(observerDetails.objContext, observerDetails.propName, observerId);
      });
      template.currentObservers = {};
    };

    this.render = function(templateName, parentElement, objContext) {
      var template = this.getTemplate(templateName);

      var $domContent = $(template.compile(objContext));

      // TODO: Don't think I actually need this stuff
      // if (objContext._uid) {
      //   $domContent.addClass('uid-' + objContext._uid);
      // }
      // var id = 'element-' + uid();
      // $domContent.attr('id', id);

      var $parent = $(parentElement);
      $parent.append($domContent);

      if (template.dependentKeys) {
        _.each(template.dependentKeys, function(propName) {

          // Should these var declarations be outside the each loop?
          // I think perhaps for each unit, x & y observer should use the same callback
          var $nextContent, observerId;
          function cb() {
            $nextContent = $(template.compile(objContext));
            $domContent.replaceWith($nextContent);
            $domContent = $nextContent;

            delete template.currentObservers[observerId];
            observerId = observePropOnce(objContext, propName, cb);
            template.currentObservers[observerId] = { objContext: objContext, propName: propName };
          };
          observerId = observePropOnce(objContext, propName, cb);
          template.currentObservers[observerId] = { objContext: objContext, propName: propName };
        });
      }
    };
  };
})();
