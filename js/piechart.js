AFRAME.registerComponent('piechart', {
    schema: {
        radius: {default: 2.5 },
        depth: { default: 0.5 },
        color: {default: "#fff"}
    },
    onDataLoaded: function (evt) {
        console.log(this.name +": Data Loaded!");
        this.reload = true;
        evt.target.components[this.name].update(this.data);
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
                position: { x: relativeX, y: relativeY + radius + 0.25, z:  component.depth },
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

    },
    addEvents : function () {
        var addEvent = function (basicChart, partElement) {
            partElement.addEventListener('mouseenter', partEventsEnter.bind(basicChart, partElement));
            partElement.addEventListener('mouseleave', partEventsLeave.bind(basicChart, partElement));
        };
        var partEventsEnter = function (el) {
            showInfo(this,el);
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
            darkercolor ="#" + ("000000" + darkercolor.toString(16)).slice(-6)
            var TEXT_WIDTH = 6;
            texto.setAttribute("text", {
                color:  "#000000",
                side: "double",
                value: basicChart._tooltip ? basicChart._tooltip(el.data) : el._partData.name,
                width: TEXT_WIDTH,
                wrapCount: 30
            });
        
            var labelpos = { x: el._partData.position.x + TEXT_WIDTH / 2, y: el._partData.position.y, z: el._partData.position.z };
            texto.id ="tooltip";
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
            addEvent(this.el,  this.el.children[i]);
        };

    }
});