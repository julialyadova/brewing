
var context = null;
var canvas = null;
var scaleItem = 32;

var score = 0;
var pause = false;

function loadImages(sources, callback)
{
    var images = {};
    var loadedImages = 0;
    var numImages = 0;
    // get num of sources
    for(var src in sources)
    {
      numImages++;
    }
    for(var src in sources)
    {
      images[src] = new Image();
      images[src].onload = function()
      {
        if(++loadedImages >= numImages)
        {
          callback(images);
        }
      };
      images[src].src = sources[src];
    }
  }

  var sources = 
  {
    0:    './tex/cauldron0.png',
    1:    './tex/cauldron1.png',
    2:    './tex/cauldron2.png',
    3:    './tex/cauldron3.png',
    4:    './tex/cauldron4.png',
    5:    './tex/salt.png',
    6:    './tex/mushrooms.png',
    7:    './tex/slime.png',
    8:    './tex/bones.png',
    9:    './tex/warn.png',    
  };

  function getRandomInt(max)
  {
    return Math.floor(Math.random() * Math.floor(max));
  }


document.addEventListener('keydown', function(event)
{
    if(event.code == "KeyP")
    {
        pause = !pause;
    }
  });


var cauldronX;
var cauldronY;

var cauldronFrame = 0;

document.addEventListener("DOMContentLoaded", function ()
{
    canvas = document.getElementById('myCanvas');
    context = canvas.getContext("2d");

    context.canvas.width = scaleItem * 6;
    context.canvas.height = scaleItem * 6;
    context.font = "20px Arial";
    context.fillStyle = "#84ffff";
    context.textAlign = "center";

    cauldronX = context.canvas.width/2 - scaleItem;
    cauldronY = context.canvas.height/2;


    setInterval(function()
    {
        if(pause)
        {
            return;
        }

        loadImages(sources, function(images)
        {

            context.clearRect(0, 0, canvas.width, canvas.height);

            //draw Cauldron
            if (cauldronFrame == 5)
            {
                cauldronFrame = 0;
            }            
            context.drawImage(images[cauldronFrame], cauldronX, cauldronY, scaleItem*2, scaleItem*2);
            cauldronFrame++;

            //draw Ingredients
            for(var n = 5; n < 10; n++)
            {   
                context.drawImage(images[n], (n-5) * (scaleItem* 1.25), scaleItem, scaleItem, scaleItem);
            }
        });
    }, 100);
});