var dirpath; //前面路径
var josnpath; //中间路径
var alarmid; //默认第一个缺陷ID
var set; //定时器
var imaname; //imaname
var jpgname; //jpgname
var Imgjson;
var ImgNum; //图片计数
var imaCount;
var jpgCount;
var InfoNum = 0; //信息计数
var locinfo;
var Ispaly = 1;
//全局JSON
var Allimg;
//Imgjson.FRAME_INFO[0].TEMP_IRV;





//为IMG赋值
function ImgShuffling() {
    if (ImgNum == imaCount) {
        document.getElementById("hw").src = dirpath + Imgjson.IRV_DIR_NAME + imaname + ".JPG";
        var ez = $('#kjg').data('elevateZoom');
        ez.swaptheimage(dirpath + Imgjson.VI_DIR_NAME + jpgname + Imgjson.START_INDEX + ".JPG", dirpath + Imgjson.VI_DIR_NAME + jpgname + Imgjson.START_INDEX + ".JPG"); //C2500
        document.getElementById("locnew").style.display = "none";
        document.getElementById("locold").style.display = "";
        document.getElementById("locinfo").innerHTML = locinfo;
        ImgNum = Imgjson.START_INDEX; //计数器还原
        clearInterval(set); //关闭定时器 
        set = setInterval('ImgShuffling()', 5000);
    }
    else {
        document.getElementById("hw").src = dirpath + Imgjson.IRV_DIR_NAME + imaname + ImgNum + ".JPG";
        //如果计数器少于可见光总数才换图片
        if (ImgNum <= jpgCount) {
            var ez = $('#kjg').data('elevateZoom');
            ez.swaptheimage(dirpath + Imgjson.VI_DIR_NAME + jpgname + ImgNum + ".JPG", dirpath + Imgjson.VI_DIR_NAME + jpgname + ImgNum + ".JPG"); //C2500
            //document.getElementById("kjg").src = dirpath + Imgjson.VI_DIR_NAME + jpgname + ImgNum + ".JPG";
        }
        bindLog(InfoNum);
        //document.getElementById("test").innerHTML = ImgNum + "<br/>" + dirpath + Imgjson.IRV_DIR_NAME + imaname + ImgNum + ".JPG" + "<br/>" + dirpath + Imgjson.VI_DIR_NAME + jpgname + ImgNum + ".JPG"; //打印地址
        ImgNum++;
        InfoNum++;
        clearInterval(set);
        set = setInterval('ImgShuffling()', 500);
    }



}
//绑定每帧信息
function bindLog(i) {
    if (i > 9) {
        InfoNum = 0;
        i = InfoNum;
    }
    document.getElementById("locnew").style.display = "";
    document.getElementById("locold").style.display = "none";
    document.getElementById("zgwd").innerHTML = Imgjson.FRAME_INFO[i].TEMP_IRV / 100;
    document.getElementById("hjwd").innerHTML = Imgjson.FRAME_INFO[i].TEMP_ENV / 100;
    document.getElementById("dgz").innerHTML = Imgjson.FRAME_INFO[i].LINE_HEIGHT;
    document.getElementById("lcz").innerHTML = Imgjson.FRAME_INFO[i].PULLING_VALUE;
    document.getElementById("sd").innerHTML = Imgjson.FRAME_INFO[i].SPEED;

}


//获取信息
function getAlarminfo(alarm) {
    getImgjson(alarm);
    //    createLineChart();
    alarmid = alarm;
    var url = "RemoteHandlers/GetlocAlarmImgInfo.ashx?alarmid=" + alarmid;
    $.ajax({ type: "POST",
        url: url,
        async: false,
        cache: false,
        success: function (result) {
            responseData = eval('(' + result + ')');
            if (responseData != undefined) {
                //如果是几何参数缺陷就展示拉出值曲线
                if (IsJHCS(responseData.SUMMARYDIC)) {
                    $("#lc").click();
                } else {
                    createLineChart();
                }
                ImgNum = Imgjson.START_INDEX;
                InfoNum = 0;
                dirpath = responseData.DIR_PATH + "/"; //处理后的IMA图片地址
                imaname = "/" + responseData.SNAPPED_IMA;
                jpgname = "/" + responseData.SNAPPED_JPG;
                locinfo = responseData.localarminfo;
                Allimg = responseData.ALLIMG;
                document.getElementById("hw").src = dirpath + Imgjson.IRV_DIR_NAME + imaname + ".JPG";
                var ez = $('#kjg').data('elevateZoom');

                var _img1 = dirpath + Imgjson.VI_DIR_NAME + jpgname + Imgjson.START_INDEX + ".JPG";
                var _img2 = dirpath + Imgjson.VI_DIR_NAME + jpgname + Imgjson.START_INDEX + ".JPG";
                $('#kjg').attr('src', _img1);

                ez.swaptheimage(_img1, _img2); //C2500
            }
        }
    });
    window.parent.allimgck();
}
//关闭定时器
function Suspended() {
    clearInterval(set); //关闭定时器
}
//获取Imgjson串
function getImgjson(alarmid) {
    var url = "RemoteHandlers/GetlocAlarmImgWdJson.ashx?alarmid=" + alarmid;
    $.ajax({
        type: "POST",
        url: url,
        async: false,
        cache: true,
        success: function (result) {
            Imgjson = eval('(' + result + ')');
        }
    });
};
//画温度曲线
function createLineChart() {
    $("#linechart").kendoChart({

        chartArea: {
            background: ""
        },
        seriesDefaults: {
            type: "line",
            style: "smooth"
        },
        legend: {
            visible: false
        },
        valueAxis: {
            labels: {
                format: "{0:N0}℃"
            },
            color: "#fff"
        },
        series: [{
            name: "温度",
            data: [Imgjson.FRAME_INFO[0].TEMP_IRV / 100, Imgjson.FRAME_INFO[1].TEMP_IRV / 100, Imgjson.FRAME_INFO[2].TEMP_IRV / 100, Imgjson.FRAME_INFO[3].TEMP_IRV / 100, Imgjson.FRAME_INFO[4].TEMP_IRV / 100, Imgjson.FRAME_INFO[5].TEMP_IRV / 100, Imgjson.FRAME_INFO[6].TEMP_IRV / 100, Imgjson.FRAME_INFO[7].TEMP_IRV / 100, Imgjson.FRAME_INFO[8].TEMP_IRV / 100, Imgjson.FRAME_INFO[9].TEMP_IRV / 100]
        }],
        categoryAxis: {
            categories: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
            majorGridLines: {
                visible: false
            },
            color: "#fff",
            visible: true
        },
        tooltip: {
            visible: true,
            format: "{0}%",
            template: "#= series.name #: #= value #℃",
            color: "#fff"
        }
    });
}

