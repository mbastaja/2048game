document.addEventListener('DOMContentLoaded', () => {
    const gridDisplay = document.querySelector('.grid')
    const infoDisplay = document.querySelector('.fa-info-circle').onclick = showAbout;
    const aboutDisplay = document.querySelector('.about')
    const scoreDisplay = document.getElementById('score')
    const bestDisplay = document.getElementById('best')
    const resultDisplay = document.getElementById('result')
    const startGame = document.getElementById("start").onclick = startingGame;
    const addPoints = document.getElementById("add-points")
    const checkBox = document.querySelector('.checkbox')
    const width = 4
    let squares = []
    let score = 0
    let bestParsed = 0
    let best = 0
    let gameOver = false
    let endless = false
    let gameStarted = false
    let counter = 0


    window.addEventListener("load", function () {
        let bestLS = localStorage.getItem('best')
        bestParsed = bestLS
        bestDisplay.innerText = bestParsed
    });

    checkBox.addEventListener('change', () => {
        if (checkBox.checked) {
            endless = true
        } else {
            endless = false
        }
    })

    //create a playing board
    function createBoard() {
        for (let i = 0; i < width * width; i++) {
            square = document.createElement('div')
            square.innerText = 0
            gridDisplay.appendChild(square)
            squares.push(square)
        }
        generate()
        generate()
        fixTilesColor()
    }

    function startingGame() {
        resultDisplay.innerText = ""
        scoreDisplay.innerText = "0"
        gameOver = false
        squares.length = 0
        gridDisplay.innerText = ""
        createBoard()
        resultDiv = document.getElementById("result");
        resultDiv.style.visibility = "hidden"
        document.addEventListener('keyup', control)
        aboutDisplay.style.visibility = "hidden"
        showInfo = document.querySelector('.fa-info-circle')
        showInfo.style.visibility = "visible"
        gameStarted = true
        // scoreDisplay.innerText = 0
        score = 0
        checkForBestScore()
        let callFunc = setInterval(checkForGameOver, 100);
    }

    function showAbout() {
        $(".about").toggle()
        aboutDisplay.style.visibility = "visible"
    }

    $(".game-container").click(function (e) {
        if (gameStarted) {
            $('.about').fadeOut();
        }

    });
    $(".button-container").click(function (e) {
        if (gameStarted) {
            $('.about').fadeOut();
        }
    });

    //generate numbers randomly
    function generate() {
        fixTiles()
        let randomNumber = Math.floor(Math.random() * squares.length)
        if (squares[randomNumber].innerText == 0) {
            //2's appear 90% of the time and 4's appear 10% of the time
            squares[randomNumber].innerText = Math.random() < 0.9 ? 2 : 4
            squares[randomNumber].classList.add("tile-new")
        } else {
            generate()
        }
    }

    //swipe right
    function moveRight(param) {
        for (let i = 0; i < 16; i++) {
            if (i % 4 === 0) {

                let totalOne = param[i].innerText
                let totalTwo = param[i + 1].innerText
                let totalThree = param[i + 2].innerText
                let totalFour = param[i + 3].innerText
                let row = [parseInt(totalOne), parseInt(totalTwo), parseInt(totalThree), parseInt(totalFour)]

                let filteredRow = row.filter(num => num)
                let missing = 4 - filteredRow.length
                let zeros = Array(missing).fill(0)
                let newRow = zeros.concat(filteredRow)

                param[i].innerText = newRow[0]
                param[i + 1].innerText = newRow[1]
                param[i + 2].innerText = newRow[2]
                param[i + 3].innerText = newRow[3]
            }
        }
    }

    //swipe left
    function moveLeft(param) {
        for (let i = 0; i < 16; i++) {
            if (i % 4 === 0) {

                let totalOne = param[i].innerText
                let totalTwo = param[i + 1].innerText
                let totalThree = param[i + 2].innerText
                let totalFour = param[i + 3].innerText
                let row = [parseInt(totalOne), parseInt(totalTwo), parseInt(totalThree), parseInt(totalFour)]

                let filteredRow = row.filter(num => num)
                let missing = 4 - filteredRow.length
                let zeros = Array(missing).fill(0)
                let newRow = filteredRow.concat(zeros)

                param[i].innerText = newRow[0]
                param[i + 1].innerText = newRow[1]
                param[i + 2].innerText = newRow[2]
                param[i + 3].innerText = newRow[3]
            }
        }
    }

    //swipe down
    function moveDown(param) {
        for (let i = 0; i < 4; i++) {

            let totalOne = param[i].innerText
            let totalTwo = param[i + width].innerText
            let totalThree = param[i + (width * 2)].innerText
            let totalFour = param[i + (width * 3)].innerText
            let column = [parseInt(totalOne), parseInt(totalTwo), parseInt(totalThree), parseInt(totalFour)]

            let filteredColumn = column.filter(num => num)
            let missing = 4 - filteredColumn.length
            let zeros = Array(missing).fill(0);
            let newColumn = zeros.concat(filteredColumn)

            param[i].innerText = newColumn[0]
            param[i + width].innerText = newColumn[1]
            param[i + (width * 2)].innerText = newColumn[2]
            param[i + (width * 3)].innerText = newColumn[3]
        }
    }

    //swipe up
    function moveUp(param) {
        for (let i = 0; i < 4; i++) {

            let totalOne = param[i].innerText
            let totalTwo = param[i + width].innerText
            let totalThree = param[i + (width * 2)].innerText
            let totalFour = param[i + (width * 3)].innerText
            let column = [parseInt(totalOne), parseInt(totalTwo), parseInt(totalThree), parseInt(totalFour)]

            let filteredColumn = column.filter(num => num)
            let missing = 4 - filteredColumn.length
            let zeros = Array(missing).fill(0);
            let newColumn = filteredColumn.concat(zeros)

            param[i].innerText = newColumn[0]
            param[i + width].innerText = newColumn[1]
            param[i + (width * 2)].innerText = newColumn[2]
            param[i + (width * 3)].innerText = newColumn[3]
        }
    }

    function combineRowLeft(param) {
        for (let i = 0; i < width * width; i++) {
            gridDisplay.children[i].classList.remove("tile-merged")
        }
        let combinedTotala = 0
        addPoints.classList.remove("score-transition")
        for (let i = 0; i < 15; i++) {
            if ((i % 4 !== 3) && param[i].innerText === param[i + 1].innerText && param[i].innerText !== '0') {
                let combinedTotal = parseInt(param[i].innerText) + parseInt(param[i + 1].innerText)
                param[i].innerText = combinedTotal
                param[i].classList.add("tile-merged")
                param[i + 1].innerText = 0
                score += combinedTotal
                combinedTotala += combinedTotal
                scoreDisplay.innerText = score
            }
        }
        if (combinedTotala > 0) {
            addPoints.innerHTML = `+${combinedTotala}`
            addPoints.classList.add("score-transition")
            addPoints.style.visibility = "visible";

            setTimeout(function () {
                addPoints.style.visibility = "hidden";
            }, 450);
        }
        checkForWin()
        checkForBestScore()

    }
    function combineRowRight(param) {
        for (let i = 0; i < width * width; i++) {
            gridDisplay.children[i].classList.remove("tile-merged")
        }
        let combinedTotala = 0
        addPoints.classList.remove("score-transition")
        for (let i = 15; i >= 1; i--) {
            if (param[i].innerText !== '0' && param[i].innerText === param[i - 1].innerText) {
                let combinedTotal = parseInt(param[i].innerText) + parseInt(param[i - 1].innerText)
                param[i].innerText = combinedTotal
                param[i].classList.add("tile-merged")
                param[i - 1].innerText = 0
                score += combinedTotal
                combinedTotala += combinedTotal
                scoreDisplay.innerText = score
            }
        }
        if (combinedTotala > 0) {
            addPoints.innerHTML = `+${combinedTotala}`
            addPoints.classList.add("score-transition")
            addPoints.style.visibility = "visible";

            setTimeout(function () {
                addPoints.style.visibility = "hidden";
            }, 450);
        }
        checkForWin()
        checkForBestScore()
    }

    function combineColumnUp(param) { // up
        for (let i = 0; i < width * width; i++) {
            gridDisplay.children[i].classList.remove("tile-merged")
        }
        let combinedTotala = 0
        addPoints.classList.remove("score-transition")
        for (let i = 0; i < 12; i++) {
            if (param[i].innerText === param[i + width].innerText && param[i].innerText !== '0') {
                let combinedTotal = parseInt(param[i].innerText) + parseInt(param[i + width].innerText)
                param[i].innerText = combinedTotal
                param[i].classList.add("tile-merged")
                param[i + width].innerText = 0
                score += combinedTotal
                combinedTotala += combinedTotal
                scoreDisplay.innerText = score
            }
        }
        if (combinedTotala > 0) {
            addPoints.innerHTML = `+${combinedTotala}`
            addPoints.classList.add("score-transition")
            addPoints.style.visibility = "visible";

            setTimeout(function () {
                addPoints.style.visibility = "hidden";
            }, 450);
        }
        checkForWin()
        checkForBestScore()
    }

    function combineColumnDown(param) {
        for (let i = 0; i < width * width; i++) {
            gridDisplay.children[i].classList.remove("tile-merged")
        }
        let combinedTotala = 0
        addPoints.classList.remove("score-transition")
        for (let i = 15; i >= 4; i--) {
            if (param[i].innerText === param[i - width].innerText && param[i].innerText !== '0') {
                let combinedTotal = parseInt(param[i].innerText) + parseInt(param[i - width].innerText)
                param[i].innerText = combinedTotal
                param[i].classList.add("tile-merged")
                param[i - width].innerText = 0
                score += combinedTotal
                combinedTotala += combinedTotal
                scoreDisplay.innerText = score
            }
        }
        if (combinedTotala > 0) {
            addPoints.innerHTML = `+${combinedTotala}`
            addPoints.classList.add("score-transition")
            addPoints.style.visibility = "visible";

            setTimeout(function () {
                addPoints.style.visibility = "hidden";
            }, 450);
        }
        checkForWin()
        checkForBestScore()
    }

    //assign keybinds
    function control(e) {
        if (e.key === 'ArrowRight') {
            keyRight()
        } else if (e.key === 'ArrowLeft') {
            keyLeft()
        } else if (e.key === 'ArrowUp') {
            keyUp()
        } else if (e.key === 'ArrowDown') {
            keyDown()
        }
    }
    document.addEventListener('keyup', control)

    function keyRight() {
        for (let i = 0; i < width * width; i++) {
            gridDisplay.children[i].classList.remove("tile-new")
            gridDisplay.children[i].classList.remove("tile-merged")
        }
        let previous = JSON.stringify(squares.map(num => num.innerText))
        moveRight(squares)
        combineRowRight(squares)
        moveRight(squares)

        let nowo = JSON.stringify(squares.map(num => num.innerText))
        if (previous != nowo) {
            generate()
            fixTiles()
            fixTilesColor()
            checkForBestScore()
        }
    }

    function keyLeft() {
        for (let i = 0; i < width * width; i++) {
            gridDisplay.children[i].classList.remove("tile-new")
            gridDisplay.children[i].classList.remove("tile-merged")
        }
        let previous = JSON.stringify(squares.map(num => num.innerText))
        moveLeft(squares)
        combineRowLeft(squares)
        moveLeft(squares)

        let nowo = JSON.stringify(squares.map(num => num.innerText))
        if (previous != nowo) {
            generate()
            fixTiles()
            fixTilesColor()
            checkForBestScore()
        }
    }

    function keyDown() {
        for (let i = 0; i < width * width; i++) {
            gridDisplay.children[i].classList.remove("tile-new")
            gridDisplay.children[i].classList.remove("tile-merged")
        }
        let previous = JSON.stringify(squares.map(num => num.innerText))
        moveDown(squares)
        combineColumnDown(squares)
        moveDown(squares)
        let nowo = JSON.stringify(squares.map(num => num.innerText))
        if (previous != nowo) {
            generate()
            fixTiles()
            fixTilesColor()
            checkForBestScore()
        }
    }

    function keyUp() {
        for (let i = 0; i < width * width; i++) {
            gridDisplay.children[i].classList.remove("tile-new")
            gridDisplay.children[i].classList.remove("tile-merged")
        }
        let previous = JSON.stringify(squares.map(num => num.innerText))
        moveUp(squares)
        combineColumnUp(squares)
        moveUp(squares)

        let nowo = JSON.stringify(squares.map(num => num.innerText))
        if (previous != nowo) {
            generate()
            fixTiles()
            fixTilesColor()
            checkForBestScore()
        }
    }
    //check for the number 2048 in the squares to win
    function checkForWin() {
        if (!endless) {
            for (let i = 0; i < squares.length; i++) {
                if (squares[i].innerText == 2048) {
                    resultDiv = document.getElementById("result");
                    resultDiv.innerText = "You won!"
                    resultDiv.style.visibility = "visible"
                    gameOver = true
                    checkForBestScore()
                    document.removeEventListener('keyup', control)
                }
            }
        }
    }

    //check for empty tiles, if there are any, check if there are same numbers next to each other
    function checkForGameOver() {
        sameRight = 0
        sameDown = 0
        if (!gameOver) {
            let zeros = 0
            for (let i = 0; i < squares.length; i++) {
                if (squares[i].innerText == 0) {
                    zeros++
                }
            }
            if (zeros == 0) {
                for (let i = 0; i < squares.length - 1; i++) {
                    if (squares[i].innerText == squares[i + 1].innerText && (i % 4 !== 3)) {
                        sameRight++
                    }
                }
                for (let i = 0; i < squares.length - width; i++) {
                    if (squares[i].innerText == squares[i + width].innerText) {
                        sameDown++
                    }
                }
                if (sameRight == 0 && sameDown == 0) {
                    gameOver = true
                    resultDiv = document.getElementById("result");
                    resultDiv.innerText = "Game Over!"
                    resultDiv.style.visibility = "visible"
                    checkForBestScore()
                    document.removeEventListener('keyup', control)
                }
            }
        }
    }



    function checkForBestScore() {
        if (bestParsed) {
            bestDisplay.innerText = parseInt(bestParsed)
            localStorage.setItem('best', bestParsed)
        } if (score >= bestParsed) {
            bestDisplay.innerText = score
            bestParsed = score
            // localStorage.clear();
            // localStorage.setItem('best', score)

        }
    }

    function fixTiles() {
        for (let i = 0; i < width * width; i++) {
            if (gridDisplay.children[i].innerText === "0") {
                gridDisplay.children[i].style.color = 'rgb(64, 182, 133)'
            } else {
                gridDisplay.children[i].style.color = 'white'
                gridDisplay.children[i].style.backgroundColor = 'rgb(64, 182, 133)'
            }
        }
    }

    function fixTilesColor() {
        for (let i = 0; i < width * width; i++) {
            if (gridDisplay.children[i].innerText === "2") {
                gridDisplay.children[i].style.backgroundColor = 'rgb(135, 226, 147)'
                gridDisplay.children[i].style.color = 'white'
                gridDisplay.children[i].style.boxShadow = 'black 0px 9.08108px 9.08108px 0px'
            } else if (gridDisplay.children[i].innerText === "4") {
                gridDisplay.children[i].style.backgroundColor = 'rgb(135, 226, 115)'
                gridDisplay.children[i].style.color = 'white'
                gridDisplay.children[i].style.boxShadow = 'black 0px 9.08108px 9.08108px 0px'
            } else if (gridDisplay.children[i].innerText === "8") {
                gridDisplay.children[i].style.backgroundColor = 'rgb(238, 207, 64)'
                gridDisplay.children[i].style.color = 'white'
                gridDisplay.children[i].style.boxShadow = 'black 0px 9.08108px 9.08108px 0px'
            } else if (gridDisplay.children[i].innerText === "16") {
                gridDisplay.children[i].style.backgroundColor = 'rgb(255, 170, 79)'
                gridDisplay.children[i].style.color = 'white'
                gridDisplay.children[i].style.boxShadow = 'black 0px 9.08108px 9.08108px 0px'
            } else if (gridDisplay.children[i].innerText === "32") {
                gridDisplay.children[i].style.backgroundColor = 'rgb(107, 202, 226)'
                gridDisplay.children[i].style.color = 'white'
                gridDisplay.children[i].style.boxShadow = 'black 0px 9.08108px 9.08108px 0px'
            } else if (gridDisplay.children[i].innerText === "64") {
                gridDisplay.children[i].style.backgroundColor = 'rgb(158, 187, 238)'
                gridDisplay.children[i].style.color = 'white'
                gridDisplay.children[i].style.boxShadow = 'black 0px 9.08108px 9.08108px 0px'
            } else if (gridDisplay.children[i].innerText === "128") {
                gridDisplay.children[i].style.fontSize = '48px'
                gridDisplay.children[i].style.backgroundColor = 'white'
                gridDisplay.children[i].style.color = 'rgb(44, 62, 80)'
                gridDisplay.children[i].style.boxShadow = 'black 0px 9.08108px 9.08108px 0px'
            } else if (gridDisplay.children[i].innerText === "256") {
                gridDisplay.children[i].style.fontSize = '48px'
                gridDisplay.children[i].style.backgroundColor = 'white'
                gridDisplay.children[i].style.color = 'rgb(44, 62, 80)'
                gridDisplay.children[i].style.boxShadow = 'white 0px 0px 20px 3px'
            } else if (gridDisplay.children[i].innerText === "512") {
                gridDisplay.children[i].style.fontSize = '48px'
                gridDisplay.children[i].style.backgroundColor = 'white'
                gridDisplay.children[i].style.color = 'rgb(44, 62, 80)'
                gridDisplay.children[i].style.boxShadow = 'white 0px 0px 20px 4px'
            } else if (gridDisplay.children[i].innerText === "1024") {
                gridDisplay.children[i].style.fontSize = '39px'
                gridDisplay.children[i].style.backgroundColor = 'white'
                gridDisplay.children[i].style.color = 'rgb(44, 62, 80)'
                gridDisplay.children[i].style.boxShadow = 'white 0px 0px 20px 5px'
            } else if (gridDisplay.children[i].innerText === "2048") {
                gridDisplay.children[i].style.fontSize = '39px'
                gridDisplay.children[i].style.backgroundColor = 'white'
                gridDisplay.children[i].style.color = 'rgb(44, 62, 80)'
                gridDisplay.children[i].style.boxShadow = 'white 0px 0px 20px 6px'
            } else if (gridDisplay.children[i].innerText === "4096") {
                gridDisplay.children[i].style.fontSize = '39px'
                gridDisplay.children[i].style.backgroundColor = 'white'
                gridDisplay.children[i].style.color = 'rgb(44, 62, 80)'
                gridDisplay.children[i].style.boxShadow = 'white 0px 0px 20px 6px'
            } else if (gridDisplay.children[i].innerText === "8192") {
                gridDisplay.children[i].style.fontSize = '39px'
                gridDisplay.children[i].style.backgroundColor = 'white'
                gridDisplay.children[i].style.color = 'rgb(44, 62, 80)'
                gridDisplay.children[i].style.boxShadow = 'white 0px 0px 20px 6px'
            } else if (gridDisplay.children[i].innerText === "16384") {
                gridDisplay.children[i].style.fontSize = '29px'
                gridDisplay.children[i].style.backgroundColor = 'white'
                gridDisplay.children[i].style.color = 'rgb(44, 62, 80)'
                gridDisplay.children[i].style.boxShadow = 'white 0px 0px 20px 6px'
            } else if (gridDisplay.children[i].innerText === "0") {
                gridDisplay.children[i].style.color = 'rgb(64, 182, 133)'
                gridDisplay.children[i].style.backgroundColor = 'rgb(64, 182, 133)'
                gridDisplay.children[i].style.boxShadow = 'none'

            } else {
                gridDisplay.children[i].style.color = 'white'
                gridDisplay.children[i].style.backgroundColor = 'rgb(64, 182, 133)'
            }
        }
    }
})