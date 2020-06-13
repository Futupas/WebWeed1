let currentNumber = 0;


drawField(document.getElementById('mainsvg'), QUANTITY_OF_SIDES, '#000', '5px');
drawPath(document.getElementById('mainsvg'), QUANTITY_OF_RAYS, 0, 0, currentNumber, COLORS[0], '1px');

window.onkeydown = function(e) {
    color = 0;
    if (e.key == 'ArrowLeft') currentNumber -= 2*Math.PI/360 / 3;
    else currentNumber += 2*Math.PI/360 / 3;
    mainsvg.innerHTML = '';
    drawField(document.getElementById('mainsvg'), QUANTITY_OF_SIDES, '#000', '5px');
    drawPath(document.getElementById('mainsvg'), QUANTITY_OF_RAYS, 0, 0, currentNumber, '#f00', '1px');
}