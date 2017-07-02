/**
 * @module SVGauge
 * @version 1.0.0
 */
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global define, d3_gauge_plus*/
define(function (require, exports, module) {
    "use strict";

    var gauge = require("text!widgets/car/svg/gauge-panels/gauge-speedometer-panel-8.svg");

    function SVGauge(id, coords, opt) {
        opt = opt || {};

        // Handle coords
        coords = coords || {};
        this.top = coords.top || 0;
        this.left = coords.left || 0;
        this.width = coords.width || 256;
        this.height = coords.height || 256;

        // Aux configurations and variables
        opt.position = opt.position || "absolute";
        this.parent = (opt.parent) ? ("#" + opt.parent) : "body";

        // Create the gauge element
        this.div = d3.select(this.parent)
            .append('div').attr('id', id)
            .style("position", opt.position)
            .style("top", this.top + "px").style("left", this.left + "px")
            .style("width", (this.width) + "px").style("height", (this.height) + "px");

        // Get default configs
        var config = this.mergeConfigs({}, this.getDefaultConfigs());

        // Apply style configs if defined
        if(opt.style) {
            config = this.mergeConfigs(config, this.getStyleConfigs(opt.style));
        }

        // Merge the provided options
        config = this.mergeConfigs(config, opt);

        // Save configs for further usage
        this.config = config;
        this.id = id;

        // Add svg image
        this.gauge = this.div.append("div").attr("id", "gauge").html(gauge);

        // Set width and height
        this.gauge.select("svg").attr("width", this.width);
        this.gauge.select("svg").attr("height", this.height);

        return this;
    }

    /**
     * @function <a name="Gauge">Gauge</a>
     * @description Render method.
     *
     * @param new_value {Float} The new value to set the gauge pointer.
     * @param opt {Object} Override options when re-rendering. See constructor docs for
     * detailed docs on the available options.
     *
     * @memberof module:Gauge
     * @instance
     */
    SVGauge.prototype.render = function(new_value, opt) 
    {
        this.gauge.select('#pointer')
            .style('transform-origin', 'top left')
            .style('transform', 'rotate('+this.getDegreesFromValue(new_value)+'deg)');
        return this;
    };


    SVGauge.prototype.getDegreesFromValue = function(value) {
        return (value <= 0) ? 199 : (199 - ((value / this.config.max) * 280));
    };

    SVGauge.prototype.remove = function () {
        SVGauge.prototype.parentClass.remove.apply(this);
        this.div.remove();
        return this;
    };

    SVGauge.prototype.hide = function () {
        this.div.style("display", "none");
        return this;
    };

    SVGauge.prototype.reveal = function () {
        this.div.style("display", "block");
        return this;
    };

    SVGauge.prototype.move = function (data) {
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

    SVGauge.prototype.renderSample = function (opt) {
        // opt = opt || {};
        // var config = this.mergeConfigs(this.getDefaultConfigs(), opt);
        // var gaugeObj = this.createGauge('sample', config);
        // return this.render('sample', config);
        return this;
    };

    /**
     * @function <a name="Gauge">Gauge</a>
     * @description Returns the default config object.
     *
     * @memberof module:Gauge
     * @instance
     */
    SVGauge.prototype.getDefaultConfigs = function() {
        return {
            size: 400,
            rotation: 270,
            gap: 90,
            drawOuterCircle: false,
            outerStrokeColor: "#fff",
            outerFillColor: "#fff",
            innerStrokeColor: "#fff",
            innerFillColor: "#000",
            label: '',
            labelSize: 0.1, // Default font size is 10% of radius.
            labelColor: "#888",
            min: 0,
            max: 200,
            initial: 0,
            clampUnderflow: false,
            clampOverflow: false,
            majorTicks: 9,
            majorTickColor: "#fff",
            majorTickWidth: "3px",
            minorTicks: 3,
            minorTickColor: "#fff",
            minorTickWidth: "1px",
            greenColor: "#109618",
            yellowColor: "#FF9900",
            redColor: "#e31406",

            // Added settings
            pointerFillColor: "#dc3912",
            pointerStrokeColor: "#c63310",
            pointerUseBaseCircle: false,
            // Percentage of total radius
            pointerBaseCircleRadius: 0.1,
            pointerBaseCircleFillColor: "#fff",
            pointerBaseCircleStrokeColor: "red",
            pointerBaseCircleStrokeWidth: "1px",

            transitionDuration: 500,
            greenZones: [ ],
            yellowZones: [ ],
            redZones: [ { from: (200 - (200 * 0.125)), to: 200 } ],

            roundValueBeforeRender: false,
            style: 'classic',
        };
    };


    /**
     * @function <a name="Gauge">Gauge</a>
     * @description Returns the style configs for the provided style identifier.
     *
     * @memberof module:Gauge
     * @instance
     */
    SVGauge.prototype.getStyleConfigs = function(style_identifier) {
        var styles = {
            classic: {
                outerStrokeColor: "#fff",
                outerFillColor: "#fff",
                innerStrokeColor: "#fff",
                innerFillColor: "#2c2b30",
                majorTickColor: "#fff",
                majorTickWidth: "3px",
                minorTickColor: "#fff",
                minorTickWidth: "1px",
                greenColor: "#109618",
                yellowColor: "#FF9900",
                redColor: "#e31406",
                pointerFillColor: "#e93947",
                pointerStrokeColor: "#150507",
                pointerOpacity: 1,
                pointerShowLabel: false,
                pointerUseBaseCircle: true,
                pointerBaseCircleRadius: 0.1,
                pointerBaseCircleFillColor: "#65686d",
                pointerBaseCircleAbovePointer: true,
                pointerBaseCircleStrokeColor: "#000",
                pointerBaseCircleStrokeWidth: "2px",
            },
            sport: {
                innerFillColor: "#2c2b30",
                pointerFillColor: "#a2302d",
                pointerStrokeColor: "#e2d9df",
                pointerShowLabel: false,
                pointerUseBaseCircle: true,
                pointerBaseCircleFillColor: "#131418",
                pointerBaseCircleStrokeColor: "#131418",
                pointerBaseCircleRadius: 0.15
            },
            grey: {
                drawOuterCircle: true,
                outerStrokeColor: "#838286",
                outerFillColor: "#838286",
                innerStrokeColor: "888",
                innerFillColor: "#fff",
                majorTickColor: "#000",
                majorTickWidth: "2px",
                minorTickColor: "#000",
                pointerFillColor: "#dc555a",
                pointerStrokeColor: "#6f6e73",
                pointerShowLabel: false,
                pointerUseBaseCircle: true,
                pointerBaseCircleAbovePointer: true,
                pointerBaseCircleFillColor: "#838286",
                pointerBaseCircleStrokeColor: "#838286",
                pointerBaseCircleRadius: 0.2,
            },
            blue: {
                outerStrokeColor: "#599bcf",
                outerFillColor: "#599bcf",
                innerStrokeColor: "#599bcf",
                innerFillColor: "#599bcf",
                majorTickColor: "#000",
                majorTickWidth: "2px",
                minorTickColor: "#000",
                labelColor: "#000",
                pointerFillColor: "#290107",
                pointerStrokeColor: "#290107",
                pointerShowLabel: false,
                pointerUseBaseCircle: true,
                pointerBaseCircleFillColor: "#3f4552",
                pointerBaseCircleStrokeColor: "#3f4552",
                pointerBaseCircleRadius: 0.2,
            }
        };

        return (styles.hasOwnProperty(style_identifier)) ? styles[style_identifier] : {};
    };


    /**
     * @function <a name="Gauge">Gauge</a>
     * @description Merges the two config objects provided, with conf2 overriding conf1 values.
     *
     * @memberof module:Gauge
     * @instance
     */
    SVGauge.prototype.mergeConfigs = function(conf1, conf2) {
        // Second conf provided overrides the first one
        for (var attr in conf2) { conf1[attr] = conf2[attr]; }
        return conf1;
    };

    module.exports = SVGauge;
});
