
import c from './canvasControl.js';
import {Unit} from './Unit.js';
import {hives, Hive} from './Hive.js';
import {offset, frame} from './Settings.js';
import screenRedraw from './screenRedraw.js';


var mouse = {
    x: undefined,
    y: undefined
}

addEventListener('mousemove', function (event) {
    mouse.x = event.x;
    mouse.y = event.y;
})


var pause = -1
window.addEventListener('keydown', function (event) {

    var key = event.which || event.keyCode;

    if (key == 32) {
        pause *= -1

    }
})



var n = 0;
var F = false;

var animate = function () {
    requestAnimationFrame(animate);

    if (Math.floor(n / frame) ==  n/frame) {
        F = true;
    } else {
        F = false;
    }

    if (pause == 1) {

        for (let i = 0; i < hives.length; i++) {
            var hive = hives[i]
            var A = hive.update();

            if (A) {
                hive.delete();
                i--
            }

        }


        screenRedraw();
        n++;
    }

}

animate();
