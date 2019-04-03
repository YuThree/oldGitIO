
//第一层
var linJson;
var scene;
function GetOneMisLine(Lat, Lon, XUnit, YUnit, TopoStyle, type) {
    $("#rightmenu").hide();
    $("#clickmenu").hide();
    var canvas = document.getElementById('canvas');

    if (type == "AlarmTopo") {
        canvas.width = window.screen.width - 300;
        canvas.height = window.screen.height;
    } else if (type == "6CAlarmTopo") {
        canvas.width = window.screen.width - 50;
        canvas.height = window.screen.height;
    } else {
        if (window.screen.width == "") { }
        canvas.width = window.screen.width * 0.95;
        canvas.height = window.screen.height * 0.84;
    }
    var stage = new JTopo.Stage(canvas);
    scene = new JTopo.Scene(stage);
    scene.setBackground('img/bg.jpg');
    scene.shadow = false;
    scene.nodeMap = {};

    if (Lon == '' || Lon == 'null') {
        Lon = getConfig('CenterLon');
    }
    if (Lat == '' || Lat == 'null') {
        Lat = getConfig('CenterLat');
    }
    if (XUnit == '' || XUnit == 'null') {
        XUnit = getConfig('XUnit');
    }
    if (YUnit == '' || YUnit == 'null') {
        YUnit = getConfig('YUnit');
    }
    if (getCookieValue("TPSmall") == "small") {
        scene.YUnit = YUnit / 1.5 / 3 / 1.7;
        scene.XUnit = XUnit / 1.5 / 3 / 1.7;
    } else {
        scene.YUnit = YUnit / 1.1;
        scene.XUnit = XUnit / 1.1 ;
    }
    //scene.YUnit = YUnit;
    //scene.XUnit = XUnit;
    scene.AlarmTopo = type;
    if (getCookieValue("TPSmall") == "small") {
        scene.CenterX = parseInt(getConfig('CenterX')) / 2;
        scene.CenterY = parseInt(getConfig('CenterY')) / 2;
    } else {

        scene.CenterX = $(window).width() / 2;
        scene.CenterY = $(window).height() / 2;
    }
    GetOneLine(scene, Lat, Lon, TopoStyle);

    addStageListener(stage, getOnemenu(scene));
    stage.play(scene);

    var div = $("#content");
    div.height = window.screen.height;
    div.context.onmousewheel = function (e) {
        $("#clickmenu").hide();
        redraw(e, scene);
    }

    return scene;
}
function GetOneLine(scene, Lat, Lon, TopoStyle) {
    scene.CenterLat = Lat;
    scene.CenterLon = Lon;
    scene.TopoStyle = TopoStyle;
    //线路
    linJson = getMislineSCenterPointsData();
    var nodes = new Array();
    for (var j = 1; j < linJson.length; j++) {
        nodes = nodes.concat(GetOneMisPosition(linJson[j][j][0].ID, scene, 'false', TopoStyle)); //区站
    }
    if (getConfig("For6C") == "6C") {
        var subJson = GetSubstation(nodes, "", scene); //变电所
        scene.subJson = subJson;
    }

    var alarmJson = GetAlarm("", nodes, scene, "", "", 1, TopoStyle); //报警
    var smsJson;
    if (getConfig('IsCar') == "1") {
        smsJson = GetSms(nodes, scene, 1, TopoStyle); //设备
    }
    scene.linJson = linJson;
    scene.alarmJson = alarmJson;
    scene.smsJson = smsJson;
}


