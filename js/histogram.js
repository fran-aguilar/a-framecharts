//registering component

AFRAME.registerComponent('histogram', {
    BAR_WIDTH: 0.8,
    BAR_DEPTH: 0.5,
    STARTING_POINT: {x:-2, y:0,z: -4},
    MAX_WIDTH: 8,
    COLORS : ['#2338D9', '#23A2D9','#23D978','#BAD923','#D923D3'],
    init: function () {
        var entityEl = this.el;
        var _this= this;
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
               for(var j= 0; j < JsonData.histogram.series[i].data.length; j++)
               {
                    var myHeight = JsonData.histogram.series[i].data[j];
                    var myYPosition = _this.__calculateY(relativeY, myHeight);
                    var el = document.createElement('a-box');
                    el.setAttribute('width',_this.BAR_WIDTH);
                    el.setAttribute('height', myHeight);
                    el.setAttribute('depth',_this.BAR_DEPTH);
                    el.setAttribute('color',_this.COLORS[ i % _this.COLORS.length]);
                   
                    
                    el.setAttribute('position', { x: relativeX, y: myYPosition, z: relativeZ });
                    //ojo esto
                    el.addEventListener('click', function (event) {
                        this.setAttribute('color', 'red');
                    });
                    xPointArray.push(relativeX);
                    relativeX += 1;
                    
                    //getting max.
                    if(myHeight > yMaxPoint){
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
            
            _this.__createXaxis(_this , xPointArray);
       
            if(zPointArray.length >1){
                _this.__createZaxis(_this, zPointArray);
            }
        });


    },
    /**
     * @private
     */
    __calculateY : function __calculateY(initialY, height){
            var returnedY = height / 2 + initialY;
            return returnedY;
    },
    __createXaxis: function __createXaxis(_this, xPointArray){
        xMin = xPointArray[0] - (_this.BAR_WIDTH /2) -0.1;
        xMax = xPointArray[xPointArray.length -1] + (_this.BAR_WIDTH /2) +0.1;
        var newLine = document.createElement("a-entity");
        newLine.setAttribute("aframe-line",{ 
            topoint: {x:xMin,y:_this.STARTING_POINT.y, z: _this.STARTING_POINT.z + 0.4},
            frompoint:{x:xMax, y:_this.STARTING_POINT.y, z: _this.STARTING_POINT.z + 0.4},
            color: 'black'
        });
        _this.el.appendChild(newLine);
    },
    __createYaxis: function __createYaxis(_this,yMaxPoint){
        yMin = _this.STARTING_POINT.y;
        yMax = yMaxPoint+ 0.1;
        var newLine = document.createElement("a-entity");
        newLine.setAttribute("aframe-line",{ 
            topoint: {x:_this.STARTING_POINT.x - (_this.BAR_WIDTH /2) -0.1,y:yMin , z: _this.STARTING_POINT.z + 0.4},
            frompoint:{x:_this.STARTING_POINT.x - (_this.BAR_WIDTH /2) -0.1, y:yMax, z: _this.STARTING_POINT.z + 0.4},
            color: 'black'
        });
        _this.el.appendChild(newLine);
    },
    __createZaxis: function __createZaxis(_this, zPointArray){
        zMin = zPointArray[0] + 0.4;
        zMax = zPointArray[zPointArray.length -1] - (_this.BAR_DEPTH /2) -0.4;
        var newLine = document.createElement("a-entity");
        newLine.setAttribute("aframe-line",{ 
            topoint: {x:_this.STARTING_POINT.x - (_this.BAR_WIDTH /2) -0.1,y:_this.STARTING_POINT.y, z: zMin},
            frompoint:{x:_this.STARTING_POINT.x - (_this.BAR_WIDTH /2) -0.1, y:_this.STARTING_POINT.y, z: zMax},
            color: 'black'
        });
        _this.el.appendChild(newLine);
    }

});