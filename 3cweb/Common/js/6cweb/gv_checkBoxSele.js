var _cb_allClass = 'cb_all';
var _cb_itemClass = 'cb_item';
var hf_idsID = 'vIDs';

//控制绑定
function SetControl(allclass, itemclass, idsID) {
    _cb_allClass = allclass;
    _cb_itemClass = itemclass;
    hf_idsID = idsID;
}

$(function () {
    loadBindCheckBox();
})

//初始加载
function loadBindCheckBox() {

    //全选按钮
    $('.' + _cb_allClass).click(function () {

        var v = this.checked;
        $('.' + _cb_itemClass).each(function() {

            $(this).prop('checked', v)

            var ID = $(this).val();

            if (v) {
                setHF_id(ID);
            }
            else {
                delHF_id(ID);
            }
        })
        if ($(".cb_all").is(":checked")) {
            $("#list-num", window.parent.document).text($('.cb_item').length);
            $("#list-num").text($('.cb_item').length);
        }else{
            $("#list-num", window.parent.document).text(0);
            $("#list-num").text(0);
        }
    });

    //列表中的复选框
    $('.' + _cb_itemClass).click(function() {

        var v = this.checked;
        var id = $(this).val();
      //  alert(id)

        if (v) {
            setHF_id(id);
        }
        else {
            delHF_id(id);
        }

        $('.cb_item').each(function () {
            
            $("#list-num", window.parent.document).text($("input[type='checkbox']:checked.cb_item").length);
            $("#list-num").text($("input[type='checkbox']:checked.cb_item").length);
        })
    });

    $('.' + _cb_itemClass).each(function () {

        var v = ',' + $(this).val() + ",";
        var ids = $('#' + hf_idsID).val();
        //alert(ids);
        //alert(ids.indexOf(v));
        if (ids.indexOf(v) > -1) {
            $(this).attr('checked', true);
        }

    });
    
    
}

//保存id到hiddenField
function setHF_id(_id) {


    var ids = $('#' + hf_idsID).val();
    if (ids.indexOf(',' + _id + ',') < 0)
        $('#' + hf_idsID).val(ids + ',' + _id + ',')

}

//删除id从hiddenField
function delHF_id(_id) {
    var ids = $('#' + hf_idsID).val().replace(',' + _id + ',', '');
    $('#' + hf_idsID).val(ids)
}

//得到ids从hiddenField
function GetHF_ids() {
    var ids = $('#' + hf_idsID).val();
    if (ids != '') {
        var temp1 = ids.substring(1, ids.length - 1)
        temp1 = temp1.replace(/,,/g, ',')
        return temp1;
    }
    return "";

}

//是否选择的一项
function isOne() {
    var ids = GetHF_ids();
    if (ids == '') return false;

    //alert(ids);
    
    if (ids.split(',').length > 1) {
        return false;
    }
    else {
        return true;
    }

}

//是否选择了项
function isSele() {
    var ids = GetHF_ids();
    if (ids == '')
        return false;
    else
        return true;
}
