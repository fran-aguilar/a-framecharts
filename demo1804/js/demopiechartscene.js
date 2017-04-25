// Example (assuming there is "myscene" in HTML, to place the dashboard)
// Assume "lib" is either THREEDC ot aframdc
window.onload = function () {
    var AFRAMEscene = document.getElementById("aframescene");
    // 1
    myDashboard = aframedc.addDashBoard(AFRAMEscene);
    // 2
    var myPieChart = aframedc.pieChart();
    // Common
    var data = [{ key: 'bla', value: 85 }, { key: 'bla2', value: 21 }, { key: 'bla2', value: 10 },
        { key: 'bla2', value: 5 }, { key: 'bla2', value: 38 }, { key: 'bla2', value: 200 }];
    myPieChart = myPieChart.data(data).depth(3);
    myDashboard.addChart(myPieChart);
}