//第二层
function GetTwo(LineCode, Lat, Lon, XUnit, YUnit, TopoStyle, mode) {
    var Twocanvas = document.getElementById('canvas');
    Twocanvas.width = window.screen.width - 120;
    Twocanvas.height = window.screen.height - 60;
    var Twostage = new JTopo.Stage(Twocanvas);
    var Twoscene = new JTopo.Scene(Twostage);
    //Twostage.hasAnimate = false;
    Twoscene.shadow = false;
    if (Lat != "")//是搜索功能的打开
    {
        Twoscene.XUnit = XUnit;
        Twoscene.YUnit = YUnit;
        Twoscene.CenterLon = Lon;
        Twoscene.CenterLat = Lat;
        Twoscene.CenterX = 800;
        Twoscene.CenterY = 550;
    }
    else {
        Twoscene.XUnit = getConfig("XUnit") / 2.5;
        Twoscene.YUnit = getConfig("YUnit") / 2.5;
        Twoscene.CenterX = 800;
        Twoscene.CenterY = 550;
        //中心坐标在读出区站后才能确定
    }

    if (mode == 'small') {
        Twocanvas.width = 750;
        Twocanvas.height = 750;
        Twoscene.CenterX = 400;
        Twoscene.CenterY = 300;
    }
    if (getCookieValue("TPSmall") == "small") {
        Twoscene.CenterX = parseInt(getConfig('CenterX')) / 2;
        Twoscene.CenterY = parseInt(getConfig('CenterY')) / 2;
    } else {
        Twoscene.CenterX = parseInt(getConfig('CenterX'));
        Twoscene.CenterY = parseInt(getConfig('CenterY'));
    }
    Twoscene.setBackground('img/bg.jpg');
    $("#rightmenu").hide();


    getTwoLine(Twoscene, LineCode, TopoStyle);
    addStageListener(Twostage, getTwomenu(Twoscene));
    Twostage.play(Twoscene);

    var div = $("#content");
    div.context.onmousewheel = function (e) {
        $("#clickmenu").hide();
        redraw(e, Twoscene);
    }
    return Twoscene;
}
//第二层具体操作
function getTwoLine(Twoscene, LineCode, TopoStyle) {
    //线路
    linJson = getMislineSCenterPointsData();
    Twoscene.TopoStyle = TopoStyle;
    var jsonline = getMislinePointsData(LineCode);
    if (Twoscene.CenterLat == undefined) {//不是搜索功能打开页面
        if (jsonline.length > 0) {
            Twoscene.CenterLat = jsonline[parseInt(jsonline.length / 2)].startLatitude;
            Twoscene.CenterLon = jsonline[parseInt(jsonline.length / 2)].startLongitude;
        } else {
            Twoscene.CenterLat = getConfig("CenterLat");
            Twoscene.CenterLon = getConfig("CenterLon");
        }
    }

    var posJson = GetTwoMisPosition(LineCode, Twoscene, TopoStyle);
    if (getConfig("For6C") == "6C") {
        var subJson = GetSubstation(LineCode, Twoscene, TopoStyle); //变电所
        Twoscene.subJson = subJson;
    }

    var alarmJson = GetAlarm(LineCode, Twoscene.nodes, Twoscene, "", "", 2, TopoStyle); //报警
    var smsJson;
    if (getConfig('IsCar') == "1") {
        smsJson = GetSms(Twoscene.nodes, Twoscene, 2, TopoStyle); //设备
    }
    Twoscene.linJson = linJson;
    Twoscene.posJson = posJson;
    Twoscene.alarmJson = alarmJson;
    Twoscene.smsJson = smsJson;
}
//第三层
function GetThree(positionName, positionCode, lineCode, Lon, Lat, XUnit, YUnit, kmmark) {
    //线路
    linJson = getMislineSCenterPointsData();
    var Threecanvas = document.getElementById('canvas');
    canvas.width = window.screen.width - 120;
    canvas.height = window.screen.width - 765;
    var Threestage = new JTopo.Stage(Threecanvas);
    var Threescene = new JTopo.Scene(Threestage);
    Threescene.setBackground('img/bg.jpg');
    //Threestage.hasAnimate = false;
    //Threescene.shadow = false;
    if (Lat != "")//是搜索功能的打开
    {
        Threescene.XUnit = XUnit;
        Threescene.YUnit = YUnit;
        Threescene.CenterLon = Lon;
        Threescene.CenterLat = Lat;
        Threescene.CenterX = 400;
        Threescene.CenterY = 250;
    } else {
        Threescene.CenterX = 400;
        Threescene.CenterY = 250;
        Threescene.XUnit = getConfig("XUnit") * 300;
        Threescene.YUnit = getConfig("YUnit") * 300;
    }

    if (getCookieValue("TPSmall") == "small") {
        Threescene.CenterX = parseInt(getConfig('CenterX')) / 2;
        Threescene.CenterY = parseInt(getConfig('CenterY')) / 2;
    } else {
        Threescene.CenterX = parseInt(getConfig('CenterX'));
        Threescene.CenterY = parseInt(getConfig('CenterY'));
    }
    Threescene.linJson = linJson;
    getMisPoleCenterPoints(positionName, positionCode, lineCode, Threescene, kmmark);
    addStageListener(Threestage, getThreeMapmenu(Threescene));
    Threestage.play(Threescene);

    var div = $("#content");
    div.context.onmousewheel = function (e) {
        $("#clickmenu").hide();
        redraw(e, Threescene);
    }

    return Threescene;
}

