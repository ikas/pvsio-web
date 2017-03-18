/**
 * Draws halo over buttons when the button is clicked
 */
define(function (require, exports, module) {

    var instance;
    var d3        = require("d3/d3");

    function ButtonHalo() {
        this._keyCode2widget = {}; // this table stores information about the relation between keyCodes and widgets
        return this;
    }

    ButtonHalo.prototype.removeKeypressHandlers = function () {
        instance._keyCode2widget = {};
    };

    ButtonHalo.prototype.installKeypressHandler = function (w) {
        function halo (buttonID) {
            if (d3.select("." + buttonID).node()) {
                var coords = d3.select("." + buttonID).attr("coords");
                coords = coords.split(",");
                var pos = {x1: +coords[0], y1: +coords[1], x2: +coords[2], y2: coords[3]};
                var w = pos.x2 - pos.x1, hrad = w / 2, h = pos.y2 - pos.y1, vrad = h / 2, brad = hrad + "px " + vrad + "px";
                var mark = d3.select(".animation-halo");
                if (mark.empty()) {
                    mark = d3.select("#imageDiv .prototype-image-inner").append("div").attr("class", "animation-halo");
                }
                mark.style("top", pos.y1 + "px").style("left", pos.x1 + "px")
                    .style("width", (pos.x2 - pos.x1) + "px").style("height", (pos.y2 - pos.y1) + "px")
                    .style("border-top-left-radius", brad).style("border-top-right-radius", brad)
                    .style("border-bottom-left-radius", brad).style("border-bottom-right-radius", brad);
            }
        }
        function haloOff (buttonID) {
            d3.select(".animation-halo").remove();
        }
        if (w.keyCode()) {
            instance._keyCode2widget[w.keyCode()] = w;
            d3.select(document).on("keydown", function () {
                var eventKeyCode = d3.event.which;
                var widget = instance._keyCode2widget[eventKeyCode];
                if (widget && typeof widget.evts === "function" && widget.evts().indexOf('click') > -1) {
                    widget.click({ callback: widget.callback });
                    halo(widget.id());
                    d3.event.preventDefault();
                    d3.event.stopPropagation();
                } else if (widget && typeof widget.evts === "function" && widget.evts().indexOf("press/release") > -1) {
                    widget.pressAndHold({ callback: widget.callback });
                    halo(widget.id());
                    d3.event.preventDefault();
                    d3.event.stopPropagation();
                }
            });
            d3.select(document).on("keyup", function () {
                var eventKeyCode = d3.event.which;
                var widget = instance._keyCode2widget[eventKeyCode];
                if (widget && typeof widget.evts === "function" && widget.evts().indexOf("press/release") > -1) {
                    widget.release({ callback: widget.callback });
                }
                haloOff();
            });
        }
    };

    module.exports = {
        getInstance: function () {
            instance = instance || new ButtonHalo();
            return instance;
        }
    };
});
