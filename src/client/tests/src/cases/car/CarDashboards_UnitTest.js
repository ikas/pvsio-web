/** @module CarDashboards_UnitTest */
/**
 * CarDashboards_UnitTest is a test module for Car Dashboards project.
 * @author Henrique Pacheco
 * @date 12/10/17
 *
 */
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50*/
/*global define, describe, expect, it, Promise, d3, beforeAll, afterAll*///, xdescribe*/
define(function (require, exports, module) {
    "use strict";

    var GaugeSport = require("widgets/car/GaugeSport");
    var Gearbox = require("widgets/car/Gearbox");
    var Pointer = require("widgets/car/Pointer");
    var Clock = require("widgets/car/Clock");

    var instance;
    var success, fail, cTest, fTest;
    var header, summary;
    var txt;

    function CarDashboards_UnitTest() {
        success = fail = cTest = fTest = 0;
        header = "\n------ Console log for CarDashboards UnitTest -------------------";
        summary = "\n------ Unit test for CarDashboards --------------------";
        return this;
    }

    // utility functions
    function printSummary() {
        summary += "\n\n--------------------------------------------------------";
        summary += "\n Success: " + success + "/" + (cTest + fTest);
        summary += "\n Fail   : " + fail + "/" + (cTest + fTest);
        summary += "\n--------------------------------------------------------\n";
        console.log(summary);
        return summary;
    }
    function addSuccess(msg) {
        success++;
        summary += "[ok]";
        if (msg) { summary += "\n" + msg; }
    }
    function addFail(msg) {
        fail++;
        summary += "[FAIL]";
        if (msg) { summary += "\n" + msg; }
    }


    function getWidget(type, id, coords, opt) {
        id = id || 'id';
        coords = coords || {} ;
        opt = opt || {};

        switch (type) {
            case 'gearbox':
                return new Gearbox(id, coords, opt);
            case 'gauge-sport':
                return new GaugeSport(id, coords, opt);
            case 'pointer':
                return new Pointer(id, coords, opt);
            case 'clock':
                return new Clock(id, coords, opt);
        }

        return null;
    }

    function getPromiseForWidget(widget, type) {
        return new Promise(function (resolve, reject) {
            switch(type) {
                case 'value':
                    resolve(widget.getValue());
                    break;
                default:
                    resolve(widget.getId());
                    break;
            }
        });
    }


    function runAllTests() {

        describe("GaugeSport widget tests", function () {
            it("invokes basic GaugeSport widget", function (done) {
                var widget = getWidget('gauge-sport', 'gs1', { top: 500, left: 0 });
                var promise = getPromiseForWidget(widget);
                promise.then(function (res) {
                    expect(res).toBeDefined();
                    done();
                }).catch(function (err) {
                    expect(err).toBeFalsy();
                    done();
                });
            });

            it("invokes GaugeSport widget using defined style", function (done) {
                var widget = getWidget('gauge-sport', 'gs2', { top: 500, left: 250 }, { style: 'tachometer' });
                var promise = getPromiseForWidget(widget);
                promise.then(function (res) {
                    expect(res).toBeDefined();
                    done();
                }).catch(function (err) {
                    expect(err).toBeFalsy();
                    done();
                });
            });

            it("renders GaugeSport widget after constructor", function (done) {
                var widget = getWidget('gauge-sport', 'gs3', { top: 500, left: 500 }, { style: 'tachometer' });
                // TODO setTimeout isn't the best solution :(
                // Widget constructor should return promise
                setTimeout(function () {
                    widget.render(5);
                    var promise = getPromiseForWidget(widget, 'value');
                    promise.then(function (res) {
                        expect(res).toBe(5);
                        done();
                    }).catch(function (err) {
                        expect(err).toBeFalsy();
                        done();
                    });
                }, 1000);
            });
        });

        describe("Gearbox widget tests", function () {
            it("invokes basic Gearbox widget", function (done) {
                var widget = getWidget('gearbox', 'gb1', { top: 750, left: 0 });
                var promise = getPromiseForWidget(widget);
                promise.then(function (res) {
                    expect(res).toBeDefined();
                    done();
                }).catch(function (err) {
                    expect(err).toBeFalsy();
                    done();
                });
            });

            it("invokes Gearbox widget using defined style", function (done) {
                var widget = getWidget('gearbox', 'gb2', { top: 750, left: 250 });
                var promise = getPromiseForWidget(widget);
                promise.then(function (res) {
                    expect(res).toBeDefined();
                    done();
                }).catch(function (err) {
                    expect(err).toBeFalsy();
                    done();
                });
            });

            it("renders Gearbox widget after constructor", function (done) {
                var widget = getWidget('gearbox', 'gb3', { top: 750, left: 500 });
                // TODO setTimeout isn't the best solution :(
                // Widget constructor should return promise
                setTimeout(function () {
                    widget.render('D');
                    var promise = getPromiseForWidget(widget, 'value');
                    promise.then(function (res) {
                        expect(res).toBe('D');
                        done();
                    }).catch(function (err) {
                        expect(err).toBeFalsy();
                        done();
                    });
                }, 1000);
            });
        });

        describe("Clock widget tests", function () {
            it("invokes basic Clock widget", function (done) {
                var widget = getWidget('clock', 'cl1', { top: 1000, left: 0 });
                var promise = getPromiseForWidget(widget);
                promise.then(function (res) {
                    expect(res).toBeDefined();
                    done();
                }).catch(function (err) {
                    expect(err).toBeFalsy();
                    done();
                });
            });

            it("invokes Clock widget using defined style", function (done) {
                var widget = getWidget('clock', 'cl2', { top: 1000, left: 250 });
                var promise = getPromiseForWidget(widget);
                promise.then(function (res) {
                    expect(res).toBeDefined();
                    done();
                }).catch(function (err) {
                    expect(err).toBeFalsy();
                    done();
                });
            });

            it("renders Clock widget after constructor", function (done) {
                var widget = getWidget(
                    'clock',
                    'cl3',
                    { top: 1000, left: 500 }
                );
                // TODO setTimeout isn't the best solution :(
                // Widget constructor should return promise
                setTimeout(function () {
                    widget.render();
                    var promise = getPromiseForWidget(widget, 'value');
                    promise.then(function (res) {
                        expect(res).toBeDefined();
                        done();
                    }).catch(function (err) {
                        expect(err).toBeFalsy();
                        done();
                    });
                }, 1000);
            });
        });

        describe("Pointer widget tests", function () {
            it("invokes basic Pointer widget", function (done) {
                var widget = getWidget('pointer', 'pt1', { top: 1250, left: 50, width: 50 });
                var promise = getPromiseForWidget(widget);
                promise.then(function (res) {
                    expect(res).toBeDefined();
                    done();
                }).catch(function (err) {
                    expect(err).toBeFalsy();
                    done();
                });
            });

            it("invokes Pointer widget using defined style", function (done) {
                var widget = getWidget('pointer', 'pt2', { top: 1250, left: 300, width: 50 });
                var promise = getPromiseForWidget(widget);
                promise.then(function (res) {
                    expect(res).toBeDefined();
                    done();
                }).catch(function (err) {
                    expect(err).toBeFalsy();
                    done();
                });
            });

            it("renders Pointer widget after constructor", function (done) {
                var widget = getWidget(
                    'pointer',
                    'pt3',
                    { top: 1250, left: 550, width: 50 },
                    { style: 'gauge-pointer-3' }
                );
                // TODO setTimeout isn't the best solution :(
                // Widget constructor should return promise
                setTimeout(function () {
                    widget.render(270);
                    var promise = getPromiseForWidget(widget, 'value');
                    promise.then(function (res) {
                        expect(res).toBe(270);
                        done();
                    }).catch(function (err) {
                        expect(err).toBeFalsy();
                        done();
                    });
                }, 1000);
            });
        });
    }

    CarDashboards_UnitTest.prototype.run = function () {
        return runAllTests();
    };

    module.exports = {
        getInstance: function () {
            if (!instance) {
                instance = new CarDashboards_UnitTest();
            }
            return instance;
        },
        run: CarDashboards_UnitTest.run
    };
});
