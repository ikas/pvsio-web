/**
 * @module clock
 * @version 1.0.0
 * @author Henrique Pacheco
 * @date August 19, 2017
 */
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global define*/
define(function (require, exports, module) {
    "use strict";

    var Pointer = require("widgets/car/Pointer");

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
     * @function <a name="Clock">Clock</a>
     * @description Render method.
     *
     * @param value {Object} Object with hours, minutes and seconds.
     * @param opt {Object} Override options when re-rendering. See constructor docs for
     * detailed docs on the available options.
     *
     * @memberof module:Clock
     * @instance
     */
    Clock.prototype.render = function(value, opt)
    {
        for (var prop in value) {
            if (value.hasOwnProperty(prop)) {
                var renderValue = (value[prop]);
                this.pointers[prop].render(renderValue);
            }
        }
        return this;
    };


    Clock.prototype.remove = function () {
        this.div.remove();
        return this;
    };

    Clock.prototype.hide = function () {
        this.div.style("display", "none");
        return this;
    };

    Clock.prototype.reveal = function () {
        this.div.style("display", "block");
        return this;
    };

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
     * @function <a name="Clock">Clock</a>
     * @description Merges the two config objects provided, with conf2 overriding conf1 values.
     *
     * @memberof module:Clock
     * @instance
     */
    Clock.prototype.mergeConfigs = function(conf1, conf2) {
        // Second conf provided overrides the first one
        for (var attr in conf2) { conf1[attr] = conf2[attr]; }
        return conf1;
    };


    // Style configs
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
                        start_deg: 180,
                        range_deg: 360,
                        min: 0,
                        max: 60,
                    },
                    minutes: {
                        id: 'minutes',
                        top: 109,
                        left: 120,
                        width: 11,
                        style: 18,
                        start_deg: 180,
                        range_deg: 360,
                        min: 0,
                        max: 60,
                    },
                    hours: {
                        id: 'hours',
                        top: 106,
                        left: 118,
                        height: 60,
                        width: 14,
                        style: 17,
                        start_deg: 180,
                        range_deg: 360,
                        min: 0,
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
                        start_deg: 180,
                        range_deg: 360,
                        min: 0,
                        max: 60,
                    },
                    minutes: {
                        id: 'minutes',
                        top: 109,
                        left: 120,
                        width: 11,
                        style: 18,
                        start_deg: 180,
                        range_deg: 360,
                        min: 0,
                        max: 60,
                    },
                    hours: {
                        id: 'hours',
                        top: 106,
                        left: 118,
                        height: 60,
                        width: 14,
                        style: 17,
                        start_deg: 180,
                        range_deg: 360,
                        min: 0,
                        max: 12,
                        laps: 2,
                    }
                };
            case 'clock3':
                return {
                    panel_file: 'gauge-clock-panel-3.svg',
                    seconds: {
                        id: 'seconds',
                        top: 68,
                        left: 119,
                        width: 12,
                        style: 19,
                        start_deg: 180,
                        range_deg: 360,
                        min: 0,
                        max: 60,
                    },
                    minutes: {
                        id: 'minutes',
                        top: 109,
                        left: 120,
                        width: 11,
                        style: 18,
                        start_deg: 180,
                        range_deg: 360,
                        min: 0,
                        max: 60,
                    },
                    hours: {
                        id: 'hours',
                        top: 106,
                        left: 118,
                        height: 60,
                        width: 14,
                        style: 17,
                        start_deg: 180,
                        range_deg: 360,
                        min: 0,
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
                        start_deg: 180,
                        range_deg: 360,
                        min: 0,
                        max: 60,
                    },
                    minutes: {
                        id: 'minutes',
                        top: 109,
                        left: 120,
                        width: 11,
                        style: 18,
                        start_deg: 180,
                        range_deg: 360,
                        min: 0,
                        max: 60,
                    },
                    hours: {
                        id: 'hours',
                        top: 106,
                        left: 118,
                        height: 60,
                        width: 14,
                        style: 17,
                        start_deg: 180,
                        range_deg: 360,
                        min: 0,
                        max: 12,
                        laps: 2,
                    }
                };

            default:
                console.log('Style ' + style_id + ' does not match a valid style.');
                break;
        }
    }

    module.exports = Clock;
});
