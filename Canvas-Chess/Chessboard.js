function Chessboard(canvas) {
  this.canvas = canvas;
  this.fields = [];
  this.pieces = [];
  this.orientation = 0;
}

Chessboard.prototype.create = function() {
  this.fields = new Array(8);
  for (var i = 0; i < 8; i++) {
    this.fields[i] = new Array();
  }
  for (var i = 0; i < 8; i++) {
    for (var j = 0; j < 8; j++) {
      var field = new Field(this.canvas);
      this.fields[i].push(field);
      var fieldID = this.getLetterOfID(j+1) + (i+1);
      field.setBoardID(fieldID);
      field.setID(j+1, i+1);
      field.setPosition(P4WN_BOARD_OFFSET_LEFT+(j*P4WN_SQUARE_WIDTH),
        P4WN_BOARD_OFFSET_TOP+((7-i)*P4WN_SQUARE_HEIGHT));
      if ((i+j)%2 == 1) {
        field.setColor("BurlyWood");
      } else {
        field.setColor("Ivory");
      }

      /*
      if (i < 2 || i > 5) {
        var piece = null;
        if (i == 0) {
          if (j == 0 || j == 7) {
            piece = new Piece("white", "rook", this.canvas);
          }
          if (j == 1 || j == 6) {
            piece = new Piece("white", "knight", this.canvas);
          }
          if (j == 2 || j == 5) {
            piece = new Piece("white", "bishop", this.canvas);
          }
          if (j == 3) {
            piece = new Piece("white", "queen", this.canvas);
          }
          if (j == 4) {
            piece = new Piece("white", "king", this.canvas);
          }
        }
        if (i == 1) {
          piece = new Piece("white", "pawn", this.canvas);
        }
        if (i == 6) {
          piece = new Piece("black", "pawn", this.canvas);
        }
        if (i == 7) {
          if (j == 0 || j == 7) {
            piece = new Piece("black", "rook", this.canvas);
          }
          if (j == 1 || j == 6) {
            piece = new Piece("black", "knight", this.canvas);
          }
          if (j == 2 || j == 5) {
            piece = new Piece("black", "bishop", this.canvas);
          }
          if (j == 3) {
            piece = new Piece("black", "queen", this.canvas);
          }
          if (j == 4) {
            piece = new Piece("black", "king", this.canvas);
          }
        }
        piece.loadImage();
        this.pieces.push(piece);
        field.setPiece(piece);
      }
      */
    }
  }
  this.draw();
};

Chessboard.prototype.getLetterOfID = function(id) {
  var letter = "";
  switch (id) {
    case 1: letter = "a"; break;
    case 2: letter = "b"; break;
    case 3: letter = "c"; break;
    case 4: letter = "d"; break;
    case 5: letter = "e"; break;
    case 6: letter = "f"; break;
    case 7: letter = "g"; break;
    case 8: letter = "h"; break;
    default: letter = ""; break;
  }
  return letter;
};

Chessboard.prototype.switchPositions = function(orientation) {
  this.orientation = orientation;
  for (var i = 0; i < 8; i++) {
    for (var j = 0; j < 8; j++) {
      var currentField = this.fields[i][j];
      if (this.orientation == 0) {
        currentField.setPosition(P4WN_BOARD_OFFSET_LEFT+(j*P4WN_SQUARE_WIDTH),
        P4WN_BOARD_OFFSET_TOP+((7-i)*P4WN_SQUARE_HEIGHT));
      } else {
        currentField.setPosition(P4WN_BOARD_OFFSET_LEFT+(j*P4WN_SQUARE_WIDTH),
        P4WN_BOARD_OFFSET_TOP+(i*P4WN_SQUARE_HEIGHT));
      }
    }
  }
};

Chessboard.prototype.draw = function() {
  var ctx = this.canvas.getContext("2d");
  ctx.save();
  ctx.fillStyle = "White";
  ctx.fillRect(0, 0, 40+8*60, 40+8*60);
  ctx.fillStyle = "Black";
  var fontSize = Math.min(P4WN_SQUARE_HEIGHT*0.5, P4WN_BOARD_OFFSET_TOP*0.8);
  ctx.font = fontSize + "px Arial";
  ctx.textBaseline = "top";
  var text = "";
  var textPaddingTop = 0;
  var textPaddingLeft = 0;
  for (var i = 0; i < 8; i++) {
    for (var j = 0; j < 8; j++) {
      if (i == 0) {
        text = this.getLetterOfID(j+1);
        textPaddingTop = (P4WN_BOARD_OFFSET_TOP-fontSize)*0.5;
        textPaddingLeft = (P4WN_SQUARE_WIDTH-ctx.measureText(text).width)*0.5;
        ctx.fillText(text,
          P4WN_BOARD_OFFSET_LEFT+(j*P4WN_SQUARE_WIDTH)+textPaddingLeft,
          textPaddingTop);
      }
      if (j == 0) {
        if (this.orientation == 0) {
          text = 8-i;
        } else {
          text = i+1;
        }
        textPaddingTop = (P4WN_SQUARE_HEIGHT-fontSize)*0.5;
        textPaddingLeft = (P4WN_BOARD_OFFSET_LEFT-ctx.measureText(text).width)*0.5;
        ctx.fillText(text, textPaddingLeft,
          P4WN_BOARD_OFFSET_TOP+(i*P4WN_SQUARE_HEIGHT)+textPaddingTop);
      }
      this.fields[i][j].draw();
    }
  }
  ctx.restore();
  for (var i = 0; i < this.pieces.length; i++) {
    if (this.pieces[i] != this.canvas.draggedPiece) {
      this.pieces[i].draw();
    }
  }
  if (this.canvas.draggedPiece != null) {
    this.canvas.draggedPiece.draw();
  }
};

Chessboard.prototype.loadBoard = function(board_state) {
  /*
  // Prevent deleted pieces from loading their images and drawing to the canvas
  for (var i = 0; i < this.pieces.length; i++) {
    this.pieces[i].image.onload = null;
  }
  */
  this.pieces = new Array();
  for (var i = 0; i < 8; i++) {
    for (var j = 0; j < 8; j++) {
      this.fields[i][j].setPiece(null);
      var index = 20 + (i*10) + (j+1);
      var currentPiece = null;
      switch (board_state.board[index]) {
        case 2: currentPiece = new Piece("white", "pawn", this.canvas); break;
        case 3: currentPiece = new Piece("black", "pawn", this.canvas); break;
        case 4: currentPiece = new Piece("white", "rook", this.canvas); break;
        case 5: currentPiece = new Piece("black", "rook", this.canvas); break;
        case 6: currentPiece = new Piece("white", "knight", this.canvas); break;
        case 7: currentPiece = new Piece("black", "knight", this.canvas); break;
        case 8: currentPiece = new Piece("white", "bishop", this.canvas); break;
        case 9: currentPiece = new Piece("black", "bishop", this.canvas); break;
        case 10: currentPiece = new Piece("white", "king", this.canvas); break;
        case 11: currentPiece = new Piece("black", "king", this.canvas); break;
        case 12: currentPiece = new Piece("white", "queen", this.canvas); break;
        case 13: currentPiece = new Piece("black", "queen", this.canvas); break;
        default: break;
      }
      if (currentPiece != null) {
        this.pieces.push(currentPiece);
        currentPiece.loadImage();
        this.fields[i][j].setPiece(currentPiece);
      }
    }
  }
  this.draw();
}