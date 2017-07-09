/**
 * @module svg-speedometer
 * @version 1.0.0
 * @author Henrique Pacheco
 * @date July 02, 2017
 */
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global define*/
define(function (require, exports, module) {
    "use strict";

    var panel = require("text!widgets/car/svg/gauge-panels/gauge-speedometer-panel-1.svg"),
        pointer = require("text!widgets/car/svg/gauge-pointers/gauge-pointer-2.svg");

    var gauge_size = 420; // px
    var start_deg = 52; // deg
    var range_deg = 250; // deg
    var max = 220; // km/h

    function SVGSpeedometer(id, coords, opt) {
        this.id = id;
        opt = opt || {};
        // Handle coords
        coords = coords || {};
        this.top = coords.top || 0;
        this.left = coords.left || 0;
        this.width = coords.width || 256;
        this.height = coords.height || 256;

        // Aux configurations and variables
        opt.position = opt.position || "absolute";
        this.parent = (opt.parent) ? ("#" + opt.parent) : "body";

        // Create the gauge element
        this.div = d3.select(this.parent)
            .append('div').attr('id', id)
            .style("position", opt.position)
            .style("top", this.top + "px").style("left", this.left + "px")
            .style("width", gauge_size + "px").style("height", gauge_size + "px");

        // Add svg image
        this.gauge_base = this.div.append("div").attr("id", id + "_gauge-sport-panel").html(panel);
        this.pointer = this.gauge_base.append("div").attr("id", id + "_gauge-sport-pointer")
                                .attr("style", "position:absolute;" +
                                               "height:" + gauge_size + "px;" +
                                               "top:0px; left:200px; " +
                                               //"background-color:blue;" + // enable this line to see the div of the pointer, useful for debugging
                                               "padding-top:185px;" +
                                               "transform-origin:center;")
                                .html(pointer);

        // Set width and height
        var size = Math.min(this.height, this.width);
        var scale_factor = size / gauge_size;
        this.div.style("transform", "scale(" + scale_factor + "," + scale_factor +")");

        return this;
    }

    /**
     * @function <a name="SVGSpeedometer">SVGSpeedometer</a>
     * @description Render method.
     *
     * @param value {Float} The new value to set the gauge pointer.
     * @param opt {Object} Override options when re-rendering. See constructor docs for
     * detailed docs on the available options.
     *
     * @memberof module:SVGSpeedometer
     * @instance
     */
    SVGSpeedometer.prototype.render = function(value, opt) {
        function val2deg(value) {
            return start_deg + (value * range_deg / max);
        }
        this.pointer.style('transform', 'rotate(' + val2deg(value) + 'deg)');
        return this;
    };


    SVGSpeedometer.prototype.remove = function () {
        this.div.remove();
        return this;
    };

    SVGSpeedometer.prototype.hide = function () {
        this.div.style("display", "none");
        return this;
    };

    SVGSpeedometer.prototype.reveal = function () {
        this.div.style("display", "block");
        return this;
    };

    SVGSpeedometer.prototype.move = function (data) {
        data = data || {};
        if (data.top) {
            this.top = data.top;
            this.div.style("top", this.top + "px");
        }
        if (data.left) {
            this.left = data.left;
            this.div.style("left", this.left + "px");
        }
        return this;
    };

    module.exports = SVGSpeedometer;
});