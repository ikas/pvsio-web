/**
 * @module pointer
 * @version 1.0.0
 * @author Henrique Pacheco
 * @date July 12, 2017
 */
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global define*/
define(function (require, exports, module) {
    "use strict";

    function Pointer(id, coords, opt) {
        this.id = id;
        opt = opt || {};
        // Handle coords
        coords = coords || {};
        this.top = coords.top || 0;
        this.left = coords.left || 0;
        this.width = coords.width || 256;
        this.height = coords.height || 256;

        // Handle options
        opt = opt || {};
        this.style_configs = this.getStyleConfigs(opt.style || 1);

        //this.height = 287.47; // px
        this.start_deg = opt.start_deg || 50; // deg
        this.range_deg = opt.range_deg || 250; // deg
        this.max = opt.max || 10;
        this.min = opt.min || 0;
        this.scale = opt.scale || 1;

        // Aux configurations and variables
        opt.position = opt.position || "absolute";
        this.parent = (opt.parent) ? ("#" + opt.parent) : "body";

        // Find pointer file to load from style configs
        var file_to_require = "text!widgets/car/svg/gauge-pointers/gauge-pointer-" + opt.style + ".svg";
        var self = this;
        require([file_to_require], function(file_required) {
            self.div = d3.select(self.parent).append("div")
                .attr('id', id)
                .style("position", opt.position)
                .style("top", self.top + "px")
                .style("left", self.left + "px")
                .style("transform-origin", self.style_configs.transform_origin)
                .html(file_required);


            // Scale added SVG
            self.div.select('svg').style('transform', 'scale('+self.scale+')').style('transform-origin', '0 0');

            return self;
        });

        return this;
    }

    /**
     * @function <a name="Pointer">Pointer</a>
     * @description Render method.
     *
     * @param value {Float} The new value to set the gauge pointer.
     * @param opt {Object} Override options when re-rendering. See constructor docs for
     * detailed docs on the available options.
     *
     * @memberof module:Pointer
     * @instance
     */
    Pointer.prototype.render = function(value, opt) {
        function val2deg(value, start, range, max, min) {
            return start + (value * range / max);
        }

        if(value < this.min) {
            value = this.min;
        }

        if(value > this.max) {
            value = this.max;
        }

        var newValue = val2deg(value, this.start_deg, this.range_deg, this.max, this.min);
        this.div.style('transform', 'rotate(' + newValue + 'deg)');
        return this;
    };


    Pointer.prototype.remove = function () {
        this.div.remove();
        return this;
    };

    Pointer.prototype.hide = function () {
        this.div.style("display", "none");
        return this;
    };

    Pointer.prototype.reveal = function () {
        this.div.style("display", "block");
        return this;
    };

    Pointer.prototype.move = function (data) {
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


    Pointer.prototype.getStyleConfigs = function (style_id)
    {
        switch (style_id) {
            case 1:
                return {
                    padding_top: 185,
                    transform_origin: "top center",
                };

            case 2:
                return {
                    padding_top: 185,
                    transform_origin: "top center",
                };

            case 3:
                return {
                    padding_top: 185,
                    transform_origin: "50% 18%",
                };

            case 8:
                return {
                    padding_top: 185,
                    transform_origin: "top center",
                };

            default:
                break;
        }
    }

    module.exports = Pointer;
});
