
//JSON data saved here
var json_data;

//CROSSFILTER VARS

var cf;

var dimByMonth;

var groupByMonth;

var dimByOrg;

var groupByOrg;

// initialization
//getJSON call, draw meshes with data
$.getJSON("data/scm-commits.json", function (data) {
    json_data = data;
    init();
});
function init() {
    // most objects displayed are a "mesh":
    //  a collection of points ("geometry") and
    //  a set of surface parameters ("material")

    var parsed_data = [];

    // Crossfilter and dc.js format
    json_data.values.forEach(function (value) {
        var record = {}
        json_data.names.forEach(function (name, index) {
            if (name == "date") {
                var date = new Date(value[index] * 1000);
                record[name] = date;
                record.month = new Date(date.getFullYear(), date.getMonth(), 1);
                record.hour = date.getUTCHours();
            } else {
                record[name] = value[index];
            }
        });
        parsed_data.push(record);
    });

    cf = crossfilter(parsed_data);


    //create a dimension by month

    dimByMonth = cf.dimension(function (p) { return p.month; });

    groupByMonth = dimByMonth.group();

    //create a dimension by org

    dimByOrg = cf.dimension(function (p) { return p.org; });

    groupByOrg = dimByOrg.group();


    //create a dimension by author

    dimByAuthor = cf.dimension(function (p) { return p.author; });

    groupByAuthor = dimByAuthor.group();

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
    //dashboard.
    var dashboard = aframedc.dashBoard(scene);
    window.mypanel = aframedc.Panel().width(60).height(15).ncolumns(3);
    var piechart = aframedc.pieChart()
       .group(groupByOrg)
     .dimension(dimByOrg);

    var line1 = aframedc.barChart();
   line1.group(groupByAuthor)
  .dimension(dimByAuthor);


   var line2 = aframedc.barChart();
    line2.group(groupByMonth)
  .dimension(dimByMonth)
    .color("red");

    mypanel.addChart(piechart);
    mypanel.addChart(line1);
    mypanel.addChart(line2);
    dashboard.addPanel(mypanel);
}