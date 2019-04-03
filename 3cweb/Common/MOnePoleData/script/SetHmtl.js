

//点击一杆一档地图marker生成html

function SetHtml(json) {
    var html = "";
    html += " <a href='#' onclick='Colsepoleinfo();' style='position:absolute;right:0;top:0;display:inline-block;'><img src='/Common/MGIS/img/gis-img/guanbi.png' alt='关闭' /></a>\
        <div style='padding:12px 20px;'>\
            <div class='row-fluid AnimateMarker-title'>\
                <div class='span12'>杆号详情</div>\
            </div>\
            <div class='AnimateMarker-body'>\
                <div class='AnimateMarker-text'>\
                    <div class='row-fluid' style='border-bottom: 1px solid #4E4B4B;'>\
                        <div class='span12'><span class='AnimateMarker-color'>&nbsp;&nbsp;杆&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;号：</span><span>" + json.POLE_NO + "<a href='#' style='margin-left:10px;' onclick='gotopoleinfo(&quot;" + json.POLE_CODE + "&quot;);'>(查看详情)</a></span></div>\
                    </div>\
                    <div class='row-fluid'>\
                        <div class='span6'><span class='AnimateMarker-color'>&nbsp;&nbsp;线&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;路：</span><span>" + json.LINE_NAME + "</span></div>\
                        <div class='span6'><span class='AnimateMarker-color'>区&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;站：</span><span>" + json.POSITION_NAME + "</span></div>\
                    </div>\
                    <div class='row-fluid'>\
                        <div class='span6'><span class='AnimateMarker-color'>&nbsp;&nbsp;桥&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;隧：</span><span>" + json.BRG_TUN_NAME + "</span></div>\
                    </div>\
                    <div class='row-fluid' style='border-bottom: 1px solid #4E4B4B;'>\
                        <div class='span6'><span class='AnimateMarker-color'>&nbsp;&nbsp;行&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;别：</span><span>" + json.POLE_DIRECTION + "</span></div>\
                            <div class='span6'><span class='AnimateMarker-color'>&nbsp;公&nbsp;里&nbsp;标：</span><span>" + json.KMSTANDARD + "</span></div>\
                    </div>\
                    <div class='row-fluid'>\
                        <div class='span6'><span class='AnimateMarker-color'>&nbsp;&nbsp;缺陷数量：</span><span>" + json.FAULT_CNT + "</span></div>\
                        <div class='span6'><span class='AnimateMarker-color'>报警数量：</span><span>" + json.ALARM_CNT + "</span></div>\
                    </div>\
                </div>\
                <div style='clear:both;'></div>\
            </div>\
        </div>";

    return html;
};

//关闭杆号信息框
function Colsepoleinfo() {
    if (oldp != null)
        oldp.setAnimation(null);
    ClearAnimateMarker();
};
//杆号点击事件
function gotopoleinfo(device_id) {
    var zt = getSelectedItem(document.getElementById('ddlzt'));
    var jb = getSelectedItem(document.getElementById('jb'));
    var start_time = $('#start_time').val()//开始时间
    var end_time = $('#end_time').val()//结束时间
    var after = '&zt=' + escape(zt) + '&jb=' + escape(jb) + '&stime=' + start_time + '&etime=' + end_time;

    toPoleDetails(device_id, after);
};
