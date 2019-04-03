/**
 *  validate 新增验证
 */
/*邮政编码验证*/
jQuery.validator.addMethod("isZipCode", function(value, element,v) {
	if(value==""||value==null){
		return true;
	}
	var tel = /^[0-9]{6}$/;
    return tel.test(value);
}, $.validator.format("<span style='vertical-align: bottom;margin-right: 3px;margin-left: 3px;background-position:center;background-repeat:no-repeat;display:inline-block;width:16px;height:16px;background-image:url('error.png')'></span>请正确填写您的邮政编码"));
/*人名验证*/
jQuery.validator.addMethod("userName", function(value, element,v) {
	if(value==""||value==null){
		return true;
	}
	var tel = /^[a-zA-Z\u4e00-\u9fa5\.\s]{1,10}$/;
    return tel.test(value);
}, $.validator.format("<span style='vertical-align: bottom;margin-right: 3px;margin-left: 3px;background-position:center;background-repeat:no-repeat;display:inline-block;width:16px;height:16px;'></span>请输入正确的人名"));
/*身份证验证*/
jQuery.validator.addMethod("idCard", function(value, element,v) {
	if(value==""||value==null){
		return true;
	}
	var tel = /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/;
    return tel.test(value);
}, $.validator.format("<span style='vertical-align: bottom;margin-right: 3px;margin-left: 3px;background-position:center;background-repeat:no-repeat;display:inline-block;width:16px;height:16px;'></span>请输入正确的身份证号码"));
/*手机号码验证*/
jQuery.validator.addMethod("phoneNumber", function(value, element,v) {
	if(value==""||value==null){
		return true;
	}
    var tel = /^1{1}[2-9]{1}[0-9]{9}$/;
    return tel.test(value);
}, $.validator.format("<span style='vertical-align: bottom;margin-right: 3px;margin-left: 3px;background-position:center;background-repeat:no-repeat;display:inline-block;width:16px;height:16px;'></span>请输入正确的手机号码"));
/*座机号码验证*/
jQuery.validator.addMethod("landNumber", function(value, element,v) {
	if(value==""||value==null){
		return true;
	}
	var tel = /^0[0-9]{2,3}\-[0-9]{8}$/;
    return tel.test(value);
}, $.validator.format("<span style='vertical-align: bottom;margin-right: 3px;margin-left: 3px;background-position:center;background-repeat:no-repeat;display:inline-block;width:16px;height:16px;'></span>请输入正确的座机号码"));
/*验证年龄*/
jQuery.validator.addMethod("age", function(value, element,v) {
	if(value==""||value==null){
		return true;
	}
	if(value>=1&&value<=150){
		if((value.length&&value[0])==" "||(value.length&&value[value.length-1]==" ")){
			return false;
		}
		return true;
	}else{
		return false;
	}
}, $.validator.format("<span style='vertical-align: bottom;margin-right: 3px;margin-left: 3px;background-position:center;background-repeat:no-repeat;display:inline-block;width:16px;height:16px;'></span>请确认年龄格式且数字为(1-150)"));
//submitHandler 成功触发的函数
//
jQuery.validator.addMethod("QQnumber", function(value, element,v) {
	if(value==""||value==null){
		return true;
	}
	var tel = /^[0-9]{6,10}$/;
    return tel.test(value);
}, $.validator.format("<span style='vertical-align: bottom;margin-right: 3px;margin-left: 3px;background-position:center;background-repeat:no-repeat;display:inline-block;width:16px;height:16px;'></span>请确认年龄格式且数字为(1-150)"));
jQuery.validator.addMethod("passwordNew", function(value, element,v) {
	var YW=/^[a-zA-Z]+[\d]+$|^[\d]+[a-zA-Z]+$/;
	if(value.length<8){
		return false;
	}else if(YW.test(value)){
		return true;
	}else{
		return false;
	}
}, $.validator.format("<span style='vertical-align: bottom;margin-right: 3px;margin-left: 3px;background-position:center;background-repeat:no-repeat;display:inline-block;width:16px;height:16px;'></span>请输入正确的密码格式(英文+数字)"));
jQuery.validator.addMethod("CSDATE", function(value, element,v) {
	if(value==""||value==null){
		return true;
	}
	
//	var tel = /(^[0-9]{4}\-((0[1-9])|(1[0-2]))\-((0[1-9])|([12][0-9])|(3[0-1]))$)/;
	var tel = /^(?:(?!0000)[0-9]{4}-(?:(?:0[1-9]|1[0-2])-(?:0[1-9]|1[0-9]|2[0-8])|(?:0[13-9]|1[0-2])-(?:29|30)|(?:0[13578]|1[02])-31)|(?:[0-9]{2}(?:0[48]|[2468][048]|[13579][26])|(?:0[48]|[2468][048]|[13579][26])00)-02-29)$/;
    return tel.test($.trim(value));
}, $.validator.format("<span style='vertical-align: bottom;margin-right: 3px;margin-left: 3px;background-position:center;background-repeat:no-repeat;display:inline-block;width:16px;height:16px;'></span>请正确输入日期格式YYYY-MM-DD"));
jQuery.validator.addMethod("cardNum", function(value, element,v) {
	var YW=/^[a-zA-Z0-9]+$/;

	if(value==""||value==null){
		return true;
	}
    return YW.test(value);
}, $.validator.format("<span style='vertical-align: bottom;margin-right: 3px;margin-left: 3px;background-position:center;background-repeat:no-repeat;display:inline-block;width:16px;height:16px;'></span>请输入正确的数据格式(英文+数字)"));
