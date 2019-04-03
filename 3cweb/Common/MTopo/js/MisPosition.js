var showPos = 0;
//第一层画区站连线
function GetOneMisPosition(LineCode, scene, forOrbit, topoStyle) {
    var jsonposition = getMislinePointsData(LineCode);
    var nodes = new Array();
    var index = 0;
    //var topoStyle = getConfig('TopoStyle');
    for (var i = 0; i < jsonposition.length; i++) {
        var node0 = new JTopo.Node(jsonposition[i].StationSectionName);
        node0.dragable = false;
        node0.key = jsonposition[i].StationSectionName;
        node0.setImage("./img/sidz.png", true);
        if (topoStyle == "GIS") {
            if (jsonposition[i].POSITION_TYPE == 'TDZ') {
                node0.setImage("./img/TDZ.png", true);
            }
            if (jsonposition[i].POSITION_TYPE == 'YDZ') {
                node0.setImage("./img/YDZ.png", true);
            }
            if (jsonposition[i].POSITION_TYPE == 'EDZ') {
                node0.setImage("./img/EDZ.png", true);
            }
            if (jsonposition[i].POSITION_TYPE == 'SDZ') {
                node0.setImage("./img/SDZ.png", true);
            }
            if (jsonposition[i].POSITION_TYPE == 'SIDZ') {
                node0.setImage("./img/SIDZ.png", true);
            }
            if (jsonposition[i].POSITION_TYPE == 'FQZ') {
                node0.setImage("./img/FQZ.png", true);
            }
        }


        //showPos用来控制非重要站点的显示，每showPos个显示一个
        //        if (jsonposition[i].GIS_SHOW != '1' && showPos != 2) {
        //            showPos++;
        //            node0.visible = false;
        //        }
        //        else {
        //            if (jsonposition[i].GIS_SHOW == '1') {
        //                showPos = -5; //在重要站点附近，非重要站点少显示一些
        //            } else {
        //                showPos = 0;
        //            }
        //        }

        if (jsonposition[i].GIS_SHOW != '1') {
            node0.visible = false;
        }

        if (topoStyle != "GIS" && forOrbit != 'true') {//直线风格
            if (jsonposition[i].startKM == undefined) {
                jsonposition[i].startKM = 0;
                jsonposition[i].endKM = 0;
            }
            var kmstr = String(parseFloat((Number(jsonposition[i].startKM) + Number(jsonposition[i].endKM)) / 2000).toFixed(3));
            var kmstrs = kmstr.split(".");
            if (kmstrs[0] != "0" || kmstrs[1] != "000") {
                //node0.name = node0.name + "K" + kmstrs[0] + "+" + kmstrs[1];
            }

            if (nodes[index - 1] != null) {
                var lonDistance = Math.abs(jsonposition[i].startLongitude - nodes[index - 1].json.startLongitude);
                var latDistance = Math.abs(jsonposition[i].startLatitude - nodes[index - 1].json.startLatitude);
                var direction;
                //实现直线模式并且去锯齿
                if (lonDistance > latDistance) {//横向趋势
                    direction = "HX";
                    if ((nodes[index - 1].direction == "ZX" && (nodes[index - 2] != null && nodes[index - 2].direction == "HX")) ||
                     (nodes[index - 1].direction == "ZX" && (nodes[index - 2] != null && nodes[index - 2].direction == "ZX") && (nodes[index - 3] != null && nodes[index - 3].direction == "HX")) ||
                     (nodes[index - 1].direction == "ZX" && (nodes[index - 2] != null && nodes[index - 2].direction == "ZX") && (nodes[index - 3] != null && [index - 3].direction == "ZX") && (nodes[index - 4] != null && nodes[index - 4].direction == "HX"))) {//是锯齿
                        direction = "ZX";
                    }
                } else {
                    direction = "ZX";
                    if ((nodes[index - 1].direction == "HX" && (nodes[index - 2] != null && nodes[index - 2].direction == "ZX")) ||
                    (nodes[index - 1].direction == "HX" && (nodes[index - 2] != null && nodes[index - 2].direction == "HX") && (nodes[index - 3] != null && nodes[index - 3].direction == "ZX")) ||
                    (nodes[index - 1].direction == "HX" && (nodes[index - 2] != null && nodes[index - 2].direction == "HX") && (nodes[index - 3] != null && nodes[index - 3].direction == "HX") && (nodes[index - 4] != null && nodes[index - 4].direction == "ZX"))) {//是锯齿
                        direction = "HX";
                    }
                }
                if (direction == "HX")//横向趋势，则将纬度修改为相同
                {
                    node0.direction = "HX";
                    if (nodes[index - 1].direction != "HX" && nodes[index - 1].json.startLongitude < jsonposition[i].startLongitude) {//是拐点
                        nodes[index - 1].drawText = drawTextVertical;
                        //nodes[index - 1].visible = true; //拐点站点必显示
                        //node0.setImage("./img/sdz.png", true);
                    }
                    if (nodes[index - 1].direction != "HX" && nodes[index - 1].json.startLongitude > jsonposition[i].startLongitude) {//是拐点
                        nodes[index - 1].drawText = drawTextHorizontal;
                        //nodes[index - 1].visible = true; //拐点站点必显示
                        // node0.setImage("./img/sdz.png", true);
                    }

                    jsonposition[i].startLatitude = nodes[index - 1].json.startLatitude;
                    node0.drawText = drawTextVertical;
                }
                else {//纵向趋势，则将经度修改为相同
                    node0.direction = "ZX";
                    if (nodes[index - 1].direction != "ZX" && nodes[index - 1].json.startLatitude < jsonposition[i].startLatitude) {//是拐点
                        nodes[index - 1].drawText = drawTextVertical;
                        //nodes[index - 1].visible = true; //拐点站点必显示
                    }
                    if (nodes[index - 1].direction != "ZX" && nodes[index - 1].json.startLatitude > jsonposition[i].startLatitude) {//是拐点
                        nodes[index - 1].drawText = drawTextHorizontal;
                        //nodes[index - 1].visible = true; //拐点站点必显示
                    }
                    jsonposition[i].startLongitude = nodes[index - 1].json.startLongitude
                    node0.drawText = drawTextHorizontal;
                }

            }
        }
        else {//GIS风格            
            node0.drawText = drawTextMutiLine;
            var kmstr = String(parseFloat((Number(jsonposition[i].startKM) + Number(jsonposition[i].endKM)) / 2000).toFixed(3));
            var kmstrs = kmstr.split(".");
            node0.type = "position";
            node0.drawText = drawTextMutiLine;
            if (kmstrs[0] != "0" || kmstrs[1] != "000")
                node0.name = node0.name + "&&K" + kmstrs[0] + "+" + kmstrs[1];
        }

        node0.style.fontSize = "10px";
        //node0.style.fontColor = "#FFFFFF";
        node0.json = jsonposition[i];
        node0.lon = jsonposition[i].startLongitude;
        node0.lat = jsonposition[i].startLatitude;
        node0.positionCode = jsonposition[i].POSITION_CODE;
        node0.lineCode = jsonposition[i].MIS_LINE_ID;
        node0.setLocation(getXbyLon(jsonposition[i].startLongitude, scene.CenterLon, scene.CenterX, scene.XUnit), getYbyLat(jsonposition[i].startLatitude, scene.CenterLat, scene.CenterY, scene.YUnit));

        //间距过小的节点就不显示
        //        if (index != 0) {
        //            if ((Math.abs(node0.x - nodes[index - 1].x) < 35 && node0.y == nodes[index - 1].y) ||
        //        (Math.abs(node0.y - nodes[index - 1].y) < 35 && node0.x == nodes[index - 1].x)) {
        //                node0.visible = false;
        //            }
        //        }

        //去除多线路中相同名称的站点
        var has = node0.key in scene.nodeMap;
        if (has == true) {
            node0.visible = false;
            node0.x = scene.nodeMap[node0.key].x;
            node0.y = scene.nodeMap[node0.key].y;
            node0.lon = scene.nodeMap[node0.key].lon;
            node0.lat = scene.nodeMap[node0.key].lat;
        } else {
            scene.nodeMap[node0.key] = node0;
        }
        scene.add(node0);

        nodes[index] = node0;
        index++;
    }


    for (var i = 1; i < nodes.length; i++) {
        var link1 = new JTopo.Link(nodes[i - 1], nodes[i]); // 增加连线
        link1.style.lineJoin = 'round';
        link1.style.lineWidth = '2';
        link1.pattern = 10;
        //link1.paint = drawDashLine;
        link1.style.strokeStyle = '255,255,255';
        link1.json = "";
        link1.type = "link";
        link1.tag = nodes[i - 1].json.StationSectionName + "－" + nodes[i].json.StationSectionName;
        link1.MIS_LINE_ID = nodes[i - 1].json.MIS_LINE_ID;
        scene.add(link1);
    }


    return nodes;
}

