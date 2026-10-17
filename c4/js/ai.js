import { C4Board, C4Column, C4Piece } from './c4.js';

onmessage = (e) => {
    console.log('Message received', e.data);
        
    const posistions = e.data.p.map(p => new C4Column(p.container)),
        board = new C4Board(posistions, new C4Piece(e.data.t.color), e.data.d),
        bestMove = findBestMove(board);
    
    console.info('best move', board, bestMove)
    postMessage(bestMove);
  }
  

const findBestMove = (board, maxDepth = 6) => {
    let bestEval = -Infinity;
    let bestMove = -1;
    for(const move of board.legalMoves()) {
        let result = minimax(board.move(move), false, board.turn(), maxDepth);  
        if (result > bestEval) {
            bestEval = result;
            bestMove = move;
        }  
    }
    return bestMove;
}

const minimax = (board, maximizing, player, maxDepth = 8, alpha = -Infinity, beta = Infinity) => {
    if(board.isWin() || board.isDraw() || maxDepth == 0) {
        let score = board.evaluate(player) 
        return score;;
    }

    if(maximizing) {
        for(const move of board.legalMoves()) {
            const result = minimax(board.move(move), false, player, maxDepth-1, alpha, beta);
            alpha = Math.max(result, alpha);
            if(beta <= alpha) {
                break
            }    
        }
        return alpha;
    } 
    else {
        for(const move of board.legalMoves()) {
            const result = minimax(board.move(move), true, player, maxDepth-1, alpha, beta);
            beta = Math.min(result, beta);
            if(beta <= alpha) {
                break
            }
        }
        return beta;
    }

}
