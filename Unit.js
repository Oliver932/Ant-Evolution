import c from './canvasControl.js';
import {angleToVector, vectorToAngle} from './vectorFunctions.js';
import smartMove from './smartMovement.js';
import smartAttack from './smartAttack.js';
import smartTarget from './smartTarget.js';
import {scale, offset} from './Settings.js';


export class Unit {
    constructor(x, y, team, type, currentAngle, confinement) {

        this.x = x;
        this.y = y;

        this.team = team;
        this.type = type;

        this.confinement = confinement;
        this.redirected = false;
        this.location = 'inner';

        this.size  = this.team.antData[this.type].size
        this.health = this.team.antData[this.type].health;

        this.label = 'searching';

        this.status = 'moving';

        this.enemies = [];
        this.lastMove = 0;
        this.collision = false;

        this.currentAngle = currentAngle;

        this.counter = 0;

    }

    draw () {
        

        c.beginPath();
        c.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
        c.fillStyle = this.team.colour;
        c.fill();

        var directionAngle = this.currentAngle - Math.PI / 2;
        var directionRange = Math.PI / 3;
        var directionThickness = 1;

        c.beginPath();
        c.arc(this.x, this.y, this.size - (this.size * directionThickness / 2), directionAngle - directionRange, directionAngle + directionRange);
        c.strokeStyle = 'black';
        c.lineWidth = this.size * directionThickness
        c.stroke();
    }

    update() {


        this.counter += 1;

        if (this.counter > this.team.antData[this.type].lifespan * (this.health / this.team.antData[this.type].health)) {
            this.delete()

        } else {

            var units = this.team.ants.inner.concat(this.team.ants.outer);

            if (this.location == 'outer') {
                for (let index = 0; index < this.team.collisionHives.length; index++) {
                    const hive = this.team.collisionHives[index];

                    units = units.concat(hive.ants.outer);
                } 
            }

            // smartMorale(this, units);
            smartAttack(this, units);
            smartTarget(this, units);

            if (this.team.antData[this.type].speed > 0 && this.status != 'engaged') {

                smartMove(this, this.team.antData[this.type].speed, this.currentAngle, units);
            }
        }

    }

    delete () {

        for (let index = 0; index < this.team.ants[this.confinement].length; index++) {
            const mate = this.team.ants[this.confinement][index];

            if (mate === this) {
                this.team.ants[this.confinement].splice(index, 1);
                break;
            }
        }

    }
}