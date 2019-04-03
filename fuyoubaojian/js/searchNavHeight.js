/**
 * Created by CDCT on 2018/3/8.
 */
(function(){
    $(window).on("load",function(e){
        var config = window.navSearchConfig||{
                navBoxSelectStr:".searchNav .contentBox",
                navPrentBoxSelectStr:".searchNav",
                btnSelectStr:".searchNav .btnClass",
                rowHeight:68,
                rowHeightTwo:118,
                tablePCheight:198,
                btnSelectParentStr:".searchNav .btnClass .btnParentClass",
                lineASelectStr:".searchNav .lineA",
                lineBSelectStr:".searchNav .lineB",
                moreSelectStr:".searchNav .moreInfo",
                lineSelectStr:"",
                tableSelectStr:".tablMainOne",
                txt:"{A}更多"
            };
        function fun(){
            var navBox = $(config.navBoxSelectStr);
            var navPrentBox = $(config.navPrentBoxSelectStr);
            var tableBox=$(config.tableSelectStr);
            var moreBox=$(config.moreSelectStr);
            var btnBox = $(config.btnSelectStr);
            var btnBoxParent = $(config.btnSelectParentStr);
            var lineAbox=$(config.lineASelectStr);
            var lineBbox=$(config.lineBSelectStr);
            moreBox.css({
                display:"none"
            })
            navBox.css({
                height:"auto",
                overflow:""
            });
            var bufObj={
                h1:navBox.outerHeight(),
                h2:navPrentBox.outerHeight()
            };

            var row = 1;

            if(bufObj.h1>config.rowHeight&&bufObj.h1<config.rowHeightTwo){
                row=2;
            }else if(bufObj.h1<=config.rowHeight){
                row=1;
            }else if(bufObj.h1>=config.rowHeightTwo){
                row=3;
            }

            if(row==1){
                navBox.css({
                    paddingBottom:"0"
                });
                tableBox.css({
                    height:"calc(100% - "+(config.tablePCheight)+"px)"
                });
                lineAbox.css({
                    display:"none"
                })
            }else{
                navBox.css({
                    paddingBottom:"13px"
                });
                tableBox.css({
                    height:"calc(100% - "+(config.tablePCheight+config.rowHeightTwo-config.rowHeight)+"px)"
                });
                lineAbox.css({
                    display:"block"
                })
            }
            if(row==3){
                moreBox.css({
                    display:"block"
                });
                navBox.css({
                    height:config.rowHeightTwo+1+"px",
                    overflow:"hidden",
                    borderBottom:""
                });
                moreBox.attr("isShow","0");
            }else{
                moreBox.css({
                    display:"none"
                });
                navBox.css({
                    height:"auto",
                    borderBottom:"",
                    overflow:""
                });
            }
            navPrentBox.css({
                height:navBox.outerHeight()+1+"px"
            });
            btnBox.css({
                height:navBox.outerHeight()+"px",
                borderBottom:""
            });
            btnBoxParent.css({   height:navBox.outerHeight()+"px",
                borderBottom:""});
            lineBbox.css({
                display:"none"
            });
            tableBox[0].showTableObj&&tableBox[0].showTableObj.heightSy&&tableBox[0].showTableObj.heightSy();
            moreBox.find(".txt").html(config.txt.replace("{A}","显示"));
        }
        var moreBox=$(config.moreSelectStr);
        moreBox.on("click",function(){
            var navBox = $(config.navBoxSelectStr);
            var navPrentBox = $(config.navPrentBoxSelectStr);
            var lineAbox=$(config.lineASelectStr);
            var lineBbox=$(config.lineBSelectStr);
            var btnBoxParent = $(config.btnSelectParentStr);
            var btnBox = $(config.btnSelectStr);
                if(!this.getAttribute("isShow")||this.getAttribute("isShow")==0){
                    this.setAttribute("isShow","1");
                    navBox.css({
                        height:"auto",
                        overflow:"",
                        borderBottom:"1px solid #e6eaee"
                    });
                    btnBox.css({
                        borderBottom:"1px solid #e6eaee"
                    });

                    lineBbox.css({
                        display:"block"
                    });
                    moreBox.find(".txt").html(config.txt.replace("{A}","收起"));
                }else{
                    this.setAttribute("isShow","0");
                    navBox.css({
                        height:config.rowHeightTwo+1+"px",
                        overflow:"hidden",
                        borderBottom:""
                    });
                    btnBox.css({
                        borderBottom:""
                    });

                    lineBbox.css({
                        display:"none"
                    });
                    moreBox.find(".txt").html(config.txt.replace("{A}","显示"));
                }
                navPrentBox.css({
                    height:navBox.outerHeight()+1+"px"
                });
                btnBox.css({
                    height:navBox.outerHeight()+"px"
                });

        });
        $(window).on("resize",fun);
        fun();

    });
})();