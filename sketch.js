var PLAY = 1;
var END = 0;
var gameState = PLAY;

var alien, alien_running, alien_collided;
var ground, invisibleGround;
var obstaclesGroup, obstacle1;
var backgroundImg;
var score = 0;
var gameOver, restart;

function preload(){
  backgroundImg = loadImage("assets/background0.png");
  
  alien_running = loadAnimation("assets/alien10.png","assets/alienWalk20.png");
  alien_collided = loadAnimation("assets/alienHit0.png");
  obstacle1 = loadImage("assets/atronaut0.png");
  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("reset.png");
}


function setup() {
  createCanvas(650, windowHeight);
  
  alien = createSprite(50,height-70,20,50);
  alien.addAnimation("running", alien_running);
  alien.addAnimation("collided", alien_collided);
  alien.setCollider('circle',0,0,80);
  alien.scale = 0.5;
  
  invisibleGround = createSprite(width/2,height-10,width,125);
  invisibleGround.shapeColor = "cyan";
  invisibleGround.visible = false;
  
  ground = createSprite(width/2,height/2,width,height);
  ground.addImage(backgroundImg);
  ground.x = width/2;
  ground.velocityX = -(6+3*score/100);
  
  gameOver = createSprite(width/2, height/2-50);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(width/2, height/2);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.5;
  restart.scale = 0.1;

  
  gameOver.visible = false;
  restart.visible = false;
  invisibleGround.visible = false;
  
  obstaclesGroup = new Group();
  
  score = 0;
  
}

function draw() {
 //alien.debug = true;
  background(0);
  textSize(20);
  fill("black");
  text("Score: "+score,30,50);
  
  
  if (gameState===PLAY){
    score = score + Math.round(getFrameRate()/60);
    ground.velocityX = -(6+3*score/100);
    
    if((touches.lenght > 0 || keyDown("SPACE")) && alien.y > height-120){
      alien.velocityY = -10;
      touches = [];
      //alien.changeAnimation "jumping"
    }
    
    alien.velocityY = alien.velocityY + 0.8;
    
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
    alien.collide(invisibleGround);
    spawnObstacles();
    
    if (obstaclesGroup.isTouching(alien)){
      gameState = END;
    }

  }
  else if (gameState === END){
    gameOver.visible = true;
    restart.visible = true;
    
    //set velocity of each game object to 0
    
    ground.velocityX = 0;
    alien.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    
    //change gato animation
    alien.changeAnimation("collided", alien_collided);
   // alien.setCollider('circle',0,-20,80);

    //set lifetime to the game objects
    obstaclesGroup.setLifetimeEach(-1);
    
    if(touches.lenght>0 || keyDown ("ENTER")){
      reset();
      touches = [];
    }
  }
  
  drawSprites();
}

function spawnObstacles (){
  if(frameCount % 60 === 0){
    var obstacle = createSprite(width,height-110,20,30);
    obstacle.setCollider('circle',0,0,2);
    //obstacle.debug = true
    obstacle.addImage(obstacle1);
    
    obstacle.velocityX = -(6+3*score/100);
    
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
    obstacle.depth = invisibleGround.depth -1;
    alien.depth = obstacle.depth +1;
    ground.depth = invisibleGround.depth -1;
    score.depth = alien.depth -1;
    
    obstaclesGroup.add(obstacle);
    console.log(ground.depth);
  }
}

function reset (){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  alien.changeAnimation("running",alien_running);
  
  score = 0;
}