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

        // ---------------- CURRENT SHIFT ----------------
        var shiftDisplay = new Shift('current-shift');
        shiftDisplay.render();

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
        }

        // Call at all times moveCar and friction methods from time to time
        d3.timer(moveCar);
        d3.timer(friction);
    });