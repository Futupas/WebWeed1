'use strict';
const SVGNS = 'http://www.w3.org/2000/svg';
let CANVAS_WIDTH = 500;
let CANVAS_HEIGHT = 500;
let FIELD_RADIUS = 200;
const ACCURACY = 1000 * 1000 * 1000;
const PERPENDICULAR_SHIFT = .01;
const HIDDEN_FIELD_RADIUS_LESS = 1;
const QUANTITY_OF_SIDES = 13;
const QUANTITY_OF_RAYS = 50;


let color = 0;
const COLORS = ['#f00', '#0f0', '#00f', '#ff0', '#0ff', '#f0f', '#fff'];


/** @type {Array<LineSegment>} */
let fieldSegments = [];
/** @type {Array<LineSegment>} */
let figureSegments = [];
/** @type {Array<LineSegment>} */
let raySegments = [];


/** @type {HTMLElement} */
let path;
/** @type {Array<HTMLElement>} */
let pathes = [];
/** @type {Array<LineSegment>} */
// let currentSegments = [];


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

        let intersectionX;
        let intersectionY;

        if (!vertical1 && !vertical2) {
            intersectionX = (b2 - b1) / (k1 - k2);
            intersectionY = k1 * intersectionX + b1;
        } else if (vertical1 && !vertical2) {
            intersectionX = (this.x1 + this.x2) / 2;
            // intersectionX = -1 * C1 / A1;
            intersectionY = k2 * intersectionX + b2;
        } else if (!vertical1 && vertical2) {
            intersectionX = (lineSegment.x1 + lineSegment.x2) / 2;
            // intersectionX = -1 * C2 / A2;
            intersectionY = k1 * intersectionX + b1;
        } else {
            return false;
        }
        
        if (Math.round((k1 - k2) * ACCURACY) == 0) return false; // segments are parallel

        if (Math.round(k1 * ACCURACY) == 0) intersectionY = (this.y1 + this.y2) / 2; // 'this' is horizontal
        if (Math.round(k2 * ACCURACY) == 0) intersectionY = (lineSegment.y1 + lineSegment.y2) / 2; // 'lineSegment' is horizontal

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
 */
function drawHiddenField(quantityOfSides) {
    let shiftAngle = Math.PI / quantityOfSides;
    let radius = FIELD_RADIUS / Math.cos(shiftAngle) - HIDDEN_FIELD_RADIUS_LESS;
    let prevXCoord = radius*Math.cos(shiftAngle);
    let prevYCoord = radius*Math.sin(shiftAngle);
    for (let i = 1; i < quantityOfSides; i-=-1) {
        let angle = shiftAngle + 2*Math.PI/quantityOfSides*i;
        let xCoord = radius*Math.cos(angle);
        let yCoord = radius*Math.sin(angle);
        let line = new LineSegment(prevXCoord, prevYCoord, xCoord, yCoord);
        prevXCoord = xCoord;
        prevYCoord = yCoord;
        fieldSegments.push(line);
    }
    let line = new LineSegment(prevXCoord, prevYCoord, radius*Math.cos(shiftAngle), radius*Math.sin(shiftAngle));
    fieldSegments.push(line);

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
    drawHiddenField(quantityOfSides);
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
    raySegments.push(ray);
    for (let i = 0; i < fieldSegments.length; i-=-1) {
        let intersection = fieldSegments[i].getCoordsOfIntersection(ray);
        if (intersection !== false) {
            let r = Math.sqrt(Math.pow(x - intersection[0], 2) + Math.pow(y - intersection[1], 2));
            if (r > 1/ACCURACY) {
                if (closestIntersection === false) {
                    closestIntersection = intersection;
                    fieldIntersects = fieldSegments[i];
                } else if (r < Math.sqrt(Math.pow(x - closestIntersection[0], 2) + Math.pow(y - closestIntersection[1], 2))) {
                    closestIntersection = intersection;
                    fieldIntersects = fieldSegments[i];
                }
            }
        }
    }

    let segmentAngle = Math.atan2(fieldIntersects.y2 - fieldIntersects.y1, fieldIntersects.x2 - fieldIntersects.x1);

    let newAngle = Math.PI - ((angle - Math.PI - 2*segmentAngle) % (2*Math.PI));

    let angleDelta = (angle + newAngle) % Math.PI;

    if (Math.round((angleDelta)*ACCURACY) == 0) {
        newAngle += PERPENDICULAR_SHIFT;
    }

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
    figureSegments = [];
    let currentSegments = [];
    pathes = [];
    path = document.createElementNS(SVGNS, 'path');
    path.style.stroke = strokeColor;
    path.style.strokeWidth = strokeWidth;
    path.style.fill = COLORS[color];
    pathes.push('patch');
    svg.appendChild(path);
    let x = startX;
    let y = staryY;
    let angle = startAngle % (2*Math.PI);
    path.setAttribute('d', `M${x+CANVAS_WIDTH/2} ${CANVAS_HEIGHT/2-y} `);
    for (let i = 0; i < quantityOfSegments; i-=-1) {
        let newSegment = drawAPathSegment(x, y, angle);
        let line = new LineSegment(x, y, newSegment[0], newSegment[1]);
        

        for(let ci = 0; ci < currentSegments.length-1; ci-=-1) {
            let intersection = line.getCoordsOfIntersection(currentSegments[ci]);
            if (intersection !== false) {
                line = new LineSegment(x, y, intersection[0], intersection[1]);
                currentSegments.push(line);
                figureSegments.push(line);
                x = intersection[0];
                y = intersection[1];
                path.setAttribute('d', path.getAttribute('d')+`L${x+CANVAS_WIDTH/2} ${CANVAS_HEIGHT/2-y} `);
                
                color = (color + 1) % COLORS.length;
                drawPath(svg, quantityOfSegments-i, x, y, angle, COLORS[color], strokeWidth);

                return;
            }
        }
        
        currentSegments.push(line);
        figureSegments.push(line);
        x = newSegment[0];
        y = newSegment[1];
        path.setAttribute('d', path.getAttribute('d')+`L${x+CANVAS_WIDTH/2} ${CANVAS_HEIGHT/2-y} `);
        angle = newSegment[2] % (2*Math.PI);
    } 
}

// function drawPoint(x, y) {
//     let rx = x+CANVAS_WIDTH/2;
//     let ry = CANVAS_HEIGHT/2-y;
//     let circle = document.createElementNS(SVGNS, 'circle');
//     circle.setAttribute('cx', rx);
//     circle.setAttribute('cy', ry);
//     circle.setAttribute('r', '5px');
//     circle.style.strokeWidth = '0px';
//     circle.style.fill = '#000';
//     mainsvg.appendChild(circle);
// }
