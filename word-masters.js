const letters = document.querySelectorAll('.scoreboard-letter');
const loadingDiv = document.querySelector('.wait-bar');
const ANSWER_LENGTH = 5;

async function init(){
    let currentGuess = "";
    let currentRow = 0;

    const response = await fetch("https://words.dev-apis.com/word-of-the-day");
    const responseObject = await response.json();
    const word = responseObject.word.toUpperCase() ;
    const wordParts = word.split("");
    setLoading(false);

    console.log(word);

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

        const guessParts = currentGuess.split("");

        for(let i = 0; i< ANSWER_LENGTH; i ++){
            //mark as correct
            if(guessParts[i] === wordParts[i]){
                letters[ ANSWER_LENGTH * currentRow + i].classList.add("correct");
            }
        }

        for(let i = 0; i< ANSWER_LENGTH; i ++){
            //mark as correct
            if(guessParts[i] === wordParts[i]){
                //already handled
            } else if(wordParts.includes(guessParts[i])){
                letters[ ANSWER_LENGTH * currentRow + i].classList.add("close");
            } else{
                letters[ ANSWER_LENGTH * currentRow + i].classList.add("wrong");
            }
        }

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

function setLoading(isLoading){
    loadingDiv.classList.toggle('show' , isLoading); // if isLoading is true, add show class
}


init();