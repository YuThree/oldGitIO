///查询时设置缓存时间
function SetCacheTime(time1, time2) {
    var CacheTime = GetCacheTime();
    var b = false;
    if (CacheTime == undefined) {
        b = true;
    } else if (CacheTime.split(';')[0] != time1 + "----" + time2) {
        b = true;
    }

    if (b && time1 != "" && time2 != "") {
        var CacheTime = time1 + "----" + time2;
        var v = localStorage["_CacheTime"];
        if (v != undefined) {
            v = v.replace(";" + CacheTime, "").replace(CacheTime, "");
        }
        if (v != null && v != "") {
            v = CacheTime + ";" + v;
        } else {
            v = CacheTime;
        }
        if (v.split(';').length > 7) {
            var v_CacheTime = v.split(';');
            v = v_CacheTime[0] + ";" + v_CacheTime[1] + ";" + v_CacheTime[2] + ";" + v_CacheTime[3] + ";" + v_CacheTime[4] + ";" + v_CacheTime[5] + ";" + v_CacheTime[6] + ";" + v_CacheTime[7];
        }
        localStorage["_CacheTime"] = v;
    }
    return b;
}

///获取缓存时间
function GetCacheTime() {
    var v = localStorage["_CacheTime"];
    return v;
}
var startdateId;
var enddateId;
function LoadingHistoricalTime(id1, id2) {
    startdateId = id1; enddateId = id2;
    var html = "<div class='btn-group' data-rel='tooltip' title='历史时间记录'><button class='btn btn-mini dropdown-toggle' data-toggle='dropdown' style='border-width:0px;'><a id='btn_raised_time' data-html='true'><img src='/Common/img/history.png' alt='历史记录' /></a></button><ul class='dropdown-menu' id='CacheTimes'></ul></div>";
    $("#HistoricalTime").html(html);
    SetCacheTimeHtml();
}

function UpdateTime(time) {
    var times = time.split('----');
    if (times.length == 2) {
        $("#" + startdateId).val(times[0]);
        $("#" + enddateId).val(times[1]);
    }
}
function SetCacheTimeHtml() {
    var CacheTime = GetCacheTime();
    var html = "";
    if (CacheTime != undefined) {
        for (var i = 0; i < CacheTime.split(';').length; i++) {
            if (CacheTime.split(';')[i] != '') {
                html += "<li><a href='javascript:void(0)' onclick='UpdateTime(\"" + CacheTime.split(';')[i] + "\")'><i class='icon-time'></i>" + CacheTime.split(';')[i] + "</a></li>";
            }
        }
    }
    $("#CacheTimes").html(html);
}

function doQueryHistoricalTime() {
    var startTime = $("#" + startdateId).val();
    var endTime = $("#" + enddateId).val();
    var b = SetCacheTime(startTime, endTime);
    if (b) {
        SetCacheTimeHtml();
    }
}