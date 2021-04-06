import {dist, checkAngle, vectorToAngle, angleBetween, angleRange, angleToVector} from './vectorFunctions.js';
import {scale, offset} from './Settings.js';

//deals damage, manages unit attack preferences

export default function smartAttack(item, units) {

    item.enemies = []
    item.status = 'moving';

    addRange(item, units);

    dealDamage(item);
    item.draw();
}

function addRange(item, units) {


    for (let i = 0; i < units.length; i++) {

        var enemy = units[i];

        if (item.team != enemy.team) {


            var distance = dist(item.x, item.y, enemy.x, enemy.y)
            var maxRange = item.size + item.team.antData[item.type].attackRange + offset + enemy.size;

            
            if (distance <= maxRange && item.enemies.includes(enemy) == false) {
                item.enemies.push(enemy);

            }
        }

    }


    if (item.enemies.length > 0) {
        item.status = 'engaged'; 
    } else {
        item.status = 'moving';
    }

}

function dealDamage(item) {


    if (item.enemies.length > 0) {


        var opponent = item.enemies[Math.floor(Math.random() * item.enemies.length)]


        var damage = item.team.antData[item.type].damage * (item.health / item.team.antData[item.type].health);

        opponent.health = Math.floor(opponent.health - damage);

        if (opponent.health < 0) {
            opponent.delete();
        } 
    }
}

function recalibrateSize(opponent) {

    opponent.size = unitTypes[opponent.type].size * Math.sqrt((opponent.health / 100));
}



