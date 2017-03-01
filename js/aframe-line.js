AFRAME.registerComponent('aframe-line',{
    multiple: true,
    schema: {
        //x y z
        topoint: {type:'vec3', default: {x: 0, y: 0, z: 0}},
        frompoint: {type:'vec3', default: {x: 0, y: 0, z: 0}},
        color: {default:'#000'}
    },
    init: function(){
        
        this.geometry = new THREE.Geometry();
        var vertArray = this.geometry.vertices;
       // var cameraPosition = this.el.sceneEl.querySelector("[camera]").object3D.position;
       // cameraPosition.z = cameraPosition.z-4;
       // var pointTo = new THREE.Vector3(cameraPosition.x,cameraPosition.y +100,cameraPosition.z);
        var scene = this.el.sceneEl.object3D;
        var vectTo = new THREE.Vector3( );
        var datapoint = this.data.topoint;
       
        vectTo.setX(datapoint.x);
        vectTo.setY(datapoint.y);
        vectTo.setZ(datapoint.z);
        var vectFrom = new THREE.Vector3();
        var datapoint = this.data.frompoint;
        vectFrom.setX(datapoint.x);
        vectFrom.setY(datapoint.y);
        vectFrom.setZ(datapoint.z);
        vertArray.push(vectTo , vectFrom);
        this.geometry.computeLineDistances();
        var lineMaterial = new THREE.LineBasicMaterial( { color: this.data.color } );
        var lineMesh = new THREE.Line(this.geometry, lineMaterial);
        this.mesh = lineMesh;
        this.material = lineMaterial;
        this.el.setObject3D('mesh', this.mesh);
    },
    update: function(){
        console.log('update meth');
    },
    play: function(){
        console.log('play');
    }
});