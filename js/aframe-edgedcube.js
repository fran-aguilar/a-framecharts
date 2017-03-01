AFRAME.registerComponent('aframe-edgedcube', {
    multiple: true,
    schema: {
        //x y z
        inity: { type: "number", default: 2 },
        lasty: { type: "number", default: 1 },
        width: { type: "number", default: 2 },
        color: { type: "color", default: '#F00' }
    },
    init: function () {
        var data = this.data;
        var entityEl = this.el;
        var sidefront = document.createElement('a-entity');
        var sideback = document.createElement('a-entity');

        var sideleft = document.createElement('a-entity');
        var sideright = document.createElement('a-entity');

        var sideunder = document.createElement('a-entity');
        var sideon = document.createElement('a-entity');
        sidefront.setAttribute('aframe-side',{ color: data.color,
            a: {x: 0, y: 0},
            b: {x:data.width, y: 0},
            c:{ x:data.width, y: data.lasty},
            d:{ x:0, y: data.inity}
        });
        sideback.setAttribute('aframe-side', {
            color: data.color,
            a: { x: 0, y: 0 },
            b: { x: data.width, y: 0 },
            c: { x: data.width, y: data.lasty },
            d: { x: 0, y: data.inity }
        });
        sideback.setAttribute('position', { x: 0, y: 0, z: -1 * data.width });
        sideleft.setAttribute('aframe-side', {
            color: data.color,
            a: { x: 0, y: 0 },
            b: { x: data.width, y: 0 },
            c: { x: data.width, y: data.inity },
            d: { x: 0, y: data.inity }
        });
        sideleft.setAttribute('rotation', { x: 0, y: 90, z: 0 });
        sideright.setAttribute('aframe-side', {
            color: data.color,
            a: { x: 0, y: 0 },
            b: { x: data.width, y: 0 },
            c: { x: data.width, y: data.lasty },
            d: { x: 0, y: data.lasty }
        });
        sideright.setAttribute('rotation', { x: 0, y: 90, z: 0 });
        sideright.setAttribute('position', { x: data.width, y: 0, z: 0 });

        sideunder.setAttribute('aframe-side', {
            color: data.color,
            a: { x: 0, y: 0 },
            b: { x: data.width, y: 0 },
            c: { x: data.width, y: data.width },
            d: { x: 0, y: data.width }
        });
        sideunder.setAttribute('rotation', { x: -90, y: 0, z: 0 });
        var heightdiff = data.inity - data.lasty;
        var onwidth = this.__getHypotenuse(Math.abs(heightdiff ),data.width);
        sideon.setAttribute('aframe-side', {
            color: data.color,
            a: { x: 0, y: 0 },
            b: { x: onwidth, y: 0 },
            c: { x: onwidth, y: data.width },
            d: { x: 0, y: data.width }
        });
        var xRotation = (360 * Math.atan( heightdiff / data.width)) / (Math.PI * 2);
        if (heightdiff > 0) {
            sideon.setAttribute('rotation', { x: xRotation - 90, y: 90, z: -90 });
        } else {
            sideon.setAttribute('rotation', { x: -xRotation - 90, y: -90, z: +90 });
   
        }
        sideon.setAttribute('position', { x: 0, y: data.inity, z: 0 });
        entityEl.appendChild(sidefront);
        entityEl.appendChild(sideback);

        entityEl.appendChild(sideleft);
        entityEl.appendChild(sideright);

        entityEl.appendChild(sideunder);
        entityEl.appendChild(sideon);
    },
    __getHypotenuse : function(a, b){
        return Math.hypot(a, b);
    },
    update: function (oldData) {
        
        var data = this.data;
        var el = this.el;
        // If `oldData` is empty, then this means we're in the initialization process.
        // No need to update.
        if (Object.keys(oldData).length === 0) { return; }
        // Material-related properties changed. Update the material.
        if (data.color !== oldData.color) {
            var items = el.querySelectorAll('[aframe-side]');
            for (var i = 0; i < items.length; i++) {
                var sideObj = items[i].getAttribute('aframe-side');
                items[i].setAttribute('aframe-side', {
                    color: data.color,
                    a: sideObj.a,
                    b: sideObj.b,
                    c: sideObj.c,
                    d: sideObj.d
                });
            }

        }
    },
    play: function () {
      //  console.log('play');
    }
});