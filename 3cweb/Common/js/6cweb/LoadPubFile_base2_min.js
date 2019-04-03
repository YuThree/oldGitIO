
loadJs("/Lib/jquery-1.7.2/jquery-1.7.2.min.js"); //jquery主文件
loadJs("/Common/js/6cweb/MasterJs.js?r=" + Math.random()); //公共方法

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
