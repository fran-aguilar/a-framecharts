$(document).ready(function () {
    //JSON data saved here
    var json_data;
    var data;
    //getJSON call, draw meshes with data
    $.getJSON("data/scm-commits.json", function (data) {
        json_data = data;
        createChart();
    });
    function createChart() {
        var parsed_data = [];

        // Crossfilter format.
        json_data.values.forEach(function (value) {
            var record = {}
            json_data.names.forEach(function (name, index) {
                if (name == "date") {
                    var date = new Date(value[index] * 1000);
                    record[name] = date;
                } else {
                    record[name] = value[index];
                }
            });
            parsed_data.push(record);
        });
        var scmCommitsdata = crossfilter(parsed_data);
        var commitsbyDate = scmCommitsdata.dimension(function (d) { return d.date; });


        var commitsgroupbymonth = commitsbyDate.group(function (date) { return new Date(date.getFullYear(), date.getMonth(), 1); });
        //getting repos..
        var commitsrepos = scmCommitsdata.dimension(function (d) { return d.repo; });
        repositories = commitsrepos.group().all().map(function (o) { return "repo" + o.key; });
        var totalkeys = repositories.map(function (o) { return "total" + o; });
        commitsrepos.dispose();
        var commitsgroupbymonthrepo = commitsgroupbymonth.reduce(function (p, v) {
            var indexrepo = repositories.indexOf("repo" + v.repo);
            p[totalkeys[indexrepo]]++;
            return p;
        }, function (p, v) {
            var indexrepo = repositories.indexOf("repo" + v.repo);
            p[totalkeys[indexrepo]]--;
            return p;
        }, function () {
            var obj = {};
            for (var i = 0; i < totalkeys.length; i++) {
                obj[totalkeys[i]] = 0;
            }
            return obj;
        });
        var commitsbyDate2 = scmCommitsdata.dimension(function (d) { return d.date; });
        //filter by year
        commitsbyDate2.filter(function (d) { return d.getFullYear() >= 2014; });
        data = commitsgroupbymonthrepo.all(); //returning-zeroes.

        var scene = document.querySelector('a-scene');
        var entityel = document.createElement('a-entity');
        function getRandomColor() {
            var letters = '0123456789ABCDEF';
            var color = '#';
            for (var i = 0; i < 6; i++) {
                color += letters[Math.floor(Math.random() * 16)];
            }
            return color;
        }
        var STARTING_POINT = { x: -2, y: 0, z: -4 };
        relativeX = STARTING_POINT.x;
        relativeY = STARTING_POINT.y;
        relativeZ = STARTING_POINT.z;
        maxY = 0;
        for (var i = 0; i < totalkeys.length; i++) {
            var color = getRandomColor();
            for (var j = 0; j < data.length; j++) {
                //we have to filter again, to skip remaining zeroes.
                if (data[j].key.getFullYear() >= 2014) {
                    if (data[j].value[totalkeys[i]] > 0) {
                        relativeY = data[j].value[totalkeys[i]] * (8 / 404);// todo: scaling factor.
                        if (relativeY > maxY) {
                            maxY = relativeY;
                        }
                        var el = document.createElement('a-sphere');
                        el.setAttribute('radius', 0.1);
                        el.setAttribute('color', color);
                        el.setAttribute('position', { x: relativeX, y: relativeY, z: relativeZ });
                        entityel.appendChild(el);
                    }
                    relativeX += 1;
                }
            };
            relativeX = STARTING_POINT.x;
            relativeY = STARTING_POINT.y;
            relativeZ = relativeZ - 0.2;
        };
        scene.appendChild(entityel);
    };

});