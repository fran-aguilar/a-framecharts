AFRAMEDC = {};
//Three and Aframe must be loaded.
AFRAMEDC.DashBoard = function ( scene ) {
    //this.camera = camera;
    this.scene = scene;
    //this.renderer = renderer;
    //this.container = container;
    this.allCharts = [];
    this.allPanels = [];
    this.textLabel = null;
    this.chartToDrag = null;
    this.intervalFilter = [];
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.offset = new THREE.Vector3();
    this.paint = true;

};
AFRAMEDC.version = "0.1";
AFRAMEDC.utils = {};
AFRAMEDC.utils.scale = function () {
    var max;
    var p = [];
    max = Math.max.apply(null, arguments);
    for (var i = 0 ; i < arguments.length; i++) {
        p.push((arguments[i] / max));
    }
    return p;
};
AFRAMEDC.DashBoard.prototype.addChart = function (chart) {
    if (!arguments || arguments.length === 0) {
        return console.log("arg needed");
    }
    if (chart instanceof AFRAMEDC.BasicChart) {
        this.allCharts.push(chart);
        chart._parentDashBoard = this;
        this.scene.appendChild(chart.build());
    }
};
//begin panel
AFRAMEDC.Panel = function (dashBoard, coords, numberOfCharts, size, opacity) {
    if (!dashBoard) return;
    if (!(dashBoard instanceof AFRAMEDC.DashBoard)) return;
    var aux_coords = coords || [0, 0, 0];
    this.parentDashBoard = dashBoard;
   
    this.coords = new THREE.Vector3( aux_coords[0], aux_coords[1], aux_coords[2] );
    this.numberOfCharts = numberOfCharts || 4;
    this.opacity = opacity || 0.3;
    this._size = size || [10, 10];
    this._depth = 0.1;
    this.charts = [];
    this.domElement = null;
    
    //TODO: add padding.
    var PADDING = 1;
    var makeAnchorPoints = function (panel) {
        var numberOfAnchorPoints = panel.numberOfCharts;
        var anchorPoints = [];

        if (!(numberOfAnchorPoints >= 2 && numberOfAnchorPoints <= 4)) {
            console.log('invalid number of anchor points');
            return;
        }
        if (numberOfAnchorPoints === 4) {
            anchorPoints.push({
                filled: false,
                coords: new THREE.Vector3(PADDING - panel._size[0] / 2, PADDING - panel._size[1] / 2, 0)
            });
            anchorPoints.push({
                filled: false,
                coords: new THREE.Vector3(PADDING, PADDING - panel._size[1] / 2, 0)
            });
            anchorPoints.push({
                filled: false,
                coords: new THREE.Vector3(PADDING - panel._size[0] / 2, PADDING, 0)
            });
            anchorPoints.push({
                filled: false,
                coords: new THREE.Vector3(PADDING, PADDING, 0)
            });
        }

        if (numberOfAnchorPoints === 3) {
            anchorPoints.push({
                filled: false,
                coords: new THREE.Vector3(panel.coords.x - panel._size[0] / 2, panel.coords.y - panel._size[1] / 2, 0)
            });
            anchorPoints.push({
                filled: false,
                coords: new THREE.Vector3(panel.coords.x, panel.coords.y - panel._size[1] / 2, 0)
            });
            anchorPoints.push({
                filled: false,
                coords: new THREE.Vector3(panel.coords.x - panel._size[0] / 2, panel.coords.y, 0)
            });
        }

        if (numberOfAnchorPoints === 2) {
            anchorPoints.push({
                filled: false,
                coords: new THREE.Vector3(PADDING - panel._size[0] / 2, PADDING - panel._size[1] /2, 0)
            });
            anchorPoints.push({
                filled: false,
                coords: new THREE.Vector3(PADDING, PADDING - panel._size[1] /2, 0)
            });

        }
        panel.anchorPoints = anchorPoints;
    };
    makeAnchorPoints(this);
    this.size = function (newSize) {
        if (!arguments.length) {
            console.log("argument needed");
            return;
        }
        this._size = newSize;
        makeAnchorPoints(this);
        return this;
    };
    this.getChartSize = function () {
        //calculate inner bounds.
        if (this.numberOfCharts === 4) {
            return [(this._size[0] / 2) - PADDING * 2, (this._size[1] / 2) - PADDING * 2];
        } else if (this.numberOfCharts === 2) {
            return [(this._size[0] / 2) - PADDING * 2, (this._size[1]  ) - PADDING * 2];
        }
    };
    dashBoard.allPanels.push(this);
};
//build DOM Element.
AFRAMEDC.Panel.prototype.build = function () {
    var panel = document.createElement("a-entity");
    panel.setAttribute("geometry", {
        primitive: "box",
        width: this._size[0],
        height: this._size[1],
        depth: this._depth
    });

    panel.setAttribute("material", {
        opacity: this.opacity,
        flatShading: false,
        transparent: true,
        color: "gray"
    });
    
    panel.setAttribute("position", {
        x: this.coords.x,
        y: this.coords.y,
        z: this.coords.z
    });
    var panelOffset = document.createElement('a-entity');
    panelOffset.setAttribute('position', {x:0, y:0,z: this._depth / 2});
    for (var i = 0; i < this.charts.length ; i++) {
        var chartObj = this.charts[i];
        var entityEl = chartObj.build();
        //fix the positions

        panelOffset.appendChild(entityEl);
    }
    if (this._title) {
        //addLabel
        var texto;

        texto = document.createElement("a-entity");
       
        var TEXT_WIDTH = this._size[0];
        texto.setAttribute("text", {
            color: "#000000",
            side: "double",
            value: this._title,
            width: TEXT_WIDTH,
            wrapCount: 30
        });
        var labelpos = { x:0, y:this._size[1] /2 +1, z: 0 };
        //texto.setAttribute('geometry',{primitive: 'plane', width: 'auto', height: 'auto'});
        texto.setAttribute('position', labelpos);
        panel.appendChild(texto);
    }
    panel.appendChild(panelOffset);
    this.domElement = panel;
    return panel;
};
AFRAMEDC.Panel.prototype.remove = function () {
    if (this.domElement) {
        var parent = this.domElement.parentElement;
        parent.removeChild(this.domElement);
        this.domElement = null;
    }
};
AFRAMEDC.Panel.prototype.rebuild = function (index) {
    for (var i = 0 ; i < this.charts.length ; i++) {
        if (i !== index) {
            var myNode = this.charts[i].domElement;
            while (myNode.firstChild) {
                myNode.removeChild(myNode.firstChild);
            }
            myNode.innerHTML = "";
            var parent = this.charts[i].domElement.parentElement;
            parent.removeChild(this.charts[i].domElement);
            this.charts[i].domElement = null;

            parent.appendChild(this.charts[i].build());
        }
    }
};
AFRAMEDC.Panel.prototype.title = function (newtitle) {
    if (!newtitle) {
        console.log("arg need");
        return;
    }
    this._title = newtitle;
    return this;
}
//TODO: overwrite to add a panel obj.
AFRAMEDC.DashBoard.prototype.addPanel = function (coords, numberOfCharts, size, opacity) {
    if (arguments.length === 1 && coords instanceof AFRAMEDC.Panel) {
        this.allPanels.push(coords);
        //this.scene.appendChild(coords.build());
        return coords;
    }

    var panelObj = new AFRAMEDC.Panel(coords, numberOfCharts, size, opacity);
    this.allPanels.push(panelObj);
    //this.scene.appendChild(panelObj.build());
    return panelObj;
};


