//得到硬盘信息
function loadHardDisk(id) {
    var url = "RemoteHandlers/HardDiskForm.ashx?type=loadHardDisk&id=" + id ;
    $.ajax({
        type: "POST",
        url: url,
        async: false,
        cache: false,
        success: function (result) {
            json = eval('(' + result + ')');
            if (json != undefined) {
//                switch (json.DATA_TYPE) {
//                    case "1C":
                        $("input[name='DEPT_NAME']").attr("value", json.DEPT_NAME);
                        getLineByDeptCode(json.MIS_ORG_ID, "LINE_NAME");
                        $("select[name='LINE_NAME']").attr("value", json.MIS_LINE_ID);
                        onChangeLine(json.LINE_NAME, json.MIS_LINE_ID);
                        $("select[name='START_STATION']").attr("value", json.START_STATION);
                        $("select[name='END_STATION']").attr("value", json.END_STATION);
                        $("select[name='DIRECTION']").attr("value", json.DIRECTION);
                        $("input[name='START_TIME']").attr("value", (new Date(parseInt(json.START_TIME.replace("/Date(", "").replace(")/", ""), 10))).toLocaleString());
                        $("input[name='END_TIME']").attr("value", (new Date(parseInt(json.END_TIME.replace("/Date(", "").replace(")/", ""), 10))).toLocaleString());
                        //                        if (json.ORIGINAL_FILE_PATH != null) {
                        //                            document.getElementById('UPLOADORIGINAL_FILE_PATH').href = json.ORIGINAL_FILE_PATH;
                        //                            document.getElementById('UPLOADORIGINAL_FILE_PATH').style.display = "";
                        //                        }
                        $("input[name='VIDEO_PATH']").attr("value", json.VIDEO_PATH);
                        if (json.VIDEO_PATH != null) {
                            document.getElementById('UPLOADVIDEO_PATH').href = "../../../FtpRoot/1C/" + json.VIDEO_PATH;
                            document.getElementById('UPLOADVIDEO_PATH').style.display = "";
                        }
                        $("input[name='FILE_PATH']").attr("value", json.FILE_PATH);
                        if (json.FILE_PATH != null) {
                            document.getElementById('UPLOADFILE_PATH').href = "../../../FtpRoot/1C/" + json.FILE_PATH;
                            document.getElementById('UPLOADFILE_PATH').style.display = "";
                        }
                        $("input[name='FAULT_FILE_PATH']").attr("value", json.FAULT_FILE_PATH);
                        if (json.FAULT_FILE_PATH != null) {
                            document.getElementById('UPLOADFAULT_FILE_PATH').href = "../../../FtpRoot/1C/" + json.FAULT_FILE_PATH;
                            document.getElementById('UPLOADFAULT_FILE_PATH').style.display = "";
                        }
                        $("input[name='CONTEXT']").attr("value", json.CONTEXT);
//                    default:
              //  }



            }
        }
    });
}
//树样式
var setting = {
    data: {
        simpleData: {
            enable: true
        }
    }
};

//绑定树
function getzNodes(value) {
    var url = "/Common/MTask/RemoteHandlers/TaskForm.ashx?type=tree&value=" + value;
    var json;
    $.ajax({
        type: "POST",
        url: url,
        async: false,
        cache: true,
        success: function (result) {
            json = eval('(' + result + ')');
        }
    });
    return json;
};
//加载树
function loadTree(value) {
    $.fn.zTree.init($("#tree"), setting, getzNodes(value));
};
//单击树
function TreeClick(id, name) {
    document.getElementById('modal-container-selectOrg').style.display = "none";
    $("input[name='DEPT_NAME']").attr("value", name);
    $("input[name='DEPT_CODE']").attr("value", id);

    getLineByDeptCode(id, "LINE_NAME");
};
//关闭组织机构
function closeSelectOrg() {
    document.getElementById('modal-container-selectOrg').style.display = "none";
};
//显示组织机构选择
function showOrgDialog(obj) {
    document.getElementById('modal-container-selectOrg').style.display = "";
    loadTree(document.getElementById(obj).value);
};
//根据组织得到线路
function getLineByDeptCode(deptCode, bindObj) {
    var url = "/Common/RemoteHandlers/Pubic.ashx?type=GetLineByDept&objWhere=" + deptCode;
    $.ajax({
        type: "POST",
        url: url,
        async: false,
        cache: false,
        success: function (result) {
            document.getElementById(bindObj).innerHTML = result;
        }
    });
};
//根据线路得到区站
function onChangeLine(text, value) {
    $("input[name='LINE_CODE']").attr("value", text);
    var url = "/Common/RemoteHandlers/Pubic.ashx?type=GetStationByLine&objWhere=" + value;
    $.ajax({
        type: "POST",
        url: url,
        async: false,
        cache: false,
        success: function (result) {
            document.getElementById("START_STATION").innerHTML = result;
            document.getElementById("END_STATION").innerHTML = result;
        }
    });
};
function checkImgType(ths) {
    if (ths.value == "") {
        alert("请上传图片");
        return false;
    } else {
        if (!/\.(rar)$/.test(ths.value)) {
            ymPrompt.succeedInfo("必须上传打包文件！", null, null, '提示信息');
            ths.value = "";
            return false;
        }
    }
    return true;
};

function saveHardDisk(type) {
    var DEPT_CODE = document.getElementById("DEPT_CODE").value;
    var DEPT_NAME = document.getElementById("DEPT_NAME").value;
    var linecode = document.getElementById("LINE_NAME").value;
    var linename = document.getElementById("LINE_CODE").value;
    var START_STATIONNAME = document.getElementById("START_STATION").value;
    var END_STATIONNAME = document.getElementById("END_STATION").value;
    var DIRECTION = document.getElementById("DIRECTION").value;
    var START_TIME = document.getElementById("START_TIME").value;
    var END_TIME = document.getElementById("END_TIME").value;
    var CONTEXT = document.getElementById("CONTEXT").value;
    responseData = XmlHttpHelper.transmit(false, "get", "text", "RemoteHandlers/HardDiskForm.ashx?type=add&DEPT_CODE=" + escape(DEPT_CODE) + "&DEPT_NAME=" + escape(DEPT_NAME) + "&linecode=" + escape(linecode)
    + "&linename=" + escape(linename)
    + "&START_STATIONNAME=" + escape(START_STATIONNAME)
    + "&END_STATIONNAME=" + escape(END_STATIONNAME)
    + "&DIRECTION=" + escape(DIRECTION)
    + "&START_TIME=" + escape(START_TIME)
    + "&END_TIME=" + escape(END_TIME)
    + "&CONTEXT=" + escape(CONTEXT)
    + '&temp=' + Math.random(), null, null);
    if (responseData == "True") {
        $("#flexTable").flexigrid(option);
        $("#flexTable").flexOptions(option).flexReload();
        ymPrompt.succeedInfo('添加成功', null, null, '提示信息', null);
    } else {
        ymPrompt.errorInfo('添加失败', null, null, '提示信息', null);
    }
    document.getElementById('close').click();
};