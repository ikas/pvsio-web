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
        "widgets/car/Gearbox",
        "widgets/car/Clock",
        "widgets/ButtonActionsQueue",
        "stateParser",
        "PVSioWebClient"
    ], function (
        Button,
        GaugeSport,
        Gearbox,
        Clock,
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
            speedometer: new GaugeSport(
                'svg-speedometer',
                { top: 87, left: 30, width: 440, height: 440 },
                {
                    style: 'speedometer7',
                    parent: 'dashboard-container',
                    pointer: { top: 190, left: 190, width: 71 }
                }
            ),
            tachometer: new GaugeSport(
                'svg-tachometer',
                { top: 87, left: 510, width: 440, height: 440 },
                {
                    style: 'tachometer4',
                    parent: 'dashboard-container',
                    pointer: { top: 190, left: 190, width: 71 }
                }
            ),
            clock: new Clock(
                'svg-clock',
                { top: 355, left: 185, width: 140, height: 140 },
                {
                    style: 'clock2',
                    parent: 'dashboard-container',
                    'z-index': '1',
                    pointers: {
                        seconds: {
                            top: 37,
                            left: 67,
                            width: 7,
                        },
                        minutes: {
                            top: 61,
                            left: 67,
                            width: 6,
                        },
                        hours: {
                            top: 61,
                            left: 67,
                            width: 6,
                        }
                    }
                }
            ),
            fuel: new GaugeSport(
                'svg-fuel',
                { top: 355, left: 665, width: 140, height: 140 },
                {
                    style: 'fuel4',
                    parent: 'dashboard-container',
                    'z-index': '1',
                    pointer: { top: 61, left: 61, width: 20, height: 70 }
                }
            ),

            // Car controls
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
            widgets.speedometer.render(evaluate(res.speed.val));
            widgets.tachometer.render(evaluate(res.rpm));
            widgets.clock.render();
            widgets.fuel.render(100);
        }

        var demoFolder = "svg-dashboard-1";
        //register event listener for websocket connection from the client
        client.addListener('WebSocketConnectionOpened', function (e) {
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

        }).addListener("processExited", function (e) {
            var msg = "Warning!!!\r\nServer process exited. See console for details.";
        });

        client.connectToServer();
    });
