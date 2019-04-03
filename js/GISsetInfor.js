


//播放
function JSSms(delay) {

    clearInterval(setSmsshow);
    //var showtime = 1; //刷新时间
    setSmsshow = setInterval('SetC3Sms()', delay);

}

$(function () {
    Setslider(50)
})