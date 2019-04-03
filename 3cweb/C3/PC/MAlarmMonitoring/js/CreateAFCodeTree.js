var settingaf = {
    view: {
        dblClickExpand: false
    },
    data: {
        simpleData: {
            enable: true
        }
    },
    callback: {
        beforeClick: beforeClick,
        onClick: afonClick
    }
};
//获取树数据节点
function getzNodesaf() {
    var url = "RemoteHandlers/GetAFCodeTree.ashx";
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

function beforeClick(treeId, treeNode) {
    var check = (treeNode);
    return check;
}

function afonClick(e, treeId, treeNode) {
    var zTree = $.fn.zTree.getZTreeObj("treeDemo"),
			nodes = zTree.getSelectedNodes(),
			v = "";
    nodes.sort(function compare(a, b) { return a.id - b.id; });
    for (var i = 0, l = nodes.length; i < l; i++) {
        v += nodes[i].name + ",";
    }
    if (v.length > 0) v = v.substring(0, v.length - 1);
    var cityObj = $("#citySel");
    cityObj.attr("value", v);
}

function showMenu() {
    var cityObj = $("#citySel");
    var cityOffset = $("#citySel").offset();
    $("#menuContent").css({ left: cityOffset.left + "px", top: cityOffset.top + cityObj.outerHeight() + "px" }).slideDown("fast");

    $("body").bind("mousedown", onBodyDown);
}
function hideMenu() {
    $("#menuContent").fadeOut("fast");
    $("body").unbind("mousedown", onBodyDown);
}
function onBodyDown(event) {
    if (!(event.target.id == "citySel" || event.target.id == "menuContent" || $(event.target).parents("#menuContent").length > 0)) {
        hideMenu();
    }
}
function loadaftree() {
    $.fn.zTree.init($("#treeDemo"), settingaf, getzNodesaf());
}