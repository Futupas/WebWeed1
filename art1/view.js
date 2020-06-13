'use strict';

let currentNumber = 0;



window.onkeydown = function(e) {
    color = 0;
    if (e.key == 'ArrowLeft') currentNumber -= 2*Math.PI/360 / 3;
    else currentNumber += 2*Math.PI/360 / 3;
    document.getElementById('mainsvg').innerHTML = '';
    drawField(document.getElementById('mainsvg'), QUANTITY_OF_SIDES, '#000', '5px');
    drawPath(document.getElementById('mainsvg'), QUANTITY_OF_RAYS, 0, 0, currentNumber, '#f00', '1px');
}



let vertical = document.documentElement.clientWidth <= document.documentElement.clientHeight;

function draw() {
    let newVertical = document.documentElement.clientWidth <= document.documentElement.clientHeight;
    if (newVertical != vertical) {
        vertical = newVertical;
        if (vertical)
        document.body.classList.add('vertical');
        else 
        document.body.classList.remove('vertical');
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

}

draw();
drawField(document.getElementById('mainsvg'), QUANTITY_OF_SIDES, '#000', '1px');
drawPath(document.getElementById('mainsvg'), QUANTITY_OF_RAYS, 0, 0, currentNumber, COLORS[0], '1px');

window.onresize = function (e) {
    draw();
}
window.onscroll = function (e) {

}