function changeZoomImg(ImgID,s_img, big_img) {
    myInstance = $('#' + ImgID).data('CloudZoom');
    $('#' + ImgID).attr('src', s_img)
    myInstance.loadImage(s_img, big_img);
}

function createZoom(ImgID, s_img, big_img) {



    var myInstance = $('#' + ImgID).data('CloudZoom');
    if (myInstance != undefined) {
        myInstance.destroy();
    }

    var options = {
        zoomImage: big_img,
        //   zoomSizeMode: 'image',      
        animationTime: 0,
        easeTime: 0,
        easing:0,
        tintOpacity:0,
        zoomPosition: 4,
        zoomOffsetX: 0,
        zoomOffsetY: 0,
        zoomWidth: $(window).width()/2-20,
        zoomHeight: $(window).height() / 2 - 10
    };

    $('#' + ImgID).attr('src', s_img);
    $('#' + ImgID).CloudZoom(options);

}