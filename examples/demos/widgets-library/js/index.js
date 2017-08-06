/**
 * SVG Speedometer widget demo
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
                    render(stateParser.parse(res));
                }
            } else {
                console.log(err);
            }
        }

        var widgets = {

            // Speedometer idgets
            speedometer: new GaugeSport(
                'svg-speedometer',
                { top: 90, left: 30 },
                { style: 'speedometer', parent: 'speedometer-container' }
            ),
            speedometer2: new GaugeSport(
                'svg-speedometer2',
                { top: 90, left: 330 },
                { style: 'speedometer2', parent: 'speedometer-container' }
            ),
            speedometer3: new GaugeSport(
                'svg-speedometer3',
                { top: 120, left: 630 },
                { style: 'speedometer3', parent: 'speedometer-container' }
            ),

            // Tachometer widgets
            tachometer1: new GaugeSport(
                'svg-tachometer1',
                { top: 90, left: 30 },
                { style: 'tachometer', parent: 'tachometer-container' }
            ),
            tachometer2: new GaugeSport(
                'svg-tachometer2',
                { top: 90, left: 330 },
                { style: 'tachometer2', parent: 'tachometer-container' }
            ),


            // Clock widgets
            clock1: new GaugeSport(
                'svg-clock1',
                { top: 90, left: 30 },
                { style: 'clock', parent: 'clock-container' }
            ),


            // Fuel widgets
            fuel1: new GaugeSport(
                'svg-fuel1',
                { top: 30, left: 15 },
                { style: 'fuel', parent: 'fuel-container' }
            ),


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

        // Render widgets
        function render(res) {
            // Spedometer render methods
            widgets.speedometer.render(evaluate(res.speed.val));
            widgets.speedometer2.render(evaluate(res.speed.val));
            widgets.speedometer3.render(evaluate(res.speed.val));

            // Tachometer render methods
            widgets.tachometer1.render(evaluate(res.rpm));
            widgets.tachometer2.render(evaluate(res.rpm));

            // Clock render methods
            var current = new Date();
            widgets.clock1.render({
                seconds: current.getSeconds(),
                minutes: current.getMinutes(),
                hours: current.getHours(),
            });
        }

        // Fuel event handlers
        document.getElementById("empty-tank-button").addEventListener("click", function() {
            widgets.fuel1.render(0);
        });
        document.getElementById("half-tank-button").addEventListener("click", function() {
            widgets.fuel1.render(50);
        });
        document.getElementById("full-tank-button").addEventListener("click", function() {
            widgets.fuel1.render(100);
        });
        document.getElementById("perc-input").addEventListener("change", function(e) {
            widgets.fuel1.render(document.getElementById("perc-input").value);
        });


        var demoFolder = "widgets-library";
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
