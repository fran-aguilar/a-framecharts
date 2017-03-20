AFRAME.registerComponent('piechart', {
    schema: {
        radius: {default: 2.5 },
        depth: { default: 0.5 },
        color: {default: "#fff"}
    },
    onDataLoaded: function (evt) {
        console.log(this.name +": Data Loaded!");
        this.reload = this.loaded;
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
        thatel.data = chartdata;
        thatel.render = render;
    },
    update: function (oldData) {
        if (this.el._data && this.el._data.length > 0) {
            if (!this.loaded) {
                //my own init
                this.initChart();
                this.loaded = true;
                this.el.setAttribute('visible', true);

            } else if (this.loaded && this.reload) {
                //rebuild the chart.
                while (this.el.firstChild) {
                    this.el.removeChild(this.el.firstChild);
                }
                this.el.innerHTML = "";
                this.initChart();
                this.reload = false;
                this.el.setAttribute('visible', true);
            } else {
                //updating single elements. 
                var diff = AFRAME.utils.diff(oldData, this.data);
                //TODO

            }
        } else {
            this.el.setAttribute('visible', false);
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

            el.setAttribute("theta-start", thethainit);
            el.setAttribute("theta-length", myThethaLength);
            el.setAttribute("radius", radius);
            el.setAttribute("scale", { x: 1, y: component.depth, z: 1 });


            //setting label
            //no ne de mom..
            var angleLabel = (thethainit + (myThethaLength / 2));
            //to rads
            angleLabel = (angleLabel * 2 * Math.PI) / 360;
            //min distance.

            var actualColor = COLORS[j % COLORS.length];
            el.setAttribute("color", actualColor);
            el.setAttribute("position", { x: relativeX, y: relativeY, z: relativeZ });
            el.setAttribute("rotation", { x: -90, y: 0, z: 0 });
            thethainit = thethainit + myThethaLength;
            entityEl.appendChild(el);
        }
    },
    remove: function () {
        while (this.el.firstChild) {
            this.el.removeChild(this.el.firstChild);
        }
        this.el.innerHTML = "";
        this.el.removeEventListener('data-loaded', this.onDataLoaded.bind(this));

    },
    
});