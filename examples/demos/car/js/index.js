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

        // ----------------------------- DASHBOARD COMPONENTS -----------------------------
        var dashboards = {
            controls: {},
            car1: {},
            car2: {},
            car3: {},
            car4: {}
        };

        // DASHBOARD 1
        dashboards.car1 = {
            speedometerGauge: new Gauge(
                'speedometer-gauge',
                {
                    top: 160,
                    left: 13,
                    width: 360,
                    height: 360
                },
                {
                    position: "relative",
                    max: 360,
                    majorTicks: 13,
                    min: 0,
                    redZones: [],
                    innerFillColor: "#2c2b30",
                    pointerFillColor: "#e93947",
                    pointerStrokeColor: "#150507",
                    pointerShowLabel: false,
                    pointerUseBaseCircle: true,
                    pointerBaseCircleAbovePointer: true,
                    pointerBaseCircleFillColor: "#65686d",
                    pointerBaseCircleStrokeColor: "#000",
                    pointerBaseCircleStrokeWidth: "2px",
                    rotation: -45
                }
            ),

            tachometerGauge: new Gauge(
                'tachometer-gauge',
                {
                    top: 160,
                    left: 50,
                    width: 360,
                    height: 360
                },
                {
                    position: "relative",
                    max: 9,
                    min: 0,
                    majorTicks: 10,
                    minorTicks: 4,
                    greenZones: [],
                    yellowZones: [],
                    redZones: [{ from: 7.01, to: 9 }],
                    innerFillColor: "#2c2b30",
                    pointerFillColor: "#e93947",
                    pointerStrokeColor: "#150507",
                    pointerShowLabel: false,
                    pointerUseBaseCircle: true,
                    pointerBaseCircleAbovePointer: true,
                    pointerBaseCircleFillColor: "#65686d",
                    pointerBaseCircleStrokeColor: "#000",
                    pointerBaseCircleStrokeWidth: "2px",
                    rotation: -45
                }
            ),
            centralPanel: new CentralPanel('central-panel', {
                backgroundColor: "#2b2d33"
            })
        };


        // DASHBOARD 2
        dashboards.car2 = {
            tachometerGauge: new Gauge(
                'tachometer-gauge-2', 
                {
                    top: 246,
                    left: 654,
                    width: 360,
                    height: 360
                },
                {
                    position: "relative",
                    size: 225,
                    max: 8,
                    min: 0,
                    majorTicks: 9,
                    greenZones: [],
                    yellowZones: [],
                    redZones: [{ from: 6.4, to: 8 }],
                    innerFillColor: "#2c2b30",
                    pointerFillColor: "#a2302d",
                    pointerStrokeColor: "#e2d9df",
                    pointerShowLabel: false,
                    pointerUseBaseCircle: true,
                    pointerBaseCircleFillColor: "#131418",
                    pointerBaseCircleStrokeColor: "#131418",
                    pointerBaseCircleRadius: 0.15,
                    rotation: 0
                }
            )
        };


        // DASHBOARD 3
        dashboards.car3 = {
            waterTempGauge: new Gauge(
                'water-temp-gauge-3',
                {
                    top: 91,
                    left: 7,
                    width: 360,
                    height: 360
                },
                {
                    position: "relative",
                    size: 170,
                    drawOuterCircle: true,
                    outerStrokeColor: "#838286",
                    outerFillColor: "#838286",
                    innerStrokeColor: "888",
                    innerFillColor: "#fff",
                    majorTickColor: "#000",
                    majorTickWidth: "2px",
                    minorTicks: 4,
                    minorTickColor: "#000",
                    max: 220,
                    min: 100,
                    initial: 100,
                    label: 'H20',
                    majorTicks: 7,
                    greenZones: [],
                    yellowZones: [],
                    redZones: [{ from: 200.1, to: 219.9 }],
                    pointerFillColor: "#dc555a",
                    pointerStrokeColor: "#6f6e73",
                    pointerShowLabel: false,
                    pointerUseBaseCircle: true,
                    pointerBaseCircleAbovePointer: true,
                    pointerBaseCircleFillColor: "#838286",
                    pointerBaseCircleStrokeColor: "#838286",
                    pointerBaseCircleRadius: 0.2,
                    rotation: -45
                }
            ),
            tachometerGauge: new Gauge(
                'tachometer-gauge-3',
                {
                    top: 118,
                    left: -64,
                    width: 360,
                    height: 360
                },
                {
                    position: "relative",
                    size: 440,
                    drawOuterCircle: true,
                    outerStrokeColor: "#838286",
                    outerFillColor: "#838286",
                    innerStrokeColor: "888",
                    innerFillColor: "#fff",
                    majorTickColor: "#000",
                    majorTickWidth: "2px",
                    minorTicks: 4,
                    minorTickColor: "#000",
                    max: 9,
                    min: 0,
                    label: 'RPM',
                    majorTicks: 10,
                    greenZones: [],
                    yellowZones: [],
                    redZones: [{ from: 7.01, to: 9 }],
                    pointerFillColor: "#dc555a",
                    pointerStrokeColor: "#6f6e73",
                    pointerShowLabel: false,
                    pointerUseBaseCircle: true,
                    pointerBaseCircleAbovePointer: true,
                    pointerBaseCircleFillColor: "#838286",
                    pointerBaseCircleStrokeColor: "#838286",
                    pointerBaseCircleRadius: 0.18,
                    rotation: -45
                }
            ),
            turboGauge: new Gauge(
                'turbo-gauge-3',
                {
                    top: 74,
                    left: -91,
                    width: 360,
                    height: 360
                },
                {
                    position: "relative",
                    size: 170,
                    drawOuterCircle: true,
                    outerStrokeColor: "#838286",
                    outerFillColor: "#838286",
                    innerStrokeColor: "888",
                    innerFillColor: "#fff",
                    majorTickColor: "#000",
                    majorTickWidth: "2px",
                    minorTicks: 4,
                    minorTickColor: "#000",
                    max: 200,
                    min: 40,
                    initial: 40,
                    label: 'Turbo',
                    majorTicks: 7,
                    greenZones: [],
                    yellowZones: [],
                    redZones: [{ from: 150, to: 200 }],
                    pointerFillColor: "#dc555a",
                    pointerStrokeColor: "#6f6e73",
                    pointerShowLabel: false,
                    pointerUseBaseCircle: true,
                    pointerBaseCircleAbovePointer: true,
                    pointerBaseCircleFillColor: "#838286",
                    pointerBaseCircleStrokeColor: "#838286",
                    pointerBaseCircleRadius: 0.2,
                    rotation: -45
                }
            ),
            egtGauge: new Gauge(
                'egt-gauge-3',
                {
                    top: 405,
                    left: -244,
                    width: 360,
                    height: 360
                },
                {
                    position: "relative",
                    size: 170,
                    drawOuterCircle: true,
                    outerStrokeColor: "#838286",
                    outerFillColor: "#838286",
                    innerStrokeColor: "888",
                    innerFillColor: "#fff",
                    majorTickColor: "#000",
                    majorTickWidth: "2px",
                    minorTicks: 4,
                    minorTickColor: "#000",
                    max: 220,
                    min: 100,
                    initial: 100,
                    label: 'EGT',
                    majorTicks: 7,
                    greenZones: [],
                    yellowZones: [],
                    redZones: [{ from: 200.1, to: 219.9 }],
                    pointerFillColor: "#dc555a",
                    pointerStrokeColor: "#6f6e73",
                    pointerShowLabel: false,
                    pointerUseBaseCircle: true,
                    pointerBaseCircleAbovePointer: true,
                    pointerBaseCircleFillColor: "#838286",
                    pointerBaseCircleStrokeColor: "#838286",
                    pointerBaseCircleRadius: 0.2,
                    rotation: -45
                }
            ),
            speedometerGauge: new Gauge(
                'speedometer-gauge-3',
                {
                    top: 118,
                    left: -308,
                    width: 360,
                    height: 360
                },
                {
                    position: "relative",
                    size: 440,
                    drawOuterCircle: true,
                    outerStrokeColor: "#838286",
                    outerFillColor: "#838286",
                    innerStrokeColor: "888",
                    innerFillColor: "#fff",
                    majorTickColor: "#000",
                    majorTickWidth: "2px",
                    minorTicks: 4,
                    minorTickColor: "#000",
                    max: 180,
                    min: 0,
                    label: 'Speed',
                    majorTicks: 10,
                    greenZones: [],
                    yellowZones: [],
                    redZones: [{ from: 140.01, to: 180 }],
                    pointerFillColor: "#dc555a",
                    pointerStrokeColor: "#6f6e73",
                    pointerShowLabel: false,
                    pointerUseBaseCircle: true,
                    pointerBaseCircleAbovePointer: true,
                    pointerBaseCircleFillColor: "#838286",
                    pointerBaseCircleStrokeColor: "#838286",
                    pointerBaseCircleRadius: 0.18,
                    rotation: -45
                }
            ),
            airTempGauge: new Gauge(
                'air-temp-gauge-3',
                {
                    top: 91,
                    left: -346,
                    width: 360,
                    height: 360
                },
                {
                    position: "relative",
                    size: 170,
                    drawOuterCircle: true,
                    outerStrokeColor: "#838286",
                    outerFillColor: "#838286",
                    innerStrokeColor: "888",
                    innerFillColor: "#fff",
                    majorTickColor: "#000",
                    majorTickWidth: "2px",
                    minorTicks: 4,
                    minorTickColor: "#000",
                    max: 220,
                    min: 100,
                    initial: 100,
                    label: 'Air Temp',
                    majorTicks: 7,
                    greenZones: [],
                    yellowZones: [],
                    redZones: [{ from: 200.1, to: 219.9 }],
                    pointerFillColor: "#dc555a",
                    pointerStrokeColor: "#6f6e73",
                    pointerShowLabel: false,
                    pointerUseBaseCircle: true,
                    pointerBaseCircleAbovePointer: true,
                    pointerBaseCircleFillColor: "#838286",
                    pointerBaseCircleStrokeColor: "#838286",
                    pointerBaseCircleRadius: 0.2,
                    rotation: -45
                }
            )
        };


        // DASHBOARD 4
        dashboards.car4 = {
            remainingFuelGauge: new Gauge(
                'remaining-fuel-gauge-4',
                {
                    top: 290,
                    left: 89,
                    width: 360,
                    height: 360
                },
                {
                    position: "relative",
                    size: 160,
                    gap: 270,
                    outerStrokeColor: "#599bcf",
                    outerFillColor: "#599bcf",
                    innerStrokeColor: "#599bcf",
                    innerFillColor: "#599bcf",
                    majorTickColor: "#000",
                    majorTickWidth: "2px",
                    minorTicks: 4,
                    minorTickColor: "#000",
                    label: "Fuel",
                    labelColor: "#000",
                    max: 1,
                    min: 0,
                    initial: 0,
                    majorTicks: 3,
                    greenZones: [],
                    yellowZones: [],
                    redZones: [{ from: 0, to: 0.125 }],
                    pointerFillColor: "#290107",
                    pointerStrokeColor: "#290107",
                    pointerShowLabel: false,
                    pointerUseBaseCircle: true,
                    pointerBaseCircleFillColor: "#3f4552",
                    pointerBaseCircleStrokeColor: "#3f4552",
                    pointerBaseCircleRadius: 0.2,
                    rotation: 0
                }
            ),
            oilTempGauge: new Gauge(
                'oil-temp-gauge-4', 
                {
                    top: 268,
                    left: -9,
                    width: 360,
                    height: 360
                },
                {
                    position: "relative",
                    size: 160,
                    gap: 270,
                    outerStrokeColor: "#599bcf",
                    outerFillColor: "#599bcf",
                    innerStrokeColor: "#599bcf",
                    innerFillColor: "#599bcf",
                    majorTickColor: "#000",
                    majorTickWidth: "2px",
                    minorTicks: 4,
                    minorTickColor: "#000",
                    label: "Oil Temp",
                    labelColor: "#000",
                    max: 1,
                    min: 0,
                    initial: 0,
                    majorTicks: 2,
                    greenZones: [],
                    yellowZones: [],
                    redZones: [{ from: 0, to: 0.125 }],
                    pointerFillColor: "#290107",
                    pointerStrokeColor: "#290107",
                    pointerShowLabel: false,
                    pointerUseBaseCircle: true,
                    pointerBaseCircleFillColor: "#3f4552",
                    pointerBaseCircleStrokeColor: "#3f4552",
                    pointerBaseCircleRadius: 0.2,
                    rotation: 0
                }
            ),
            speedometerGauge: new Gauge(
                'speedometer-gauge-4',
                {
                    top: 148,
                    left: -23,
                    width: 360,
                    height: 360
                },
                {
                    position: "relative",
                    size: 280,
                    gap: 140,
                    outerStrokeColor: "#599bcf",
                    outerFillColor: "#599bcf",
                    innerStrokeColor: "#599bcf",
                    innerFillColor: "#599bcf",
                    majorTickColor: "#000",
                    majorTickWidth: "2px",
                    minorTicks: 4,
                    minorTickColor: "#000",
                    label: "Speed",
                    labelColor: "#000",
                    max: 160,
                    min: 0,
                    initial: 0,
                    majorTicks: 9,
                    greenZones: [],
                    yellowZones: [],
                    redZones: [],
                    pointerFillColor: "#290107",
                    pointerStrokeColor: "#290107",
                    pointerShowLabel: false,
                    pointerUseBaseCircle: true,
                    pointerBaseCircleFillColor: "#3f4552",
                    pointerBaseCircleStrokeColor: "#3f4552",
                    pointerBaseCircleRadius: 0.2,
                    rotation: 0
                }
            ),
            tachometerGauge: new Gauge(
                'tachometer-gauge-4',
                {
                    top: 140,
                    left: -4,
                    width: 360,
                    height: 360
                },
                {
                    position: "relative",
                    size: 280,
                    gap: 140,
                    outerStrokeColor: "#599bcf",
                    outerFillColor: "#599bcf",
                    innerStrokeColor: "#599bcf",
                    innerFillColor: "#599bcf",
                    majorTickColor: "#000",
                    majorTickWidth: "2px",
                    minorTicks: 4,
                    minorTickColor: "#000",
                    label: "RPM",
                    labelColor: "#000",
                    max: 7,
                    min: 0,
                    initial: 0,
                    majorTicks: 8,
                    greenZones: [],
                    yellowZones: [],
                    redZones: [{ from: 5.8, to: 7 }],
                    pointerFillColor: "#290107",
                    pointerStrokeColor: "#290107",
                    pointerShowLabel: false,
                    pointerUseBaseCircle: true,
                    pointerBaseCircleFillColor: "#3f4552",
                    pointerBaseCircleStrokeColor: "#3f4552",
                    pointerBaseCircleRadius: 0.2,
                    rotation: 0
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
            dashboards.car1.speedometerGauge.render(Math.round(evaluate(res.speed.val)));
            dashboards.car1.tachometerGauge.render(evaluate(res.rpm));
            dashboards.car1.centralPanel.render(res);

            dashboards.car2.tachometerGauge.render(evaluate(res.rpm));

            // No data yet
            // dashboards.car3.airTempGauge.render(evaluate(res.rpm));
            // dashboards.car3.egtGauge.render(evaluate(res.rpm));
            // dashboards.car3.turboGauge.render(evaluate(res.rpm));
            // dashboards.car3.waterTempGauge.render(evaluate(res.rpm));
            dashboards.car3.speedometerGauge.render(Math.round(evaluate(res.speed.val)));
            dashboards.car3.tachometerGauge.render(evaluate(res.rpm));

            // No data yet
            // dashboards.car4.oilTempGauge.render(evaluate(res.rpm));
            // dashboards.car4.remainingFuelGauge.render(evaluate(res.rpm));
            dashboards.car4.speedometerGauge.render(Math.round(evaluate(res.speed.val)));
            dashboards.car4.tachometerGauge.render(evaluate(res.rpm));
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
