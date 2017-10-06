/**
 * @module SVGWidget
 * @version 1.0.0
 * @author Henrique Pacheco
 * @desc Abstract SVG widget class.
 *
 * @date September 20, 2017
 */
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global define*/
define(function (require, exports, module) {
    "use strict";

    /**
     * @function constructor
     * @description Constructor for the SVGSVGWidget widget.
     * @param id {String} The id of the widget instance.
     * @param coords {Object} Coordinates object.
     * @param opt {Object} Options object.
     * @returns {SVGWidget} The created instance of the widget SVGWidget.
     * @memberof module:SVGWidget
     * @instance
     */
    function SVGWidget(id, coords, opt) {
        // Ready to render control flag
        this.readyToRender = false;
    }

    /**
     * @function ready
     * @description Set the widget as ready to render.
     * @memberof module:SVGWidget
     * @instance
     */
    SVGWidget.prototype.ready = function () {
        // Set widget as ready to render
        this.readyToRender = true;
    };

    /**
     * @function isReady
     * @description Returns if the widget is ready to render.
     * @returns {boolean} If the widget is ready to render or not.
     * @memberof module:SVGWidget
     * @instance
     */
    SVGWidget.prototype.isReady = function () {
        return this.readyToRender;
    };

    /**
     * @function remove
     * @description Removes the instance of the SVGWidget widget.
     * @memberof module:SVGWidget
     * @instance
     */
    SVGWidget.prototype.remove = function () {
        this.div.remove();
        return this;
    };

    /**
     * @function hide
     * @description Hides the instance of the SVGWidget widget.
     * @memberof module:SVGWidget
     * @instance
     */
    SVGWidget.prototype.hide = function () {
        this.div.style("display", "none");
        return this;
    };

    /**
     * @function reveal
     * @description Reveals the instance of the SVGWidget widget.
     * @memberof module:SVGWidget
     * @instance
     */
    SVGWidget.prototype.reveal = function () {
        this.div.style("display", "block");
        return this;
    };

    /**
     * @function move
     * @description Hides the instance of the SVGWidget widget.
     * @param data {Object} An object with the new coordinate values (top and/or left).
     * @memberof module:SVGWidget
     * @instance
     */
    SVGWidget.prototype.move = function (data) {
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
     * @function mergeConfigs
     * @description Merges the two configuration objects provided, with conf2 overriding conf1 values.
     * @param conf1 {Object} The first object of configurations to be merged.
     * @param conf2 {Object} The second object of configurations to be merged. The values on this object
     * will override the values provided by conf1 object.
     * @memberof module:SVGWidget
     * @instance
     */
    SVGWidget.prototype.mergeConfigs = function(conf1, conf2) {
        // Second conf provided overrides the first one
        for (var attr in conf2) { conf1[attr] = conf2[attr]; }
        return conf1;
    };

    /**
     * @function changeColor
     * @description Changes the colors of the icons marked with the "color-change-aware" class.
     * @param color {String} The new color to set.
     * @memberof module:SVGWidget
     * @instance
     */
    SVGWidget.prototype.changeColor = function(color) {
        if(this.isReady() && typeof this.id !== 'undefined') {
            var colorAwareElements = $('#' + this.id + ' svg .color-change-aware');
            if(colorAwareElements.length > 0) {
                colorAwareElements.map(function(index, value) {
                    if(value.tagName === 'g') {
                        $.each($(value).children(), function(index, value) {
                            value.style.fill = color;
                        });
                    } else {
                        value.style.fill = color;
                    }
                });
            }
        }
    }

    module.exports = SVGWidget;
});
