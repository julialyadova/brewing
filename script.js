document.addEventListener("DOMContentLoaded", Init);

var canvas;
var context;
var scaleItem = 32;

var sources = 
  {
    0:      './tex/cauldron0.png', //0-4 фреймы котла
    1:      './tex/cauldron1.png',
    2:      './tex/cauldron2.png',
    3:      './tex/cauldron3.png',
    4:      './tex/cauldron4.png',
    5:      './tex/salt.png', //5-9 тарелки с ингредиентами
    6:      './tex/mushrooms.png',
    7:      './tex/slime.png',
    8:      './tex/bones.png',
    9:      './tex/warn.png',
    10:      './tex/one_salt.png', //10-14 отдельные ингредиенты
    11:      './tex/one_mushroom.png',
    12:      './tex/one_slime.png',
    13:      './tex/one_bone.png',
    14:      './tex/one_warn.png',    
    circle:  './tex/circle.png',
    witch0:   './tex/witch_0.png',
    witch1:   './tex/witch_1.png', 
    numbers:  './tex/numbers.png',
    potions:  './tex/potions.png',
  };

var images = {};

function Init() {
    //canvas
	  canvas = document.getElementById('myCanvas');
    context = canvas.getContext("2d");

    //размер canvas
    var size = scaleItem * 6;
    var pxScale = canvas.offsetWidth / size;
    context.canvas.width  = size;
    context.canvas.height = size;

    //шрифты
    context.font = "10px Arial";
    context.fillStyle = "#84ffff";
    context.textAlign = "center";

    //определение координат курсора
    function getMousePos(canvas, evt) {
      var rect = canvas.getBoundingClientRect();
      return {
          x: evt.clientX - rect.left,
          y: evt.clientY - rect.top
      };
    }

    //при клике мышью
    canvas.onclick = function(e)
    {
      ClickAt(getMousePos(canvas, e).x, getMousePos(canvas, e).y, pxScale);
    };
    
    //картинки
    for(var name in sources)
    {
      images[name] = new Image();
      images[name].src = sources[name];
    }
}

function ClickAt(x,y, scale)
{
    console.log("clicked at point" + x + ";" + y + " (px size)")
    console.log("clicked at point" + (x / scale) + ";" + (y / scale) + " (inside size)")

    //проверка клика на ингридиенты
    if (scaleItem * scale < y && y < scaleItem * 2 * scale) //строка, где находятся ингридиенты
    {
        for(var n = 0; n < 5; n++)
        {   
            //столбец ингридиента с индексом n
            if ((n * scaleItem* 1.25 * scale) < x && x < ((n * scaleItem * 1.25) + scaleItem) * scale)
            {
              IngredientClicked(n);
              return;
            }
        }
    }    
}

//GAMEPLAY
/**
 * Обработка клика на ингридиент
 * @param {*} n - номер ингредиента
 */
function IngredientClicked(n)
{
    console.log("clicked at ingredient " + n)
    context.drawImage(images.circle, n * (scaleItem * 1.25), scaleItem, scaleItem, scaleItem);

    var direct = getDirection(n * 1.25 * scaleItem, scaleItem, cauldronX+ scaleItem/2, cauldronY)
  
    flyingIngredients.push({id: n+10,
                            x: n * scaleItem* 1.25,
                            y: scaleItem*2,
                            direction: direct
                          });
}

var showSeqMode = true;
var toRepeatSequence = [0,0,0,0,0];
var currentIngredient = 5;
var repeatDelay = 0.1; //показывает, насколько быстро будут меняться картинки. где 1 - каждый фрейм. 0 -никогда
var currentFrame = 0;

/**
 * генерирует последовательность
 */
function GenerateSequence(){
  for(var i=0; i < toRepeatSequence.length; i++){
    toRepeatSequence[i] = getRandomInt(5);
    console.log(toRepeatSequence[i])
  }
}
/**
 * показывает последовательность ингредиентов
 */
