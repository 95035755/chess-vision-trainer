const numCol = 8;

class Piece {
    constructor(type, square) {
        this.type = type;
        this.square = square;
    }

    getSquareId() {
        let squareId = (this.square[1] - 1) * numCol + (this.square[0] - 1);
        return squareId;
    }

    getPieceNode() {
        let imgPath = "assets/" + this.type + ".png";
        let node = document.createElement("img");
        node.setAttribute("id", "piece");
        node.setAttribute("draggable", "false");
        node.setAttribute("src", imgPath);
        node.setAttribute("alt", "Chess piece");
        node.setAttribute("style", "width:var(--cell-size);");
        return node;
    }

    display() {
        let squareId = this.getSquareId();
        let allSquares = document.getElementById("board").children;
        let squareElement = allSquares[squareId];
        console.log(allSquares);
        squareElement.setAttribute("id", "testAt");
        let pieceNode = this.getPieceNode();
        squareElement.appendChild(pieceNode);
    }
}

function randomSquare() {
    return [Math.floor(Math.random() * (numCol)) + 1, 
            Math.floor(Math.random() * (numCol)) + 1];
}

firstPiece = new Piece("white_rook", randomSquare());
firstPiece.display();
