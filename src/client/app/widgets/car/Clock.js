/**
 * @module Clock
 * @version 1.0.0
 * @author Henrique Pacheco
 * @desc This module helps you building clock widgets using SVG files. Uses the Pointer module to
 * draw the clock pointers.
 *
 * @date August 19, 2017
 *
 * @example <caption>Usage of Clock within a PVSio-web project.</caption>
 * define(function (require, exports, module) {
 *     "use strict";
 *
 *     // Require the Clock module
 *     require("widgets/car/Clock");
 *
 *     function main() {
 *          // After Clock module was loaded, initialize it
 *          var clock = new Clock(
 *               'example', // id of the element that will be created
 *               { top: 100, left: 100, width: 300, height: 300 }, // coordinates object
 *               { style: 'clock' } // options
 *           );
 *
 *          // Render the Clock widget - based on the current date and time.
 *          clock.render();
 *     }
 * });
 */
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global define*/
define(function (require, exports, module) {
    "use strict";

    var Pointer = require("widgets/car/Pointer");

    /**
     * @function constructor
     * @description Constructor for the Clock widget.
     * @param id {String} The id of the widget instance.
     * @param coords {Object} The four coordinates (top, left, width, height) of the display, specifying
     *        the left, top corner, and the width and height of the (rectangular) display.
     *        Default is { top: 0, left: 0, width: 250, height: 250 }.
     * @param opt {Object} Options:
     *          <li>parent (String): the HTML element where the display will be appended (default is "body").</li>
     *          <li>position (String): value for the CSS property position (default is "absolute").</li>
     *          <li>style (String): a valid style identifier (default is "clock").</li>
     * @returns {Clock} The created instance of the widget Clock.
     * @memberof module:Clock
     * @instance
     */
    function Clock(id, coords, opt) {

        this.id = id;

        // Handle coords
        coords = coords || {};
        this.top = coords.top || 0;
        this.left = coords.left || 0;
        this.width = coords.width || 250;
        this.height = coords.height || 250;

        // Handle options
        opt = opt || {};
        this.opt = opt;

        this.style_configs = this.getStyleConfigs(opt.style || 'clock');

        // Find panel file to load from style configs
        var file_to_require = "text!widgets/car/svg/gauge-panels/" + this.style_configs.panel_file;
        var self = this;
        require([file_to_require], function(file_required) {

            // Aux configurations and variables
            opt.position = opt.position || "absolute";
            self.parent = (opt.parent) ? ("#" + opt.parent) : "body";

            // Find configs for Pointer widget(s)
            self.pointers = ['hours', 'minutes', 'seconds'];

            // Add all Pointer widgets to the screen
            self.pointers.map(function(id) {
                // Create Pointer widget
                var overrideConfigs = self.opt[id] || {};
                opt = self.mergeConfigs(self.style_configs[id], overrideConfigs);
                opt.parent = self.id;
                self.pointers[opt.id] = (new Pointer(
                    self.id + '-' + id,
                    { top: opt.top, left: opt.left, height: opt.height, width: opt.width },
                    opt
                ));
            });

            // Create the gauge element
            self.div = d3.select(self.parent)
                .append('div').attr('id', id)
                .style("position", opt.position)
                .style("top", self.top + "px").style("left", self.left + "px")
                .style("width", self.width + "px").style("height", self.height + "px")
                .html(file_required);

            if(self.opt['z-index'] !== undefined) {
                self.div.style('z-index', self.opt['z-index'])
            }

            // Get SVG's width and height as integer
            var svgHeight = parseFloat(self.div.select('svg').style('height').replace('px', ''));
            var svgWidth = parseFloat(self.div.select('svg').style('width').replace('px', ''));

            // Calc max deficit between width and height for the original div
            var widthDeficit = svgWidth - self.width;
            var heightDeficit = svgHeight - self.height;

            if(widthDeficit == heightDeficit || widthDeficit > heightDeficit) {
                var ratio = self.width / svgWidth;
            } else {
                var ratio = self.height / svgHeight;
            }

            // Set transform origin attributes and scale the SVG elements
            self.div.select('svg').style("transform-origin", "0 0").style('transform', 'scale('+ratio+')');

            return self;
        });

        return this;
    }

    /**
     * @function render
     * @description Render method of the Clock widget. Calls the render method of the associated pointers of this widget,
     * using the current date and time.
     *
     * @memberof module:Clock
     * @instance
     */
    Clock.prototype.render = function()
    {
        // Clock is rendered based on the current date and time
        var current = new Date();

        if(this.pointers.hasOwnProperty('seconds')) {
            this.pointes.seconds.render(current.getSeconds());
        }

        if(this.pointers.hasOwnProperty('minutes')) {
            this.pointes.minutes.render(current.getMinutes());
        }

        if(this.pointers.hasOwnProperty('hours')) {
            this.pointes.hours.render(current.getHours());
        }

        return this;
    };


    /**
     * @function remove
     * @description Removes the instance of the Clock widget.
     * @memberof module:Clock
     * @instance
     */
    Clock.prototype.remove = function () {
        this.div.remove();
        return this;
    };

    /**
     * @function hide
     * @description Hides the instance of the Clock widget.
     * @memberof module:Clock
     * @instance
     */
    Clock.prototype.hide = function () {
        this.div.style("display", "none");
        return this;
    };

    /**
     * @function reveal
     * @description Reveals the instance of the Clock widget.
     * @memberof module:Clock
     * @instance
     */
    Clock.prototype.reveal = function () {
        this.div.style("display", "block");
        return this;
    };

    /**
     * @function move
     * @description Hides the instance of the Clock widget.
     * @param data {Object} An object with the new coordinate values (top and/or left).
     * @memberof module:Clock
     * @instance
     */
    Clock.prototype.move = function (data) {
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
     * @memberof module:Clock
     * @instance
     */
    Clock.prototype.mergeConfigs = function(conf1, conf2) {
        // Second conf provided overrides the first one
        for (var attr in conf2) { conf1[attr] = conf2[attr]; }
        return conf1;
    };


    /**
     * @function getStyleConfigs
     * @description Returns the style configurations for the provided style identifier. The possible styles for the
     * Clock widget are clock, clock2, clock3 and clock4.
     * @param style_id {string} The style identifier.
     * @returns {Object} An object of configurations for the provided style identifier.
     * <li>panel_file (String) Path to the SVG panel file (inside the widgets/car/svg/gauge-panels) directory.</li>
     * <li>seconds (Object) Object with the configurations that will be provided to the seconds Pointer.
     * <li>minutes (Object) Object with the configurations that will be provided to the minutes Pointer.
     * <li>hours (Object) Object with the configurations that will be provided to the hours Pointer.
     * @throws Will throw an error if the provided style identifier is not valid.
     * @memberof module:GaugeSport
     * @instance
     */
    Clock.prototype.getStyleConfigs = function (style_id)
    {
        switch (style_id) {

            case 'clock':
                return {
                    panel_file: 'gauge-clock-panel-2.svg',
                    seconds: {
                        id: 'seconds',
                        top: 68,
                        left: 119,
                        width: 12,
                        style: 19,
                        min_degree: 180,
                        min: 0,
                        max_degree: 540,
                        max: 60,
                    },
                    minutes: {
                        id: 'minutes',
                        top: 109,
                        left: 120,
                        width: 11,
                        style: 18,
                        min_degree: 180,
                        min: 0,
                        max_degree: 540,
                        max: 60,
                    },
                    hours: {
                        id: 'hours',
                        top: 106,
                        left: 118,
                        height: 60,
                        width: 14,
                        style: 17,
                        min_degree: 180,
                        min: 0,
                        max_degree: 540,
                        max: 12,
                        laps: 2,
                    }
                };
            case 'clock2':
                return {
                    panel_file: 'gauge-clock-panel-1.svg',
                    seconds: {
                        id: 'seconds',
                        top: 68,
                        left: 119,
                        width: 12,
                        style: 19,
                        min_degree: 180,
                        min: 0,
                        max_degree: 540,
                        max: 60,
                    },
                    minutes: {
                        id: 'minutes',
                        top: 109,
                        left: 120,
                        width: 11,
                        style: 18,
                        min_degree: 180,
                        min: 0,
                        max_degree: 540,
                        max: 60,
                    },
                    hours: {
                        id: 'hours',
                        top: 106,
                        left: 118,
                        height: 60,
                        width: 14,
                        style: 17,
                        min_degree: 180,
                        min: 0,
                        max_degree: 540,
                        max: 12,
                        laps: 2,
                    }
                };
            case 'clock3':
                return {
                    panel_file: 'gauge-clock-panel-3.svg',
                    seconds: {
                        id: 'seconds',
                        top: 73,
                        left: 123,
                        width: 3,
                        style: 19,
                        min_degree: 180,
                        min: 0,
                        max_degree: 540,
                        max: 60,
                    },
                    minutes: {
                        id: 'minutes',
                        top: 109,
                        left: 120,
                        width: 11,
                        style: 18,
                        min_degree: 180,
                        min: 0,
                        max_degree: 540,
                        max: 60,
                    },
                    hours: {
                        id: 'hours',
                        top: 106,
                        left: 118,
                        height: 60,
                        width: 14,
                        style: 17,
                        min_degree: 180,
                        min: 0,
                        max_degree: 540,
                        max: 12,
                        laps: 2,
                    }
                };
            case 'clock4':
                return {
                    panel_file: 'gauge-clock-panel-4.svg',
                    seconds: {
                        id: 'seconds',
                        top: 68,
                        left: 119,
                        width: 12,
                        style: 19,
                        min_degree: 180,
                        min: 0,
                        max_degree: 540,
                        max: 60,
                    },
                    minutes: {
                        id: 'minutes',
                        top: 109,
                        left: 120,
                        width: 11,
                        style: 18,
                        min_degree: 180,
                        min: 0,
                        max_degree: 540,
                        max: 60,
                    },
                    hours: {
                        id: 'hours',
                        top: 106,
                        left: 118,
                        height: 60,
                        width: 14,
                        style: 17,
                        min_degree: 180,
                        min: 0,
                        max_degree: 540,
                        max: 12,
                        laps: 2,
                    }
                };

            default:
                throw 'Style identifier ' + style_id + ' does not match a valid Clock style.';
        }
    }

    module.exports = Clock;
});
