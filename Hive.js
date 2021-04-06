import c from './canvasControl.js';
import {Unit} from './Unit.js';
import {dist, checkAngle, vectorToAngle, angleBetween, angleRange, angleToVector} from './vectorFunctions.js';
import {offset, frame, scale, speedScale, attackScale} from './Settings.js';

var baseValues = {
    'Warrior': {
        'size': 9 * scale,
        'speed':1 * speedScale,
        'health':10,
        'lifespan':40 * frame,
        'damage':2 * attackScale / frame,
        'attackRange':2 * scale,
        'viewRange': 50 * scale,
        'gestation': 4 * frame
    },

    'Worker': {
        'size': 5 * scale,
        'speed':1 * speedScale,
        'health':5,
        'lifespan':100 * frame,
        'damage':0.5 * attackScale / frame,
        'attackRange':1 * scale,
        'viewRange': 50 * scale,
        'gestation': 2 * frame
    }
}

var variance = 0.1;

export var hives = [];
export class Hive {

    constructor(x, y, species) {

        this.x = x;
        this.y = y;
        this.species = species;

        this.antData = {}

        for (const type in baseValues) {
            if (Object.hasOwnProperty.call(baseValues, type)) {
                const ant = baseValues[type];

                this.antData[type] = {};

                for (const value in ant) {
                    if (Object.hasOwnProperty.call(ant, value)) {
                        var element = ant[value];

                        element *= (1 + ((Math.random() - 0.5) * 2 * variance))

                        this.antData[type][value] = element;
                        
                    }
                }

                this.antData[type].damage *= this.antData[type].size ** 2;
                this.antData[type].health *= this.antData[type].size ** 2;
                this.antData[type].lifespan *= this.antData[type].size;
                this.antData[type].gestation *= this.antData[type].size;
                
            }
        }


        this.size = 10;
        this.territoryModifier = 4 * (1 + ((Math.random() - 0.5) * 2 * variance)) * this.antData.Warrior.size;
        this.warriorRatioGoal = 1;

        this.colour = 'black';

        this.population = 2;
        this.counter = 0;
        this.food = 0;

        this.warriorRatio = 1;
        this.safeRatio = 1;

        this.ants = {
            'inner':[],
            'outer':[]};

        this.collisionHives = [];

        this.ants['outer'].push(new Unit(this.x, this.y, this, 'Warrior', 1, 'outer'));
        this.ants['inner'].push(new Unit(this.x, this.y, this, 'Worker', 1, 'inner'));



        this.calculateTerritory();
        this.draw();

    }

    draw () {

        c.beginPath();
        c.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
        c.lineWidth = 4;
        c.strokeStyle = this.colour;
        c.stroke();

        c.beginPath();
        c.arc(this.x, this.y, this.territoryRadius, 0, 2 * Math.PI);
        c.strokeStyle = this.colour;
        c.lineWidth = 2;
        c.stroke();

        if (this.safeRadius != 0){

            c.beginPath();
            c.arc(this.x, this.y, this.safeRadius, 0, 2 * Math.PI);
            c.strokeStyle = this.colour;
            c.lineWidth = 2;
            c.stroke();
        }

        for (const confinement in this.ants) {
            if (Object.hasOwnProperty.call(this.ants, confinement)) {
                const list = this.ants[confinement];

                for (let index = 0; index < list.length; index++) {
                    const ant = list[index];

                    ant.draw();
            
                }
            }
        }
    }

    update () {

        this.population = this.ants.inner.length + this.ants.outer.length;


        if (this.population < 1){
            return true;

        } else {

            for (const confinement in this.ants) {
                if (Object.hasOwnProperty.call(this.ants, confinement)) {
                    const list = this.ants[confinement];

                    for (let index = 0; index < list.length; index++) {
                        const ant = list[index];

                        ant.update();
                
                    }
                }
            }

            this.counter += 1;
            var ratio = (this.population / 2) / this.antData.Warrior.gestation;

            var time = 1 / ratio;

            if (this.counter > time) {

                this.counter = 0;

                var createNum = 1;
                if (ratio > 1){
                    createNum = Math.floor(ratio);
                }

                var increment = Math.PI * 2 / createNum
                var starter = Math.random() * 2 * Math.PI

                for (let index = 0; index < createNum; index++) {
                    
                    this.ants['outer'].push(new Unit(this.x, this.y, this, 'Warrior', checkAngle(index * increment + starter), 'outer'));
                    
                }

            }


            this.calculateTerritory();

            return false;
        }
    }

    calculateTerritory() {

        this.territoryRadius = Math.sqrt(this.population) * this.territoryModifier;
        this.safeRadius = this.territoryRadius;
        this.collisionHives = [];

        for (let index = 0; index < hives.length; index++) {
            const hive = hives[index];

            if (hive != this && hive.population > 0) {

                var distance = dist(this.x, this.y, hive.x, hive.y) - hive.territoryRadius

                if (distance <= this.territoryRadius + hive.territoryRadius){

                    if (this.collisionHives.includes(hive) == false) {
                        this.collisionHives.push(hive);
                    }

                    if (distance < this.safeRadius){

                        this.safeRadius = distance ;
                        this.closestHive = hive;
                    }
                }
            }   
        }

        if (this.safeRadius <= this.size + this.antData.Worker.size * 3 ){
            this.safeRadius = this.size;
        }

    }

    delete () {

        for (let index = 0; index < hives.length; index++) {
            const mate = hives[index];

            if (mate === this) {
                hives.splice(index, 1);
                break;
            }
        }
    }
}


function distributeColours(number){

    var reps = Math.cbrt(number);
    var interval = Math.floor(255/ reps);

    for (let r = 0; r < reps; r++) {  
        for (let g = 0; g < reps; g++) { 
            for (let b = 0; b < reps; b++) {  

                var index  = (r * reps ** 2) + (g * reps) + b;
                const hive = hives[index];

                hive.colour = 'rgba(' + (r * interval).toString() + ',' + (g * interval).toString() + ',' + (b * interval).toString() + ',1)';


            } 
        }
    }
}

function createHives() {

    // number must be a cube
    var number = 1000;

    for (let index = 0; index < number; index++) {

        hives.push(new Hive(Math.floor(Math.random() * innerWidth), Math.floor(Math.random() * innerHeight), index));
        
    }

    distributeColours(number);
}

createHives();
