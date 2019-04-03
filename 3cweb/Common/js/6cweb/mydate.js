/** 
* 获取本周、本季度、本月、上月的开端日期、停止日期 
*/
var now = new Date(); //当前日期 
var nowDayOfWeek = now.getDay(); //今天本周的第几天 
var nowDay = now.getDate(); //当前日 
var nowMonth = now.getMonth(); //当前月 
var nowYear = now.getYear(); //当前年 
nowYear += (nowYear < 2000) ? 1900 : 0; // 

var lastMonthDate = new Date(); //上月日期 
lastMonthDate.setDate(1);
lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);
var lastYear = lastMonthDate.getYear();
var lastMonth = lastMonthDate.getMonth();

//替换字符串  
function Replace(str, from, to) {
    return str.split(from).join(to);
}

//js日期字符串转换成日期类型
function parseDate(dateStr) {
    return new Date(Replace(dateStr, "-", "/"));
}

//增加月  

function AddMonths(date, value) {
    date.setMonth(date.getMonth() + value);
    return date;
}

//增加天
function AddDays(date, value) {

    date.setDate(date.getDate() + value);

    return date;

}

//增加时

function AddHours(date, value) {

    date.setHours(date.getHours() + value);

    return date;

}

//增加分

function AddMinutes(date, value) {

    date.setMinutes(date.getMinutes() + value);

    return date;

}

//增加秒

function AddSeconds(date, value) {

    date.setSeconds(date.getSeconds() + value);

    return date;

}

//增加年

function AddYears(date, value) {

    date.setFullYear(date.getFullYear() + value);

    return date;

}

function getthedate(dd, dadd) {
    //可以加上错误处理
    var a = new Date(dd)
    a = a.valueOf()
    a = a + dadd * 24 * 60 * 60 * 1000
    a = new Date(a);
    var m = a.getMonth() + 1;
    if (m.toString().length == 1) {
        m = '0' + m;
    }
    var d = a.getDate();
    if (d.toString().length == 1) {
        d = '0' + d;
    }
    return a.getFullYear() + "-" + m + "-" + d;
}

//格局化日期：yyyy-MM-dd 
function formatDate(date) {
    var myyear = date.getFullYear();
    var mymonth = date.getMonth() + 1;
    var myweekday = date.getDate();

    if (mymonth < 10) {
        mymonth = "0" + mymonth;
    }
    if (myweekday < 10) {
        myweekday = "0" + myweekday;
    }
    return (myyear + "-" + mymonth + "-" + myweekday);
}

//获得某月的天数 
function getMonthDays(myMonth) {
    var monthStartDate = new Date(nowYear, myMonth, 1);
    var monthEndDate = new Date(nowYear, myMonth + 1, 1);
    var days = (monthEndDate - monthStartDate) / (1000 * 60 * 60 * 24);
    return days;
}

//获得本季度的开端月份 
function getQuarterStartMonth() {
    var quarterStartMonth = 0;
    if (nowMonth < 3) {
        quarterStartMonth = 0;
    }
    if (2 < nowMonth && nowMonth < 6) {
        quarterStartMonth = 3;
    }
    if (5 < nowMonth && nowMonth < 9) {
        quarterStartMonth = 6;
    }
    if (nowMonth > 8) {
        quarterStartMonth = 9;
    }
    return quarterStartMonth;
}

//获得本周的开端日期 
function getWeekStartDate() {
    var weekStartDate = new Date(nowYear, nowMonth, nowDay - nowDayOfWeek);
    return formatDate(weekStartDate);
}

//获得本周的停止日期 
function getWeekEndDate() {
    var weekEndDate = new Date(nowYear, nowMonth, nowDay + (6 - nowDayOfWeek));
    return formatDate(weekEndDate);
}

//获得本月的开端日期 
function getMonthStartDate() {
    var monthStartDate = new Date(nowYear, nowMonth, 1);
    return formatDate(monthStartDate);
}

//获得本月的停止日期 
function getMonthEndDate() {
    var monthEndDate = new Date(nowYear, nowMonth, getMonthDays(nowMonth));
    return formatDate(monthEndDate);
}

//获得上月开端时候 
function getLastMonthStartDate() {
    var lastMonthStartDate = new Date(nowYear, lastMonth, 1);
    return formatDate(lastMonthStartDate);
}

//获得上月停止时候 
function getLastMonthEndDate() {
    var lastMonthEndDate = new Date(nowYear, lastMonth, getMonthDays(lastMonth));
    return formatDate(lastMonthEndDate);
}

//获得本季度的开端日期 
function getQuarterStartDate() {

    var quarterStartDate = new Date(nowYear, getQuarterStartMonth(), 1);
    return formatDate(quarterStartDate);
}

//或的本季度的停止日期 
function getQuarterEndDate() {
    var quarterEndMonth = getQuarterStartMonth() + 2;
    var quarterStartDate = new Date(nowYear, quarterEndMonth, getMonthDays(quarterEndMonth));
    return formatDate(quarterStartDate);
}

/*/*
 * @desc 获取日期段
 * @param sTimeId：开始时间元素id；eTimeId：结束时间元素id；value：天数（1：表示在当前日期上加一天；-1：表示在当前日期上减一天；空：表示当前日期）
 * @return 日期
 */
function getDatePeriod(sTimeId, eTimeId, value, isShowHour) {
    var temp_stime = ' 00:00:00';
    var temp_etime = ' 23:59:59';
    if (undefined !== isShowHour && 'hide' === isShowHour) {
        temp_stime = '';
        temp_etime = '';
    }
    var nowDate = new Date(); //当前日期
    var startTime; //开始时间
    if (undefined !== value && 'undefined' !== value && '' !== value && null !== value && 0 !== value) {
        var beforeTime = AddDays(nowDate, value);
        startTime = beforeTime.format('yyyy-MM-dd');
    } else {
        startTime = nowDate.format('yyyy-MM-dd');
    }
    var endTime = new Date().format('yyyy-MM-dd'); //结束时间
    if (undefined !== sTimeId && 'undefined' !== sTimeId && '' !== sTimeId && null !== sTimeId) {
        $(sTimeId).attr('value', startTime + temp_stime);
    }
    if (undefined !== eTimeId && 'undefined' !== eTimeId && '' !== eTimeId && null !== eTimeId) {
        $(eTimeId).attr('value', endTime + temp_etime);
    }
}

//使用：
//var now = new Date();
//var nowStr = now.format("yyyy-MM-dd hh:mm:ss");
Date.prototype.format = function (format) {
    var o = {
        "M+": this.getMonth() + 1, //month 
        "d+": this.getDate(), //day 
        "h+": this.getHours(), //hour 
        "m+": this.getMinutes(), //minute 
        "s+": this.getSeconds(), //second 
        "q+": Math.floor((this.getMonth() + 3) / 3), //quarter 
        "S": this.getMilliseconds() //millisecond 
    }

    if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }

    for (var k in o) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
        }
    }
    return format;
} 