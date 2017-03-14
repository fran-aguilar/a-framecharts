AFRAME.registerComponent('barchart', {
    schema: {
        grids: { default: false },
        xlabels: { default: 5 },
        ylabels: { default: 5 },
        width: { default: 10 },
        height: { default: 10 },
        depth: { default: 0.5 },
        color: { default: '#000000' }
    },
    onDataLoaded: function (evt) {
        console.log(this.name +":Data Loaded!");
        this.reload = this.loaded;
        evt.target.components[this.name].update(this.data);
    },
    init: function () {
        var cName = this.name;
        var that = this;
        this.loaded = false;
        //called at render. take care
        //this.el = aframedc.barChart(this.el, cName);

        this.el.addEventListener('data-loaded', this.onDataLoaded.bind(this));

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
                if (diff.color) {
                    var childs = this.el.querySelector('a-box');
                    for (var i = 0 ; i < childs.length ; i++) {
                        var child = childs[i];
                        var animationcolor;
                        if (!child.children || child.children.length === 0) {
                            animationcolor = this.getAnimationColor(diff.color, oldData.color);
                            child.appendChild(animationcolor);
                        } else {
                            while (child.firstChild) {
                                child.removeChild(child.firstChild);
                            }
                            animationcolor = this.getAnimationColor(diff.color, oldData.color);
                            child.appendChild(animationcolor);
                        }

                    }
                }

            }
        } else {
            this.el.setAttribute('visible', false);
        }
    },
    initChart: function () {
        var component = this.data;
        var entityEl = this.el;
        var aframedcEl = this.el;
        if ((!aframedcEl._data || aframedcEl._data.length === 0) && !aframedcEl._group) return;
        var __calculateY = function (initialY, height) {
            var returnedY = height / 2 + initialY;
            return returnedY;
        };
        var normalize = function () {
            var min, max;
            var p = [];
            max = Math.max.apply(null, arguments);
            min = Math.min.apply(null, arguments)
            for (var i = 0 ; i < arguments.length; i++) {
                p.push((arguments[i] - min) / (max - min));
            }
            return p;
        };
        var scale = function () {
            var max;
            var p = [];
            max = Math.max.apply(null, arguments);
            for (var i = 0 ; i < arguments.length; i++) {
                p.push((arguments[i] / max));
            }
            return p;
        };
        var _data;
        if (aframedcEl._data && aframedcEl._data.length > 0) {
            _data = aframedcEl._data;
        } else if (aframedcEl._group) {
            _data = aframedcEl.sortCFData();
        }
        var dataValues = _data.map(function (a) { return a.value; });;
        dataValues = scale.apply(null, dataValues);
        BAR_WIDTH = component.width / dataValues.length;;
        BAR_DEPTH = component.depth;
        MAX_HEIGHT = component.height;
        COLORS = ['#2338D9', '#23A2D9', '#23D978', '#BAD923', '#D923D3'];
        var yMaxPoint = 0;

        var relativeX, relativeY, relativeZ;
        relativeX = BAR_WIDTH / 2;
        relativeY = 0;
        relativeZ = component.depth / 2;

        for (var i = 0; i < dataValues.length; i++) {
            var myHeight = dataValues[i] * MAX_HEIGHT;
            var myYPosition = __calculateY(relativeY, myHeight);
            var el = document.createElement('a-box');
            var actualColor = component.color || COLORS[i % COLORS.length];
            var elPos = { x: relativeX, y: myYPosition, z: relativeZ };

            el.setAttribute('width', BAR_WIDTH);
            el.setAttribute('height', myHeight);
            el.setAttribute('depth', BAR_DEPTH);
            el.setAttribute('color', actualColor);
            el.setAttribute('position', elPos);
            relativeX += BAR_WIDTH;
            entityEl.appendChild(el);
        }
        if (component.grids) {
             this.addGrid(entityEl);
        }
    },
    addGrid: function(entityEl) {
        var gridEntity = document.createElement('a-entity');
        gridEntity.setAttribute('aframe-grid', {
            height: this.data.height,
            width: this.data.width,
            nylabels: this.data.ylabels,
            nxlabels: this.data.xlabels
        });
        entityEl.appendChild(gridEntity);
    },
    getAnimationColor: function (colorTo, colorFrom) {
        var animation = document.createElement('a-animation');
        animation.setAttribute("attribute", "color");
        //animation.setAttribute("begin","ccolor");
        animation.setAttribute("to", colorTo);
        animation.setAttribute("from", colorFrom);
        return animation;
    },
    remove: function () {
        while (this.el.firstChild) {
            this.el.removeChild(this.el.firstChild);
        }
        this.el.innerHTML = "";
        this.el.removeEventListener('data-loaded', this.onDataLoaded.bind(this));

    }
});