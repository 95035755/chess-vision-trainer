const numCol = 8;
const cellSizeVh = parseInt(getComputedStyle(document.body).getPropertyValue("--board-size")) / 8;
const viewportHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
const cellSize = cellSizeVh * viewportHeight / 100;
var highlighted = false;
const assets = "neo-assets/";

// based on css margins of .game
const marginX = vw(50) - cellSize*numCol/2;
const marginY = vh(2);
var hovered_square_div;

class Piece {
    constructor(type, square) {
        this.type = type;
        this.squareArray = square;
        this.squareId = this.getSquareId(square);
        this.node = this.getPieceNode();
        this.displayPiece();
        this.element = document.getElementById(this.type);
        this.eventListener();
    }

    getSquareId(square) {
        let squareId = (square[1] - 1) * numCol + (square[0] - 1);
        return squareId;
    }

    getPieceNode() {
        let imgPath = assets + this.type + ".png";
        let node = document.createElement("img");
        node.setAttribute("id", this.type);
        node.setAttribute("class", "piece");
        node.setAttribute("draggable", "false");
        node.setAttribute("src", imgPath);
        node.setAttribute("alt", "Chess piece");
        node.setAttribute("style", "width:var(--cell-size);");
        return node;
    }

    getSquareDiv(square) {
        let allSquares = document.getElementById("html-board").children;
        let squareElement = allSquares[square];
        return squareElement;
    }

    getPiecePosition() {
        let pos = [];
        pos[0] = (this.squareArray[0] - 1) * cellSize;
        pos[1] = (this.squareArray[1] - 1) * cellSize;
        return pos;
    }

    // displays piece img on the html board
    displayPiece() {
         let piecesDiv = document.getElementById("pieces");
         piecesDiv.appendChild(this.node);
        let piece = document.getElementById(this.type);
        let pos = this.getPiecePosition();
        piece.style.left = pos[0].toString() + "px";
        piece.style.top = pos[1].toString() + "px";
    }

    eventListener() {
        let followMouse = true;
        let legalSquares = this.getLegalSquares();

        // click on piece
        this.element.addEventListener("mousedown", e => {
            followMouse = true
            this.element.style.cursor = "grabbing";
            let x = parseInt(e.clientX) - cellSize / 1.5;
            let y = parseInt(e.clientY) - cellSize / 1.5;
            this.element.style.left = x.toString() + "px";
            this.element.style.top = y.toString() + "px";

            if (highlighted == false) {
                this.highlightLegalSquares();
                highlighted = true;
            }
            
            let currentlyHighlightedDivs = [];
            
            // piece follow mouse
            document.addEventListener("mousemove", e => {
                if (followMouse == true) {

                    // ** 1. Piece follow mouse **
                    let x = parseInt(e.clientX) - cellSize / 1.5;
                    let y = parseInt(e.clientY) - cellSize / 1.5;
                    this.element.style.left = x.toString() + "px";
                    this.element.style.top = y.toString() + "px";
                    
                    // ** 2. highlight hovered square **
                    let hoveredSquareId = this.getHoveredSquareId(e.clientX, e.clientY);
                    
                    if (hoveredSquareId != undefined) {  // undefined when mouse is not over board
                        let hoveredSquareDiv = this.getSquareDiv(hoveredSquareId);
                        hovered_square_div = hoveredSquareDiv;  // future reference for unhighlighting

                        if (currentlyHighlightedDivs.length > 0){
                            currentlyHighlightedDivs[0].style.background = "transparent";
                            currentlyHighlightedDivs.shift();
                        }

                        hoveredSquareDiv.style.background = "lightyellow";
                        currentlyHighlightedDivs.push(hoveredSquareDiv);
                    }
                }
            });
        });

        document.addEventListener("mouseup", e => {
            this.element.style.cursor = "pointer";
            if (followMouse) {
                followMouse = false;
                this.putDownPiece(e.clientX, e.clientY);
            }
        });
    }

