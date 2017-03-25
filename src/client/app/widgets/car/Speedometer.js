/**
 * @module Speedometer
 * @version 1.0.0
 * @description
 * Speedometer renders a basic gauge object (using D3 Gauge Plus library). It assumes that this 
 * library was already loaded (TODO fix this). The speedometer will render the gauge, with the 
 * pointer showing the current speed of the car. The initial speed is 0. The render method can 
 * then be called, passing the new car speed as parameter, and the widget will update the gauge 
 * to show the new provided speed value.
 * 
 * @author Henrique Pacheco
 * @date Mar 25, 2017
 *
 * @example <caption>Usage of Speedometer within a PVSio-web project.</caption>
 * define(function (require, exports, module) {
 *     "use strict";
 *
 *     // Require the Speedmeter module
 *     require("widgets/car/Speedometer");
 *
 *     function main() {
 *          // After Speedmeter module was loaded, initialize it
 *          var speedometerGauge = new Speedometer('speedometer-gauge', {
 *              label: "kmh",
 *              max: 240,
 *              min: 0
 *          });
 *
 *          // Re-render the Speedometer, provinding a new speed value
 *          speedometerGauge.render(10); 
 *     }
 * });
 */
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global define, d3_gauge_plus*/
define(function (require, exports, module) {
    "use strict";

    /**
     * @function <a name="Speedometer">Speedometer</a>
     * @description Speedometer constructor.
     * 
     * @param id {String} The ID of the element that will contain the gauge.
     * @param opt {Object} Options:
     *          <li>max (integer): Upper limit of the gauge (default is 200).</li>
     *          <li>min (integer): Bottom limit of the gauge (default is 0).</li>
     *          <li>initial (integer): Initial value of the pointer of the gauge (default is 0).</li>
     *          <li>label (String): Label presented inside the gauge (default is the empty string).</li>
     * @memberof module:Speedometer
     * @instance
     */
    function Speedometer(id, opt) {
        function createGauge(id, opt) {
            var config = {
                size: 400,
                rotation: 270,
                gap: 90,
                drawOuterCircle: false,
                innerStrokeColor: "#fff",
                label: opt.label,
                labelSize: 0.1,
                labelColor: "#888",
                min: opt.min,
                max: opt.max,
                initial: opt.initial,
                majorTicks: 9,
                transitionDuration: 100,
                greenZones: [ ],
                yellowZones: [ ],
                redZones: [ { from: (opt.max - (opt.max * 0.125)), to: opt.max } ]
            };

            // Merge options provided over the gauge default ones
            for (var attr in opt) { config[attr] = opt[attr]; }

            return new d3_gauge_plus.Gauge(id, config);
        }
        opt = opt || {};
        // Speedometer params
        opt.max = opt.max || 200;
        opt.min = opt.min || 0;
        opt.initial = opt.initial || 0;
        opt.label = opt.label || '';
        // D3 Gauge Plus object
        this.gauge_obj = createGauge(id, opt);
        // display the gauge
        this.gauge_obj.render();

        return this;
    }

    /**
     * @function <a name="Speedometer">Speedometer</a>
     * @description Render method.
     * 
     * @param speed {Float} The new value to set the gauge pointer.
     * @param opt {Object} Override options when re-rendering. See constructor docs for 
     * detailed docs on the available options.
     * 
     * @memberof module:Speedometer
     * @instance
     */
    Speedometer.prototype.render = function(speed, opt) {
        opt = opt || {};
        if (speed >= 0) {
            this.gauge_obj.setPointer(Math.round(speed));
        }
    };

    module.exports = Speedometer;
});
