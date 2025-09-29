const Scoreboard = (player1Name, player2Name) =>  {
    
    let scores = {[player1Name]: 0,
                  [player2Name]: 0};
    
    const increment = (playerName) => {
        scores[playerName]++
    };

    const reset = () => {
        scores = {[player1Name]: 0, [player2Name]: 0};
    };

    const getScores = () => ({...scores});
    const getPlayerNames = () => [player1Name, player2Name];

    return { increment, reset, getScores, getPlayerNames };
}

function SetupGame(playerOneName, playerTwoName) {
    const scoreboard = Scoreboard(playerOneName, playerTwoName);
    const game = GameController(scoreboard);

    return { scoreboard, game };
 
}

function Gameboard() {
    const rows = 3;
    const columns = 3;
    const board = [];

    for (let i = 0; i < rows; i++) {
        board[i] = [];
        for (let j = 0; j < columns; j++) {
            board[i].push(Cell());
        }
    }

    const getBoard = () => board;

    const dropToken = (row, column, player) => {
        if (board[row][column].getValue() !== 0) {
            return false};
      
        board[row][column].addToken(player);
        return true;

    };

    const printBoard = () => {
        const boardWithCellValues = board.map((row) => row.map((cell) => cell.getValue()))
        console.log(boardWithCellValues);
    };

    const resetBoard = () => {
        for (let i = 0; i < rows; i++) {
            board[i] = [];
            for (let j = 0; j < columns; j++) {
                board[i].push(Cell());
            };
        };
    };

    return { getBoard, dropToken, printBoard, resetBoard };
};

function Cell() {
    let value = 0;

    const addToken = (player) => {
        value = player;
    };

    const getValue = () => value;

    return {
        addToken,
        getValue
    };
}

function GameController(scoreboard) {
    const gameboard = Gameboard();
    let roundOverCallback = null;

    const setRoundOverCallback = (cb) => {
        roundOverCallback = cb;
    };

    const getGameboard = () => gameboard; //getter for DOM

    const [playerOneName, playerTwoName] = scoreboard.getPlayerNames();

    const players = [
        {
            name: playerOneName,
            token: 'X'
        },
        {
            name: playerTwoName,
            token: 'O'
        }
    ];

    let currentPlayer = players[0];

    const switchPlayerTurn = () => {
        currentPlayer = currentPlayer === players[0] ? players[1] : players[0];
    };
    const getCurrentPlayer = () => currentPlayer;

    const printNextRound = () => {
        gameboard.printBoard();
        console.log(`${getCurrentPlayer().name}'s turn`);
    };

    const playRound = (userInput) => {
        let row = Math.floor((userInput-1) / 3);
        let column = ((userInput - 1) % 3);
        
        const success = gameboard.dropToken(row, column, getCurrentPlayer().token);

        if (!success) {
            console.log('That cell is already full, try another.');
            printNextRound();
            return;
        };

        console.log(`${getCurrentPlayer().name} has played.`);
        
        if (Checkwin(row, column)) { 
            announceWinner({ name: currentPlayer.name, token: currentPlayer.token });
     //       if (PlayAgainQuestion()) {
     //           SetNextRound()} 
            } else if (Checkdraw()) {
            announceWinner(null);
      //          console.log(scoreboard.getScores())
      //          alert("It's a DRAW!");
       //         if (PlayAgainQuestion()) { SetNextRound() }
            } else { switchPlayerTurn();
                     printNextRound();
                    }
    };     

    const Checkwin = (row, column) => {
        const rowCheck = gameboard.getBoard()[row].map(cell => cell.getValue());
        const columnCheck = gameboard.getBoard().map(row => row[column].getValue());
        const diagonalCheck = [gameboard.getBoard()[0][0].getValue(), gameboard.getBoard()[1][1].getValue(), gameboard.getBoard()[2][2].getValue()];
        const antiDiagonalCheck = [gameboard.getBoard()[2][0].getValue(), gameboard.getBoard()[1][1].getValue(), gameboard.getBoard()[0][2].getValue()];
        
        const isMarker = (currentMarker) => currentMarker === getCurrentPlayer().token;

        if (rowCheck.every(isMarker)) {
            PassScoreInfo();
            return true;
        };

        if (columnCheck.every(isMarker)) {
            PassScoreInfo();
            return true;
        };

        if (diagonalCheck.every(isMarker)) {
            PassScoreInfo();
            return true;
        };

        if (antiDiagonalCheck.every(isMarker)) {
            PassScoreInfo();
            return true;
        };

        return false;
    };

    const Checkdraw = () => {
        const boardArray = gameboard.getBoard().map(row => row.map(cell => cell.getValue()));
        const flatBoard = boardArray.flat();
        
        const isItMarked = (currentMarker) => currentMarker !== 0;
            if (flatBoard.every(isItMarked)) {
                console.log('draw')
                return true;
        };

        return false;
    };
    
    const PassScoreInfo = () => {
        scoreboard.increment(getCurrentPlayer().name);
        console.log(scoreboard.getScores());
    };


    const announceWinner = winner => {
        if(roundOverCallback) {
            roundOverCallback(winner)
        }
    };

    const PlayAgainQuestion = () => {
        while (true) {
        const userAnswer = prompt('Would you like to play again? Y / N?');

        if (userAnswer === null) continue;
        if (userAnswer.toUpperCase() !== 'Y' && userAnswer.toUpperCase() !== 'N') continue;
        if (userAnswer.toUpperCase() === 'Y') return true;
        if (userAnswer.toUpperCase() === 'N') return false;
    }};

    // Use to ResetGameCompletely
    const ResetGame = () => {
        gameboard.resetBoard();
        currentPlayer = players[1];
        scoreboard.reset();
        switchPlayerTurn();
        printNextRound();
    };

    const SetNextRound = () => {
        gameboard.resetBoard();
        printNextRound();
    }

    printNextRound();

    return {
        playRound,
        getCurrentPlayer,
        getGameboard, //give the gameboard to the DOM
        ResetGame,
        SetNextRound,
        setRoundOverCallback
    };
};

