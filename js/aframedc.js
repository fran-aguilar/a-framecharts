(function () {
    function _aframedc() {
        var aframedc = {
            version: '0.0.1',
            DEFAULT_CHART_GROUP: "__defaultgroup__"
        };
        aframedc.dashBoard = function (containerdiv) {
            var actualscene = document.createElement("a-scene");
            actualscene.setAttribute('embedded',{});
            containerdiv.appendChild(actualscene);
            var odashboard = {
                _domEl: actualscene,
                chartRegistry : (function () {
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
                })(),
                addPanel: function (panel) {
                    this.chartRegistry.register(panel);
                    this._domEl.appendChild(panel._domEl);
                    return this;
                },
                addChart: function (chart) {
                    this.chartRegistry.register(chart);
                    this._domEl.appendChild(chart._domEl);
                    return this;
                },
                renderAll : function () {
                    var charts = this.chartRegistry.list();
                    for (var i = 0; i < charts.length; i++) {
                        charts[i].render();
                    }
                    return this;
                }
            }
            return odashboard;
        }
        

        aframedc.pieChart = function () {
            var element = document.createElement('a-entity');
            element.setAttribute('piechart', {});
            var opieChart = {
                _domEl: element,
                render: function () {
                    if (this._domEl.isPlaying) {
                        this._domEl.emit('data-loaded');
                    } else {
                        var thatel = this._domEl;
                        this._domEl.addEventListener('loaded', function (ev) {
                            thatel.emit('data-loaded');
                        });
                    }
                    return this;
                },
                data: function (newdata) {
                    this._domEl._data = newdata;
                    return this;
                },
                depth: function (newdepth) {
                    this._domEl.setAttribute("piechart", "depth", newdepth);
                    return this;
                }
            }
            return opieChart;
        };

        return aframedc;
    };
    this.aframedc = _aframedc();
})();