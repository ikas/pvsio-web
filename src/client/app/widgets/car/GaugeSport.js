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
            self.panel_file = file_required;

            // Aux configurations and variables
            opt.position = opt.position || "absolute";
            self.parent = (opt.parent) ? ("#" + opt.parent) : "body";

            // Create Pointer widget
            self.pointer = new Pointer(
                id + "_gauge-sport-pointer",
                { top: self.style_configs.pointer_top, left: self.style_configs.pointer_left },
                {
                    parent: self.id,
                    style: self.style_configs.pointer_style,
                    start_deg: self.style_configs.start_deg,
                    range_deg: self.style_configs.range_deg,
                    max: self.style_configs.max,
                    scale: self.style_configs.pointer_scale,
                }
            );

            // Create the gauge element
            self.div = d3.select(self.parent)
                .append('div').attr('id', id)
                .style("position", opt.position)
                .style("top", self.top + "px").style("left", self.left + "px")
                .style("width", self.width + "px").style("height", self.height + "px");

            // Add svg image
            self.gauge_base = self.div.html(self.panel_file);


            // Set width and height
            var size = Math.min(self.height, self.width);
            var scale_factor = size / self.style_configs.gauge_size;
            self.div.select('svg')
                .style("transform", "scale(" + scale_factor + "," + scale_factor +")")
                .style("transform-origin", "0 0");

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
        this.pointer.render(value, opt);
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
                    pointer_style: 1,
                    gauge_size: 287.47,
                    start_deg: 52,
                    range_deg: 250,
                    max: 10,
                    pointer_top: 173,
                    pointer_left: 174,
                    pointer_scale: 0.7,
                };

            case 'speedometer':
                return {
                    panel_file: 'gauge-speedometer-panel-1.svg',
                    pointer_style: 2,
                    gauge_size: 420,
                    start_deg: 52,
                    range_deg: 250,
                    max: 220,
                    pointer_top: 141,
                    pointer_left: 145,
                    pointer_scale: 0.8,
                };

            case 'thermometer':
                return {
                    panel_file: 'gauge-temperature-panel-1.svg',
                    pointer_style: 8,
                    gauge_size: 234,
                    start_deg: 33,
                    range_deg: 100,
                    max: 120,
                    pointer_top: 141,
                    pointer_left: 219,
                    pointer_scale: 1,
                };

            case 'fuel':
                return {
                    panel_file: 'gauge-fuel-panel-1.svg',
                    pointer_style: 3,
                    gauge_size: 234,
                    start_deg: 100,
                    range_deg: 158,
                    max: 100,
                    pointer_top: 117,
                    pointer_left: 159,
                    pointer_scale: 1,
                };

            case 'fuel-pressure':
                return {
                    panel_file: 'gauge-combo-fuel-pressure-panel-1.svg',
                    pointer_style: 3,
                    gauge_size: 134,
                    start_deg: -45,
                    range_deg: -89,
                    max: 100,
                    pointer_top: 190,
                    pointer_left: 230,
                    pointer_scale: 1,
                };

            case 'clock':
                return {
                    panel_file: 'gauge-clock-panel-1.svg',
                    pointer_style: 2,
                    gauge_size: 154,
                    start_deg: 178,
                    range_deg: 360,
                    min: 0,
                    max: 60,
                    pointer_top: 148,
                    pointer_left: 145,
                    pointer_scale: 0.7,
                };

            default:
                break;
        }
    }

    module.exports = GaugeSport;
});