function Showbarinfo(e) {
    alert(e.category);
}


//鼠标点击弹出层
$(function () {
    $('#hw').click(function () {
        if (!$('#note').is(':visible')) {
            $('#note').css({ display: 'block', top: '-5px' }).animate({ top: '+5' }, 500);
        }
    });
});
//关闭层
function out() {
    $('#note').animate({ top: '0' }, 500, function () {
        $(this).css({ display: 'none', top: '-5px' });
    });
}
//处理事件
function ShowC3Form() {
    window.open("../../../../6C/PC/MAlarmMonitoring/MonitorAlarm3CForm6C.htm?alarmid=" + alarmid + '&v=' + version, "_blank");
}
//查看全景
function ShowAllImg() {
    out();
    if (Allimg != undefined && Allimg != "/Images_") {
        window.parent.ToAllImg(alarmid);
    } else {
        ymPrompt.errorInfo('全景图像还未上传', null, null, '提示信息', null);
    }
}
//播放/暂停
function dbImgShuffling() {
    if (Ispaly == "1") {
        Ispaly = 0;
        Suspended();
    } else {
        Ispaly = 1;
        ImgShuffling();
    }
}
//上一张
function upImg() {
    ImgNum--;
    InfoNum--;
    if (ImgNum < Imgjson.START_INDEX) { ImgNum = Imgjson.START_INDEX; }
    if (InfoNum < 0) { InfoNum = 0; }
    if (ImgNum == imaCount) {
        document.getElementById("hw").src = dirpath + Imgjson.IRV_DIR_NAME + imaname + ".JPG";
        var ez = $('#kjg').data('elevateZoom');
        ez.swaptheimage(dirpath + Imgjson.VI_DIR_NAME + jpgname + Imgjson.START_INDEX + ".JPG", dirpath + Imgjson.VI_DIR_NAME + jpgname + Imgjson.START_INDEX + ".JPG"); //C2500
        document.getElementById("locnew").style.display = "none";
        document.getElementById("locold").style.display = "";
        document.getElementById("locinfo").innerHTML = locinfo;
        ImgNum = Imgjson.START_INDEX; //计数器还原
    }
    else {
        document.getElementById("hw").src = dirpath + Imgjson.IRV_DIR_NAME + imaname + ImgNum + ".JPG";
        //如果计数器少于可见光总数才换图片
        if (ImgNum <= jpgCount) {
            var ez = $('#kjg').data('elevateZoom');
            ez.swaptheimage(dirpath + Imgjson.VI_DIR_NAME + jpgname + ImgNum + ".JPG", dirpath + Imgjson.VI_DIR_NAME + jpgname + ImgNum + ".JPG"); //C2500
        }
        bindLog(InfoNum);
    }
}
//下一张
function lastImg() {
    ImgNum++;
    InfoNum++;
    if (ImgNum == imaCount) {
        ImgNum = imaCount - 1;
        InfoNum = 9;
    }
    else {
        document.getElementById("hw").src = dirpath + Imgjson.IRV_DIR_NAME + imaname + ImgNum + ".JPG";
        //如果计数器少于可见光总数才换图片
        if (ImgNum <= jpgCount) {
            var ez = $('#kjg').data('elevateZoom');
            ez.swaptheimage(dirpath + Imgjson.VI_DIR_NAME + jpgname + ImgNum + ".JPG", dirpath + Imgjson.VI_DIR_NAME + jpgname + ImgNum + ".JPG"); //C2500
        }
        bindLog(InfoNum);
    }
}

//全屏图片
function ALLimg(e) {
    document.getElementById("note").style.display = "none";
    window.parent.ALLimg(e);
}
function getAlarminfoAndGIS(alarmid, gisx, gisy, type, linecode) {
    getAlarminfo(alarmid);
    window.parent.frames["Iframe1"].SetAlarmGIS(alarmid, "");

    window.parent.Getlineinfo(linecode);
}