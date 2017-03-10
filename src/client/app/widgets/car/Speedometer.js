/**
 * @module Speedometer
 * @version 1.0
 * @description Renders a basic speedometer.
 * @author Henrique Pacheco
 * @date Mar 1, 2017
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
    function Speedometer(id, opt) {

        // D3 Gauge Plus object
        this.gauge_obj = this.createGauge(id, opt);
        
        // Speedometer params
        this.maxSpeed = 200;
        this.minSpeed = 0;
        this.currSpeed = this.minSpeed;
        
        return this;
    }

    Speedometer.prototype.createGauge = function(id, override_config)
    {
        // Default configurations
        var default_config = {
            size: 400,
            rotation: 270,
            gap: 90,
            drawOuterCircle: false,
            innerStrokeColor: "#fff",
            label: "",
            labelSize: 0.1,
            labelColor: "#888",
            min: 0,
            max: 200,
            initial: 0,
            majorTicks: 11,
            transitionDuration: 300
        };

        // Gauge range
        var range = default_config.max - default_config.min;
        default_config.greenZones = [];
        default_config.yellowZones = [this.zone(160, 180)];
        default_config.redZones = [this.zone(180, 200)];
        
        // Override provided configs over default ones
        return new d3_gauge_plus.Gauge(id, Object.assign(default_config, override_config));
    }
    
    Speedometer.prototype.render = function() 
    {
        this.gauge_obj.render();
    };

    Speedometer.prototype.zone = function(from, to) {
        return { from: from, to: to };
    };

    Speedometer.prototype.tick = function(newValue) {
        if (newValue >= this.gauge_obj.config.max) {
            newValue = this.gauge_obj.config.max;
        }

        this.gauge_obj.setPointer(newValue);
    };



    // Interact with speed up key pressed
    Speedometer.prototype.up = function (shift) {
        if (this.currSpeed <= this.maxSpeed) {
            this.currSpeed += this.getAcc(shift);
            this.currSpeed = (this.currSpeed > this.maxSpeed) ? this.maxSpeed : this.currSpeed;
            this.tick(this.currSpeed);
        }
    };

    Speedometer.prototype.getAcc = function (shift) {
        if(shift == 1) {
            return 0.6;
        } else if (shift == 2) {
            return 0.8;
        } else if (shift == 3) {
            return 0.6;
        } else if (shift == 4) {
            return 0.3;
        } else if (shift == 5) {
            return 0.2;
        } else {
            return 0.125;
        }
    };


    // Interact with brake key pressed
    Speedometer.prototype.down = function() {
        if (this.currSpeed >= this.minSpeed) {
            this.currSpeed += this.getBrk();
            this.currSpeed = (this.currSpeed < this.minSpeed) ? this.minSpeed : this.currSpeed;
            this.tick(this.currSpeed);
        }
    };

    Speedometer.prototype.getBrk = function () {
        return -0.6;
    };


    // Friction action
    Speedometer.prototype.friction = function () {
        if(this.currSpeed > this.minSpeed) {
            this.currSpeed += this.getFrc();
            this.tick(this.currSpeed);
        }
    };

    Speedometer.prototype.getFrc = function () {
        return -0.04;
    };



    Speedometer.prototype.getCurrentSpeed = function () {
        return this.currSpeed;
    };

    module.exports = Speedometer;
});