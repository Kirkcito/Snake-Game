/*
document es un objeto global que representa el documento HTML cargado en el navegador.
Nos permite acceder y manipular el contenido de la página web.
*/

/*Obtenemos una referencia al div con la clase "Playground" donde sera el
area de juego.*/
const screen = document.querySelector('.Playground');

let lifes = 3; //Vidas iniciales de la serpiente

function updateLifes()
{
    document.getElementById('Lifes').textContent = "Lives: " + lifes;   //Mostramos las vidas en el HTML
}

let score = 0; //Puntuación inicial del juego

function updateScore()
{
    document.getElementById('Score').textContent = "Score: " + score; //Mostramos la puntuación en el HTML
}

//Cada celda del juego tendra un tamaño de 30px
let cellSize =  30; //px 
document.documentElement.style.setProperty('--cell-size', cellSize+'px');

const widthPx = screen.clientWidth;
const heightPx = screen.clientHeight;

const cols = Math.floor(widthPx/cellSize);
const rows = Math.floor(heightPx/cellSize);

let centerX = Math.floor(cols/2);
let centerY = Math.floor(rows/2);

let Currentdirection = 'right'; //Dirección inicial de la serpiente

//Se le da la posicion
let snake = [{x : centerX , y : centerY }];

//Ajustamos las columnas y filas en las variables CSS para que el grid se adapte al tamaño de la pantalla
document.documentElement.style.setProperty('--num-cols', cols);
document.documentElement.style.setProperty('--num-rows', rows);

//Creamos la manzana en una posición aleatoria dentro del área de juego, asegurándonos de que no aparezca en la posición inicial de la serpiente.
let apple = [{x: Math.floor(Math.random()*cols)+1, y: Math.floor(Math.random()*rows)+1}];

//Creamos Manzanas al azar.
function createApples()
{
    if(snake[0].x === apple[0].x && snake[0].y === apple[0].y)
        {
            //Aumentamos el score jejeje
            score += 10;
            updateScore();

            //Creamos una nuvea manzana con pos aleatoria
            const newApple = {x: Math.floor(Math.random()*cols)+1, y: Math.floor(Math.random()*rows)+1};

            apple[0] = newApple;
            //Al comer la manzana, la serpiente crece (no eliminamos la ultima posicion)
            incrementSnakeLenght();
        }
}

function incrementSnakeLenght()
{
    //Obtenemos la última posición de la serpiente
    const tail = snake[snake.length - 1];
    snake.push({x: tail.x, y: tail.y});
}

function reseatGame()
{
    lifes = 3;
    score = 0;
    resetPosition();
    updateScore();
    updateLifes();
}

function resetPosition()
{
    snake = [{x : centerX, y :centerY}];
    Currentdirection = 'right';
}

function draw()
{
    //Se usa para limpiar la pantalla antes de dibujar la serpiente
    screen.innerHTML = '';
    drawSnake();
    drawApple();
}

function drawApple()
{
    //Dibujar la manzana en la pantalla
    apple.forEach((position) => {
        const appleElement = createGameElement('div','apple');
        SetPosition(appleElement,position);
        screen.appendChild(appleElement);
    });
}

function drawSnake()
{
    //Dibujar cada segmento de la serpiente en la pantalla
    snake.forEach((segment) => {
        const snakeElement = createGameElement('div','snake');
        SetPosition(snakeElement,segment);
        screen.appendChild(snakeElement);
    });
}

function createGameElement(tag, className)
{
    //createElement se usa para crear un nuevo elemento HTML, dependiendo de lo que le pasemos por parametros.
    const element = document.createElement(tag);
    //Asignamos la clase al elemento para que tenga el estilo definido en CSS
    element.className = className;
    return element;
}

function SetPosition(element,position)
{
    //Usamos gridColumn y gridRow para colocar el elemento en la posición correcta dentro de la cuadrícula del juego
    element.style.gridColumn = position.x;
    element.style.gridRow = position.y;
}


document.addEventListener('keydown', (event) => {
    //Obtenemos la tecla presionada por el usuario
    const key = event.key;
    //Dependiendo de la tecla presionada, asignamos una dirección de movimiento a la serpiente
    switch(key)
    {
        case 'ArrowUp':
        if(Currentdirection !== 'down')    
            Currentdirection = 'up';
            break;
        case 'ArrowDown':
        if(Currentdirection !== 'up')
            Currentdirection = 'down';
            break;
        case 'ArrowLeft':
        if(Currentdirection !== 'right')
            Currentdirection = 'left';
            break;
        case 'ArrowRight':
        if(Currentdirection !== 'left')
            Currentdirection = 'right';
            break;
    }
}); 

function moveSnake()
{
    //Obtenemos la cabeza de la serpiente (el primer segmento)
    const head = snake[0];

    //Creamos una nueva posición para la cabeza de la serpiente basada en la dirección del movimiento
    const newHead = {x: head.x, y: head.y}; 

    switch(Currentdirection)
    {
        case 'up':
            newHead.y = head.y - 1;
            break;
        case 'down':
            newHead.y = head.y + 1;
            break;
        case 'left':
            newHead.x = head.x - 1;
            break;
        case 'right':
            newHead.x = head.x + 1;
            break;
    }
    
    //unshift agrega la nueva cabeza al inicio del array de la serpiente, lo que hace que la serpiente se mueva en la dirección deseada.
    snake.unshift(newHead); 

    //como solo queremos dar la ilusion de movimiento, por ahora, eliminamos la ultima dirección de la serpiente para que no crezca indefinidamente.
    snake.pop();

}

function checkCollision()
{
    //Obtenemos la cabeza de la serpiente
    const head = snake[0];

    //Verificamos si la cabeza colisiona con los bordes del area de juego.
    //Si la cabeza sale se reinica la posicion y reinicia la vida.
    if(head.x < 1 || head.x > cols || head.y < 1 || head.y > rows)
    {
        resetPosition();
        decreaseLives();
    }

}

function decreaseLives()
{
    //Reducimos las vidas cada vez que la serpiente colisiona con los bordes o con su propio cuerpo
    lifes-=1;
    updateLifes();
    if(lifes <= 0)
    {
        updateLifes();
        //Reiniciamos el juego y agregar pantalla de perdida
        reseatGame()
        alert("Game Over!");
    }
}

function gameLoop()
{
    updateLifes()
    updateScore();
    createApples()
    checkCollision();
    moveSnake();
    draw();
}

//Llamamos a la función gameLoop cada 100 milisegundos para actualizar el estado del juego y redibujar la serpiente en su nueva posición.
setInterval(gameLoop, 100);