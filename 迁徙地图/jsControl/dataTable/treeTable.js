/**
 * Created by CDCT on 2018/4/3.
 */
function trInfo(tr,con,ele,e){
    trInfo.callBack&&trInfo.callBack(tr,con,ele,e);
    function getParentNode(Obj,Arr){
        if(!Arr){
            var Arr=[];
        }
        Arr.push(Obj);

        if(Obj&&Obj.parentNode){
            getParentNode(Obj.parentNode,Arr);
        }
        return Arr;
    }
    function getParentClass(eleO,className){
        var path = getParentNode(eleO);
        for(var i =0;i<path.length;i++){
            if($(path[i]).hasClass(className)){
                return path[i];
            }
        }
        return null;
    }
    var tg = e.target? e.target: e.srcElement;
    tg=getParentClass(tg,"showTableTd");
    if(tg==null)return;
    var allEle=$(ele).find(">.showTableTd");
    var eleIndex  = allEle.index(tg);
    if(eleIndex!=trInfo.triggerIndex)return;

    function eleInArr(ele2){
        var path = getParentNode(ele2);
        for(var i = 0;i<path.length;i++){
            if(trInfo.eleArr.indexOf(path[i])!=-1){
                return path[i]
            }
        }
        return null;
    }
    function arrIndexOf(arr,Ov){
        for(var i =0;i<arr.length;i++){
            if(arr[i].grade==Ov){
                return i;
            }
        }
        return -1;
    }
    function setStausFalse(Obj){
        if(Obj.childTObj){
            setStausFalse(Obj.childTObj);
        }
        Obj.showTableA=false;
    }
    var eleP =null;
    if(tr.grade==1){
        trInfo.eleArr.push(ele);
        if(!ele.tableObjArr){
            ele.tableObjArr = [];
        }
        eleP=ele;
    }else{
        eleP=eleInArr(ele);
    }
    if(eleP==null)return console.log("error:未知错误");
    if(typeof tr.child!="undefined"){
        var index= arrIndexOf(eleP.tableObjArr,tr.child.data[0].grade);
        var index2=arrIndexOf(eleP.tableObjArr,tr.grade);
        if(index!=-1){
            var ts = eleP.tableObjArr[index];
            if(ts.showTableA==true){
                setStausFalse(ts);
                ts.ele.remove();
            }else{
                ts.ele.remove();
                ts.showTable(ele);
                ts.scrollBody.css({
                    minHeight:"auto"
                });
                ts.showTableA=true;
                ts.initEvent();
            }
        }else{
            var option = {
                edit:false,
                isStopPro:true,
                data:tr.child.data,
                widthInfo:tr.child.widthInfo?tr.child.widthInfo:[],
                clickTr:true,
                selectTr:trInfo,
                title:tr.child.title,
                scrollBody:false,
                getTdCallback:trInfo.getTdCallback,
                isTitle:false
            };

            var ds=$(ele).showTable(option);
            ds.grade=tr.child.data[0].grade;
            ds.showTableA=true;
            ds.scrollBody.css({
                minHeight:"auto"
            });
            if(index2!=-1){
                eleP.tableObjArr[index2].childTObj=ds;
            }
            eleP.tableObjArr.push(ds);
        }

    }
}
trInfo.eleArr = [];
trInfo.triggerCSS={textAlign:"left"};
trInfo.triggerPl=30;
trInfo.triggerIndex =0;
trInfo.triggerPC=5;
trInfo.callBack = function(){

  };
  trInfo.getTdCallback=function(O,ele){
    if(typeof O.trInt!="undefined"){
   
        if(O.wdNumber==trInfo.triggerIndex){

            var g=typeof O.option.data[O.trInt].grade!="undefined"?O.option.data[O.trInt].grade:0;
            trInfo.triggerCSS.paddingLeft=(g-1)*trInfo.triggerPC+trInfo.triggerPl+"px";
            ele.css(trInfo.triggerCSS);
        }
    
    }
  
  }