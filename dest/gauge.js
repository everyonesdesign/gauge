var gauge = function (el, data, options) {

    if (!data) return;

    if (el.length) {
        for (var i=0; i < el.length; i++) {
            gauge.init(el[i]);
        }
        return;
    }

    var defaults = {
        aperture: 270
    };
    options = gauge.extend(defaults, options);

    function draw() {

        //clear el from children
        for (var l=0; l<el.children.length; l++) {
            el.removeChild(el.children[l]);
        }

        //add segments
        for (var j = 0; j < data.marks.length; j++) {
            var color = gauge.chooseColor(j / (data.marks.length - 1) * 100, data.colors);
            var segment = gauge.getSegment(j, data.marks.length, el.clientWidth, options.aperture, color);
            el.appendChild(segment);
        }

        //add labels
        for (var k = 0; k < data.marks.length; k++) {
            var label = gauge.getLabel(k, data.marks.length, el.clientWidth, options.aperture, data.marks[k]);
            el.appendChild(label);
        }

        //add arrow (and axis)
        var arrow = gauge.getArrow(data.level, el.clientWidth, options.aperture);
        el.appendChild(arrow);

        return {
            setData: function(newData) {
                gauge.extend(data, newData);
                draw();
            },
            setLevel: function(newIndex) {
                gauge.extend(data, {
                    level: newIndex
                });
                gauge.setArrowRotation(arrow, data.level, options.aperture);
            }
        }

    }

    return draw();

};

if (typeof jQuery != undefined) {
    $.fn.gauge = function(data, options) {
       gauge(this, data, options);
       return this;
    }
}

gauge.extend = function (target, source) {
    target = target || {};
    for (var prop in source) {
        if (typeof source[prop] === 'object') {
            target[prop] = gauge.extend(target[prop], source[prop]);
        } else {
            target[prop] = source[prop];
        }
    }
    return target;
};
gauge.vendors = [
    "-webkit-",
    "-moz-",
    "-ms-",
    "-o-",
    ""
];
gauge.extend(gauge, {
    chooseColor: function (progress, colors) {
        var color = "";
        for (var i = 0; i < colors.length; i++) {
            if (progress >= colors[i].threshold) {
                color = colors[i].value;
            }
        }
        return color;
    },
    getSegment: function (index, total, width, aperture, color) {

        var outerDiv = document.createElement("div");
        var innerDiv = document.createElement("div");
        var circle = document.createElement("div");
        circle.className = "gauge-circle";

        outerDiv.style.position = "absolute";
        outerDiv.style.top = 0;
        outerDiv.style.left = 0;
        outerDiv.style.overflow = "hidden";
        outerDiv.style.width = width + "px";
        outerDiv.style.height = width / 2 + "px";
        innerDiv.style.overflow = "hidden";
        innerDiv.style.width = width + "px";
        innerDiv.style.height = width / 2 + "px";
        circle.style.width = width + "px";
        circle.style.height = width + "px";

        var initialRotation = (360 - aperture) / 2;
        var sectionSize = (aperture / (total - 1));
        var outerRotation = 270 + initialRotation + sectionSize * index - sectionSize / 2;
        var innerRotation = 270 - (90 - sectionSize);

        if (!index) {
            outerRotation = outerRotation + sectionSize / 2;
        } else if (index == total - 1) {
            innerRotation = innerRotation - sectionSize / 2;
        }

        for (var i = 0; i < gauge.vendors.length; i++) {
            outerDiv.style[gauge.vendors[i] + "transform-origin"] = "50% 100%";
            innerDiv.style[gauge.vendors[i] + "transform-origin"] = "50% 100%";
            outerDiv.style[gauge.vendors[i] + "transform"] = "rotate(" + outerRotation + "deg)";
            innerDiv.style[gauge.vendors[i] + "transform"] = "rotate(" + innerRotation + "deg)";
            circle.style[gauge.vendors[i] + "border-radius"] = "50%";
            circle.style[gauge.vendors[i] + "box-sizing"] = "border-box";
        }

        if (color) {
            circle.style.borderColor = color;
        }

        outerDiv.appendChild(innerDiv);
        innerDiv.appendChild(circle);

        return outerDiv;

    },
    getLabel: function (index, total, width, aperture, text) {

        var label = document.createElement("div");
        label.className = "gauge-label";
        var labelText = document.createElement("div");
        labelText.className = "gauge-labelText";

        label.style.position = "absolute";
        label.style.top = width / 2 + "px";
        label.style.width = width / 2 + "px";
        label.style.height = "30px";
        label.style.lineHeight = "30px";
        label.style.marginTop = "-15px";
        label.style.right = "50%";
        labelText.style.display = "inline-block";

        var initialRotation = (360 - aperture) / 2;
        var percentage = index/(total-1);
        var sectionRotation = 270 + initialRotation + (aperture * percentage);

        for (var i = 0; i < gauge.vendors.length; i++) {
            label.style[gauge.vendors[i] + "transform-origin"] = "100% 50%";
            label.style[gauge.vendors[i] + "transform"] = "rotate(" + sectionRotation + "deg)";
            label.style[gauge.vendors[i] + "transform-origin"] = "100% 50%";
            labelText.style[gauge.vendors[i] + "transform"] = "rotate(-" + sectionRotation + "deg)";
        }

        labelText.innerHTML = text;

        label.appendChild(labelText);
        return label;

    },
    getArrow: function (percentage, width, aperture) {

        var axis = document.createElement("div");
        axis.className = "gauge-arrow";
        var arrow = document.createElement("div");

        axis.style.position = "absolute";
        axis.style.top = "50%";
        axis.style.left = "50%";
        axis.style.marginLeft = "-6px";
        axis.style.marginTop = "-6px";
        axis.style.width = "12px";
        axis.style.height = "12px";
        axis.style.background = "currentColor";
        arrow.style.position = "absolute";
        arrow.style.top = "50%";
        arrow.style.right = "100%";
        arrow.style.marginTop = "-4px";
        arrow.style.marginRight = "-6px";
        arrow.style.borderWidth = "4px " + width/2 + "px 4px 0";
        arrow.style.borderColor = "transparent currentColor transparent transparent";
        if (/Gecko.*Firefox/.test(navigator.userAgent)) {
            arrow.style.borderStyle = "dashed solid dashed dashed";
        } else {
            arrow.style.borderStyle = "solid";
        }
        for (var i = 0; i < gauge.vendors.length; i++) {
            axis.style[gauge.vendors[i] + "border-radius"] = "50%";
        }

        gauge.setArrowRotation(axis, percentage, aperture);

        axis.appendChild(arrow);
        return axis;

    },
    setArrowRotation: function(axis, percentage, aperture) {
        var initialRotation = (360 - aperture) / 2;
        var sectionRotation = 270 + initialRotation + (aperture * percentage);
        for (var i = 0; i < gauge.vendors.length; i++) {
            axis.style[gauge.vendors[i] + "transform"] = "rotate(" + sectionRotation + "deg)";
        }
    }
});
