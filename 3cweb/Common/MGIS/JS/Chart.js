/*========================================================================================*
* 功能说明：地图统计操作类
* 注意事项：
* 作    者： wcg
* 版本日期：2013年5月30日
* 修 改 人： wcg
* 修改日期：2013年5月30日
* 变更说明：
* 版 本 号： V1.0
*=======================================================================================*/

function getBMapOneChart() {
    $.jqplot.config.enablePlugins = true;
    var lineCenterjson = getMislineSCenterPointsData();
    var s1 = [];
    var ticks = [];
    for (var i = 1; i < lineCenterjson.length; i++) {
        ticks.push(lineCenterjson[i][i][0].LINE_NAME);
        s1.push(i + 10);
    }
    plot1 = $.jqplot('chartOne', [s1], {
        animate: !$.jqplot.use_excanvas,
        seriesDefaults: {
            renderer: $.jqplot.BarRenderer,
            pointLabels: { show: true }
        },
        axes: {
            xaxis: {
                renderer: $.jqplot.CategoryAxisRenderer,
                ticks: ticks
            }
        },
        highlighter: { show: false }
    });
}


function getBMapTwoChart(id) {
    $.jqplot.config.enablePlugins = true;
    var s1 = [5, 6, 7, 8];
    var ticks = ['X1站', 'X2站', 'X3站', 'X4站'];
    plot1 = $.jqplot('chartTwo', [s1], {
        animate: !$.jqplot.use_excanvas,
        seriesDefaults: {
            renderer: $.jqplot.BarRenderer,
            pointLabels: { show: true }
        },
        axes: {
            xaxis: {
                renderer: $.jqplot.CategoryAxisRenderer,
                ticks: ticks
            }
        },
        highlighter: { show: false }
    });
}