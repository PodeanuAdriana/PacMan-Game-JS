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
const directions =['U','D','L','R']
let score = 0;
let lives = 3;
let gameOver=false;

window.onload=function(){
    board= document.getElementById("board");
    board.height=boardHeight;
    board.width=boardWidth;
    context= board.getContext("2d") // used to draw on the board

    loadImages()
    loadMap();
    for (let ghost of ghosts.values())
    {
        const newDirection =directions[Math.floor(Math.random()*4)]
        ghost.updateDirection(newDirection)

    }
    // console.log(walls.size)
    // console.log(foods.size)
    // console.log(ghosts.size)
    update()
    document.addEventListener("keyup",movePacman)
}

const tileMap = [
    "XXXXXXXXXXXXXXXXXXX",
    "X        X        X",
    "X XX XXX X XXX XX X",
    "X                 X",
    "X XX X XXXXX X XX X",
    "X    X       X    X",
    "XXXX XXXX XXXX XXXX",
    "OOOX X       X XOOO",
    "XXXX X XXrXX X XXXX",
    "O       bpo       O",
    "X  X X XXXXX X X  X",
    "OOOX X       X XOOO",
    "XXXX X XX  X X XXXX",
    "X        X        X",
    "X XX XXX X XXX XX X",
    "X  X     P     X  X",
    "XX X X XXXXX X X XX",
    "X    X   X   X    X",
    "X  XXXXX X XXXXX  X",
    "X                 X",
    "XXXXXXXXXXXXXXXXXXX" 
];

const walls = new Set();
const foods = new Set();
const ghosts = new Set();
let pacman;


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

function  loadMap(){
    walls.clear();
    foods.clear();
    ghosts.clear();

    for (let row=0; row<rowCount; row++){
        for (let column=0; column<columnCount; column++)
        {
        const R1 = tileMap[row];
        const titleMapChar = R1[column];

        const x= column * tileSize;
        const y= row * tileSize;

        if(titleMapChar=="X")
            {
            walls.add(new Block(wallImage,x,y,tileSize,tileSize));

           }
           else if(titleMapChar=="b"){ // blue ghost
            const ghost= new Block(blueGhostImage,x,y,tileSize,tileSize);
            ghosts.add(ghost);
           }
           else if(titleMapChar=="o"){// orange ghost
            const ghost= new Block(orangeGhostImage,x,y,tileSize,tileSize);
            ghosts.add(ghost);
           }
           else if(titleMapChar=="p"){// pink ghost
            const ghost= new Block(pinkGhostImage,x,y,tileSize,tileSize);
            ghosts.add(ghost);
           }
           else if(titleMapChar=="r"){// red ghost
            const ghost= new Block(redGhostImage,x,y,tileSize,tileSize);
            ghosts.add(ghost);
           }
            else if(titleMapChar=="P"){// pacman
            pacman= new Block(pacmanRightImage,x,y,tileSize,tileSize);
            }
            else if(titleMapChar==" "){// food    
                 const food= new Block(null,x+14,y+14,4,4);
                 foods.add(food);
            } 
        }
    }
}

function update(){
    if(gameOver){
        loadMap();
        resetPositions();
        lives = 3;
        score = 0;
        gameOver =false; 
        update();
        return;
    }
    move();
    draw();
    setTimeout(update,50) // 60 frames per second
}

