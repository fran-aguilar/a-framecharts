//ensure window loaded
window.onload = function () {
    var containerdiv = document.getElementById("dashboard");
    window.mydashboard = aframedc.dashBoard(containerdiv);
    //creación del chart (asignación a la escena).
    var mypieChart = aframedc.pieChart() // { _domEl : <a-entity></a-entity> , data: fc(x)};
        .data([{ key: 'bla', value: 85 }, { key: 'bla2', value: 21 }, { key: 'bla2', value: 10 }, { key: 'bla2', value: 5 }, { key: 'bla2', value: 38 }, { key: 'bla2', value: 200 }])
        .depth(3);
    mydashboard = mydashboard.addChart(mypieChart);
    mydashboard.renderAll();
};
//if you want to see update.
//var pie = mydashboard.chartRegistry.list()[0];
//pie.data([{ key: "abc", value: 42 }, { key: "aaa", value: 24 }]);
//pie.render();