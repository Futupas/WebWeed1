'use strict';
const SVGNS = 'http://www.w3.org/2000/svg';
const CANVAS_WIDTH = 500;
const CANVAS_HEIGHT = 500;
let fieldSegments = [];


class LineSegment {
    x1 = 0;
    x2 = 0;
    y1 = 0;
    y2 = 0;

    constructor(x1, y1, x2, y2) {
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
    }

    /**
     * @returns {Array<number>} line coords for SVG in format [x1, y1, x2, y2]
     */
    getSVGCoordinates() {
        return [this.x1+CANVAS_WIDTH/2, CANVAS_HEIGHT/2-this.y1, this.x2+CANVAS_WIDTH/2, CANVAS_HEIGHT/2-this.y2];
    }

    /**
     * draws a line with <line /> tag
     * @param {HTMLElement} svg svg element, where to draw the line
     * @param {String} strokeColor color of line
     * @param {String} strokeWidth color of line
     * @returns {SVGElement} the line
     */
    draw(svg, strokeColor, strokeWidth) {
        let line = document.createElementNS(SVGNS, 'line');
        let svgCoords = this.getSVGCoordinates();
        line.setAttribute('x1', svgCoords[0]);
        line.setAttribute('y1', svgCoords[1]);
        line.setAttribute('x2', svgCoords[2]);
        line.setAttribute('y2', svgCoords[3]);
        line.style.stroke = strokeColor;
        line.style.strokeWidth = strokeWidth;
        svg.appendChild(line);
        this.element = line;
        return line;
    }

}


// let line1 = new LineSegment(10, 10, 100, 100);
// line1.draw(document.getElementById('mainsvg'), '#f00', '5px');
drawField(document.getElementById('mainsvg'), 13, 200, '#000', '5px');


/**
 * draws a field with n (quantityOfSides) sides
 * @param {HTMLElement} svg svg element, where to draw the line
 * @param {number} quantityOfSides quantity of sIdes
 * @param {number} radius radius of circle, drawed over the polygon
 * @param {String} strokeColor color of line
 * @param {String} strokeWidth color of line
 */
function drawField(svg, quantityOfSides, radius, strokeColor, strokeWidth) {
    let prevXCoord = radius*Math.cos(0);
    let prevYCoord = radius*Math.sin(0);
    fieldSegments = [];
    for (let i = 1; i < quantityOfSides; i-=-1) {
        let angle = 2*Math.PI/quantityOfSides*i;
        let xCoord = radius*Math.cos(angle);
        let yCoord = radius*Math.sin(angle);
        let line = new LineSegment(prevXCoord, prevYCoord, xCoord, yCoord);
        prevXCoord = xCoord;
        prevYCoord = yCoord;
        fieldSegments.push(line);
        line.draw(svg, strokeColor, strokeWidth).style.strokeLinecap = 'round';
    }
    let line = new LineSegment(prevXCoord, prevYCoord, radius*Math.cos(0), radius*Math.sin(0));
    fieldSegments.push(line);
    line.draw(svg, strokeColor, strokeWidth).style.strokeLinecap = 'round';

}
