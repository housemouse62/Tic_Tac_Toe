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
        if (board[row][column].getValue() !== 0) return
      
        board[row][column].addToken(player);

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

function GameController(
    playerOneName,
    playerTwoName
 //   playerOneName = prompt("Player One name?"),
   // playerTwoName = prompt("Player Two name?")
) {
    const gameboard = Gameboard();

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
        console.log(`${getCurrentPlayer().name} has played.`);
    
        gameboard.dropToken(row, column, getCurrentPlayer().token);  
        
        
        if (Checkwin(row, column)) { 
            if (PlayAgainQuestion()) { 
                ResetGame()} 
            } else if (Checkdraw()) {
                alert('DRAW!');
                if (PlayAgainQuestion()) { ResetGame() }
            } else { switchPlayerTurn();
                     printNextRound(); }
    };     

    const Checkwin = (row, column) => {
        console.log("row:", row, "column:", column);
        const rowCheck = gameboard.getBoard()[row].map(cell => cell.getValue());
        const columnCheck = gameboard.getBoard().map(row => row[column].getValue());
        const diagonalCheck = [gameboard.getBoard()[0][0].getValue(), gameboard.getBoard()[1][1].getValue(), gameboard.getBoard()[2][2].getValue()];
        const antiDiagonalCheck = [gameboard.getBoard()[2][0].getValue(), gameboard.getBoard()[1][1].getValue(), gameboard.getBoard()[0][2].getValue()];
        
        const isMarker = (currentMarker) => currentMarker === getCurrentPlayer().token;
        
        if (rowCheck.every(isMarker)) {
            console.log(`${getCurrentPlayer().name} has won!`);
            return true;
        };

        if (columnCheck.every(isMarker)) {
            console.log(`${getCurrentPlayer().name} has won!`);
            return true;
        };

        if (diagonalCheck.every(isMarker)) {
            console.log(`${getCurrentPlayer().name} has won!`);
            return true;
        };

        if (antiDiagonalCheck.every(isMarker)) {
            console.log(`${getCurrentPlayer().name} has won!`);
            return true;
        };

        return false;
    };

    const Checkdraw = () => {
        const boardArray = gameboard.getBoard().map(row => row.map(cell => cell.getValue()));
        const flatBoard = boardArray.flat();
        console.log(flatBoard);
        
        const isItMarked = (currentMarker) => currentMarker !== 0;
            console.log(flatBoard.every(isItMarked));
            if (flatBoard.every(isItMarked)) {
                console.log('draw')
                return true;
        };

        return false;
    };
    const PlayAgainQuestion = () => {
        while (true) {
        const userAnswer = prompt('Would you like to play again? Y / N?');
        console.log(userAnswer)
        if (userAnswer.toUpperCase() !== 'Y' && userAnswer.toUpperCase() !== 'N') continue;
        if (userAnswer.toUpperCase() === 'Y') return true;
        if (userAnswer.toUpperCase() === 'N') return false;
    }};

    const ResetGame = () => {
        gameboard.resetBoard();
        currentPlayer = players[1];
        switchPlayerTurn();
        printNextRound();
        console.log('I reset')
    };

    printNextRound();

    return {
        playRound,
        getCurrentPlayer
    };
}

const game = GameController();
