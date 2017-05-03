﻿// Example (assuming there is "myscene" in HTML, to place the dashboard)
// Assume "lib" is either THREEDC ot aframdc

//simple week number
Date.prototype.getWeek = function () {
    var target = new Date(this.valueOf());
    var dayNr = (this.getDay() + 6) % 7;
    target.setDate(target.getDate() - dayNr + 3);
    var firstThursday = target.valueOf();
    target.setMonth(0, 1);
    if (target.getDay() != 4) {
        target.setMonth(0, 1 + ((4 - target.getDay()) + 7) % 7);
    }
    return 1 + Math.ceil((firstThursday - target) / 604800000);
}
window.onload = function () {

    // initialization
    //getJSON call, draw meshes with data
    $.getJSON("../data/opnfv-commits.json", function (data) {
        var json_data = data;
        init(json_data);
    });
    var init = function (json_data) {
        var scene = document.querySelector("a-scene");
        // 1 
        myDashboard = aframedc.addDashBoard(scene);
        // 2
        var mypiechart = aframedc.pieChart();
        var mybarchart = aframedc.barChart();
        var mybarchartaut = aframedc.barChart();
        var mybarchartTzs = aframedc.barChart();
        var mystackchartOrgs = aframedc.barChartstack();
        // Common
        var keysObj = Object.keys(json_data[0]);
        window.parsed_data = [];
        json_data.forEach(function (value) {
            var record = {};
            
            keysObj.forEach(function (name) {
                if (name == "utc_author") {
                    var date = new Date(value[name]);
                    record[name] = date;
                } else {
                    record[name] = value[name];
                }
            });
            parsed_data.push(record);
        });
        console.log(parsed_data);
        window.cf = crossfilter(parsed_data);

        //create a dimension by week
        var dimByWeek = cf.dimension(function (p) {
            var year = (new Date(p.utc_author)).getFullYear();
            return Number.parseInt(year + ("000" + p.week).slice(-3));
        });

        var groupByWeek = dimByWeek.group();

        var groupAuthors = dimByWeek.group().reduce(function reduceAdd(p, v) {
            if (!p[v.Author_name]) {
                p[v.Author_name] = (p[v.Author_name] || 0) + 1;
                p.counting = p.counting + 1;
            };
            return p;
        },

        function reduceRemove(p, v) {
            if (p[v.Author_name]) {
                p[v.Author_name] = (p[v.Author_name] || 0) - 1;
                delete p[v.Author_name];
                p.counting = p.counting - 1;

            }
            return p ;
        },

        function reduceInitial() {
            return { counting:0};
        });

        window.grouporgWeek = dimByWeek.group().reduce(function reduceAdd(p, v) {
            var findorg = function (element) {
                if (!element.key) return false;
                return element.key === v.Author_org_name;
            };
            var elementIndex = p.findIndex(findorg);
            if (elementIndex === -1) {
                //init
                p.push({ key: v.Author_org_name, value: 1 });
            } else {
                p[elementIndex].value = p[elementIndex].value + 1;
            }
            return p;
        },

        function reduceRemove(p, v) {
            var findorg = function (element) {
                if (!element.key) return false;
                return element.key === v.Author_org_name;
            };
            var elementIndex = p.findIndex(findorg);
            if (elementIndex !== -1) {
                p[elementIndex].value = p[elementIndex].value - 1;
                if (p[elementIndex].value <= 0) {
                    //remove that element.
                    p.splice(elementIndex, 1);
                }
            }

 
            return p ;
        },

        function reduceInitial() {
            return [];
        });
        //


        window.grouporgWeekwithAuthors = dimByWeek.group().reduce(function reduceAdd(p, v) {
            var findorg = function (element) {
                if (!element.key) return false;
                return element.key === v.Author_org_name;
            };
            var elementIndex = p.findIndex(findorg);
            if (elementIndex === -1) {
                //init
                elementIndex = p.push({ key: v.Author_org_name, value: { counting: 0, commits: 1 } });
                //index of added item.
                elementIndex = elementIndex - 1;
            } else {
                p[elementIndex].value.commits = p[elementIndex].value.commits + 1;
            }
            if (!p[elementIndex].value.authors) {
                p[elementIndex].value.authors = {};
                p[elementIndex].value.authors[v.Author_name] = 1;
                p[elementIndex].value.counting =  1;
            } else if (!p[elementIndex].value.authors) {
                p[elementIndex].value.authors[v.Author_name] = 1;
                p[elementIndex].value.counting = p[elementIndex].value.counting+1;
            }

            return p;
        },

        function reduceRemove(p, v) {
            var findorg = function (element) {
                if (!element.key) return false;
                return element.key === v.Author_org_name;
            };
            var elementIndex = p.findIndex(findorg);
            if (elementIndex !== -1) {
                p[elementIndex].value.commits = p[elementIndex].value.commits - 1;
                if (p[elementIndex].value.commits <= 0) {
                    //remove that element.
                    p.splice(elementIndex, 1);
                } else if (p[elementIndex].value.authors[v.Author_name]) {
                        p[elementIndex].value.authors[v.Author_name] = (p[v.Author_name] || 0) - 1;
                        delete p[elementIndex].value.authors[v.Author_name];
                        p[elementIndex].value.counting = p[elementIndex].value.counting - 1;

                }
                
            }

            return p;
        },

        function reduceInitial() {
            return [];
        });
        var grouporgBubbles = dimByWeek.group().reduce(function reduceAdd(p, v) {
            var findorg = function (element) {
                if (!element.key) return false;
                return element.key === v.Author_org_name;
            };
            var elementIndex = p.authors.findIndex(findorg);
            if (elementIndex === -1) {
                //init
                elementIndex = p.authors.push({ key: v.Author_org_name, value: { commits: 1 } });
                //index of added item.
                elementIndex = elementIndex - 1;
            } else {
                p.authors[elementIndex].value.commits = p.authors[elementIndex].value.commits + 1;
            }
            p.totalCommits++;
            return p;
        },

      function reduceRemove(p, v) {
          var findorg = function (element) {
              if (!element.key) return false;
              return element.key === v.Author_org_name;
          };
          var elementIndex = p.authors.findIndex(findorg);
          if (elementIndex !== -1) {
              p.authors[elementIndex].value.commits = p.authors[elementIndex].value.commits - 1;
              if (p.authors[elementIndex].value.commits <= 0) {
                  //remove that element.
                  p.authors.splice(elementIndex, 1);
              }
              p.totalCommits--;
          }

          return p;
      },

      function reduceInitial() {
          return {
              authors: [],
              totalCommits: 0,

          };
      });
        console.log("new grouping");
        console.log(grouporgWeekwithAuthors.all());
        ////create a dimension by org
        var dimByOrg = cf.dimension(function (p) { return p.Author_org_name; });
        var groupByOrg = dimByOrg.group();
        //create a dim by authors
        var dimAuthors = cf.dimension(function (p) { return p.Author_name; });
        var groupAuth = dimAuthors.group();
        //all the orgs.
        var orgs = groupByOrg.all();
        //assign orgs with a color.
        var COLORS = ["#33cc33",
        "#00ffcc",
        "#ffff00",
        "#3399ff",
        "#ff3300",
        "#ffccff",
        "#3399ff",
        "#996633",
        "#336600",
        "#ff00ff",
"#A52A2A",
"#DEB887",
"#5F9EA0",
"#7FFF00",
"#D2691E",
"#FF7F50",
"#6495ED",
"#FFF8DC",
"#DC143C",
"#00008B",
"#008B8B",
"#B8860B",
"#A9A9A9",
"#006400",
"#BDB76B",
"#8B008B",
"#556B2F",
"#FF8C00",
"#9932CC",
"#8B0000",
"#E9967A",
"#8FBC8F",
"#483D8B",
"#2F4F4F",
"#00CED1",
"#9400D3",
"#FF1493",
"#00BFFF",
"#696969",
"#1E90FF",
"#B22222",
"#FFFAF0",
"#228B22",
"#FF00FF",
"#DCDCDC",
"#F8F8FF",
"#FFD700",
"#DAA520",
"#808080",
"#008000",
"#ADFF2F",
"#F0FFF0",
"#FF69B4",
"#CD5C5C",
"#4B0082",
"#FFFFF0",
"#F0E68C",
"#E6E6FA",
"#FFF0F5",
"#7CFC00",
"#FFFACD",
"#ADD8E6",
"#F08080",
"#E0FFFF",
"#FAFAD2",
"#D3D3D3",
"#90EE90",
"#FFB6C1",
"#FFA07A",
"#20B2AA",
"#87CEFA",
"#778899",
"#B0C4DE",
"#FFFFE0",
"#00FF00",
"#32CD32",
"#FAF0E6",
"#800000",
"#66CDAA",
"#0000CD",
"#BA55D3",
"#9370DB",
"#3CB371",
"#7B68EE",
"#00FA9A",
"#48D1CC",
"#C71585",
"#191970",
"#F5FFFA",
"#FFE4E1",
"#FFE4B5",
"#FFDEAD",
"#000080",
"#FDF5E6",
"#808000",
"#6B8E23",
"#FFA500",
"#FF4500",
"#DA70D6",
"#EEE8AA",
"#98FB98",
"#AFEEEE",
"#DB7093",
"#FFEFD5",
"#FFDAB9",
"#CD853F",
"#FFC0CB",
"#DDA0DD",
"#B0E0E6",
"#800080",
"#663399",
"#FF0000",
"#BC8F8F",
"#4169E1",
"#8B4513",
"#FA8072",
"#F4A460",
"#2E8B57",
"#FFF5EE",
"#A0522D",
"#C0C0C0",
"#87CEEB",
"#6A5ACD",
"#708090",
"#FFFAFA",
"#00FF7F",
"#4682B4",
"#D2B48C",
"#008080",
"#D8BFD8",
"#FF6347",
"#40E0D0",
"#EE82EE",
"#F5DEB3",
"#FFFFFF",
"#F5F5F5",
"#FFFF00",
"#9ACD32"]
        var orgsColors = orgs.map(function (a, index) {
            return { key: a.key, value: COLORS[index % COLORS.length] };
        });
        
        //used to calculte maximum
        var orderByValue = function (p) {
            var suma = 0;
            for (var i = 0 ; i < p.length ; i++) {
                suma = p[i].value + suma;
            }
            return suma;
        }


        //create a dimension tz
        var dimbytz = cf.dimension(function (p) { return p.tz; });
        var groupbytz = dimbytz.group();
        var tzColors = groupbytz.all().map(function (a, index) {
            return { key: a.key, value: COLORS[(index +2) % COLORS.length] };
        });
        var keyaccessor = function (element) {
            var getdatefromWN = function (y, wn) {

                var monthAprox = Math.floor(wn / 4) - 2;
                monthAprox = monthAprox < 0 ? 0 : monthAprox;
                var i = 0, found = false, day = 1;
                var aux_date;
                while (!found) {
                    aux_date = new Date(y, monthAprox, i);
                    var aux_wn = aux_date.getWeek();
                    found = aux_wn === wn;
                    i = i + 6;
                    if (aux_wn >= 53 && monthAprox!=0) {
                        break;
                    }
                }
                if (found) {
                    return new Date(aux_date.getFullYear(), aux_date.getMonth(), aux_date.getDate() - aux_date.getDay() + 1);
                }
            };
            var aux = element.key.toString();
            var year = Number.parseInt(aux.slice(0, 4));
            var weeknumber = Number.parseInt(aux.slice(5));
            var datefromwn = getdatefromWN(year, weeknumber);
            return datefromwn.toDateString();
        }



        

        mybarchartTzs.dimension(dimbytz).group(groupbytz).color("orange").width(10).setTitle("commits by Time Zone");

        mypiechart.dimension(dimByOrg).group(groupByOrg).color(orgsColors).radius(2.5).setTitle("contribution by company");
        mystackchartOrgs.dimension(dimByWeek).group(grouporgWeek).keyAccessor(keyaccessor)
            .color(orgsColors).orderFunction(orderByValue)
            .width(20).height(12).setTitle("contribution by company by week");

        //front

        var coordPieChart =     new THREE.Vector3( -16, 5,  -15 );
        var coordorgweekchart = new THREE.Vector3( -7, 0,   -15 );
        //var coordBarChart =     new THREE.Vector3( -7, 5,   -15 );
        //var coordauthchart =    new THREE.Vector3( -7, -8,  -15 );
        //var coordtzchart =      new THREE.Vector3( 5, 5,    -15 );
        myDashboard.addChart(mypiechart, coordPieChart);
        //myDashboard.addChart(mybarchart, coordBarChart);
        //myDashboard.addChart(mybarchartTzs, coordtzchart);
        myDashboard.addChart(mystackchartOrgs, coordorgweekchart);

        //back
        var mypiechart2 = aframedc.pieChart();


        mypiechart2.dimension(dimbytz).group(groupbytz).color(tzColors).radius(2.5).setTitle("time zone contribution");
        mybarchartaut.dimension(dimByWeek).group(groupAuthors).valueAccessor(function (data) { return data.value.counting; }).color("blue")
           .keyAccessor(keyaccessor).width(20).height(12).setTitle("commits per author");
        var axis = new THREE.Vector3(0, 1, 0);
        var angle = -Math.PI;


        var coordPieChart2 = coordPieChart.clone();
        coordPieChart2.applyAxisAngle(axis, angle);
        var coordAuthorcontribcoord = coordorgweekchart.clone();
        coordAuthorcontribcoord.applyAxisAngle(axis, angle);
        mypiechart2.setAttribute("rotation", { x: 0, y: THREE.Math.radToDeg(angle), z: 0 });
        mybarchartaut.setAttribute("rotation", { x: 0, y: THREE.Math.radToDeg(angle), z: 0 });

        myDashboard.addChart(mypiechart2, coordPieChart2);
        myDashboard.addChart(mybarchartaut, coordAuthorcontribcoord);

        //left

        var angle2 = Math.PI /2;
        var coordpiechartleft = coordorgweekchart.clone();
        coordpiechartleft.applyAxisAngle(axis, angle2);
        

        var mybarchart3d = aframedc.barChart3d();
        //used to retrieve # commits org
        var myheightbarchart3d = function (p, parent) {

            return p.value;
        }
        var myarraybarchart3d = function (parent) {
            return parent.value;
        }
        var valueaccesorbarchart3d = function (p, parent) {
            return "org: " + p.key + " commits: " + p.value;
        };
        angle = Math.PI;
        mybarchart3d.setAttribute("rotation", { x: 0, y: THREE.Math.radToDeg(angle2), z: 0 });



        mybarchart3d
          .dimension(dimByWeek)
          .group(grouporgWeek)
          .arrayAccessor(myarraybarchart3d)
          .keyAccessor(keyaccessor)
          .valueAccessor(valueaccesorbarchart3d)
          .heightAccessor(myheightbarchart3d)
          .zAxis(orgsColors)
          .color(orgsColors)
          .width(15)
          .depth(18)
          .height(6)
          .setTitle("contribution by company ");
        myDashboard.addChart(mybarchart3d, coordpiechartleft);




        //right
        var mybubblechart = aframedc.bubbleChart();


        //used to retrieve # commits org
        var myheightAccessor = function (p, parent) {

            return p.value.commits;
        }

        //used to retrieve # authors org
        var myradiusAccesor = function (p, parent) {
            return p.value.commits / parent.value.totalCommits;
        }

        var myarrayaccesor = function (parent) {
            return parent.value.authors;
        }
        var valueaccesor = function (p, parent) {
            return "org: " + p.key + " commits: " + p.value.commits + " contrib. ratio:" + (p.value.commits / parent.value.totalCommits).toFixed(2);
        };

        mybubblechart
          .dimension(dimByWeek)
          .group(grouporgBubbles)
          .keyAccessor(keyaccessor)
          .valueAccessor(valueaccesor)
          .heightAccessor(myheightAccessor)
          .radiusAccessor(myradiusAccesor)
          .arrayAccessor(myarrayaccesor)
          .zAxis(groupByOrg.top(10).map(function (a, index) {
              return { key: a.key, value: COLORS[index % COLORS.length] };
          })) //top 10 companies.
          .width(10)
          .depth(10)
          .height(10)
          .setTitle("contribution by company ");
        var axisy2 = new THREE.Vector3(0, 1, 0);
        angle = -Math.PI / 2;
        var coordBubblechart = coordorgweekchart.clone();

        coordBubblechart.applyAxisAngle(axisy2, angle);
        myDashboard.addChart(mybubblechart, coordBubblechart);
        mybubblechart.setAttribute("rotation", { x: 0, y: THREE.Math.radToDeg(angle), z: 0 });

        //top , again orgs, to filter 
        var mypiecharttop = aframedc.pieChart();
        mypiecharttop.dimension(dimByOrg).group(groupByOrg).color(orgsColors).radius(2.5).setTitle("contribution by company");

        angle = Math.PI;
        var coordpiecharttop = { x: 0, y: 14, z: 0 };
        mypiecharttop.setAttribute("rotation", { x: THREE.Math.radToDeg(angle / 2), y: THREE.Math.radToDeg(angle / 2), z: THREE.Math.radToDeg(angle / 2) });
        myDashboard.addChart(mypiecharttop, coordpiecharttop);

        //the last graphic at bottom.
        var coordBarcharbyweek = { x: 0, y: -14, z: 0 };
        mybarchart.dimension(dimByWeek).group(groupByWeek).keyAccessor(keyaccessor).width(15).setTitle("commits per week");
        mybarchart.setAttribute("rotation", { x:-1* THREE.Math.radToDeg(angle/2), y: THREE.Math.radToDeg(angle/2), z: -1 * THREE.Math.radToDeg(angle/2) });
        myDashboard.addChart(mybarchart, coordBarcharbyweek);
        var camera = document.querySelector("[camera]");
        camera.setAttribute("position", { x: 0, y: 0, z: 0 });

        var clearallindex = function (ev) {
            dimByOrg.filter(null);
            dimByWeek.filter(null);
            dimbytz.filter(null);
            var charts = myDashboard.allCharts();
            for (var i = 0 ; i < charts.length; i++) {
                charts[i].render();
            }
        };
        //clear all dimensions button..
        $("#indexclear").on("click", clearallindex);
        var text = document.querySelector("#indexcleartext"); 
            text.addEventListener("click", clearallindex);
    }
}