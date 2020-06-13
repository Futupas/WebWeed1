'use strict';

let currentNumber = 0;



// window.onkeydown = function(e) {
//     color = 0;
//     if (e.key == 'ArrowLeft') currentNumber -= 2*Math.PI/360 / 3;
//     else currentNumber += 2*Math.PI/360 / 3;
//     document.getElementById('mainsvg').innerHTML = '';
//     drawField(document.getElementById('mainsvg'), QUANTITY_OF_SIDES, '#000', '5px');
//     drawPath(document.getElementById('mainsvg'), QUANTITY_OF_RAYS, 0, 0, currentNumber, '#f00', '1px');
// }



let vertical = document.documentElement.clientWidth <= document.documentElement.clientHeight * 1.5;

function draw() {
    vertical = document.documentElement.clientWidth <= document.documentElement.clientHeight * 1.5;
    console.log(vertical);

    if (document.body.classList.contains('vertical') != vertical) {
        if (vertical) document.body.classList.add('vertical');
        else document.body.classList.remove('vertical');
    }

    let lessSide = document.documentElement.clientWidth <= document.documentElement.clientHeight ? 
        document.documentElement.clientWidth : 
        document.documentElement.clientHeight;
    CANVAS_HEIGHT = lessSide;
    CANVAS_WIDTH = lessSide;
    FIELD_RADIUS = lessSide / 2;
    document.getElementById('mainsvg').style.width = lessSide + 'px';
    document.getElementById('mainsvg').style.height = lessSide + 'px';
    document.querySelector('div#main div.border.right').style.width = (lessSide * .1) + (document.documentElement.clientWidth - lessSide) / 2 + 'px';
    document.querySelector('div#main div.border.left').style.width = (lessSide * .1) + (document.documentElement.clientWidth - lessSide) / 2 + 'px';
    document.querySelector('div#main div.border.top').style.height = (lessSide * .1) + (document.documentElement.clientHeight - lessSide) / 2 + 'px';
    document.querySelector('div#main div.border.bottom').style.height = (lessSide * .1) + (document.documentElement.clientHeight - lessSide) / 2 + 'px';
    
    drawField(document.getElementById('mainsvg'), QUANTITY_OF_SIDES, '#000', '1px');
    drawPath(document.getElementById('mainsvg'), QUANTITY_OF_RAYS, 0, 0, currentNumber, COLORS[0], '1px');

}

draw();
drawField(document.getElementById('mainsvg'), QUANTITY_OF_SIDES, '#000', '1px');
drawPath(document.getElementById('mainsvg'), QUANTITY_OF_RAYS, 0, 0, currentNumber, COLORS[0], '1px');

window.onresize = function (e) {
    draw();
}
window.onscroll = function (e) {
    let scroll = window.scrollY;
    let windowHeight = document.documentElement.clientHeight;
    let windowWidth = document.documentElement.clientWidth;

    let lessSide = document.documentElement.clientWidth <= document.documentElement.clientHeight ? 
        document.documentElement.clientWidth : 
        document.documentElement.clientHeight;
    let maxVerticalBorder = (lessSide * .1) + (document.documentElement.clientHeight - lessSide) / 2;
    
    if (vertical) {
        let scale;
        let divHeight;
        let verticalBorder;
        if (scroll > windowHeight * 2 / 3) {
            scale = 1/3;
            divHeight = windowHeight / 3;
            verticalBorder = 0;
        } else {
            scale = map(scroll, 0, windowHeight * 2 / 3, 1, 1/3);
            divHeight = map(scroll, 0, windowHeight * 2 / 3, windowHeight, windowHeight/3);
            verticalBorder = map(scroll, 0, windowHeight * 2 / 3, maxVerticalBorder, 0);
        }
        document.getElementById('main').style.height = divHeight + 'px';
        
        
        document.querySelector('div#main div.border.right').style.width = (lessSide * .1) + (document.documentElement.clientWidth - lessSide) / 2 + 'px';
        document.querySelector('div#main div.border.left').style.width = (lessSide * .1) + (document.documentElement.clientWidth - lessSide) / 2 + 'px';
        document.querySelector('div#main div.border.top').style.height = verticalBorder + 'px';
        document.querySelector('div#main div.border.bottom').style.height = verticalBorder + 'px';
        // document.getElementById('mainsvg').style.transform = 'scale('+scale+')';
    } else {

    }
}



function map(num, frombottom, fromtop, tobottom, totop) {
    let a = num - frombottom;
    a *= (totop-tobottom)/(fromtop-frombottom);
    a += tobottom;
    return a;
}