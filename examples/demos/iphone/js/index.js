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
        GraphBuilder,
        stateParser,
        PVSioWebClient
    ) {
        "use strict";
        var d3 = require("d3/d3");
        var serverLogs = [], maxLogSize = 40;
        var client = PVSioWebClient.getInstance();
        var demoFolder = "iphone";

        //create a collapsible panel using the pvsiowebclient instance
        var imageHolder = client.createCollapsiblePanel({
            parent: "#content",
            headerText: "iPhone unlock screen simulation",
            showContent: true,
            isDemo: true
        }).style("position", "relative").style("width", "1200px");

        //insert the html into the panel (note that this could have used templates or whatever)
        imageHolder.html('<img src="coloredknobs.png" usemap="#prototypeMap"/>').attr("id", "prototype")
        // TODO check this .attr('style', 'noselect')
                    .append("map").attr("id", "prototypeMap").attr("name", "prototypeMap");

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


        // append here user interface elements
        var iphone = {};
        iphone.unlock_button_red = new TouchscreenButton("unlock_button_red",
            { top: 416, left: 41, width: 55, height: 36 },
            {
                softLabel: ">>",
                functionText: "unlock_button_red",
                visibleWhen: "true",
                backgroundColor: "red",
                fontsize: 16,
                callback: onMessageReceived,
                parent: "prototype",
                evts: [ "click" ]
            });
        iphone.unlock_button_green = new Button("unlock_button_green",
            { top: 340, left: 41, width: 55, height: 36 },
            {
                callback: onMessageReceived,
                parent: "prototype"
            });
        iphone.unlock_button_silver = new TouchscreenDisplay("unlock_button_silver",
            { top: 264, left: 41, width: 55, height: 36 },
            {
              displayKey: "current_state",
              visibleWhen: "true",
              functionText: "unlock_button_silver",
              fontColor: "black",
              backgroundColor: "transparent",
              callback: onMessageReceived,
              fontsize: 16,
              displayMode: "standard",
              parent: "prototype"
            });


        // render function
        function render(res) {
            iphone.unlock_button_red.render(res);
            iphone.unlock_button_green.render(res);
            iphone.unlock_button_silver.render(res);
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


        // ----------------------------- HELPER METHODS -----------------------------
        
        // Creates a gauge, given an element id and an array to the override default configs
        function createGauge(id, override_config) {
            
            // Default configurations
            var default_config = {
                size: 400,
                rotation: 270,
                gap: 90,
                drawOuterCircle: false,
                innerStrokeColor: "#fff",
                label: "",
                labelSize: 0.1,
                labelColor: "#888",
                min: 0,
                max: 200,
                initial: 0,
                majorTicks: 11,
                transitionDuration: 300
            };
            // Gauge range
            var range = default_config.max - default_config.min;
            default_config.greenZones = [];
            default_config.yellowZones = [zone(160, 180)];
            default_config.redZones = [zone(180, 200)];
            
            // Override provided configs over default ones
            return new d3_gauge_plus.Gauge(id, Object.assign(default_config, override_config));
        }

        // Update the value of the provided gauge
        function tick(gauge, newValue) {
            if (newValue >= gauge.config.max) {
                newValue = gauge.config.max;
            }
            gauge.setPointer(newValue);
        }

        // Gauge config helper method
        function zone(from, to) {
            return { from: from, to: to };
        }

        // Method to check if the provided value is in the interval starting form intStart and ending in intEnd
        function isInInterval(value, intStart, intEnd) {
            return (value > intStart && value < intEnd);
        }

        // ----------------------------- DASHBOARD COMPONENTS -----------------------------        
        
        // ---------------- SPEEDOMETER ----------------
        // Speedometer rendering
        var speedometerGauge = createGauge('speedometer-gauge', {label:"km/h"});
        speedometerGauge.render();
        // Speedometer params
        var maxSpeed = 200;
        var minSpeed = 0;
        var currSpeed = minSpeed;
        
        // Speedometer API
        // Method called when acceleration key is pressed
        function speedometerUp() {
            if (currSpeed <= maxSpeed) {
                currSpeed += speedometerAcc();
                currSpeed = (currSpeed > maxSpeed) ? maxSpeed : currSpeed;
                tick(speedometerGauge, currSpeed);
            }
        }
        
        // Method called when brake key is pressed 
        function speedometerDown() {
            if (currSpeed >= minSpeed) {
                currSpeed += speedometerBrk(currSpeed);
                currSpeed = (currSpeed < minSpeed) ? minSpeed : currSpeed;
                tick(speedometerGauge, currSpeed);
            }
        }

        // Method called when no key is pressed - simulates the friction
        function speedometerFriction() {
            if(currSpeed > minSpeed) {
                currSpeed += speedometerFrc(currSpeed);
                tick(speedometerGauge, currSpeed);
            }
        }

        // Returns the speedometer acceleration factor once the acceleration key is pressed
        // This factor depends on the current shift of the car
        function speedometerAcc() {
            // Initial break
            if(getCurrentShift() == 1) {
                return 0.6;
            } else if (getCurrentShift() == 2) {
                return 0.8;
            } else if (getCurrentShift() == 3) {
                return 0.6;
            } else if (getCurrentShift() == 4) {
                return 0.3;
            } else if (getCurrentShift() == 5) {
                return 0.2;
            } else {
                return 0.125;
            }
        }

        // Returns the speedometer acceleration factor once the brake key is pressed
        function speedometerBrk(currSpeed) {
            return -0.6;
        }

        // Returns the speedometer acceleration factor once no key is pressed
        function speedometerFrc(currSpeed) {
            return -0.04;
        }


        // ---------------- TACHOMETER ----------------
        // Tachometer rendering
        var tachometerGauge = createGauge('tachometer-gauge', {
            min: 0, 
            max: 9, 
            label: "x1000/min",
            majorTicks: 10, 
            redZones: [zone(7,9)], 
            yellowZones: []
        });
        tachometerGauge.render();
        // Tachometer params
        var minRotations = 0;
        var maxRotations = 9;
        var currRotations = minRotations;
        
        // Tachometer API
        // Method called when acceleration key is pressed
        function tachometerUp() {
            if (currRotations <= maxRotations) {
                
                // tachometerAcc returns absolute value !!
                currRotations += tachometerAcc(currSpeed);
                currRotations = (currRotations > maxRotations) ? maxRotations : currRotations;
                currRotations = resetRotations(currSpeed, currRotations);
                tick(tachometerGauge, currRotations);
            }
        }

        // Method called when brake key is pressed
        function tachometerDown() {
            if (currRotations >= minRotations) {
                currRotations += tachometerBrk(currRotations);
                currRotations = (currRotations < minRotations) ? minRotations : currRotations;
                currRotations = resetRotations(currSpeed, currRotations);
                tick(tachometerGauge, currRotations);
            }
        }

        // Method called when no key is pressed
        function tachometerFriction() {
            if(currRotations > minRotations) {
                currRotations += tachometerFrc(currRotations);
                tick(tachometerGauge, currRotations);
            }
        }

        // Based on the current speed, reset the rotations
        function resetRotations(currSpeed, currRotations) {
            var roundedSpeed = Math.round(currSpeed);
            
            if(roundedSpeed <= 0) {
                return 0;
            } else if(roundedSpeed == 30) {
                return 2;
            } else if (roundedSpeed == 70 || roundedSpeed == 110) {
                return 3;
            } else if (roundedSpeed == 140 || roundedSpeed == 180) {
                return 4;
            }
            return currRotations;
        }

        function tachometerAcc(currSpeed) {
            // Initial break
            if(getCurrentShift() == 1) {
                return 0.16;
            } else if (getCurrentShift() == 2) {
                return 0.11;
            } else if (getCurrentShift() == 3) {
                return 0.08;
            } else if (getCurrentShift() == 4) {
                return 0.05;
            } else if (getCurrentShift() == 5) {
                return 0.025;
            } else {
                return 0.02;
            }
        }

        function tachometerBrk(currRot) {
            return -0.01;
        }

        function tachometerFrc(currRot) {
            return -0.01;
        }


        // ---------------- CURRENT SHIFT ----------------
        // Current shift rendering
        var currShiftElem = document.getElementById('current-shift');
        function updateShiftElem(current) {
            currShiftElem.innerHTML = (current == 0) ? 'P' : Math.round(current) ;
        }
        // Current shift params
        var minShift = 0;
        var maxShift = 6;
        var currShift = minShift;
        
        // Current shift API
        function shiftUp() {
            updateShiftElem(getCurrentShift());
        }

        function shiftDown() {
            updateShiftElem(getCurrentShift());
        }

        function shiftFriction() {
            updateShiftElem(getCurrentShift());                
        }

        // Current shift depends on the current speed of the car (TODO circular dependency (speed depends on current shif, shift depends on speed))
        function getCurrentShift() {
            if(currSpeed <= 0) {
                return 0;
            } else if(isInInterval(currSpeed, 0, 30)) {
                return 1;
            } else if (isInInterval(currSpeed, 30, 70)) {
                return 2;
            } else if (isInInterval(currSpeed, 70, 110)) {
                return 3;
            } else if (isInInterval(currSpeed, 110, 140)) {
                return 4;
            } else if (isInInterval(currSpeed, 140, 180)) {
                return 5;
            }
            return 6;
        }


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
                shiftUp();
                speedometerUp();
                tachometerUp();
            } else if (keyPressed['s']) {
                shiftDown();
                speedometerDown();
                tachometerDown();
            }
        };

        // Friction acts all the time !!
        function friction() {  
            shiftFriction();
            speedometerFriction();
            tachometerFriction();
        }

        // Call at all times moveCar and friction methods from time to time
        d3.timer(moveCar);
        d3.timer(friction);
    });