//轨迹页面
function GetOrbit(deviceid, startdate, enddate, centerLon, centerLat, index, xunit, yunit) {
    var Orbitcanvas = document.getElementById('canvas');
    Orbitcanvas.width = window.screen.width;
    if (getCookieValue("TPSmall") == "small") {
        Orbitcanvas.height = window.screen.height - 160;
        Orbitcanvas.width = window.screen.width - 200;
    } else {
        Orbitcanvas.height = window.screen.height;
    }
    var Orbitstage = new JTopo.Stage(Orbitcanvas);
    var Orbitscene = new JTopo.Scene(Orbitstage);
    Orbitscene.setBackground('img/bg.jpg');
    //Orbitstage.hasAnimate = false;
    Orbitscene.shadow = false;
    Orbitscene.nodeMap = {};

    if (centerLon == "") {
        Orbitscene.CenterX = parseInt(getConfig('CenterX'));
        Orbitscene.CenterY = parseInt(getConfig('CenterY'));
        Orbitscene.XUnit = getConfig("XUnit") / 1.5 / 1.5;
        Orbitscene.YUnit = getConfig("YUnit") / 1.5 / 1.5;
    } else {
        Orbitscene.CenterX = parseInt(getConfig('CenterX'));
        Orbitscene.CenterY = parseInt(getConfig('CenterY'));
        Orbitscene.XUnit = getConfig("XUnit") / 1.5;
        Orbitscene.YUnit = getConfig("YUnit") / 1.5;
    }

    Orbitstage.play(Orbitscene);
    //显示轨迹
    var json = getC3ProcessInfo(deviceid, startdate, enddate, Orbitscene, centerLon, centerLat);
    addStageListener(Orbitstage, getC3Mapmenu(Orbitscene, json[0][1].JCINFO));

    //显示线路
    linJson = getMislineSCenterPointsData();
    for (var j = 1; j < linJson.length; j++) {
        GetOneMisPosition(linJson[j][j][0].ID, Orbitscene, 'true'); //区站
    }
    var div = $("#content");
    div.context.onmousewheel = function (e) {
        $("#clickmenu").hide();
        redraw(e, Orbitscene);
    }
    return Orbitscene;
}

function redraw(e, scene) {
    if (e.wheelDelta > 0) {
        scene.XUnit = scene.XUnit * 1.2;
        scene.YUnit = scene.YUnit * 1.2;
    }
    else {
        scene.XUnit = scene.XUnit / 1.2;
        scene.YUnit = scene.YUnit / 1.2;
    }
    var newCenterLon = getfloatlon(scene.CenterX, scene.CenterLon, scene.XUnit, e.x);
    var newCenterLat = getfloatlat(scene.CenterY, scene.CenterLat, scene.YUnit, e.y);

    var allElments = scene.elements;
    for (var i = 0; i < allElments.length; i++) {
        allElments[i].x = getXbyLon(allElments[i].lon, newCenterLon, e.x, scene.XUnit); // 
        allElments[i].y = getYbyLat(allElments[i].lat, newCenterLat, e.y, scene.YUnit);
        allElments[i].json.x = allElments[i].x;
        allElments[i].json.y = allElments[i].y;
        //allElments[i].selected = false;
    }
}
function getfloatlon(CenterX, CenterLon, XUnit, x) {
    if (CenterLon == "")
        CenterLon = parseFloat(getConfig('CenterLon'));
    var float_lon = (x - CenterX) / XUnit + Number(CenterLon);
    return float_lon;
}

