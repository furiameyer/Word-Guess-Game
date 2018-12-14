// VARIABLES
// ====================================================================
// ==============================================================================

// number of times user has guessed the word
var wins = 0;

// number of times user has lost
var losses = 0;

// number of atempts allowed in game
var attempts = 7;

// Database of word repertoire
var InputWordBank = ["BOCA", "RIVER", "RACING", "INDEPENDIENTE", "ROSARIO", "GIMNASIA", "NEWELL", "VELEZ", "HURACAN", "TALLERES", "ESTUDIANTES", "BELGRANO", "LANUS", "BANFIELD", "ARGENTINOS", "TIGRE", "CHACARITA"]
var WordBank = InputWordBank;

// DOM variables
var winsID = document.getElementById("winsID");
var lossesID = document.getElementById("lossesID");
var alertboxID = document.getElementById("alertbox");
var teamlogoID = document.getElementById("teamlogo");
var progressbarID = document.getElementById("progressbar");
var wordsmissedID = document.getElementById("wordsmissed");
var guessremainingID = document.getElementById("guessremaining");

// var rv={};
var wordprogress = [];
var wrongletters = [];
var missedattempts = 0;
var pushedletters = [];
var pickindex = 0;
var computerpick = "";
var letterpick = "";
var guessesremaining = attempts;

// FUNCTIONS
// ==============================================================================

// This function creates a random word selection by computer and deletes used word from repertoire
function Computerselection() {
    pickindex = Math.floor(Math.random() * WordBank.length);
    computerpick = WordBank[pickindex];

    // Word selected by computer is removed from set to avoid repeating word selection in future
    WordBank.splice(pickindex, 1);
}

// This function translates the Guess Word into an array composed of dashes
function PicktoDash(arr) {
    for (var i = 0; i < arr.length; ++i)
        wordprogress.push("_");
    return wordprogress;
}

// This function creates an image associated with the soccer team in the Guess Word
function writeTeamLogo() {
    var computerpick_lc = computerpick.toLowerCase();
    link2teamlogo = "./assets/images/" + computerpick_lc + ".png";
    teamlogoID.src = link2teamlogo;
}

// This is the brains of the game, checking first whether the letter pressed is a new letter, and then whether it matches any letter in the Guess Word.
function lettermatch(x) {
    var n = pushedletters.includes(x);
    if (!n) {
        pushedletters.push(x);
        var roundcounter = 0;

        for (var i = 0; i < computerpick.length; ++i) {
            if (x == computerpick.charAt(i)) {
                wordprogress[i] = x;
                roundcounter++;
                alertboxID.textContent = "HIT!";
            }
        }

        if (roundcounter == 0) {
            missedattempts++;
            guessesremaining--;
            wrongletters.push(x);
            alertboxID.textContent = "MISSED!";
        }
    } else {
        alertboxID.textContent = "YOU'VE ALREADY SELECTED THAT LETTER!";
    }
}

// Progress variables function
function progressvar () {
    progressbarID.textContent = wordprogress.join("");
    wordsmissedID.textContent = wrongletters;
    guessremainingID.textContent = guessesremaining;
}

// This function resets the game
function reset() {
    wordprogress = [];
    pushedletters = [];
    wrongletters = [];
    Computerselection();
    console.log(computerpick);
    PicktoDash(computerpick);
    missedattempts = 0;
    guessesremaining = attempts;
    progressvar();
    teamlogoID.src = "./assets/images/afa.png";
    alertboxID.textContent = "You are on! Try again! Press any key to continue...";
}

// MAIN PROCESS
// ==============================================================================

// Computer generates random word and removes it from future consideration
Computerselection();
console.log(computerpick);

// Word is broken into dashes and progress variables are displayed on screen
PicktoDash(computerpick);
progressbarID.textContent = wordprogress.join("");
wordsmissedID.textContent = wrongletters;
guessremainingID.textContent = guessesremaining;

// Captures keyboard input
document.onkeyup = function (event) {

    // Captures the key press and triggers round
    var letterpick = event.key.toUpperCase();
    lettermatch(letterpick);

    // Displays game progress
    progressvar();

    // Checks to see if round is over and if so, resets game
    var f = wordprogress.includes("_")
    if (!f) {
        var audiowon = new Audio('./assets/sounds/you-won.wav');
        audiowon.play();
        writeTeamLogo();
        alertboxID.textContent = "WINNER!";
        wins++
        winsID.textContent = wins;
        var delay = setTimeout(reset, 5000);
    }

    if (missedattempts == attempts) {
        var audiolost = new Audio('./assets/sounds/game-over.wav');
        audiolost.play();
        losses++;
        lossesID.textContent = losses;
        alertboxID.textContent = "LOSER!";
        var delay = setTimeout(reset, 5000);
    }
};
