import { C4Piece, C4Board } from './c4.js';

const TIE = 3;
const NUM_ROWS = 6;
const NUM_COLUMNS = 7;
const colWidth = 100, 
  height = 700,
  pieceWidth = 80;

let doingDrop = false,
    playerMove,  // tracks mouse
    winner = 0,
    modeSelect;


let BOARD;
const AI_WORKER = new Worker('./js/ai.js', { type: 'module' });
AI_WORKER.onmessage = (e) => {
    const computerMove = e.data;
    console.info('computer picked', computerMove);
    BOARD = BOARD.move(computerMove);
};


new p5((p5) => {
    p5.setup = () => {
        BOARD = new C4Board();
        p5.frameRate(15);
        const canvas = p5.createCanvas(NUM_COLUMNS*colWidth, NUM_ROWS*colWidth + colWidth);
        canvas.parent('sketch');
        // modeSelect = select('#modeSelect');    
    };

    p5.mousePressed = () => {
        if(doingDrop || BOARD.isComputerTurn()) {
            return false;
        }
        if(BOARD.legalMoves().indexOf(playerMove) === -1) {
            console.info('not legal');
            return false;
        }
    
        console.info('human move', playerMove); 

        doingDrop = true;
        p5.noLoop();
        p5.redraw();
        BOARD = BOARD.move(playerMove);
        doingDrop = false;

        p5.redraw();
        if(BOARD.isGameOn()) { 
            console.info('computer move', playerMove); 
            AI_WORKER.postMessage({ p: BOARD.position, t: BOARD.turn(), d: 6 });
        }

        p5.loop();  
    }
    p5.draw = () => {
        p5.background(255, 255, 0);

        p5.stroke(0);
        p5.fill(255);
        p5.rect(-1, -1, p5.width+2, colWidth);  // top
    
        if (BOARD.isHumanTurn()) {  //
            playerMove = p5.floor(p5.mouseX / colWidth);
        }
          
        
        for(let r = 0; r < C4Board.NUM_ROWS; r++) {
            for(let c = 0; c < C4Board.NUM_COLUMNS; c++) {
                p5.fill(230);
                const current = BOARD.position[c].getPiece(r);
                if(current.color === C4Piece.BLUE) {
                    p5.fill(0, 0, 255);
                } else if (current.color === C4Piece.RED) {
                    p5.fill(255, 0, 0);
                }
                const cc = (c*colWidth + colWidth/2);
                const rr = height - (r*colWidth + 3*colWidth/2) + colWidth;  
                p5.ellipse(cc, rr, pieceWidth);
            }
        }
    
        p5.stroke(102, 102, 0);
        for(let x = colWidth; x < p5.width; x += colWidth) {
            p5.line(x, colWidth, x, p5.height)
        }
            
        if(!BOARD.isGameOn()) {
            p5.noStroke();
            p5.fill(0);
            if(winner == 1) {
                p5.fill(0, 0, 255);
            } else if (winner == 2) {
                p5.fill(255, 0, 0);
            }
    
            p5.textAlign(p5.CENTER, p5.CENTER);
            p5.textSize(64);
            if(BOARD.isDraw()) {
                p5.text('It is a tie.', p5.width/2, colWidth/2);    
            } else {
                p5.text(`${BOARD.isWin() === C4Piece.RED ? 'Red':'Blue'} won!`, p5.width/2, colWidth/2)
            }
    
        }
    
        p5.stroke(0);
        if(BOARD.isHumanTurn()) {
            p5.fill(0, 0, 255);
        } else if(!BOARD.isHumanTurn()) {
            p5.fill(255, 0, 0);
        } else {
            p5.fill(0, 255, 0);
        }
    
        if(!BOARD.isGameOn()) {
            p5.fill(0, 0, 0);
        }
    
        if(!BOARD.isGameOn() || doingDrop) {
            console.info('game not on, or drop', doingDrop)
            p5.noLoop();
        } else {
            p5.ellipse((playerMove + 0.5)*colWidth, colWidth/2, pieceWidth);
        }
    };
})
