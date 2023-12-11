const letters = document.querySelectorAll('.scoreboard-letter');
const loadingDiv = document.querySelector('.wait-bar');
const ANSWER_LENGTH = 5;
const ROUNDS = 6;

// Get the modal element
const modal = document.getElementById("howToPlayModal");

// Get the close button element
const closeBtn = document.getElementsByClassName("close-btn")[0];

// Function to show the modal
function showModal() {
  modal.style.display = "block";
}

// Function to close the modal
function closeModal() {
  modal.style.display = "none";
}

// Event listener for the close button
closeBtn.addEventListener("click", closeModal);

// Event listener to show the modal when the page is loaded
window.addEventListener("load", showModal);


async function init(){
    let currentGuess = "";
    let currentRow = 0;
    let isLoading = true;

    const response = await fetch("https://words.dev-apis.com/word-of-the-day");
    const responseObject = await response.json();
    const word = responseObject.word.toUpperCase() ;
    const wordParts = word.split("");
    let done = false;
    setLoading(false);
    isLoading= false;
    
    
    /*function addLetter (letter) {
        if(currentGuess.length < ANSWER_LENGTH){
            currentGuess += letter; // add letter to the end
        } else{ // replace the last letter
            currentGuess = currentGuess.substring(0, currentGuess.length -1) + letter;
        }
            letters[ ANSWER_LENGTH * currentRow + currentGuess.length - 1].innerText = letter;
        
    } */

    function addLetter(letter) {
        if (currentGuess.length < ANSWER_LENGTH) {
          currentGuess += letter; // add letter to the end
        } else {
          currentGuess = currentGuess.substring(0, currentGuess.length - 1) + letter;
        }
      
        const letterIndex = ANSWER_LENGTH * currentRow + currentGuess.length - 1;
        const letterElement = letters[letterIndex];
  
        letterElement.innerText = letter;
        letterElement.classList.add('bouncing');
      
        // Remove the bouncing class after the animation ends
        letterElement.addEventListener('animationend', () => {
          letterElement.classList.remove('bouncing');
        }, { once: true });
      }


    async function commit(){
        if(currentGuess.length != ANSWER_LENGTH){
            return;
        }
       
    
        // validate the word
        isLoading = true;
        setLoading(true);
        const response = await fetch("https://words.dev-apis.com/validate-word" , {
            method: "POST",
            body: JSON.stringify({word: currentGuess})
        });

        const responseObject = await response.json();
        const validWord = responseObject.validWord;

        isLoading = false;
        setLoading(false);

        if(!validWord){
            markInvalidWord();
            return;
        }
       
        letters.forEach((letter) => {
            letter.classList.remove('flipping');
        });
        
        // Add flipping class to the letters in the current guess
        // Add flipping class to the letters in the current guess with a delay
        for (let i = 0; i < currentGuess.length; i++) {
            const index = ANSWER_LENGTH * currentRow + i;
            if (letters[index]) {
            setTimeout(() => {
                letters[index].classList.add('flipping');
            }, i * 200); // Adjust the delay duration (in milliseconds) as needed
            }
        }
            

       // changing the color of the letters 
       for(let i = 0; i < ANSWER_LENGTH; i++){
        letters[ ANSWER_LENGTH * currentRow + i].classList.add("changetextcolor");
         }

        // set correct, wrong or close
        const guessParts = currentGuess.split("");
        const map = makeMap(wordParts);

        for(let i = 0; i< ANSWER_LENGTH; i ++){
            //mark as correct
            if(guessParts[i] === wordParts[i]){
                letters[ ANSWER_LENGTH * currentRow + i].classList.add("correct");
                map[guessParts[i]]--;
            }
        }

        for(let i = 0; i < ANSWER_LENGTH; i ++){
            if(guessParts[i] === wordParts[i]){
                //already handled
            } else if(wordParts.includes(guessParts[i]) && map[guessParts[i]] > 0){
                // mark as close
                letters[ ANSWER_LENGTH * currentRow + i].classList.add("close");
                map[guessParts[i]]--;
            } else{
                letters[ ANSWER_LENGTH * currentRow + i].classList.add("wrong");
            }
        }

        
         //first row is complete
         currentRow++;
         if(currentGuess === word){
             //win
             alert('you win');
             document.querySelector('.game-name').classList.add('winner')
             done = true;
             return;
            } else if(currentRow === ROUNDS){
                alert(`you lose the word was ${word}`);
                done = true;
            }
            currentGuess= "";

    }

    function backspace(){
        if(currentGuess.length = 0){
            return;
        }
        currentGuess = currentGuess.substring(0, currentGuess.length -1);
        letters[ ANSWER_LENGTH * currentRow + currentGuess.length ].innerText = "";

    }

    function markInvalidWord(){
        for(let i = 0; i < ANSWER_LENGTH; i++){
            letters[ ANSWER_LENGTH * currentRow + i].classList.remove("invalid"); // remove invalid class if it exists

            setTimeout(function () { 
            letters[ ANSWER_LENGTH * currentRow + i].classList.add("invalid"); // add invalid class
            }, 10);
        }
    }


    document.addEventListener('keydown' , function handleKeyPress (event){
        if(done || isLoading){
            return;
        }

        const action = event.key; // get pressed 
        console.log(action);

        if(action === 'Enter'){
           commit(); 
        } else if(action === "Backspace"){
            backspace(); 
        } else if(isLetter(action)){
            addLetter(action.toUpperCase()); 
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

function makeMap (array) {  // keep track of how many of each letter
    const obj = {};

    for(let i = 0 ; i< array.length ; i++){
        const letter = array[i];
        if(obj[letter]){
            obj[letter]++;
        } else{
            obj[letter] = 1;
        }
    }

    return obj;


}


init();