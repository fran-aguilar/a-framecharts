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
        var mybubblechart = aframedc.bubbleChart();
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

        


        window.grouporgWeek = dimByWeek.group().reduce(function reduceAdd(p, v) {
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
        console.log(grouporgWeek.all());
        ////create a dimension by org
        var dimByOrg = cf.dimension(function (p) { return p.Author_org_name; });
        var groupByOrg = dimByOrg.group();
      
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
        "#000099"];
        var orgsColors = orgs.map(function (a, index) {
            return { key: a.key, value: COLORS[index % COLORS.length] };
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

        //used to calculte maximum
        var orderByValue = function (p) {
            var suma = 0;
            for (var i = 0 ; i < p.length ; i++) {
                suma = p[i].value + suma;
            }
            return suma;
        }

      

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
            .group(grouporgWeek)
            .keyAccessor(keyaccessor)
            .valueAccessor(valueaccesor)
            .heightAccessor(myheightAccessor)
            .radiusAccessor(myradiusAccesor)
            .arrayAccessor(myarrayaccesor)
            .zAxis(groupByOrg.top(10).map(function (a, index) {
                return { key: a.key, value: COLORS[index % COLORS.length] };
            })) //top 10 companies.
            .width(10)
            .depth(7)
            .height(6)
            .setTitle("contribution by company ");



        myDashboard.addChart(mybubblechart);


    }
}