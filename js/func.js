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
        chart._parentDashBoard;
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
                coords: new THREE.Vector3( - panel._size[0] / 2,  - panel._size[1] / 2, 0)
            });
            anchorPoints.push({
                filled: false,
                coords: new THREE.Vector3(0,  - panel._size[1] / 2,0)
            });
            anchorPoints.push({
                filled: false,
                coords: new THREE.Vector3( - panel._size[0] / 2, 0, 0)
            });
            anchorPoints.push({
                filled: false,
                coords: new THREE.Vector3(0, 0, 0)
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
                coords: new THREE.Vector3(panel.coords.x - panel._size[0] / 2, panel.coords.y - panel._size[1] / 2, panel.coords.z)
            });
            anchorPoints.push({
                filled: false,
                coords: new THREE.Vector3(panel.coords.x - panel._size[0] / 2, panel.coords.y, panel.coords.z)
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
    panel.id = 'panel';
    panel.appendChild(panelOffset);
    return panel;
};
//TODO: overwrite to add a panel obj.
AFRAMEDC.DashBoard.prototype.addPanel = function (coords, numberOfCharts, size, opacity) {
    if (arguments.length === 1 && coords instanceof AFRAMEDC.Panel) {
        this.allPanels.push(coords);
        this.scene.appendChild(coords.build());
        return;
    }

    var panelObj = new AFRAMEDC.Panel(coords, numberOfCharts, size, opacity);
    this.allPanels.push(panelObj);
    this.scene.appendChild(panelObj.build());
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
                this._width = param._size[0] / 2;
                this._height = param._size[1] / 2;
                this._coords = param.anchorPoints[i].coords;
                this._coords.x = this._coords.x;
                this._coords.y = this._coords.y;
                this._coords.z = this._coords.z;
                param.anchorPoints[i].filled = true;
                param.charts.push(this);
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
    this._color = color;
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

// data when crossfilter is not used
AFRAMEDC.BasicChart.prototype.data = function (data) {
    if (!arguments.length) {
        console.log("argument needed");
        return;
    }
    this._data = data;
    return this;
};
AFRAMEDC.BasicChart.prototype.getEscene = function () {
    if (this._parentPanel) {
        return this._parentPanel.dashBoard.scene;
    }
    if (this._parentDashBoard)
        return this._paretnDashBoard.scene;
};
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
    };
    var returnMeshColor = function (el) {
        var partelement = el;
        var meshEl = partelement.DOMElement.getObject3D('mesh');
        meshEl.material.emissive.setHex(partelement.currentHex);

        partelement.DOMElement.setObject3D('mesh', meshEl);
    }
    var showInfo = function (basicChart, el) {
        var texto;
        texto = document.querySelector('#tooltip');
        if (!texto) {
            texto = document.createElement("a-entity");
        } else {
            texto.parentElement.removeChild(texto);
        }
        var dark = 0x0A0A0A * 0x02;
        var darkercolor = Number.parseInt(el.origin_color.replace("#","0x")) - (0xA0A0A * 0x02);
        darkercolor ="#" + ("000000" + darkercolor.toString(16)).slice(-6)
        var TEXT_WIDTH = 6;
        texto.setAttribute("text", {
        color:  "#000000",
            side: "double",
            value: el.name,
            width: TEXT_WIDTH,
            wrapCount: 30
        });
        texto.setAttribute('id', 'tooltip');
        var labelpos = { x: el.position.x + TEXT_WIDTH / 2, y: el.position.y , z: el.position.z };
        
        texto.setAttribute('position', labelpos);
        //texto.setAttribute('geometry',{primitive: 'plane', width: 'auto', height: 'auto'});
        //basicChart.getEscene().appendChild(texto);
        el.DOMElement.parentElement.appendChild(texto);
    }
    var changeMeshColor = function (el) {
        //this - partElement
        var partelement = el;
        var meshEl = partelement.DOMElement.getObject3D('mesh');
        var threeCol = new THREE.Color(partelement.origin_color);
        partelement.currentHex = meshEl.material.emissive.getHex();
        meshEl.material.emissive.setHex(threeCol.getHex());
        partelement.DOMElement.setObject3D('mesh', meshEl);
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
            var xPos =     -0.6;
            //var yPos = BasicChart._coords.y + step +  0.36778332145402703 / 2;
            var yPos =   step;
            texto.setAttribute("text", {
                color: "#000000",
                side: "double",
                value: value.toString(),
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
        if (this._data) {
            var dataValues = this._data.map(function (a) { return a.value; });
            topYValue = Math.max.apply(null, dataValues);
            numberOfValues = dataValues.length;
        }

        //Y AXIS
        //var numerOfYLabels=Math.round(_chart._height/20);
        var stepYValue= Math.round(topYValue/this._numberOfYLabels);
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
    if (!this._data || this._data.length === 0) return;
    var relativeX, relativeY, relativeZ;
    var thethainit = 0;
    var FONT_HEIGHT = 2;
    var MIN_DISTANCE = (0.01 + 0.04615) * FONT_HEIGHT;
    var COLORS = ['#2338D9', '#23A2D9', '#23D978', '#BAD923', '#D923D3', '#23D7D7', '#D72323', '#262C07'];
    var entityEl = document.createElement("a-entity");
    var radius = Math.min(this._width / 2, this._height / 2);
    relativeX = radius;
    relativeY = radius;
    relativeZ = this._depth /2 ;
    var isDistanced = function (prevPoints, refpoint, min_distance) {
        if (!prevPoints) return -1;
        var found = false;
        var p = 0;
        while (p < prevPoints.length && !found) {
            found = (Math.abs(prevPoints[p].y - actualLabelPoint.y) < MIN_DISTANCE) && Math.sign(actualLabelPoint.x) == Math.sign(prevPoints[p].x);
            if (!found)
                p = p + 1;
        }
        return found ? p : -1;
    };
    var prevLabelPoints = [];

    for (var j = 0; j < this._data.length; j++) {
        var myThethaLength = (360 * this._data[j].value) / 100;
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
        var actualLabelPoint = { x: Math.sin(angleLabel) * 1.4, y: Math.cos(angleLabel) * 1.4, z: relativeZ };
        if (prevLabelPoints.length > 0) {
            var distIndex = isDistanced(prevLabelPoints, actualLabelPoint, MIN_DISTANCE);
            if (distIndex != -1) {
                actualLabelPoint.y = prevLabelPoints[prevLabelPoints.length - 1].y + MIN_DISTANCE * (angleLabel <= Math.PI ? -1 : 1);
            }
        }
        if (angleLabel <= Math.PI) {
            actualLabelPoint.x = actualLabelPoint.x + 1.4;
        } else {
            actualLabelPoint.x = actualLabelPoint.x - 1.4;
        }
        //var texto = document.createElement("a-entity");
        ////todo: recalculate distance from graph.
        //texto.setAttribute("position", actualLabelPoint);
        //texto.setAttribute("id", "label" + j);
        //texto.setAttribute("text", {
        //    color: _this.COLORS[j % _this.COLORS.length],
        //    side: "double",
        //    value: JsonData.series[0].data[j].name,
        //    width: 2,
        //    align: angleLabel <= Math.PI ? "left" : "right"
        //});
        //texto.setAttribute("visible", false);
        //texto.setAttribute("geometry",{primitive: "plane", width: "auto", height: "auto"});
        var actualColor = COLORS[j % COLORS.length];
        el.setAttribute("color", actualColor);
        el.setAttribute("position", { x: relativeX, y: relativeY, z: relativeZ });
        el.setAttribute("rotation", { x: -90, y: 0, z: 0 });
        //el.setAttribute("id", "pie" + j);

        thethainit = thethainit + myThethaLength;
        prevLabelPoints.push(actualLabelPoint);
        //TODO: going to delete.
        //el.addEventListener("click", function (event) {
        //    var elId = this.getAttribute("id");
        //    var id = elId.substring("pie".length, elId.length);
        //    var text = this.parentEl.querySelector("#label" + id);
        //    var actualVis = text.getAttribute("visible");
        //    text.setAttribute("visible", !actualVis);
        //});
        //storing parts info..
        var piePart = {
            name: "key:" + this._data[j].key + " value:" + this._data[j].value,
            data: {
                key: this._data[j].key,
                value: this._data[j].value
            },
            position: { x: relativeX, y: relativeY + this._width / 2 + 0.25, z: relativeZ },
            origin_color: actualColor
        };
        piePart.DOMElement = el;
        this.parts.push(piePart);
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
    if (!this._data || this._data.length === 0) return;
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
    var dataValues = this._data.map(function (a) { return a.value; });;
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
        var actualColor = COLORS[i % COLORS.length];
        var elPos = { x: relativeX, y: myYPosition, z: relativeZ  };

        el.setAttribute('width', BAR_WIDTH);
        el.setAttribute('height', myHeight );
        el.setAttribute('depth', BAR_DEPTH);
        el.setAttribute('color', actualColor);
        el.setAttribute('position', elPos);
        relativeX += BAR_WIDTH;
        
        //storing parts info..
        var barPart = {
            name: "key:" + this._data[i].key + " value:" + this._data[i].value,
            data: {
                key: this._data[i].key,
                value: this._data[i].value
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
    entityEl.appendChild(this.addGrid());
    entityEl.setAttribute('position', { x: this._coords.x, y: this._coords.y, z: this._coords.z  });
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
    return entityEl;
};

//smooth chart end