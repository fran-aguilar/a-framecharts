AFRAME.registerGeometry('triangle', {
    schema: {
        //x y z
        a: { type: 'vec3', default: { x: 0, y: 0   ,z:0  } },
        b: { type: 'vec3', default: { x: -0.5, y: 2,z:0  } },
        c: { type: 'vec3', default: { x: 0.5, y: 2 ,z:0  } },
    },

    init: function (data) {
        //var data = this.data;
        var triangleShape = new THREE.Shape();
        triangleShape.moveTo(data.a.x, data.a.y);
        triangleShape.lineTo(data.b.x, data.b.y);
        triangleShape.lineTo(data.c.x, data.c.y);
        triangleShape.lineTo(data.a.x, data.a.y);

        this.geometry= new THREE.ShapeGeometry(triangleShape);
    },
    update: function (oldData) {
        console.log('act');
    }
});