const startGame = () => {
        const startButton = document.getElementById("startButton");
        document.getElementById('welcomeDialogue').style.display = 'block';
        startButton.addEventListener('click', () => {
            const user1 = document.getElementById("player1").value || 'Player One';
            const user2 = document.getElementById("player2").value || 'Player Two';
        document.getElementById('welcomeDialogue').style.display = 'none';


        const { game, scoreboard } = SetupGame(user1, user2);
        DOMController( game, scoreboard);
        });
};    

function DOMController(game, scoreboard) {
    const container = document.querySelector('#container')
    const [p1, p2] = scoreboard.getPlayerNames()

    //score area
    const scorearea = document.createElement('div');
        scorearea.classList = 'scoreArea';
    const playerOneScore = document.createElement('div');
        playerOneScore.classList = 'playerScoreBoard';
    const playerTwoScore = document.createElement('div');
        playerTwoScore.classList = 'playerScoreBoard';
    
    

    //game grid
    const gameGridArea = document.createElement('div');
         gameGridArea.classList = 'gameGridArea';
    const squares = [];
    
    const createSquares = (id) => {
        const newSquare = document.createElement('div');
        newSquare.classList.add("square");
        newSquare.dataset.id = id;

        newSquare.addEventListener("click", () => {
            game.playRound(id);
            renderBoard();
            renderScores();
        });

        gameGridArea.append(newSquare);
        squares.push(newSquare);
    };
        for (let i = 1; i < 10; i++) {
        createSquares(i);
        };

        container.appendChild(gameGridArea);

     // Message Area
    const messageArea = document.createElement('h3');
        messageArea.classList = 'messageArea';
    container.appendChild(messageArea);

    container.appendChild(scorearea);
    scorearea.appendChild(playerOneScore);
    scorearea.appendChild(playerTwoScore);

    // Buttons
    const buttonArea = document.createElement('div');
        buttonArea.classList = 'buttonArea';
    const resetGameButton = document.createElement('button');
        resetGameButton.classList = 'resetGame';

       resetGameButton.addEventListener('click', () => {
         game.ResetGame();
         renderScores();
         renderBoard();

       });
    
    // Render Helpers
    const renderBoard = () => {
        const board = game.getGameboard().getBoard();
            board.forEach((row, i) => {
                row.forEach((cell, j) => {
                    const index = i * 3 + j;
                    squares[index].textContent = cell.getValue() === 0 ? "" : cell.getValue();
                });
            });
    };
    
    const roundOver = (winnerName) => {
        const roundOverDialogue = document.getElementById('roundOverDialogue');
        const winnerClass = document.querySelector('.winner');
        const scoreIsNowClass = document.querySelector('.scoreIsNow');
       
        //Show popup
        roundOverDialogue.style.display = 'block';

        //Announce winner
        if (winnerName === null) {
            winnerClass.textContent = "It's a draw!"
        } else {
        winnerClass.textContent = `${winnerName.name} wins!`;
        };

        //Show Updated Score
        const p1Score = scoreboard.getScores()[p1];
        const p2Score = scoreboard.getScores()[p2];
        scoreIsNowClass.textContent = `${p1}: ${p1Score} | ${p2}: ${p2Score}`;

        //Buttons
        const startAllOver = document.getElementById('startAllOver');
        const nextRoundButton = document.getElementById("nextRoundButton");
            nextRoundButton.innerHTML = "New Round";

        nextRoundButton.addEventListener('click', () => {
            game.SetNextRound()
            renderScores();
            renderBoard();
            roundOverDialogue.style.display = 'none';
        });

        startAllOver.addEventListener('click', () => {
         game.ResetGame();
         renderScores();
         renderBoard();
         roundOverDialogue.style.display = 'none';
       });

        
    };

        // Scoring
    const renderScores = () => {
        const p1Score = scoreboard.getScores()[p1];
        const p2Score = scoreboard.getScores()[p2];
    
        playerOneScore.innerHTML = `${p1}: ${p1Score}`;
        playerTwoScore.innerHTML = `${p2}: ${p2Score}`;
    };
    

       resetGameButton.innerHTML = "Reset Game";
    container.appendChild(buttonArea);
    buttonArea.appendChild(nextRoundButton);
    buttonArea.appendChild(resetGameButton);
    
    game.setRoundOverCallback(roundOver);

    renderBoard();
    renderScores();
    
};

startGame();

