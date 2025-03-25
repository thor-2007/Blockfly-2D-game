// Lager en variabel for kuben min:
var myGamePiece;
// Lager variabel for vegger:
var myObstacles = [];
// Lager variabel for score:
var myScore;

// Her starter jeg spillet:
function startGame(){
    myGameArea.start();  // Kaller på start-funksjonen til myGameArea for å sette opp spilleområdet

    myScore = new component("30px", "Consolas", "black", 280, 40, "text");
    myScore.text = "SCORE: 0";  // Initialize score text

    // Her legger jeg til farge til variabelen min:
    myGamePiece = new component(30, 30, "red", 10, 120); // Kan redigere figuren her!
}

// Her lager jeg mitt spille-område!
let myGameArea = {
    // Lager et nytt canvas-element som er det området der spillet vises
    canvas : document.createElement("canvas"),
    // Funksjon som setter opp spilleområdet når spillet starter
    start: function() {
        this.canvas.width = 480;
        this.canvas.height = 270; 
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);

        this.frameNo = 0;
        this.interval = setInterval(updateGameArea, 20);  // Start spillsløyfen (game loop)

        // Legger til event lyttere for tastetrykk
        window.addEventListener('keydown', function (e) {
            myGameArea.keys = (myGameArea.keys || []);
            myGameArea.keys[e.key] = (e.type == "keydown");
        });
        window.addEventListener('keyup', function (e) {
            myGameArea.keys[e.key] = (e.type == "keydown");
        });
    },
    // Funksjon for å tømme canvas (clear canvas)
    clear: function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    // Funksjon for å stoppe spillet
    stop: function() {
        // Create a container for the game over screen and the button
        let gameOverContainer = document.createElement("div");
        gameOverContainer.classList.add("game-over-container");

        // Create the "Game Over" message
        let h1El = document.createElement("h1");
        h1El.innerHTML = "Game Over!";
        h1El.classList.add("game-over-message");
        gameOverContainer.appendChild(h1El);

        // Create the "Try Again" button
        let tryAgainButton = document.createElement("button");
        tryAgainButton.innerHTML = "Try Again";
        tryAgainButton.classList.add("try-again-button");
        gameOverContainer.appendChild(tryAgainButton);

        // Append the game over container above the canvas
        document.body.insertBefore(gameOverContainer, myGameArea.canvas);

        // Add event listener to the "Try Again" button
        tryAgainButton.addEventListener("click", function() {
            // Remove the game over container and button
            gameOverContainer.remove();

            // Reset the game state and start a new game
            myObstacles = [];
            myGamePiece = null;
            startGame();
        });

        clearInterval(this.interval);  // Stop the game loop
    }
}

// Her er spillkomponentet mitt (spillerens figur og hindringer)
function component(width, height, color, x, y, type){
    this.type = type;
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.speedX = 0;
    this.speedY = 0;

    // Funksjon for å tegne objektet på skjermen
    this.update = function(){
        ctx = myGameArea.context;

        if (this.type == "text") {
            ctx.font = this.width + " " + this.height;
            ctx.fillStyle = color;
            ctx.fillText(this.text, this.x, this.y);
        } else {
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }

    // Funksjon for å oppdatere posisjonen til objektet
    this.newPos = function(){
        this.x += this.speedX;
        this.y += this.speedY;
    
        // Prevent the player from flying above the canvas
        if (this.y < 0) {
            this.y = 0;  // If the player's y position is less than 0, set it to 0 (top of canvas)
        }
    
        // Prevent the player from going below the canvas
        if (this.y + this.height > myGameArea.canvas.height) {
            this.y = myGameArea.canvas.height - this.height;  // If the player goes below, set it to the bottom of the canvas
        }
    
        // Prevent the player from going off the left side
        if (this.x < 0) {
            this.x = 0;  // If the player's x position is less than 0, set it to 0 (left side of canvas)
        }
    
        // Prevent the player from going off the right side
        if (this.x + this.width > myGameArea.canvas.width) {
            this.x = myGameArea.canvas.width - this.width;  // If the player goes off the right side, set it to the right edge
        }
    }
    

    // Funksjon for å sjekke om et objekt krasjer med et annet
    this.crashWith = function(otherobj){
        var myleft = this.x;
        var myright = this.x + (this.width);
        var mytop = this.y;
        var mybottom = this.y + (this.height);
        var otherleft = otherobj.x;
        var otherright = otherobj.x + (otherobj.width);
        var othertop = otherobj.y;
        var otherbottom = otherobj.y + (otherobj.height);
        var crash = true;
        if ((mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) || (myleft > otherright)){
            crash = false;
        }
        return crash;
    }
}

// Funksjon som oppdaterer spillområdet!
function updateGameArea(){
    var x, height, gap, minHeight, maxHeight, minGap, maxGap;

    // Sjekker om spillerens figur krasjer med noen hindringer
    for (i = 0; i < myObstacles.length; i++) {
        if (myGamePiece.crashWith(myObstacles[i])) {
            myGameArea.stop();  // Stopper spillet om det skjer en kollisjon
            return;
        } 
    }

    // Tømmer canvas for å tegne på nytt
    myGameArea.clear();
    myGameArea.frameNo += 1;  // Increment frame count (just once)

    // Sjekker om vi skal lage nye hindringer
    if (myGameArea.frameNo == 1 || everyinterval(150)) {
        x = myGameArea.canvas.width;
        minHeight = 20;
        maxHeight = 200;
        height = Math.floor(Math.random()*(maxHeight-minHeight+1)+minHeight);
        
        // REDIGER DENNE HER FOR Å GJØRE VANSKELIGERE!:
        minGap = 40;
        maxGap = 70; 
        
        gap = Math.floor(Math.random()*(maxGap-minGap+1)+minGap);
        // Lager nye hindringer
        myObstacles.push(new component(10, height, "green", x, 0));
        myObstacles.push(new component(10, x - height - gap, "green", x, height + gap));
    }

    // Oppdaterer posisjonen og tegner hindringene
    for (i = 0; i < myObstacles.length; i++) {

        //REDIGER VERDIEN FOR Å GJØRE VANSKELIGERE:
        myObstacles[i].x += -5;  // Flytter hindringene mot venstre


        myObstacles[i].update();
    }

    // Oppdaterer spillerens posisjon
    myGamePiece.newPos();    
    myGamePiece.update();

    // Legger til hastighet når jeg ikke trykker noe
    myGamePiece.speedX = 0;
    myGamePiece.speedY = 0;

    // Beveger figuren når taster blir trykket
    if (myGameArea.keys && myGameArea.keys["ArrowLeft"]) { myGamePiece.speedX = -1 } // Venstre
    if (myGameArea.keys && myGameArea.keys["ArrowRight"]) { myGamePiece.speedX = 1 }  // Høyre
    if (myGameArea.keys && myGameArea.keys["ArrowUp"]) { myGamePiece.speedY = -1 } // Opp
    if (myGameArea.keys && myGameArea.keys["ArrowDown"]) { myGamePiece.speedY = 1 }  // Ned

    // Update the score display
    myScore.text = "SCORE: " + myGameArea.frameNo;
    myScore.update();

    // Oppdaterer posisjonen til spilleren
    myGamePiece.newPos();
    myGamePiece.update();
}

// Funksjon som bestemmer om vi skal lage hindringer basert på interval
function everyinterval(n) {
    if ((myGameArea.frameNo / n) % 1 == 0) { return true; }
    return false;
}
