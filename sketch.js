
var gameState = "PLAY";

var mario, mario_running, mario_collided;
var bg, bgImage;
var coinsGroup, coinImage;
var brickGroup, brickImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3;
var invisibleGround;
var coinScore=0;
var gameOver, restart;
var jumpSound,dieSound;

function preload(){
  mario_running =   loadAnimation("mario1.png","mario2.png","mario3.png");
  mario_collided = loadAnimation("collided.png");
  bgImage = loadImage("bg.png");
  coinImage = loadImage("coin.png");
  brickImage = loadImage("brick.png");
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obs2.png");
  obstacle3 = loadImage("obs3.png");
  jumpSound = loadSound("jump.mp3");
  coinSound = loadSound("coinSound.mp3");
  dieSound = loadSound("dieSound.mp3");
}

function setup() {
  createCanvas(1200, 600);
  textSize(20);
  fill("green");
  
  bg = createSprite(200,180,400,20);
  bg.addImage(bgImage);
  bg.x = bg.width /2;
  bg.velocityX = -6;
  bg.width=2000;
  gameOver = createSprite(300,100);
  mario = createSprite(200,510,20,50);
  
  mario.addAnimation("running", mario_running);
  mario.addAnimation("collided", mario_collided);
  mario.setCollider("rectangle",0,0,100,140);

  restart = createSprite(300,140);
  gameOver.scale = 0.5;
  restart.scale = 0.5;

  gameOver.visible = false;
  restart.visible = false;
  
  invisibleGround = createSprite(200,520,400,10);
  invisibleGround.visible = false;
  
  coinsGroup = new Group();
  obstaclesGroup = new Group();
  bricksGroup = new Group();
  coinScore = 0;
}

function draw() {
  
  background(255);
  if(mario.x<200){
    mario.x=200;
  }

  if (gameState==="PLAY"){
    
    bg.velocityX = -6;
    
    if(keyDown("space") && mario.y >= 309) {
      mario.velocityY = -16;
      jumpSound.play();
    }
    mario.velocityY = mario.velocityY + 0.5
  
    if (bg.x < 0){
      bg.x = bg.width/2;
    }
    for(var i = 0 ; i< (bricksGroup).length ;i++){
      var temp = (bricksGroup).get(i) ;
      
      if (temp.isTouching(mario)) {
         mario.collide(temp);
        }
          
      }

      for(var i = 0 ; i< (coinsGroup).length ;i++){
        var temp = (coinsGroup).get(i) ;
        
        if (temp.isTouching(mario)) {
          coinSound.play();
          coinScore++;
          temp.destroy();
          temp=null;
          }
            
        }
    spawnCoins();
    spawnObstacles();
    spawnBricks();
  
    if(obstaclesGroup.isTouching(mario)){
        dieSound.play();
        gameState = "END";
    }
  }
  else if (gameState === "END") {
    mario.setCollider("rectangle",0,0,200,40);
    bg.velocityX = 0;
    mario.velocityY = 0;
    mario.y =510;
    mario.changeAnimation("collided",mario_collided);
    obstaclesGroup.setLifetimeEach(-1);
    coinsGroup.setLifetimeEach(-1);
    bricksGroup.setLifetimeEach(-1);
    obstaclesGroup.setVelocityXEach(0);
    coinsGroup.setVelocityXEach(0);
    bricksGroup.setVelocityXEach(0);
  }
  mario.collide(invisibleGround);
  drawSprites();
  text("Coins Collected: "+ coinScore, 500,50);
  
}

function spawnCoins() {
  if (frameCount % 50 === 0) {
    var coin = createSprite(1200,120,40,10);
    coin.y = Math.round(random(80,350));
    coin.addImage(coinImage);
    coin.scale = 0.5;
    coin.velocityX = -3;
    coin.lifetime = 1200;
    coinsGroup.add(coin);
  }
}

function spawnObstacles() {
  if(frameCount % 100 === 0) {
    var obstacle = createSprite(1200,480,10,40);
    obstacle.velocityX = -4;
    switch(Math.round(random(1,3))){
    case 1:
        obstacle.addImage(obstacle1);
        break;
    case 2:
        obstacle.addImage(obstacle2);
        break;
    case 3:
        obstacle.addImage(obstacle3);
        break;    
    }
             
    obstacle.scale = 0.4;
    obstacle.lifetime = 300;
    obstaclesGroup.add(obstacle);
  }
}

function spawnBricks() {
  if (frameCount % 70 === 0) {
    var brick = createSprite(1200,120,40,10);
    brick.y = Math.round(random(50,450));
    brick.addImage(brickImage);
    brick.scale = 0.5;
    brick.velocityX = -5;
    bricksGroup.add(brick);
  }
  
}