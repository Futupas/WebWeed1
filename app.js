'use strict';
// window.onscroll = function(e) {
//     let logo = document.getElementById('logo');
//     if (logo.classList.contains('hide') && window.pageYOffset > 0) {
//         logo.classList.remove('hide');
//         setTimeout(() => {
//             animateLetters ();
//             setTimeout(() => {
//                 openDoors ();
//             }, 1500);
//         }, 3000);
//     }
// }
// function animateLetters () {
//     let letters = document.querySelectorAll('#logo > .letter');
//     let speedRange = [1000, 1500]; //px per second
//     let speedInterval = 1;
//     letters.forEach(letter => {
//         let speedAngle = random(0, 2*Math.PI);
//         let speedAbs = random(speedRange[0] / 1000 * speedInterval, speedRange[1] / 1000 * speedInterval);
//         let speedX = speedAbs * Math.cos(speedAngle);
//         let speedY = speedAbs * Math.sin(speedAngle);
//         letter.data = {
//             speedX: speedX,
//             speedY: speedY,
//             x: 0,
//             y: 0
//         };
//         letter.style.top = letter.data.y + 'px';
//         letter.style.left = letter.data.x + 'px';
//         console.dir(letter);
        
//         letter.classList.add('rotating');
//         setInterval(() => {
//             letter.data.y += letter.data.speedY;
//             letter.data.x += letter.data.speedX;
//             letter.style.top = letter.data.y + 'px';
//             letter.style.left = letter.data.x + 'px';
//             // letter.style.tra
//         }, speedInterval);
//     });
// }

// function openDoors() {
//     document.getElementById('logo').remove();
//     document.getElementById('doors').classList.remove('hide');
// }

function random(from, to) {
    return from + Math.random() * (to - from);
}

buildPlanets(1, 100, 100);

//updateFrequency - how many times per sec will planets update
function buildPlanets(quantity, timeout, updateFrequency) {
    let interval = setInterval(() => {
        quantity--;
        if (quantity <= 0) {
            clearInterval(interval);
        }
        let planet = buildAPlanet(100, 'rgba(0, 255, 0, 1)', 12);
        let angle = random(0, 90);
        // let speed = 200; // px per sec
        let speed = random(100, 1000); // px per sec
        let zCoord = random(-1000, -300);
        planet.style.transform = 'translate3d(0px, 0px, '+zCoord+'px) rotateX(0deg) rotateY(0deg) rotateZ('+angle+'deg)';
        planet.data = {
            zCoord: zCoord,
            speed: speed,
            angle: angle
        };
        setTimeout(() => {
            planet.remove();
        }, (1000-zCoord)/speed *1000);
        setInterval(() => {
            let delta = speed / updateFrequency;
            zCoord += delta;
            planet.style.transform = 'translate3d(0px, 0px, '+zCoord+'px) rotateX(0deg) rotateY(0deg) rotateZ('+angle+'deg)';
        }, 1000 / updateFrequency);
    }, timeout);
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