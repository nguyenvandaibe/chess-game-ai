var expect = require('chai').expect;
var _ = require('lodash');
var tu = require('./TestUtils');
var ChessBoardRepresentation = require('../app/ChessBoard/ChessBoardRepresentation');
var ChessPiecesFactory = require('../app/ChessPiecesFactory');
var ChessSet = require('../app/ChessSet');
var ChessAi = require('../app/Chess.ai');

/**
 Test cases to check AI behaviour in specific situations
 */
describe('Tactics: AlphaBeta', function () {
  it('should prefer to beat enemy', function () {
    var board = tu.generateBasicGameState();

    board.select(1, 0).occupyBy(board.register(new ChessPiecesFactory.Pawn(ChessSet.white)));
    board.select(2, 1).occupyBy(board.register(new ChessPiecesFactory.Pawn(ChessSet.black)));
    board.setInControl = ChessSet.black;

    var chessAi = new ChessAi({
      strategy: 'alphabeta',
      depth: 3,
      initialState: board
    });
    chessAi.aiMove();

    var state = chessAi.board;

    expect(state.blackPieces.length).to.be.eql(2);
    expect(state.whitePieces.length).to.be.eql(1);
  });

  it('should prefer to beat more valuable enemy', function () {
    var board = tu.generateBasicGameState();

    board.select(1, 0).occupyBy(board.register(new ChessPiecesFactory.Pawn(ChessSet.white)));
    board.select(1, 2).occupyBy(board.register(new ChessPiecesFactory.Queen(ChessSet.white)));
    board.select(2, 1).occupyBy(board.register(new ChessPiecesFactory.Pawn(ChessSet.black)));
    board.setInControl = ChessSet.black;

    var chessAi = new ChessAi({
      strategy: 'alphabeta',
      depth: 3,
      initialState: board
    });
    chessAi.aiMove();
    var state = chessAi.board;

    expect(state.blackPieces.length).to.be.eql(2);
    expect(state.whitePieces.length).to.be.eql(2);
    expect(state.toFenNotation()).to.be.eql("4k3/8/8/8/8/8/P1p5/4K3");
  });

  it('should avoid being beaten', function () {
    var board = tu.generateBasicGameState();

    board.select(2, 0).occupyBy(board.register(new ChessPiecesFactory.Rook(ChessSet.white)));
    board.select(3, 3).occupyBy(board.register(new ChessPiecesFactory.Pawn(ChessSet.black)));

    var chessAi = new ChessAi({
      strategy: 'alphabeta',
      depth: 5,
      initialState: board
    });
    board.setInControl = ChessSet.black;
    chessAi.aiMove();
    var state = chessAi.board;


    expect(state.blackPieces.length).to.be.eql(2);
    expect(state.whitePieces.length).to.be.eql(2);
    expect(state.blackPieces[1].row).not.to.be.eql(2);
  });

  it('should maximize score', function () {
    var board = tu.generateBasicGameState();

    board.select(1, 0).occupyBy(board.register(new ChessPiecesFactory.Pawn(ChessSet.white)));
    board.select(1, 1).occupyBy(board.register(new ChessPiecesFactory.Pawn(ChessSet.white)));
    board.select(1, 2).occupyBy(board.register(new ChessPiecesFactory.Pawn(ChessSet.white)));
    board.select(1, 3).occupyBy(board.register(new ChessPiecesFactory.Pawn(ChessSet.white)));
    board.select(0, 1).occupyBy(board.register(new ChessPiecesFactory.Bishop(ChessSet.white)));
    board.select(0, 2).occupyBy(board.register(new ChessPiecesFactory.Bishop(ChessSet.white)));
    board.select(4, 3).occupyBy(board.register(new ChessPiecesFactory.Pawn(ChessSet.white)));
    board.select(0, 0).occupyBy(board.register(new ChessPiecesFactory.Rook(ChessSet.black)));
    board.setInControl = ChessSet.black;

    var chessAi = new ChessAi({
      strategy: 'alphabeta',
      initialState: board,
      depth: 3
    });

    var aiMove = chessAi.aiMove();
    var state = chessAi.board;
    console.log("\n " + state.toFenNotation());
    expect(state.whitePieces.length).to.be.eql(7);
    expect(state.blackPieces.length).to.be.eql(2);

    chessAi.playerMove({
      source: tu.makeMove(4, 3),
      target: tu.makeMove(5, 3)
    });
    chessAi.aiMove();
    state = chessAi.board;

    expect(state.whitePieces.length).to.be.eql(6);
    expect(state.blackPieces.length).to.be.eql(2);
    console.log("\n " + state.toFenNotation());
  });

  it('should avoid checkmate', function () {
    var board = new ChessBoardRepresentation();

    board.select(0, 0).occupyBy(board.register(new ChessPiecesFactory.King(ChessSet.white)));
    board.select(7, 6).occupyBy(board.register(new ChessPiecesFactory.King(ChessSet.black)));
    board.select(6, 5).occupyBy(board.register(new ChessPiecesFactory.Pawn(ChessSet.black)));
    board.select(6, 7).occupyBy(board.register(new ChessPiecesFactory.Pawn(ChessSet.black)));

    board.select(1, 6).occupyBy(board.register(new ChessPiecesFactory.Queen(ChessSet.white)));
    board.select(0, 6).occupyBy(board.register(new ChessPiecesFactory.Rook(ChessSet.white)));
    board.setInControl = ChessSet.black;

    var chessAi = new ChessAi({
      strategy: 'minmax',
      depth: 3,
      initialState: board
    });

    console.log("\nFEN: " + chessAi.board.toFenNotation());
    expect(chessAi.board.isCheck(ChessSet.black)).to.be.true;

    var aiMove = chessAi.aiMove();

    console.log(aiMove);

    console.log("FEN: " + chessAi.board.toFenNotation());

    expect(chessAi.board.select(7, 5).chessPiece).to.be.instanceOf(ChessPiecesFactory.King);
  });

  it('should avoid checkmate alphabeta', function () {
    var board = new ChessBoardRepresentation();

    board.select(0, 0).occupyBy(board.register(new ChessPiecesFactory.King(ChessSet.white)));
    board.select(7, 6).occupyBy(board.register(new ChessPiecesFactory.King(ChessSet.black)));
    board.select(6, 5).occupyBy(board.register(new ChessPiecesFactory.Pawn(ChessSet.black)));
    board.select(6, 7).occupyBy(board.register(new ChessPiecesFactory.Pawn(ChessSet.black)));

    board.select(1, 6).occupyBy(board.register(new ChessPiecesFactory.Queen(ChessSet.white)));
    board.select(0, 6).occupyBy(board.register(new ChessPiecesFactory.Rook(ChessSet.white)));
    board.setInControl = ChessSet.black;

    var chessAi = new ChessAi({
      strategy: 'alphabeta',
      depth: 5,
      initialState: board
    });

    console.log("\nFEN: " + chessAi.board.toFenNotation());
    expect(chessAi.board.isCheck(ChessSet.black)).to.be.true;

    var aiMove = chessAi.aiMove();

    console.log(aiMove);

    console.log("FEN: " + chessAi.board.toFenNotation());

    expect(chessAi.board.select(7, 5).chessPiece).to.be.instanceOf(ChessPiecesFactory.King);
  });

  //it('should not be retarded', function () {
  //  var chessAi = new ChessAi({
  //    strategy: 'alphabeta',
  //    depth: 2
  //  });
  //
  //  var aiMove;
  //
  //  chessAi.playerMove({source: tu.makeMove(1, 3), target: tu.makeMove(3, 3)});
  //  aiMove = chessAi.aiMove();
  //  expect(aiMove.action.source).to.be.eql(tu.makeMove(6, 0));
  //
  //  chessAi.playerMove({source: tu.makeMove(1, 2), target: tu.makeMove(2, 2)});
  //  aiMove = chessAi.aiMove();
  //  expect(aiMove.action.source).to.be.eql(tu.makeMove(5, 0));
  //
  //  chessAi.playerMove({source: tu.makeMove(1, 1), target: tu.makeMove(2, 1)});
  //  aiMove = chessAi.aiMove();
  //  expect(aiMove.action.source).to.be.eql(tu.makeMove(4, 0));
  //
  //  chessAi.playerMove({source: tu.makeMove(2, 1), target: tu.makeMove(3, 0)});
  //  aiMove = chessAi.aiMove();
  //  expect(aiMove.action).to.be.eql({source: tu.makeMove(7, 0), target: tu.makeMove(3, 0)});
  //
  //  chessAi.playerMove({source: tu.makeMove(1, 4), target: tu.makeMove(2, 4)});
  //  console.log("FROM HERE");
  //  aiMove = chessAi.aiMove();
  //  expect(aiMove.action).to.not.be.eql({source: tu.makeMove(3, 0), target: tu.makeMove(3, 3)});
  //});

});