(function () {
    function _aframedc() {
        var aframedc = {
            version: '0.0.1',
            DEFAULT_CHART_GROUP: "__defaultgroup__"
        };
        aframedc.dashBoard = function (scene) {
            var dashEntity = document.createElement("a-entity");
            dashEntity.id = "aframedc";
            scene.appendChild(dashEntity);
            var odashboard = dashEntity;
            odashboard.chartRegistry = (function () {
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
            odashboard.addPanel = function (panel) {
                this.chartRegistry.register(panel);
                this.appendChild(panel);
                var listOfCharts  = panel.chartRegistry.list();
                for (var i = 0; i < listOfCharts.length; i++) {
                    panel.appendChild(listOfCharts[i]);
                }
                panel.render();
                return this;
            };
            odashboard.addChart =function (chart) {
                this.chartRegistry.register(chart);
                this.appendChild(chart);
                chart.render();
                return this;
            };

            return odashboard;
        }
        var baseMixin = {
            componentName: "", //filled on every chart
            render: function () {
                var thatel = this;
                function __emitrender(){
                    thatel.emit('data-loaded');
                };
                if (this.hasLoaded) {
                    __emitrender();
                } else {
                   this.addEventListener('loaded', __emitrender);
                }
                return this;
            },
            data : function (newdata) {
                this._data = newdata;
                return this;
            },
            dimension: function (newdata) {
                this._dimension = newdata;
                return this;
            },
            group: function (newdata) {
                this._group = newdata;
                return this;
            },
            depth: function (newdepth) {
                this.setAttribute(this.componentName, "depth", newdepth);
                return this;

            },
            color: function (newcolor) {
                this.setAttribute(this.componentName,"color", newcolor);
            }
        };
        aframedc.Panel = function () {
            var compName = "panel";
            this.componentName = compName;
            var element = document.createElement('a-panel');
            var oPanel = element;
            oPanel.chartRegistry = (function () {
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

            oPanel.render = function () {
                var thatel = this;
                function __emitrender() {
                    thatel.emit('data-loaded');
                    var listOfCharts = thatel.chartRegistry.list();
                    for (var i = 0; i < listOfCharts.length; i++) {
                        listOfCharts[i].render();
                    }
                };
                if (this.hasLoaded) {
                    __emitrender();
                } else {
                    this.addEventListener('loaded', __emitrender);
                }
                return this;
            };
            oPanel.width = function (newwidth) {
                this.setAttribute("geometry", "width", newwidth);
                return this;
            };
            oPanel.height = function (newwidth) {
                this.setAttribute("geometry", "height", newwidth);
                return this;
            };
            oPanel.nrows = function (newn) {
                this.setAttribute(this.componentName, "nrows", newn);
                return this;
            };
            oPanel.ncolumns = function (newn) {
                this.setAttribute(this.componentName, "ncolumns", newn);
                return this;
            };
            //unique properties and methods
            oPanel.componentName = compName;
            oPanel.addChart = function (chart) {
                this.chartRegistry.register(chart);
                if (oPanel.hasLoaded && oPanel.sceneEl) {
                    this.appendChild(chart);
                    chart.render();
                }
            };
            return oPanel;
        };

        aframedc.pieChart = function () {
            var compName = "piechart";
            var element = document.createElement('a-entity');
            element.setAttribute(compName, {});
            var opieChart =element;
            opieChart = AFRAME.utils.extendDeep(opieChart, baseMixin);
            //unique properties and methods
            opieChart.componentName = compName;
            opieChart.radius = function (newradius) {
                this.setAttribute(this.componentName, "radius", newradius);
                return this;
            };
            return opieChart;
        };
        aframedc.barChart = function () {
            var compName = "barchart";
            var element = document.createElement('a-entity');
            element.setAttribute(compName, {});
            var obarChart = element;
            obarChart = AFRAME.utils.extendDeep(obarChart, baseMixin);
            //unique properties and methods
            obarChart.componentName = compName;
            obarChart.width = function (newradius) {
                this.setAttribute(this.componentName, "width", newradius);
                return this;
            };
            obarChart.height = function (newradius) {
                this.setAttribute(this.componentName, "height", newradius);
                return this;
            };
            return obarChart;
        };
        aframedc.smoothCurveChart = function () {
            var compName = "smoothcurvechart";
            var element = document.createElement('a-entity');
            element.setAttribute(compName, {});
            var oCurveChart = element;
            oCurveChart = AFRAME.utils.extendDeep(oCurveChart, baseMixin);
            //unique properties and methods
            oCurveChart.componentName = compName;
            oCurveChart.width = function (newradius) {
                this.setAttribute(this.componentName, "width", newradius);
                return this;
            };
            oCurveChart.height = function (newradius) {
                this.setAttribute(this.componentName, "height", newradius);
                return this;
            };
            oCurveChart.gridsOn = function (havegrid) {
                this.setAttribute(this.componentName, "gridson", havegrid);
                return this;
            };
            return oCurveChart;
        };

        return aframedc;
    };
    this.aframedc = _aframedc();
})();