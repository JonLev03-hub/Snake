const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");
canvas.width = 720;
canvas.height = 720;

var squareSize = 15
var borderSize = 1
var squareSpace = squareSize + borderSize*2
var boardWidth = 30
var boardHeight = 30
var boardWidthpx;
var boardHeightpx;
var playing = false

var score = 0
var highscore = 0

var snakeBody;
var direction;
var fruit;



function makeBoard() {
    boardWidthpx = boardWidth * squareSpace +2
    boardHeightpx = boardHeight * squareSpace +2
    canvas.width = boardWidthpx;
    canvas.height = boardHeightpx;
    for (i = 0;i < boardWidth;i++){
        for (j = 0;j < boardHeight;j++){
            colorSquare({x:i,y:j})
        }
    }

}
makeBoard()

function colorSquare(location,color="grey") {
    c.fillStyle = color
    x = location.x * squareSpace+borderSize
    y = location.y * squareSpace + borderSize
    c.fillRect(x + 1,y + 1,squareSize,squareSize)
}

// fruit function
function spawnFruit() {
    let newLocation = {x:Math.floor(Math.random()*boardWidth),y:Math.floor(Math.random()*boardHeight)}
    worked = true
    for (i = 0; i < snakeBody.length;i++) {
        segment = snakeBody[i]
        if (segment.x == newLocation.x && segment.y == newLocation.y){
            worked = false
        }
    }
    if (worked) {
        fruit = newLocation
        colorSquare(fruit,"red")
    } else {
        spawnFruit()
    }
}

// Start game function
function startGame(){

    // reset values
    snakeBody = [{
        x:2,
        y:2,
    }]
    score = 0
    direction = ""

    // color board
    for (i = 0;i < boardWidth;i++){
        for (j = 0;j < boardHeight;j++){
            colorSquare({x:i,y:j})
        }
    }

    spawnFruit()
    playing = true
}
function endGame(){
    playing = false
    button.show()
    highscore = Math.max(score,highscore)
    $("#highscore").text(`Highscore: ${highscore}`)
}

// Change board size
$( "#width" ).change( (e) => {
    if (!playing){
        let value = $( "#width" ).val()
        if (value > 5 && value <=99) {
            boardWidth = value
        }
    }
    $( "#width" ).val(boardWidth)
    makeBoard()
});
$( "#height" ).change((e) => {
    if (!playing){
        let value = $( "#height" ).val()
        if (value > 5 && value <=99) {
            boardHeight = value
        }
    }
    $( "#height" ).val(boardHeight)
    makeBoard()
});

// play button code
const button = $("#play").select()
button.on("click",(e) => {
    button.hide()
    startGame()
})

window.addEventListener("keydown",(e) => {
    key = e.key
    if (playing) {
        switch (key) {
        case "w","ArrowUp":
            direction = "up";
            break;
        case "a","ArrowLeft":
            direction = "left";
            break;
        case "s","ArrowDown":
            direction = "down";
            break;
        case "d","ArrowRight":
            direction = "right";
            break;
        default:
            break;
    }} else if(key = "Enter"){
        button.hide()
        startGame()
    }

})
// game logic loop
window.setInterval(()=> {
    if (playing) {

        // set the scoreboard
        $("#score").text(`Score: ${score}`)
        // find new head position
        let jsonHead = JSON.stringify(snakeBody[snakeBody.length-1])
        let head = JSON.parse(jsonHead)
        switch (direction) {
            case "up":
                head.y -=1
                break;
            case "down":
                head.y +=1

                break;
            case "left":
                head.x -=1

                break;
            case "right":
                head.x +=1

                break;            
        
            default:
                break;
        }
        // check if head is past wall
        if (head.x < 0 || head.y < 0 || head.x > boardWidth-1 || head.y > boardHeight-1) endGame()

        // check if head is hitting part of body
        for (i = 0; i < snakeBody.length;i++) {
            segment = snakeBody[i]
            if (segment.x == head.x && segment.y == head.y && score > 0){
                endGame()
            }
        }
        // remove last piece of tail
        if (snakeBody.length > score + 3){
            last = snakeBody.shift()
            colorSquare(last)
        }
        // draw head
        snakeBody.push(head)
        colorSquare(head,"white")
        
        
        // check if we got fruit
        if (head.x == fruit.x && head.y == fruit.y){
            score += 5
            spawnFruit()
        }
    }
},100)
