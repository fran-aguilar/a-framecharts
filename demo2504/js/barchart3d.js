﻿AFRAME.registerComponent('barchart3d', {
    schema: {
        gridson: { default: true },
        xsteps: { default: 5 },
        ysteps: { default: 5 },
        zsteps: { default: 5 },
        width: { default: 10 },
        height: { default: 10 },
        depth: { default: 0.5 },
        color: { default: '#00FF00' },
        title: { default: "" }
    },
    onDataLoaded: function (evt) {
        console.log(this.name + ":Data Loaded!");
        this.reload = true;
        evt.target.components[this.name].update(this.data);
    },
    init: function () {
        var cName = this.name;
        var that = this;
        this.loaded = false;
        //called at render. take care
        this.el.addEventListener('data-loaded', this.onDataLoaded.bind(this));

    },
    update: function (oldData) {
        if ((this.el._data && this.el._data.length > 0) || this.el._group) {
            if (this.reload) {
                //rebuild the chart.
                while (this.el.firstChild) {
                    this.el.firstChild.parentNode.removeChild(this.el.firstChild);
                }
                //this.el.innerHTML = "";
                this.initChart();
                this.reload = false;
                this.el.setAttribute('visible', true);
            } else {
                //updating single elements. 
                var diff = AFRAME.utils.diff(oldData, this.data);
            }
        }
    },
    initChart: function () {
        var eElem = this.el;
        var componentData = this.data;
        if ((!eElem._data || eElem._data.length === 0) &&
           !eElem._group) return;
        if (!eElem._zAxis) return;
        var __calculateY = function (initialY, height) {
            var returnedY = height / 2 + initialY;
            return returnedY;
        };
        

        var _data;
        if (eElem._data && eElem._data.length > 0) {
            _data = eElem._data;
        } else if (eElem._group) {
            _data = eElem._group.all();
        }

        BAR_WIDTH = componentData.width / _data.length;;
        BAR_DEPTH = componentData.depth / eElem._zAxis.length;
        MAX_HEIGHT = componentData.height;
        //using value and height accessor to retrieve max's
        var arrays = _data.map(function (p) {
            var myp = p;
            return eElem._arrAccesor(p).map(function (o) {
                return eElem._heightAccesor(o, myp);
            });
        });
        var MAX_VALUE = Math.max.apply(null, ([].concat.apply([], arrays)));
        var entityEl = document.createElement('a-entity');
        var yMaxPoint = 0;

        var relativeX, relativeY;
        relativeX = BAR_WIDTH / 2;
        relativeY = 0;

        for (var i = 0; i < _data.length; i++) {
            var dataValue = _data[i].value;
            for (var j = 0 ; j < dataValue.length; j++) {
                //we need to scale every item.
               
                var myHeight = (eElem._heightAccesor(dataValue[j], dataValue) / MAX_VALUE) * MAX_HEIGHT;
                var myYPosition = __calculateY(relativeY, myHeight);
                var el = document.createElement('a-box');
                var actualColor = eElem._colors.find(function (a) { return a.key === dataValue[j].key }).value;
                var index = eElem._zAxis.findIndex(function (a) { return a.key === dataValue[j].key });
                //-bardepth *i - bardepth/2
                var zpos = -(BAR_DEPTH) * (index + 0.5);
                var elPos = { x: relativeX, y: myYPosition, z: zpos };

                el.setAttribute('width', BAR_WIDTH);
                el.setAttribute('height', myHeight);
                el.setAttribute('depth', BAR_DEPTH);
                el.setAttribute('color', actualColor);
                el.setAttribute('position', elPos);
                

                var valuePart = _data[i].value;
                if (eElem._valueHandler)
                    valuePart = eElem._valueHandler(dataValue[j], dataValue);
                var keyPart = _data[i].key;
                if (eElem._keyHandler) {
                    keyPart = eElem._keyHandler(_data[i]);
                }
                //storing parts info..
                var barPart = {
                    name: "key:" + keyPart + " value:" + valuePart,
                    data: {
                        key: _data[i].key,
                        value: _data[i].value
                    },
                    position: { x: elPos.x, y: MAX_HEIGHT + 0.25, z: elPos.z  },
                    origin_color: actualColor
                };
                el._partData = barPart;
                //getting max.
                eElem.appendChild(el);
                var myFunc = function (chart, element) {

                    if (chart.el._dimension) {
                        var myDim = chart.el._dimension;
                        myDim.filterAll(null);
                        myDim = myDim.filter(element.data.key);
                        //llamada a redibujado de todo..
                        var dashboard;
                        if (chart.el._dashboard)
                            dashboard = chart.el._dashboard;
                        else if (chart.el._panel)
                            dashboard = chart.el._panel._dashboard;

                        if (dashboard) {
                            //getting all charts
                            var charts = dashboard.allCharts();
                            for (var ch = 0 ; ch < charts.length; ch++) {
                                if (charts[ch] !== chart.el && charts[ch]._group) {
                                    charts[ch].emit("data-loaded");
                                }
                            }

                        } else {
                            var childs = chart.el.parentElement.children;
                            for (var ch = 0 ; ch < childs.length ; ch++) {
                                if (childs[ch] !== chart.el && childs[ch]._group) {
                                    childs[ch].emit("data-loaded");
                                }
                            }
                        }
                    }
                };
                var myBindFunc = myFunc.bind(null, this, el._partData);
                el.addEventListener("click", myBindFunc);
            }
            relativeX += BAR_WIDTH;

        }
        this.addEvents();
    
        var entLabels = this.addYLabels();
        for (var lb = 0 ; lb < entLabels.length; lb++) {
            eElem.appendChild(entLabels[lb]);
        }
        var zlabels = this.addZLabels();
        for (var lb = 0 ; lb < zlabels.length; lb++) {
            eElem.appendChild(zlabels[lb]);
        }
        if (componentData.gridson) {
            this.addGrid();
        }
        if (componentData.title !== "") {
            this.addTitle();
        }
    },
    addGrid: function () {
        var gridEntity = document.createElement('a-entity');
        gridEntity.setAttribute('aframe-grid', {
            height: this.data.height,
            width: this.data.width,
            ysteps: this.data.ysteps,
            xsteps: this.data.xsteps
        });
        gridEntity.setAttribute("position", { x: 0, y: 0, z: -this.data.depth });
        this.el.appendChild(gridEntity);

        var gridEntityZY = document.createElement('a-entity');
        gridEntityZY.setAttribute('aframe-gridyz', {
            height: this.data.height,
            depth: this.data.depth,
            ysteps: this.data.ysteps,
            zsteps: this.el._zAxis.length
        });


        var gridEntityXZ = document.createElement('a-entity');
        gridEntityXZ.setAttribute('aframe-gridxz', {
            width: this.data.width,
            depth: this.data.depth,
            xsteps: this.data.xsteps,
            zsteps: this.el._zAxis.length
        });
        this.el.appendChild(gridEntityZY);
        this.el.appendChild(gridEntityXZ);
    },
    addTitle: function () {
        var titleEntity = document.createElement("a-entity");
        titleEntity.setAttribute("title", { caption: this.data.title, width: this.data.width / 2 });
        titleEntity.setAttribute("position", { x: this.data.width / 2, y: this.data.height + 1, z: 0 });
        this.el.appendChild(titleEntity);
    },
    addEvents: function () {
        var addEvent = function (basicChart, partElement) {
            partElement.addEventListener('mouseenter', partEventsEnter.bind(basicChart, partElement));
            partElement.addEventListener('mouseleave', partEventsLeave.bind(basicChart, partElement));
        };
        var partEventsEnter = function (el) {
            showInfo(this, el);
            changeMeshColor(el);
        }
        var partEventsLeave = function (el) {
            returnMeshColor(el);
            detachInfo(el);
        };
        var returnMeshColor = function (el) {
            var partelement = el;
            //modo THREEDC
            //var meshEl = partelement.DOMElement.getObject3D('mesh');
            //meshEl.material.emissive.setHex(partelement.currentHex);
            //partelement.DOMElement.setObject3D('mesh', meshEl);
            partelement.setAttribute('color', el._partData.origin_color);
        };
        var detachInfo = function (el) {
            var chartelement = el.parentElement;
            var texttodelete = chartelement.querySelector("#tooltip");
            if (texttodelete) {
                chartelement.removeChild(texttodelete);
            }
        };
        var showInfo = function (basicChart, el) {
            var texto;
            texto = document.createElement("a-entity");
            var dark = 0x0A0A0A * 0x02;
            var darkercolor = Number.parseInt(el._partData.origin_color.replace("#", "0x")) - (0xA0A0A * 0x02);
            darkercolor = "#" + ("000000" + darkercolor.toString(16)).slice(-6)
            var TEXT_WIDTH = 6;
            texto.setAttribute("text", {
                color: "#000000",
                side: "double",
                value: basicChart._tooltip ? basicChart._tooltip(el.data) : el._partData.name,
                width: TEXT_WIDTH,
                wrapCount: 35
            });

            var labelpos = { x: el._partData.position.x + TEXT_WIDTH / 2, y: el._partData.position.y, z: el._partData.position.z };
            texto.id = "tooltip";
            texto.setAttribute('position', labelpos);
            //texto.setAttribute('geometry',{primitive: 'plane', width: 'auto', height: 'auto'});
            //basicChart.getEscene().appendChild(texto);
            el.parentElement.appendChild(texto);
        }
        var changeMeshColor = function (el) {
            var partelement = el;
            var originColor = partelement.getObject3D('mesh').material.color.getHex();
            //modo THREEDC
            //partelement.currentHex = meshEl.material.emissive.getHex();
            //meshEl.material.emissive.setHex(threeCol.getHex());
            //partelement.DOMElement.setObject3D('mesh', meshEl);
            var myColor = 0xFFFFFF ^ originColor;
            partelement.setAttribute('color', "#" + ("000000" + myColor.toString(16)).slice(-6));
        }
        //events by default
        for (var i = 0; i < this.el.children.length; i++) {
            addEvent(this.el, this.el.children[i]);
        };

    },
    addYLabels: function () {
        var numberOfValues;
        var topYValue;
        var getYLabel = function (component, step, value) {

            var txt = value;
            var curveSeg = 3;
            var texto = document.createElement("a-entity");
            TEXT_WIDTH = 6;
            //FIXME: depende del tamaño de letra...
            var xPos = -0.7;
            //var yPos = BasicChart._coords.y + step +  0.36778332145402703 / 2;
            var yPos = step;
            texto.setAttribute("text", {
                color: "#000000",
                side: "double",
                value: value.toFixed(2),
                width: TEXT_WIDTH,
                wrapCount: 30,
                align: "center"
            });
            //texto.setAttribute('geometry', { primitive: 'plane', width: 'auto', height: 'auto' });
            // Positions the text and adds it to the THREEDC.scene
            var labelpos = { x: xPos, y: yPos, z: -component.data.depth  };
            texto.setAttribute('position', labelpos);
            return texto;
        }
        var _data;
        var eElem = this.el;
        if (this.el._data) {
            _data = this.el._data;
        } else {
            _data = this.el._group.top(Infinity);
        }
        //using value and height accessor to retrieve max's
        var arrays = _data.map(function (p) {
            var myp = p;
            return eElem._arrAccesor(p).map(function (o) {
                return eElem._heightAccesor(o, myp);
            });
        });
        topYValue = Math.max.apply(null, ([].concat.apply([], arrays)));
        numberOfValues = _data.length;
        //Y AXIS
        //var numerOfYLabels=Math.round(_chart._height/20);
        var stepYValue = topYValue / this.data.ysteps;
        var stepY = this.data.height / this.data.ysteps;
        var labels = [];
        for (var i = 0; i < this.data.ysteps + 1; i++) {
            labels.push(getYLabel(this, i * stepY, i * stepYValue));
        };

        return labels;
    },
    addZLabels: function () {
        if (!this.el._zAxis) return;
        var getZLabel = function (component, step, labelkv) {
            var curveSeg = 3;
            var texto = document.createElement("a-entity");
            TEXT_WIDTH = 6;
            //FIXME: depende del tamaño de letra...
            var xPos = -1 * ((TEXT_WIDTH / 2) + 0.7);
            var zPos = -step;
            var actualColor = component.el._colors.find(function (d) { return d.key === labelkv.key; }).value;
            texto.setAttribute("text", {
                color: actualColor,
                side: "double",
                value: labelkv.key,
                width: TEXT_WIDTH,
                wrapCount: 30,
                align: "right"
            });
            //texto.setAttribute('geometry', { primitive: 'plane', width: 'auto', height: 'auto' });
            // Positions the text and adds it to the THREEDC.scene
            var labelpos = { x: xPos, y: 0, z: zPos };
            texto.setAttribute('position', labelpos);
            return texto;
        }

        var stepZ = this.data.depth / this.el._zAxis.length;
        var labels = [];
        for (var i = 0; i < this.el._zAxis.length; i++) {
            labels.push(getZLabel(this, i * stepZ + stepZ / 2, this.el._zAxis[i]));
        };

        return labels;
    },
    remove: function () {
        while (this.el.firstChild) {
            this.el.removeChild(this.el.firstChild);
        }
        this.el.innerHTML = "";
        this.el.removeEventListener('data-loaded', this.onDataLoaded.bind(this));

    }
});