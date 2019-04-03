


function GerSmsHtml(json) {


    var html = "";
    html += " <a href='#' onclick='ColseC3Alarm()' style='position:absolute;right:0;top:0;display:inline-block;'><img src='img/gis-img/guanbi.png' alt='关闭' /></a>\
      <div style='padding:12px 20px;'>\
          <div class='row-fluid AnimateMarker-title'>\
              <div class='span12'>" + json.TRAIN_NO + "</div>\
          </div>\
          <div class='AnimateMarker-body' style='line-height:34px;'>\
              <div class='AnimateMarker-text'>\
                  <div class='row-fluid'>\
                      <div class='span12'><span class='AnimateMarker-color'>当前位置：</span><span>" + json.WZ + "</span></div>\
                    </div>\
                    <div class='row-fluid'>\
                        <div class='span12'><span class='AnimateMarker-color'>时&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;间：</span><span>&nbsp;&nbsp;" + json.DETECT_TIME + "</span></div>\
                    </div>\
                </div>\
                <div style='clear:both;'></div>\
            </div>\
            <div class='row-fluid AnimateMarker-body' style='line-height:34px;'>\
                <div class='AnimateMarker-text'>\
                    <div class='row-fluid'>\
                        <div class='span6'><span class='AnimateMarker-color'>最高温度(℃)：</span><span>" + json.IRV_TEMP + "</span></div>\
                        <div class='span6'><span class='AnimateMarker-color'>环境温度(℃)：</span><span>" + json.SENSOR_TEMP + "</span></div>\
                    </div>\
                    <div class='row-fluid'>\
                        <div class='span6'><span class='AnimateMarker-color'>导高值(mm)：</span><span>" + json.LINE_HEIGHT + "</span></div>\
                        <div class='span6'><span class='AnimateMarker-color'>拉出值(mm)：</span><span>" + json.PULLING_VALUE + "</span></div>\
                    </div>\
                </div>\
                <div style='clear:both;'></div>\
            </div>\
            <div class ='AnimateMarker-body' style='line-height:34px;'>\
                <div class='AnimateMarker-text'>\
                    <div class='row-fluid'>\
                        <div class='span6'><span class='AnimateMarker-color'>弓&nbsp;状&nbsp;态&nbsp;：</span><span>" + json.BOW_UPDOWN_STATUS + "</span></div>\
                        <div class='span6'><span class='AnimateMarker-color'>速度(km/h)：</span><span>" + json.SPEED + "</span></div>\
                    </div>\
                    <div class='row-fluid " + (getConfig('debug') == "1" ? '' : 'hidden' )+ "'>\
                        <div class='span6'><span class='AnimateMarker-color'>东&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;经：</span><span>" + json.GIS_X_O + "</span></div>\
                        <div class='span6'><span class='AnimateMarker-color'>北&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;纬：</span><span>" + json.GIS_Y_O + "</span></div>\
                    </div>\
                </div>\
                <div style='clear:both;'></div>\
            </div>\
        </div>";
    return html;
}



