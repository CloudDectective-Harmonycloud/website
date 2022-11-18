/** Custom scripts */

window.onload = function() {
    const innerWidth = window.innerWidth;
    if (innerWidth <= 980) {
        // 关闭联系我们二维码按钮
        document.getElementsByClassName('close').click(function (event) {
            document.getElementsByClassName('contact_content').style('display', 'none');
            event.stopPropagation();
        });
    }
    // 鼠标悬浮在contact上时显示二维码
    if (document.getElementsByClassName('contact')) {
        document.getElementsByClassName('contact')[0].addEventListener('mouseenter', function() {
            document.getElementsByClassName('contact_content')[0].style.display = 'block';
        });
        // 鼠标离开contact上时不显示二维码
        document.getElementsByClassName('contact')[0].addEventListener('mouseout', function () {
            document.getElementsByClassName('contact_content')[0].style.display = 'none';
        });
    }

    // var videoDom = document.getElementById('camera_video');
    // var playDom = document.getElementById('play_icon');
    // playDom.addEventListener('click', function() {
    //     videoDom.play();
    // }, false);
    // videoDom.addEventListener('play', function () { //结束
    //     // let dom = document.getElementById('camera');
    //     // dom.className = 'full-video';
    //     playDom.className = 'hide';
    // }, false);
    // videoDom.addEventListener('ended', function () { //结束
    //     // let dom = document.getElementById('camera');
    //     // dom.className = 'why_img1_1';
    //     playDom.className = 'show';
    // }, false);

    // document.getElementById('video-close').addEventListener('click', function() {
    //     let dom = document.getElementById('camera');
    //     dom.className = 'why_img1_1';
    // }, false)
}