AFRAMEDC.DashBoard.prototype.removeAll = function () {
    var i = 0;
    if (this.allCharts && this.allCharts.length > 0) {
        for (i = 0; i < this.allCharts.length ; i++) {
            this.allCharts[i].remove();
        }
    }
    if (this.allPanels && this.allPanels.length > 0) {
        for (i = 0 ; i < this.allPanels.length; i++) {
            this.allPanels[i].remove();
        }
    }
};

AFRAMEDC.DashBoard.prototype.renderAll = function () {
    //borrado previo..
    this.removeAll();

    if (this.allCharts && this.allCharts.length > 0) {
        for (i = 0; i < this.allCharts.length ; i++) {
            this.scene.appendChild(this.allCharts[i].build());
        }
    }

    if (this.allPanels && this.allPanels.length > 0) {
        for (i = 0; i < this.allPanels.length ; i++) {
            this.scene.appendChild(this.allPanels[i].build());
        }
    }
};
//end panel

//begin basicChart
AFRAMEDC.BasicChart = function (param) {
    this._parentPanel = null;
    this.parts = [];
    this.xLabels = [];
    this.yLabels = [];
    this.xGrids = [];
    this.yGrids = [];
    //by default
    this._gridsOn = false;
    this._numberOfXLabels = 9;
    this._numberOfYLabels = 9;
    this._width = 1;
    this._height = 1;
    this._depth = 0.5;
    //dom Elements..¿?
    this.parts = [];
    if (param instanceof AFRAMEDC.Panel) {
        for (var i = 0; i < param.anchorPoints.length; i++) {
            if (!param.anchorPoints[i].filled) {
                //update size of chart.
                //TODO: inner bounds
                var innerbounds = param.getChartSize();
                this._width = innerbounds[0] ;
                this._height = innerbounds[1];
                this._coords = param.anchorPoints[i].coords;
                this._coords.x = this._coords.x;
                this._coords.y = this._coords.y;
                this._coords.z = this._coords.z;
                param.anchorPoints[i].filled = true;
                this._panelIndex = param.charts.push(this) -1;
                this._parentPanel = param;

                break;
            }
        }
    }
    else {
        this._coords = new THREE.Vector3(param[0], param[1], param[2]);
    };
};
AFRAMEDC.BasicChart.prototype.group = function (group) {
    if (!arguments.length) {
        console.log("argument needed");
        return;
    }
    this._group = group;
    return this;
};

