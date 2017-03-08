
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
    var scene = document.querySelector('a-scene');
    dimByMonth = cf.dimension(function (p) { return p.month; });

    groupByMonth = dimByMonth.group();

    //create a dimension by org

    dimByOrg = cf.dimension(function (p) { return p.org; });

    groupByOrg = dimByOrg.group();


    //create a dimension by author

    dimByAuthor = cf.dimension(function (p) { return p.author; });

    groupByAuthor = dimByAuthor.group();

    //CUSTOM DASHBOARD//
    var dashBoard = new AFRAMEDC.DashBoard(scene);
    var panel = new AFRAMEDC.Panel(dashBoard, [5, 0, 0], 2).size([25, 7]);
    var bars = new AFRAMEDC.PieChart(panel);
    bars.group(groupByOrg)
       .dimension(dimByOrg)
       .depth(2);
    //.radius(100);
    var line = new AFRAMEDC.BarsChart(panel);
    line.group(groupByMonth)
   .dimension(dimByMonth)
   //.width(400)
   //.height(200)
   .numberOfXLabels(5)
   .numberOfYLabels(5)
   .gridsOn()
   .tooltip(function (d) {
       return "key: " + d.key.toLocaleString() + " value: " + d.value;
   })
   .depth(2);
   //.color(0xff0000);


    dashBoard.renderAll();
};