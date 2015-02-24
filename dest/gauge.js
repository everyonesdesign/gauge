var gauge = function(el, data, options) {

    if (!data) return;

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

    var segmentsLength = data.marks.length-1;

    //init segments
    for (var j=0; j<segmentsLength; j++) {
        var color = gauge.chooseColor(j/(segmentsLength-1)*100, data.colors);
        var segment = gauge.getSegment(j, segmentsLength, el.clientWidth, options.aperture, color);
        el.appendChild(segment);
    }

    //init labels
    for (var k=0; k<data.marks.length; k++) {
        var label = gauge.getLabel(k, data.marks.length, el.clientWidth, options.aperture, data.marks[k]);
        el.appendChild(label);
    }

};
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
    chooseColor: function(progress, colors) {
        var color = "";
        for (var i=0; i<colors.length; i++) {
            if (progress >= colors[i].threshold) {
                color = colors[i].value;
            }
        }
        return color;
    },
    getSegment: function(index, total, width, apertura, color) {

        var outerDiv = document.createElement("div");
        var innerDiv = document.createElement("div");
        var circle = document.createElement("div");
        circle.className = "gauge-circle";

        outerDiv.style.position = "absolute";
        outerDiv.style.top = 0;
        outerDiv.style.left = 0;
        outerDiv.style.overflow = "hidden";
        innerDiv.style.overflow = "hidden";
        outerDiv.style.width = width + "px";
        innerDiv.style.width = width + "px";
        circle.style.width = width + "px";
        outerDiv.style.height = width/2 + "px";
        innerDiv.style.height = width/2 + "px";
        circle.style.height = width + "px";

        var initialRotation = (360-apertura)/2;
        var sectionSize = (apertura/(total-1));
        var outerRotation = 270 + initialRotation + sectionSize*index - sectionSize/2;
        var innerRotation = 270 - (90 - sectionSize);

        if (!index) {
            outerRotation = outerRotation+sectionSize/2;
        } else if (index==total-1) {
            innerRotation = innerRotation-sectionSize/2;
        }

        for (var i=0; i<gauge.vendors.length; i++) {
            outerDiv.style[gauge.vendors[i]+"transform-origin"] = "50% 100%";
            innerDiv.style[gauge.vendors[i]+"transform-origin"] = "50% 100%";
            outerDiv.style[gauge.vendors[i]+"transform"] = "rotate(" + outerRotation + "deg)";
            innerDiv.style[gauge.vendors[i]+"transform"] = "rotate(" + innerRotation + "deg)";
            circle.style[gauge.vendors[i]+"border-radius"] = "50%";
            circle.style[gauge.vendors[i]+"box-sizing"] = "border-box";
        }

        if (color) {
            circle.style.borderColor = color;
        }

        outerDiv.appendChild(innerDiv);
        innerDiv.appendChild(circle);

        return outerDiv;

    },
    getLabel: function(index, total, width, apertura, text) {

        var label = document.createElement("div");
        label.className = "gauge-label";
        var labelText = document.createElement("div");
        labelText.className = "gauge-labelText";

        label.style.position = "absolute";
        label.style.top = width/2+"px";
        label.style.width = width/2+"px";
        label.style.height = "30px";
        label.style.lineHeight = "30px";
        label.style.marginTop = "-15px";
        label.style.right = "50%";
        labelText.style.display = "inline-block";

        var initialRotation = (360-apertura)/2;
        var sectionRotation = 270 + initialRotation + (apertura*index/(total-1));

        for (var i=0; i<gauge.vendors.length; i++) {
            label.style[gauge.vendors[i]+"transform-origin"] = "100% 50%";
            label.style[gauge.vendors[i]+"transform"] = "rotate(" + sectionRotation + "deg)";
            label.style[gauge.vendors[i]+"transform-origin"] = "100% 50%";
            labelText.style[gauge.vendors[i]+"transform"] = "rotate(-" + sectionRotation + "deg)";
        }

        labelText.innerText = text;

        label.appendChild(labelText);
        return label;

    }
});
