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
            label: "kph",
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
            { top: 320, left: 890, width: 40, height: 40 },
            { borderWidth: 2, borderStyle: "solid", borderColor: "white" }
        );
        
        // ---------------- CLOCK ----------------------------------
        car.clockDisplay = new BasicDisplay(
            'clock',
            { top: 600, left: 640, width: 85, height: 30 },
            { fontsize: 25 }
        );
        
        // ---------------- ENVIRONMENT TEMPERATURE ----------------
        car.envTempDisplay = new BasicDisplay(
            'env-temp',
            { top: 600, left: 975, width: 85, height: 30 },
            { fontsize: 25 }
        );

        // ---------------- SPEED ABS VALUE ------------------------
        car.speedAbsDisplay = new BasicDisplay(
            'speed-abs',
            { top: 390, left: 755, width: 100, height: 55 },
            { fontsize: 60 }
        );

        // ---------------- SPEED UNIT DISPLAY ---------------------
        car.speedUnitDisplay = new BasicDisplay(
            'speed-unit-display',
            { top: 414, left: 860, width: 70, height: 30 },
            { fontsize: 28 }
        );

        // ---------------- ODOMETER -------------------------------
        car.odometerDisplay = new BasicDisplay(
            'odometer',
            { top: 322, left: 710, width: 160, height: 40 }
        );

        // FAKE DASHBOARD STUFF (fake for now :) )
        car.fakeTemp1 = new BasicDisplay(
            'fake-temp-1',
            { top: 465, left: 810, width: 80, height: 30 },
            { fontsize: 25 }
        )
        car.fakeTemp2 = new BasicDisplay(
            'fake-temp-2',
            { top: 499, left: 810, width: 80, height: 30 },
            { fontsize: 25 }
        )
        car.fakeTemp3 = new BasicDisplay(
            'fake-temp-3',
            { top: 534, left: 810, width: 80, height: 30 },
            { fontsize: 25 }
        )

        // ----------------------------- DASHBOARD INTERACTION -----------------------------
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
        function pad(num, size) {
            var s = num+"";
            while (s.length < size) {
                s = "0" + s;
            }
            return s;
        }

        function getCurrentTimeFormatted() {
            var date = new Date;
            var minutes = date.getMinutes();
            var hour = date.getHours();
            return addLeadingZero(hour)+':'+addLeadingZero(minutes);
        };

        // Left zero pad for hour/minute display
        function addLeadingZero(i) {
            if (i < 10) {
                i = "0" + i;
            }
            return i;
        };

        // Render car dashboard components
        function render(res) {
            car.speedometerGauge.render(evaluate(res.speed.val));
            car.tachometerGauge.render(evaluate(res.rpm));
            car.gearDisplay.render(parseGear(res.gear));
            car.clockDisplay.render(getCurrentTimeFormatted());
            car.envTempDisplay.render(evaluate(res.temp.val) + ' ' + res.temp.units);
            car.speedAbsDisplay.render(Math.round(evaluate(res.speed.val)).toString());
            car.speedUnitDisplay.render(res.speed.units);
            car.odometerDisplay.render(pad(res.odo,7));

            // Fake stuff (for now)
            car.fakeTemp1.render('16.1 ºC');
            car.fakeTemp2.render('16.1 ºC');
            car.fakeTemp3.render('16.1 ºC');
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