//第二层画区站连线
function GetTwoMisPosition(LineCode, scene, topoStyle) {
    var jsonposition = getMislinePointsData(LineCode);
    // var topoStyle = getConfig('TopoStyle');
    var nodes = new Array();
    for (var i = 0; i < jsonposition.length; i++) {
        var node0 = new JTopo.Node(jsonposition[i].StationSectionName);
        node0.dragable = false;
        nodes[i] = node0;
        if (topoStyle != "GIS") {
            if (jsonposition[i].startKM == undefined) {
                jsonposition[i].startKM = 0;
                jsonposition[i].endKM = 0;
            }
            var kmstr = String(parseFloat((Number(jsonposition[i].startKM) + Number(jsonposition[i].endKM)) / 2000).toFixed(3));
            var kmstrs = kmstr.split(".");
            if (kmstrs[0] != "0" || kmstrs[1] != "000") {
                node0.name = node0.name + "K" + kmstrs[0] + "+" + kmstrs[1];
            }

            if (i != 0) {
                var lonDistance = Math.abs(jsonposition[i].startLongitude - jsonposition[i - 1].startLongitude);
                var latDistance = Math.abs(jsonposition[i].startLatitude - jsonposition[i - 1].startLatitude);

                //                if (lonDistance > latDistance)//横向趋势，则将纬度修改为相同
                //                {
                node0.direction = "HX";
                if (nodes[i - 1].direction != "HX" && jsonposition[i - 1].startLongitude < jsonposition[i].startLongitude) {//是拐点
                    nodes[i - 1].drawText = drawTextVertical;
                }
                if (nodes[i - 1].direction != "HX" && jsonposition[i - 1].startLongitude > jsonposition[i].startLongitude) {//是拐点
                    nodes[i - 1].drawText = drawTextHorizontal;
                }

                jsonposition[i].startLatitude = jsonposition[i - 1].startLatitude;
                node0.drawText = drawTextVertical;
                //                }
                //                else {//纵向趋势，则将经度修改为相同
                //                    node0.direction = "ZX";
                //                    if (nodes[i - 1].direction != "ZX" && jsonposition[i - 1].startLatitude < jsonposition[i].startLatitude) {//是拐点
                //                        nodes[i - 1].drawText = drawTextVertical;
                //                    }
                //                    if (nodes[i - 1].direction != "ZX" && jsonposition[i - 1].startLatitude > jsonposition[i].startLatitude) {//是拐点
                //                        nodes[i - 1].drawText = drawTextHorizontal;
                //                    }
                //                    jsonposition[i].startLongitude = jsonposition[i - 1].startLongitude;
                //                    node0.drawText = drawTextHorizontal;
                //                }
            }
        } else {
            var kmstr = String(parseFloat((Number(jsonposition[i].startKM) + Number(jsonposition[i].endKM)) / 2000).toFixed(3));
            var kmstrs = kmstr.split(".");
            node0.drawText = drawTextMutiLine;
            if (kmstrs[0] != "0" || kmstrs[1] != "000")
                node0.name = node0.name + "&&K" + kmstrs[0] + "+" + kmstrs[1];
        }
        node0.lon = jsonposition[i].startLongitude;
        node0.lat = jsonposition[i].startLatitude;
        node0.setLocation(getXbyLon(jsonposition[i].startLongitude, scene.CenterLon, scene.CenterX, scene.XUnit), getYbyLat(jsonposition[i].startLatitude, scene.CenterLat, scene.CenterY, scene.YUnit));
        node0.setImage("./img/sidz.png", true);
        node0.positionCode = jsonposition[i].POSITION_CODE;
        node0.lineCode = jsonposition[i].MIS_LINE_ID;
        node0.json = jsonposition[i];
        node0.style.fontSize = "10px";
        //node0.style.fontColor = "#ffffff";
        scene.add(node0);

        node0.addEventListener('click', function (event) {
            threeurl(event.target.json.StationSectionName, event.target.positionCode, event.target.lineCode);
        });
    }

    for (var i = (scene.nodes.length - jsonposition.length) + 1; i < scene.nodes.length; i++) {
        var link1 = new JTopo.Link(scene.nodes[i - 1], scene.nodes[i]); // 增加连线
        link1.style.strokeStyle = '255,255,255';
        link1.style.lineWidth = '2';
        link1.tag = scene.nodes[i - 1].json.StationSectionName + "－" + scene.nodes[i].json.StationSectionName;
        link1.MIS_LINE_ID = scene.nodes[i - 1].json.MIS_LINE_ID;
        link1.addEventListener('mouseup', function (event) {
            threeurl(event.target.tag, '', event.target.MIS_LINE_ID);
        });
        link1.json = "";
        scene.add(link1);
    }
    scene.nodes = nodes;
    return jsonposition;
}

