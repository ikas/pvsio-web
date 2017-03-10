/**
 * @module Shift
 * @version 1.0
 * @description Renders the current shift of the car.
 * @author Henrique Pacheco
 * @date Mar 4, 2017
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
    function Shift(id) {
        // Shift DOM element
        this.dom_elem = document.getElementById(id);
        this.curr = 0;
        return this;
    }

    // Update shift display
    Shift.prototype.update = function (curr) {
        
        if(curr != undefined) {
            this.curr = curr;
        }

        this.dom_elem.innerHTML = (this.curr == 0) ? 'P' : Math.round(this.curr) ;
    };


    Shift.prototype.render = function () {
        this.update(this.curr);
    };

    // Interact with speed up key pressed
    Shift.prototype.up = function(speed) {
        this.update(this.getCurrentShift(speed));
    };

    // Interact with brake key pressed
    Shift.prototype.down = function(speed) {
        this.update(this.getCurrentShift(speed));
    };

    // Friction action
    Shift.prototype.friction = function (speed) {
        this.update(this.getCurrentShift(speed));
    };

    Shift.prototype.getCurrentShift = function(speed) {
        if(speed <= 0) {
            return 0;
        } else if(this.isInInterval(speed, 0, 30)) {
            return 1;
        } else if (this.isInInterval(speed, 30, 70)) {
            return 2;
        } else if (this.isInInterval(speed, 70, 110)) {
            return 3;
        } else if (this.isInInterval(speed, 110, 140)) {
            return 4;
        } else if (this.isInInterval(speed, 140, 180)) {
            return 5;
        }
        return 6;
    };


    Shift.prototype.isInInterval = function(value, intStart, intEnd) {
        return (value > intStart && value < intEnd);
    };

    module.exports = Shift;
});