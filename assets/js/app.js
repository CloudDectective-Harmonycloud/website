/** Custom scripts */

document.addEventListener('readystatechange', () => console.log('readyState', document.readyState));

window.onload = function() {
    console.log('onload');
    const innerWidth = window.innerWidth;
    if (innerWidth <= 980) {
        // 关闭联系我们二维码按钮
        document.getElementsByClassName('close').click(function (event) {
            document.getElementsByClassName('contact_content').css('display', 'none');
            event.stopPropagation();
        });
    }
    // 鼠标悬浮在contact上时显示二维码
    document.getElementsByClassName('contact').hover(function () {
        document.getElementsByClassName('contact_content').css('display', 'block');
    })
    // 鼠标离开contact上时不显示二维码
    document.getElementsByClassName('contact').mouseout(function () {
        document.getElementsByClassName('contact_content').css('display', 'none');
    })
}

    // $(document).ready(function () {
    //     $("body").flowUp(".index_text", { transalteY: 350, duration: 1.2 });
    //     $("body").flowUp(".index_img", { transalteY: 350, duration: 1.2 });
    //     $("body").flowUp("header", { transalteY: 350, duration: 1.2 });
    //     $("body").flowUp(".why_content1", { transalteY: 350, duration: 1.2 });
    //     $("body").flowUp(".why_content2", { transalteY: 350, duration: 1.2 });
    //     $("body").flowUp(".why_main2", { transalteY: 350, duration: 1.2 });
    //     $("body").flowUp(".who_main", { transalteY: 350, duration: 1.2 });
    //     // 因为iframe嵌套 反正自带全屏api是都用不了
    //     var playfullScreen = function (videoDom) {
    //         if (videoDom.requestFullscreen) {
    //             return videoDom.requestFullscreen();
    //         } else if (videoDom.webkitRequestFullScreen) {
    //             return videoDom.webkitRequestFullScreen();
    //         } else if (videoDom.mozRequestFullScreen) {
    //             return videoDom.mozRequestFullScreen();
    //         } else if (videoDom.msRequestFullscreen) {
    //             return videoDom.msRequestFullscreen();
    //         }
    //     };

    //     var videoDom = document.getElementById('camera_video');
    //     var playDom = document.getElementById('play_icon');
    //     playDom.addEventListener('click', function() {
    //         videoDom.play();
    //     }, false);
    //     // videoDom.addEventListener('click', function() {
    //     //     // console.log('点击视频了', videoDom);
    //     //     // if (videoDom.paused) {
    //     //     //     // 线上要用videoDom.play(); 才可以播放，本地要用videoDom.onplay();
    //     //     //     videoDom.play();
    //     //     // } else {
    //     //     //     videoDom.pause();
    //     //     // }
    //     // });
    //     videoDom.addEventListener('play', function () { //结束
    //         console.log('播放开始');
    //         let dom = document.getElementById('camera');
    //         dom.className = 'full-video';
    //         playDom.className = 'hide';
    //     }, false);
    //     videoDom.addEventListener('ended', function () { //结束
    //         console.log('播放结束');
    //         let dom = document.getElementById('camera');
    //         dom.className = 'why_img1_1';
    //         playDom.className = 'show';
    //         // if (isFullscreen()) { // 全屏
    //         //     exitFullScreen();
    //         // }
    //     }, false);

    //     document.getElementById('video-close').addEventListener('click', function() {
    //         let dom = document.getElementById('camera');
    //         dom.className = 'why_img1_1';
    //     }, false)
    // });