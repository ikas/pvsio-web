/**
 * @module gauge-sport
 * @version 1.0.0
 * @author Henrique Pacheco
 * @date July 23, 2017
 */
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global define*/
define(function (require, exports, module) {
    "use strict";

    var gearboxPanel = require("text!widgets/car/svg/gear-box/gear-box-auto.svg");
    var gearboxStick = require("text!widgets/car/svg/gear-box/gear-stick.svg");

    function Gearbox(id, coords, opt) {

        this.id = id;

        // Handle coords
        coords = coords || {};
        this.top = coords.top || 0;
        this.left = coords.left || 0;
        this.width = coords.width || 256;
        this.height = coords.height || 256;

        // Handle options
        opt = opt || {};
        opt.position = opt.position || "absolute";

        // Aux configurations and variables
        this.parent = (opt.parent) ? ("#" + opt.parent) : "body";

        // Create the gauge element
        this.div = d3.select(this.parent)
            .append('div').attr('id', id)
            .style("position", opt.position)
            .style("top", this.top + "px").style("left", this.left + "px")
            .style("width", this.width + "px").style("height", this.height + "px");

        // Add required svg image
        this.gearbox = this.div.html(gearboxPanel);

        // Add required svg image
        this.stick = d3.select(this.parent)
            .append('div').attr('id', 'gearbox-stick')
            .style('z-index', '1000')
            .style("position", opt.position)
            .style("-webkit-transition", "all 0.3s ease")
            .style("-moz-transition", "all 0.3s ease")
            .style("-ms-transition", "all 0.3s ease")
            .style("-o-transition", "all 0.3s ease")
            .style("transition", "all 0.3s ease")
            .style("transform", "scale(1.2)")
            .html(gearboxStick);

        // Starts at P
        this.setStickPosition('P');

        // Set width and height
        var size = Math.min(this.height, this.width);
        var scale_factor = size / 133;
        this.div.select('svg')
            .style("transform", "scale(" + scale_factor + "," + scale_factor +")")
            .style("transform-origin", "0 0");
        return this;
    }


    Gearbox.prototype.setStickPosition = function(gear)
    {
        switch (gear) {
            case 'D':
                this.stick.style("top", "50%").style("left", "26.8%");
                break;
            case 'N':
                this.stick.style("top", "41%").style("left", "26.8%");
                break;
            case 'R':
                this.stick.style("top", "35%").style("left", "26.8%");
                break;
            case 'P':
            default:
                this.stick.style("top", "23%").style("left", "26.8%");
                break;
        }
    };

    /**
     * @function <a name="Gearbox">Gearbox</a>
     * @description Render method.
     *
     * @param value {String} The new gear value for the gear box.
     * @param opt {Object} Override options when re-rendering. See constructor docs for
     * detailed docs on the available options.
     *
     * @memberof module:Gearbox
     * @instance
     */
    Gearbox.prototype.render = function(value, opt)
    {
        this.setStickPosition(value);
        return this;
    };


    Gearbox.prototype.remove = function () {
        this.div.remove();
        return this;
    };

    Gearbox.prototype.hide = function () {
        this.div.style("display", "none");
        return this;
    };

    Gearbox.prototype.reveal = function () {
        this.div.style("display", "block");
        return this;
    };

    Gearbox.prototype.move = function (data) {
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

    module.exports = Gearbox;
});