AFRAMEDC.BasicChart.prototype.dimension = function (dimension) {
    if (!arguments.length) {
        console.log("argument needed");
        return;
    }
    this._dimension = dimension;
    return this;
};

AFRAMEDC.BasicChart.prototype.width = function (width) {
    if (!arguments.length) {
        console.log("argument needed");
        return;
    }
    this._width = width;
    return this;
};

AFRAMEDC.BasicChart.prototype.height = function (height) {
    if (!arguments.length) {
        console.log("argument needed");
        return;
    }
    this._height = height;
    return this;
};

AFRAMEDC.BasicChart.prototype.color = function (color) {
    if (!arguments.length) {
        console.log("argument needed");
        return;
    }
    
    if (typeof (color) === "number") {
        //transform color to string hex.
        var aux_color = "#" + ("000000" + color.toString(16)).slice(-6);
        this._color = aux_color;
    }else  {
        this._color = color;
    };
    return this;
};


AFRAMEDC.BasicChart.prototype.numberOfXLabels = function (number) {
    if (!arguments.length) {
        console.log("argument needed");
        return;
    }
    this._numberOfXLabels = number;
    return this;
};

AFRAMEDC.BasicChart.prototype.numberOfYLabels = function (number) {
    if (!arguments.length) {
        console.log("argument needed");
        return;
    }
    this._numberOfYLabels = number;
    return this;
};

AFRAMEDC.BasicChart.prototype.depth = function (number) {
    if (!arguments.length) {
        console.log("argument needed");
        return;
    }
    this._depth = number;
    return this;
};

AFRAMEDC.BasicChart.prototype.opacity = function (number) {
    if (!arguments.length) {
        console.log("argument needed");
        return;
    }
    this._opacity = number;
    return this;
};

AFRAMEDC.BasicChart.prototype.addCustomEvents = function (argFunction) {
    if (!arguments.length) {
        console.log("argument needed");
        return;
    }
    this._addCustomEvents = argFunction;
    return this;
};
AFRAMEDC.BasicChart.prototype.gridsOn = function () {
    this._gridsOn = true;
    return this;
};

