const scoreboard = document.querySelector('.scoreboard');
const loadingSpiral = document.querySelector('.wait-bar');
const ANSWER_LENGTH = 5;
const ROUNDS = 6;

const modal = document.getElementById("howToPlayModal");
const closeBtn = document.getElementsByClassName("close-btn")[0];
const openBtn = document.getElementById("howToPlayBtn");

const keyboardLetters = document.querySelectorAll('.key');

const showAnswer = document.querySelector('.word');

//show the "how to play"modal
function showModal() {
  modal.style.display = "none";
}

function closeModal() {
  modal.style.display = "none";
}

closeBtn.addEventListener("click", closeModal);

// show the modal when the page is loaded
window.addEventListener("load", showModal);

//show the modal when the ? button is clicked
openBtn.addEventListener("click", showModal);

//close the modal when the user clicks outside of the modal
window.addEventListener("click", function (event) {
  if (event.target == modal) {
    closeModal();
  }
});



async function init(){
    for (let i = 1; i <= 30; i++) {
        const letter = document.createElement('div');
        letter.classList.add('scoreboard-letter');
        scoreboard.appendChild(letter);
    }
    const letters = document.querySelectorAll('.scoreboard-letter');


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
    
    // Add the word to the scoreboard
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

      keyboardLetters.forEach(key =>{
        key.addEventListener('click', () =>{
            console.log(key.innerText);
            if(key.innerText === "ENTER"){
                console.log("enter");
                commit();
            } else if(key.innerText === "DELETE"){
                console.log("delete");
                backspace();
            }
            else{
            addLetter(key.innerText);
            }
        })
    
    })

     


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
        for (let i = 0; i < currentGuess.length; i++) {
            const index = ANSWER_LENGTH * currentRow + i;
            if (letters[index]) {
            setTimeout(() => {
                letters[index].classList.add('flipping');
            }, i * 200); // Adjust the delay duration (in milliseconds) as needed
            }
        }
            
        // set correct, wrong or close
        const guessParts = currentGuess.split("");
        const map = makeMap(wordParts);

        for(let i = 0; i< ANSWER_LENGTH; i ++){
            //mark as correct
            if(guessParts[i] === wordParts[i]){
                letters[ ANSWER_LENGTH * currentRow + i].classList.add("correct");
                /* add the virtual kyeboard's letter class correct*/
                keyboardLetters.forEach(key =>{
                    if(key.innerText === guessParts[i]){
                        key.classList.add("correct");
                    }
                })
            
                map[guessParts[i]]--;
            }
        }

        for(let i = 0; i < ANSWER_LENGTH; i ++){
            if(guessParts[i] === wordParts[i]){
                //already handled
            } else if(wordParts.includes(guessParts[i]) && map[guessParts[i]] > 0){
                // mark as close
                letters[ ANSWER_LENGTH * currentRow + i].classList.add("close");
                keyboardLetters.forEach(key =>{
                    
                    if(key.innerText === guessParts[i] && !key.classList.contains("correct")){
                        key.classList.add("close");
                    }
                })
                map[guessParts[i]]--;
            } else{
                letters[ ANSWER_LENGTH * currentRow + i].classList.add("wrong");
                keyboardLetters.forEach(key =>{
                    if(key.innerText === guessParts[i] && !key.classList.contains("correct") && !key.classList.contains("close")){
                        key.classList.add("wrong");
                    }
                })
            }
        }

        function showAnswerFunct(){
            showAnswer.style.display = "block";
            showAnswer.innerText = word;
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
                //alert(`you lose the word was ${word}`);
                showAnswerFunct();
                done = true;
            }
            currentGuess= "";

    }

    function backspace(){
        if(currentGuess.length = 0){
            return;
        }
        const letterIndex = ANSWER_LENGTH * currentRow + currentGuess.length - 1;
        const letterElement = letters[letterIndex];

        currentGuess = currentGuess.substring(0, currentGuess.length -1);
        letterElement.classList.remove("invalid");
        letters[ ANSWER_LENGTH * currentRow + currentGuess.length ].innerText = "";

    }

    function markInvalidWord() {
        for (let i = 0; i < ANSWER_LENGTH; i++) {
            letters[ANSWER_LENGTH * currentRow + i].classList.remove("invalid"); 
        }

        setTimeout(function () {
            for (let i = 0; i < ANSWER_LENGTH; i++) {
                letters[ANSWER_LENGTH * currentRow + i].classList.add("invalid"); 
            }
        }, 10);
    }

    document.addEventListener('keydown' , function handleKeyPress (event){
        if(done || isLoading){
            return;
        }

        const action = event.key; // get pressed 
        console.log(action);

        if(action === 'Enter'){
            for (let i = 0; i < ANSWER_LENGTH; i++) { // remove invalid class from all letters if exists
                letters[ANSWER_LENGTH * currentRow + i].classList.remove("invalid"); 
            }    
           commit(); 
        } else if(action === "Backspace"){
            backspace(); 
        } else if(isLetter(action)){
            addLetter(action.toUpperCase()); 
            shadowKeyboardLetter(action.toUpperCase());

        }else{
            //ignore
        }
    });
}




function shadowKeyboardLetter(letter){
    keyboardLetters.forEach(key =>{
        if(key.innerText === letter){
            key.classList.add("keyboardShadow");
            setTimeout(function () { 
                key.classList.remove("keyboardShadow"); 
                }, 100);
        }
    })
}
 

function isLetter(letter){
    return /^[a-zA-Z]$/.test(letter);
}

function setLoading(isLoading){
 //loadingSpiral.classList.toggle('show' , isLoading); // if isLoading is true, add show class
 loadingSpiral.classList.toggle('show' , isLoading);


   


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