//获取告警生成的HTML
function getAlarmHtml(json) {
    //隐藏的告警编码
    var alarmc;
    if (json.CUST_ALARM_CODE == "") {
        alarmc = json.DETECT_DEVICE_CODE + "_" + json.RAISED_TIME.substring(2, 19).replace(/\D/g, '');
    } else {
        alarmc = json.CUST_ALARM_CODE;
    }

    var _handle = '';
    if ('已计划' !== json.STATUS_NAME && '检修中' !== json.STATUS_NAME && '已关闭' !== json.STATUS_NAME) {
        _handle = "<div class='row-fluid AnimateMarker-foot'>\
                        <a class='footSure' href='#' id='E_btnOk2'><img src='img/orbit-img/sure.png' alt='报警确认' /></a>\
                        <a class='footCancel' href='#'  id='E_btnCan2' ><img src='img/orbit-img/cancel.png' alt='报警取消' /></a>\
                   </div>";
    }

    var html = "";
    if ('6C' === json.CATEGORY_CODE) {
        html += " <a href='#' onclick='ColseC3Alarm()' style='position:absolute;right:0;top:0;display:inline-block;'><img src='img/gis-img/guanbi.png' alt='关闭' /></a>\
      <div style='padding:12px 20px;'>\
          <div class='row-fluid AnimateMarker-title'>\
              <div class='span12'>缺陷详情</div>\
          </div>\
          <div class='AnimateMarker-body'>\
              <div class='AnimateMarker-img'><span>报警现场</span></div>\
              <div class='AnimateMarker-text'>\
                  <div class='row-fluid'>\
                      <div class='span6'><span class='AnimateMarker-color'>线&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;路：</span><span>" + json.LINE_NAME + "</span></div>\
                      <div class='span6'><span class='AnimateMarker-color'>发生时间：</span><span><a href='#' onclick='GetC3AlarmFrom(&quot;" + json.ALARM_ID + "&quot;,&quot;" + json.CATEGORY_CODE + "&quot)'>" + json.RAISED_TIME + "</a></span></div>\
                    </div>\
                    <div class='row-fluid'>\
                      <div class='span6'><span class='AnimateMarker-color'>变&nbsp;电&nbsp;所：</span><span>" + json.SUBSTATION_NAME + "</span></div>\
                      <div class='span6'><span class='AnimateMarker-color'>设备名称：</span><span style='position:absolute;'>" + json.POWER_DEVICE_CODE + "</span></div>\
                    </div>\
                </div>\
                <div style='clear:both;'></div>\
            </div>\
            <div class='row-fluid AnimateMarker-body' style='line-height:60px;'>\
                <div class='AnimateMarker-img'><span>报警分析</span></div>\
                <div class='AnimateMarker-text'>\
                    <div class='span6'><span class='AnimateMarker-color'>报警类型：</span><span>" + json.CODE_NAME + "</span></div>\
                    <div class='span6'><span class='AnimateMarker-color'>报警级别：</span><span>" + json.SEVERITY + "</span></div>\
                </div>\
                <div style='clear:both;'></div>\
            </div>\
            <div class ='row-fluid AnimateMarker-body' style='line-height:60px;'>\
                <div class='AnimateMarker-img'><span style='padding: 8px 0 0 5px;'>检测值</span></div>\
                <div class='AnimateMarker-text'>\
                    <div class='span4'><span class='AnimateMarker-color'>环境温度：</span><span>" + json.ENV_TEM + "℃</span></div>\
                    <div class='span4'><span class='AnimateMarker-color'>区域温度：</span><span>" + json.AREATEM + "℃</span></div>\
                    <div class='span4'><span class='AnimateMarker-color'>区域温差：</span><span>" + json.AREATEM_DROP + "℃</span></div>\
                </div>\
                <div style='clear:both;'></div>\
            </div>\
    <div class='row-fluid AnimateMarker-foot' style='display:none;'>\
        <a class='footSure' href='#' id='E_btnOk2'><img src='img/orbit-img/sure.png' alt='报警确认' /></a>\
                <a class='footCancel' href='#'  id='E_btnCan2' ><img src='img/orbit-img/cancel.png' alt='报警取消' /></a>\
            </div>\
        </div>";
    } else {
        html += " <a href='#' onclick='ColseC3Alarm()' style='position:absolute;right:0;top:0;display:inline-block;'><img src='img/gis-img/guanbi.png' alt='关闭' /></a>\
      <div style='padding:12px 20px;'>\
          <div class='row-fluid AnimateMarker-title'>\
              <div class='span12'>缺陷详情</div>\
          </div>\
          <div class='AnimateMarker-body'>\
              <div class='AnimateMarker-img'><span>报警现场</span></div>\
              <div class='AnimateMarker-text'>\
                  <div class='row-fluid'>\
                      <div class='span12'><span class='AnimateMarker-color'>位&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;置：</span><span>" + json.wz + "</span></div>\
                    </div>\
                    <div class='row-fluid'>\
                        <div class='span5'><span class='AnimateMarker-color'>时&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;间：</span><span><a href='#' onclick='GetC3AlarmFrom(&quot;" + json.ALARM_ID + "&quot;,&quot;" + json.CATEGORY_CODE + "&quot)'>" + json.RAISED_TIME + "</a></span></div>\
                        <div class='span4'><span class='AnimateMarker-color'>设备编号：</span><span style='position:absolute;'>" + json.DETECT_DEVICE_CODE + "</span></div>\
                        <div class='span3'><span class='AnimateMarker-color'>弓位置&nbsp;&nbsp;&nbsp;：</span><span>" + json.GWZ + "</span></div>\
                        <div class='span3' style='display:none;'>\
                             <span class='so_LT'>标签编码：</span><strong><span id='HideAlarmCode'>" + alarmc + "</span></strong>\
                        </div>\
                    </div>\
                </div>\
                <div style='clear:both;'></div>\
            </div>\
            <div class='row-fluid AnimateMarker-body' style='line-height:60px;'>\
                <div class='AnimateMarker-img'><span>报警分析</span></div>\
                <div class='AnimateMarker-text'>\
                    <div class='span5'><span class='AnimateMarker-color'>报警类型：</span><span>" + json.CODE_NAME + "</span></div>\
                    <div class='span4'><span class='AnimateMarker-color'>报警级别：</span><span>" + json.SEVERITY + "</span></div>\
                    <div class='span3'><span class='AnimateMarker-color'>报警状态：</span><span>" + json.STATUS_NAME + "</span></div>\
                </div>\
                <div style='clear:both;'></div>\
            </div>\
            <div class ='AnimateMarker-body'>\
                <div class='AnimateMarker-img'><span style='padding: 8px 0 0 5px;'>检测值</span></div>\
                <div class='AnimateMarker-text'>\
                    <div class='row-fluid'>\
                        <div class='span5'><span class='AnimateMarker-color'>拉出值&nbsp;&nbsp;&nbsp;：</span><span>" + json.LCZ + "mm</span></div>\
                        <div class='span4'><span class='AnimateMarker-color'>导高值&nbsp;&nbsp;&nbsp;：</span><span>" + json.DGZ + "mm</span></div>\
                        <div class='span3'><span class='AnimateMarker-color'>速&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;度：</span><span>" + json.SD + "km/h</span></div>\
                    </div>\
                    <div class='row-fluid'>\
                        <div class='span5'><span class='AnimateMarker-color'>环境温度：</span><span>" + json.HJWD + "℃</span></div>\
                        <div class='span7'><span class='AnimateMarker-color'>报警温度：</span><span>" + json.WD + "℃" + "</span></div>\
                    </div>\
                </div>\
                <div style='clear:both;'></div>\
            </div>\
        " + _handle +
        "</div>";
    }

    return html;
};