AFRAMEDC.BasicChart.prototype.gridsOff = function () {
    this._gridsOn = false;
    return this;
};
// data when crossfilter is not used
AFRAMEDC.BasicChart.prototype.data = function (data) {
    if (!arguments.length) {
        console.log("argument needed");
        return;
    }
    this._data = data;
    return this;
};
AFRAMEDC.BasicChart.prototype.remove = function () {
    if (this.domElement) {
        var parent = this.domElement.parentElement;
        parent.removeChild(this.domElement);
        this.domElement = null;
    }
}
AFRAMEDC.BasicChart.prototype.getEscene = function () {
    if (this._parentPanel) {
        return this._parentPanel.dashBoard.scene;
    }
    if (this._parentDashBoard)
        return this._paretnDashBoard.scene;
};
AFRAMEDC.BasicChart.prototype.sortCFData = function () {
    var unsort_data = this._group.top(Infinity);

    var dates = [];
    //en dates guardo las fechas(keys)
    for (var i = 0; i < unsort_data.length; i++) {
        dates[i] = unsort_data[i].key;
    };
    //ordeno fechas(keys) de menor a mayor
    dates.sort(function (a, b) { return a - b });

    //ordeno el grupo de menor a mayor usando
    //las posiciones de dates
    var _data = [];
    for (var i = 0; i < dates.length; i++) {
        for (var j = 0; j < unsort_data.length; j++) {
            if (dates[i] === unsort_data[j].key) {
                _data[i] = {
                    key: unsort_data[j].key,
                    value: unsort_data[j].value
                };
            }
        };
    };

    return _data;
};
AFRAMEDC.BasicChart.prototype.tooltip = function (tooltipf) {
    if (!tooltipf) {
        console.log("arg needed");
        return;
    }
    if (typeof tooltipf !== "function") {
        console.log("arg needed");
        return;
    }
    this._tooltip = tooltipf;
    return this;

}
AFRAMEDC.BasicChart.prototype.addEvents = function () {
    var addEvent = function (basicChart, partElement) {
        partElement.DOMElement.addEventListener('mouseenter', partEventsEnter.bind(basicChart, partElement));
        partElement.DOMElement.addEventListener('mouseleave', partEventsLeave.bind(basicChart, partElement));
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
        partelement.DOMElement.setAttribute('color', el.origin_color);
    };
    var detachInfo = function (el) {
        var chartelement = el.DOMElement.parentElement;
        var texttodelete = chartelement.querySelector("#tooltip");
        if (texttodelete) {
            chartelement.removeChild(texttodelete);
        }
    };
    var showInfo = function (basicChart, el) {
        var texto;
        
        texto = document.createElement("a-entity");
        
        var dark = 0x0A0A0A * 0x02;
        var darkercolor = Number.parseInt(el.origin_color.replace("#","0x")) - (0xA0A0A * 0x02);
        darkercolor ="#" + ("000000" + darkercolor.toString(16)).slice(-6)
        var TEXT_WIDTH = 6;
        texto.setAttribute("text", {
        color:  "#000000",
            side: "double",
            value: basicChart._tooltip ? basicChart._tooltip(el.data) : el.name,
            width: TEXT_WIDTH,
            wrapCount: 30
        });
        
        var labelpos = { x: el.position.x + TEXT_WIDTH / 2, y: el.position.y , z: el.position.z };
        texto.id ="tooltip";
        texto.setAttribute('position', labelpos);
        //texto.setAttribute('geometry',{primitive: 'plane', width: 'auto', height: 'auto'});
        //basicChart.getEscene().appendChild(texto);
        el.DOMElement.parentElement.appendChild(texto);
    }
    var changeMeshColor = function (el) {
        var partelement = el;
        var originColor = partelement.DOMElement.getObject3D('mesh').material.color.getHex();
        //modo THREEDC
        //partelement.currentHex = meshEl.material.emissive.getHex();
        //meshEl.material.emissive.setHex(threeCol.getHex());
        //partelement.DOMElement.setObject3D('mesh', meshEl);
        var myColor = 0xFFFFFF ^ originColor;
        partelement.DOMElement.setAttribute('color', "#" + ("000000" + myColor.toString(16)).slice(-6));
    }
    //events by default
    for (var i = 0; i < this.parts.length; i++) {
        addEvent(this, this.parts[i]);
    };

};

AFRAMEDC.BasicChart.prototype.addLabels = function () {
        var numberOfValues;
        var topYValue;
        var putYLabel = function(BasicChart, step, value) {

            var txt = value;
            var curveSeg = 3;
            var texto = document.createElement("a-entity");
            TEXT_WIDTH = 6;
            //FIXME: depende del tamaño de letra...
            var xPos =     -0.7;
            //var yPos = BasicChart._coords.y + step +  0.36778332145402703 / 2;
            var yPos =   step;
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
            var labelpos = { x: xPos, y: yPos, z:   0 };
            texto.setAttribute('position', labelpos); 
            return texto;
        } 
        var _data;
        if (this._data) {
            _data = this._data;
        } else {
            _data = this._group.top(Infinity);
        }
        var dataValues =  _data.map(function (a) { return a.value; });
        topYValue = Math.max.apply(null, dataValues);
        numberOfValues = dataValues.length;
        //Y AXIS
        //var numerOfYLabels=Math.round(_chart._height/20);
        var stepYValue= topYValue/this._numberOfYLabels;
        var stepY=this._height/this._numberOfYLabels;
        var labels = [];
        for (var i = 0; i <this._numberOfYLabels+1; i++) {
            labels.push(putYLabel(this, i * stepY, i * stepYValue));
        };
        
        return labels;
};

