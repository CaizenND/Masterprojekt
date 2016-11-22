function Chessboard(canvas) {
  this.canvas = canvas;
  this.fields = [];
  this.pieces = [];
  // Weiß oben oder unten?
  this.orientation = 0;
  this.posX = 0;
  this.posY = 0;
  this.width = 0;
  this.height = 0;
  this.dragging = {};
  this.dragging.dragHoldX = null;
  this.dragging.dragHoldY = null;
  this.dragging.draggedPiece = null;
  this.SQUARE_SIZE = 55;
  this.BOARD_OFFSET_TOP = 44; // Beschriftung oben
  this.BOARD_OFFSET_LEFT = 44; // Beschriftung unten
  this.CANVAS_OFFSET_TOP = 0; // feier Raum oben
  this.CANVAS_OFFSET_LEFT = 0; // freier Raum unten
}

Chessboard.prototype.setup = function() {
  this.posX = this.CANVAS_OFFSET_LEFT;
  this.posY = this.CANVAS_OFFSET_TOP;
  this.width = this.BOARD_OFFSET_LEFT+(8*this.SQUARE_SIZE);
  this.height = this.BOARD_OFFSET_TOP+(8*this.SQUARE_SIZE);
  this.fields = new Array(8);
  for (var i = 0; i < 8; i++) {
    this.fields[i] = new Array();
  }
  for (var i = 0; i < 8; i++) {
    for (var j = 0; j < 8; j++) {
      var field = new Field(this);
      this.fields[i].push(field);
      var algebraicID = this.getLetterOfID(j+1) + (8-i);
      field.setAlgebraicID(algebraicID);
      field.setID(j+1, 8-i);
      field.setPosition(this.posX + this.BOARD_OFFSET_LEFT+(j*this.SQUARE_SIZE),
        this.posY + this.BOARD_OFFSET_TOP+(i*this.SQUARE_SIZE));
      field.setSize(this.SQUARE_SIZE);
      if ((i+j)%2 == 1) {
        field.setColor("BurlyWood");
      } else {
        field.setColor("Ivory");
      }
    }
  }
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
        currentField.setPosition(this.posX + this.BOARD_OFFSET_LEFT+(j*this.SQUARE_SIZE),
            this.posY + this.BOARD_OFFSET_TOP+(i*this.SQUARE_SIZE));
      } else {
        currentField.setPosition(this.posX + this.BOARD_OFFSET_LEFT+(j*this.SQUARE_SIZE),
            this.posY + this.BOARD_OFFSET_TOP+((7-i)*this.SQUARE_SIZE));
      }
    }
  }
};

Chessboard.prototype.draw = function() {
  var ctx = this.canvas.getContext("2d");
  ctx.save();
  ctx.fillStyle = "Black";
  var fontSize = Math.min(this.SQUARE_SIZE*0.5, this.BOARD_OFFSET_TOP*0.8);
  ctx.font = fontSize + "px Arial";
  ctx.textBaseline = "top";
  var text = "";
  var textPaddingTop = 0;
  var textPaddingLeft = 0;
  for (var i = 0; i < 8; i++) {
    for (var j = 0; j < 8; j++) {
      if (i == 0) {
        text = this.getLetterOfID(j+1);
        textPaddingTop = this.posY+(this.BOARD_OFFSET_TOP-fontSize)*0.5;
        textPaddingLeft = this.posX+(this.SQUARE_SIZE-ctx.measureText(text).width)*0.5;
        ctx.fillText(text,
          this.BOARD_OFFSET_LEFT+(j*this.SQUARE_SIZE)+textPaddingLeft,
          textPaddingTop);
      }
      if (j == 0) {
        if (this.orientation == 0) {
          text = 8-i;
        } else {
          text = i+1;
        }
        textPaddingTop = this.posY+(this.SQUARE_SIZE-fontSize)*0.5;
        textPaddingLeft = this.posX+(this.BOARD_OFFSET_LEFT-ctx.measureText(text).width)*0.5;
        ctx.fillText(text, textPaddingLeft,
          this.BOARD_OFFSET_TOP+(i*this.SQUARE_SIZE)+textPaddingTop);
      }
      this.fields[i][j].draw();
    }
  }
  ctx.strokeRect(this.posX+this.BOARD_OFFSET_LEFT,
    this.posY+this.BOARD_OFFSET_TOP,
    8*this.SQUARE_SIZE, 8*this.SQUARE_SIZE);
  ctx.restore();
  for (var i = 0; i < this.pieces.length; i++) {
    if (this.pieces[i] != this.dragging.draggedPiece) {
      this.pieces[i].draw();
    }
  }
  if (this.dragging.draggedPiece != null) {
    this.dragging.draggedPiece.draw();
  }
};

Chessboard.prototype.loadBoard = function(boardState) {
  // Prevent deleted pieces from loading their images and drawing to the canvas
  for (var i = 0; i < this.pieces.length; i++) {
    this.pieces[i].image.onload = null;
  }

  this.pieces = new Array();
  for (var i = 0; i < 8; i++) {
    for (var j = 0; j < 8; j++) {
      this.fields[i][j].setPiece(null);
    }
  }

  if (boardState != null) {
    for (var i = 0; i < 8; i++) {
      for (var j = 0; j < 8; j++) {
        //var index = 20 + (i*10) + (j+1);
        var currentPiece = null;
        switch (boardState[7-i][j]) {
          case 2: currentPiece = new Piece("white", "pawn", this); break;
          case 3: currentPiece = new Piece("black", "pawn", this); break;
          case 4: currentPiece = new Piece("white", "rook", this); break;
          case 5: currentPiece = new Piece("black", "rook", this); break;
          case 6: currentPiece = new Piece("white", "knight", this); break;
          case 7: currentPiece = new Piece("black", "knight", this); break;
          case 8: currentPiece = new Piece("white", "bishop", this); break;
          case 9: currentPiece = new Piece("black", "bishop", this); break;
          case 10: currentPiece = new Piece("white", "king", this); break;
          case 11: currentPiece = new Piece("black", "king", this); break;
          case 12: currentPiece = new Piece("white", "queen", this); break;
          case 13: currentPiece = new Piece("black", "queen", this); break;
          default: break;
        }
        if (currentPiece != null) {
          this.pieces.push(currentPiece);
          currentPiece.loadImage();
          this.fields[i][j].setPiece(currentPiece);
        }
      }
    }
  }
};