    // called on "mousedown" in this.eventListener();
    highlightLegalSquares() {
        let legalSquares = this.getLegalSquares();

        // highlight which square the piece came from
        let squareElement = this.getSquareDiv(this.squareId);
        squareElement.style.border = "5px solid teal";


        // create circles to highlight legal squares
        for (let i of legalSquares) {
            var squareDiv = this.getSquareDiv(i);
            
            let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            svg.setAttribute("class", this.type + "-legalcircle");
            svg.setAttribute("width", cellSize);
            svg.setAttribute("height", cellSize);
            
            let circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            circle.setAttribute("cx", cellSize/2);
            circle.setAttribute("cy", cellSize/2);
            circle.setAttribute("r", 20);
            circle.setAttribute("fill", "olive");
            circle.setAttribute("opacity", "0.3");
            
            svg.appendChild(circle);
            squareDiv.appendChild(svg);

        }
    }

    // find the square the mouse is on
    getHoveredSquareId(clientX, clientY) {
        let square = [Math.ceil((clientX - marginX) / cellSize), Math.ceil((clientY - marginY) / cellSize)];

        // make sure you're hovering within the board area
        if (square[0] > 8 || square[1] > 8 || square[0] < 1 || square[1] < 1) {
            console.log("returned")
            return undefined;
        }
        let squareId = this.getSquareId(square);
        return squareId;
    }

    // returns in Id format
    getLegalSquares() {
        // ** only works for rook **

        let allLegalSquares = [];

        // rook can move along the row
        for (let i = 1; i <= numCol; i++) {
            let legalSquare = []
            if (i != this.squareArray[0]) {
                legalSquare[0] = i;
                legalSquare[1] = this.squareArray[1];
                allLegalSquares.push(legalSquare);
            }
        }

        // rook can move along the column
        for (let i = 1; i <= numCol; i++) {
            let legalSquare = []
            if (i != this.squareArray[1]) {
                legalSquare[0] = this.squareArray[0];
                legalSquare[1] = i;
                allLegalSquares.push(legalSquare);
            }
        }
        

        // convert squareArray to squareId
        let legalSquaresId = [];

        for (let i = 0; i < allLegalSquares.length; i++) {

            legalSquaresId[i] = this.getSquareId(allLegalSquares[i]);
        }

        return legalSquaresId;
        
    }

    // places the piece image on the square the mouse hovers if legal.
    putDownPiece(mouseX, mouseY) {
        let legalSquares = this.getLegalSquares();
        let boardBound = document.getElementById("html-board").getBoundingClientRect();

        mouseX = Math.ceil(mouseX / cellSize);
        mouseY = Math.ceil(mouseY / cellSize);
        let mouseSquare = [mouseX, mouseY];
        let mouseSquareId = this.getSquareId(mouseSquare);

        // unhighlight squares
        let allSvgs = document.getElementsByClassName(this.type + "-legalcircle");
        let length = allSvgs.length;
        for (let i = 0; i < length; i++) {
            allSvgs[0].parentElement.removeChild(allSvgs[0]);
        }

        // unhighlight home square
        let squareElement = this.getSquareDiv(this.squareId);
        squareElement.style.border = "";

        // unhighlight hovered square
        hovered_square_div.style.background = "";

        highlighted = false;

        // update object properties, make sure mouseSquare is within 8x8 board and its legal
        if (legalSquares.includes(mouseSquareId) && mouseSquare[0] < 9 && mouseSquare[1] < 9) {
            this.squareArray = mouseSquare;
            this.squareId = mouseSquareId;
        }

        this.displayPiece();

    }
}

function randomSquare() {
    return [Math.floor(Math.random() * (numCol)) + 1, 
            Math.floor(Math.random() * (numCol)) + 1];
}

//firstPiece = new Piece("white_rook", randomSquare());
wr = new Piece("wr", [1, 8]);




// Utils functions
function vh(v) {
    var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    return (v * h) / 100;
  }
  
function vw(v) {
    var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    return (v * w) / 100;
}