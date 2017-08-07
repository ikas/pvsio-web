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
        this.width = coords.width || 250;
        this.height = coords.height || 250;

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
                opt.top = opt.top || (self.height / 2);
                opt.left = opt.left || (self.width / 2);
                opt.height = opt.height || 0.85 * (self.height / 2);

                self.pointers[opt.id] = (new Pointer(
                    opt.id,
                    { top: opt.top, left: opt.left, height: opt.height },
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

            // Tachomter styles
            case 'tachometer':
                return {
                    panel_file: 'gauge-tachometer-panel-1.svg',
                    pointer_opt: {
                        max: 10,
                        style: 1,
                        start_deg: 58,
                        range_deg: 248,
                    }
                };
            case 'tachometer2':
                return {
                    panel_file: 'gauge-tachometer-panel-2.svg',
                    pointer_opt: {
                        max: 8,
                        style: 9,
                        start_deg: 56,
                        range_deg: 248,
                    }
                };

            // Speedometer Styles
            case 'speedometer':
                return {
                    panel_file: 'gauge-speedometer-panel-1.svg',
                    pointer_opt: {
                        start_deg: 55,
                        range_deg: 252,
                        max: 220,
                        style: 2,
                    }
                };
            case 'speedometer2':
                return {
                    panel_file: 'gauge-speedometer-panel-2.svg',
                    pointer_opt: {
                        start_deg: 90,
                        range_deg: 240,
                        max: 200,
                        style: 1,
                    }
                };
            case 'speedometer3':
                return {
                    panel_file: 'gauge-speedometer-panel-3.svg',
                    pointer_opt: {
                        start_deg: 85,
                        range_deg: 190,
                        max: 180,
                        style: 5,
                    }
                };
            case 'speedometer4':
                return {
                    panel_file: 'gauge-speedometer-panel-4.svg',
                    pointer_opt: {
                        start_deg: 78,
                        range_deg: 204,
                        max: 220,
                        style: 2,
                    }
                };

            case 'thermometer':
                return {
                    panel_file: 'gauge-temperature-panel-1.svg',
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
                    pointer_opt: {
                        style: 5,
                        start_deg: 134,
                        range_deg: 89,
                        max: 100,
                    }
                };

            case 'fuel-temp':
                return {
                    panel_file: 'gauge-combo-fuel-pressure-panel-1.svg',
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
                    pointer_opt: [
                        {
                            id: 'seconds',
                            style: 2,
                            start_deg: 178,
                            range_deg: 360,
                            min: 0,
                            max: 60,
                            height: 100
                        },
                        {
                            id: 'minutes',
                            style: 2,
                            start_deg: 178,
                            range_deg: 360,
                            min: 0,
                            max: 60,
                            height: 80
                        },
                        {
                            id: 'hours',
                            style: 2,
                            start_deg: 178,
                            range_deg: 360,
                            min: 0,
                            max: 12,
                            laps: 2,
                            height: 60
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
