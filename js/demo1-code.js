//ensure window loaded
window.onload = function () {
    var containerdiv = document.getElementById("testaframe");
    window.mydashboard = aframedc.dashBoard(containerdiv);
    //creación del chart (asignación a la escena).
    var mypieChart = aframedc.pieChart()
        .data([{ key: 'bla', value: 85 }, { key: 'bla2', value: 21 }, { key: 'bla2', value: 10 }, { key: 'bla2', value: 5 }, { key: 'bla2', value: 38 }, { key: 'bla2', value: 200 }])
        .depth(3);
    mydashboard = mydashboard.addChart(mypieChart);
    mydashboard.renderAll();
};
