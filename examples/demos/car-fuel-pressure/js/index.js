/**
 * SVG Fuel pressure widget demo
 *
 * @author Henrique Pacheco
 * @date 02/07/17
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
        "widgets/car/GaugeSport",

        "widgets/ButtonActionsQueue",
        "stateParser",
        "PVSioWebClient"
    ], function (
        Button,
        GaugeSport,

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
                    //render(stateParser.parse(res));
                }
            } else {
                console.log(err);
            }
        }

        var widgets = {
            fuelPressure: new GaugeSport('svg-fuel-pressure', {
                top: 140, left: 340, width: 400, height: 400
            }, {
                style: 'fuel-pressure'
            }),
            accelerate: new Button("accelerate", { width: 0, height: 0 }, {
                callback: onMessageReceived,
                evts: ['press/release'],
                keyCode: 38 // key up
            }),
            brake: new Button("brake", { width: 0, height: 0 }, {
                callback: onMessageReceived,
                evts: ['press/release'],
                keyCode: 40 // key down
            })
        };

        // Set handlers for button clicks
        document.getElementById("empty-tank-button").addEventListener("click", function() {
            widgets.fuelPressure.render({ fuel: 0 });
        });
        document.getElementById("half-tank-button").addEventListener("click", function() {
            widgets.fuelPressure.render({ fuel: 50 });
        });
        document.getElementById("full-tank-button").addEventListener("click", function() {
            widgets.fuelPressure.render({ fuel: 100 });
        });


        document.getElementById("fill-perc-form").addEventListener("submit", function(e) {
            e.preventDefault();
            widgets.fuelPressure.render({ fuel: document.getElementById("perc-input").value });
        })


        document.getElementById("cold-temp-button").addEventListener("click", function() {
            widgets.fuelPressure.render({ temperature: 50 });
        });
        document.getElementById("warm-temp-button").addEventListener("click", function() {
            widgets.fuelPressure.render({ temperature: 90 });
        });
        document.getElementById("hot-temp-button").addEventListener("click", function() {
            widgets.fuelPressure.render({ temperature: 130 });
        });


        document.getElementById("temp-value-form").addEventListener("submit", function(e) {
            e.preventDefault();
            widgets.fuelPressure.render({ temperature: 50 });
        })

        // Re-render widgets
        function render(res) {
            widgets.fuelPressure.render(evaluate(res.speed.val));
        }

        var demoFolder = "car-fuel-pressure";
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
