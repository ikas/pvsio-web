/**
 * @module Tachometer
 * @version 1.0.0
 * @description
 * Tachometer renders a basic gauge object (using D3 Gauge Plus library). It assumes that this 
 * library was already loaded (TODO fix this). The tachometer will render the gauge, with the 
 * pointer showing the current rotations of the car. The initial value is 0. The render method can 
 * then be called, passing the new value for the rotations as parameter, and the widget will update
 * the gauge to show the new value.
 * 
 * @author Henrique Pacheco
 * @date Mar 25, 2017
 *
 * @example <caption>Usage of Tachometer within a PVSio-web project.</caption>
 * define(function (require, exports, module) {
 *     "use strict";
 *
 *     // Require the Tachometer module
 *     require("widgets/car/Tachometer");
 *
 *     function main() {
 *          // After Tachometer module was loaded, initialize it
 *          var tachometerGauge = new Tachometer('tachometer-gauge', {
 *              label: "*1000/min",
 *              max: 9,
 *              min: 0
 *          });
 *
 *          // Re-render the Tachomter, provinding a new rotations value
 *          tachometerGauge.render(4); 
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
    function Tachometer(id, opt) {
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
                majorTicks: 7,
                transitionDuration: 300,
                greenZones: [ ],
                yellowZones: [ ],
                redZones: [ { from: (opt.max - (opt.max * 0.2)), to: opt.max } ]
            };
            return new d3_gauge_plus.Gauge(id, config);
        }
        opt = opt || {};
        // Tachometer params
        opt.max = opt.max || 9;
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
     * @function <a name="Tachometer">Tachometer</a>
     * @description Render method.
     * 
     * @param rpm {Float} The new value to set the gauge pointer.
     * @param opt {Object} Override options when re-rendering. See constructor docs for 
     * detailed docs on the available options.
     * 
     * @memberof module:Tachometer
     * @instance
     */
    Tachometer.prototype.render = function(rpm, opt) {
        opt = opt || {};
        if (rpm >= 0) {
            this.gauge_obj.setPointer(rpm);
        }
    };

    module.exports = Tachometer;
});
