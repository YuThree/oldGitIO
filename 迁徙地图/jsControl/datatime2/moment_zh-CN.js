moment.locale('zh-CN', {
    months : "一月_二月_三月_四月_五月_六月_七月_八月_九月_十月_十一月_十二月".split("_"),
    monthsShort : "一月_二月_三月_四月_五月_六月_七月_八月_九月_十月_十一月_十二月".split("_"),
    weekdays : "星期日_星期一_星期二_星期三_星期四_星期五_星期六".split("_"),
    weekdaysShort : "星期日_星期一_星期二_星期三_星期四_星期五_星期六".split("_"),
    weekdaysMin : "周日_周一_周二_周三_周四_周五_周六".split("_"),
    longDateFormat : {
        LT : "HH:mm",
        LTS : "HH:mm:ss",
        L : "DD/MM/YYYY",
        LL : "D MMMM YYYY",
        LLL : "D MMMM YYYY LT",
        LLLL : "dddd D MMMM YYYY LT"
    },
    calendar : {
        sameDay : '[Today at] LT',
        nextDay : '[Tomorrow at] LT',
        nextWeek : 'dddd [at] LT',
        lastDay : '[Yesterday at] LT',
        lastWeek : '[Last] dddd [at] LT',
        sameElse : 'L'
    },
    fromLabel:"从",
    toLabel:"到",
    applyLabel:"确认",
    cancelLabel:"取消",
    relativeTime : {
    	future : "in %s",
        past : "%s ago",
        s : "a few seconds",
        m : "a minute",
        mm : "%d minutes",
        h : "an hour",
        hh : "%d hours",
        d : "a day",
        dd : "%d days",
        M : "a month",
        MM : "%d months",
        y : "a year",
        yy : "%d years"
    },
    week : {
        dow : 1, // Monday is the first day of the week.
        doy : 4  // The week that contains Jan 4th is the first week of the year.
    }
});