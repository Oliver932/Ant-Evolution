import {dist, checkAngle, vectorToAngle, angleBetween, angleRange, angleToVector} from './vectorFunctions.js';
import {scale, offset, frame} from './Settings.js';

export default function smartTarget(item, units) {

    var angle = item.currentAngle;


    var data = confine(item, angle);
    
    if (data.confined == false) {
        item.currentAngle = data.angle;

    } else {

        item.redirected = false;
        var target = getClosest(item, units);


        if (target != undefined && item.team.antData[item.type].viewRange > dist(item.x, item.y, target.x, target.y) + item.size + target.size && item.team.territoryRadius > dist(item.team.x, item.team.y, target.x, target.y)) {
            
            item.label = 'tracking';
            var target = getClosest(item, units);

            if (target != undefined) {
                var dx = target.x - item.x;
                var dy = target.y - item.y;

                // angle = retreatCheck(item, vectorToAngle(dx, dy));
                angle = vectorToAngle(dx, dy)
            }

            item.currentAngle = angle;
        
        } else {

            item.label = 'searching'

        }
    }
}

function confine(item, angle) {

    var confined = true;

    var distance = dist(item.x, item.y, item.team.x, item.team.y);
    var gap = item.team.antData[item.type].speed + offset + item.size;


    if(item.confinement == 'outer') {

        if (distance + gap >= item.team.territoryRadius) {

            if (item.redirected != 'turnedIn') {

                var dx = item.team.x - item.x
                var dy = item.team.y - item.y
                angle = checkAngle(vectorToAngle(dx, dy));

                if (distance + offset < item.team.territoryRadius) {
                    angle += 0.1
                }

                item.redirected = 'turnedIn';
            }

            confined = false;
            item.location = 'outer';

        } else if (distance - gap <= item.team.safeRadius && (distance - gap > item.team.size)) {

            if (item.team.territoryRadius - item.team.safeRadius  >= item.size * 3) {

                if (item.redirected != 'turnedOut') {

                    var dx = item.team.x - item.x
                    var dy = item.team.y - item.y
                    angle = checkAngle(vectorToAngle( -dx, -dy));

                    if (distance + offset> item.team.safeRadius) {
                        angle -= 1
                    }

                    item.redirected = 'turnedOut';

                }
                confined = false;
            }

            item.location = 'inner';

        } else if (distance - gap <= item.team.size) {

            if (item.redirected != 'turnedOut') {

                var dx = item.team.x - item.x
                var dy = item.team.y - item.y
                angle = checkAngle(vectorToAngle( -dx, -dy));

                angle -= 1

                item.redirected = 'turnedOut';

            }
            confined =  false;
            item.location = 'inner';
        

        } else {
            item.location = 'outer';
        }

    } else if(item.confinement == 'inner') {

        if (distance + gap >= item.team.safeRadius || (distance + gap >= item.team.territoryRadius)) {

            if (item.redirected != 'turnedIn') {

                var dx = item.team.x - item.x
                var dy = item.team.y - item.y
                angle = checkAngle(vectorToAngle(dx, dy));

                item.redirected = 'turnedIn';
                
            }

            confined = false;
            item.location = 'outer';
        
        } else if (distance + gap >= item.team.territoryRadius) {

            if (item.redirected != 'turnedIn') {

                var dx = item.team.x - item.x
                var dy = item.team.y - item.y
                angle = checkAngle(vectorToAngle(dx, dy));

                item.redirected = 'turnedIn';
                
            }

            confined = false;
            item.location = 'outer';

        

        } else if (distance - gap <= item.team.size) {

            if (item.redirected != 'turnedOut') {

                var dx = item.team.x - item.x
                var dy = item.team.y - item.y
                angle = checkAngle(vectorToAngle( -dx, -dy));

                // if (distance + offset> item.team.size) {
                //     angle -= 1
                // }

                item.redirected = 'turnedOut';

            }
            confined = false;

            item.location = 'inner';

        } else {
            item.location = 'inner';
        }
    }

    return {'angle':angle, 'confined':confined}
}

function getClosest(item, units) {

    var closest = undefined;
    var distance = undefined;


    for (let i = 0; i < units.length; i++) {

        var object = units[i];

        if (object.team != item.team) {

            var newDist = dist(item.x, item.y, object.x, object.y);

            if (closest == undefined) {
                closest = object;
                distance = newDist;

            } else if (newDist < distance){

                closest = object;
                distance = newDist;
            }
        }
    }

    return closest
}