function GetLineCoverageHtml(json, changed) {


    var html = "";
    html += "<div style='width:600px;'>\
        <a href='#' onclick='CloseInfoWindow()' style='position:absolute;right:0;top:0;display:inline-block;'><img src='img/gis-img/guanbi.png' alt='关闭' /></a>\
        <div style='padding:12px 20px;'>\
          <div class='row-fluid AnimateMarker-title'>\
              <div class='span12'>" + json.LOCOMOTIVE_CODE + "</div>\
          </div>\
          <div class='AnimateMarker-body'>\
              <div class='AnimateMarker-text'>\
                <div class='row-fluid'>\
                      <div class='span12'><span class='AnimateMarker-color'>时&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;间：</span><span>" + json.DETECT_TIME + "</span></div>\
                </div>\
                <div class='row-fluid'>\
                      <div class='span12'><span class='AnimateMarker-color'>当前位置：</span><span>" + json.WZ + "</span></div>\
                </div>\
                <div class='row-fluid "+(getConfig('debug') == "1"?'':'hidden' )+"'>\
                      <div class='span6'><span class='AnimateMarker-color'>经&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;度：</span><span>" + json.GIS_X + "</span></div>\
                      <div class='span6'><span class='AnimateMarker-color'>纬&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;度：</span><span>" + json.GIS_Y + "</span></div>\
                </div>\
              </div>\
              <div style='clear:both;'></div>\
            </div>\
            <div class='row-fluid AnimateMarker-body'>\
                <div class='AnimateMarker-text'>\
                    <div class='row-fluid'>\
                        <span class='span12 AnimateMarker-body-title' id='chooseChange' change='1'>选择区站</span>\
                    </div>\
                    <div class='row-fluid'>\
                        <div class='span6'><span class='AnimateMarker-color'>铁路局：</span><span><input id='LineC_ju' type='text' lastvalue='" + json.BUREAU_NAME + "' value='" + (changed ? changed.BUREAU_NAME : json.BUREAU_NAME) + "' code='' autocomplete='off'></span></div>\
                        <div class='span6'><span class='AnimateMarker-color'>供电段：</span><span><input id='LineC_duan' type='text' lastvalue='" + json.ORG_NAME + "' value='" + (changed ? changed.ORG_NAME : json.ORG_NAME) + "' code=''></span></div>\
                    </div>\
                    <div class='row-fluid'>\
                        <div class='span6'><span class='AnimateMarker-color'>线&nbsp;&nbsp;&nbsp;路：</span><span><input id='LineC_line' type='text' lastvalue='" + json.LINE_NAME + "' value='" + (changed ? changed.LINE_NAME : json.LINE_NAME) + "' code=''></span></div>\
                        <div class='span6'><span class='AnimateMarker-color'>行&nbsp;&nbsp;&nbsp;别：</span><span><input id='LineC_direction' type='text' lastvalue='" + json.DIRECTION + "' value='" + (changed ? changed.DIRECTION : json.DIRECTION) + "' code=''></span></div>\
                    </div>\
                    <div class='row-fluid'>\
                        <div class='span6'><span class='AnimateMarker-color'>区&nbsp;&nbsp;&nbsp;站：</span><span><input id='LineC_position' type='text' lastvalue='" + json.POSITION_NAME + "' value='" + (changed ? changed.POSITION_NAME : json.POSITION_NAME) + "' code=''></span></div>\
                    </div>\
                </div>\
                <div style='clear:both;'></div>\
            </div>\
            <div class='row-fluid AnimateMarker-foot'>\
                <a class='' href='#' id=''>\
                    <input class='btn btn-danger' value='取消开始点设置' id='cancelStart' style='display:none;' type='button' onclick=\"cancelStart()\">\
                </a>\
                <a class='' href='#' id=''>\
                    <input class='btn btn-success' value='设置为开始点' id='setBegin' type='button' onclick=\"changeListNotone('" + json.DETECT_TIME + "')\">\
                </a>\
                <a class='footSure' href='#' id='lineCoverage_sure'>\
                    <input class='btn btn-primary' value='确认' type='button' onclick=\"changeList('" + json.ID + "')\">\
                </a>\
                <a class='footCancel' href='#'  id='lineCoverage_cancel' >\
                    <input class='btn btn-primary' value='关闭' type='button' onclick='CloseInfoWindow()'>\
                </a>\
            </div>\
        </div>\
    </div>";
    return html;
};


//障出框日期点击事件

//弹出缺陷详情页面
function GetC3AlarmFrom(id, category) {
    if (category == '3C') {
        var url = "/C3/PC/MAlarmMonitoring/MonitorAlarm3CForm4.htm?alarmid=" + id + "&rsurl=no&v=" + version;//弹出3C详情页
        window.open(url, "_blank");
    } else if (category == '6C') {
        //var url = "/6C/PC/MAlarmMonitoring/MonitorAlarmC6Form6C.htm?alarmid=" + id + "&rsurl=no&v=" + version;//弹出6C详情页
        var url = '/C6/PC/MAlarmMonitoring/MonitorAlarmC6Form.htm?Eventid=' + id + "&rsurl=no&v=" + version;
        window.open(url, "_blank");
    }
};
//关闭告警信息框（红外、高清和曲线）
function ColseC3Alarm() {
    if (oldp != null)
        oldp.setAnimation(null);
    ClearAnimateMarker();
    $("#C3Alarm").css("display", "none");
};