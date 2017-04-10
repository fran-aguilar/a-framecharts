AFRAME.registerComponent('smoothcurvechart', {
    schema: {
        gridson: { default: true },
        xsteps: { default: 5 },
        ysteps: { default: 5 },
        width: { default: 10 },
        height: { default: 10 },
        depth: { default: 0.5 },
        color: { default: '#00FF00' }
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
            }
        }
    },
    initChart: function () {
        var eElem = this.el;
        var componentData = this.data;

        var eElem = this.el;
        var componentData = this.data;
        if ((!eElem._data || eElem._data.length === 0) &&
           !eElem._group) return;
        var __calculateY = function (initialY, height) {
            var returnedY = height / 2 + initialY;
            return returnedY;
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
        if (eElem._data && eElem._data.length > 0) {
            _data = eElem._data;
        } else if (eElem._group) {
            _data = eElem.sortCFData();
        }
        var dataValues = _data.map(function (a) { return a.value; });;

        COLORS = ['#2338D9', '#23A2D9', '#23D978', '#BAD923', '#D923D3'];
        var yMaxPoint = 0;
        dataValues = scale.apply(null, dataValues);

        var step = componentData.width / dataValues.length;
        var x = 0;
        var material = new THREE.LineBasicMaterial({
            color: this.data.color
        });
        var curve, vertices = [];


        for (var i = 0; i < dataValues.length; i++) {
            var point = document.createElement('a-sphere');
            //point.setAttribute('width', 0.4);
            //point.setAttribute('height', 0.4);
            //point.setAttribute('depth', 0.4);
            point.setAttribute('radius', 0.2);
            point.setAttribute("color", componentData.color);
            vertices.push(
             new THREE.Vector3(x, (componentData.height * dataValues[i]), 0)
           );
            point.setAttribute("position", { x: x, y: (componentData.height * dataValues[i]), z: 0.2 });
            eElem.appendChild(point);
            //storing parts info..
            var boxPart = {
                name: "key:" + _data[i].key + " value:" + _data[i].value,
                data: {
                    key: _data[i].key,
                    value: _data[i].value
                },
                position: { x: x, y: componentData.height + 0.25, z: 0 },
                origin_color: componentData.color
            };
            point._partData = boxPart;

            x += step;


        };

        curve = new THREE.CatmullRomCurve3(vertices);

        var geometry = new THREE.Geometry();
        geometry.vertices = curve.getPoints(512);
        var curveObject = new THREE.Line(geometry, material);
        eElem.setObject3D('mesh', curveObject);
        this.addEvents();
        if (componentData.gridson) {
            this.addGrid();
        }

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
            //always red
            var myColor = 0xFF0000;
            partelement.setAttribute('color', "#" + ("000000" + myColor.toString(16)).slice(-6));
        }
        //events by default
        for (var i = 0; i < this.el.children.length; i++) {
            addEvent(this.el, this.el.children[i]);
        };

    }, addGrid: function (entityEl) {
        var gridEntity = document.createElement('a-entity');
        gridEntity.setAttribute('aframe-grid', {
            height: this.data.height,
            width: this.data.width,
            ysteps: this.data.ysteps,
            xsteps: this.data.xsteps
        });
        this.el.appendChild(gridEntity);
    },
    remove: function () {
        while (this.el.firstChild) {
            this.el.removeChild(this.el.firstChild);
        }
        this.el.innerHTML = "";
        this.el.removeEventListener('data-loaded', this.onDataLoaded.bind(this));

    }
});