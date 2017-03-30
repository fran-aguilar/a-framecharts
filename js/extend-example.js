var baseObjComponent = {
    onDataLoaded: function (evt) {
        console.log(this.name + ": Data Loaded!");
        this.reload = true;
        evt.target.components[this.name].update(this.data);
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
                wrapCount: 30
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

    }
};
var pieChartobjComponent = {
    schema: {
        radius: { default: 2.5 },
        depth: { default: 0.5 },
        color: { default: "#fff" }
    },
    
    init: function () {
        var thatel = this.el;

        var cName = this.name;
        this.loaded = false;
        this.el.addEventListener('data-loaded', this.onDataLoaded.bind(this));
        var chartdata = function (newdata) {
            thatel._data = newdata;
            //if (_chart.emit) {
            //    _chart.emit('data-loaded');
            //}
            return thatel;
        };
        var render = function () {
            thatel.emit('data-loaded');
        };
        //thatel.data = chartdata;
        //thatel.render = render;
    },
    update: function (oldData) {
        if (this.el._data && this.el._data.length > 0) {
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
                //TODO

            }
        }
    },
    initChart: function () {
        var component = this.data;
        var entityEl = this.el;
        var aframedcEl = this.el;
        if ((!entityEl._data || entityEl._data.length === 0) &&
        !entityEl._group) return;
        var relativeX, relativeY, relativeZ;
        var thethainit = 0;
        var COLORS = ['#2338D9', '#23A2D9', '#23D978', '#BAD923', '#D923D3', '#23D7D7', '#D72323', '#262C07'];
        var radius = component.radius;
        relativeX = radius;
        relativeY = radius;
        var _data;
        if (entityEl._data) {
            _data = entityEl._data;
        } else {
            _data = entityEl._group.top(Infinity);
        }
        relativeZ = component.depth / 2;
        var suma = function (acc, val) {
            return acc + val;
        }
        var dataValues = _data.map(function (b) { return b.value; });
        var dataSum = dataValues.reduce(suma, 0);
        var dataValues = dataValues.map(function (b) { return (b / dataSum); });


        for (var j = 0; j < dataValues.length; j++) {
            var myThethaLength = (360 * dataValues[j]);
            var el = document.createElement("a-cylinder");
            //var geomcil = { primitive: "cylinder", thetaStart: thethainit, thetaLength: myThethaLength, radius: radius };
            //el.setAttribute("geometry", geomcil);
            el.setAttribute("theta-start", thethainit);
            el.setAttribute("theta-length", myThethaLength);
            el.setAttribute("radius", radius);





            //setting label
            //no ne de mom..
            var angleLabel = (thethainit + (myThethaLength / 2));
            //to rads
            angleLabel = (angleLabel * 2 * Math.PI) / 360;
            //min distance.

            var actualColor = COLORS[j % COLORS.length];
            el.setAttribute("color", actualColor);
            //el.setAttribute("material", { color: actualColor });
            el.setAttribute("scale", { x: 1, y: component.depth, z: 1 });
            el.setAttribute("position", { x: relativeX, y: relativeY, z: relativeZ });
            el.setAttribute("rotation", { x: -90, y: 0, z: 0 });

            thethainit = thethainit + myThethaLength;
            //storing parts info..
            var piePart = {
                name: "key:" + _data[j].key + " value:" + (dataValues[j] * 100).toFixed(3),
                data: {
                    key: _data[j].key,
                    value: _data[j].value
                },
                position: { x: relativeX, y: relativeY + radius + 0.25, z: component.depth },
                origin_color: actualColor
            };
            el._partData = piePart;
            entityEl.appendChild(el);

        }
        this.addEvents();
    },
    remove: function () {
        this.el.removeEventListener('data-loaded', this.onDataLoaded.bind(this));
        while (this.el.firstChild) {
            this.el.removeChild(this.el.firstChild);
        }
        this.el.innerHTML = "";

    }
    
};
var histogramcomponent = {
    BAR_WIDTH: 0.8,
    BAR_DEPTH: 0.5,
    STARTING_POINT: { x: -2, y: 0, z: -4 },
    MAX_WIDTH: 8,
    COLORS: ['#2338D9', '#23A2D9', '#23D978', '#BAD923', '#D923D3'],
    init: function () {
        var entityEl = this.el;
        var _this = this;
        var yMaxPoint = 0;
        $.getJSON('data/first-data-example.json', function (JsonData) {
            //data is the JSON string
            var relativeX, relativeY, relativeZ;
            relativeX = _this.STARTING_POINT.x; //calculado en un futuro.
            relativeY = _this.STARTING_POINT.y; //
            relativeZ = _this.STARTING_POINT.z;
            var xPointArray = [];
            var zPointArray = [];
            for (var i = 0; i < JsonData.histogram.series.length; i++) {
                for (var j = 0; j < JsonData.histogram.series[i].data.length; j++) {
                    var myHeight = JsonData.histogram.series[i].data[j];
                    var myYPosition = _this.__calculateY(relativeY, myHeight);
                    var el = document.createElement('a-box');
                    el.setAttribute('width', _this.BAR_WIDTH);
                    el.setAttribute('height', myHeight);
                    el.setAttribute('depth', _this.BAR_DEPTH);
                    el.setAttribute('color', _this.COLORS[i % _this.COLORS.length]);


                    el.setAttribute('position', { x: relativeX, y: myYPosition, z: relativeZ });
                    //ojo esto
                    el.addEventListener('click', function (event) {
                        this.setAttribute('color', 'red');
                    });
                    xPointArray.push(relativeX);
                    relativeX += 1;

                    //getting max.
                    if (myHeight > yMaxPoint) {
                        yMaxPoint = myHeight;
                    }
                    entityEl.appendChild(el);
                }
                zPointArray.push(relativeZ);
                //add label
                var labelPos = { x: _this.STARTING_POINT.x - (_this.BAR_WIDTH / 2) - 1.1, y: _this.STARTING_POINT.y, z: relativeZ };
                var labelAxis = document.createElement('a-entity');
                labelAxis.setAttribute('bmfont-text', {
                    text: JsonData.histogram.series[i].name,
                    color: _this.COLORS[i % _this.COLORS.length],
                    align: 'left'
                });
                //labelAxis.setAttribute('align', 'left');

                labelAxis.setAttribute('position', labelPos);
                //               labelAxis.setAttribute();  
                entityEl.sceneEl.appendChild(labelAxis);
                relativeZ -= 0.7;
                relativeX = _this.STARTING_POINT.x;
                relativeY = _this.STARTING_POINT.y;


            }
            //scale all the entities      
            _this.__createYaxis(_this, yMaxPoint);
            entityEl.setAttribute('scale', { x: 1, y: _this.MAX_WIDTH / yMaxPoint, z: 1 });

            _this.__createXaxis(_this, xPointArray);

            if (zPointArray.length > 1) {
                _this.__createZaxis(_this, zPointArray);
            }
        });


    },
    /**
     * @private
     */
    __calculateY: function __calculateY(initialY, height) {
        var returnedY = height / 2 + initialY;
        return returnedY;
    },
    __createXaxis: function __createXaxis(_this, xPointArray) {
        xMin = xPointArray[0] - (_this.BAR_WIDTH / 2) - 0.1;
        xMax = xPointArray[xPointArray.length - 1] + (_this.BAR_WIDTH / 2) + 0.1;
        var newLine = document.createElement("a-entity");
        newLine.setAttribute("aframe-line", {
            topoint: { x: xMin, y: _this.STARTING_POINT.y, z: _this.STARTING_POINT.z + 0.4 },
            frompoint: { x: xMax, y: _this.STARTING_POINT.y, z: _this.STARTING_POINT.z + 0.4 },
            color: 'black'
        });
        _this.el.appendChild(newLine);
    },
    __createYaxis: function __createYaxis(_this, yMaxPoint) {
        yMin = _this.STARTING_POINT.y;
        yMax = yMaxPoint + 0.1;
        var newLine = document.createElement("a-entity");
        newLine.setAttribute("aframe-line", {
            topoint: { x: _this.STARTING_POINT.x - (_this.BAR_WIDTH / 2) - 0.1, y: yMin, z: _this.STARTING_POINT.z + 0.4 },
            frompoint: { x: _this.STARTING_POINT.x - (_this.BAR_WIDTH / 2) - 0.1, y: yMax, z: _this.STARTING_POINT.z + 0.4 },
            color: 'black'
        });
        _this.el.appendChild(newLine);
    },
    __createZaxis: function __createZaxis(_this, zPointArray) {
        zMin = zPointArray[0] + 0.4;
        zMax = zPointArray[zPointArray.length - 1] - (_this.BAR_DEPTH / 2) - 0.4;
        var newLine = document.createElement("a-entity");
        newLine.setAttribute("aframe-line", {
            topoint: { x: _this.STARTING_POINT.x - (_this.BAR_WIDTH / 2) - 0.1, y: _this.STARTING_POINT.y, z: zMin },
            frompoint: { x: _this.STARTING_POINT.x - (_this.BAR_WIDTH / 2) - 0.1, y: _this.STARTING_POINT.y, z: zMax },
            color: 'black'
        });
        _this.el.appendChild(newLine);
    }

};
var extend = AFRAME.utils.extend;
AFRAME.registerComponent('piechart', extend(pieChartobjComponent,baseObjComponent ));

AFRAME.registerComponent('histogram',extend(histogramcomponent,baseObjComponent) );