AFRAMEDC.BasicChart.prototype.addGrid = function () {
    var gridEntity = document.createElement('a-entity');
    gridEntity.setAttribute('aframe-grid', {
        height: this._height,
        width: this._width,
        nylabels: this._numberOfYLabels,
        nxlabels: this._numberOfXLabels
    });
    return gridEntity;
};
//end basic Chart

//using inheritance to create a new chart based on this one. piechar begin
AFRAMEDC.PieChart = function (param) {
    AFRAMEDC.BasicChart.call(this, param);
};
AFRAMEDC.PieChart.prototype = Object.create(AFRAMEDC.BasicChart.prototype);
AFRAMEDC.PieChart.prototype.constructor = AFRAMEDC.PieChart;

//data is the JSON string
AFRAMEDC.PieChart.prototype.build = function (location) {
    //TODO _data or group
    if (  (!this._data || this._data.length === 0) &&
        !this._group ) return;
    var relativeX, relativeY, relativeZ;
    var thethainit = 0;
    var COLORS = ['#2338D9', '#23A2D9', '#23D978', '#BAD923', '#D923D3', '#23D7D7', '#D72323', '#262C07'];
    var entityEl = document.createElement("a-entity");
    var radius = Math.min(this._width / 2, this._height / 2);
    relativeX = radius;
    relativeY = radius;
    var _data;
    if (this._data) {
        _data = this._data;
    } else {
        _data = this._group.top(Infinity);
    }
    relativeZ = this._depth /2 ;
    var suma = function(acc,val){
        return acc + val;
    }
    var dataValues = _data.map(function (b) { return b.value;});
    var dataSum = dataValues.reduce(suma, 0);
    var dataValues = dataValues.map(function (b) { return (b / dataSum); });
    var prevLabelPoints = [];

    for (var j = 0; j < dataValues.length; j++) {
        var myThethaLength = (360 * dataValues[j]) ;
        var el = document.createElement("a-cylinder");

        el.setAttribute("theta-start", thethainit);
        el.setAttribute("theta-length", myThethaLength);
        el.setAttribute("radius", radius);
        el.setAttribute("scale", { x: 1, y: this._depth, z: 1 });


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
        //el.setAttribute("id", "pie" + j);

        thethainit = thethainit + myThethaLength;
        //TODO: going to delete.

        //storing parts info..
        var piePart = {
            name: "key:" + _data[j].key + " value:" + (dataValues[j] *100).toFixed(3),
            data: {
                key: _data[j].key,
                value: _data[j].value
            },
            position: { x: relativeX, y: relativeY + radius + 0.25, z: relativeZ },
            origin_color: actualColor
        };
        piePart.DOMElement = el;
        this.parts.push(piePart);
        var myFunc = function (chart, element) {
            
            if (chart._dimension) {
                var myDim = chart._dimension;
                myDim.filterAll();
                myDim = myDim.filter(element.data.key);
                if (chart._parentPanel) {
                    chart._parentPanel.rebuild(chart._panelIndex);
                }
            }
        };
        var myBindFunc = myFunc.bind(null,this,piePart);
        el.addEventListener("click", myBindFunc);


        entityEl.appendChild(el);
        //entityEl.appendChild(texto);
    }
    //binding elements.
    this.addEvents();
    entityEl.setAttribute('position', {
        x: this._coords.x  ,
        y: this._coords.y  ,
        z: this._coords.z
    });
    this.domElement = entityEl;
    return entityEl;
}

