AFRAME.registerComponent('smooth-curve-path', {
    schema: {
        color: { default: '#000' },
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
        var material = new THREE.LineBasicMaterial({
            color: this.data.color
        });
        var curve, vertices =[]; 
        this.data.path.forEach(function (vec3) {
            vertices.push(
              new THREE.Vector3(vec3.x, vec3.y, vec3.z)
            );
        });
        curve = new THREE.CatmullRomCurve3(vertices);

        var geometry = new THREE.Geometry();
        geometry.vertices = curve.getPoints(512);
        var curveObject = new THREE.Line(geometry, material);
        this.el.setObject3D('mesh', curveObject);
    },

    remove: function () {
        this.el.removeObject3D('mesh');
    }
});