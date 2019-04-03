<%@ page language="C#" autoeventwireup="true" inherits="Monitor_ImgTmp_C3AlarmImg, App_Web_njtp3nuj" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
    <link href="/Lib/bootstrap/css/bootstrap-cerulean.css" rel="stylesheet" type="text/css" />
    <link href="/Lib/kendo.dataviz/kendo.dataviz.min.css" rel="stylesheet" type="text/css" />
    <link href="/Lib/ymPrompt/skin/qq/ymPrompt.css" rel="stylesheet" type="text/css" />
    <link href="/Lib/bootstrap/css/opa-icons.css" rel='stylesheet' type="text/css" />
    <script src="/Lib/jquery-1.7.2/jquery-1.7.2.min.js" type="text/javascript"></script>
    <script src="/Lib/bootstrap/bootstrap-tab.js" type="text/javascript"></script>
    <script src="/Lib/kendo.dataviz/kendo.dataviz.min.js" type="text/javascript"></script>
    <script src="/Common/js/6cweb/MasterJs.js" type="text/javascript"></script>
    <script src="/C3/PC/MRTA/js/C3AlarmImg_big.js" type="text/javascript"></script>
    <script src="/Lib/jquery.elevatezoom-2.5.5/jquery.elevateZoom-2.5.5.min.js"  type="text/javascript"></script>
    <script src="/Lib/ymPrompt/ymPrompt.js" type="text/javascript"></script>
    <!--引用调后台方法JS-->
    <script src="/Common/js/6cweb/xmlHttpHelper.js" type="text/javascript"></script>
    <style type="text/css">
        #note
        {
            position: absolute;
            width: 170px;
            padding: 10px;
            background: #000000;
            border: 1px solid #ccc;
            left: 38%;
            z-index: 9999;
            display: none;
            filter: alpha(Opacity=60);
            -moz-opacity: 0.6;
            opacity: 1.0;
        }
        
         .nodiv 
        {
            
          text-align:center; margin-top:200px;
         color:White;
   font-family:微软雅黑;
   font-size:50px;
    -webkit-animation: neon1 1.5s ease-in-out infinite alternate;
  -moz-animation: neon1 1.5s ease-in-out infinite alternate;
  animation: neon1 1.5s ease-in-out infinite alternate; 
                
                }
                
                
                
                

/*glow for webkit*/
@-webkit-keyframes neon1 {
  from {
    text-shadow: 0 0 10px #fff,
               0 0 20px  #fff,
               0 0 30px  #fff,
               0 0 40px  #FF1177,
               0 0 70px  #FF1177,
               0 0 80px  #FF1177,
               0 0 100px #FF1177,
               0 0 150px #FF1177;
  }
  to {
    text-shadow: 0 0 5px #fff,
               0 0 10px #fff,
               0 0 15px #fff,
               0 0 20px #FF1177,
               0 0 35px #FF1177,
               0 0 40px #FF1177,
               0 0 50px #FF1177,
               0 0 75px #FF1177;
  }
}
    </style>
    <script>
        //初始化加载
        alarmid = "<%=alarmid%>";
        GIS_X = "<%=GIS_X%>";
        GIS_Y = "<%=GIS_Y%>";
        LINE_CODE = "<%=LINE_CODE%>";
        $(document).ready(function () {

            var _w = $(window).width() / 2;
            $('#hw').width(_w);
            $('#kjg').width(_w);

            document.getElementById("linechart").style.height = window.screen.height / 7 + "px";

            //            ImgShuffling();
            //            createLineChart();
            if (window.screen.height == 1200) {
                document.getElementById("hw").style.height = window.screen.height * 0.28 + "px";
                document.getElementById("kjg").style.height = window.screen.height * 0.28 + "px";
            } else {
                document.getElementById("hw").style.height = window.screen.height * 0.25 + "px";
                document.getElementById("kjg").style.height = window.screen.height * 0.25 + "px";
            }

           


            if (alarmid == '') {
                //没有数据
                $("body").html("<div class='nodiv'>暂无新上报数据</div>");
                return;
            }

            getAlarminfo(alarmid);
           
            setTimeout(sss, 5000);


            //            ImgNum = Imgjson.START_INDEX; //起始位置
            //            if (Imgjson.START_INDEX == 0) { imaCount = Imgjson.IRV_FRAME_NUM; }
            //            else { imaCount = Imgjson.IRV_FRAME_NUM + Imgjson.START_INDEX; }
            //            jpgCount = Imgjson.VI_FRAME_NUM//可见光总数



        })

        

        function sss() { 
            getAlarminfoAndGIS(alarmid, GIS_X, GIS_Y, "3C", LINE_CODE)
        }

    </script>
</head>
<body style="background: #000;">
    <%--<meta http-equiv="refresh" content="60">--%>
    <div class="row-fluid" style="background-color: #333333;">
        <div id="note" style="display: none">
            <a id="btn_openAllimg" href="#" style="color: White" onclick="ShowAllImg()"><span
                title="全景" class="icon32 icon-white icon-image"></span></a><a href="#" style="color: White"
                    onclick="upImg()"><span title="上一张" class="icon32 icon-white icon-arrowthick-w">
                    </span></a><a href="#" style="color: White" onclick="lastImg()"><span title="下一张"
                        class="icon32 icon-white icon-arrowthick-e"></span></a><a href="#" style="color: White"
                            onclick="ShowC3Form()"><span title="处理" class="icon32 icon-white icon-compose"></span>
                        </a><a href="#" style="color: White" onclick="out()"><span title="关闭" class="icon32 icon-white icon-cross">
                        </span></a>
        </div>
        <div class="carousel-inner">
            <div class="item">
                <img class="img-polaroid span6" style="margin: 0px;" src="#" id="hw" onclick="dbImgShuffling()" />
                <img class="img-polaroid span6" style="margin: 0px;" src="/Common/img/ImgTmp/C3KJG.png" id="kjg" data-zoom-image="/Common/img/ImgTmp/C3KJG.png" onclick="dbImgShuffling()" />
                <script>
                    $("#kjg").elevateZoom({ zoomWindowPosition: 11 });
                </script>
                <div class="tab-pane active carousel-caption" id="panel-6652">
                    <p id="locInfo">
                        <%-- 最高温度:<span id="zgwd"></span>℃&nbsp;环境温度:<span id="hjwd"></span>℃&nbsp;导高值:<span id="dgz"></span>mm&nbsp;拉出值:<span
                            id="lcz"></span>mm&nbsp;速度:<span id="sd"></span>km/h--%>
                    </p>
                </div>
            </div>
        </div>
        <div class="row-fluid">
            <div id="linechart" style="background: center no-repeat url('/Common/img/world-map.png');">
            </div>
        </div>
        <div class="row-fluid">
            <span id="locnametag" runat="server"></span>
        </div>
    </div>
    <span id="test" style="display: "></span><span id="test1" style="display: "></span>
</body>
</html>
