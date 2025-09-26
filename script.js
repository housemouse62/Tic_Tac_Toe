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

function SetupGame() {
    const playerOneName = playerOnePrompt();
    const playerTwoName = playerTwoPrompt();

    function playerOnePrompt() {
        let playerOneName = prompt("Player One name?");
        
        if (playerOneName === null || playerOneName.trim() === '') {
        playerOneName = 'Player One'
        };
        return playerOneName;
    };

    function playerTwoPrompt() {
        let playerTwoName = prompt("Player Two name?");
        
        if (playerTwoName === null || playerTwoName.trim() === '') {
        playerTwoName = 'Player Two'
        };
        return playerTwoName;
    };

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
        const cellChosen = board[row][column];
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
        console.log(success)
        if (!success) {
            console.log('That cell is already full, try another.');
            printNextRound;
            return;
        };

        console.log(`${getCurrentPlayer().name} has played.`);
        
        if (Checkwin(row, column)) { 
            if (PlayAgainQuestion()) {
                SetNextRound()} 
            } else if (Checkdraw()) {
                console.log(scoreboard.getScores())
                alert("It's a DRAW!");
                if (PlayAgainQuestion()) { SetNextRound() }
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
            AnnounceWinner();
            return true;
        };

        if (columnCheck.every(isMarker)) {
            PassScoreInfo();
            AnnounceWinner();
            return true;
        };

        if (diagonalCheck.every(isMarker)) {
            PassScoreInfo();
            AnnounceWinner();
            return true;
        };

        if (antiDiagonalCheck.every(isMarker)) {
            PassScoreInfo();
            AnnounceWinner();
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

    const AnnounceWinner = () => {
        console.log(`${getCurrentPlayer().name} has won!`);
    };

    const PlayAgainQuestion = () => {
        while (true) {
        const userAnswer = prompt('Would you like to play again? Y / N?');

        if (userAnswer === null) continue;
        if (userAnswer.toUpperCase() !== 'Y' && userAnswer.toUpperCase() !== 'N') continue;
        if (userAnswer.toUpperCase() === 'Y') return true;
        if (userAnswer.toUpperCase() === 'N') return false;
    }};

    //Use to ResetGameCompletely
    // const ResetGame = () => {
    //     gameboard.resetBoard();
    //     currentPlayer = players[1];
    //     scoreboard.reset();
    //     console.log(scoreboard.getScores())
    //     switchPlayerTurn();
    //     printNextRound();
    //     console.log('I reset')
    // };

    const SetNextRound = () => {
        gameboard.resetBoard();
        printNextRound();
    }

    printNextRound();

    return {
        playRound,
        getCurrentPlayer
    };
};

const { game, scoreboard } = SetupGame();