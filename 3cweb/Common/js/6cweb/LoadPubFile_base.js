
loadJs("/Lib/jquery-1.7.2/jquery-1.7.2.min.js"); //jquery主文件
loadJs("/Common/js/6cweb/xmlHttpHelper.js"); //ajax
loadJs("/Common/js/6cweb/MasterJs.js?r=" + Math.random()); //公共方法
loadCss("/Lib/bootstrap/css/bootstrap-cerulean.css");
loadCss("/Lib/bootstrap/css/bootstrap-responsive.css");
loadCss("/Lib/bootstrap/css/charisma-app.css");
loadCss("/Common/css/master.css");
loadJs("/Lib/bootstrap/bootstrap.min.js");

loadJs("/Lib/jquery.cookie/jquery.cookie.js"); //cookie

loadJs("/Lib/My97DatePicker/WdatePicker.js"); //日期控件
loadJs("/Common/js/progress/lib.js"); //下载控件

//弹出框
loadCss("/Lib/ymPrompt/skin/qq/ymPrompt.css");
loadJs("/Lib/ymPrompt/ymPrompt.js");

//全屏加载效果
loadJs("/Common/js/CommonPerson/CommonPerson.js");
loadCss("/Common/js/CommonPerson/CommonPerson.css");

//弹出窗口，加载效果也需要。
loadCss("/Lib/lightbox/jquery.lightbox.css");
loadJs("/Lib/lightbox/jquery.lightbox.min.js");
document.write('<link href="/Common/img/favicon.ico" rel="shortcut icon" type="image/ico"/>');

function SetEchart() {
    require.config({
        paths: {
            'echarts': '/Lib/Echarts-2.0/2.0/echarts',
            'echarts/chart/line': '/Lib/Echarts-2.0/2.0/echarts'
        }
    });
};

function loadJs(url, charset) {
    if (charset == undefined)
        document.write('<script src="' + url + '" type="text/javascript" charset="gbk"></script>');
    else
        document.write('<script src="' + url + '" type="text/javascript" charset="' + charset + '"></script>');
};

function loadCss(url, callback) {
    document.write('<link href="' + url + '" rel="stylesheet" type="text/css" />');

     
};
