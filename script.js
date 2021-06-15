const cvs = document.querySelector('canvas');
const ctx = cvs.getContext('2d');

const board = new Image();
const foodImg = new Image();

board.src = 'img/board.png';
foodImg.src = 'img/pizza.png';

const box = 32;

const snake = [];
snake[0] = {
    x: 9 * box,
    y: 10 * box
}

let score = 0;
let foodPosition = generateFoodPosition();
let snakeDirection;

window.addEventListener('keydown', snakeMoveHandler);

function snakeMoveHandler(e){
    if(e.keyCode === 37 && snakeDirection !== 'right') snakeDirection = 'left';
    else if(e.keyCode === 38 && snakeDirection !== 'down') snakeDirection = 'up';
    else if(e.keyCode === 39 && snakeDirection !== 'left') snakeDirection = 'right';
    else if(e.keyCode === 40 && snakeDirection !== 'up') snakeDirection = 'down';
}

function drawScore(){
    ctx.fillStyle = 'white';
    ctx.font = '50px Arial';
    ctx.fillText(score, 2 * box, 1.7 * box);
    ctx.drawImage(foodImg, 0.85 * box, 0.7 * box);
}

function generateFoodPosition(){
    let snakeCell = false;

    const randomPos = {
        x: Math.floor(Math.random() * 17 + 1) * box,
        y: Math.floor(Math.random() * 15 + 3) * box
    }

    for(let i = 0; i < snake.length; i++){
        if(randomPos.x === snake.x && randomPos.y === snake.y) snakeCell = true;
    }

    if(snakeCell) generateFoodPosition();
    else return randomPos;
}

function foodIsEaten(snakeX, snakeY){
    if(snakeX === foodPosition.x && snakeY === foodPosition.y){
        foodPosition = generateFoodPosition();
        score++;
    }else snake.pop();
}

function checkBounds(snakeX, snakeY){
    if(snakeX < box || snakeX > 17 * box || snakeY < 3 * box || snakeY > 17 * box) clearInterval(game);
}

function eatTail(head, arr){
    for(let i = 0; i < arr.length; i++){
        if(head.x === arr[i].x && head.y === arr[i].y) clearInterval(game);
    }
}

function drawGame(){
    ctx.drawImage(board, 0, 0);
    ctx.drawImage(foodImg, foodPosition.x, foodPosition.y);

    for(let i = 0; i < snake.length; i++){
        ctx.fillStyle = i == 0 ? '#3A5311' : 'green';
        ctx.fillRect(snake[i].x, snake[i].y, box, box);
    }

    drawScore();

    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    foodIsEaten(snakeX, snakeY);

    if(snakeDirection === 'left') snakeX -= box;
    else if(snakeDirection === 'right') snakeX += box;
    else if(snakeDirection === 'up') snakeY -= box;
    else if(snakeDirection === 'down') snakeY += box;

    checkBounds(snakeX, snakeY);

    let newHead = {
        x: snakeX,
        y: snakeY
    }

    eatTail(newHead, snake);

    snake.unshift(newHead);
}

const game = setInterval(() => {
    drawGame();
}, 200);