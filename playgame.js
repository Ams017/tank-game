document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.querySelector('#myCanvas');
    const c = canvas.getContext('2d');
    const mapWidth = mapData.map.width;
    const mapHeight = mapData.map.height;

    canvas.width = innerWidth - 20;
    canvas.height = innerHeight - 20;

    const blocks = [];
    
    let mouseX = 0, mouseY = 0;
    
    class Turret {
        constructor(player) {
            this.player = player;
            this.width = 30;
            this.height = 10;
            this.rotation = 0;
        }
        draw() {
            c.save();
            c.translate(this.player.x + this.player.width / 2, this.player.y + this.player.height / 2);
            c.rotate(this.rotation);
            c.fillStyle = 'crimson';
            c.fillRect(0, -this.height / 2, this.width, this.height); // Draw the turret starting from the player's position
            c.restore();
            
        }
        update(mouseX, mouseY) {
            const dx = mouseX - (this.player.x + this.player.width / 2);
            const dy = mouseY - (this.player.y + this.player.height / 2);
            this.rotation = Math.atan2(dy, dx);
            this.draw();
        }
    }

    class Player {
        constructor(x, y, width, height, colour) {
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
            this.colour = colour;
            this.speed = 3;
            this.rotation = 3 * (Math.PI / 2);
            this.turret = new Turret(this);
        }
        draw() {
            c.save();
            c.translate(this.x + this.width / 2, this.y + this.height / 2);
            c.rotate(this.rotation);
            c.fillStyle = this.colour;
            c.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
            c.restore();
            this.turret.draw();
        }
        update(mouseX, mouseY) {
            this.turret.update(mouseX, mouseY);
            this.draw();
        }  
         
    }

    class Bullet {
        constructor(x, y, radius, colour, velocity) {
            this.x = x;
            this.y = y;
            this.radius = radius;
            this.colour = colour;
            this.velocity = velocity;
        }
        draw() {
            c.beginPath();
            c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
            c.fillStyle = this.colour;
            c.fill();
            c.stroke();
        }
        update() {
            this.draw();
            this.x += this.velocity.x;
            this.y += this.velocity.y;
        }
    }

    class Border {
        constructor() {
            this.x = 10;
            this.y = 10;
            this.width = mapWidth + 20;
            this.height = mapHeight + 20;
        }
        draw() {
            c.stokeStyle = 'black';
            c.lineWidth = 20;
            c.strokeRect(this.x, this.y, this.width, this.height);
        }
    }
    
    class Block {
        constructor(x, y, width, height, colour) {
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
            this.colour = colour;
            this.isDragging = false;
        }
        draw() {
            c.fillStyle = this.colour;
            c.fillRect(this.x, this.y, this.width, this.height);
        }
        update() {
            this.draw();
        }
    }

    mapData.blocks.forEach((block) => {
        blocks.push(new Block(block.x + 10, block.y + 10, block.width, block.height, 'green'));
        //draw the blocks
        blocks[blocks.length - 1].draw();
    });

    const player = new Player(innerWidth / 2 - 10, innerHeight / 2 - 10, 40, 30, 'red');
    player.draw();

    const bullets = [];
    const keys = {
        w: false,
        a: false,
        s: false,
        d: false,
        ArrowUp: false,
        ArrowLeft: false,
        ArrowDown: false,
        ArrowRight: false,
        b: false
    };

    let cursorX = 0;
    let cursorY = 0;

    window.addEventListener('mousemove', (event) => {
        cursorX = event.clientX;
        cursorY = event.clientY;
    });

    window.addEventListener('keydown', (event) => {
        keys[event.key] = true;
    });

    window.addEventListener('keyup', (event) => {
        keys[event.key] = false;
    });

    window.addEventListener('click', (event) => {
        const angle = Math.atan2(event.clientY - (player.y + player.height / 2), event.clientX - (player.x + player.width / 2));
        const velocity = {
            x: Math.cos(angle) * 5,
            y: Math.sin(angle) * 5
        };
        const bullet = new Bullet(player.x + player.width / 2, player.y + player.height / 2, 5, 'blue', velocity);
        bullets.push(bullet);
        console.log('Bullet created:', bullet);
    });

    function checkCollisionX(bullet, block) {
        return bullet.x + bullet.radius > block.x &&
               bullet.x - bullet.radius < block.x + block.width;
    }
     
    function checkCollisionY(bullet, block) {
        return bullet.y + bullet.radius > block.y &&
               bullet.y - bullet.radius < block.y + block.height;
    }

    function animate() {
        requestAnimationFrame(animate);
        c.clearRect(0, 0, canvas.width, canvas.height);
        player.update(mouseX, mouseY);
        blocks.forEach((block) => {
            block.update();
        });

        // Update player position based on key presses
        if (keys.w || keys.W ||  keys.ArrowUp) {
            player.x += Math.cos(player.rotation) * player.speed;
            player.y += Math.sin(player.rotation) * player.speed;
        }
        if (keys.s || keys.S ||  keys.ArrowDown) {
            player.x -= Math.cos(player.rotation) * player.speed;
            player.y -= Math.sin(player.rotation) * player.speed;
        }
        if (keys.a || keys.A || keys.ArrowLeft) {
            player.rotation -= 0.06;
        }
        if (keys.d || keys.D ||  keys.ArrowRight) {
            player.rotation += 0.06;
        }

        bullets.forEach((bullet, bulletIndex) => {
            bullet.update();
            // Remove bullets that go off screen
            if (bullet.x + bullet.radius < 0 || bullet.x - bullet.radius > canvas.width || bullet.y + bullet.radius < 0 || bullet.y - bullet.radius > canvas.height) {
                bullets.splice(bulletIndex, 1);
            }

            // Check for collisions with blocks
            blocks.forEach((block) => {
                if (checkCollisionX(bullet, block)) {
                    // Bounce the bullet off the block
                    if (bullet.x + bullet.radius >= block.x || bullet.x - bullet.radius <= block.x + block.width)
                        if (bullet.y >= block.y && bullet.y <= block.y + block.height) {
                            bullet.velocity.x = -bullet.velocity.x;
                    }
                }
                if (checkCollisionY(bullet, block)) {
                    if (bullet.y + bullet.radius >= block.y || bullet.y - bullet.radius <= block.y + block.height) {
                        if (bullet.x >= block.x && bullet.x <= block.x + block.width) {
                        bullet.velocity.y = -bullet.velocity.y;
                        }
                    }
                }
            });

        });
    }
    animate();

    const mapBorder = new Border();
    mapBorder.draw();

    let data = {
        "map": {
            "width": mapWidth,
            "height": mapHeight
        },
        "blocks": []
    };

});