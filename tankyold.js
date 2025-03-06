document.addEventListener('DOMContentLoaded', () => {
    const guestButton = document.getElementById('guestButton');
    const loginButton = document.getElementById('loginButton');

    if (guestButton) {
        guestButton.addEventListener('click', () => {
            startGame('guest');
        });
    }

    if (loginButton) {
        loginButton.addEventListener('click', () => {
            window.location.href = 'login.php';
        });
    }

    // Check if the user is logged in
    fetch('isloggedin.php')
        .then(response => response.json())
        .then(data => {
            if (data.loggedIn) {
                startGame('loggedIn');
            }
        });

    function startGame(mode) {
        // Hide the menu if it exists
        const menu = document.querySelector('.menu');
        if (menu) {
            menu.style.display = 'none';
        }

        // Initialize the game
        animate();
    }

    const canvas = document.querySelector('#myCanvas');
    const c = canvas.getContext('2d');

    canvas.width = innerWidth - 20;
    canvas.height = innerHeight - 20;

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
            console.log("test");
            this.turret.update(mouseX, mouseY);
            console.log(mouseX, mouseY);
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

    let selectedBlock = null;
    let offsetX, offsetY;

    canvas.addEventListener('mousedown', (event) => {
        const mouseX = event.clientX - canvas.offsetLeft;
        const mouseY = event.clientY - canvas.offsetTop;

        blocks.forEach((block) => {
            if (mouseX > block.x && mouseX < block.x + block.width && mouseY > block.y && mouseY < block.y + block.height) {
                selectedBlock = block;
                offsetX = mouseX - block.x;
                offsetY = mouseY - block.y;
                block.isDragging = true;
            }
        });
    });

    canvas.addEventListener('mousemove', (event) => {
        mouseX = event.clientX - canvas.offsetLeft;
        mouseY = event.clientY - canvas.offsetTop;
    
        if (selectedBlock && selectedBlock.isDragging) {
            selectedBlock.x = mouseX - offsetX;
            selectedBlock.y = mouseY - offsetY;
        }
        
    });

    canvas.addEventListener('mouseup', () => {
        if (selectedBlock) {
            selectedBlock.isDragging = false;
            selectedBlock = null;
        }
    });

    const player = new Player(innerWidth / 2 - 10, innerHeight / 2 - 10, 40, 30, 'red');
    player.draw();

    const bullets = [];
    const blocks = [];
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
        if (event.key === 'b' || event.key === 'B') {
            const block = new Block(cursorX - 25, cursorY - 25, 10, 100, 'green');
            blocks.push(block);
            console.log('Block created:', block);
        }
        if (event.key === 'n' || event.key === 'N') {
            const block = new Block(cursorX - 25, cursorY - 25, 100, 10, 'green');
            blocks.push(block);
            console.log('Block created:', block);
        }
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

            // Check for collisions with player
        

        });

        blocks.forEach((block) => {
            block.draw();
        });
    }

    animate();

    if (!guestButton && !loginButton) {
        startGame('direct');
    }
});