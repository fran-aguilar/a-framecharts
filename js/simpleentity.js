AFRAME.registerComponent('simple-comp', {
    multiple: true,
    schema: {
    },
    //init: function () {
    //    //create a triangular geometry
    //    var material = new THREE.MeshStandardMaterial({ color: 0x00cc00 });

    //    var geometry = new THREE.Geometry();
    //    geometry.vertices.push(new THREE.Vector3(-1, -1, 0));
    //    geometry.vertices.push(new THREE.Vector3(1, -1, 0));
    //    geometry.vertices.push(new THREE.Vector3(1, 1, 0));

    //    //create a new face using vertices 0, 1, 2
    //    var normal = new THREE.Vector3(0, 1, 0); //optional
    //    var color = new THREE.Color(0xffaa00); //optional
    //    var materialIndex = 0; //optional
    //    var face = new THREE.Face3(0, 1, 2, normal, color, materialIndex);

    //    //add the face to the geometry's faces array
    //    geometry.faces.push(face);

    //    //the face normals and vertex normals can be calculated automatically if not supplied above
    //    geometry.computeFaceNormals();
    //    geometry.computeVertexNormals();

    //    this.mesh = new THREE.Mesh(geometry, material);
    //    this.el.setObject3D('mesh', this.mesh);

    //},
    init: function () {
        //create a triangular geometry
        var material = new THREE.MeshPhongMaterial({ color: 0xff0000 });

        var geometry = new THREE.Geometry();
        geometry.vertices.push(new THREE.Vector3(0, 0, 0));
        geometry.vertices.push(new THREE.Vector3(1, 0, 0));
        geometry.vertices.push(new THREE.Vector3(1, 2, 0));
        geometry.vertices.push(new THREE.Vector3(0, 1.5, 0));

        geometry.vertices.push(new THREE.Vector3(0, 0, -1));
        geometry.vertices.push(new THREE.Vector3(1, 0, -1));
        geometry.vertices.push(new THREE.Vector3(1, 2, -1));
        geometry.vertices.push(new THREE.Vector3(0, 1.5, -1));
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

        var face11= new THREE.Face3(3, 2, 7);
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

        this.mesh = new THREE.Mesh(geometry, material);
        this.el.setObject3D('mesh', this.mesh);

    }

    , __createSide: function () {
        var squareGeometry = new THREE.Geometry(); 
        squareGeometry.vertices.push(new THREE.Vector3(-1.0,  1.0, 0.0)); 
        squareGeometry.vertices.push(new THREE.Vector3( 1.0,  1.0, 0.0)); 
        squareGeometry.vertices.push(new THREE.Vector3( 1.0, -1.0, 0.0)); 
        squareGeometry.vertices.push(new THREE.Vector3(-1.0, -1.0, 0.0)); 
        squareGeometry.faces.push(new THREE.Face3(0, 1, 2)); 
        squareGeometry.faces.push(new THREE.Face3(0, 2, 3)); 
        
         ;
    }

});

/*
for (var i = 0; i < _data.length; i++) {
    if(_data[i+1]){
        var barHeight1=(_chart._height*_data[i].value)/topValue;
        var barHeight2=(_chart._height*_data[i+1].value)/topValue;

        var lineShape = new THREE.Shape();
        lineShape.moveTo(0,0);
        lineShape.lineTo( 0, barHeight1);
        lineShape.lineTo( barWidth, barHeight2 );

        lineShape.lineTo( barWidth, 0 );
        lineShape.lineTo( 0, 0 );
        var extrusionSettings = {curveSegments:1,
            amount: _chart._depth,
            bevelEnabled: true,
            bevelSegments: 4,
            steps: 2,
            bevelSize: 1,
            bevelThickness: 1 };
        var charGeometry = new THREE.ExtrudeGeometry( lineShape, extrusionSettings );
        var origin_color=_chart._color;
        var material = new THREE.MeshPhongMaterial( {color: origin_color,
            specular: 0x999999,
            shininess: 100,
            shading : THREE.SmoothShading,
            opacity:_chart._opacity,
            transparent: true
        } );
        var linePart = new THREE.Mesh( charGeometry, material );
        
        linePart.position.set(x+_chart.coords.x,_chart.coords.y,_chart.coords.z);
        linePart.name="key:"+_data[i].key+" value: "+_data[i].value;
        linePart.data={
            key:_data[i].key,
            value:_data[i].value
        };
        linePart.parentChart=_chart;
        x+=barWidth;
        _chart.parts.push(linePart);
    }
};

_chart.addEvents();
_chart.addLabels();
if (_chart._gridsOn) _chart.addGrids();


}

return _chart;

}*/