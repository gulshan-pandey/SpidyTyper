var gameTime = 30;



function checkScreenWidth() {
    var gameElement = document.getElementById('Game');
    var screenWidth = window.innerWidth;
    
    if (screenWidth < 670) {
        gameElement.removeAttribute('tabindex');
        document.getElementById('focus-error').style.display = "none";
        document.getElementById('words').style.filter = "none";
        document.querySelector('#mobile-input').style.display = "block";
       
    } else {
        document.querySelector('#mobile-input').style.display = "none";
    }
}

// Check screen width on initial load
window.addEventListener('load', checkScreenWidth);

// Check screen width on resize
window.addEventListener('resize', checkScreenWidth);





const words = "In a village nestled between rolling green hills lived a baker named Emilia.wasn't your ordinary baker; her bread wasn't just sustenance, it was magic Each loaf held a whisper of happiness, a sprinkle of hope, generous helping of warmth. People from miles around would line up for a taste, their faces etched with worries that seemed to melt away with every bite. One crisp autumn morning, a peculiar young woman named Luna arrived at Emilia's bakery. Luna wasn't from the village, and an air of mystery clung to her like the scent of woodsmoke. She requested a loaf unlike any Emilia had made before loaf to mend broken heart. Intrigued, Emilia baked through night. She kneaded in whispers of forgotten dreams, the echo of laughter lost, and a melody of hope that refused to die. As dawn painted the sky, golden brown loaf emerged, imbued with a quiet strength. Luna took bread, her eyes filled with a gratitude that spoke volumes. Days turned into weeks, and whispers filled  village about Luna. Some said she was a sorceress, others wanderer with hidden past. But when the once vibrant colours in the village seemed to lose their luster, Luna reappeared at Emilia's door. This time, she requested bread for the whole village. heavy sadness had settled over them, its source unknown. Emilia, sensing the urgency, baked a loaf that embodied the collective spirit of the village their resilience, their shared joys, and their unwavering love for their home. As the villagers savored the bread, a warmth spread through them, chasing away the gloom. Laughter returned, stories were shared, and the forgotten joy of community rekindled. Luna, with a gentle smile, thanked Emilia and disappeared once more. News of the magical bread reached the ears of greedy baron who ruled the neighbouring lands. His heart, as cold winter, craved the power to control emotions. He stormed into Emilia's bakery, demanding the recipe. Emilia refused. The baron, enraged, threatened to take everything from her. But Emilia, emboldened by love baked into her bread, stood her ground. She explained that the true magic wasn't in the ingredients, but in the love and care poured into every loaf. The baron, confused and humbled, left empty-handed. The villagers, inspired by Emilia's bravery, rallied around her. Together, they built a stronger, more vibrant community, sharing not just bread, but also their stories, their laughter, and their unwavering spirit. Luna, though unseen, became a legend a reminder that even the smallest act of love can mend hearts and bring back the magic to life".split(" ");

let newGameButton = document.getElementById("newGameButton");

newGameButton.addEventListener('click', (e) => {
    gameTime = 30;
    document.querySelector('#Game').classList.remove('over');
    document.getElementById('info').innerHTML = gameTime;
    clearInterval(window.timer);
    newGame();
});

function addClass(elem, name) {
    elem.classList.add(name);
}

function removeClass(elem, name) {
    elem.classList.remove(name);
}

function randomIndex() {
    let ind = Math.floor(Math.random() * words.length);
    return words[ind];
}

function addWords(randWord) {
    return `<div class="word"><span class="letter">${randWord.split("").join('</span><span class="letter">')}</span></div>`;
}

function newGame() {
    document.querySelector('#mobile-input-field').value = null;
    document.querySelector("#words").innerHTML = '';
    for (let i = 0; i < 200; i++) {
        document.querySelector("#words").innerHTML += addWords(randomIndex());
    }
    addClass(document.querySelector(".word"), "current");               
    addClass(document.querySelector(".letter"), "current");
    document.getElementById('info').innerHTML = gameTime;
    window.timer = null;        

    // Reset cursor position
    const cursor = document.querySelector("#cursor");
    cursor.style.top = document.querySelector(".letter.current").getBoundingClientRect().top + 2 + 'px';
    cursor.style.left = document.querySelector(".letter.current").getBoundingClientRect().left + 'px';
}

