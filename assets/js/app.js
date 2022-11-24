/** Custom scripts */

window.onload = function() {
    const innerWidth = window.innerWidth;
    if (innerWidth <= 980) {
        // 关闭联系我们二维码按钮
        // document.getElementsByClassName('close').click(function (event) {
        //     document.getElementsByClassName('contact_content').style('display', 'none');
        //     event.stopPropagation();
        // });
        document.getElementsByClassName('contact')[0].style.display = 'none';
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

    var timer = null;
    const boxWidth = document.getElementById('box').clientWidth;
    const boxHeight = boxWidth / 1.89 + 25;
    document.getElementById('box').style.height = boxHeight + 'px';
    document.getElementsByClassName('span_list')[0].style.backgroundColor = '#2469F2';
    go();

    var spanDomList = document.getElementsByClassName('span_list');
    var num = 0;
    function go() {
        timer = setInterval(function () {//设置定时器
            num++;//用一个全局变量来控制图的运动次数
            if (num > 3) {//如果移动到了最后一张图，则num赋值1，调整ul边距（相当于初始化）
                num = 0;
                document.getElementsByClassName('ul_list')[0].style.marginLeft = '0px';
                // animate(document.getElementsByClassName('ul_list')[0], { 'marginLeft': '0px' }, 580);
            }
            if (num == 4) { //由于圆点只有四个，而图片有五张，当移动到第五张图片时，给第一个圆点“选中色”。
                Array.prototype.forEach.call(spanDomList, function (element) {
                    element.style.backgroundColor = 'transparent';
                });
                document.getElementsByClassName('span_list')[0].style.backgroundColor = '#2469F2';
            } else { //图片运动一次，导航圆点也动态的变换，这里先让所有圆点变为“不选中色”，再让当前圆点变为“选中色”。
                Array.prototype.forEach.call(spanDomList, function (element) {
                    element.style.backgroundColor = 'transparent';
                });
                document.getElementsByClassName('span_list')[num].style.backgroundColor = '#2469F2';
            }
            document.getElementsByClassName('ul_list')[0].style.marginLeft = -boxWidth * num + 'px';
            // animate(document.getElementsByClassName('ul_list')[0], { 'marginLeft': -boxWidth * num + 'px' }, 580);
        }, 4000);
    }

    Array.prototype.forEach.call(spanDomList, function (element, idx) {
        element.addEventListener('click', function() {
            num = idx;
            Array.prototype.forEach.call(spanDomList, function (element) {
                element.style.backgroundColor = 'transparent';
            });
            element.style.backgroundColor = '#2469F2';
            document.getElementsByClassName('ul_list')[0].style.marginLeft = -boxWidth * idx + 'px';
        });
    });

}
