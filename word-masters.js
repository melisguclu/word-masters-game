const letters = document.querySelectorAll('.scoreboard-letter');
const loadingDiv = document.querySelector('.wait-bar');
const ANSWER_LENGTH = 5;

async function init(){
    let currentGuess = "";
    let currentRow = 0;

    function addLetter (letter) {
        if(currentGuess.length < ANSWER_LENGTH){
            currentGuess += letter; // add letter to the end
        } else{ // replace the last letter
            currentGuess = currentGuess.substring(0, currentGuess.length -1) + letter;
        }
            letters[ ANSWER_LENGTH * currentRow + currentGuess.length - 1].innerText = letter;
        
    }


    async function commit(){
        if(currentGuess.length != ANSWER_LENGTH){
            return;
        }

        // TODO validate the word

        // TODO set correct, wrong or close

        // TODO win/lose?


        //first row is complete
        currentRow++;
        currentGuess= "";

    }

    function backspace(){
        if(currentGuess.length = 0){
            return;
        }
        currentGuess = currentGuess.substring(0, currentGuess.length -1);
        letters[ ANSWER_LENGTH * currentRow + currentGuess.length ].innerText = "";

    }


    document.addEventListener('keydown' , function handleKeyPress (event){
        const action = event.key; // get pressed 
        console.log(action);

        if(action === 'Enter'){
           commit(); //TODO
        } else if(action === "Backspace"){
            backspace(); //TODO
        } else if(isLetter(action)){
            addLetter(action.toUpperCase()); // TODO addLetter 
        }else{
            //ignore
        }
    });
}
 

function isLetter(letter){
    return /^[a-zA-Z]$/.test(letter);
}


init();