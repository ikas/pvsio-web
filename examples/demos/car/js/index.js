/**
 *
 * @author Paolo Masci, Patrick Oladimeji
 * @date 27/03/15 20:30:33 PM
 */
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
require.config({
    baseUrl: "../../client/app",
    paths: {
        d3: "../lib/d3",
        "pvsioweb": "plugins/prototypebuilder",
        "imagemapper": "../lib/imagemapper",
        "text": "../lib/text",
        "lib": "../lib",
        "cm": "../lib/cm",
        stateParser: './util/PVSioStateParser'
    }
});

require([
        "widgets/Button",
        "widgets/TouchscreenButton",
        "widgets/TouchscreenDisplay",
        "widgets/BasicDisplay",
        "widgets/NumericDisplay",
        "widgets/LED",

        // Added car components here
        "widgets/car/Speedometer",
        "widgets/car/Tachometer",

        "widgets/ButtonActionsQueue",
        "stateParser",
        "PVSioWebClient"
    ], function (
        Button,
        TouchscreenButton,
        TouchscreenDisplay,
        BasicDisplay,
        NumericDisplay,
        LED,

        // Added car components here
        Speedometer,
        Tachometer,

        ButtonActionsQueue,
        stateParser,
        PVSioWebClient
    ) {
        "use strict";
        var client = PVSioWebClient.getInstance();
        var tick;
        function start_tick() {
            if (!tick) {
                tick = setInterval(function () {
                    ButtonActionsQueue.getInstance().queueGUIAction("tick", onMessageReceived);
                }, 1000);
            }
        }
        function stop_tick() {
            if (tick) {
                clearInterval(tick);
                tick = null;
            }
        }
        function evaluate(str) {
            var v = +str;
            if (str.indexOf("/") >= 0) {
                var args = str.split("/");
                v = +args[0] / +args[1];
            }
            var ans = (v < 100) ? v.toFixed(1).toString() : v.toFixed(0).toString();
            return parseFloat(ans);
        }

        // Function automatically invoked by PVSio-web when the back-end sends states updates
        function onMessageReceived(err, event) {
            if (!err) {
                // get new state
                client.getWebSocket().lastState(event.data);
                // parse and render new state
                var res = event.data.toString();
                if (res.indexOf("(#") === 0) {
                    render(stateParser.parse(res));
                }
            } else {
                console.log(err);
            }
        }

        // ----------------------------- DASHBOARD COMPONENTS -----------------------------
        var car = {};

        // ---------------- SPEEDOMETER ----------------------------
        car.speedometerGauge = new Speedometer('speedometer-gauge', {
            label: "km/h",
            max: 240,
            min: 0
        });

        // ---------------- TACHOMETER -----------------------------
        car.tachometerGauge = new Tachometer('tachometer-gauge', {
            max: 9,
            min: 0,
            label: "x1000/min"
        });

        // ---------------- CURRENT GEAR ---------------------------
        car.gearDisplay = new BasicDisplay(
            'current-gear',
            { top: 7, left: 320, width: 40, height: 40 },
            { borderWidth: 2, borderStyle: "solid", borderColor: "white", parent: "control-panel-container" }
        );

        // ---------------- CLOCK ----------------------------------
        car.clockDisplay = new BasicDisplay(
            'clock',
            { top: 287, left: 80, width: 85, height: 30 },
            { fontsize: 25, parent: "control-panel-container" }
        );

        // ---------------- ENVIRONMENT TEMPERATURE ----------------
        car.envTempDisplay = new BasicDisplay(
            'env-temp',
            { top: 287, left: 405, width: 85, height: 30 },
            { fontsize: 25, parent: "control-panel-container" }
        );

        // ---------------- SPEED ABS VALUE ------------------------
        car.speedAbsDisplay = new BasicDisplay(
            'speed-abs',
            { top: 77, left: 185, width: 100, height: 55 },
            { fontsize: 60, align: "right", parent: "control-panel-container" }
        );

        // ---------------- SPEED UNIT DISPLAY ---------------------
        car.speedUnitDisplay = new BasicDisplay(
            'speed-unit-display',
            { top: 102, left: 290, width: 70, height: 30 },
            { fontsize: 25, align: "left", parent: "control-panel-container" }
        );

        // ---------------- ODOMETER -------------------------------
        car.odometerDisplay = new BasicDisplay(
            'odometer',
            { top: 9, left: 140, width: 160, height: 40 },
            { parent: "control-panel-container" }
        );

        // ---------------- ENGINE TEMPERATURE INDICATORS ----------
        car.engineTemp1 = new BasicDisplay(
            'eng-temp-1',
            { top: 152, left: 240, width: 80, height: 30 },
            { fontsize: 25, parent: "control-panel-container" }
        )
        car.engineTemp2 = new BasicDisplay(
            'eng-temp-2',
            { top: 186, left: 240, width: 80, height: 30 },
            { fontsize: 25, parent: "control-panel-container" }
        )
        car.engineTemp3 = new BasicDisplay(
            'eng-temp-3',
            { top: 221, left: 240, width: 80, height: 30 },
            { fontsize: 25, parent: "control-panel-container" }
        )

        // ---------------- DASHBOARD INTERACTION ------------------
        car.up = new Button("accelerate", { width: 0, height: 0 }, {
            callback: onMessageReceived,
            evts: ['press/release'],
            keyCode: 38 // key up
        });
        car.down = new Button("brake", { width: 0, height: 0 }, {
            callback: onMessageReceived,
            evts: ['press/release'],
            keyCode: 40 // key down
        });


        // Parse the current gear from the string provided by the current model state
        function parseGear(gear_str) {
            // String contains
            if(gear_str.indexOf('GEAR_') !== -1) {
                // String replace
                return gear_str.replace('GEAR_','');
            } else {
                return gear_str;
            }
        }

        // Left zero padding for the odometer value
        function parseOdoValue(num) {
            var s = Math.round(num)+"";
            while (s.length < 7) {
                s = "0" + s;
            }
            return s;
        }

        // Left zero pad for hour/minute display
        function addLeadingZero(i) {
            if (i < 10) {
                i = "0" + i;
            }
            return i;
        };

        // Render car dashboard components
        function render(res) {

            var temperature = evaluate(res.temp.val) + ' ' + ((res.temp.units === "C") ? "°C" : "°F");

            car.speedometerGauge.render(evaluate(res.speed.val));
            car.tachometerGauge.render(evaluate(res.rpm));
            car.gearDisplay.render(parseGear(res.gear));
            car.clockDisplay.render(addLeadingZero(res.time.hour) + ':' + addLeadingZero(res.time.min));
            car.envTempDisplay.render(temperature);
            car.speedAbsDisplay.render(Math.round(evaluate(res.speed.val)).toString());
            car.speedUnitDisplay.render((res.speed.units === "kph") ? "km/h" : "mph");
            car.odometerDisplay.render(parseOdoValue(evaluate(res.odo)));

            // Fake stuff (for now)
            car.engineTemp1.render(temperature);
            car.engineTemp2.render(temperature);
            car.engineTemp3.render(temperature);
        }

        var demoFolder = "car";
        //register event listener for websocket connection from the client
        client.addListener('WebSocketConnectionOpened', function (e) {
            console.log("web socket connected");
            //start pvs process
            client.getWebSocket()
                .startPVSProcess({name: "main.pvs", demoName: demoFolder + "/pvs"}, function (err, event) {
                client.getWebSocket().sendGuiAction("init(0);", onMessageReceived);
                d3.select(".demo-splash").style("display", "none");
                d3.select(".content").style("display", "block");
                // start the simulation
                start_tick();
            });
        }).addListener("WebSocketConnectionClosed", function (e) {
            console.log("web socket closed");
        }).addListener("processExited", function (e) {
            var msg = "Warning!!!\r\nServer process exited. See console for details.";
            console.log(msg);
        });

        client.connectToServer();
    });