function getfloatlat(CenterY, CenterLat, YUnit, y) {
    if (CenterLat == "")
        CenterLat = parseFloat(getConfig('CenterLat'));
    var float_lat = (y - CenterY) / YUnit + Number(CenterLat);
    return float_lat;
}

//自动刷新设备

function RefsetInterval() {
    var locoset = setInterval('refushLocos()', 300000);
}

function refushLocos() {
    var json = scene.smsJson;
    for (var i = 0; i < json.length; i++) {
        for (var j = 0; j < scene.nodes.length; j++) {
            if (json[i] == scene.nodes[j].json) {
                scene.remove(scene.nodes[j]);
            }
        }
    }
    var smsJson = GetSms("", scene); //设备
    scene.smsJson = smsJson;
}

///缺陷JTOPO
var alarmscene;
var stage; var canvas;
function GetAlarmMisLine(Lat, Lon, xunit, yunit, CX, startTime, endTime) {
    $("#rightmenu").hide();
    $("#clickmenu").hide();
    canvas = document.getElementById('canvas');
    canvas.width = window.screen.width * 0.91 - 5;
    canvas.height = (parseInt($(window).height())) * 0.88;
    stage = new JTopo.Stage(canvas);
    alarmscene = new JTopo.Scene(stage);
    alarmscene.setBackground('img/bg.jpg');
    alarmscene.shadow = false;
    alarmscene.nodeMap = {};
    if (CX == "1") {

        GetAlarmLine("", "", startTime, endTime, "", "");

    } else {
        GetAlarmLine(Lat, Lon, "", "", xunit, yunit);
    }

    addStageListener(stage, getAlarmmenu(alarmscene));
    stage.play(alarmscene);
    var div = $("#content");
    div.context.onmousewheel = function (e) {
        $("#clickmenu").hide();
        redraw(e, alarmscene);
    }

    return alarmscene;
}
//缺陷页面
function GetAlarmLine(Lat, Lon, startTime, endTime, xunit, yunit) {
    alarmscene.CenterLat = Lat;
    alarmscene.CenterLon = Lon;
    if (xunit == "") {
        //alarmscene.YUnit = "-240";
        //alarmscene.XUnit = "300";
        alarmscene.YUnit = getConfig('YUnit') / 1.1;
        alarmscene.XUnit = getConfig('XUnit') / 1.1; 
    } else {
        alarmscene.YUnit = yunit / 1.1  ;
        alarmscene.XUnit = xunit / 1.1; ;
    }
    alarmscene.CenterX = $(window).width() / 2;
    alarmscene.CenterY = $(window).height() / 2;
    //线路
    linJson = getMislineSCenterPointsData();
    var nodes = new Array();
    for (var j = 1; j < linJson.length; j++) {
        nodes = nodes.concat(GetOneMisPosition(linJson[j][j][0].ID, alarmscene, null, "GIS")); //区站);
    }
    var alarmJson = "";
    if (startTime != "") {
        alarmJson = GetAlarm(null, nodes, alarmscene, startTime, endTime, 4, "GIS"); //报警
    }
    alarmscene.linJson = linJson;
    alarmscene.alarmJson = alarmJson;
    addStageListener(stage, getAlarmmenu(alarmscene));
    stage.play(alarmscene);
    var div = $("#content");
    div.context.onmousewheel = function (e) {
        $("#clickmenu").hide();
        redraw(e, alarmscene);
    }
}
//下拉列表
function MisLinesSelect() {
    responseData = XmlHttpHelper.transmit(false, "get", "text", "../MGIS/ASHX/Select/Select.ashx?type=1", null, null);
    var list = responseData.toString().split("$");
    document.getElementById("divddlOrg").innerHTML = list[1];
    document.getElementById("divddlLine").innerHTML = list[0];
    LineChange2($("#txtLine option:first").attr("value"));
    OrgChange3($("#ddlOrg option:first").attr("value"));
    OrgChange4($("#ddlWorkshop option:first").attr("value"));
}


