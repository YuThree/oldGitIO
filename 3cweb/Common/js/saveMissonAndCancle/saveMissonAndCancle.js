
// 加入收藏和处理任务功能
function loadeSaveMissionAndCancle(STATUSDIC, IS_TYPICAL) {
    if ($('#ckdj').length == 0 && FunEnable('Fun_batchSaveHandle') == "True") {
        addSheetFile("/Lib/bootstrap/css/opa-icons.css");
        $('#setSaveMissionAndCancle').after('<button id="ckdj" class="btn btn-info editorBtn" title="典型数据标记" style="padding-left: 5px;margin-left: 4px;" onclick="marker_bug()"><i class="icon icon-star-on icon-white"></i>典型</button>')
        if (IS_TYPICAL == '1') {
            $('#ckdj i').removeClass("icon-white").addClass("icon-color");
        } else {
            $('#ckdj i').removeClass("icon-color").addClass("icon-white");
        }
    }
    if (STATUSDIC == '已计划' || STATUSDIC == '检修中' || STATUSDIC == '已关闭') {
        return;
    }

    if ($('#eachC_save').length == 0) {
        $('#setSaveMissionAndCancle').after('<div class="btn-group dropup forSave" id="eachC_save" type="hide" style="display: inline-block; vertical-align: middle;margin-left: 0;">\
                            <a href="#" title="收藏为取消/转任务" class="btn btn-info dropdown-toggle " data-toggle="dropdown">\
                               <span class="saveTitle"> 收藏至</span><span class="caret"></span>\
                            </a>\
                            <ul class="dropdown-menu" style="min-width:60px;">\
                                <li class="Canc">\
                                    <a style="text-align: left;">待取消</a>\
                                </li>\
                                <li class="Mission">\
                                    <a href="javascript:void(0)"  style="text-align: left;">待转任务</a>\
                                </li>\
                                <li class="">\
                                    <a href="javascript:void(0)"  style="text-align: left;">不收藏</a>\
                                </li>\
                            </ul>\
                        </div>\
                        <div class="btn-group dropup" id="eachC_manage" type="hide" style="display: inline-block; vertical-align: middle;margin-left: 0;">\
                            <a href="#" title="批量处理" class="btn btn-info dropdown-toggle " data-toggle="dropdown">\
                               <span class=""> 批量</span><span class="caret"></span>\
                            </a>\
                            <ul class="dropdown-menu chooseType_saveList" style="min-width:60px;">\
                                <li class="Canc">\
                                    <a style="text-align: left;">取消</a>\
                                </li>\
                                <li class="Mission">\
                                    <a href="javascript:void(0)"  style="text-align: left;">转任务</a>\
                                </li>\
                            </ul>\
                        </div>')
        LoadSaveListBox("DPC");
        LoadSureBox()//加载报警确认框
        find_localStorg($('.saveTitle'), GetQueryString("alarmid"))
        $('.forSave li').click(function () {
            chooseLocalstorg($(this).attr('class'), GetQueryString("alarmid"))
        })
    }
    urlControl_new()//权限判断

}

//设置对应的本地缓存
function chooseLocalstorg(calss, alarmID) {

    DelStorageSaveAlarms(alarmID);//清除本id 然后赋值
    var CansAlarms = window.localStorage['CansAlarms'];
    var MissionAlarms = window.localStorage['MissionAlarms'];
    //console.log(alarmID)
    if (calss == 'Canc') {
        if (CansAlarms != undefined && CansAlarms != '') {
            CansAlarms += '_' + alarmID;
        } else {
            CansAlarms = alarmID;
        }
        window.localStorage.CansAlarms = CansAlarms;
    } else if (calss == 'Mission') {

        if (MissionAlarms != undefined && MissionAlarms != '') {
            MissionAlarms += '_' + alarmID;
        } else {
            MissionAlarms = alarmID;
        }
        window.localStorage.MissionAlarms = MissionAlarms;
    }
    find_localStorg($('.saveTitle'), alarmID)//显示收藏状态
    //console.log('CansAlarms:::' + window.localStorage['CansAlarms'] + '\nMissionAlarms:::' + window.localStorage['MissionAlarms'])

}


//遍历是否收藏指定类型 并显示 
function find_localStorg(obj, _alarmID) {
    if (!window.localStorage["SaveAlarms"]) {
        window.localStorage.SaveAlarms = '';
    }
    if (!window.localStorage["CansAlarms"]) {
        window.localStorage.CansAlarms = '';
    }
    if (!window.localStorage["MissionAlarms"]) {
        window.localStorage.MissionAlarms = '';
    }//如果没有name  初始化缓存

    var CansAlarms = window.localStorage["CansAlarms"];
    var MissionAlarms = window.localStorage["MissionAlarms"];
    obj.text('收藏至');
    if (CansAlarms != undefined && CansAlarms != '') {
        if (CansAlarms.indexOf(_alarmID) >= 0) {
            obj.text('已收藏至取消');
        }
    }
    if (MissionAlarms != undefined && MissionAlarms != '') {
        if (MissionAlarms.indexOf(_alarmID) >= 0) {
            obj.text("已收藏至转任务");
        }
    }

}

//css引用-----new 针对插件引用特定css old-loadCss 报错
function addSheetFile(path) {
    var fileref = document.createElement("link")
    fileref.rel = "stylesheet";
    fileref.type = "text/css";
    fileref.href = path;
    fileref.media = "screen";
    var headobj = document.getElementsByTagName('head')[0];
    headobj.appendChild(fileref);
}