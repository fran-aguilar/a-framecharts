
AFRAME.registerComponent('aframe-grid', {
    schema: {
        height: { default: 1 },
        width: { default: 1 },
        nylabels: { default: 4 },
        nxlabels: { default: 4 },
        path: {
            default: "-0.5 0 0, 0.5 0 0",

            // Deserialize path in the form of comma-separated vec3s: `0 0 0, 1 1 1, 2 0 3`.
            parse: function (value) {
                if (Array.isArray(value)) {
                    return value;
                }
                return value.split(',').map(AFRAME.utils.coordinates.parse);
            }

            // Serialize array of vec3s in case someone does setAttribute('line', 'path', [...]).
            //stringify: function (data) {
            //    return data.map(coordinates.stringify).join(',');
            //}
        }
    },

    update: function () {
        var data = this.data;
        var material = new THREE.LineBasicMaterial({
            color: 0x000000,
            linewidth: 1
        });

        var stepY = data.height / data.nylabels;

        var grids = new THREE.Object3D();
        for (var i = 0; i < data.nylabels + 1; i++) {
            grids.add(putYGrid(i * stepY));
        };


        var stepX = data.width / data.nxlabels;


        for (var i = 0; i < data.nxlabels + 1; i++) {
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
/*var material = new THREE.LineBasicMaterial({
    color: 0x000000,
    linewidth: 1
});

var stepY = this._height / this._numberOfYLabels;

var grids = new THREE.Object3D();
for (var i = 0; i < this._numberOfYLabels + 1; i++) {
    grids.add(putYGrid(i * stepY));
};


var stepX = this._width / this._numberOfXLabels;


for (var i = 0; i < this._numberOfXLabels + 1; i++) {
    grids.add(putXGrid(i * stepX));
};


function putXGrid(step) {

    var verticalGeometry = new THREE.Geometry();

    verticalGeometry.vertices.push(
        new THREE.Vector3(0, -10, 0),
        new THREE.Vector3(0, this._height, 0)
    );
    var verticalLine = new THREE.Line(verticalGeometry, material);

    verticalLine.position.set(this.coords.x + step, this.coords.y, this.coords.z);
    return verticalLine;

}

function putYGrid(step) {

    var horizontalGeometry = new THREE.Geometry();

    horizontalGeometry.vertices.push(
        new THREE.Vector3(-10, 0, 0),
        new THREE.Vector3(this._width, 0, 0)
    );
    var horizontalLine = new THREE.Line(horizontalGeometry, material);

    horizontalLine.position.set(this.coords.x, this.coords.y + step, this.coords.z);
    return horizontalLine;

}*/