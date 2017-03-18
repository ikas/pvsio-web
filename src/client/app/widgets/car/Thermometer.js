/**
 * @module Thermometer
 * @version 1.0
 * @description Renders the provided value as a temperature.
 * @author Henrique Pacheco
 * @date Mar 8, 2017
 */
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global define, document */

define(function (require, exports, module) {
    "use strict";

    var d3 = require("d3/d3");

    /**
     * @function <a name="BasicDisplay">BasicDisplay</a>
     * @description Constructor.
     * @param id {String} The ID of the display.
     * @param coords {Object} The four coordinates (top, left, width, height) of the display, specifying
     *        the left, top corner, and the width and height of the (rectangular) display.
     *        Default is { top: 0, left: 0, width: 200, height: 80 }.
     * @param opt {Object} Options:
     *          <li>backgroundColor (String): background display color (default is black, "#000")</li>
     *          <li>fontfamily (String): display font type (default is "sans-serif")</li>
     *          <li>fontColor (String): display font color (default is white, "#fff")</li>
     *          <li>align (String): text alignment (default is "center")</li>
     *          <li>inverted (Bool): if true, the text has inverted colors,
     *              i.e., fontColor becomes backgroundColor, and backgroundColor becomes fontColor (default is false)</li>
     *          <li>parent (String): the HTML element where the display will be appended (default is "body")</li>
     * @memberof module:BasicDisplay
     * @instance
     */
    function Thermometer(id) {
        // Thermometer DOM element
        this.dom_elem = document.getElementById(id);
        return this;
    }

    Thermometer.prototype.render = function(temp, units, opt) {
        opt = opt || {};
        if (temp) {
            // TODO missing handling units as provided by the backend
            this.dom_elem.innerHTML = this.formatAsCelsius(temp);
        }
    };

    Thermometer.prototype.formatAsCelsius = function(temp) {
        var one_decimal_temp = Math.round(temp * 10) / 10;
        return one_decimal_temp + ' ºC';
    };

    module.exports = Thermometer;
});