(function () {
    function _aframedc() {
        var aframedc = {
            version: '0.0.1',
            DEFAULT_CHART_GROUP: '__defaultgroup__'
        };
        aframedc.initscene = function () {
            var actualscene = document.createElement("a-scene");
            document.body.appendChild(actualscene);
            aframedc.containerScene = actualscene;
            return actualscene;
        }
        //inspirado en dc js
        aframedc.chartRegistry = (function () {
            var _chartMap = {};
            function initializeChartGroup(group) {
                if (!group) {
                    group = aframedc.DEFAULT_CHART_GROUP;
                }

                if (!_chartMap[group]) {
                    _chartMap[group] = [];
                }

                return group;
            }

            return {
                register: function (chart, group) {
                    group = initializeChartGroup(group);
                    _chartMap[group].push(chart);
                },
                list: function (group) {
                    group = initializeChartGroup(group);
                    return _chartMap[group];
                }
            };
        })();

        aframedc.pieChart = function () {
            element = document.createElement('a-entity');
            element.setAttribute('piechart', {});
            aframedc.containerScene.appendChild(element);
            _chart = element;
            aframedc.chartRegistry.register(_chart);
            return _chart;
        };
        aframedc.renderAll = function () {
            var charts = aframedc.chartRegistry.list();
            for (var i = 0; i < charts.length; i++) {
                charts[i].render();
            }
        };
        return aframedc;
    };
    this.aframedc = _aframedc();
})();