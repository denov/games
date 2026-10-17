// asteroid clone
// arrow keys to move + x to shoot
//

var ship, bullets, asteroids,
    shipImage, bulletImage, particleImage,
    MARGIN = 40,
    gameInit = true,
    gameOn = true,
    score = 0,
    level = 1,
    defaultAstroidSize = 3,
    asteroidCount = 2,
    shipCount = 3,
    pointChart = {
        0: 0,
        1: 10,
        2: 4,
        3: 2,
        4: 1
    };


function setup() {
    createCanvas(windowWidth, windowHeight);
    bulletImage = loadImage('assets/asteroids_bullet.png');
    shipImage = loadImage('assets/asteroids_ship0001.png');
    particleImage = loadImage('assets/asteroids_particle.png');
    asteroids = new Group();
    bullets = new Group();
    gameStart(25);
}

function draw() {
    background(0);
    fill(255);
    checkBoundary();
    checkEvents();
    drawText();
    drawSprites();
}

function drawText() {
    textAlign(CENTER);
    text('Controls: Arrow Keys + X', width / 2, 20);
    text('Ships: '+ shipCount +'  Level:'+ level +'  Score: '+ score, width-100, 20);

    if(!gameOn) {
        text('> GAME OVER <', width / 2, height / 2);
        text('> Press p to play again <', width / 2, (height / 2)+20);
    }
    if(gameInit) {
        ship.remove();
        text('> Would you like to play a game? <', width / 2, height / 2);
        text('> Press p to play <', width / 2, (height / 2)+20);
    }
}

function checkEvents() {
    asteroids.bounce(asteroids);

    if(gameOn && !gameInit) {
        asteroids.overlap(bullets, hitAsteroid);
        asteroids.overlap(ship, hitShip);

        if (keyDown(LEFT_ARROW)) {
            ship.rotation -= 4;
        }
        if (keyDown(RIGHT_ARROW)) {
            ship.rotation += 4;
        }
        if (keyDown(UP_ARROW)) {
            ship.addSpeed(0.2, ship.rotation);
            ship.changeAnimation('thrust');
        } else {
            ship.changeAnimation('normal');
        }

        if (keyWentDown('x')) {
            var bullet = createSprite(ship.position.x, ship.position.y);
            bullet.addImage(bulletImage);
            bullet.setSpeed(10 + ship.getSpeed(), ship.rotation);
            bullet.life = 30;
            bullets.add(bullet);
        }

    } else {
        if (keyDown('p')) {
            gameInit = false;
            gameStart();
        }
    }
}

function checkBoundary() {
    for (var i = 0; i < allSprites.length; i++) {
        var s = allSprites[i];
        if (s.position.x < -MARGIN) s.position.x = width + MARGIN;
        if (s.position.x > width + MARGIN) s.position.x = -MARGIN;
        if (s.position.y < -MARGIN) s.position.y = height + MARGIN;
        if (s.position.y > height + MARGIN) s.position.y = -MARGIN;
    }
}

function createAsteroid(size, x, y) {
    var a = createSprite(x, y),
        img = loadImage('assets/asteroid' + floor(random(0, 3)) + '.png'),
        speed = (2.5 - (size / 2)) + random(0, level/10);

    a.addImage(img);
    a.setSpeed(speed, random(360));
    a.rotationSpeed = .5 + random(-0.2, 0.2) ;
    a.type = size;

    if (size === 3) a.scale = .8;
    if (size === 2) a.scale = .6;
    if (size === 1) a.scale = .3;

    a.mass = 2 + a.scale;
    a.setCollider('circle', 0, 0, 50);

    asteroids.add(a);
}

function createExplode(x,y) {
    for (var i = 0; i < 10; i++) {
        var p = createSprite(x, y);
        p.addImage(particleImage);
        p.setSpeed(random(3, 5), random(360));
        p.friction = 0.01;
        p.life = 15;
    }

}

function gameOver() {
    console.info('GAVE OVER');
    gameOn = false;
    ship.remove();
}

function gameStart(level) {
    console.info('game on');
    score = 0;
    level = level || 1;
    shipCount = 3;
    asteroidCount = level * 2;
    gameOn = true;

    ship = createSprite(width / 2, height / 2);
    ship.maxSpeed = 6;
    ship.friction = 0.02;
    ship.setCollider('circle', 0, 0, 20);
    ship.addImage('normal', shipImage);
    ship.addAnimation('thrust', 'assets/asteroids_ship0002.png', 'assets/asteroids_ship0007.png');
    ship.addAnimation('boom', 'assets/asteroids_ship0002.png', 'assets/asteroids_ship0007.png');

    asteroids.removeSprites();
    asteroids.clear();

    levelSetup(asteroidCount);
}

function hitAsteroid(asteroid, bullet) {
    updateScore(asteroid.type);

    var size = asteroid.type - 1;
    if (size > 0) {
        createAsteroid(size, asteroid.position.x, asteroid.position.y);
        createAsteroid(size, asteroid.position.x, asteroid.position.y);
        if(asteroids.size() % 4 === 0) {
            createAsteroid(size, asteroid.position.x, asteroid.position.y);
        }
    }
    createExplode(bullet.position.x, bullet.position.y)

    bullet.remove();
    asteroid.remove();
    if(asteroids.size() === 0) levelUp();
}

function hitShip() {
    console.info('hit, shit!!!');

    createExplode(ship.position.x, ship.position.y);

    ship.position.x = width / 2;
    ship.position.y = height / 2;
    shipCount--;
    if(shipCount < 0) {
        if(shipCount < 0 ) shipCount = 0;
        gameOver();
    }
}

function levelSetup(asteroidCount, size) {
    size = size || defaultAstroidSize;
    for (var i = 0; i < asteroidCount; i++) {
        var ang = random(360),
            px = width / 2 + 1000 * cos(radians(ang)),
            py = height / 2 + 1000 * sin(radians(ang));

        createAsteroid(size, px, py);
    }
}

function levelUp() {
    level++;
    asteroidCount += asteroidCount * 0.5;
    levelSetup(asteroidCount);
    if(level > 3) {
        levelSetup(level - 3, 4);
    }
}

function updateScore(type) {
    score += pointChart[type];
}