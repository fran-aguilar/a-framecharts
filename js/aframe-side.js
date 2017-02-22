AFRAME.registerComponent('aframe-side', {
    multiple: true,
    schema: {
        //x y z
        a: { type: 'vec2', default: { x: 0, y: 0 } },
        b: { type: 'vec2', default: { x: 2, y: 0 } },
        c: { type: 'vec2', default: { x: 2 , y: 2 } },
        d: { type: 'vec2', default: { x: 0, y: 0 } },
        color: { default: '#F00' }
    },
    init: function () {
        var data = this.data;
        var entityEl = this.el;
        var path1 = document.createElement('a-entity');
        path1.setAttribute('aframe-triangle', {
            a: data.a,
            b: data.d,
            c: data.b,
            color: data.color
        });
        var path2 = document.createElement('a-entity');
        path2.setAttribute('aframe-triangle', {
            a: data.b,
            b: data.d,
            c: data.c,
            color: data.color
        });
         group = new THREE.Object3D();

        entityEl.appendChild(path1);
        entityEl.appendChild(path2);
       
    },
    update: function (oldData) {
        var data = this.data;
        var el = this.el;
        // If `oldData` is empty, then this means we're in the initialization process.
        // No need to update.
        if (Object.keys(oldData).length === 0) { return; }
        // Material-related properties changed. Update the material.
        if (data.color !== oldData.color) {
            for (var i = 0; i < el.children.length; i++) {
                el.children[i].getObject3D('mesh').material.color = new THREE.Color(data.color);
            }

        }
    },
    play: function () {
       // console.log('play');
    }
});