function getWPM() {
    const words = [...document.querySelectorAll('.word')];
    const lastTypedWord = document.querySelector('.word.current');
    const lastTypedWordIndex = words.indexOf(lastTypedWord) + 1;
    const typedWords = words.slice(0, lastTypedWordIndex);
    const correctWords = typedWords.filter(word => {
        const letters = [...word.children];
        const incorrectLetters = letters.filter(letter => letter.classList.contains("incorrect"));
        const correctLetters = letters.filter(letter => letter.classList.contains("correct"));

        return incorrectLetters.length === 0 && correctLetters.length === letters.length;

    });
    return 2 * correctWords.length;
}

function gameOver() {                           
    clearInterval(window.timer);
    addClass(document.getElementById('Game'), 'over');
    document.querySelector('#info').innerText = `WPM: ${getWPM()}`;
}




document.getElementById('Game').addEventListener("keyup", (e) => {
    let key = e.key;
    let currentWord = document.querySelector(".word.current");
    let currentLetter = document.querySelector(".letter.current");
    const expected = currentLetter?.innerHTML || ' ';             
    const isLetter = key.length === 1 && e.key !== ' ';
    const isSpace = key === ' ';
    const isBackspace = key === 'Backspace';
    const isFirstLetter = currentLetter === currentWord.firstChild;
    let isExtra = currentWord.querySelector(".extra"); 

    if (document.querySelector("#Game.over")) {
        return;
    }


       //-------------------- Timer-------------------
    if (!window.timer && isLetter) {
        window.timer = setInterval(() => {
            gameTime = gameTime - 1;
            if (gameTime <= 0) {
                gameOver();
                return;
            }
            document.querySelector('#info').innerText = gameTime;
        }, 1000);
    }

    if (isLetter) {
        if (currentLetter) {
            addClass(currentLetter, key === expected ? "correct" : "incorrect");
            removeClass(currentLetter, "current");
            if (currentLetter.nextSibling) {                              
                addClass(currentLetter.nextSibling, "current");
            }
        } else {
            const incorrectLetter = document.createElement("span");
            incorrectLetter.innerHTML = key;
            incorrectLetter.className = "letter incorrect extra";
            currentWord.appendChild(incorrectLetter);
            isExtra = incorrectLetter;
        }
    }

    if (isSpace) {
        if (expected !== " ") {
            const lettersToInvalidate = [...document.querySelectorAll(".word.current .letter:not(.correct)")];       
            lettersToInvalidate.forEach(elem => {
                addClass(elem, "incorrect");        
            });
        }
        removeClass(currentWord, "current");
        addClass(currentWord.nextSibling, "current");

        if (currentLetter) {
            removeClass(currentLetter, "current");
        }
        addClass(currentWord.nextSibling.firstChild, "current");
    }

    if (isBackspace) {
         //make previous word current, last letter current
        if (isExtra) {
            currentWord.removeChild(isExtra);
            isExtra = null; 
        } else if (currentLetter && isFirstLetter) {
            removeClass(currentWord, 'current');
            addClass(currentWord.previousSibling, 'current');
            removeClass(currentLetter, 'current');
            addClass(currentWord.previousSibling.lastChild, 'current');
            removeClass(currentWord.previousSibling.lastChild, 'incorrect');
            removeClass(currentWord.previousSibling.lastChild, 'correct');
        } else if (currentLetter && !isFirstLetter) {
            removeClass(currentLetter, 'current');
            addClass(currentLetter.previousSibling, 'current');
            removeClass(currentLetter.previousSibling, 'incorrect');
            removeClass(currentLetter.previousSibling, 'correct');
        } else if (!currentLetter) {
            addClass(currentWord.lastChild, 'current');
            removeClass(currentWord.lastChild, 'incorrect');
            removeClass(currentWord.lastChild, 'correct');
        }
    }

    // ------------ Move lines / words
    if (currentWord.getBoundingClientRect().top > 400) {
        const words = document.getElementById('words');
        const margin = parseInt(words.style.marginTop || '0px');
        words.style.marginTop = margin - 25 + 'px';
    }



    //   Cursor movement
    const nextLetter = document.querySelector(".letter.current");
    const nextWord = document.querySelector(".word.current");
    const cursor = document.querySelector("#cursor");
    cursor.style.top = (nextLetter || nextWord).getBoundingClientRect().top + 2 + 'px';
    cursor.style.left = (nextLetter || nextWord).getBoundingClientRect()[nextLetter ? 'left' : 'right'] + 'px';
});




