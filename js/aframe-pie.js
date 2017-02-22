AFRAME.registerComponent('aframe-pie', {
    COLORS: ['#2338D9', '#23A2D9', '#23D978', '#BAD923', '#D923D3', '#23D7D7', '#D72323', '#262C07'],
    STARTING_POINT: { x: -2, y: 0, z: -4 },
    init: function () {
        var entityEl = this.el;
        var _this= this;
        var thethainit = 0;
        $.getJSON('data/first-data-pie-example.json', function (JsonData) {
            //data is the JSON string
            var relativeX = _this.STARTING_POINT.x; //calculado en un futuro.
            var relativeY = _this.STARTING_POINT.y; //
            var relativeZ = _this.STARTING_POINT.z;
            for(var j= 0; j < JsonData.series[0].data.length; j++)
            {
                var myThethaLength =( 360 * JsonData.series[0].data[j].y)/100;
                var el = document.createElement('a-cylinder');

                el.setAttribute('theta-start', thethainit);
                el.setAttribute('theta-length', myThethaLength);
                    
                thethainit = thethainit + myThethaLength;
                el.setAttribute('color', _this.COLORS[j % _this.COLORS.length]);
                    
                    
                el.setAttribute('position', { x: relativeX, y: relativeY, z: relativeZ });
                //TODO: going to delete.
                el.addEventListener('click', function (event) {
                    this.setAttribute('color', '#23d7d7'); //azul muy chillón
                });
                    
                    
                entityEl.appendChild(el);
            }
        });
    }
});