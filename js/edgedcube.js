AFRAME.registerGeometry('edgedcube', {
    schema: {
        //x y z
        width: { type: 'number', default: 1 },
        depth: {type: 'number', default : 1},
        inith: { type: 'number', default: 1 },
        lasth: { type: 'number', default: 2 },
    },

    init: function (data) {
        //create a triangular geometry
        // var material = new THREE.MeshPhongMaterial({ color: 0xff0000 });
        
        if (data.width < 0 || data.depth < 0 || data.inith < 0 || data.lasth < 0) {
            this.geometry = null;
        }
        var geometry = new THREE.Geometry();
        geometry.vertices.push(new THREE.Vector3(0, 0, 0));
        geometry.vertices.push(new THREE.Vector3(data.width, 0, 0));
        geometry.vertices.push(new THREE.Vector3(data.width, data.lasth, 0));
        geometry.vertices.push(new THREE.Vector3(0, data.inith, 0));

        geometry.vertices.push(new THREE.Vector3(0, 0, data.depth * -1));
        geometry.vertices.push(new THREE.Vector3(data.width, 0, data.depth * -1));
        geometry.vertices.push(new THREE.Vector3(data.width, data.lasth, data.depth * -1));
        geometry.vertices.push(new THREE.Vector3(0, data.inith, data.depth * -1));
        //create a new face using vertices 0, 1, 2
        //var normal = new THREE.Vector3(0, 1, 0); //optional
        //var color = new THREE.Color(0xffaa00); //optional
        //var materialIndex = 0; //optional
        var face1 = new THREE.Face3(0, 2, 3);
        var face2 = new THREE.Face3(0, 1, 2);

        var face3 = new THREE.Face3(0, 1, 4);
        var face4 = new THREE.Face3(1, 5, 4);

        var face5 = new THREE.Face3(1, 5, 2);
        var face6 = new THREE.Face3(5, 6, 2);

        var face7 = new THREE.Face3(0, 3, 4);
        var face8 = new THREE.Face3(4, 3, 7);

        var face9 = new THREE.Face3(4, 7, 5);
        var face10 = new THREE.Face3(7, 6, 5);

        var face11 = new THREE.Face3(3, 2, 7);
        var face12 = new THREE.Face3(2, 6, 7);
        //add the face to the geometry's faces array
        geometry.faces.push(face1);
        geometry.faces.push(face2);

        geometry.faces.push(face3);
        geometry.faces.push(face4);

        geometry.faces.push(face5);
        geometry.faces.push(face6);

        geometry.faces.push(face7);
        geometry.faces.push(face8);

        geometry.faces.push(face9);
        geometry.faces.push(face10);

        geometry.faces.push(face11);
        geometry.faces.push(face12);
        //the face normals and vertex normals can be calculated automatically if not supplied above
        geometry.computeFaceNormals();
        geometry.computeVertexNormals();

        //this.mesh = new THREE.Mesh(geometry, material);
        //this.el.setObject3D('mesh', this.mesh);

        this.geometry =  geometry;
    },
    update: function (oldData) {
        console.log('act');
    }
});