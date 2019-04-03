// 区域联动
var o = $("#regional").areaObj();

function addHead(json,str){
    str=str||json[0].name;
    var ele = o.addHeaderItem(str);
    $.each(json,function(){
        ele.childInfo =this;
        ele.on("click",function(){
            o.removeHeadItemAfterAll(ele.protoId);
            o.removeContent();
            if(ele.childInfo.child&&ele.childInfo.child.length){
                $.each(ele.childInfo.child,function(){
                   var eles = o.addContentItem(this.name);
                    var THIS = this;
                    eles.on("click",function(e){
                        e.stopPropagation();
                        o.removeContent();
                        if(THIS.child&&THIS.child.length){
                            addHead([THIS],THIS.name);
                        }else{
                            var str = "";
                            $.each(o.headItemArr,function(){
                                str+=this.html();
                            })
                            $("#regional").html(str);
                            o.close();

                        };
                        
                    });
                });
            }
        });
        if(this.child&&this.child.length){
            $.each(ele.childInfo.child,function(){
                var eles = o.addContentItem(this.name);
                var THIS = this;
                eles.on("click",function(e){
                    e.stopPropagation();
                    o.removeContent();
                    if(THIS.child&&THIS.child.length){
                        addHead([THIS],THIS.name);
                    }else{
                            var str = "";
                            $.each(o.headItemArr,function(){
                                console.log(this.attr('class'))
                                str+=this.html();
                            })
                            $("#regional").html(str);
                            o.close();
                    };
                    
                });
            });
        }
    });
}
var json = [
    {
        name:"全国",
        child:testJson
    }
];
addHead(json);


// 时间联动

var sd = $("#time").timeProto();
//下拉
$(".cdct_select").each(function (index, element) {
    $(element).simulationSelect({
        selectText: '{a}<span class="selectDown"></span>'
    });
})