function drawDashLine(g) {
    if (!this.nodeA || !this.nodeZ) return;
    var pattern = this.pattern;
    // calculate the delta x and delta y  
    var dx = (this.nodeZ.x - this.nodeA.x);
    var dy = (this.nodeZ.y - this.nodeA.y);
    var distance = Math.floor(Math.sqrt(dx * dx + dy * dy));
    var dashlineInteveral = (pattern <= 0) ? distance : (distance / pattern);
    var deltay = (dy / distance) * pattern;
    var deltax = (dx / distance) * pattern;

    // draw dash line  
    g.lineWidth = this.style.lineWidth;
    g.lineJoin = this.style.lineJoin;
    g.strokeStyle = this.style.strokeStyle;
    g.beginPath();
    for (var dl = 0; dl < dashlineInteveral; dl++) {
        if (dl % 2) {
            g.lineTo(this.nodeA.x + dl * deltax, this.nodeA.y + dl * deltay);
        } else {
            g.moveTo(this.nodeA.x + dl * deltax, this.nodeA.y + dl * deltay);
        }
    }
    g.stroke();
    g.closePath();
    this.paintText(g);
}

//横向显示节点名称
function drawTextHorizontal(e) {
    var t = this.name;
    if (!t || t == "")
        return;

    var width = e.measureText(t).width;
    e.beginPath();
    e.font = this.style.fontSize + " " + this.style.font;
    e.fillStyle = "rgba(" + this.style.fontColor + ", " + this.alpha + ")";
    var r = this.getTextPostion(this.label.position, width);
    e.fillText(t, r.x + 25, r.y - 35);
    e.closePath();
}

//缺省名称显示方式，但支持节点名称换行
function drawTextMutiLine(e) {
    var t = this.name;
    if (!t || t == "")
        return;

    var words = t.split("&&");
    for (var n = 0; n < words.length; n++) {
        var width = e.measureText(words[n]).width;
        e.beginPath();
        e.font = this.style.fontSize + " " + this.style.font;
        e.fillStyle = "rgba(" + this.style.fontColor + ", " + this.alpha + ")";
        var r = this.getTextPostion(this.label.position, width);
        e.fillText(words[n], r.x, r.y + n * 15);
        e.closePath();
    }
}

//节点名称竖式排版
function drawTextVertical(e) {
    var t = this.name;
    if (!t || t == "")
        return;
    for (i = 0; i < t.length; i++) {
        var width = e.measureText(t.charAt(i)).width;
        e.beginPath();
        e.font = this.style.fontSize + " " + this.style.font;
        e.fillStyle = "rgba(" + this.style.fontColor + ", " + this.alpha + ")";
        var r = this.getTextPostion(this.label.position, width);
        e.fillText(t.charAt(i), r.x + 10, (r.y + i * 15 - 10));
        e.closePath()
    }
}