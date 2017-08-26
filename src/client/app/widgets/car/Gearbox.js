/**
 * @module gauge-sport
 * @version 1.0.0
 * @author Henrique Pacheco
 * @date July 23, 2017
 */
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global define*/
define(function (require, exports, module) {
    "use strict";

    function Gearbox(id, coords, opt)
    {
        this.id = id;

        // Handle coords
        coords = coords || {};
        this.top = coords.top || 0;
        this.left = coords.left || 0;
        this.width = coords.width || 256;
        this.height = coords.height || 256;

        // Handle options
        opt = opt || {};
        opt.position = opt.position || "absolute";

        // Aux configurations and variables
        this.parent = (opt.parent) ? ("#" + opt.parent) : "body";

        // Find style configs -- defaults to "auto"
        this.style = opt.style;
        this.style_configs = this.getStyleConfigs(opt.style || 'auto');

        // Create wrapper div
        this.buildWrapper();

        // Find panel file to load from style configs -- if any
        if(this.style_configs.panel !== undefined) {
            this.loadPanel();
        }

        // Find stick file to load from style configs -- if any
        if(this.style_configs.stick !== undefined) {
            this.loadStick();
        }

        return this;
    }


    // Build wrapper HTML
    Gearbox.prototype.buildWrapper = function() {
        // Create wrapper div
        this.wrapper = d3.select(this.parent)
            .append('div').attr('id', this.id)
            .style("position", 'absolute')
            .style("top", this.top + "px").style("left", this.left + "px")
            .style("width", this.width + "px").style("height", this.height + "px");
    }


    // Load panel SVG file
    Gearbox.prototype.loadPanel = function()
    {
        // Find the name of the file to load
        var file_to_require = "text!widgets/car/svg/gear-box/" + this.style_configs.panel;
        var self = this;
        require([file_to_require], function(file_required) {
            // Create the panel HTML element
            self.panel = self.wrapper
                .append('div').attr('id', self.id + '_panel')
                .style("position", 'absolute')
                .style("width", self.width + "px").style("height", self.height + "px")
                .html(file_required);

            // Set width and height and scale SVG accordingly
            var scale = Math.min(self.height, self.width) / 133;
            self.panel.select('svg')
                .style("transform", "scale(" + scale + "," + scale +")")
                .style("transform-origin", "0 0");
        });
    }


    // Load stick SVG file
    Gearbox.prototype.loadStick = function()
    {
        // Find the name of the file to load
        var file_to_require = "text!widgets/car/svg/gear-box/" + this.style_configs.stick;
        var self = this;
        require([file_to_require], function(file_required) {

            var widthRatio = self.style_configs.widthRatio || 0.33;
            var heightRatio = self.style_configs.heightRatio || 0.33;

            var stickWidth = (widthRatio * self.width);
            var stickHeight = (heightRatio * self.height);

            // Create the stick HTML element
            self.stick = self.wrapper
                .append('div').attr('id', self.id + '_stick')
                .style("width", stickWidth + "px").style("height", stickHeight + "px")
                .style("position", 'absolute')
                .style("-webkit-transition", "all 0.3s ease")
                .style("-moz-transition", "all 0.3s ease")
                .style("-ms-transition", "all 0.3s ease")
                .style("-o-transition", "all 0.3s ease")
                .style("transition", "all 0.3s ease")
                .style("z-index", "1")
                .html(file_required);

            // Get SVG's width and height as integer
            var svgHeight = parseFloat(self.stick.select('svg').style('height').replace('px', ''));
            var svgWidth = parseFloat(self.stick.select('svg').style('width').replace('px', ''));

            // Calc max deficit between width and height for the original div
            var widthDeficit = svgWidth - stickWidth;
            var heightDeficit = svgHeight - stickHeight;

            if(widthDeficit == heightDeficit || widthDeficit > heightDeficit) {
                var ratio = stickWidth / svgWidth;
            } else {
                var ratio = stickHeight / svgHeight;
            }

            // Set transform origin attributes and scale the SVG elements
            self.stick.select('svg').style("transform-origin", "0 0").style('transform', 'scale('+ratio+')');

            // Set sticker initial positios
            self.setStickPosition('P');
        });
    }


    Gearbox.prototype.setStickPosition = function(gear)
    {
        var leftPerc = this.getLeftOffset(gear);
        var topPerc = this.getTopOffset(gear);
        this.stick.style("top", topPerc * this.height + "px").style("left", leftPerc * this.width + "px");
    };


    Gearbox.prototype.getLeftOffset = function(gear)
    {
        return this.style_configs.leftOffsets[gear];
    }


    Gearbox.prototype.getTopOffset = function(gear)
    {
        return this.style_configs.topOffsets[gear];
    }


    /**
     * @function <a name="Gearbox">Gearbox</a>
     * @description Render method.
     *
     * @param value {String} The new gear value for the gear box.
     * @param opt {Object} Override options when re-rendering. See constructor docs for
     * detailed docs on the available options.
     *
     * @memberof module:Gearbox
     * @instance
     */
    Gearbox.prototype.render = function(value, opt)
    {
        this.setStickPosition(value);
        return this;
    };


    Gearbox.prototype.remove = function () {
        this.wrapper.remove();
        return this;
    };

    Gearbox.prototype.hide = function () {
        this.wrapper.style("display", "none");
        return this;
    };

    Gearbox.prototype.reveal = function () {
        this.wrapper.style("display", "block");
        return this;
    };

    Gearbox.prototype.move = function (data) {
        data = data || {};
        if (data.top) {
            this.top = data.top;
            this.wrapper.style("top", this.top + "px");
        }
        if (data.left) {
            this.left = data.left;
            this.wrapper.style("left", this.left + "px");
        }
        return this;
    };


    Gearbox.prototype.getStyleConfigs = function (style_id)
    {
        switch (style_id) {
            case 'auto':
                return {
                    panel: 'gear-box-auto.svg',
                    stick: 'gear-stick.svg',
                    leftOffsets: {
                        1: 0.345,
                        2: 0.345,
                        3: 0.345,
                        4: 0.345,
                        5: 0.345,
                        6: 0.345,
                        'D': 0.345,
                        'N': 0.345,
                        'R': 0.345,
                        'P': 0.345,
                    },
                    topOffsets: {
                        1: 0.55,
                        2: 0.55,
                        3: 0.55,
                        4: 0.55,
                        5: 0.55,
                        6: 0.55,
                        'D': 0.55,
                        'N': 0.4,
                        'R': 0.25,
                        'P': 0,
                    }
                };

            case 'manual':
                return {
                    panel: 'gear-box-man.svg',
                    stick: 'gear-stick-1.svg',
                    leftOffsets: {
                        1: 0.1,
                        2: 0.1,
                        3: 0.2,
                        4: 0.2,
                        5: 0.35,
                        6: 0.35,
                        'D': 0.18,
                        'N': 0.18,
                        'R': 0,
                        'P': 0.18,
                    },
                    topOffsets: {
                        1: 0.08,
                        2: 0.4,
                        3: 0.08,
                        4: 0.4,
                        5: 0.08,
                        6: 0.4,
                        'D': 0.25,
                        'N': 0.25,
                        'R': 0.08,
                        'P': 0.25,
                    },
                    widthRatio: 0.5,
                    heightRatio: 0.5,
                };

            case 'manual2':
                return {
                    panel: 'gear-box-man.svg',
                    stick: 'gear-stick-2.svg',
                    leftOffsets: {
                        1: 0.1,
                        2: 0.1,
                        3: 0.18,
                        4: 0.18,
                        5: 0.35,
                        6: 0.35,
                        'D': 0.18,
                        'N': 0.18,
                        'R': 0.35,
                        'P': 0.18,
                    },
                    topOffsets: {
                        1: 0.08,
                        2: 0.4,
                        3: 0.08,
                        4: 0.4,
                        5: 0.08,
                        6: 0.08,
                        'D': 0.25,
                        'N': 0.25,
                        'R': 0.4,
                        'P': 0.25,
                    },
                    widthRatio: 0.5,
                    heightRatio: 0.5,
                };
            case 'manual3':
                return {
                    panel: 'gear-box-man.svg',
                    stick: 'gear-stick-3.svg',
                    leftOffsets: {
                        1: 0.1,
                        2: 0.18,
                        3: 0.18,
                        4: 0.35,
                        5: 0.35,
                        6: 0.35,
                        'D': 0.18,
                        'N': 0.18,
                        'R': 0.1,
                        'P': 0.18,
                    },
                    topOffsets: {
                        1: 0.4,
                        2: 0.08,
                        3: 0.4,
                        4: 0.08,
                        5: 0.4,
                        6: 0.4,
                        'D': 0.25,
                        'N': 0.25,
                        'R': 0.08,
                        'P': 0.25,
                    },
                    widthRatio: 0.5,
                    heightRatio: 0.5,
                };

            default:
                console.log('Style ' + style_id + ' does not match a valid Gearbox style.');
                break;
        }
    }

    module.exports = Gearbox;
});
