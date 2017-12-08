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
        "widgets/car/CentralPanel",
        "widgets/car/GaugeSport",
        "widgets/car/Gauge",
        "widgets/car/Gearbox",
        "widgets/car/Clock",
        "widgets/car/Pointer",
        "widgets/ButtonActionsQueue",
        "stateParser",
        "PVSioWebClient"
    ], function (
        Button,
        CentralPanel,
        GaugeSport,
        Gauge,
        Gearbox,
        Clock,
        Pointer,
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

        // var config, range;
        // config = {
        //     size: 500,
        //     rotation: -45,
        //     gap: 90,
        //     drawOuterCircle: false,
        //     innerStrokeColor: "#fff",
        //     min: 0,
        //     max: 10,
        //     initial: 0,
        //     transitionDuration: 300
        // };
        // range = config.max - config.min;

        // function zone(start, end) {
        //     return { from: config.min + range * start, to: config.min + range * end };
        // }

        // config.greenZones = [];
        // config.yellowZones = [];
        // config.redZones = [zone(0.9, 1)];
        // var d3gauge = new d3_gauge_plus.Gauge('content', config);
        // d3gauge.render();


var clock = new Gearbox(
    'id-clock',
    { top: 100, left: 100 },
    {
        panel: 'gear-box-auto.svg',
        stick: 'gear-stick.svg',
        leftOffsets: {
            1: 0.345,
            2: 0.345,
            3: 0.345,
            4: 0.345,
            5: 0.345,
            6: 0.345,
            'D': 0.345,
            'N': 0.345,
            'R': 0.345,
            'P': 0.345,
        },
        topOffsets: {
            1: 0.55,
            2: 0.55,
            3: 0.55,
            4: 0.55,
            5: 0.55,
            6: 0.55,
            'D': 0.55,
            'N': 0.4,
            'R': 0.25,
            'P': 0,
        }
    }
);

clock.render();

// Render widgets
function render(res) {
    clock.render();
    // pointer.render(res);
    // example2.render();
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
