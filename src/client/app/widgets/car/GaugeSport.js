/**
 * @module GaugeSport
 * @version 1.0.0
 * @author Paolo Masci
 * @desc This module helps you building gauge widgets using SVG files. Uses the Pointer module to
 * draw pointers for the gauges.
 *
 * @date June 25, 2017
 *
 * @example <caption>Usage of GaugeSport within a PVSio-web project.</caption>
 * define(function (require, exports, module) {
 *     "use strict";
 *
 *     // Require the GaugeSport module
 *     require("widgets/car/GaugeSport");
 *
 *     function main() {
 *          // After GaugeSport module was loaded, initialize it
 *          var gauge = new GaugeSport(
 *               'example', // id of the gauge element that will be created
 *               { top: 100, left: 100, width: 300, height: 300 }, // coordinates object
 *               { style: 'example' } // options
 *           );
 *
 *          // Render the GaugeSport widget, provinding a new value
 *          gauge.render(5);
 *     }
 * });
 */
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global define*/
define(function (require, exports, module) {
    "use strict";

    var Pointer = require("widgets/car/Pointer");
    var SVGWidget = require("widgets/car/SVGWidget");

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
        SVGWidget.call(this, id, coords, opt);

        this.id = id;

        // Ready to render control flag
        this.readyToRender = false;

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

                    self.pointers[opt.id] = new Pointer(
                        opt.id,
                        { top: opt.top, left: opt.left, height: opt.height, width: opt.width },
                        opt
                    );
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
                self.div.style('z-index', self.opt['z-index']);
            }

            // Get SVG's width and height as integer
            var svgHeight = parseFloat(self.div.select('svg').style('height').replace('px', ''));
            var svgWidth = parseFloat(self.div.select('svg').style('width').replace('px', ''));

            // Calc max deficit between width and height for the original div
            var widthDeficit = svgWidth - self.width;
            var heightDeficit = svgHeight - self.height;

            var ratio = (widthDeficit === heightDeficit || widthDeficit > heightDeficit) ?
                self.width / svgWidth : self.height / svgHeight;

            // Set transform origin attributes and scale the SVG elements
            self.div.select('svg').style("transform-origin", "0 0").style('transform', 'scale('+ratio+')');

            self.ready();
            return self;
        });

        return this;
    }

    GaugeSport.prototype = Object.create(SVGWidget.prototype);
    GaugeSport.prototype.constructor = GaugeSport;
    GaugeSport.prototype.parentClass = SVGWidget.prototype;

    /**
     * @function render
     * @description Render method of the GaugeSport widget. Calls the render method of the associated pointers of this widget,
     * with the provided value(s) - check the value param documentation for more info on the rendering process.
     *
     * @param value {Float|Object} The value provided can either be a float or an object. If it is a float, the all of the
     * widget pointers' render method will be called with the provided value. If it is an object, then the properties of the objects
     * should match identifiers of pointers, and the value for those properties is the value that will be provided to the render
     * methods. An example of this behavior is the object { pt1: 10, pt2: 20 }, where the render method of the pointer pt1 will
     * be called with 10, and the render method of pointer pt2 will be called with 20.
     *
     * @param opt {Object} Override options when re-rendering. See constructor docs for detailed docs on the available options.
     * @memberof module:GaugeSport
     * @instance
     */
    GaugeSport.prototype.render = function(value, opt)
    {
        if(this.isReady()) {
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
        }

        return this;
    };

    /**
     * @function getStyleConfigs
     * @description Returns the style configurations for the provided style identifier. The possible styles for the
     * GaugeSport widget are:
     * <li>tachomter, tachomter2, tachomter3, tachomter4</li>
     * <li>speedomter, speedomter2, speedomter3, speedomter4, speedomter5, speedomter6, speedomter7, speedomter8</li>
     * <li>thermometer</li>
     * <li>fuel, fuel2, fuel3, fuel4</li>
     * <li>pressure</li>
     * <li>compass, compass2</li>
     * @param style_id {string} The style identifier.
     * @returns {Object} An object of configurations for the provided style identifier.
     * <li>panel_file (String) Path to the SVG panel file (inside the widgets/car/svg/gauge-panels) directory.</li>
     * <li>pointer_opt (Object|Array) Object or array of objects with the configurations that should be provided to the Pointer
     * that the style should compose.
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
                        style: 'gauge-pointer-3',
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
                        style: 'gauge-pointer-20',
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
                        style: 'gauge-pointer-9',
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
                        style: 'gauge-pointer-10',
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
                        style: 'gauge-pointer-4',
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
                        style: 'gauge-pointer-23',
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
                        style: 'gauge-pointer-5',
                    }
                };
            case 'speedometer4':
                return {
                    panel_file: 'gauge-speedometer-panel-4.svg',
                    pointer_opt: {
                        min_degree: 78,
                        max_degree: 284,
                        max: 140,
                        style: 'gauge-pointer-2',
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
                        style: 'gauge-pointer-2',
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
                        style: 'gauge-pointer-9',
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
                        style: 'gauge-pointer-10',
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
                        style: 'gauge-pointer-22',
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
                        style: 'gauge-pointer-8',
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
                        style: 'gauge-pointer-16',
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
                            style: 'gauge-pointer-20',
                            min_degree: 50,
                            max_degree: 130,
                            min: 50,
                            max: 130,
                            top: 104,
                            left: 89,
                            width: 22,
                            transition: 0.3,
                        },
                        {
                            id: 'fuel',
                            style: 'gauge-pointer-20',
                            min_degree: -50,
                            max_degree: -130,
                            max: 100,
                            top: 104,
                            left: 134,
                            width: 22,
                            transition: 0.3,
                        }
                    ]
                };
            case 'fuel3':
                return {
                    panel_file: 'gauge-fuel-panel-2.svg',
                    pointer_opt: {
                        style: 'gauge-pointer-10',
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
                        style: 'gauge-pointer-3',
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
                        style: 'gauge-pointer-5',
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
                        style: 'gauge-pointer-15',
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
                        style: 'gauge-pointer-15',
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
                        style: 'gauge-pointer-3',
                        min_degree: 58,
                        max_degree: 306,
                        width: 38,
                        top: 110,
                        left: 110,
                    }
                };

            default:
                throw 'Style identifier ' + style_id + ' does not match a valid GaugeSport style.';
        }
    };

    module.exports = GaugeSport;
});