function draw(){
    context.clearRect(0,0,board.width,board.height);
    context.drawImage(pacman.image,pacman.x,pacman.y,pacman.width,pacman.height);
    for(let ghost of ghosts){
        context.drawImage(ghost.image,ghost.x,ghost.y,ghost.width,ghost.height);
    }
    for(let wall of walls){
        context.drawImage(wall.image,wall.x,wall.y,wall.width,wall.height);
    }
    context.fillStyle="red";
    for(let food of foods){
        context.fillRect(food.x,food.y,food.width,food.height);
    }

    //score
    context.fillStyle="white"
    context.font= "24px sans-serif"
    if(gameOver)
    {
        context.fillText("Game Over: " + String(score),tileSize/2,tileSize/2);

    }
    else {
        context.fillText("x" + String(lives) + " " +String(score),tileSize/2,tileSize/2)
    }
}
function move(){
    pacman.x += pacman.velocityX;
    pacman.y += pacman.velocityY;

    //check for wall collision
    for (let wall of walls.values()){
        if(collision(pacman,wall)){
            pacman.x -= pacman.velocityX;
            pacman.y -= pacman.velocityY;
            break;
        }

}
 for (let ghost of ghosts.values())
 {
    if( collision(ghost,pacman)){
        lives -= 1;
        if(lives == 0)
        {
            gameOver = true;
            return; 
        }
        resetPositions();
    }
    if(ghost.y == tileSize*9 && ghost.direction != 'U' && ghost.direction != 'D')
    {
        ghost.updateDirection('U');
    }
    ghost.x += ghost.velocityX;
    ghost.y += ghost.velocityY;
    for (let wall of walls.values()){
        if(collision(ghost,wall) || ghost.x <= 0 || ghost.x +ghost.width >= boardWidth)
        {
            ghost.x -= ghost.velocityX;
            ghost.y -= ghost.velocityY;
            const newDirection = directions[Math.floor(Math.random()*4)];
            ghost.updateDirection(newDirection);
        }
    }
 }
 // check food collision

 let foodEaten = null;
 for (let food of foods.values())
 {
    if(collision(pacman,food))
    {
        foodEaten = food;
        score += 10;
        break;
    }
    foods.delete(foodEaten);
    
 }
 // next level

 if(foods.size == 0)
 {
    loadMap();
    resetPositions();
 }



}

function movePacman(e){
    // console.log(e.code);
    if(e.code=="ArrowUp" || e.code=="KeyW"){  
    
        pacman.updateDirection('U');
        pacman.image=pacmanUpImage;
    }
    else if(e.code=="ArrowDown" || e.code=="KeyS"){
        pacman.updateDirection('D');
        pacman.image=pacmanDownImage;
    }
    else if(e.code=="ArrowLeft" || e.code=="KeyA"){
        pacman.updateDirection('L');
        pacman.image=pacmanLeftImage;
    }
    else if(e.code=="ArrowRight" || e.code=="KeyD"){
        pacman.updateDirection('R');
        pacman.image=pacmanRightImage;
    }
}
function collision(a,b){
    return a.x < b.x + b.width &&
           a.x + a.width > b.x &&
           a.y < b.y + b.height &&
           a.y + a.height > b.y;
}   

function resetPositions(){
    pacman.reset();
    pacman.velocityX = 0;
    pacman.velocityY = 0;
    for (let ghost of ghosts.values())
    {
        ghost.reset();
        const newDirection = directions[Math.floor(Math.random()*4)];
        ghost.updateDirection(newDirection);
    }
}


class Block{
    constructor(image,x,y,width,height)
    {
        this.image=image;
        this.x=x;
        this.y=y;
        this.width=width;
        this.height=height;

        this.startX=x;
        this.startY=y;

        this.direction='R';
        this.velocityX=0;
        this.velocityY=0;

    }
    updateDirection(direction){
        const prevDirection=this.direction;
        this.direction=direction;
        this.updateVelocity();
        this.x += this.velocityX;
        this.y += this.velocityY;

        for (let wall of walls.values()){
            if(collision(this, wall))
            {
                this.x -= this.velocityX;
                this.y -= this.velocityY;
                this.direction =prevDirection;
                this.updateVelocity();
                return;
            }
        }
    }
    updateVelocity(){
        if(this.direction=='U'){
            this.velocityX=0;
            this.velocityY=-tileSize/4;
        } 
        else if(this.direction=='D'){
            this.velocityX=0;
            this.velocityY=tileSize/4;
        }
        else if(this.direction=='L'){
            this.velocityX=-tileSize/4;
            this.velocityY=0;
        }
        else if(this.direction=='R'){
            this.velocityX=tileSize/4;
            this.velocityY=0;
        }
    }
    reset(){
        this.x=this.startX;
        this.y=this.startY;
    }
}