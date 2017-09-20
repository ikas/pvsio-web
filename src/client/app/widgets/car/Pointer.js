/**
 * @module Pointer
 * @version 1.0.0
 * @author Henrique Pacheco
 * @desc This module is responsible for building Pointer elements that can
 * be used by the GaugeSport and Clock widgets.
 * @date July 12, 2017
 *
 * @example <caption>Usage of Pointer within a PVSio-web project.</caption>
 * define(function (require, exports, module) {
 *     "use strict";
 *
 *     // Require the Pointer module
 *     require("widgets/car/Pointer");
 *
 *     function main() {
 *          // After Pointer module was loaded, initialize it
 *          var pointer = new Pointer(
 *               'example', // id of the element that will be created
 *               { top: 100, left: 100, width: 300, height: 300 }, // coordinates object
 *               { style: 1, min: 0, max: 10, min_degree: 0, max_degree: 360 }
 *               // description of the possible options in the constructor documentation.
 *           );
 *
 *          // Render the Pointer widget - the value provided should be a value between min
 *          // and max options provided, and the angle of rotation will be interpolated from
 *          // the min_degree and max_degree options.
 *          pointer.render(5); // Rotates the pointer 180º
 *     }
 * });
 */
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global define*/
define(function (require, exports, module) {
    "use strict";

    /**
     * @function constructor
     * @description Constructor for the Pointer widget.
     * @param id {String} The id of the widget instance.
     * @param coords {Object} The four coordinates (top, left, width, height) of the display, specifying
     *        the left, top corner, and the width and height of the (rectangular) display.
     *        Default is { top: 125, left: 125, width: 250, height: 250 }.
     * @param opt {Object} Options:
     *          <li>parent (String): the HTML element where the display will be appended (default is "body").</li>
     *          <li>position (String): value for the CSS property position (default is "absolute").</li>
     *          <li>style (String): a valid style identifier (default is 1).</li>
     *          <li>min_degree (Float): The minimum degree of range for the pointer movement (default is 90).</li>
     *          <li>min (Float): The minimum absolute value for the movement of the pointer (default is 0).</li>
     *          <li>max_degree (Float): The maximum degree of range for the pointer movement (default is 270).</li>
     *          <li>max (Float): The maximum absolute value for the movement of the pointer (default is 10).</li>
     *          <li>initial (Float): The initial absolute value for the movement of the pointer (default is min value).</li>
     *          <li>transition (Float): number of milliseconds to be applied in the CSS property transition (default is 0).</li>
     *          <li>laps (Float): The number of laps that should be taken into account in the pointer rotation.
     * An example of usage of this configuration is with an hour pointer in a clock - The minimum value is 0,
     * the maximum value is 24, but the pointer completes 2 laps between min and max values.</li>
     * @returns {Pointer} The created instance of the widget Pointer.
     * @memberof module:Pointer
     * @instance
     */
    function Pointer(id, coords, opt) {

        // Save id for later usage
        this.id = id;

        // Ready to render control flag
        this.readyToRender = false;

        // Handle coords object
        coords = coords || {};
        this.top = coords.top || 125;
        this.left = coords.left || 125;
        this.width = coords.width || 250;
        this.height = coords.height || 250;

        // Handle options and default values
        opt = opt || {};
        opt.position = opt.position || "absolute";
        this.parent = (opt.parent) ? ("#" + opt.parent) : "body";
        this.min_degree = opt.min_degree || 90; // deg
        this.max_degree = opt.max_degree || 270; // deg
        this.max = opt.max || 10;
        this.min = opt.min || 0;
        this.laps = opt.laps || 1;
        this.transition = opt.transition || 0;
        this.initial = opt.initial || this.min;
        this.style_id = opt.style || 1;

        // Get style configurations
        this.style_configs = this.getStyleConfigs(this.style_id);

        // Find pointer file to load from style configs
        var file_to_require = "text!widgets/car/svg/gauge-pointers/" + opt.style + ".svg";
        var self = this;
        require([file_to_require], function(file_required) {
            // Add pointer div
            self.div = d3.select(self.parent).append("div")
                .attr('id', id + '_pointer')
                .style("position", opt.position)
                .style("top", self.top + 'px')
                .style("left", self.left + 'px')
                .style("height", self.height + 'px')
                .style("width", self.width + 'px')
                .style('display', 'block')
                .style('margin', 'auto')
                .html(file_required);

            // Set transform origin attribute on the SVG element
            self.div.select('svg')
                .style("transform-origin", self.style_configs.transform_origin)
                .style("-webkit-transition", "all "+self.transition+"s ease")
                .style("-moz-transition", "all "+self.transition+"s ease")
                .style("-ms-transition", "all "+self.transition+"s ease")
                .style("-o-transition", "all "+self.transition+"s ease")
                .style("transition", "all "+self.transition+"s ease");

            if(opt['z-index'] !== undefined) {
                self.div.style('z-index', opt['z-index']);
            }

            // Set widget as ready to render
            self.readyToRender = true;

            // Set initial position
            self.render(self.initial);

            return self;
        });

        return this;
    }

    /**
     * @function render
     * @description Render method of the Pointer widget. Re-renders the pointer
     * with the provided new value and configurations.
     * @param value {Float} The new value absolute value of the pointer (should
     * be in the range of min and max values provided).
     * @param opt {Object} Override options when re-rendering. See constructor
     * docs for detailed docs on the available options.
     * @memberof module:Pointer
     * @instance
     */
    Pointer.prototype.render = function(value, opt) {

        // If widget is not ready to render, then do nothing
        if(!this.readyToRender) {
            return this;
        }

        if(value < (this.min * this.laps)) {
            value = this.min;
        }

        if(value > (this.max * this.laps)) {
            value = this.max;
        }

        this.div.select('svg')
            .style('transform', 'rotate(' + this.value2deg(value) + 'deg)');
        return this;
    };

    /**
     * @function value2deg
     * @description Converts the provided value to degress of rotation, taking
     * into account the minimum and maximum rotation degrees.
     * @param value {Float} The value to convert.
     * @returns {Float} The converted value in degrees.
     * @memberof module:Pointer
     * @instance
     * @private
     */
    Pointer.prototype.value2deg = function (value) {
        var rangePerc = (value - this.min) / (this.max - this.min);
        var interpolatedOffset = rangePerc * (this.max_degree - this.min_degree);
        return this.min_degree + interpolatedOffset;
    }

    /**
     * @function remove
     * @description Removes the instance of the Pointer widget.
     * @memberof module:Pointer
     * @instance
     */
    Pointer.prototype.remove = function () {
        this.div.remove();
        return this;
    };

    /**
     * @function hide
     * @description Hides the instance of the Pointer widget.
     * @memberof module:Pointer
     * @instance
     */
    Pointer.prototype.hide = function () {
        this.div.style("display", "none");
        return this;
    };

    /**
     * @function reveal
     * @description Reveal the instance of the Pointer widget.
     * @memberof module:Pointer
     * @instance
     */
    Pointer.prototype.reveal = function () {
        this.div.style("display", "block");
        return this;
    };

    /**
     * @function move
     * @description Hides the instance of the Pointer widget.
     * @param data {Object} An object with the new coordinate values (top and/or left).
     * @memberof module:Pointer
     * @instance
     */
    Pointer.prototype.move = function (data) {
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


    /**
     * @function getStyleConfigs
     * @description Returns the style configurations for the provided style
     * identifier. The possible styles for the Pointer widget are the numbers
     * from 1-5, 7-10 and 15-23.
     * @param style_id {string} The style identifier - should match the file name
     * which will be loaded for the pointer.
     * @returns {Object} An object of configurations for the provided style
     * identifier.
     * <li>transform_origin (String) Value for the CSS property transform origin -
     * should be provided as percentages and not absolute values. Examples are
     * "center top" or "50% 20%".</li>
     * @memberof module:Pointer
     * @instance
     */
    Pointer.prototype.getStyleConfigs = function (style_id)
    {
        switch (style_id) {
            case 'gauge-pointer-3':
                return {
                    transform_origin: "50% 20%",
                };

            case 'gauge-pointer-4':
                return {
                    transform_origin: "50% 12%",
                };

            case 'gauge-pointer-5':
                return {
                    transform_origin: "50% 4.5%",
                };

            case 'gauge-pointer-7':
                return {
                    transform_origin: "50% 0%",
                };

            case 'gauge-pointer-8':
                return {
                    transform_origin: "50% 10%",
                };

            case 'gauge-pointer-9':
                return {
                    transform_origin: "50% 20%",
                };

            case 'gauge-pointer-10':
                return {
                    transform_origin: "50% 17.5%",
                };

            case 'gauge-pointer-15':
                return {
                    transform_origin: "50% 50%",
                };

            case 'gauge-pointer-17':
                return {
                    transform_origin: "50% 25%",
                };

            case 'gauge-pointer-18':
                return {
                    transform_origin: "50% 16%",
                };

            case 'gauge-pointer-19':
                return {
                    transform_origin: "50% 35%",
                };

            case 'gauge-pointer-20':
                return {
                    transform_origin: "50% 22%",
                    };

            case 'gauge-pointer-21':
                return {
                    transform_origin: "50% 35%",
                };

            case 'gauge-pointer-22':
                return {
                    transform_origin: "50% 14%",
                };

            case 'gauge-pointer-23':
                return {
                    transform_origin: "50% 9.5%",
                };

            default:
                console.warn('Unrecognied style ' + style_id + ', using default '+
                'configurations.');
                return {
                    transform_origin: "center top",
                };
        }
    };

    module.exports = Pointer;
});
