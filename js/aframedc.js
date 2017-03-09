(function () {
    function _aframedc2() {
        var aframedc = {
            version: '0.0.1',
            allDashBoards: []
        };
        aframedc.baseMixin = function (_chart, cName) {

            if (!_chart || !_chart instanceof HTMLElement) {
                _chart = document.createElement('a-entity');
                _chart.setAttribute(cName, {});
            }
            
            _chart._data = _chart._data;
            _chart.data = function (newdata) {
                _chart._data = newdata;
                //if (_chart.emit) {
                //    _chart.emit('data-loaded');
                //}
                return _chart;
            };
            _chart.width = function (newwidth) {
                _chart.setAttribute(cName, 'width', newwidth);
                return _chart;
            };
            _chart.height = function (newheight) {
                _chart.setAttribute(cName, 'height', newheight);
                return _chart;
            };
            _chart.depth = function (newhdepth) {
                _chart.setAttribute(cName, 'depth', newhdepth);
                return _chart;
            };
            _chart.color = function (newColor) {
                _chart.setAttribute(cName, 'color', newColor);
                return _chart;
            };
            //abstract
            _chart.render = function () {
                ;
            };
            return _chart;
        };
        aframedc.barChart = function (_chart, cName) {

            _chart = aframedc.baseMixin(_chart, cName ||"barchart");
            _chart.render = function () {
                if (_chart._data && _chart._data.length > 0) {
                    if (_chart._parentDashBoard) {
                        //search for a-frame scene.
                        if (!_chart.sceneEl) {
                            _chart._parentDashBoard.sceneEl.appendChild(_chart);
                        } else {
                            _chart.emit('data-loaded');
                        }
                    } else if (_chart.sceneEl) {
                        _chart.emit('data-loaded');
                    }
                }
                return _chart;
            };
            return _chart;
        };
        aframedc.dashBoard = function (dhbElement, scene) {
            if (!scene || !scene instanceof HTMLElement) x.p.l.o.d.e;
            var _dhbElement = dhbElement;
            if (!dhbElement || !dhbElement instanceof HTMLElement) {
                _dhbElement = document.createElement('a-entity');
                
            }
            _dhbElement.allCharts = [];
            _dhbElement.allPanels = [];
            _dhbElement.addChart = function (_chart) {
                if (!arguments || arguments.length === 0) {
                    return console.log("arg needed");
                }
                _dhbElement.allCharts.push(_chart);
                _chart._parentDashBoard = _dhbElement;
            };
            _dhbElement.render = function () {
                for (var i = 0 ; i < _dhbElement.allCharts.length; i++) {
                    _dhbElement.allCharts[i].render();
                }
                for (var i = 0; i < _dhbElement.allPanels.length; i++) {
                    _dhbElement.allPanels[i].render();
                }
            }
            //attach dashboard.
            if (!_dhbElement.sceneEl) {
                scene.appendChild(_dhbElement);
            }
            
            aframedc.allDashBoards.push(_dhbElement);
            return _dhbElement;
        }
        aframedc.renderAll = function () {
            for (var i = 0; i< aframedc.allDashBoards.length; i++) {
                aframedc.allDashBoards[i].render();
            }
        };
        return aframedc;
    }
    this.aframedc = _aframedc2();
})();