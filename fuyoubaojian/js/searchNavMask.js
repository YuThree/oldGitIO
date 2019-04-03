/**
 * Created by CDCT on 2018/3/8.
 */

$.fn.maskFun=function(Obj){
    var defaultObj={
        forEle:"",
        maskEleClass:"maskEle"
    };
    function getParentNode(Obj, Arr) {
        if(!Arr) {
            var Arr = [];
        }
        Arr.push(Obj);

        if(Obj && Obj.parentNode) {
            getParentNode(Obj.parentNode, Arr);
        }

        return Arr;
    }
    $.extend(defaultObj,Obj);
    return $(this).each(function(){
        var newObj = {};
        newObj.ele=[];
        var THIS =this;
        newObj.remove=function(){
            for(var i = 0;i<newObj.ele.length;i++){
                $(newObj.ele[i]).remove()
            }
            newObj.ele=[];
        };
        newObj.addMask=function(){
            var allEle=null;
            if(defaultObj.forEle.indexOf("parent")==0){
                var arr= defaultObj.forEle.split("=>");

                switch (arr.length){
                    case 2:{
                        allEle = $(THIS.parentNode).find(arr[2]);
                        break
                    }
                    case 3:{
                        var path=getParentNode(THIS);
                        for(var w = 0;w<path.length;w++){
                            if($(path[w]).hasClass(arr[1])){
                                allEle = $(path[w]).find(arr[2]);
                            }
                        }
                        break;
                    }
                    case 4:{
                        var path=getParentNode(THIS);
                        for(var w = 0;w<path.length;w++){
                            if($(path[w]).hasClass(arr[1])){
                                allEle = $(path[w]).find(arr[2]);
                            }
                        }
                    }
                }
                if(arr.length!=3&&arr.length!=2&&arr.length!=4){
                    allEle = $(defaultObj.forEle);
                }
            }else{
                allEle = $(defaultObj.forEle);
            }
            if(!allEle.length){
                return;
            }
            for(var i=0;i<allEle.length;i++){
                var div = document.createElement("div");
                newObj.ele.push(div);
                allEle[i].parentNode.appendChild(div);
                div.setAttribute("class",defaultObj.maskEleClass);
                if(arr[3]==1){
                    $(div).css({
                        width:$(allEle[i]).outerWidth()+"px",
                        left:allEle[i].offsetLeft+"px"
                    })
                }
            }
        };
        $(this).on("change",function(){
            if(this.checked){
                newObj.remove();
            }else{
                newObj.addMask();
            }
        });
        if(this.checked){
            newObj.remove();
        }else{
            newObj.addMask();
        }
    });
};