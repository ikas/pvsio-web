/**
 * @module Tachometer
 * @version 1.0
 * @description Renders a basic tachometer.
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
    function Tachometer(id, opt) {

        // D3 Gauge Plus object
        this.gauge_obj = this.createGauge(id, opt);
        
        // Tachometer params
        this.max = 9;
        this.min = 0;
        this.curr = this.min;
        
        return this;
    }

    Tachometer.prototype.createGauge = function(id, override_config)
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
    
    Tachometer.prototype.render = function() 
    {
        this.gauge_obj.render();
    };

    Tachometer.prototype.zone = function(from, to) {
        return { from: from, to: to };
    };


    // Tick gauge to the current rotations
    Tachometer.prototype.tick = function() {
        this.curr = (this.curr >= this.max) ? this.max : this.curr ;
        this.gauge_obj.setPointer(this.curr);
    };


    // Interact with speed up key pressed
    Tachometer.prototype.up = function (speed, shift) {
        if (this.curr <= this.max) {
            // getAcc returns absolute value !!
            this.curr += this.getAcc(shift);
            this.curr = (this.curr > this.max) ? this.max : this.curr;
            this.curr = this.resetRotations(speed, this.curr);
            this.tick(this.curr);
        }
    };

    Tachometer.prototype.getAcc = function (shift) {
        // Initial break
        if(shift == 1) {
            return 0.16;
        } else if (shift == 2) {
            return 0.11;
        } else if (shift == 3) {
            return 0.08;
        } else if (shift == 4) {
            return 0.05;
        } else if (shift == 5) {
            return 0.025;
        } else {
            return 0.02;
        }
    };


    // Interact with brake key pressed
    Tachometer.prototype.down = function(speed) {
        if (this.curr >= this.min) {
            this.curr += this.getBrk();
            this.curr = (this.curr < this.min) ? this.min : this.curr;
            this.curr = this.resetRotations(speed);
            this.tick(this.curr);
        }
    };

    Tachometer.prototype.getBrk = function () {
        return -0.01;
    };


    // Friction action
    Tachometer.prototype.friction = function (speed) {
        if(this.curr > this.min) {
            this.curr += this.getFrc();
            this.curr = this.resetRotations(speed);
            this.tick(this.curr);
        }
    };

    Tachometer.prototype.getFrc = function () {
        return -0.01;
    };



    Tachometer.prototype.resetRotations = function(speed) {
        var roundedSpeed = Math.round(speed);
        
        if(roundedSpeed <= 0) {
            return 0;
        } else if(roundedSpeed == 30) {
            return 2;
        } else if (roundedSpeed == 70 || roundedSpeed == 110) {
            return 3;
        } else if (roundedSpeed == 140 || roundedSpeed == 180) {
            return 4;
        }

        return this.curr;
    };


    module.exports = Tachometer;
});