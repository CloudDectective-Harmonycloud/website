


window.onload = function() {
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
    