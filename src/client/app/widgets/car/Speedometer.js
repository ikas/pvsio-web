/**
 * @module Speedometer
<<<<<<< HEAD
 * @version 1.0.0
 * @description
 * Speedometer renders a basic gauge object (using D3 Gauge Plus library). It assumes that this 
 * library was already loaded. The speedometer will render the gauge, with the pointer showing the
 * current speed of the car. The initial speed is 0. The render method can then be called, passing
 * the new car speed as parameter, and the widget will update the gauge to show the new provided
 * speed value.
 * 
 * @author Henrique Pacheco
 * @date Mar 1, 2017
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
=======
 * @version 1.0
 * @description Renders a basic speedometer.
 * @author Henrique Pacheco
 * @date Mar 1, 2017
 */
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global define, d3_gauge_plus*/

>>>>>>> upstream/alpha
define(function (require, exports, module) {
    "use strict";

    /**
     * @function <a name="Speedometer">Speedometer</a>
     * @description Constructor.
<<<<<<< HEAD
     * 
     * @param id {String} The ID of the display.
     * @param opt {Object} Options:
     *          TODO build docs for options
     *          <li>backgroundColor (String): background display color (default is black, "#000")</li>
=======
     * @param id {String} The ID of the display.
     * @param coords {Object} The four coordinates (top, left, width, height) of the display, specifying
     *        the left, top corner, and the width and height of the (rectangular) display.
     *        Default is { top: 0, left: 0, width: 200, height: 80 }.
     * @param opt {Object} Options:
     *          <li>backgroundColor (String): background display color (default is black, "#000")</li>
     *          <li>fontfamily (String): display font type (default is "sans-serif")</li>
     *          <li>fontColor (String): display font color (default is white, "#fff")</li>
     *          <li>align (String): text alignment (default is "center")</li>
     *          <li>inverted (Bool): if true, the text has inverted colors,
     *              i.e., fontColor becomes backgroundColor, and backgroundColor becomes fontColor (default is false)</li>
     *          <li>parent (String): the HTML element where the display will be appended (default is "body")</li>
>>>>>>> upstream/alpha
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
                label: "",
                labelSize: 0.1,
                labelColor: "#888",
                min: opt.min,
                max: opt.max,
                initial: opt.initial,
<<<<<<< HEAD
                majorTicks: 9,
                transitionDuration: 100,
                greenZones: [ ],
                yellowZones: [ ],
                redZones: [ { from: (opt.max - (opt.max * 0.125)), to: opt.max } ]
=======
                majorTicks: 11,
                transitionDuration: 300,
                greenZones: [ ],
                yellowZones: [ ],
                redZones: [ { from: (opt.max - (opt.max * 0.1)), to: opt.max } ]
>>>>>>> upstream/alpha
            };
            return new d3_gauge_plus.Gauge(id, config);
        }
        opt = opt || {};
        // Speedometer params
        opt.max = opt.max || 200;
        opt.min = opt.min || 0;
        opt.initial = opt.initial || 0;
<<<<<<< HEAD
        if (opt.label === "kph") {
=======
        if (opt.label === "kmh") {
>>>>>>> upstream/alpha
            opt.label = "Km/h";
        }
        // D3 Gauge Plus object
        this.gauge_obj = createGauge(id, opt);
        // display the gauge
        this.gauge_obj.render();

        return this;
    }

<<<<<<< HEAD
    /**
     * @function <a name="Speedometer">Speedometer</a>
     * @description Render method.
     * 
     * @param speed {Float (?)} The updated car speed.
     * // TODO is this needed?
     * @param opt {Object} Override options when re-rendering:
     *          TODO build docs for options
     *          <li>backgroundColor (String): background display color (default is black, "#000")</li>
     * @memberof module:Speedometer
     * @instance
     */
    Speedometer.prototype.render = function(speed, opt) {
        opt = opt || {};
        if (speed) {
            this.gauge_obj.setPointer(Math.round(speed));
        }
    };

    module.exports = Speedometer;
});
=======
    Speedometer.prototype.render = function(speed, opt) {
        opt = opt || {};
        if (speed) {
            this.gauge_obj.setPointer(speed);
        }
    };

    Speedometer.prototype.zone = function(from, to) {
        return { from: from, to: to };
    };

    module.exports = Speedometer;
});
>>>>>>> upstream/alpha
