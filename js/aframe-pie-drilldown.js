AFRAME.registerComponent('aframe-pie-drilldown', {
    schema: {
        foo: { type: 'string', default: 'bar' }
    },
    COLORS: ['#2338D9', '#23A2D9', '#23D978', '#BAD923', '#D923D3', '#23D7D7', '#D72323', '#262C07'],
    STARTING_POINT: { x: 0, y: 0, z: -1 },
    init: function () {
        var entityEl = this.el;
        var _this= this;
        var thethainit = 0;
        var FONT_HEIGHT = 2;
        var MIN_DISTANCE = (0.01 + 0.04615) * FONT_HEIGHT; // 
        $.getJSON('data/first-data-pie-example.json', function (JsonData) {
            //data is the JSON string
            _this.jsonData = JsonData;
            var relativeX = _this.STARTING_POINT.x; //calculado en un futuro.
            var relativeY = _this.STARTING_POINT.y; //
            var relativeZ = _this.STARTING_POINT.z;
            var isDistanced = function(prevPoints, refpoint, min_distance){
                if(!prevPoints) return -1;
                var found = false;
                var p = 0;
                while(p < prevPoints.length && !found){
                    found = (Math.abs(prevPoints[p].y - actualLabelPoint.y ) < MIN_DISTANCE) && Math.sign(actualLabelPoint.x) == Math.sign(prevPoints[p].x);
                    if(!found)
                        p=p+1;
                }
                return found ? p : -1;
            };
            var prevLabelPoints =[];
            for(var j= 0; j < JsonData.series[0].data.length; j++)
            {
                var myThethaLength =( 360 * JsonData.series[0].data[j].y)/100;
                var el = document.createElement('a-cylinder');

                el.setAttribute('theta-start', thethainit);
                el.setAttribute('theta-length', myThethaLength);
                el.setAttribute('scale', { x: 1, y: 0.5, z: 1 });
                

                //setting label
                var angleLabel = (thethainit + (myThethaLength / 2));
                //to rads
                angleLabel = (angleLabel * 2 * Math.PI) / 360;
                //min distance.
                var actualLabelPoint = { x: Math.sin(angleLabel) * 1.4, y: Math.cos(angleLabel) * 1.4, z: relativeZ };
                if (prevLabelPoints.length >0) {
                    var distIndex = isDistanced(prevLabelPoints, actualLabelPoint, MIN_DISTANCE);
                    if ( distIndex != -1) {
                        actualLabelPoint.y = prevLabelPoints[prevLabelPoints.length - 1].y + MIN_DISTANCE * (angleLabel <= Math.PI ? -1 : 1);
                    }
                }
                if (angleLabel <= Math.PI) {
                    actualLabelPoint.x = actualLabelPoint.x + 1.4;
                } else {
                    actualLabelPoint.x = actualLabelPoint.x - 1.4;
                }
                var texto = document.createElement('a-entity');
                //todo: recalculate distance from graph.
                texto.setAttribute('position', actualLabelPoint);
                
                texto.setAttribute('id', 'label' + j);
                texto.setAttribute('text', {
                    color: _this.COLORS[j % _this.COLORS.length],
                    side: 'double',
                    value: JsonData.series[0].data[j].name,
                    width: 2,
                    align: angleLabel <= Math.PI ? 'left' : 'right'
                });
                texto.setAttribute('visible', true);
                //texto.setAttribute('geometry',{primitive: 'plane', width: 'auto', height: 'auto'});

                el.setAttribute('color', _this.COLORS[j % _this.COLORS.length]);
                el.setAttribute('position', { x: relativeX, y: relativeY, z: relativeZ });
                el.setAttribute('rotation', { x: -90, y: 0, z: 0 });
                el.setAttribute('id', 'pie' + j);

                thethainit = thethainit + myThethaLength;
                prevLabelPoints.push(actualLabelPoint);

                //drillDown
                el.addEventListener('click', function (event) {
                    var elId = this.getAttribute('id');
                    var id = elId.substring('pie'.length, elId.length);
                    var text = this.parentEl.querySelector('#label' + id);
                    var actualVis = text.getAttribute('visible');
                    text.setAttribute('visible', !actualVis);
                });
                    
                    
                entityEl.appendChild(el);
                entityEl.appendChild(texto);
            }
        });
    }, update: function(oldData) {
        console.log(this.jsonData);
    }
});