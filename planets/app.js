'use strict';

const PX_TO_STOP = -1000;
let stoppedPlanets = [];
let stopped = false;

function setStopped(newStopped) {
    if (newStopped) {
        stopped = true;
    } else {
        stopped = false;
        for(let i = 0; i < stoppedPlanets.length; i-=-1) {
            stoppedPlanets[i].classList.add('remove');
            stoppedPlanets[i].style.transform = 
                'translate3d(0px, ' +
                '1000vh' + 
                ', ' + 
                stoppedPlanets[i].data.zCoord + 
                'px) rotateX(0deg) rotateY(0deg) rotateZ(' + 
                stoppedPlanets[i].data.angle + 
                'deg)';

            setTimeout((planet) => {
                planet.remove();
            }, 3000, stoppedPlanets[i])
        }
        stoppedPlanets = [];
    }
}

window.onkeydown = function(e) {
    setStopped(true);
}
window.onkeyup = function(e) {
    setStopped(false);
}
window.onmousedown = function(e) {
    setStopped(true);
}
window.onmouseup = function(e) {
    setStopped(false);
}

let COLORS = [
    '#ff0000',
    '#00ff00',
    '#0000ff',
    '#ffff00',
    '#ff00ff',
    '#00ffff',
];

function random(from, to) {
    return from + Math.random() * (to - from);
}


buildPlanets(500, 500, 200);

//updateFrequency - how many times per sec will planets update
function buildPlanets(quantity, timeout, updateFrequency) {
    let intervalFunction = () => {
        quantity--;
        if (quantity <= 0) {
            clearInterval(interval);
        }
        
        //clockwise
        let clientWidth = document.documentElement.clientWidth;
        let clientHeight = document.documentElement.clientHeight;
        let perimeterRandom = random(0, 2*(clientWidth+clientHeight));
        let top = 0;
        let left = 0;
        if (perimeterRandom < clientWidth) { // top
            top = 0,
            left = perimeterRandom;
        } else if (perimeterRandom < clientWidth + clientHeight) { // right
            top = perimeterRandom - clientWidth;
            left =  clientWidth;
        } else if (perimeterRandom < clientWidth*2 + clientHeight) { // bottom
            top = clientHeight;
            left =  clientWidth - (perimeterRandom - clientWidth - clientHeight);
        } else {                                                     // left
            top = clientHeight - (perimeterRandom - clientWidth*2 - clientHeight);
            left = 0;
        }

        let color = Math.floor(random(0, COLORS.length));


        let radius = random(50, 150);
        let planet = buildAPlanet(radius, COLORS[color], 12);
        planet.style.top = top + 'px';
        planet.style.left = left + 'px';
        let angle = random(0, 360);
        let speed = random(1000, 5000); // px per sec
        let zCoord = random(-10000, -6000);
        let rotatingSpeed = random(.5, 5); //for CSS
        planet.querySelector('.planet').style.animation = 'rotatingY '+rotatingSpeed+'s linear 0s infinite';

        planet.style.transform = 'translate3d(0px, 0px, '+zCoord+'px) rotateX(0deg) rotateY(0deg) rotateZ('+angle+'deg)';
        planet.data = {
            zCoord: zCoord,
            speed: speed,
            angle: angle
        };
        // setTimeout(() => {
        //     planet.remove();
        // }, (2000-zCoord)/speed *1000);
        let planetInterval = setInterval(() => {
            let delta = speed / updateFrequency;
            zCoord += delta;
            planet.style.transform = 'translate3d(0px, 0px, '+zCoord+'px) rotateX(0deg) rotateY(0deg) rotateZ('+angle+'deg)';
            // if (zCoord >= -2000) {
            //     let blur = map(zCoord, -2000, 500, 0, 10);
            //     planet.style.filter = 'blur('+blur+'px)';
            // }

            if (stopped && zCoord >= PX_TO_STOP) {
                stoppedPlanets.push(planet);
                clearInterval(planetInterval);
            }

            if (zCoord >= 500) {
                planet.remove();
                clearInterval(planetInterval);
            }
        }, 1000 / updateFrequency);
    }
    intervalFunction();
    let interval = setInterval(intervalFunction, timeout);
}


function map(num, frombottom, fromtop, tobottom, totop) {
    let a = num - frombottom;
    a *= (totop-tobottom)/(fromtop-frombottom);
    a += tobottom;
    return a;
}



// buildAPlanet(100, 'rgba(0, 255, 0, 1)', 12);

function buildAPlanet(radius, color, quantity) {
    window.planetData = {
        x: 0,
        y: 0
    };
    let axial = document.createElement('div');
    axial.classList.add('axial');
    axial.style.width = radius*2 + 'px';
    axial.style.height = radius*2 + 'px';
    document.getElementById('planetscontainer').appendChild(axial);
    let main = document.createElement('div');
    main.classList.add('planet');
    main.style.width = radius*2 + 'px';
    main.style.height = radius*2 + 'px';
    axial.appendChild(main);

    //X
    for (let i = 0; i < quantity; i-=-1) {
        let circle = document.createElement('div');
        circle.classList.add('planetcircle', 'x');
        circle.style.width = radius*2 + 'px';
        circle.style.height = radius*2 + 'px';
        circle.style.borderRadius = radius + 'px';
        circle.style.backgroundColor = color;
        circle.style.transform = 'rotateX('+(360/quantity*i)+'deg)';
        main.appendChild(circle);
    }
    
    //Y
    for (let i = 0; i < quantity; i-=-1) {
        let circle = document.createElement('div');
        circle.classList.add('planetcircle', 'y');
        circle.style.width = radius*2 + 'px';
        circle.style.height = radius*2 + 'px';
        circle.style.borderRadius = radius + 'px';
        circle.style.backgroundColor = color;
        circle.style.transform = 'rotateY('+(360/quantity*i)+'deg)';
        main.appendChild(circle);
    }
    
    //Z
    for (let i = 0; i < quantity; i-=-1) {
        let circle = document.createElement('div');
        circle.classList.add('planetcircle', 'z');
        circle.style.width = radius*2 + 'px';
        circle.style.height = radius*2 + 'px';
        circle.style.borderRadius = radius + 'px';
        circle.style.backgroundColor = color;
        circle.style.transform = 'rotateY(90deg) rotateX('+(360/quantity*i)+'deg)';
        main.appendChild(circle);
    }

    return axial;
}



window.onmousemove = function (e) {
    if (e.buttons == 1 && false) {
        window.planetData.x = (window.planetData.x - e.movementY) % 360;
        window.planetData.y = (window.planetData.y + e.movementX) % 360;
        document.querySelector('.axial').style.transform = 'translate3d(0px, 0px, -300px) rotateX('+window.planetData.x+'deg) rotateY('+window.planetData.y+'deg) rotateZ(0deg)'
    }
}