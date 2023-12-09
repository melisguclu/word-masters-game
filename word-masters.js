const letters = document.querySelectorAll('.scoreboard_letters');

const loadingDiv = document.querySelector('.wait-bar');


async function init(){




    document.addEventListener('keydown' , function handleKeyPress (event){
        const action = event.key;

        console.log(action);

    });
}
init();