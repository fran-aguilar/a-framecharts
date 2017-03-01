AFRAME.registerComponent('aframe-triangle', {
    multiple: true,
    schema: {
        //x y z
        a: { type: 'vec3', default: { x: 0, y: 0    ,z:0} },
        b: { type: 'vec3', default: { x: -0.5, y: 2 ,z:0} },
        c: { type: 'vec3', default: { x: 0.5, y: 2  ,z:0} },
        color: { default: '#F00' }
    },
    init: function () {
        var data = this.data;
        var triangleShape = new THREE.Shape();
        triangleShape.moveTo(data.a.x, data.a.y);
        triangleShape.lineTo(data.b.x, data.b.y);
        triangleShape.lineTo(data.c.x, data.c.y);
        triangleShape.lineTo(data.a.x, data.a.y);

        var ShapeGeometry = new THREE.ShapeBufferGeometry(triangleShape);
        var meshMaterial = new THREE.MeshPhongMaterial({
            color: data.color, side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.8
        });
        var mesh = new THREE.Mesh(ShapeGeometry, meshMaterial);

        this.mesh = mesh;
        this.material = meshMaterial;
        this.geometry = ShapeGeometry;
        this.el.setObject3D('mesh', this.mesh);
    },  update: function (oldData) {
            var data = this.data;
            var el = this.el;
            // If `oldData` is empty, then this means we're in the initialization process.
            // No need to update.
            if (Object.keys(oldData).length === 0) { return; }

            // Material-related properties changed. Update the material.
            if (data.color !== oldData.color) {
                el.getObject3D('mesh').material.color = data.color;
            }
    },
    play: function () {
        //console.log('play');
    }
});