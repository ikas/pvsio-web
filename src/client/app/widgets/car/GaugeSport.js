/**
 * @module gauge-sport
 * @version 1.0.0
 * @author Paolo Masci
 * @date June 25, 2017
 */
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global define*/
define(function (require, exports, module) {
    "use strict";

    var Pointer = require("widgets/car/Pointer");

    function GaugeSport(id, coords, opt) {

        this.id = id;

        // Handle coords
        coords = coords || {};
        this.top = coords.top || 0;
        this.left = coords.left || 0;
        this.width = coords.width || 256;
        this.height = coords.height || 256;

        // Handle options
        opt = opt || {};
        this.style_configs = this.getStyleConfigs(opt.style || 'tachometer');

        // Find panel file to load from style configs
        var file_to_require = "text!widgets/car/svg/gauge-panels/" + this.style_configs.panel_file;
        var self = this;
        require([file_to_require], function(file_required) {

            // Aux configurations and variables
            opt.position = opt.position || "absolute";
            self.parent = (opt.parent) ? ("#" + opt.parent) : "body";

            // Find configs for Pointer widget(s)
            self.pointers = [];
            var pointer_opts = [];

            var pointer_opt = self.style_configs.pointer_opt;
            if(pointer_opt.constructor === Array) {
                pointer_opts = pointer_opt;
            } else {
                pointer_opts = [pointer_opt];
            }

            // Add all Pointer widgets to the screen
            pointer_opts.map(function(opt) {
                // Create Pointer widget
                opt.parent = self.id;
                opt.id = opt.id || id;

                self.pointers[opt.id] = (new Pointer(
                    opt.id,
                    { top: opt.top, left: opt.left, width: opt.width },
                    opt
                ));
            });

            // Create the gauge element
            self.div = d3.select(self.parent)
                .append('div').attr('id', id)
                .style("position", opt.position)
                .style("top", self.top + "px").style("left", self.left + "px");

            // Add required svg image
            self.gauge_base = self.div.html(file_required);

            // Set width and height
            var scale = self.style_configs.scale || "1";
            self.div.select('svg')
                .style("transform-origin", "0 0");

            // Get SVG's width and height to set it on the main div - and scale main div also
            var height = self.div.select('svg').style('height');
            var width = self.div.select('svg').style('width');
            self.div
                .style("width", width)
                .style("height", height)
                .style("transform", "scale("+ scale +")")
                .style("transform-origin", "left top");

            return self;
        });

        return this;
    }

    /**
     * @function <a name="GaugeSport">GaugeSport</a>
     * @description Render method.
     *
     * @param value {Float} The new value to set the gauge pointer.
     * @param opt {Object} Override options when re-rendering. See constructor docs for
     * detailed docs on the available options.
     *
     * @memberof module:GaugeSport
     * @instance
     */
    GaugeSport.prototype.render = function(value, opt) {

        if(value.constructor === Object) {
            for (var prop in value) {
                if (value.hasOwnProperty(prop)) {
                    var renderValue = (value[prop]);
                    this.pointers[prop].render(renderValue);
                }
            }
        } else {
            var self = this;
            Object.keys(this.pointers).map(function(key, index) {
                self.pointers[key].render(value, opt);
            });
        }

        return this;
    };


    GaugeSport.prototype.remove = function () {
        this.div.remove();
        return this;
    };

    GaugeSport.prototype.hide = function () {
        this.div.style("display", "none");
        return this;
    };

    GaugeSport.prototype.reveal = function () {
        this.div.style("display", "block");
        return this;
    };

    GaugeSport.prototype.move = function (data) {
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


    GaugeSport.prototype.getStyleConfigs = function (style_id)
    {
        switch (style_id) {
            case 'tachometer':
                return {
                    panel_file: 'gauge-tachometer-panel-1.svg',
                    gauge_size: 287.47,
                    pointer_opt: {
                        max: 10,
                        style: 1,
                        start_deg: 50,
                        range_deg: 250,
                        scale: 0.9,
                    }
                };

            // Speedometer Styles
            case 'speedometer':
                return {
                    panel_file: 'gauge-speedometer-panel-1.svg',
                    scale: 0.6,
                    pointer_opt: {
                        start_deg: 55,
                        range_deg: 252,
                        max: 220,
                        style: 2,
                        width: "6px",
                    }
                };
            case 'speedometer2':
                return {
                    panel_file: 'gauge-speedometer-panel-2.svg',
                    scale: 0.62,
                    pointer_opt: {
                        start_deg: 90,
                        range_deg: 240,
                        max: 200,
                        style: 1,
                        scale: 0.9,
                        width: "10px",
                    }
                };
            case 'speedometer3':
                return {
                    panel_file: 'gauge-speedometer-panel-3.svg',
                    scale: 1.2,
                    pointer_opt: {
                        top: "82%",
                        left: "46%",
                        start_deg: 85,
                        range_deg: 190,
                        max: 180,
                        style: 5,
                        scale: 0.9,
                        width: "10px",
                    }
                };

            case 'thermometer':
                return {
                    panel_file: 'gauge-temperature-panel-1.svg',
                    gauge_size: 234,
                    pointer_opt: {
                        style: 8,
                        start_deg: 33,
                        range_deg: 100,
                        max: 120,
                    }
                };

            case 'fuel':
                return {
                    panel_file: 'gauge-fuel-panel-1.svg',
                    gauge_size: 234,
                    pointer_opt: {
                        style: 3,
                        start_deg: 100,
                        range_deg: 158,
                        max: 100,
                    }
                };

            case 'pressure':
                return {
                    panel_file: 'gauge-pressure-panel-1.svg',
                    gauge_size: 450,
                    pointer_opt: {
                        style: 5,
                        start_deg: 134,
                        range_deg: 89,
                        max: 100,
                        scale: 0.8,
                    }
                };

            case 'fuel-temp':
                return {
                    panel_file: 'gauge-combo-fuel-pressure-panel-1.svg',
                    gauge_size: 134,
                    pointer_opt: [
                        {
                            id: 'temperature',
                            style: 3,
                            start_deg: 50,
                            range_deg: 80,
                            min: 50,
                            max: 130,
                        },
                        {
                            id: 'fuel',
                            style: 3,
                            start_deg: -45,
                            range_deg: -89,
                            max: 100,
                        }
                    ]
                };

            case 'clock':
                return {
                    panel_file: 'gauge-clock-panel-2.svg',
                    gauge_size: 62,
                    pointer_opt: [
                        {
                            id: 'seconds',
                            width: "50%",
                            style: 2,
                            start_deg: 178,
                            range_deg: 360,
                            min: 0,
                            max: 60,
                            scale: 0.65,
                        },
                        {
                            id: 'minutes',
                            style: 2,
                            start_deg: 178,
                            range_deg: 360,
                            min: 0,
                            max: 60,
                            scale: 0.55,
                        },
                        {
                            id: 'hours',
                            style: 2,
                            start_deg: 178,
                            range_deg: 360,
                            min: 0,
                            max: 12,
                            laps: 2,
                            scale: 0.45,
                        }
                    ]
                };

            default:
                console.log('Style ' + style_id + ' does not match a valid style.');
                break;
        }
    }

    module.exports = GaugeSport;
});