//pieChart end
//BAR CHART BEGIN
AFRAMEDC.BarsChart = function (param) {
    AFRAMEDC.BasicChart.call(this, param);
};
AFRAMEDC.BarsChart.prototype = Object.create(AFRAMEDC.BasicChart.prototype);
AFRAMEDC.BarsChart.prototype.constructor = AFRAMEDC.BarsChart;
AFRAMEDC.BarsChart.prototype.build = function () {
    if ((!this._data || this._data.length === 0) &&
           !this._group) return;
    var __calculateY = function(initialY, height){
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
    var _data;
    if (this._data && this._data.length > 0) {
        _data = this._data;
    } else if (this._group){
        _data = this.sortCFData();
    }
    var dataValues = _data.map(function (a) { return a.value; });;
    dataValues = AFRAMEDC.utils.scale.apply(null, dataValues);
    BAR_WIDTH = this._width / dataValues.length;;
    BAR_DEPTH = this._depth;
    MAX_HEIGHT = this._height;
    COLORS = ['#2338D9', '#23A2D9', '#23D978', '#BAD923', '#D923D3'];
    var entityEl = document.createElement('a-entity');
    var yMaxPoint = 0;

    var relativeX, relativeY, relativeZ;
    relativeX = BAR_WIDTH/2;
    relativeY =0;
    relativeZ = this._depth / 2; 
    
    for (var i = 0; i < dataValues.length; i++) {
        var myHeight = dataValues[i] * MAX_HEIGHT;
        var myYPosition = __calculateY(relativeY, myHeight) ;
        var el = document.createElement('a-box');
        var actualColor =this._color || COLORS[i % COLORS.length];
        var elPos = { x: relativeX, y: myYPosition, z: relativeZ  };

        el.setAttribute('width', BAR_WIDTH);
        el.setAttribute('height', myHeight );
        el.setAttribute('depth', BAR_DEPTH);
        el.setAttribute('color', actualColor);
        el.setAttribute('position', elPos);
        relativeX += BAR_WIDTH;
        
        //storing parts info..
        var barPart = {
            name: "key:" + _data[i].key + " value:" + _data[i].value,
            data: {
                key: _data[i].key,
                value: _data[i].value
            },
            position: { x: elPos.x, y: relativeY + MAX_HEIGHT + 0.25, z: elPos.z },
            origin_color: actualColor
        };
        barPart.DOMElement = el;
        this.parts.push(barPart);
        //getting max.
        entityEl.appendChild(el);
    }
    this.addEvents();
    var entLabels = this.addLabels();
    for (var lb = 0 ; lb < entLabels.length; lb++) {
        entityEl.appendChild(entLabels[lb]);
    }
    if (this._gridsOn) {
        entityEl.appendChild(this.addGrid());
    }
    entityEl.setAttribute('position', { x: this._coords.x, y: this._coords.y, z: this._coords.z });
    this.domElement = entityEl;
    return entityEl;
};
//BAR CHART END

//smooth chart begin
AFRAMEDC.SmoothCurveChart = function (param) {
    AFRAMEDC.BasicChart.call(this, param);
};
AFRAMEDC.SmoothCurveChart.prototype = Object.create(AFRAMEDC.BasicChart.prototype);
AFRAMEDC.SmoothCurveChart.prototype.constructor = AFRAMEDC.SmoothCurveChart;
AFRAMEDC.SmoothCurveChart.prototype.build = function () {
    if (!this._data || this._data.length === 0) return;

    COLORS = ['#2338D9', '#23A2D9', '#23D978', '#BAD923', '#D923D3'];
    var entityEl = document.createElement('a-entity');
    var yMaxPoint = 0;
    var dataValues = this._data.map(function (a) { return a.value; });;
    dataValues = AFRAMEDC.utils.scale.apply(null, dataValues);

    var step = this._width/ dataValues.length;
    var x = 0;
    var points =[];
    for (var i = 0; i < dataValues.length; i++) {
        points.push(new THREE.Vector3(x, (this._height * dataValues[i]), 0));
        x += step;
    };
    entityEl.setAttribute('smooth-curve-path', {
        color: COLORS[0],
        path: points.map(AFRAME.utils.coordinates.stringify).join(",")
    });
    var entLabels = this.addLabels();
    for (var lb = 0 ; lb < entLabels.length; lb++) {
        entityEl.appendChild(entLabels[lb]);
    }
    if (this._gridsOn) {
        entityEl.appendChild(this.addGrid());
    }
    entityEl.setAttribute('position', { x: this._coords.x, y: this._coords.y, z: this._coords.z });
    this.domElement = entityEl;
    return entityEl;
};

//smooth chart end