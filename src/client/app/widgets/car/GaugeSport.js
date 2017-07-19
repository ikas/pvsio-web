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
                opt.width = opt.width || "100%";
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
                .style("top", self.top + "px").style("left", self.left + "px")
                .style("width", self.width + "px").style("height", self.height + "px");

            // Add required svg image
            self.gauge_base = self.div.html(file_required);

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
                        top: 173,
                        left: 174,
                        max: 10,
                        style: 1,
                        start_deg: 52,
                        range_deg: 250,
                        scale: 0.7,
                    }
                };

            case 'speedometer':
                return {
                    panel_file: 'gauge-speedometer-panel-1.svg',
                    gauge_size: 420,
                    pointer_opt: {
                        top: 141,
                        left: 145,
                        start_deg: 52,
                        range_deg: 250,
                        max: 220,
                        style: 2,
                        scale: 0.8,
                    }
                };

            case 'thermometer':
                return {
                    panel_file: 'gauge-temperature-panel-1.svg',
                    gauge_size: 234,
                    pointer_opt: {
                        top: 141,
                        left: 219,
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
                        top: 117,
                        left: 159,
                        style: 3,
                        start_deg: 100,
                        range_deg: 158,
                        max: 100,
                    }
                };

            case 'fuel-pressure':
                return {
                    panel_file: 'gauge-combo-fuel-pressure-panel-1.svg',
                    gauge_size: 134,
                    pointer_opt: [
                        {
                            id: 'temperature',
                            top: 190,
                            left: 150,
                            style: 3,
                            start_deg: 50,
                            range_deg: 80,
                            min: 50,
                            max: 130,
                        },
                        {
                            id: 'fuel',
                            top: 190,
                            left: 230,
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
                            top: 148,
                            left: 145,
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
                            top: 148,
                            left: 145,
                            style: 2,
                            start_deg: 178,
                            range_deg: 360,
                            min: 0,
                            max: 60,
                            scale: 0.55,
                        },
                        {
                            id: 'hours',
                            top: 148,
                            left: 145,
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
                break;
        }
    }

    module.exports = GaugeSport;
});
