//board
let  board
const rowCount=21
const columnCount=19
const tileSize=32
const boardWidth= columnCount * tileSize
const boardHeight= rowCount * tileSize
let context;


let blueGhostImage
let redGhostImage
let orangeGhostImage
let pinkGhostImage
let scaredGhostImage
let pacmanUpImage
let pacmanDownImage
let pacmanLeftImage
let pacmanRightImage
let wallImage



window.onload=function(){
    board= document.getElementById("board");
    board.height=boardHeight;
    board.width=boardWidth;
    context= board.getContext("2d") // used to draw on the board

    loadImages()
}

function loadImages(){
 wallImage= new Image();
 wallImage.src = "images/wall.png"

 blueGhostImage= new Image();
 blueGhostImage.src = "images/blueghost.png"

 redGhostImage= new Image();
 redGhostImage.src = "images/redghost.png"

 orangeGhostImage= new Image(); 
 orangeGhostImage.src = "images/orangeghost.png"

 pinkGhostImage= new Image();
 pinkGhostImage.src = "images/pinkghost.png"

 scaredGhostImage= new Image();
 scaredGhostImage.src = "images/scaredghost.png"

 pacmanUpImage= new Image();
 pacmanUpImage.src = "images/pacmanup.png"

 pacmanDownImage= new Image();
 pacmanDownImage.src = "images/pacmandown.png"

 pacmanLeftImage= new Image();
 pacmanLeftImage.src = "images/pacmanleft.png"

 pacmanRightImage= new Image();
 pacmanRightImage.src = "images/pacmanright.png"
}