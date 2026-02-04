
const screen = document.querySelector('.Playground');

//Aparecera en la pos x:30 y:20

let halfScreen = (screen.clientWidth/2);

let snake = [{x : halfScreen , y : 20 }];

let cellSize = 20

const widthPx = screen.clientWidth;
const heightPx = screen.clientHeight;

const cols = Math.floor(widthPx/cellSize);
const rows = Math.floor(heightPx/cellSize);


function draw()
{
    screen.innerHTML = '';
    drawSnake();
}

function drawSnake()
{
    snake.forEach((segment) => {
        const snakeElement = createGameElement('div','snake');
        SetPosition(snakeElement,segment);
        screen.appendChild(snakeElement);
    });
}

function createGameElement(tag, className)
{
    const element = document.createElement(tag);
    element.className = className;
    return element;
}

function SetPosition(element,position)
{
    element.style.gridColumn = position.x;
    element.style.gridRow = position.y;
}

draw();