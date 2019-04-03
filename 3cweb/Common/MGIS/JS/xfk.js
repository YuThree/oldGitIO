//<title>JavaScript层拖动函数，很实用</title>
//<script type="text/javascript">
function getEvent() //同时兼容ie和ff的写法
{
    if (document.all) return window.event;
    func = getEvent.caller;
    while (func != null) {
        var arg0 = func.arguments[0];
        if (arg0) {
            if ((arg0.constructor == Event || arg0.constructor == MouseEvent) || (typeof (arg0) == "object" && arg0.preventDefault && arg0.stopPropagation)) {
                return arg0;
            }
        }
        func = func.caller;
    }
    return null;
}
//t是标题，msg是需要显示在窗口中的信息或者HTML代码
function drag_window(t, msg, w, h) {
    var top = 0, left = 0;
    var moveable = false;
    var msgw, msgh, titleheight, bordercolor;
    msgw = w; //窗口的宽度
    msgh = h; //窗口的高度
    titleheight = 18 //提示窗口标题高度
    bordercolor = "#336699"; //提示窗口的边框颜色
    t = "<span style='float:center'>" + t + "</span>";
    var msgObj = document.createElement("div");
    msgObj.setAttribute("id", "msgObj");
    msgObj.style.background = "white";
    msgObj.style.border = "1px solid " + bordercolor;
    msgObj.style.position = "absolute";
    msgObj.style.width = msgw + "px";
    msgObj.style.height = msgh + "px";
    msgObj.style.zIndex = "1000";
    var title = document.createElement("div");
    title.setAttribute("id", "msgTitle");
    title.setAttribute("align", "center");
    title.style.margin = "0";
    title.style.padding = "3px";
    title.style.background = "white";
    title.style.filter = "progid:DXImageTransform.Microsoft.Alpha(startX=20, startY=20, finishX=100, finishY=100,style=1,opacity=75,finishOpacity=100);";
    title.style.opacity = "0.75";
    title.style.border = "1px solid " + bordercolor;
    title.style.height = titleheight + "px";
    title.innerHTML = t;

    var msgdiv = document.createElement("div");
    msgdiv.setAttribute("id", "msgdiv");
  //  msgdiv.innerHTML = msg;
    msgdiv.style.height = (h - titleheight) + "px";
    msgdiv.style.width = w + "px";
    msgdiv.setAttribute("align", "center");
  
   // margin-top: 5px; text-align: center; width: 200px; height: 100px
    //	var close_button=document.createElement("span");
    //	close_button.setAttribute("id","msgClose");
    //	close_button.style.padding="2px";
    //    close_button.style.border="1px outset " ;
    //    close_button.style.color="white";
    //    close_button.style.cursor="pointer";
    //close_button.innerHTML = "关闭";
    //	close_button.onclick=function()
    //	{
    //		document.getElementById("msgTitle").removeChild(close_button);
    //		document.getElementById("msgDiv").removeChild(title);
    //		document.getElementById("msgDiv").removeChild(msgdiv);
    //		document.body.removeChild(msgObj);
    //    }

    title.onmousedown = function () {
        var e = getEvent();
        if (document.all) {
            document.getElementById("msgTitle").setCapture();
        }
        else {
            window.captureEvents(Event.MOUSEMOVE | Event.MOUSEUP);
        }
        document.getElementById("msgTitle").style.cursor = "move";
        var x = document.all ? e.clientX : e.pageX;
        var y = document.all ? e.clientY : e.pageY;
        left = parseInt(document.getElementById("msgObj").style.left);
        top = parseInt(document.getElementById("msgObj").style.top);
        moveable = true;
        document.onmousemove = function () {
            if (moveable) {
                var e = getEvent();
                var chat_window = document.getElementById("msgObj");
                var newleft = left + (document.all ? e.clientX : e.pageX) - x;
                var maxleft = (parseInt(document.body.clientWidth) - parseInt(chat_window.style.width));
                var newtop = top + (document.all ? e.clientY : e.pageY) - y;
                var maxtop = (parseInt(document.body.clientHeight) - parseInt(chat_window.style.height));
                chat_window.style.left = (newleft > 0 && newleft < maxleft ? newleft : (newleft > 0 ? maxleft : 0)) + "px";
                chat_window.style.top = (newtop > 0 && newtop < maxtop ? newtop : (newtop > 0 ? maxtop : 0)) + "px";
            }
        };
        document.onmouseup = function () {
            if (moveable) {
                if (document.all) {
                    document.getElementById("msgTitle").releaseCapture();
                }
                else {
                    window.captureEvents(Event.MOUSEMOVE | Event.MOUSEUP);
                }
                document.getElementById("msgTitle").style.cursor = "default";
                moveable = false;
            }
        };
    };
    document.body.appendChild(msgObj);
    document.getElementById("msgObj").appendChild(title);
    document.getElementById("msgObj").appendChild(msgdiv);
    document.getElementById("msgdiv").appendChild(msg);
    return msgObj;
}
//</script>
//<a href="#" onClick="drag_window('标题栏','这是一个可拖动的层',300,200,100,100)">创建拖动层</a>
//<pre>
//函数说明：drah_window(t,msg)
// t ：拖动层的标题
// msg ：拖动层的内容，可以为HTML
// w：    拖动层宽度
// h ：  拖动层高度
// x,y ：拖动层弹出时初始位置
//</pre>
