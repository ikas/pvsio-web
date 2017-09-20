/**
 * @module SVGWidget
 * @version 1.0.0
 * @author Henrique Pacheco
 * @desc TODO
 *
 * @date September 20, 2017
 */
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global define*/
define(function (require, exports, module) {
    "use strict";

    /**
     * @function constructor
     * @description Constructor for the SVGWidget widget.
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

    module.exports = SVGWidget;
});
