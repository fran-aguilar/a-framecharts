﻿
AFRAME.registerComponent('aframe-grid', {
    schema: {
        height: { default: 1 },
        width: { default: 1 },
        ysteps: { default: 4 },
        xsteps: { default: 4 }
    },

    update: function () {
        var data = this.data;
        var material = new THREE.LineBasicMaterial({
            color: 0x000000,
            linewidth: 1
        });

        var stepY = data.height / data.ysteps;

        var grids = new THREE.Object3D();
        for (var i = 0; i < data.ysteps + 1; i++) {
            grids.add(putYGrid(i * stepY));
        };


        var stepX = data.width / data.xsteps;


        for (var i = 0; i < data.xsteps + 1; i++) {
            grids.add(putXGrid(i * stepX));
        };


        function putXGrid(step) {

            var verticalGeometry = new THREE.Geometry();

            verticalGeometry.vertices.push(
                new THREE.Vector3(0, -0.2, 0),
                new THREE.Vector3(0, data.height, 0)
            );
            var verticalLine = new THREE.Line(verticalGeometry, material);

            verticalLine.position.set(step, 0, 0);
            return verticalLine;

        };

        function putYGrid(step) {

            var horizontalGeometry = new THREE.Geometry();

            horizontalGeometry.vertices.push(
                new THREE.Vector3(-0.2, 0, 0),
                new THREE.Vector3(data.width, 0, 0)
            );
            var horizontalLine = new THREE.Line(horizontalGeometry, material);

            horizontalLine.position.set(0, step, 0);
            return horizontalLine;

        };
        this.el.setObject3D('group', grids);
    },

    remove: function () {
        this.el.removeObject3D('group');
    }
});
