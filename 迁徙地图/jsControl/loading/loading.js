
function Loading(){
	var url = 'http://192.168.200.137:82/决策分析管理系统/jsControl/loading/loading.gif';
	this.el  = '<div class="loading" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 200; background: rgba(0,0,0,.5) url('+ url+') no-repeat center; background-size: 150px;"></div>'
	this.open  = function(){
		$(window.parent.document.body).append(this.el);
	}
	this.close = function(){
		$(this.el).remove();
	}
}