///缺陷GIS的条件过滤
function TimeAlarmInfo() {
    var startdate = document.getElementById('startdate').value;
    var enddate = document.getElementById('enddate').value;
    if (startdate != null && startdate != "" && enddate != null && enddate != "") {
        if (enddate < startdate) {
            ymPrompt.errorInfo('结束时间必须比开始时间大~！！', null, null, '提示信息', null);
            return;
        }
    } else {
        ymPrompt.errorInfo('时间不能为空~！！', null, null, '提示信息', null);
        return;
    }


    for (var i = 0; i < alarmscene.nodes.length; i++) {

        if (alarmscene.nodes[i].type == 'alarm') {
            alarmscene.remove(alarmscene.nodes[i]);
            if (i != 0) {
                i = i - 1;
            }
        }
    }
    // GetAlarmMisLine("", "", "", "", "1", startdate, enddate)
    GetAlarmInfo("", "", startdate, enddate, "", "");
    // GetAlarmLine("", "", startTime, endTime, "", "");
    // window.location.href = "AlarmTopo.htm?CX=1&startTime=" + startTime + "&endTime=" + endTime;


}
//缺陷页面
function GetAlarmInfo(Lat, Lon, startTime, endTime, xunit, yunit) {

    var alarmJson = GetAlarm(null, alarmscene.nodes, alarmscene, startTime, endTime, 4, "GIS"); //报警

    alarmscene.alarmJson = alarmJson;

    addStageListener(stage, getAlarmmenu(alarmscene));
    stage.play(alarmscene);
    var div = $("#content");
    div.context.onmousewheel = function (e) {
        $("#clickmenu").hide();
        redraw(e, alarmscene);
    }
}
//加载所有省会城市节点
function loadMainCities(scene, centerLon, centerLat, centerX, centerY, xunit, yunit) {
    var mainCities =
    {
        "cities": [
        {
            "name": "北京",
            "lon": "116.37833",
            "lat": "39.91844"
        },
        {
            "name": "天津",
            "lon": "117.190766",
            "lat": "39.138566"
        },
        {
            "name": "石家庄",
            "lon": "114.515534",
            "lat": "38.049049"
        },
        {
            "name": "太原",
            "lon": "112.545816",
            "lat": "37.879669"
        },
        {
            "name": "呼和浩特",
            "lon": "111.774782",
            "lat": "40.847768"
        },
        {
            "name": "沈阳",
            "lon": "123.428744",
            "lat": "41.81"
        },
        {
            "name": "长春",
            "lon": "125.326589",
            "lat": "43.924079"
        },
        {
            "name": "哈尔滨",
            "lon": "126.573181",
            "lat": "45.797789"
        },
        {
            "name": "上海",
            "lon": "121.486347",
            "lat": "31.247112"
        },
        {
            "name": "南京",
            "lon": "118.819019",
            "lat": "32.070955"
        },
        {
            "name": "杭卅",
            "lon": "120.158336",
            "lat": "30.28234"
        },
        {
            "name": "合肥",
            "lon": "117.259651",
            "lat": "31.838445"
        },
        {
            "name": "福卅",
            "lon": "119.322672",
            "lat": "26.072966"
        },
        {
            "name": "南昌",
            "lon": "115.879483",
            "lat": "28.700695"
        },
        {
            "name": "济南",
            "lon": "117.016418",
            "lat": "36.676834"
        },
        {
            "name": "郑卅",
            "lon": "113.648092",
            "lat": "34.748448"
        },
        {
            "name": "武汉",
            "lon": "114.366643",
            "lat": "30.599349"
        },
        {
            "name": "长沙",
            "lon": "112.975806",
            "lat": "28.210035"
        },
        {
            "name": "广卅",
            "lon": "113.277605",
            "lat": "23.134024"
        },
        {
            "name": "南宁",
            "lon": "108.302684",
            "lat": "22.806136"
        },
        {
            "name": "海口",
            "lon": "110.311531",
            "lat": "20.025432"
        },
        {
            "name": "成都",
            "lon": "104.07987",
            "lat": "30.655838"
        },
        {
            "name": "昆明",
            "lon": "102.718551",
            "lat": "25.048346"
        },
        {
            "name": "拉萨",
            "lon": "91.08612",
            "lat": "29.657367"
        },
        {
            "name": "西安",
            "lon": "108.944549",
            "lat": "34.282458"
        },
        {
            "name": "兰卅",
            "lon": "103.802257",
            "lat": "36.075274"
        },
        {
            "name": "银川",
            "lon": "106.219426",
            "lat": "38.492496"
        },
        {
            "name": "乌鲁木齐",
            "lon": "87.588433",
            "lat": "43.828519"
        },
        {
            "name": "重庆",
            "lon": "106.540581",
            "lat": "29.56219"
        },
        {
            "name": "贵阳",
            "lon": "106.63",
            "lat": "26.65"
        },
        {
            "name": "西宁",
            "lon": "101.78",
            "lat": "36.62"
        },
    ]
    }

    for (var i = 0; i < mainCities.cities.length; i++) {
        var node = new JTopo.Node(mainCities.cities[i].name);
        //node.style.fontColor = "black";
        node.style.fontSize = "13pt";
        node.setLocation(getXbyLon(mainCities.cities[i].lon, centerLon, centerX, xunit), getYbyLat(mainCities.cities[i].lat, centerLat, centerY, scene.yunit));
        node.setImage("./img/maincity.png", true);
        node.lon = mainCities.cities[i].lon;
        node.lat = mainCities.cities[i].lat;
        node.json = mainCities.cities[i];
        scene.add(node);
    }
}



