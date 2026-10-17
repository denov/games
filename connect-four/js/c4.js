const NUM_ROWS = 6;
const NUM_COLUMNS = 7;

let SEGS = null
function genSegments(cols = NUM_COLUMNS, rows = NUM_ROWS, segLength = 4) {
    if(SEGS !== null) return SEGS;
    const segs = [];

    // veritcal
    for (let c = 0; c < cols; c++) {
        for (let r = 0; r < rows - segLength+1; r++) {
            const seg = [];
            for(let t = 0; t <= segLength-1; t++) {                
                seg.push([c, r + t]);
            }
            segs.push(seg);
        }
    }

    // horizontal
    for(let c = 0; c < cols - segLength +1; c++) {
        for(let r = 0; r < rows; r++) {
            const seg = [];
            for(let t = 0; t <= segLength-1; t++) {                
                seg.push([c + t, r]);
            }
            segs.push(seg);
        }
    }

    // diag up right
    for(let c = 0; c < cols - segLength +1; c++) {
        for(let r = 0; r < rows - segLength +1; r++) {
            const seg = [];
            for(let t = 0; t <= segLength-1; t++) {                
                seg.push([c + t, r + t]);
            }
            segs.push(seg);            
        }
    }

    // diag down right
    for(let c = 0; c < cols - segLength +1; c++) {
        for(let r = segLength-1; r < rows; r++) {
            const seg = [];
            for(let t = 0; t <= segLength-1; t++) {                
                seg.push([c + t, r - t]);
            }
            segs.push(seg);            
        }
    }
    SEGS = segs;
    return segs;
}


export class C4Piece {

    static EMPTY = 0;
    static BLUE = 1;
    static RED = 2;  
    
    constructor(color = C4Piece.EMPTY) {
        this.color = color
    }

    opposite() {
        if(this.color === C4Piece.BLUE) {
            return new C4Piece(C4Piece.RED);
        } else if(this.color === C4Piece.RED) {
            return new C4Piece(C4Piece.BLUE);
        } else {
            return new C4Piece();
        }
    }
}

export class C4Column {

    container;  

    constructor(container = []) {
        this.container = [ ...container];
    }

    isFull() {
        return this.container.length == NUM_ROWS;
    }

    push(item) {
        this.container.push(item);  // C4Piece
    }

    getPiece(idx) {
        return this.container[idx] || new C4Piece();
    }

    copy() {
        return new C4Column(this.container)
    }

}

export class C4Board {

    static NUM_ROWS = 6;
    static NUM_COLUMNS = 7;

    #segments = genSegments();
    #turn;          // C4Piece
    position = [];  // C4Columns

    constructor(position = null, turn = new C4Piece(C4Piece.BLUE)) {
        if(position == null) {
            this.position = Array(NUM_COLUMNS)
                              .fill(0).map(() => { return new C4Column(); }) 

        } else {
            this.position = [ ...position];  //  need to be Columns
        }

        this.#turn = turn;
    }

    turn() {
        return this.#turn;
    }

    isHumanTurn() {
        return this.#turn.color === C4Piece.BLUE;
    }

    isComputerTurn() {
        return !this.isHumanTurn();
    }

    move(location) {
        const tempPosition = [ ...this.position];
        for(let c=0; c < NUM_COLUMNS; c++) {
            tempPosition[c] = this.position[c].copy();
        }
        tempPosition[location].push(this.#turn);

        return new C4Board(tempPosition, this.#turn.opposite())
    }

    legalMoves() {
        const moves = [];
        for(let c=0; c < NUM_COLUMNS; c++) {
            if(!this.position[c].isFull()) {
                moves.push(c);
            }    
        }
        return moves;
    }

    isWin() {
        for(const segment of this.#segments) {
            const counts = this._countSegments(segment);
            if(counts.blue === 4) {
                return C4Piece.BLUE;
            }
            if(counts.red === 4) { 
                return C4Piece.RED;
            }
        }
        return 0;
    }
    
    isDraw() {
        return !this.isWin() & this.legalMoves().length == 0;
    }

    isGameOn() { 
        return !this.isDraw() && !this.isWin();
    }

    evaluate(player) {  // C4Piece
        let total = 0;
        for(const segment of this.#segments) {  // make dynamic 
            total += this._evaluate_segment(segment, player)
        }
        return total;
    }

    _evaluate_segment(segment, player) {
        let score = 0;

        const counts = this._countSegments(segment);
        if(counts.blue > 1 && counts.red > 1) {
            return score;
        }

        const maxCount = Math.max(counts.blue, counts.red);
        if(maxCount == 1) {
            score = 1;
        }
        if(maxCount == 2) {
            score = 10;
        }
        else if(maxCount == 3) {
            score = 1000;
        }
        else if(maxCount == 4) {
            score = 10000000;
        }

        let color = C4Piece.BLUE;
        if(counts.red > counts.blue) {
            color = C4Piece.RED;
        }

        if(color != player.color) {
            return -score;
        }
        return score;
    }

    _countSegments(segment) {
        const counts = {
            blue: 0,
            red: 0            
        }
        // track number in row
        segment.forEach(s => {   
            const r = s[0];
            const c = s[1];
            const p = this.position[r].getPiece(c).color;
            if(p === C4Piece.BLUE) {
               counts.blue++;
            } else if(p === C4Piece.RED) {
                counts.red++;
            }   
        });

        return counts;
    }

}
