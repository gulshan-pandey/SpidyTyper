var gameTime = 3000;
const words = "In a village nestled between rolling green hills lived a baker named Emilia. Emilia wasn't your ordinary baker; her bread wasn't just sustenance, it was magic. Each loaf held a whisper of happiness, a sprinkle of hope, and a generous helping of warmth. People from miles around would line up for a taste, their faces etched with worries that seemed to melt away with every bite. One crisp autumn morning, a peculiar young woman named Luna arrived at Emilia's bakery. Luna wasn't from the village, and an air of mystery clung to her like the scent of woodsmoke. She requested a loaf unlike any Emilia had made before - a loaf to mend broken heart. Intrigued, Emilia baked through the night. She kneaded in whispers of forgotten dreams, the echo of laughter lost, and a melody of hope that refused to die. As dawn painted the sky, a golden brown loaf emerged, imbued with a quiet strength. Luna took bread, her eyes filled with a gratitude that spoke volumes. Days turned into weeks, and whispers filled  village about Luna. Some said she was a sorceress, others a wanderer with a hidden past. But when the once vibrant colours in the village seemed to lose their luster, Luna reappeared at Emilia's door. This time, she requested bread for the whole village. A heavy sadness had settled over them, its source unknown. Emilia, sensing the urgency, baked a loaf that embodied the collective spirit of the village their resilience, their shared joys, and their unwavering love for their home. As the villagers savored the bread, a warmth spread through them, chasing away the gloom. Laughter returned, stories were shared, and the forgotten joy of community rekindled. Luna, with a gentle smile, thanked Emilia and disappeared once more. News of the magical bread reached the ears of a greedy baron who ruled the neighbouring lands. His heart, as cold winter, craved the power to control emotions. He stormed into Emilia's bakery, demanding the recipe. Emilia refused. The baron, enraged, threatened to take everything from her. But Emilia, emboldened by love baked into her bread, stood her ground. She explained that the true magic wasn't in the ingredients, but in the love and care poured into every loaf. The baron, confused and humbled, left empty-handed. The villagers, inspired by Emilia's bravery, rallied around her. Together, they built a stronger, more vibrant community, sharing not just bread, but also their stories, their laughter, and their unwavering spirit. Luna, though unseen, became a legend - a reminder that even the smallest act of love can mend hearts and bring back the magic to life".split(" ");
// console.log(words)



let newGameButton = document.getElementById("newGameButton")


newGameButton.addEventListener('click', (e) => {

    gameTime = 30;
    document.querySelector('#Game').classList.remove('over');
    document.getElementById('info').innerHTML = gameTime;
    clearInterval(window.timer);
    newGame();
});



function addClass(elem, name) {
    elem.className += ' ' + name;
}
function removeClass(elem, name) {
    elem.className = elem.className.replace(name, " ");
    //  console.log(elem.className)
}


function randomIndex() {
    let ind = Math.floor(Math.random() * words.length)
    // console.log(ind)
    return words[ind]
}

function addWords(randWord) {
    // console.log(randWord.split(" ").join(","))
    return `<div class="word"><span class="letter">${randWord.split("").join('</span><span class="letter">')}</span></div>`;
}


function newGame() {
    document.querySelector("#words").innerHTML = ''
    for (let i = 0; i < 200; i++) {
        // console.log(randomIndex())
        document.querySelector("#words").innerHTML += addWords(randomIndex())
    }
    addClass(document.querySelector(".word"), "current");                // addClass property used to add class 
    addClass(document.querySelector(".letter"), "current");
    document.getElementById('info').innerHTML = gameTime;
    window.timer = null              //--------------------------- for game time measures

    
}





function getWPM() {
    const words = [...document.querySelectorAll('.word')];
    const lastTypedWord = document.querySelector('.word.current')
    const lastTypedWordIndex = words.indexOf(lastTypedWord) + 1
    const typedWords = words.slice(0, lastTypedWordIndex)
    const correctWords = typedWords.filter(word => {
        const letters = [...word.children];
        const incorrectLetters = letters.filter(letter => letter.className.includes("incorrect"))
        const correctLetters = letters.filter(letter => letter.className.includes("correct"))

        return incorrectLetters.length === 0 && correctLetters.length === letters.length;

    });
    // console.log(correctWords.length);
    return 2 * correctWords.length
}



function gameOver() {                            //---------------------------------------Game over-----------------
    clearInterval(window.timer)
    // alert("Game Over")
    addClass(document.getElementById('Game'), 'over');
    document.querySelector('#info').innerText = `WPM: ${getWPM()}`
}


