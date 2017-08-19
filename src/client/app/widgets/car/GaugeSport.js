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
        this.opt = opt;

        this.pointerOverrideOpts = opt.pointer || {};

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

                // Override default configs with the ones provided
                opt = self.mergeConfigs(opt, self.pointerOverrideOpts);

                // Create Pointer widget
                opt.parent = self.id;
                opt.id = opt.id || id;

                self.pointers[opt.id] = (new Pointer(
                    opt.id,
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

            if(opt['z-index'] !== undefined) {
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


    /**
     * @function <a name="Gauge">Gauge</a>
     * @description Merges the two config objects provided, with conf2 overriding conf1 values.
     *
     * @memberof module:Gauge
     * @instance
     */
    GaugeSport.prototype.mergeConfigs = function(conf1, conf2) {
        // Second conf provided overrides the first one
        for (var attr in conf2) { conf1[attr] = conf2[attr]; }
        return conf1;
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
                        start_deg: 69,
                        range_deg: 222,
                    }
                };
            case 'tachometer3':
                return {
                    panel_file: 'gauge-tachometer-panel-3.svg',
                    pointer_opt: {
                        max: 8,
                        style: 1,
                        height: 90,
                        start_deg: 74,
                        range_deg: 108,
                    }
                };
            case 'tachometer4':
                return {
                    panel_file: 'gauge-tachometer-panel-4.svg',
                    pointer_opt: {
                        max: 8,
                        style: 10,
                        start_deg: 68,
                        range_deg: 230,
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
            case 'speedometer5':
                return {
                    panel_file: 'gauge-speedometer-panel-5.svg',
                    pointer_opt: {
                        start_deg: 60,
                        range_deg: 240,
                        max: 240,
                        style: 2,
                    }
                };
            case 'speedometer6':
                return {
                    panel_file: 'gauge-speedometer-panel-6.svg',
                    pointer_opt: {
                        start_deg: 50,
                        range_deg: 260,
                        max: 200,
                        style: 2,
                    }
                };
            case 'speedometer7':
                return {
                    panel_file: 'gauge-speedometer-panel-7.svg',
                    pointer_opt: {
                        start_deg: 56,
                        range_deg: 248,
                        max: 140,
                        style: 10,
                    }
                };
            case 'speedometer8':
                return {
                    panel_file: 'gauge-speedometer-panel-8.svg',
                    pointer_opt: {
                        top: 110,
                        left: 102,
                        start_deg: 53,
                        range_deg: 254,
                        max: 220,
                        style: 3,
                    }
                };



            // Thermometer styles
            case 'thermometer':
                return {
                    panel_file: 'gauge-temperature-panel-1.svg',
                    pointer_opt: {
                        top: 113,
                        left: 195,
                        style: 8,
                        start_deg: 45,
                        range_deg: 90,
                        max: 130,
                        min: 50,
                    }
                };



            // Fuel styles
            case 'fuel':
                return {
                    panel_file: 'gauge-fuel-panel-1.svg',
                    pointer_opt: {
                        top: 90,
                        left: 120,
                        height: 80,
                        style: 16,
                        start_deg: 98,
                        range_deg: 164,
                        max: 100,
                    }
                };
            case 'fuel2':
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
                            height: 80,
                            top: 106,
                            left: 85,
                        },
                        {
                            id: 'fuel',
                            style: 3,
                            start_deg: -48,
                            range_deg: -88,
                            max: 100,
                            height: 80,
                            top: 106,
                            left: 130,
                        }
                    ]
                };
            case 'fuel3':
                return {
                    panel_file: 'gauge-fuel-panel-2.svg',
                    pointer_opt: {
                        top: 113,
                        left: 195,
                        style: 7,
                        height: 80,
                        start_deg: 44,
                        range_deg: 92,
                        max: 100,
                    }
                };
            case 'fuel4':
                return {
                    panel_file: 'gauge-fuel-panel-3.svg',
                    pointer_opt: {
                        top: 106,
                        left: 106,
                        style: 3,
                        start_deg: 90,
                        range_deg: 180,
                        max: 100,
                    }
                };



            // Pressure styles
            case 'pressure':
                return {
                    panel_file: 'gauge-pressure-panel-1.svg',
                    pointer_opt: {
                        top: 155,
                        left: 105,
                        style: 5,
                        start_deg: 138,
                        range_deg: 82,
                        max: 100,
                    }
                };



            // Clock styles
            case 'clock':
                return {
                    panel_file: 'gauge-clock-panel-2.svg',
                    pointer_opt: [
                        {
                            id: 'seconds',
                            top: 11,
                            left: 113,
                            style: 19,
                            start_deg: 178,
                            range_deg: 360,
                            min: 0,
                            max: 60,
                            height: 100
                        },
                        {
                            id: 'minutes',
                            top: 90,
                            left: 113,
                            style: 18,
                            start_deg: 178,
                            range_deg: 360,
                            min: 0,
                            max: 60,
                            height: 80
                        },
                        {
                            id: 'hours',
                            top: 93,
                            left: 113,
                            style: 17,
                            start_deg: 178,
                            range_deg: 360,
                            min: 0,
                            max: 12,
                            laps: 2,
                            height: 60
                        }
                    ]
                };
            case 'clock2':
                return {
                    panel_file: 'gauge-clock-panel-1.svg',
                    pointer_opt: [
                        {
                            id: 'seconds',
                            style: 19,
                            start_deg: 178,
                            range_deg: 360,
                            min: 0,
                            max: 60,
                            top: 38,
                            left: 67,
                            width: 7,
                            height: 50
                        },
                        {
                            id: 'minutes',
                            style: 18,
                            start_deg: 178,
                            range_deg: 360,
                            min: 0,
                            max: 60,
                            top: 60,
                            left: 67,
                            width: 7,
                            height: 50
                        },
                        {
                            id: 'hours',
                            style: 17,
                            start_deg: 178,
                            range_deg: 360,
                            min: 0,
                            max: 12,
                            laps: 2,
                            top: 61,
                            left: 67,
                            width: 7,
                            height: 50
                        }
                    ]
                };
            case 'clock3':
                return {
                    panel_file: 'gauge-clock-panel-3.svg',
                    pointer_opt: [
                        {
                            id: 'seconds',
                            top: 11,
                            left: 113,
                            style: 19,
                            start_deg: 178,
                            range_deg: 360,
                            min: 0,
                            max: 60,
                            height: 100
                        },
                        {
                            id: 'minutes',
                            top: 90,
                            left: 113,
                            style: 18,
                            start_deg: 178,
                            range_deg: 360,
                            min: 0,
                            max: 60,
                            height: 80
                        },
                        {
                            id: 'hours',
                            top: 93,
                            left: 113,
                            style: 17,
                            start_deg: 178,
                            range_deg: 360,
                            min: 0,
                            max: 12,
                            laps: 2,
                            height: 60
                        }
                    ]
                };
            case 'clock4':
                return {
                    panel_file: 'gauge-clock-panel-4.svg',
                    pointer_opt: [
                        {
                            id: 'seconds',
                            top: 11,
                            left: 113,
                            style: 19,
                            start_deg: 178,
                            range_deg: 360,
                            min: 0,
                            max: 60,
                            height: 100
                        },
                        {
                            id: 'minutes',
                            top: 90,
                            left: 113,
                            style: 18,
                            start_deg: 178,
                            range_deg: 360,
                            min: 0,
                            max: 60,
                            height: 80
                        },
                        {
                            id: 'hours',
                            top: 93,
                            left: 113,
                            style: 17,
                            start_deg: 178,
                            range_deg: 360,
                            min: 0,
                            max: 12,
                            laps: 2,
                            height: 60
                        }
                    ]
                };


            // Compass styles
            case 'compass':
                return {
                    panel_file: 'gauge-compass-panel-1.svg',
                    pointer_opt: {
                        top: 25,
                        left: 112,
                        style: 15,
                        start_deg: 180,
                        range_deg: 360,
                        height: 220,
                        min: 0,
                        max: 100,
                    }
                };
            case 'compass2':
                return {
                    panel_file: 'gauge-compass-panel-2.svg',
                    pointer_opt: {
                        top: 25,
                        left: 112,
                        style: 15,
                        start_deg: 180,
                        range_deg: 360,
                        height: 220,
                        min: 0,
                        max: 100,
                    }
                };

            default:
                console.log('Style ' + style_id + ' does not match a valid style.');
                break;
        }
    }

    module.exports = GaugeSport;
});