// Event Listener for Mobile Input (Almost identical to the desktop event listener)
document.getElementById('mobile-input-field').addEventListener('focus', () => {
    console.log('Input field focused');
});

document.getElementById('mobile-input-field').addEventListener('input', (e) => {
    let key = e.data; // Use e.data to get the last input character
    let currentWord = document.querySelector(".word.current");
    let currentLetter = document.querySelector(".letter.current");
    const expected = currentLetter?.innerHTML || ' ';
    const isLetter = key && key.length === 1 && key !== ' ';
    const isSpace = key === ' ';
    const isBackspace = e.inputType === 'deleteContentBackward';
    const isFirstLetter = currentLetter === currentWord.firstChild;
    let isExtra = currentWord.querySelector(".extra");

    if (document.querySelector("#Game.over")) {
        return;
    }

    //-------------------- Timer-------------------
    if (!window.timer && isLetter) {
        window.timer = setInterval(() => {
            gameTime = gameTime - 1;
            if (gameTime <= 0) {
                gameOver();
                return;
            }
            document.querySelector('#info').innerText = gameTime;
        }, 1000);
    }

    if (isLetter) {
        if (currentLetter) {
            addClass(currentLetter, key === expected ? "correct" : "incorrect");
            removeClass(currentLetter, "current");
            if (currentLetter.nextSibling) {
                addClass(currentLetter.nextSibling, "current");
            }
        } else {
            const incorrectLetter = document.createElement("span");
            incorrectLetter.innerHTML = key;
            incorrectLetter.className = "letter incorrect extra";
            currentWord.appendChild(incorrectLetter);
            isExtra = incorrectLetter;
        }
    }

    if (isSpace) {
        if (expected !== " ") {
            const lettersToInvalidate = [...document.querySelectorAll(".word.current .letter:not(.correct)")];
            lettersToInvalidate.forEach(elem => {
                addClass(elem, "incorrect");
            });
        }
        removeClass(currentWord, "current");
        addClass(currentWord.nextSibling, "current");

        if (currentLetter) {
            removeClass(currentLetter, "current");
        }
        addClass(currentWord.nextSibling.firstChild, "current");
    }

    if (isBackspace) {
        if (isExtra) {
            currentWord.removeChild(isExtra);
            isExtra = null;
        } else if (currentLetter && isFirstLetter) {
            removeClass(currentWord, 'current');
            addClass(currentWord.previousSibling, 'current');
            removeClass(currentLetter, 'current');
            addClass(currentWord.previousSibling.lastChild, 'current');
            removeClass(currentWord.previousSibling.lastChild, 'incorrect');
            removeClass(currentWord.previousSibling.lastChild, 'correct');
        } else if (currentLetter && !isFirstLetter) {
            removeClass(currentLetter, 'current');
            addClass(currentLetter.previousSibling, 'current');
            removeClass(currentLetter.previousSibling, 'incorrect');
            removeClass(currentLetter.previousSibling, 'correct');
        } else if (!currentLetter) {
            addClass(currentWord.lastChild, 'current');
            removeClass(currentWord.lastChild, 'incorrect');
            removeClass(currentWord.lastChild, 'correct');
        }
    }

    // ------------ Move lines / words
    if (currentWord.getBoundingClientRect().top > 300) {
        const words = document.getElementById('words');
        const margin = parseInt(words.style.marginTop || '0px');
        words.style.marginTop = (margin - 35) + 'px';
    }

    //   Cursor movement
    const nextLetter = document.querySelector(".letter.current");
    const nextWord = document.querySelector(".word.current");
    const cursor = document.querySelector("#cursor");
    cursor.style.top = (nextLetter || nextWord).getBoundingClientRect().top + 2 + 'px';
    cursor.style.left = (nextLetter || nextWord).getBoundingClientRect()[nextLetter ? 'left' : 'right'] + 'px';
});

// Ensure input field is focused
document.getElementById('mobile-input-field').focus();


newGame();