function addStageListener(stage, rightMenuHtml) {
    stage.mode = 'edit';
    stage.addEventListener('mousedown', function (event) {
        //stage.mode = 'drag';
        event.scene.mousedownX = event.x;
        event.scene.mousedownY = event.y;
    });
    stage.addEventListener('mouseup', function (event) {
        //stage.mode = 'select';
        if (event.button == 2) {
            $("#rightmenu").html(rightMenuHtml);
            $("#rightmenu").css({
                top: event.pageY,
                left: event.pageX
            }).show();
        }
        else {
            var scene = event.scene;
            scene.mouseupX = event.x;
            scene.mouseupY = event.y;
            var moveX = Number(scene.mouseupX - scene.mousedownX);
            var moveY = Number(scene.mouseupY - scene.mousedownY);
            if (moveX == 0 && moveY == 0) {
                return;
            }
            var allElments = scene.elements;
            for (var i = 0; i < allElments.length; i++) {
                allElments[i].x = parseFloat(allElments[i].x + moveX);
                allElments[i].y = parseFloat(allElments[i].y + moveY);
                allElments[i].json.x = allElments[i].x;
                allElments[i].json.y = allElments[i].y;
                allElments[i].selected = false;
            }

            var newCenterLon = getfloatlon(parseFloat(scene.CenterX) + parseFloat(moveX), scene.CenterLon, scene.XUnit, scene.CenterX);
            var newCenterLat = getfloatlat(parseFloat(scene.CenterY) + parseFloat(moveY), scene.CenterLat, scene.YUnit, scene.CenterY);
            scene.CenterLon = newCenterLon;
            scene.CenterLat = newCenterLat;
        }
    });
}
function GD() {
    var canvas = document.getElementById('canvas');
    canvas.width = window.screen.width;
    canvas.height = window.screen.height;
    var stage = new JTopo.Stage(canvas);
    var scene = new JTopo.Scene(stage);
    scene.setBackground('img/bg.jpg');
    //Orbitstage.hasAnimate = false;
    scene.shadow = false;
    scene.nodeMap = {};
    stage.mode = 'drag';

    var div = $("#content");
    div.height = window.screen.height;
    div.context.onmousewheel = function (e) {
        var allElments = scene.elements;
        for (var i = 0; i < allElments.length; i++) {
            if (e.wheelDelta > 0) {
                allElments[i].x = allElments[i].x * 1.5;
                allElments[i].y = allElments[i].y * 1.5;
            }
            else {
                allElments[i].x = allElments[i].x / 1.5;
                allElments[i].y = allElments[i].y / 1.5;
            }
        }
    }

    stage.play(scene);
    Getsub("", scene);

}

