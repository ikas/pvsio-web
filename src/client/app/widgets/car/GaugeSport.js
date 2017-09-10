/**
 * @module GaugeSport
 * @version 1.0.0
 * @author Paolo Masci
 * @desc This module helps you building gauge widgets using SVG files. Uses the Pointer module to
 * draw pointers for the gauges.
 *
 * @date June 25, 2017
 */
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global define*/
define(function (require, exports, module) {
    "use strict";

    var Pointer = require("widgets/car/Pointer");

    /**
     * @function constructor
     * @description Constructor for the GaugeSport widget.
     * @param id {String} The id of the widget instance.
     * @param coords {Object} The four coordinates (top, left, width, height) of the display, specifying
     *        the left, top corner, and the width and height of the (rectangular) display.
     *        Default is { top: 0, left: 0, width: 250, height: 250 }.
     * @param opt {Object} Options:
     *          <li>parent (String): the HTML element where the display will be appended (default is "body").</li>
     *          <li>position (String): value for the CSS property position (default is "absolute").</li>
     *          <li>style (String): a valid style identifier (default is "tachometer").</li>
     *          <li>z-index (String): value for the CSS property z-index (if not provided, no z-index is applied).</li>
     * @returns {GaugeSport} The created instance of the widget GaugeSport.
     * @memberof module:GaugeSport
     * @instance
     */
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
            if(pointer_opt !== undefined) {
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
            }

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
     * @function render
     * @description Render method of the GaugeSport widget. Calls the render method of the associated pointers of this widget,
     * with the provided value.
     * @param value {Float} The new value of the pointer of the gauge (should be in the range of min and max values provided).
     * @param opt {Object} Override options when re-rendering. See constructor docs for detailed docs on the available options.
     * @memberof module:GaugeSport
     * @instance
     */
    GaugeSport.prototype.render = function(value, opt) {
        var self = this;
        Object.keys(this.pointers).map(function(key, index) {
            self.pointers[key].render(value, opt);
        });
        return this;
    };


    /**
     * @function remove
     * @description Removes the instance of the GaugeSport widget.
     * @memberof module:GaugeSport
     * @instance
     */
    GaugeSport.prototype.remove = function () {
        this.div.remove();
        return this;
    };

    /**
     * @function hide
     * @description Hides the instance of the GaugeSport widget.
     * @memberof module:GaugeSport
     * @instance
     */
    GaugeSport.prototype.hide = function () {
        this.div.style("display", "none");
        return this;
    };

    /**
     * @function reveal
     * @description Reveals the instance of the GaugeSport widget.
     * @memberof module:GaugeSport
     * @instance
     */
    GaugeSport.prototype.reveal = function () {
        this.div.style("display", "block");
        return this;
    };

    /**
     * @function move
     * @description Hides the instance of the GaugeSport widget.
     * @param data {Object} An object with the new coordinate values (top and/or left).
     * @memberof module:GaugeSport
     * @instance
     */
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
     * @function mergeConfigs
     * @description Merges the two configuration objects provided, with conf2 overriding conf1 values.
     * @param conf1 {Object} The first object of configurations to be merged.
     * @param conf2 {Object} The second object of configurations to be merged. The values on this object
     * will override the values provided by conf1 object.
     * @memberof module:GaugeSport
     * @instance
     */
    GaugeSport.prototype.mergeConfigs = function(conf1, conf2) {
        // Second conf provided overrides the first one
        for (var attr in conf2) { conf1[attr] = conf2[attr]; }
        return conf1;
    };


    /**
     * @function getStyleConfigs
     * @description Returns the style configurations for the provided style identifier. The possible styles for the
     * GaugeSport widget are:
     * <li>tachomter</li>
     * <li>tachomter2</li>
     * <li>tachomter3</li>
     * <li>tachomter4</li>
     * <li>speedomter</li>
     * <li>speedomter2</li>
     * <li>speedomter3</li>
     * <li>speedomter4</li>
     * <li>speedomter5</li>
     * <li>speedomter6</li>
     * <li>speedomter7</li>
     * <li>speedomter8</li>
     * <li>thermometer</li>
     * <li>fuel</li>
     * <li>fuel2</li>
     * <li>fuel3</li>
     * <li>fuel4</li>
     * <li>pressure</li>
     * <li>compass</li>
     * <li>compass2</li>
     * @param style_id {string} The style identifier.
     * @returns {Object} An object of configurations for the provided style identifier.
     * @throws Will throw an error if the provided style identifier is not valid.
     * @memberof module:GaugeSport
     * @instance
     */
    GaugeSport.prototype.getStyleConfigs = function (style_id) {
        switch (style_id) {
            // Tachomter styles
            case 'tachometer':
                return {
                    panel_file: 'gauge-tachometer-panel-1.svg',
                    pointer_opt: {
                        max: 10,
                        style: 3,
                        min_degree: 58,
                        max_degree: 306,
                        width: 38,
                        top: 110,
                        left: 110,
                    }
                };
            case 'tachometer2':
                return {
                    panel_file: 'gauge-tachometer-panel-2.svg',
                    pointer_opt: {
                        max: 8,
                        style: 20,
                        min_degree: 65,
                        max_degree: 298,
                        top: 105,
                        left: 112,
                        width: 26,
                    }
                };
            case 'tachometer3':
                return {
                    panel_file: 'gauge-tachometer-panel-3.svg',
                    pointer_opt: {
                        max: 8,
                        min_degree: 73,
                        max_degree: 181,
                        style: 9,
                        width: 8,
                        top: 105,
                        left: 112.5,
                    }
                };
            case 'tachometer4':
                return {
                    panel_file: 'gauge-tachometer-panel-4.svg',
                    pointer_opt: {
                        max: 8,
                        style: 10,
                        min_degree: 68,
                        max_degree: 298,
                        top: 110,
                        left: 106,
                        width: 38,
                    }
                };



            // Speedometer Styles
            case 'speedometer':
                return {
                    panel_file: 'gauge-speedometer-panel-1.svg',
                    pointer_opt: {
                        min_degree: 64,
                        min: 10,
                        max_degree: 309,
                        max: 140,
                        style: 4,
                        top: 111,
                        left: 111,
                        width: 34,
                    }
                };
            case 'speedometer2':
                return {
                    panel_file: 'gauge-speedometer-panel-2.svg',
                    pointer_opt: {
                        min_degree: 90,
                        max_degree: 330,
                        max: 120,
                        style: 23,
                        top: 110,
                        left: 113.5,
                        width: 23,
                    }
                };
            case 'speedometer3':
                return {
                    panel_file: 'gauge-speedometer-panel-3.svg',
                    pointer_opt: {
                        top: 122,
                        left: 114,
                        width: 20,
                        min_degree: 79,
                        max_degree: 279,
                        max: 190,
                        style: 5,
                    }
                };
            case 'speedometer4':
                return {
                    panel_file: 'gauge-speedometer-panel-4.svg',
                    pointer_opt: {
                        min_degree: 78,
                        max_degree: 284,
                        max: 140,
                        style: 2,
                        width: 8,
                    }
                };
            case 'speedometer5':
                return {
                    panel_file: 'gauge-speedometer-panel-5.svg',
                    pointer_opt: {
                        min_degree: 60,
                        max_degree: 304,
                        max: 240,
                        style: 2,
                        width: 8,
                    }
                };
            case 'speedometer6':
                return {
                    panel_file: 'gauge-speedometer-panel-6.svg',
                    pointer_opt: {
                        min_degree: 49,
                        max_degree: 315,
                        max: 120,
                        style: 9,
                        width: 8,
                        top: 105,
                        left: 112.5,
                    }
                };
            case 'speedometer7':
                return {
                    panel_file: 'gauge-speedometer-panel-7.svg',
                    pointer_opt: {
                        min_degree: 55,
                        max_degree: 308,
                        max: 140,
                        style: 10,
                    }
                };
            case 'speedometer8':
                return {
                    panel_file: 'gauge-speedometer-panel-8.svg',
                    pointer_opt: {
                        top: 108,
                        left: 108,
                        min_degree: 48,
                        max_degree: 312,
                        max: 220,
                        style: 22,
                        width: 34,
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
                        min_degree: 45,
                        max_degree: 135,
                        max: 130,
                        min: 50,
                        transition: 0.3,
                    }
                };



            // Fuel styles
            case 'fuel':
                return {
                    panel_file: 'gauge-fuel-panel-1.svg',
                    pointer_opt: {
                        top: 115,
                        left: 119,
                        height: 80,
                        style: 16,
                        min_degree: 115,
                        max_degree: 242,
                        max: 100,
                        transition: 0.3,
                        width: 18,
                    }
                };
            case 'fuel2':
                return {
                    panel_file: 'gauge-combo-fuel-pressure-panel-1.svg',
                    pointer_opt: [
                        {
                            id: 'temperature',
                            style: 21,
                            min_degree: 44,
                            max_degree: 136,
                            min: 50,
                            max: 130,
                            top: 94,
                            left: 76,
                            width: 30,
                            transition: 0.3,
                        },
                        {
                            id: 'fuel',
                            style: 21,
                            min_degree: -44,
                            max_degree: -136,
                            max: 100,
                            top: 94,
                            left: 144,
                            width: 30,
                            transition: 0.3,
                        }
                    ]
                };
            case 'fuel3':
                return {
                    panel_file: 'gauge-fuel-panel-2.svg',
                    pointer_opt: {
                        style: 10,
                        top: 100,
                        left: 168,
                        width: 34,
                        min_degree: 36,
                        max_degree: 144,
                        max: 100,
                        transition: 0.3,
                    }
                };
            case 'fuel4':
                return {
                    panel_file: 'gauge-fuel-panel-3.svg',
                    pointer_opt: {
                        top: 106,
                        left: 106,
                        style: 3,
                        width: 38,
                        min_degree: 90,
                        max_degree: 270,
                        max: 100,
                        transition: 0.3,
                    }
                };



            // Pressure styles
            case 'pressure':
                return {
                    panel_file: 'gauge-pressure-panel-1.svg',
                    pointer_opt: {
                        top: 155,
                        left: 110,
                        style: 5,
                        width: 20,
                        min_degree: 136,
                        max_degree: 220,
                        max: 100,
                        transition: 0.3,
                    }
                };



            // Compass styles
            case 'compass':
                return {
                    panel_file: 'gauge-compass-panel-1.svg',
                    pointer_opt: {
                        top: 25,
                        left: 112,
                        style: 15,
                        min_degree: 180,
                        max_degree: 540,
                        height: 220,
                        min: 0,
                        max: 100,
                        transition: 0.5,
                    }
                };
            case 'compass2':
                return {
                    panel_file: 'gauge-compass-panel-2.svg',
                    pointer_opt: {
                        top: 25,
                        left: 112,
                        style: 15,
                        min_degree: 180,
                        max_degree: 540,
                        height: 220,
                        min: 0,
                        max: 100,
                        transition: 0.5,
                    }
                };

            case 'example':
                return {
                    panel_file: 'example.svg',
                    pointer_opt: {
                        max: 10,
                        style: 3,
                        min_degree: 58,
                        max_degree: 306,
                        width: 38,
                        top: 110,
                        left: 110,
                    }
                }

            default:
                throw 'Style identifier ' + style_id + ' does not match a valid GaugeSport style.';
        }
    }

    module.exports = GaugeSport;
});
