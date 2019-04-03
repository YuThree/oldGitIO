<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <title>实时监控</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="Page-Enter" content="revealTrans(Duration=0.5,Transition=0)" />
    <meta http-equiv="Page-Exit" content="revealTrans(Duration=5,Transition=22)" />
    <meta name="description" content="" />
    <meta name="author" content="" />
    <link href="/Lib/lightbox/jquery.lightbox.css" rel="stylesheet" type="text/css" />
    <link href="/Common/js/6cweb/video/VideoPlay.css" rel="stylesheet" type="text/css" />
    <link href="/Lib/bootstrap/css/metro-bootstrap.css" rel='stylesheet' />
    <link href="/Lib/ymPrompt/skin/qq/ymPrompt.css" rel="stylesheet" type="text/css" />
    <style type="text/css">
        button.s_menu
        {
            background: transparent url(/Common/img/i_menu.png) no-repeat left center;
            padding-left: 26px;
            width: 100px;
            color: #CCC;
        }
        button.s_menu:hover
        {
            color: #FFF;
        }
        a.go_home
        {
            background: transparent url(/Common/img/i_home.png) no-repeat left center;
            padding: 4px 12px 4px 26px;
            width: 100px;
            color: #CCC;
            display: inline-block;
            line-height: 16px;
        }
        a.go_home:hover
        {
            color: #FFF;
        }
        a.btn_link, a.btn_play, a.btn_r, a.btn_fullscreen
        {
            background: transparent url(../../img/i_btn_bg.png) no-repeat center;
            height: 34px;
            width: 50px;
            line-height: 34px;
            color: #333333;
        }
        a.btn_link:hover
        {
            background: transparent url(../../img/i_btn_bg.png) no-repeat center;
            color: #FFF;
        }
        a.btn_play
        {
            background: transparent url(../../img/i_btn_play.png) no-repeat center;
            display: inline-block;
            margin-right: 10px;
        }
        a.btn_r
        {
            background: transparent url(../../img/i_btn_r.png) no-repeat center;
            display: inline-block;
            margin-right: 10px;
        }
        a.btn_fullscreen
        {
            background: transparent url(../../img/i_btn_fullscreen.png) no-repeat center;
            display: inline-block;
            margin-right: 10px;
        }
    </style>
    <!-- jQuery 必须-->
    <script src="/Lib/jquery-1.7.2/jquery-1.7.2.min.js" type="text/javascript"></script>
    <!-- jQuery UI必须 -->
    <script src="/Lib/jquery-ui-1.8.21.custom/jquery-ui-1.8.21.custom.min.js" type="text/javascript"></script>
    <!-- TAB库 依赖-->
    <script src="/Lib/bootstrap/bootstrap-tab.js" type="text/javascript"></script>
    <!-- library for advanced tooltip 依赖-->
    <script src="/Lib/bootstrap/bootstrap-tooltip.js" type="text/javascript"></script>
    <!-- popover effect library 依赖-->
    <script src="/Lib/bootstrap/bootstrap-popover.js" type="text/javascript"></script>
    <!-- button enhancer library 依赖-->
    <script src="/Lib/bootstrap/bootstrap-button.js" type="text/javascript"></script>
    <!-- accordion library 依赖-->
    <script src="/Lib/bootstrap/bootstrap-collapse.js" type="text/javascript"></script>
    <!-- library for cookie management依赖 -->
    <script src="/Lib/jquery.cookie/jquery.cookie.js" type="text/javascript"></script>
    <!-- calander plugin 依赖-->
    <script src="/Lib/fullcalendar/fullcalendar.min.js" type="text/javascript"></script>
    <!-- data table plugin 依赖-->
    <script src="/Lib/jquery.dataTables/jquery.dataTables.min.js" type="text/javascript"></script>
    <!-- select or dropdown enhancer 依赖-->
    <script src="/Lib/jquery.chosen/jquery.chosen.min.js" type="text/javascript"></script>
    <!-- checkbox, radio, and file input styler 依赖-->
    <script src="/Lib/jquery.uniform/jquery.uniform.min.js" charset="gbk" type="text/javascript"></script>
    <!-- plugin for gallery image view 依赖-->
    <script src="/Lib/jquery.colorbox/jquery.colorbox.min.js" type="text/javascript"></script>
    <!-- rich text editor library 依赖-->
    <script src="/Lib/jquery.cleditor/jquery.cleditor.min.js" type="text/javascript"></script>
    <!-- file manager library 依赖-->
    <script src="/Lib/jquery.elfinder/jquery.elfinder.min.js" type="text/javascript"></script>
    <!-- star rating plugin 依赖-->
    <script src="/Lib/jquery.raty/jquery.raty.min.js" type="text/javascript"></script>
    <!-- for iOS style toggle switch 依赖-->
    <script src="/Lib/jquery.iphone.toggle/jquery.iphone.toggle.js" type="text/javascript"></script>
    <!-- autogrowing textarea plugin 依赖-->
    <script src="/Lib/jquery.autogrow-textarea/jquery.autogrow-textarea.js" type="text/javascript"></script>
    <!-- multiple file upload plugin 依赖-->
    <script src="/Lib/jquery.uploadify-3.1/jquery.uploadify-3.1.min.js" charset="gbk" type="text/javascript"></script>
    <!-- history.js for cross-browser state change on ajax 依赖-->
    <script src="/Lib/jquery.history/jquery.history.js" type="text/javascript"></script>
    <!-- o -->
    <script src="/Lib/lightbox/jquery.lightbox.min.js" type="text/javascript"></script>
    <script src="/Common/js/6cweb/MasterJs.js" type="text/javascript"></script>
    <script src="/Lib/metro/metro.min.js" type="text/javascript"></script>
    <script src="/Lib/metro/metro-dropdown.js" type="text/javascript"></script>
    <!--弹出框-->
    <script src="/Lib/ymPrompt/ymPrompt.js" type="text/javascript"></script>
    <script type="text/javascript">
        var dirpathall; //前面路径
        var setall; //定时器
        var allname; //imaname
        var ImgjsonAll;
        var ImgNumall; //图片计数
        //全局JSON
        var isfast = 0; //是否第一次执行
        //Imgjson.FRAME_INFO[0].TEMP_IRV;
        //为IMG赋值
        function ImgShufflingALL() {
            if (ImgjsonAll != undefined) {
                if (ImgNumall == 11) {
                    document.getElementById("allimg").src = dirpathall + ImgjsonAll.START_INDEX + ".JPG";
                    document.getElementById("imgtest").innerHTML = ImgNumall + "<br/>" + dirpathall + ImgjsonAll.START_INDEX + ".JPG" + "<br/>"; //打印地址
                    ImgNumall = ImgjsonAll.START_INDEX; //计数器还原
                    clearInterval(setall); //关闭定时器 
                    setall = setInterval('ImgShufflingALL()', 5000);
                }
                else {
                    document.getElementById("allimg").src = dirpathall + ImgNumall + ".JPG";
                    document.getElementById("imgtest").innerHTML = ImgNumall + "<br/>" + dirpathall + ImgNumall + ".JPG" + "<br/>";
                    ImgNumall++;
                    clearInterval(setall);
                    setall = setInterval('ImgShufflingALL()', 500);
                }
            }
        }
        function allimgck() {
            document.getElementById("allimg").style.display = "none";
            document.getElementById("Iframe3").style.display = "";
        };
        //查看3张图
        function SetImg(FRAME) {
            if (FRAME != undefined && FRAME != "") {
                document.getElementById("Iframe1").style.display = "none";
                document.getElementById("IRHW").style.display = "";
                document.getElementById("IRHW").src = "../../FtpRoot/C3/CRH2237/2014-05-14/IRVJPG/IRV_" + FRAME + ".JPG";

                document.getElementById("Iframe2").style.display = "none";
                document.getElementById("MVKJG").style.display = "";
                document.getElementById("MVKJG").src = "../../FtpRoot/C3/CRH2237/2014-05-14/MVJPG/MV_" + FRAME + ".JPG";

                document.getElementById("url").style.display = "none";
                document.getElementById("MP4QJ").style.display = "";
                document.getElementById("MP4QJ").src = "../../FtpRoot/C3/CRH2237/2014-05-14/MP4JPG/MP4_" + FRAME + ".JPG";
            }

        }
        function Close3Img() {

            document.getElementById("Iframe1").style.display = "";
            document.getElementById("IRHW").style.display = "none";
            document.getElementById("Iframe2").style.display = "";
            document.getElementById("MVKJG").style.display = "none";
            document.getElementById("url").style.display = "";
            document.getElementById("MP4QJ").style.display = "none";
        }
        //获取信息
        function getAlarminfoAll(alarmid) {
            getImgjsonAll(alarmid);
            var url = "RemoteHandlers/GetlocAlarmImgInfo.ashx?alarmid=" + alarmid;
            $.ajax({ type: "POST",
                url: url,
                async: false,
                cache: false,
                success: function (result) {
                    responseData = eval('(' + result + ')');
                    if (responseData != undefined) {
                        ImgNumall = ImgjsonAll.START_INDEX;
                        dirpathall = "../" + responseData.DIR_PATH + responseData.ALLIMG; //处理后的IMA图片地址
                        document.getElementById("allimg").src = dirpathall + ImgjsonAll.START_INDEX + ".JPG";
                    }
                }
            });
            ImgShufflingALL();
        }
        //获取Imgjson串
        function getImgjsonAll(alarmid) {
            var url = "RemoteHandlers/GetlocAlarmImgWdJson.ashx?alarmid=" + alarmid;
            $.ajax({
                type: "POST",
                url: url,
                async: false,
                cache: true,
                success: function (result) {
                    ImgjsonAll = eval('(' + result + ')');
                }
            });
        };
        //关闭定时器
        function SuspendedAll() {
            clearInterval(setall); //关闭定时器
        };
        function MonitorindexSmallGis(GIS_X, GIS_Y, ID, TYPE) {
            var src = "/Common/MGIS/SmallGIS.htm?Category_Code=3C&GIS_X=" + escape(GIS_X) + "&GIS_Y=" + escape(GIS_Y) + "&ID=" + escape(ID) + "&TYPE=" + escape(TYPE) + '&v=' + version;
            $("#Iframe1").attr("src", src);
        };

        function ShowMTwin(str, w, h) {
            $("#tanchu").attr("href", str + "&lightbox[iframe]=true&lightbox[width]=" + w + "p&lightbox[height]=" + h + "p");
            $("#tanchu").click();
        };

        function clickGisMap(locomotiveNo) {
            var url = "RemoteHandlers/GetC3barJson.ashx?type=GIS&locomotiveNo=" + locomotiveNo;
            var json;
            $.ajax({
                type: "POST",
                url: url,
                async: false,
                cache: true,
                success: function (result) {
                    json = eval('(' + result + ')');
                    if (getCookieValue("GisMode") == "gis") {
                        window.document.getElementById('Iframe1').src = '/Common/MGIS/SmallGIS.htm?Category_Code=3C&Width=1&CenterLon=' + json[0].GIS_X + "&CenterLat=" + json[0].GIS_Y + '&v=' + version;
                    }
                    else {
                        window.document.getElementById('Iframe1').src = '/Common/MTopo/LogicTopo.html?Category_Code=3C&Width=1&Small=small&centerLon=' + json[0].GIS_X + "&centerLat=" + json[0].GIS_Y + '&v=' + version;
                    }
                }
            });
        };
        function ToAllImg(alarmid, is) {
            if (alarmid != undefined) {
                if (is == "1") {
                    getAlarminfoAll(alarmid);
                } else {
                    getAlarminfoAll(alarmid);
                    document.getElementById("Iframe3").style.display = "none";
                    document.getElementById("allimg").style.display = "";
                }
            }
        };
        //GIS 设备视频联动
        var locomotiveCode = "CRH2229A";
        function onClickIframeTwo(loco) {
            locomotiveCode = loco;
            document.getElementById('Iframe2').src = "../MLiveStreaming/MonitorLocoPlayMini.htm?IsP=YES&locomotiveCode=" + loco + '&v=' + version;
            document.getElementById('Iframe3').src = "C3Bar.htm?v=" + version;
        };
        //双屏模式
        function clickRealPlayTwo() {
            document.getElementById("allimg").style.display = "none";
            document.getElementById("Iframe3").style.display = "";
            document.getElementById('Iframe3').src = "../MLiveStreaming/MonitorLocoPlayNewTwo.htm?Loco=" + locomotiveCode + '&v=' + version;
        };
        //选择联动赋值
        function onClickForLocomotiveCode(loco) {
            locomotiveCode = loco;
        };
        //双屏都要关闭
        function clickRealPlayTwoAll() {
            document.getElementById("Iframe2").src = "../MLiveStreaming/MonitorLocoPlayMini.htm?IsP=YES&locomotiveCode=" + locomotiveCode + '&v=' + version; //先上值，等开发完成
            document.getElementById("allimg").style.display = "none";
            document.getElementById("Iframe3").style.display = "";
            document.getElementById('Iframe3').src = "C3Bar.htm?v="+version;
        }
        //第二屏关闭联动
        function clickRealPlayTwoBack() {
            document.getElementById("allimg").style.display = "none";
            document.getElementById("Iframe3").style.display = "";
            document.getElementById('Iframe3').src = "C3Bar.htm?v="+version;
        };
        //历史视频双屏
        function clickPlayTwo(loco) {
            document.getElementById("Iframe3").style.display = "";
            document.getElementById('Iframe3').src = "VedioPlayTwo.htm?loco=" + loco + '&v=' + version;
        };
        function Getlineinfo(linecode) {
            //document.getElementById('Iframe3').src = "C3Echart.htm?linecode=" + linecode;
        }
        //加载C3
        function loadC3Echart() {
            $("#Iframe3").attr("src", "C3Bar.htm?v="+version);
        };
        function loadC3GIS() {
            $("#Iframe1").attr("src", "/Common/MGIS/SmallGIS.htm?Category_Code=3C&Width=1&v=" + version);
        };
        function loadC3SP() {
            $("#Iframe2").attr("src", "../MLiveStreaming/MonitorLocoPlayMini.htm?IsP=YES&locomotiveCode=" + locomotiveCode + '&v=' + version);
        };
        //全屏图片
        function ALLimg(e) {

            document.getElementById("table").style.display = "none";
            document.getElementById("BigImg").style.display = "";
            document.getElementById("BigImg").src = e.src;
        }
        //退出全屏
        function CloseALLimg(e) {
            document.getElementById("table").style.display = "";
            document.getElementById("BigImg").style.display = "none";
        }

        //初始化加载
        $(document).ready(function () {
            $('.lightbox').lightbox();
            loadC3GIS();
            //loadC3SP();
            loadC3Img();
            ImgShufflingALL();
            //urlControl();
            //setTimeout(loadC3Echart, 5000);
        });
    </script>
