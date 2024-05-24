document.getElementById('mobile-input-field').addEventListener('focus', () => {
    console.log('Input field focused');
});

document.getElementById('mobile-input-field').addEventListener('keyup', (e) => {
    let key = e.key;
    let currentWord = document.querySelector(".word.current");
    let currentLetter = document.querySelector(".letter.current");
    const expected = currentLetter?.innerHTML || ' ';
    const isLetter = key.length === 1 && key !== ' ';
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
    if (currentWord.getBoundingClientRect().top > 350) {
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
