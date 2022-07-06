const numCol = 8;
const cellSizeVh = parseInt(getComputedStyle(document.body).getPropertyValue("--board-size")) / 8;
const viewportHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
const cellSize = cellSizeVh * viewportHeight / 100;

class Piece {
    constructor(type, square) {
        this.type = type;
        this.squareId = this.getSquareId(square);
        this.node = this.getPieceNode();
        this.display();
        this.element = document.getElementById(this.type);
        this.eventListener();
    }

    getSquareId(square) {
        let squareId = (square[1] - 1) * numCol + (square[0] - 1);
        return squareId;
    }

    getPieceNode() {
        let imgPath = "assets/" + this.type + ".png";
        let node = document.createElement("img");
        node.setAttribute("id", this.type);
        node.setAttribute("class", "piece");
        node.setAttribute("draggable", "false");
        node.setAttribute("src", imgPath);
        node.setAttribute("alt", "Chess piece");
        node.setAttribute("style", "width:var(--cell-size);");
        return node;
    }

    display() {
        let allSquares = document.getElementById("board").children;
        let squareElement = allSquares[this.squareId];  // parent div of img
        squareElement.setAttribute("id", "testAt");
        squareElement.appendChild(this.node);
    }

    eventListener() {
        let followMouse = true;

        this.element.addEventListener("mousedown", e => {
            followMouse = true
            this.element.style.cursor = "grabbing";
            let x = parseInt(e.clientX) - cellSize / 2;
            let y = parseInt(e.clientY) - cellSize / 2;
            this.element.style.left = x.toString() + "px";
            this.element.style.top = y.toString() + "px";
            
            document.addEventListener("mousemove", e => {
                if (followMouse == true) {
                    let x = parseInt(e.clientX) - cellSize / 2;
                    let y = parseInt(e.clientY) - cellSize / 2;
                    this.element.style.left = x.toString() + "px";
                    this.element.style.top = y.toString() + "px";
                }
            });
        });

        document.addEventListener("mouseup", e => {
            this.element.style.cursor = "pointer";
            followMouse = false
        });
    }

}

function randomSquare() {
    return [Math.floor(Math.random() * (numCol)) + 1, 
            Math.floor(Math.random() * (numCol)) + 1];
}

firstPiece = new Piece("white_rook", randomSquare());