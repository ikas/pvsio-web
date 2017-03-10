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
        "widgets/car/Shift",
        "widgets/car/Clock",
        "widgets/car/Thermometer",
        
        "plugins/graphbuilder/GraphBuilder",
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
        Shift,
        Clock,
        Thermometer,
        
        GraphBuilder,
        stateParser,
        PVSioWebClient
    ) {
        "use strict";
        var d3 = require("d3/d3");
        var serverLogs = [], maxLogSize = 40;
        var client = PVSioWebClient.getInstance();
        var demoFolder = "iphone";

        // Function automatically invoked by PVSio-web when the back-end sends states updates
        function onMessageReceived(err, event) {
            if (!err) {
                // get new state
                client.getWebSocket().lastState(event.data);
                // parse and render new state
                var res = event.data.toString();
                if (res.indexOf("(#") === 0) {
                    render(stateParser.parse(res));
                    console.log(res);
                }
            } else {
                console.log(err);
            }
        }


        // Render car dashboard components
        function render(res) {
            // ----------------------------- DASHBOARD COMPONENTS -----------------------------        
            // ---------------- SPEEDOMETER ----------------
            var speedometerGauge = new Speedometer('speedometer-gauge', {label:"km/h"});
            speedometerGauge.render();

            // ---------------- TACHOMETER ----------------
            var tachometerGauge = new Tachometer('tachometer-gauge', {
                min: 0, 
                max: 9, 
                label: "x1000/min",
                majorTicks: 10, 
                redZones: [{from:7, to:9}], 
                yellowZones: []
            });
            tachometerGauge.render();

            // ---------------- CURRENT SHIFT -------------------------
            var shiftDisplay = new Shift('current-shift');
            shiftDisplay.render();

            // ---------------- CLOCK ----------------------------------
            var clockDisplay = new Clock('clock');
            clockDisplay.render();

            // ---------------- ENVIRONMENT TEMPERATURE ----------------
            var envThermometer = new Thermometer('env-temp');
            envThermometer.render();

            // ----------------------------- DASHBOARD INTERACTION -----------------------------
            // Set event handlers on every key pressed
            var keyPressed = {};
            d3.select('body')  
                .on('keydown', function() {
                    keyPressed[d3.event.key] = true;
                })
                .on('keyup', function() {
                    keyPressed[d3.event.key] = false;
                });

            // Calls the appropriate widgets API method upon the pressing of the acceleration or brake keys
            function moveCar() {
                if (keyPressed['w']) {

                    var currSpeed = speedometerGauge.getCurrentSpeed();
                    var currShift = shiftDisplay.getCurrentShift(currSpeed);

                    speedometerGauge.up(currShift);
                    tachometerGauge.up(currSpeed, currShift);
                    shiftDisplay.up(currSpeed);

                } else if (keyPressed['s']) {

                    var currSpeed = speedometerGauge.getCurrentSpeed();
                    
                    speedometerGauge.down();
                    tachometerGauge.down(currSpeed);
                    shiftDisplay.down(currSpeed);
                }
            };

            // Friction acts all the time !!
            function friction() {  
                
                var currSpeed = speedometerGauge.getCurrentSpeed();

                speedometerGauge.friction();
                tachometerGauge.friction(currSpeed);
                shiftDisplay.friction(currSpeed);

                // Update clock at all times
                clockDisplay.render();

                // Update env temperature at all times
                envThermometer.render();
            }

            // Call at all times moveCar and friction methods from time to time
            d3.timer(moveCar);
            d3.timer(friction);
        }


        //register event listener for websocket connection from the client
        client.addListener('WebSocketConnectionOpened', function (e) {
            console.log("web socket connected");
            //start pvs process
            client.getWebSocket()
                .startPVSProcess({name: "main.pvs", demoName: demoFolder + "/pvs"}, function (err, event) {
                client.getWebSocket().sendGuiAction("init(0);", onMessageReceived);
                d3.select(".demo-splash").style("display", "none");
                d3.select(".content").style("display", "block");
            });
        }).addListener("WebSocketConnectionClosed", function (e) {
            console.log("web socket closed");
        }).addListener("processExited", function (e) {
            var msg = "Warning!!!\r\nServer process exited. See console for details.";
            console.log(msg);
        });

        client.connectToServer();
    });