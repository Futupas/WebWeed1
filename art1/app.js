'use strict';
const SVGNS = 'http://www.w3.org/2000/svg';
const CANVAS_WIDTH = 500;
const CANVAS_HEIGHT = 500;
const FIELD_RADIUS = 200;
const ACCURACY = 1000 * 1000 * 1000;

/** @type {Array<LineSegment>} */
let fieldSegments = [];
/** @type {Array<LineSegment>} */
let figureSegments = [];
let path;

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
        line.style.strokeLinecap = 'round';
        return line;
    }

    /**
     * gets coordinates of intersection of this line and lineSegment
     * @param {LineSegment} lineSegment  second line to intersect this
     * @returns {Array<number>|boolean} array [x, y] with coords of intersection or false if lines do not intersect
     */
    getCoordsOfIntersection(lineSegment) {
        let vertical1 = false;
        let vertical2 = false;
        // A1*x + B1*y + C1 = 0   =>   this
        let A1 = this.y1 - this.y2;
        let B1 = this.x2 - this.x1;
        let C1 = this.x1 * this.y2 - this.x2 * this.y1;
        // y = k1*x + b1          =>   this
        let k1;
        let b1;
        if (Math.round(B1 * ACCURACY) == 0) {
            vertical1 = true;
        } else {
            k1 = -1 * A1 / B1;
            b1 = -1 * C1 / B1;
        }

        // A2*x + B2*y + C2 = 0   =>   lineSegment
        let A2 = lineSegment.y1 - lineSegment.y2;
        let B2 = lineSegment.x2 - lineSegment.x1;
        let C2 = lineSegment.x1 * lineSegment.y2 - lineSegment.x2 * lineSegment.y1;
        // y = k2*x + b2          =>   lineSegment
        let k2;
        let b2;
        if (Math.round(B2 * ACCURACY) == 0) {
            vertical2 = true;
        } else {
            k2 = -1 * A2 / B2;
            b2 = -1 * C2 / B2;
        }

        if (k1 === k2) return false; // segments are parallel

        let intersectionX;
        let intersectionY;

        if (!vertical1 && !vertical2) {
            intersectionX = (b2 - b1) / (k1 - k2);
            intersectionY = k1 * intersectionX + b1;
        } else if (vertical1 && !vertical2) {
            intersectionX = -1 * C1 / A1;
            intersectionY = k2 * intersectionX + b2;
        } else if (!vertical1 && vertical2) {
            intersectionX = -1 * C2 / A2;
            intersectionY = k1 * intersectionX + b1;
        } else {
            return false;
        }

        if (intersectionX < Math.min(this.x1, this.x2) ||
            intersectionX > Math.max(this.x1, this.x2) ||
            intersectionX < Math.min(lineSegment.x1, lineSegment.x2) ||
            intersectionX > Math.max(lineSegment.x1, lineSegment.x2) ||
            intersectionY < Math.min(this.y1, this.y2) ||
            intersectionY > Math.max(this.y1, this.y2) ||
            intersectionY < Math.min(lineSegment.y1, lineSegment.y2) ||
            intersectionY > Math.max(lineSegment.y1, lineSegment.y2)) {
                return false;
            } 
        
        return [intersectionX, intersectionY];
    }


}




/**
 * draws a field with n (quantityOfSides) sides
 * @param {HTMLElement} svg svg element, where to draw the line
 * @param {number} quantityOfSides quantity of sIdes
 * @param {String} strokeColor color of line
 * @param {String} strokeWidth color of line
 */
function drawField(svg, quantityOfSides, strokeColor, strokeWidth) {
    let prevXCoord = FIELD_RADIUS*Math.cos(0);
    let prevYCoord = FIELD_RADIUS*Math.sin(0);
    fieldSegments = [];
    for (let i = 1; i < quantityOfSides; i-=-1) {
        let angle = 2*Math.PI/quantityOfSides*i;
        let xCoord = FIELD_RADIUS*Math.cos(angle);
        let yCoord = FIELD_RADIUS*Math.sin(angle);
        let line = new LineSegment(prevXCoord, prevYCoord, xCoord, yCoord);
        prevXCoord = xCoord;
        prevYCoord = yCoord;
        fieldSegments.push(line);
        line.draw(svg, strokeColor, strokeWidth);
    }
    let line = new LineSegment(prevXCoord, prevYCoord, FIELD_RADIUS*Math.cos(0), FIELD_RADIUS*Math.sin(0));
    fieldSegments.push(line);
    line.draw(svg, strokeColor, strokeWidth);

}


/**
 * @param {number} x start x cordinate
 * @param {number} y start y cordinate
 * @param {number} angle start x angle in radians
 * @returns {Array<number>} [x, y, angle] of next segment
 */
function drawAPathSegment(x, y, angle) {
    angle  = angle % (2*Math.PI);
    let closestIntersection = false;
    let fieldIntersects = false;
    let ray = new LineSegment(x, y, x+3*FIELD_RADIUS*Math.cos(angle), y+3*FIELD_RADIUS*Math.sin(angle));
    // ray.draw(document.getElementById('mainsvg'), '#0f0', '1px');
    for (let i = 0; i < fieldSegments.length; i-=-1) {
        let intersection = fieldSegments[i].getCoordsOfIntersection(ray);
        if (intersection !== false) {
            let r = Math.sqrt(Math.pow(x - intersection[0], 2) + Math.pow(y - intersection[1], 2));
            if (r > 1/ACCURACY) {
                closestIntersection = intersection;
                fieldIntersects = fieldSegments[i];
            }
        }
    }

    let segmentAngle = Math.atan2(fieldIntersects.y2 - fieldIntersects.y1, fieldIntersects.x2 - fieldIntersects.x1);

    let newAngle = Math.PI - ((angle - Math.PI - 2*segmentAngle) % (2*Math.PI));

    return [closestIntersection[0], closestIntersection[1], newAngle];
}

/**
 * 
 * @param {HTMLElement} svg 
 * @param {number} quantityOfSegments 
 * @param {number} startX 
 * @param {number} staryY 
 * @param {number} startAngle 
 * @param {String} strokeColor 
 * @param {String} strokeWidth 
 */
function drawPath(svg, quantityOfSegments, startX, staryY, startAngle, strokeColor, strokeWidth) {
    let x = startX;
    let y = staryY;
    let angle = startAngle % (2*Math.PI);
    for (let i = 0; i < quantityOfSegments; i-=-1) {
        let newSegments = drawAPathSegment(x, y, angle);
        let line = new LineSegment(x, y, newSegments[0], newSegments[1]);
        line.draw(svg, strokeColor, strokeWidth);
        x = newSegments[0];
        y = newSegments[1];
        angle = newSegments[2] % (2*Math.PI);
    } 
}









drawField(document.getElementById('mainsvg'), 3, '#000', '5px');
drawPath(document.getElementById('mainsvg'), 100, 0, 0, .1*Math.PI, '#f00', '1px');


// let line1 = new LineSegment(-194.18836348521037, 47.86313285751162, -194.18836348521043, -47.86313285751149);
// line1.draw(mainsvg, '#000', '5px');
// let line2 = new LineSegment(185.17052372868466, 60.16555032121232, -406.2651248303058, -40.848674487011024);
// line2.draw(mainsvg, '#0f0', '1px');
// console.log(line1.getCoordsOfIntersection(line2));