'use strict';
window.onscroll = function(e) {
    let logo = document.getElementById('logo');
    if (logo.classList.contains('hide') && window.pageYOffset > 0) {
        logo.classList.remove('hide');
        setTimeout(() => {
            animateLetters ();
            setTimeout(() => {
                openDoors ();
            }, 1500);
        }, 3000);
    }
}
function animateLetters () {
    let letters = document.querySelectorAll('#logo > .letter');
    let speedRange = [1000, 1500]; //px per second
    let speedInterval = 1;
    letters.forEach(letter => {
        let speedAngle = random(0, 2*Math.PI);
        let speedAbs = random(speedRange[0] / 1000 * speedInterval, speedRange[1] / 1000 * speedInterval);
        let speedX = speedAbs * Math.cos(speedAngle);
        let speedY = speedAbs * Math.sin(speedAngle);
        letter.data = {
            speedX: speedX,
            speedY: speedY,
            x: 0,
            y: 0
        };
        letter.style.top = letter.data.y + 'px';
        letter.style.left = letter.data.x + 'px';
        console.dir(letter);
        
        letter.classList.add('rotating');
        setInterval(() => {
            letter.data.y += letter.data.speedY;
            letter.data.x += letter.data.speedX;
            letter.style.top = letter.data.y + 'px';
            letter.style.left = letter.data.x + 'px';
            // letter.style.tra
        }, speedInterval);
    });
}

function openDoors() {
    document.getElementById('logo').remove();
    document.getElementById('doors').classList.remove('hide');
}

function random(from, to) {
    return from + Math.random() * (to - from);
}