document.getElementById('Game').addEventListener("keyup", (e) => {
    let key = e.key;
    let currentWord = document.querySelector(".word.current");
    let currentLetter = document.querySelector(".letter.current");
    const expected = currentLetter?.innerHTML || ' ';              // bcz v dont have any current letter in the end of the word, we need to use optional chaining here{ that means if there is no current letter then we will use space}
    const isLetter = key.length === 1 && e.key !== ' ';
    const isSpace = key === ' ';
    const isBackspace = key === 'Backspace';
    const isFirstLetter = currentLetter === currentWord.firstChild;
    const isExtra = document.querySelector(".extra");
    // console.log(   currentLetter)

    if (document.querySelector("#Game.over")) {
        return;
    }

    // console.log({ key, expected });



    //-------------------- Timer-------------------
    if (!window.timer && isLetter) {
        // alert("Game Started")
        window.timer = setInterval(() => {
            gameTime = gameTime - 1
            if (gameTime <= 0) {
                gameOver()
                return;
            }
            document.querySelector('#info').innerText = gameTime
        }, 1000)

    }

    if (isLetter) {
        if (currentLetter) {
            addClass(currentLetter, key === expected ? "correct" : "incorrect")
            removeClass(currentLetter, "current");
            if (currentLetter.nextSibling) {                               // to check weather it is the end of letters in a perticular word
                addClass(currentLetter.nextSibling, "current");
            }
        } else {
            const incorrectLetter = document.createElement("span");
            incorrectLetter.innerHTML = key;
            incorrectLetter.className = "letter incorrect extra"
            currentWord.appendChild(incorrectLetter);
        }
    }

    if (isSpace) {
        if (expected !== " ") {

            const letterToInvalidate = [...document.querySelectorAll(".word.current .letter:not(.correct)")];        //------- making the array of the incorrect letters
            letterToInvalidate.forEach(elem => {
                addClass(elem, "incorrect");         // just called the function to add the class
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
        if(isExtra){
            currentWord.removeChild(isExtra);
        }
        else if (currentLetter && isFirstLetter) {
            //make previous word current, last letter current


            removeClass(currentWord, 'current');
            addClass(currentWord.previousSibling, 'current');
            removeClass(currentLetter, 'current');
            addClass(currentWord.previousSibling.lastChild, 'current');
            removeClass(currentWord.previousSibling.lastChild, 'incorrect');
            removeClass(currentWord.previousSibling.lastChild, 'correct');

        }

        else if (currentLetter && !isFirstLetter) {
            // move back one letter, invalidate letter
            removeClass(currentLetter, 'current');
            removeClass(currentLetter, 'current')
            addClass(currentLetter.previousSibling, 'current')
            removeClass(currentLetter.previousSibling, 'incorrect');
            removeClass(currentLetter.previousSibling, 'correct');
        }

        else if (!currentLetter) {
            addClass(currentWord.lastChild, 'current');
            removeClass(currentWord.lastChild, 'incorrect');
            removeClass(currentWord.lastChild, 'correct');

        }

        //for removing extra words
    }



    // ------------ Move lines / words

    if (currentWord.getBoundingClientRect().top > 350) {
        const words = document.getElementById('words');
        const margin = parseInt(words.style.marginTop || '0px');
        words.style.marginTop = margin - 35 + 'px';

    }



    //   Cursor movement------------------------🥺😭😭🥲🥲-------most hectic
    const nextLetter = document.querySelector(".letter.current")
    const nextWord = document.querySelector(".word.current");
    const cursor = document.querySelector("#cursor");
    cursor.style.top = (nextLetter || nextWord).getBoundingClientRect().top + 2 + 'px';
    cursor.style.left = (nextLetter || nextWord).getBoundingClientRect()[nextLetter ? 'left' : 'right'] + 'px';


});



document.getElementById('mobile-input-field').addEventListener('input', function(event) {
    // Get the typed text from the textarea
    const typedText = event.target.value;

    // Split the text into words
    const typedWords = typedText.trim().split(' ');

    // Select all the words in the display
    const displayWords = document.querySelectorAll('.word');

    // Iterate through each typed word
    typedWords.forEach((typedWord, index) => {
        // Get the corresponding word from the display
        const displayWord = displayWords[index];

        // Check if the displayWord exists
        if (displayWord) {
            // Get all the letters in the display word
            const displayLetters = displayWord.querySelectorAll('.letter');

            // Iterate through each letter in the typed word
            typedWord.split('').forEach((typedLetter, letterIndex) => {
                // Get the corresponding letter from the display word
                const displayLetter = displayLetters[letterIndex];

                // Check if the displayLetter exists
                if (displayLetter) {
                    // Mark the letter as correct or incorrect
                    displayLetter.classList.add(typedLetter === displayLetter.textContent ? 'correct' : 'incorrect');
                }
            });
        }
    });

    // Calculate and display WPM
    const correctWords = document.querySelectorAll('.word .letter.correct').length / 5;
    document.getElementById('info').textContent = `WPM: ${Math.round(correctWords * 2)}`;

    // Check if the game is over
    if (typedText.length >= words.join(' ').length) {
        gameOver();
    }
});

newGame()





// window.addEventListener('resize', function() {
//     var gameElement = document.getElementById('Game');
//     var screenWidth = window.innerWidth;
    
//     if (screenWidth < 700) {
//       gameElement.setAttribute('tabindex', '100');
//     } else {
//       gameElement.removeAttribute('tabindex');
//     }
//   });