</head>
<body style="background-color: #333333; overflow: hidden;">
    <img id="BigImg" ondblclick="CloseALLimg()" style="height: 100%; width: 100%; display: none"
        src="" />
    <div id="table">
        <a id="tanchu" href="#" class="lightbox"></a>
        <div>
            <table border="1" cellpadding="1" cellspacing="1" style="height: 100%; width: 100%">
                <tr>
                    <td style="height: 50%; width: 100%" colspan="2">
                        <iframe id="Iframe1" scrolling="no" src="" style="width: 100%" onload="Javascript:SetWinHeight(this)"
                            frameborder="0"></iframe>
                        <img id="IRHW" src="#" onclick="Close3Img()" style="height: 100%; width: 100%; display: none" />
                        <%-- </td>
                    <td style="height: 50%; width: 50%">
                        <iframe id="Iframe2" scrolling="no" src="" onload="Javascript:SetWinHeight(this)"
                            style="width: 100%" frameborder="0"></iframe>
                        <img id="MVKJG" src="#" onclick="Close3Img()" style="height: 100%; width: 100%; display: none" />
                    </td>--%>
                </tr>
                <tr>
                    <td colspan="2" style="height: 10px">
                    </td>
                </tr>
                <tr>
                    <td style="height: 50%; width: 50%">
                        <iframe id="url" scrolling="no" src="C3AlarmImg.aspx" style="width: 100%;" onload="Javascript:SetWinHeight(this)"
                            border="0"></iframe>
                        <img id="MP4QJ" src="#" onclick="Close3Img()" style="height: 100%; width: 100%; display: none" />
                    </td>
                    <td style="height: 50%; width: 50%">
                        <iframe id="Iframe3" scrolling="no" src="C3Bar.htm" onload="Javascript:SetWinHeight(this)"
                            style="width: 100%;" border="0"></iframe>
                        <img id="allimg" src="#" onmouseover="SuspendedAll()" onmouseout="ImgShufflingALL()"
                            onclick="allimgck()" style="height: 370px; width: 100%; display: none" />
                        <span id="imgtest" style="display: none"></span>
                    </td>
                </tr>
            </table>
        </div>
    </div>
</body>
</html>