//-------------------------重复告警---------------------------------------

//第二层
function GetTwoRepeat(LineCode, Lat, Lon, XUnit, YUnit, TopoStyle, mode) {
    var Twocanvas = document.getElementById('canvas');
    Twocanvas.width = window.screen.width - 75;
    var Twostage = new JTopo.Stage(Twocanvas);
    var Twoscene = new JTopo.Scene(Twostage);
    //Twostage.hasAnimate = false;
    Twoscene.shadow = false;
    if (Lat != "")//是搜索功能的打开
    {
        Twoscene.XUnit = XUnit / 0.5;
        Twoscene.YUnit = YUnit / 0.5;
        Twoscene.CenterLon = Lon;
        Twoscene.CenterLat = Lat;
        Twoscene.CenterX = 800;
        Twoscene.CenterY = 550;
    }
    else {
        Twoscene.XUnit = getConfig("XUnit") // getConfig("XUnit") / 2.5;
        Twoscene.YUnit = getConfig("XUnit"); //getConfig("YUnit") / 2.5;
        Twoscene.CenterX = 800;
        Twoscene.CenterY = 550;
        //Twoscene.CenterY = 550;
        //中心坐标在读出区站后才能确定
    }

    if (mode == 'small') {
        Twocanvas.width = 750;
        Twocanvas.height = 750;
        Twoscene.CenterX = 400;
        Twoscene.CenterY = 300;
    }
    if (getCookieValue("TPSmall") == "small") {
        Twoscene.CenterX = parseInt(getConfig('CenterX')) / 2;
        Twoscene.CenterY = parseInt(getConfig('CenterY')) / 2;
    } else {
        Twoscene.CenterX = parseInt(getConfig('CenterX'));
        Twoscene.CenterY = parseInt(getConfig('CenterY'));
    }
    Twoscene.setBackground('img/bg.jpg');
    $("#rightmenu").hide();


    getTwoLineRepeat(Twoscene, LineCode, TopoStyle);
    addStageListener(Twostage, getTwomenu(Twoscene));
    Twostage.play(Twoscene);

    var div = $("#content");
    div.context.onmousewheel = function (e) {
        $("#clickmenu").hide();
        redraw(e, Twoscene);
    }
    return Twoscene;
}
//第二层具体操作
function getTwoLineRepeat(Twoscene, LineCode, TopoStyle) {
    //线路
    linJson = getMislineSCenterPointsData();
    Twoscene.TopoStyle = TopoStyle;
    var jsonline = getMislinePointsData(LineCode);
    if (Twoscene.CenterLat == undefined) {//不是搜索功能打开页面
        if (jsonline.length > 0) {
            Twoscene.CenterLat = jsonline[parseInt(jsonline.length / 2)].startLatitude;
            Twoscene.CenterLon = jsonline[parseInt(jsonline.length / 2)].startLongitude;
        } else {
            Twoscene.CenterLat = getConfig("CenterLat");
            Twoscene.CenterLon = getConfig("CenterLon");
        }
    }

    var posJson = GetTwoMisPosition(LineCode, Twoscene, TopoStyle);
    //    if (getConfig("For6C") == "6C") {
    //        var subJson = GetSubstation(LineCode, Twoscene, TopoStyle); //变电所
    //        Twoscene.subJson = subJson;
    //    }

    var alarmJson = ""; //  GetAlarm(LineCode, Twoscene.nodes, Twoscene, "", "", 2, TopoStyle); //报警
    var smsJson = ""; //GetSms(Twoscene.nodes, Twoscene, 2, TopoStyle); //设备
    Twoscene.linJson = linJson;
    Twoscene.posJson = posJson;
    Twoscene.alarmJson = alarmJson;
    Twoscene.smsJson = smsJson;
}