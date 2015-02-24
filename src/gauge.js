var gauge = function(el, data,  options) {

    if (el.length) {
        for (var i; i<el.length; i++) {
            gauge.init(el[i]);
        }
        return;
    }

    var defaults = {
        aperture: 270
    };

    options = gauge.extend(defaults, options);

};
gauge.extend = function (target, source) {
    target = target || {};
    for (var prop in source) {
        if (typeof source[prop] === 'object') {
            target[prop] = yaPresentation.extend(target[prop], source[prop]);
        } else {
            target[prop] = source[prop];
        }
    }
    return target;
};
gauge.extend(gauge, {
    inherit: function(proto) {
        function F() {}
        F.prototype = proto;
        var object = new F;
        return object;
    },
    vendors: [
        "-webkit-",
        "-moz-",
        "-ms-",
        "-o-"
    ],
    element: {
        draw: function() {
            this.create();
            this.position();
        },
        create: gauge.abstractMethod,
        position: gauge.abstractMethod
    },
    draw: function(elements) {
      for (var i; i<elements.length; i++) {
          elements[i].draw();
      }
    },
    abstractMethod: function() {
        throw new Error("This method should be redefined");
    },
    Segment: function(index, total, className) {



    }
});
gauge.dot = gauge.inherit(gauge.element);
gauge.label = gauge.inherit(gauge.element);
gauge.arrow = gauge.inherit(gauge.element);
gauge.segment = gauge.inherit(gauge.element);
gauge.segment.draw = function() {
    var outerDiv = document.createElement("div");
    var innerDiv = document.createElement("div");
};
gauge.Dot.prototype = gauge.dot;
gauge.Label.prototype = gauge.label;
gauge.Arrow.prototype = gauge.arrow;
gauge.Segment.prototype = gauge.segment;
