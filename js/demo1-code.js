//ensure window loaded
window.onload = function () {

    aframedc.initscene();//creación de la escena.
    //creación del chart (asignación a la escena).
    var test2 = aframedc.pieChart();
    //component loaded.., 
    test2.addEventListener("loaded", function () {
        //added to the DOM.
        test2.data([{ key: 'bla', value: 85 }, { key: 'bla2', value: 21 }, { key: 'bla2', value: 10 }, { key: 'bla2', value: 5 }, { key: 'bla2', value: 38 }, { key: 'bla2', value: 200 }]);
        aframedc.renderAll(); //ó test2.render();
    });
    

};
