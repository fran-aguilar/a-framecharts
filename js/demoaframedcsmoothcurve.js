//ensure window loaded
window.onload = function () {
    //adding scene
    var scenediv = document.getElementById("scene");
    var scene = document.createElement("a-scene");
    scene.setAttribute('embedded', {});
    scenediv.appendChild(scene);

    //setting camera
    scene.addEventListener("loaded", function (ev) {
        //taking existing camera.Adding my custom components.
        var camera = document.querySelector("[camera]");
        camera.setAttribute("mouse-cursor", "");
    });

    var dashboard = aframedc.dashBoard(scene);
    var mylinechart = aframedc.smoothCurveChart()
            .data([{ key: 'bla', value: 85 }, { key: 'bla2', value: 21 }, { key: 'bla2', value: 10 }, { key: 'bla2', value: 5 }, { key: 'bla2', value: 38 }, { key: 'bla2', value: 200 },
    { key: 'bla', value: 85 }, { key: 'bla2', value: 21 }, { key: 'bla2', value: 10 }, { key: 'bla2', value: 5 }, { key: 'bla2', value: 38 }, { key: 'bla2', value: 200 },
{ key: 'bla', value: 85 }, { key: 'bla2', value: 21 }, { key: 'bla2', value: 10 }, { key: 'bla2', value: 5 }, { key: 'bla2', value: 38 }, { key: 'bla2', value: 200 }])
            .width(14)
            .depth(3)
            .gridsOn(true);
    // Example 1
    dashboard.addChart(mylinechart);
};