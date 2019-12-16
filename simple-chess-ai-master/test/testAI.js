function move(board, color) {
    var game = [];

    for (var i = 0; i < 64; i++) {
        game[i] = 0;
    }

    var position = {
        'a1': 0,'b1': 1, 'c1': 2,'d1': 3,'e1': 4,'f1': 5,'g1': 6,'h1': 7,
        'a2': 8,'b2': 9,'c2': 10,'d2': 11,'e2': 12,'f2': 13,'g2': 14,'h2': 15,
        'a3': 16,'b3': 17,'c3': 18,'d3': 19,'e3': 20,'f3': 21,'g3': 22,'h3': 23,
        'a4': 24,'b4': 25,'c4': 26,'d4': 27,'e4': 28,'f4': 29,'g4': 30,'h4': 31,
        'a5': 32,'b5': 33,'c5': 34,'d5': 35,'e5': 36,'f5': 37,'g5': 38,'h5': 39,
        'a6': 40,'b6': 41,'c6': 42,'d6': 43,'e6': 44,'f6': 45,'g6': 46,'h6': 47,
        'a7': 48,'b7': 49,'c7': 50,'d7': 51,'e7': 52,'f7': 53,'g7': 54,'h7': 55,
        'a8': 56,'b8': 57,'c8': 58,'d8': 59,'e8': 60,'f8': 61,'g8': 62,'h8': 63,
    }

    /**
     * Chuyển json board tham số thành mảng game tính được
     * @param  {[type]} var i             [description]
     * @return {[type]}     [description]
     */
    for (var i = 0; i < board.length; i++) {
        game[position[board[i]['position']]] = {
            'piece': board[i]['piece'],
            'color': board[i]['color']
        }
    }

    var allMove = [];

    /**
     * [for description]
     * @param  {[type]} var i             [description]
     * @return {[type]}     [description]
     */
    for (var i = 0; i < 64; i++) {
        if (game[i] != 0 && game[i]['color'] === color) {
            allMove = allMove.concat(getAllMove(i));
        }
    }
// ///////////////////////////////////////////////////////////////////////  /////////////
    
    findBestMove(game, allMove);

    function findBestMove(game, allMove) {

        var bestMove = -9999;

        var bestMoveFound;
        
        for (var i = 0; i < allMove.length; i++) {

            // đi thử
            tryMove(game, allMove[i]);

            var value = 1; // tính hàm giá theo minimax

            // đưa bàn cờ về trạng thái trước
            // undoMove(allMove[i]);

            if (value > bestMove) {
                bestMove = value;
                bestMoveFound = allMove[i];
            }
        }
    }
    // sau   đó convert bestMoveFound về dạng start và stop

    function tryMove(game, move) {
        game[move['to']] = {
            'piece': game[move['from']].piece,
            'color': game[move['from']].color
        }

        game[move['from']] = 0;
    }

    function undoMove(game, move) {
        
    }



    //
    // var move = Math.floor(Math.random() * allMove.length);
    // console.log(move);
    // var rowStart = Math.floor(allMove[move]['from'] / 8);
    // var colStart = allMove[move]['from'] - rowStart * 8;
    // var rowStop = Math.floor(allMove[move]['to'] / 8);
    // var colStop = allMove[move]['to'] - rowStop * 8;
    // var start, stop;
    start = getPosition(colStart, rowStart);
    stop = getPosition(colStop, rowStop);
    console.log(start);
    console.log(stop);
    return {
        start: start,
        stop: stop
    }

    /**
     * Kiem tra nuoc di hop le
     * @param  {[int]} row [description]
     * @param  {[int]} col [description]
     * @return {[bool]}     [description]
     */
    function checkMoveValid(row, col) {
        if (col < 0 || col > 7 || row < 0 || row > 7) {
            return false;
        }
        var index = row * 8 + col;
        if (game[index]['color'] === color) {
            return false;
        }
        return true;
    }
    
    /**
     * [getPosition description]
     * @param  {[type]} col [description]
     * @param  {[type]} row [description]
     * @return {[type]}     [description]
     */
    function getPosition(col, row) {
        var start;
        switch (col) {
            case 0:
                start = 'a' + (row + 1);
                break;
            case 1:
                start = 'b' + (row + 1);
                break;
            case 2:
                start = 'c' + (row + 1);
                break;
            case 3:
                start = 'd' + (row + 1);
                break;
            case 4:
                start = 'e' + (row + 1);
                break;
            case 5:
                start = 'f' + (row + 1);
                break;
            case 6:
                start = 'g' + (row + 1);
                break;
            default:
                start = 'h' + (row + 1);
                break;
        }
        return start;
    }
    
    /**
     * Lấy tất cả các nước đi có thể
     * @param  {[type]} index [description]
     * @return {[type]}       [description]
     */
    function getAllMove(index) {
        var allMove = [];
        var row = Math.floor(index / 8);
        var col = index - row * 8;
        //Pawn
        if (game[index]['piece'] === 'p') {
            if (color === 'w') {
                if (checkMoveValid(row + 1, col) && game[index + 8] === 0) {
                    allMove[allMove.length] = {
                        'from': index,
                        'to': index + 8
                    };
                }
                if (index > 7 && index < 16 && checkMoveValid(row + 2, col) && game[index + 8] === 0) {
                    allMove[allMove.length] = {
                        'from': index,
                        'to': index + 16
                    };
                }
                if (checkMoveValid(row + 1, col + 1) && game[index + 9]['color'] === 'b') {
                    allMove[allMove.length] = {
                        'from': index,
                        'to': index + 9
                    };
                }
                if (checkMoveValid(row + 1, col - 1) && game[index + 7]['color'] === 'b') {
                    allMove[allMove.length] = {
                        'from': index,
                        'to': index + 7
                    };
                }
            }
            if (color === 'b') {
                if (checkMoveValid(row - 1, col) && game[index - 8] === 0) {
                    allMove[allMove.length] = {
                        'from': index,
                        'to': index - 8
                    };
                }
                if (index > 47 && index < 56 && checkMoveValid(row - 2, col) && game[index - 8] === 0) {
                    allMove[allMove.length] = {
                        'from': index,
                        'to': index - 16
                    };
                }
                if (checkMoveValid(row - 1, col + 1) && game[index - 7]['color'] === 'w') {
                    allMove[allMove.length] = {
                        'from': index,
                        'to': index - 7
                    };
                }
                if (checkMoveValid(row - 1, col - 1) && game[index - 9]['color'] === 'w') {
                    allMove[allMove.length] = {
                        'from': index,
                        'to': index - 9
                    };
                }
            }
        }
        // Rook
        if (game[index]['piece'] === 'r' || game[index]['piece'] === 'q') {
            //
            for (var i = row + 1; i < 8; i++) {
                var dex = i * 8 + col;
                if (!checkMoveValid(i, col)) {
                    break;
                }
                allMove[allMove.length] = {
                    'from': index,
                    'to': dex
                };
                if (game[dex]['color'] != color) {
                    break;
                }
            }
            //
            for (var i = row - 1; i > 0; i--) {
                var dex = i * 8 + col;
                if (!checkMoveValid(i, col)) {
                    break;
                }
                allMove[allMove.length] = {
                    'from': index,
                    'to': dex
                };
                if (game[dex]['color'] != color) {
                    break;
                }
            }
            //
            for (var i = col + 1; i < 8; i++) {
                var dex = row * 8 + i;
                if (!checkMoveValid(row, i)) {
                    break;
                }
                allMove[allMove.length] = {
                    'from': index,
                    'to': dex
                };
                if (game[dex]['color'] != color) {
                    break;
                }
            }
            //
            for (var i = col - 1; i > 0; i--) {
                var dex = row * 8 + i;
                if (!checkMoveValid(row, i)) {
                    break;
                }
                allMove[allMove.length] = {
                    'from': index,
                    'to': dex
                };
                if (game[dex]['color'] != color) {
                    break;
                }
            }
        }
        // Knight
        if (game[index]['piece'] === 'n') {
            //
            var dex = [
                [row + 2, col + 1],
                [row + 2, col - 1],
                [row - 2, col + 1],
                [row - 2, col - 1],
                [row + 1, col + 2],
                [row + 1, col - 2],
                [row - 1, col + 2],
                [row - 1, col - 2]
            ];
            for (var i = 0; i < dex.length; i++) {
                if (checkMoveValid(dex[i][0], dex[i][1])) {
                    allMove[allMove.length] = {
                        'from': index,
                        'to': dex[i][0] * 8 + dex[i][1]
                    };
                }
            }
        }
        // Bishop
        if (game[index]['piece'] === 'b' || game[index]['piece'] === 'q') {
            //
            var i = row + 1,
                j = col + 1;
            var dex = i * 8 + j;
            while (checkMoveValid(i, j)) {
                allMove[allMove.length] = {
                    'from': index,
                    'to': dex
                };
                if (game[dex]['color'] != color) {
                    break;
                }
                i += 1;
                j += 1;
                dex = i * 8 + j;
            }
            //
            i = row - 1, j = col - 1;
            dex = i * 8 + j;
            while (checkMoveValid(i, j)) {
                allMove[allMove.length] = {
                    'from': index,
                    'to': dex
                };
                if (game[dex]['color'] != color) {
                    break;
                }
                i -= 1;
                j -= 1;
                dex = i * 8 + j;
            }
            //
            i = row - 1, j = col + 1;
            dex = i * 8 + j;
            while (checkMoveValid(i, j)) {
                allMove[allMove.length] = {
                    'from': index,
                    'to': dex
                };
                if (game[dex]['color'] != color) {
                    break;
                }
                i -= 1;
                j += 1;
                dex = i * 8 + j;
            }
            //
            i = row + 1, j = col - 1;
            dex = i * 8 + j;
            while (checkMoveValid(i, j)) {
                allMove[allMove.length] = {
                    'from': index,
                    'to': dex
                };
                if (game[dex]['color'] != color) {
                    break;
                }
                i += 1;
                j -= 1;
                dex = i * 8 + j;
            }
        }
        return allMove;
    }
}