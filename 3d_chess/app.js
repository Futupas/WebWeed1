'use strict';

let screenWidth = document.documentElement.clientWidth;
let screenHeight = document.documentElement.clientHeight;
let perspective = 1000;
let perspectiveOriginTop = 0; // from top
let perspectiveOriginLeft = screenWidth / 2; // from left

let currentAngleZ = 0;
let currentAngleX = 0;
let angleCoef = .5;


window.onmousemove = function (e) {
    if (e.buttons === 1) {
        currentAngleZ -= e.movementX * angleCoef;
        currentAngleX -= e.movementY * angleCoef;
        field.style.transform = `rotateZ(${currentAngleZ}deg) rotateX(${currentAngleX}deg)`;
        if (document.getElementById('divmovemouse') != null) {
            document.getElementById('divmovemouse').remove();
            document.getElementById('divdoubleclickmouse').style.display = 'block';
        }
    }
}
window.ondblclick = function (e) {
    currentAngleZ = 0;
    currentAngleX = 0;
    field.style.transform = `rotateZ(${currentAngleZ}deg) rotateX(${currentAngleX}deg)`;
    if (document.getElementById('divdoubleclickmouse') != null) {
        document.getElementById('divdoubleclickmouse').remove();
    }
}

window.onresize = function (e) {
    if (document.getElementById('divmovemouse') != null) {
        document.getElementById('divmovemouse').remove();
    }
    if (document.getElementById('divdoubleclickmouse') != null) {
        document.getElementById('divdoubleclickmouse').remove();
    }
    document.getElementById('divresizereload').style.display = 'block';
}


buildField(field, 10, 5, [['red', 'green', 'blue'], ['blue', 'green', 'red'], ['blue', 'red', 'green']]);


/**
 * 
 * @param {HTMLElement} field
 * @param {*} rowsQuantity 
 * @param {*} colsQuantity 
 * @param {Array<Array<String>>} colors ROWS (cols)
 */
function buildField(field, rowsQuantity, colsQuantity, colors) {
    let fieldWidth = field.clientWidth;
    let fieldHeight = field.clientHeight;
    let fieldLeft = field.offsetLeft;
    let fieldBottom = field.parentElement.clientHeight - fieldHeight - field.offsetTop;

    field.innerHTML = '';
    let cellWidth = fieldWidth / colsQuantity;
    let cellHeight = fieldHeight / rowsQuantity;

    for (let col = 0; col < colsQuantity; col-=-1) {
        for (let row = 0; row < rowsQuantity; row-=-1) {
            let cellX = col * cellWidth;
            let cellBottom = row * cellHeight;
            let cellDiv = document.createElement('div');
            cellDiv.classList.add('cell');
            cellDiv.style.left = cellX + 'px';
            cellDiv.style.bottom = cellBottom + 'px';
            cellDiv.style.width = cellWidth + 'px';
            cellDiv.style.height = screenHeight + 'px';
            field.appendChild(cellDiv);

            let rowColors = colors[row % colors.length];
            let cellColor = rowColors[col % rowColors.length];

            buildTrapezoid(
                cellDiv, 
                cellWidth, 
                calculateTop(fieldBottom + cellBottom, cellHeight), 
                calculateShift(fieldLeft + cellX, fieldBottom + cellBottom + cellHeight, cellHeight),
                calculateShift(fieldLeft + cellX + cellWidth, fieldBottom + cellBottom + cellHeight, cellHeight),
                cellColor
            );
        }
    }
}



// buildTrapezoid(cell2, 200, calculateTop(200, 200), calculateShift(200, 200 + 200, 200), calculateShift(400, 200 + 200, 200), 'lime');


/**
 * 
 * @param {*} div 
 * @param {*} bottomWidth 
 * @param {*} height 
 * @param {*} leftShift + right, - left
 * @param {*} rightShift + right, - left
 */
function buildTrapezoid (div, bottomWidth, height, leftShift, rightShift, color) {
    let svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.classList.add('svg');
    div.appendChild(svg);
    let polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
    let svgHeight = svg.clientHeight;
    let x1 = 0;
    let y1 = svgHeight;
    let x2 = bottomWidth;
    let y2 = svgHeight;
    let x3 = bottomWidth + rightShift;
    let y3 = svgHeight - height;
    let x4 = 0 + leftShift;
    let y4 = svgHeight - height;
    let points = `${x1},${y1} ${x2},${y2} ${x3},${y3} ${x4},${y4}`;
    polygon.setAttribute('points', points);
    polygon.style.fill = color;
    // polygon.setAttribute('style', `fill: ${color}`);
    svg.appendChild(polygon);
}


function calculateShift(pointLeft, pointBottom, elementHeight) {
    let bigLeg = perspective + pointBottom;
    let smallLeg = perspectiveOriginLeft - pointLeft;

    let result = elementHeight * smallLeg / bigLeg;

    return result;
}

function calculateTop(pointBottom, elementHeight) {
    let bigLeg = perspective + pointBottom + elementHeight;
    let smallLeg = screenHeight - perspectiveOriginTop;

    let result = elementHeight * smallLeg / bigLeg;

    return result;
}