
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
    var mypieChart = aframedc.pieChart()



    payments = crossfilter([
    { date: "2011-11-14T16:17:54Z", quantity: 2, total: 190, tip: 100, type: "tab" },
    { date: "2011-11-14T16:20:19Z", quantity: 2, total: 190, tip: 100, type: "tab" },
    { date: "2011-11-14T16:28:54Z", quantity: 1, total: 300, tip: 200, type: "visa" },
    { date: "2011-11-14T16:30:43Z", quantity: 2, total: 90, tip: 0, type: "tab" },
    { date: "2011-11-14T16:48:46Z", quantity: 2, total: 90, tip: 0, type: "tab" },
    { date: "2011-11-14T16:53:41Z", quantity: 2, total: 90, tip: 0, type: "tab" },
    { date: "2011-11-14T16:54:06Z", quantity: 1, total: 100, tip: 0, type: "cash" },
    { date: "2011-11-14T16:58:03Z", quantity: 2, total: 90, tip: 0, type: "tab" },
    { date: "2011-11-14T17:07:21Z", quantity: 2, total: 90, tip: 0, type: "tab" },
    { date: "2011-11-14T17:22:59Z", quantity: 2, total: 90, tip: 0, type: "tab" },
    { date: "2011-11-14T17:25:45Z", quantity: 2, total: 200, tip: 0, type: "cash" },
    { date: "2011-11-14T17:29:52Z", quantity: 1, total: 200, tip: 100, type: "visa" }
    ]);

    var dimTotal = payments.dimension(function (d) { return d.total; });
    window.dimType = payments.dimension(function (d) { return d.type; });
    var groupTotal = dimTotal.group();
    var groupType = dimType.group().reduceCount();

    var mypiechart = aframedc.pieChart();
    var mybarchart = aframedc.barChart();
    mybarchart.dimension(dimTotal).group(groupTotal);
    mypiechart.dimension(dimType).group(groupType);

    window.mypanel = aframedc.Panel().width(40).height(15);
    mypanel.addChart(mypiechart);
    mypanel.addChart(mybarchart);
    dashboard.addPanel(mypanel);

    dimType.filter("cash");
};