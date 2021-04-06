import c from './canvasControl.js';
import {tiles} from './Tile.js';
import {hives} from './Hive.js';
import {rows, columns, tileSize} from './Settings.js';

export default function screenRedraw() {
    
    clearScreen();
    // drawTiles();
    drawHives();
}

function drawTiles(){

    c.strokeStyle = 'black';
    c.lineWidth = 2;

    for (let x = 0; x < columns; x++) {

        c.beginPath();
        c.moveTo(x * tileSize, 0);
        c.lineTo(x * tileSize, innerHeight);
        c.stroke();   
    }

    for (let y = 0; y < rows; y++) {

        c.beginPath();
        c.moveTo(0, y * tileSize);
        c.lineTo(innerWidth, y * tileSize);
        c.stroke();   
    }


}

function clearScreen(){

    c.fillStyle = 'rgba(255, 255, 255, 1)';
    c.fillRect(0, 0, innerWidth, innerHeight)
}

// function drawUnits(){

//     for (let index = 0; index < units.length; index++) {
//         const unit = units[index];
//         unit.draw();
//     }
// }

function drawHives(){

    for (let index = 0; index < hives.length; index++) {
        const hive = hives[index];
        hive.draw();
    }
}