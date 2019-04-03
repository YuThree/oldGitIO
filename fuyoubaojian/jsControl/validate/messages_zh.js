(function( factory ) {
	if ( typeof define === "function" && define.amd ) {
		define( ["jquery", "../jquery.validate"], factory );
	} else {
		factory( jQuery );
	}
}(function( $ ) {
/*
 * Translated default messages for the jQuery validation plugin.
 * Locale: ZH (Chinese, 中文 (Zhōngwén), 汉语, 漢語)
 */
$.extend($.validator.messages, {
	required: "<span style='vertical-align: bottom;margin-right: 3px;margin-left: 3px;background-position:center;background-repeat:no-repeat;display:inline-block;width:16px;height:16px;'></span>这是必填项",
	remote: "<span style='vertical-align: bottom;margin-right: 3px;margin-left: 3px;background-position:center;background-repeat:no-repeat;display:inline-block;width:16px;height:16px;'></span>请修正此项",
	email: "<span style='vertical-align: bottom;margin-right: 3px;margin-left: 3px;background-position:center;background-repeat:no-repeat;display:inline-block;width:16px;height:16px;'></span>请输入有效的电子邮件地址",
	url: "<span style='vertical-align: bottom;margin-right: 3px;margin-left: 3px;background-position:center;background-repeat:no-repeat;display:inline-block;width:16px;height:16px;'></span>请输入有效的网址",
	date: "<span style='vertical-align: bottom;margin-right: 3px;margin-left: 3px;background-position:center;background-repeat:no-repeat;display:inline-block;width:16px;height:16px;'></span>请输入有效的日期",
	dateISO: "<span style='vertical-align: bottom;margin-right: 3px;margin-left: 3px;background-position:center;background-repeat:no-repeat;display:inline-block;width:16px;height:16px;'></span>请输入有效的日期 (YYYY-MM-DD)",
	number: "<span style='vertical-align: bottom;margin-right: 3px;margin-left: 3px;background-position:center;background-repeat:no-repeat;display:inline-block;width:16px;height:16px;'></span>请输入有效的数字",
	digits: "<span style='vertical-align: bottom;margin-right: 3px;margin-left: 3px;background-position:center;background-repeat:no-repeat;display:inline-block;width:16px;height:16px;'></span>只能输入数字",
	creditcard: "<span style='vertical-align: bottom;margin-right: 3px;margin-left: 3px;background-position:center;background-repeat:no-repeat;display:inline-block;width:16px;height:16px;'></span>请输入有效的信用卡号码",
	equalTo: "<span style='vertical-align: bottom;margin-right: 3px;margin-left: 3px;background-position:center;background-repeat:no-repeat;display:inline-block;width:16px;height:16px;'></span>你的输入不相同",
	extension: "<span style='vertical-align: bottom;margin-right: 3px;margin-left: 3px;background-position:center;background-repeat:no-repeat;display:inline-block;width:16px;height:16px;'></span>请输入有效的后缀",
	maxlength: $.validator.format("<span style='vertical-align: bottom;margin-right: 3px;margin-left: 3px;background-position:center;background-repeat:no-repeat;display:inline-block;width:16px;height:16px;'></span>最多可以输入 {0} 个字符"),
	rangelength: $.validator.format("<span style='vertical-align: bottom;margin-right: 3px;margin-left: 3px;background-position:center;background-repeat:no-repeat;display:inline-block;width:16px;height:16px;'></span>请输入长度在 {0} 到 {1} 之间的字符串"),
	minlength: $.validator.format("<span style='vertical-align: bottom;margin-right: 3px;margin-left: 3px;background-position:center;background-repeat:no-repeat;display:inline-block;width:16px;height:16px;'></span>最少要输入 {0} 个字符"),
	range: $.validator.format("<span style='vertical-align: bottom;margin-right: 3px;margin-left: 3px;background-position:center;background-repeat:no-repeat;display:inline-block;width:16px;height:16px;'></span>请输入范围在 {0} 到 {1} 之间的数值"),
	max: $.validator.format("<span style='vertical-align: bottom;margin-right: 3px;margin-left: 3px;background-position:center;background-repeat:no-repeat;display:inline-block;width:16px;height:16px;'></span>请输入不大于 {0} 的数值"),
	min: $.validator.format("<span style='vertical-align: bottom;margin-right: 3px;margin-left: 3px;background-position:center;background-repeat:no-repeat;display:inline-block;width:16px;height:16px;'></span>请输入不小于 {0} 的数值"),
	isZipCode:$.validator.format("<span style='vertical-align: bottom;margin-right: 3px;margin-left: 3px;background-position:center;background-repeat:no-repeat;display:inline-block;width:16px;height:16px;'></span>请输入正确的邮政编码")
	});
}));