function ShowSequence(){
    var n = Math.trunc(currentIngredient); //берем только целую часть числа
    if (n >= toRepeatSequence.length){
      currentIngredient = 0;
      showSeqMode = false;
      return;
    }
    var n = Math.trunc(currentIngredient); //берем только целую часть числа
    context.drawImage(images[10 + toRepeatSequence[n]], scaleItem, scaleItem * 4, scaleItem/2, scaleItem/2);
    context.drawImage(images.numbers, n*8, 0, 8, 16, scaleItem/2, scaleItem * 4, scaleItem/4, scaleItem/2);
    console.log("ingredient shown: " + toRepeatSequence[n])
    currentIngredient += repeatDelay;
}
/**
 * проверяет, соответствует ли ингридиент последовательности
 */
function CheckSequence(n){
    if (toRepeatSequence[currentIngredient] == n)
    {
      currentIngredient += 1;
      console.log("right!")
    }
    else{
      showSeqMode = true;
      currentIngredient = 0;
      score = 0;
      GenerateSequence();
      console.log("sequence interrupted")
    }
    if (currentIngredient >= toRepeatSequence.length){
      showSeqMode = true;
      currentIngredient = 0;
      score++;
      GenerateSequence();
      console.log("sequence finished")
    }
}

//SCORE
var score = 10;
function DrawScore(){
  context.drawImage(images.potions, 0, 0, score*16, 16, scaleItem/2, 0, score*scaleItem/2, scaleItem/2);
}

//CAULDRON
var cauldronX;
var cauldronY;
var cauldronFrame = 0;
/**
 * Анимация кипящего котла
 */
function AnimateCauldron(){
  if (cauldronFrame == 5)
        {
            cauldronFrame = 0;
        }            
        context.drawImage(images[cauldronFrame], cauldronX, cauldronY, scaleItem*2, scaleItem*2);
        cauldronFrame++;
}

//INGREDIENTS
var flyingIngredients = [];
/**
 * Анимация вылетающих при нажатии ингедиентов
 */
function AnimateFlyingIngredient(){
    var continueFlying = [];

    var count = flyingIngredients.length;

    for(var i = 0; i < count; i++){
      // выбираем ингридиент
      var ing = flyingIngredients.pop();

      //проверяем, что он ещё не в котле и рисуем
      if (ing.y < cauldronY + scaleItem/2)
      {
        //перемещаем
        ing.x += ing.direction.x;
        ing.y += ing.direction.y;
        //рисуем
        context.drawImage(images[ing.id], ing.x, ing.y, scaleItem/2, scaleItem/2);
        continueFlying.push(ing);

        console.log("flies number " + ing.id)
      }
      else
      {
        //когда ингредиент попадает в котел, проверяем, правильный ли он
        CheckSequence(ing.id - 10);
      }
    }

    count = continueFlying.length;
    for(var i = 0; i < count; i++){
      flyingIngredients.push(continueFlying.pop());
    }
};

//WITCH
var witchFrame = 0;
/**
 * Анимация ведьмы
 */
function AnimateWitch(){
    if (witchFrame < 5)
    {
      context.drawImage(images.witch0, scaleItem*4, scaleItem*2, scaleItem*2, scaleItem*4);
    } else if (witchFrame <= 10){
      context.drawImage(images.witch1, scaleItem*4, scaleItem*2, scaleItem*2, scaleItem*4);
      if (witchFrame == 10){
        witchFrame = 0;
      }
    }
    witchFrame++;
}


document.addEventListener("DOMContentLoaded", function ()
{

    cauldronX = context.canvas.width/2 - scaleItem;
    cauldronY = context.canvas.height/2;

    setInterval(function()
    {        
        context.clearRect(0, 0, canvas.width, canvas.height);
        
        //отрисовка ингридиентов
        for(var n = 5; n < 10; n++)
        {   
            context.drawImage(images[n], (n-5) * (scaleItem* 1.25), scaleItem, scaleItem, scaleItem);
        }

        if (showSeqMode) {
            ShowSequence();
        }

        AnimateCauldron();
        AnimateWitch();
        AnimateFlyingIngredient();

        DrawScore();

    }, 100);
});


//SOME HELP MATHS FUNCTIONS

//случайное число от 0 до max
function getRandomInt(max)
{
  return Math.floor(Math.random() * Math.floor(max));
}

//чтобы находить направление к котлу
function getDirection(startX, startY, destX, destY)
{
  return {
    x: (destX - startX) / 10,
    y: (destY - startY) / 10
  };
}