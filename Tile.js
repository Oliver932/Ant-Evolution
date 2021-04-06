import c from './canvasControl.js';
import {angleToVector, vectorToAngle} from './vectorFunctions.js';
import {scale, offset, tileSize, rows, columns} from './Settings.js';


export var tiles = [];

export class Tile {

    constructor(x, y) {

        this.x = x;
        this.y = y;
    }

    draw() {

        c.strokeStyle = 'black';
        c.lineWidth = 0.5;

        c.rect(this.x * tileSize, this.y * tileSize, tileSize, tileSize);
        c.stroke();
    }
}

function createTiles() {

    for (let x = 0; x < columns; x++) {

        tiles.push([]);

        for (let y = 0; y < rows; y++) {
        
            tiles[x].push(new Tile(x, y));
        }
    }
}

createTiles();