/**
 * 专门为模态框引入样式编写
 * 引入的样式应该是局部样式不能影响全局
 * Created by CDCT on 2018/1/25.
 */
$(window).on("load",function(){
    var wnd = window.top;
    var all =$("linkTop");
    var allTop=$(wnd.document).find("link");
    for(var i  = 0;i<all.length;i++){
        var BOOL=false;
        for(var q = 0;q<allTop.length;q++){
            if(allTop[q].getAttribute("href")==all[i].getAttribute("href")){
                BOOL=true;
            }
        }
        if(BOOL==false){
            var link=document.createElement("link");
            link.setAttribute("rel","stylesheet");
            link.setAttribute("href",all[i].getAttribute("href"));
            wnd.document.head.appendChild(link);
        }
    }
});