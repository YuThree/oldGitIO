;(function(){
    function DN_ALL_FUN(){
        for(var i in ___$___){
            if(typeof ___$___[i]=="string"){
                window.eval(__$__.DN_SCRIPT(___$___[i]));
            }
        }
    }
    DN_ALL_FUN();
})();