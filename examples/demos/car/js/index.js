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
            speedometerGauge: new Gauge('speedometer-gauge', {
                max: 360,
                majorTicks: 13,
                min: 0,
                redZones: []
            }),
            
            tachometerGauge: new Gauge('tachometer-gauge', {
                max: 9,
                min: 0,
                majorTicks: 10,
                greenZones: [],
                yellowZones: [],
                redZones: [{ from: 7.01, to: 9 }]
            }),
            centralPanel: new CentralPanel('central-panel', {})
        };


        // DASHBOARD 2
        dashboards.car2 = {
            tachometerGauge: new Gauge('tachometer-gauge-2', {
                size: 225,
                max: 8,
                min: 0,
                majorTicks: 9,
                greenZones: [],
                yellowZones: [],
                redZones: [{ from: 6.4, to: 8 }]
            })
        };

        
        // DASHBOARD 3
        dashboards.car3 = {
            waterTempGauge: new Gauge('water-temp-gauge-3', {
                size: 170,
                drawOuterCircle: true,
                outerStrokeColor: "#ccc",
                outerFillColor: "#aaa",
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
                redZones: [{ from: 200.1, to: 219.9 }]
            }),
            tachometerGauge: new Gauge('tachometer-gauge-3', {
                size: 440,
                drawOuterCircle: true,
                outerStrokeColor: "#ccc",
                outerFillColor: "#aaa",
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
                redZones: [{ from: 7.01, to: 9 }]
            }),
            turboGauge: new Gauge('turbo-gauge-3', {
                size: 170,
                drawOuterCircle: true,
                outerStrokeColor: "#ccc",
                outerFillColor: "#aaa",
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
                redZones: [{ from: 150, to: 200 }]
            }),
            egtGauge: new Gauge('egt-gauge-3', {
                size: 170,
                drawOuterCircle: true,
                outerStrokeColor: "#ccc",
                outerFillColor: "#aaa",
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
                redZones: [{ from: 200.1, to: 219.9 }]
            }),
            speedometerGauge: new Gauge('speedometer-gauge-3', {
                size: 440,
                drawOuterCircle: true,
                outerStrokeColor: "#ccc",
                outerFillColor: "#aaa",
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
                redZones: [{ from: 140.01, to: 180 }]
            }),
            airTempGauge: new Gauge('air-temp-gauge-3', {
                size: 170,
                drawOuterCircle: true,
                outerStrokeColor: "#ccc",
                outerFillColor: "#aaa",
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
                redZones: [{ from: 200.1, to: 219.9 }]
            })
        };

        
        // DASHBOARD 4
        dashboards.car4 = {
            remainingFuelGauge: new Gauge('remaining-fuel-gauge-4', {
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
                redZones: [{ from: 0, to: 0.125 }]
            }),
            oilTempGauge: new Gauge('oil-temp-gauge-4', {
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
                redZones: [{ from: 0, to: 0.125 }]
            }),
            speedometerGauge: new Gauge('speedometer-gauge-4', {
                size: 280,
                gap: 200,
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
                redZones: []
            }),
            tachometerGauge: new Gauge('tachometer-gauge-4', {
                size: 280,
                gap: 200,
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
                redZones: [{ from: 5.8, to: 7 }]
            }),
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