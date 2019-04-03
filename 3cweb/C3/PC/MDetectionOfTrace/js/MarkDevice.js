$(document).ready(function () {
//下拉选择控件
$('#DeviceNum').LocoSelect({
    position: 'MonitorLocGJList_Mark',
});

//设备编号控件
$('#DeviceNum').inputSelect({
    type: 'loca',
    contant: 2,
    position: 'MonitorLocGJList_Mark',
});
            
    LoadAllDevice();
    $('#btn_Mark').click(function () {
        var device_code = $('#DeviceNum').val();
        //HtmlMarkedDevice(device_code);
        if (device_code !== '') {
            DeviceMark(device_code);
        } else {
            layer.msg('请选择设备！')
        }
    })
})


//标记异常设备
function DeviceMark(Code) {
    var _url = '/Common/RemoteHandlers/GetLocomotive.ashx?type=IsAbnormity&action=add&loco=' + Code;//路径
    $.ajax({
        url: _url,
        type: "POST",
        async: true,
        cache: false,
        success: function (re) {
            if (re.result == '0') {
                layer.alert('标记成功！', { icon: 1, closeBtn: 1 }, function () {
                    layer.closeAll();
                    $('#DeviceNum').html('');
                    $('.DeviceContent').html('')
                    LoadAllDevice()
                })
            } else if (re.result == '-1') {
                layer.msg('标记失败！')
            } else {
                layer.msg('该设备已标记！')
            };
        }
    });
};

function LoadAllDevice() {
    var _url = '/Common/RemoteHandlers/GetLocomotive.ashx?type=IsAbnormity&action=query';
    $.ajax({
        url: _url,
        type: "POST",
        async: true,
        cache: false,
        success: function (re) {
            var _count = re.ABNORMAL_COUNT;
            $('#TotalNum').html('（' + _count + '台）');
            var m = re.ABNORMALS;
            var _m = re.NORMALS;
            var _html = '';
            var _option = '<option value="">请选择</option>';
            for (var i = 0; i < m.length; i++) {
                if (m[i] !== undefined && m[i] !== '')
                    _html = '<span class="deviceSpan">' + m[i].CODE + '<i class="icon_close" onclick=DeleteMarkedDevice(this)></i>' + '</span>';
                $('.DeviceContent').html($('.DeviceContent').html() + _html);
                $('#DeviceNum').val('');
            }
            //for (var j = 0; j < _m.length; j++) {
            //    if (_m[j] !== undefined && _m[j] !== '') {
            //        _option += '<option value=' + _m[j].CODE + '>' + _m[j].CODE + '</option>';
            //        $('#DeviceNum').append(_option);
            //    }
            //}
            //$('#DeviceNum').html(_option);
        }
    })
}
//删除已经标记过的异常设备
function DeleteMarkedDevice(obj) {
    var deviceId = $(obj).parent('span').text();
    $(obj).parent('span').remove();//在页面在暂时取消异常设备（未请求后台）
    var _url = '/Common/RemoteHandlers/GetLocomotive.ashx?type=IsAbnormity&action=delete&loco=' + deviceId;
    $.ajax({
        url: _url,
        type: "POST",
        async: true,
        cache: false,
        success: function (re) {
            if (re.result === 'True') {
                layer.alert('取消成功！', { icon: 1, closeBtn: 1 }, function () {
                    layer.closeAll();
                    $('#DeviceNum').html('');
                    $('.DeviceContent').html('')
                    LoadAllDevice()
                })
            } else {
                layer.msg('取消失败！')
            }
        }
    })
}


//暂时标记异常设备（未请求后台）
function HtmlMarkedDevice(Code) {
    var re = '';
    if (Code !== undefined && Code !== '')
        re = '<span class="deviceSpan">' + Code + '<i class="icon_close" onclick=DeleteMarkedDevice(this)></i>' + '</span>';
    $('.DeviceContent').html($('.DeviceContent').html() + re);
    $('#DeviceNum').val('');
};