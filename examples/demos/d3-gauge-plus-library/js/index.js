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
        "widgets/car/Gauge",
        "widgets/car/CentralPanel",

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
        Gauge,
        CentralPanel,

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

        var dashboards = {
            controls: {},
            widgets: {},
        };

        dashboards.widgets = {
            speedometerGauge: new Gauge(
                'speedometer-gauge',
                {
                    top: 60,
                    left: 15,
                    width: 300,
                    height: 300
                },
                {
                    style: 'classic',
                    max: 360,
                    majorTicks: 13,
                    min: 0,
                    size: 360,
                    redZones: [],
                    rotation: -45,
                    gap:90,
                    roundValueBeforeRender: true,
                    parent: 'widgets-container'
                }
            ),
            tachometerGauge: new Gauge(
                'tachometer-gauge',
                {
                    top: 60,
                    left: 330,
                    width: 300,
                    height: 300
                },
                {
                    style: 'classic',
                    max: 9,
                    min: 0,
                    size: 360,
                    majorTicks: 10,
                    minorTicks: 4,
                    greenZones: [],
                    yellowZones: [],
                    redZones: [{ from: 7.01, to: 9 }],
                    rotation: -45,
                    parent: 'widgets-container'
                }
            ),
            tachometerGauge2: new Gauge(
                'tachometer-gauge-2',
                {
                    top: 60,
                    left: 645,
                    width: 300,
                    height: 300
                },
                {
                    style: 'sport',
                    size: 225,
                    max: 8,
                    min: 0,
                    majorTicks: 9,
                    greenZones: [],
                    yellowZones: [],
                    redZones: [{ from: 6.4, to: 8 }],
                    rotation: 0,
                    parent: 'widgets-container'
                }
            ),
            waterTempGauge: new Gauge(
                'water-temp-gauge-3',
                {
                    top: 60,
                    left: 960,
                    width: 300,
                    height: 300
                },
                {
                    style: 'grey',
                    size: 170,
                    minorTicks: 4,
                    max: 220,
                    min: 100,
                    initial: 100,
                    label: 'H20',
                    majorTicks: 7,
                    greenZones: [],
                    yellowZones: [],
                    redZones: [{ from: 200.1, to: 219.9 }],
                    rotation: -45,
                    parent: 'widgets-container'
                }
            ),

            tachometerGauge3: new Gauge(
                'tachometer-gauge-3',
                {
                    top: 360,
                    left: 15,
                    width: 300,
                    height: 300
                },
                {
                    style: 'grey',
                    size: 440,
                    minorTicks: 4,
                    max: 9,
                    min: 0,
                    label: 'RPM',
                    majorTicks: 10,
                    greenZones: [],
                    yellowZones: [],
                    redZones: [{ from: 7.01, to: 9 }],
                    rotation: -45,
                    parent: 'widgets-container'
                }
            ),

            turboGauge: new Gauge(
                'turbo-gauge-3',
                {
                    top: 360,
                    left: 330,
                    width: 300,
                    height: 300
                },
                {
                    style: 'grey',
                    size: 170,
                    minorTicks: 4,
                    max: 200,
                    min: 40,
                    initial: 40,
                    label: 'Turbo',
                    majorTicks: 7,
                    greenZones: [],
                    yellowZones: [],
                    redZones: [{ from: 150, to: 200 }],
                    rotation: -45,
                    parent: 'widgets-container'
                }
            ),

            egtGauge: new Gauge(
                'egt-gauge-3',
                {
                    top: 360,
                    left: 645,
                    width: 300,
                    height: 300
                },
                {
                    style: 'grey',
                    size: 170,
                    minorTicks: 4,
                    max: 220,
                    min: 100,
                    initial: 100,
                    label: 'EGT',
                    majorTicks: 7,
                    greenZones: [],
                    yellowZones: [],
                    redZones: [{ from: 200.1, to: 219.9 }],
                    rotation: -45,
                    parent: 'widgets-container'
                }
            ),

            speedometerGauge3: new Gauge(
                'speedometer-gauge-3',
                {
                    top: 360,
                    left: 960,
                    width: 300,
                    height: 300
                },
                {
                    style: 'grey',
                    size: 440,
                    minorTicks: 4,
                    max: 180,
                    min: 0,
                    label: 'Speed',
                    majorTicks: 10,
                    greenZones: [],
                    yellowZones: [],
                    redZones: [{ from: 140.01, to: 180 }],
                    rotation: -45,
                    parent: 'widgets-container'
                }
            ),

            airTempGauge: new Gauge(
                'air-temp-gauge-3',
                {
                    top: 660,
                    left: 15,
                    width: 300,
                    height: 300
                },
                {
                    style: 'grey',
                    size: 170,
                    minorTicks: 4,
                    max: 220,
                    min: 100,
                    initial: 100,
                    label: 'Air Temp',
                    majorTicks: 7,
                    greenZones: [],
                    yellowZones: [],
                    redZones: [{ from: 200.1, to: 219.9 }],
                    rotation: -45,
                    parent: 'widgets-container'
                }
            ),
            remainingFuelGauge: new Gauge(
                'remaining-fuel-gauge-4',
                {
                    top: 660,
                    left: 330,
                    width: 300,
                    height: 300
                },
                {
                    style: 'blue',
                    size: 160,
                    gap: 270,
                    minorTicks: 4,
                    label: "Fuel",
                    max: 1,
                    min: 0,
                    initial: 0,
                    majorTicks: 3,
                    greenZones: [],
                    yellowZones: [],
                    redZones: [{ from: 0, to: 0.125 }],
                    rotation: 0,
                    parent: 'widgets-container'
                }
            ),
            oilTempGauge: new Gauge(
                'oil-temp-gauge-4',
                {
                    top: 660,
                    left: 645,
                    width: 300,
                    height: 300
                },
                {
                    style: 'blue',
                    size: 160,
                    gap: 270,
                    minorTicks: 4,
                    label: "Oil Temp",
                    max: 1,
                    min: 0,
                    initial: 0,
                    majorTicks: 2,
                    greenZones: [],
                    yellowZones: [],
                    redZones: [{ from: 0, to: 0.125 }],
                    rotation: 0,
                    parent: 'widgets-container'
                }
            ),
            speedometerGauge4: new Gauge(
                'speedometer-gauge-4',
                {
                    top: 660,
                    left: 960,
                    width: 300,
                    height: 300
                },
                {
                    style: 'blue',
                    size: 280,
                    gap: 140,
                    minorTicks: 4,
                    label: "Speed",
                    max: 160,
                    min: 0,
                    initial: 0,
                    majorTicks: 9,
                    greenZones: [],
                    yellowZones: [],
                    redZones: [],
                    rotation: 0,
                    roundValueBeforeRender: true,
                    parent: 'widgets-container'
                }
            ),
            tachometerGauge4: new Gauge(
                'tachometer-gauge-4',
                {
                    top: 960,
                    left: 15,
                    width: 300,
                    height: 300
                },
                {
                    style: 'blue',
                    size: 280,
                    gap: 140,
                    minorTicks: 4,
                    label: "RPM",
                    max: 7,
                    min: 0,
                    initial: 0,
                    majorTicks: 8,
                    greenZones: [],
                    yellowZones: [],
                    redZones: [{ from: 5.8, to: 7 }],
                    rotation: 0,
                    parent: 'widgets-container'
                }
            ),
        };



        // ---------------- DASHBOARD INTERACTION ------------------
        dashboards.controls.up = new Button("accelerate", { width: 0, height: 0 }, {
            callback: onMessageReceived,
            evts: ['press/release'],
            keyCode: 38 // key up
        });
        dashboards.controls.down = new Button("brake", { width: 0, height: 0 }, {
            callback: onMessageReceived,
            evts: ['press/release'],
            keyCode: 40 // key down
        });


        // Render car dashboard components
        function render(res) {
            dashboards.widgets.speedometerGauge.render(evaluate(res.speed.val));
            dashboards.widgets.tachometerGauge.render(evaluate(res.rpm));
            dashboards.widgets.tachometerGauge2.render(evaluate(res.rpm));

            // Dashboard 3 elements
            dashboards.widgets.speedometerGauge3.render(evaluate(res.speed.val));
            dashboards.widgets.tachometerGauge3.render(evaluate(res.rpm));
            // No data yet
            dashboards.widgets.waterTempGauge.render(res);
            dashboards.widgets.turboGauge.render(res);
            dashboards.widgets.egtGauge.render(res);
            dashboards.widgets.airTempGauge.render(res);

            // Dashboard 4 elements
            dashboards.widgets.speedometerGauge4.render(evaluate(res.speed.val));
            dashboards.widgets.tachometerGauge4.render(evaluate(res.rpm));
            // No data yet
            dashboards.widgets.oilTempGauge.render(res);
            dashboards.widgets.remainingFuelGauge.render(res);
        }

        var demoFolder = "d3-gauge-plus-library";
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
