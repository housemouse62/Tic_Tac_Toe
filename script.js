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

    return { getBoard, dropToken, printBoard};
}

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

    let activePlayer = players[0];

    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };
    const getActivePlayer = () => activePlayer;

    const printNewRound = () => {
        gameboard.printBoard();
        console.log(`${getActivePlayer().name}'s turn`);
    };

    const playRound = (userInput) => {
        let row = Math.floor((userInput-1) / 3);
        let column = ((userInput - 1) % 3);
        console.log(`${getActivePlayer().name} has played.`);
    
        gameboard.dropToken(row, column, getActivePlayer().token);
        
        
        const Checkwin = (row, column) => {
            console.log("row:", row, "column:", column);
            const rowCheck = gameboard.getBoard()[row].map(cell => cell.getValue());
            const columnCheck = gameboard.getBoard().map(row => row[column].getValue());
            const diagonalCheck = [gameboard.getBoard()[0][0].getValue(), gameboard.getBoard()[1][1].getValue(), gameboard.getBoard()[2][2].getValue()];
            const antiDiagonalCheck = [gameboard.getBoard()[2][0].getValue(), gameboard.getBoard()[1][1].getValue(), gameboard.getBoard()[0][2].getValue()];
            
            const isMarker = (currentMarker) => currentMarker === getActivePlayer().token;
            
            if (rowCheck.every(isMarker)) {
            console.log(`${getActivePlayer().name} has won!`);
            return true;
            };

            if (columnCheck.every(isMarker)) {
            console.log(`${getActivePlayer().name} has won!`);
            return true;
            };

            if (diagonalCheck.every(isMarker)) {
            console.log(`${getActivePlayer().name} has won!`);
            return true;
            };

            if (antiDiagonalCheck.every(isMarker)) {
            console.log(`${getActivePlayer().name} has won!`);
            return true;
            };
        };

       const Checkdraw = () => {
            const boardArray = gameboard.getBoard().map(row => row.map(cell => cell.getValue()));
            const flatBoard = boardArray.flat();

            const isItMarked = (currentMarker) => currentMarker !== 0;
            if (flatBoard.every(isItMarked)) {
                console.log('draw')
            }

            
       }

                

        
        //check for winner & handle that logic including win message.
    Checkwin(row, column);
    Checkdraw(row);
    switchPlayerTurn();
    printNewRound();
};

    printNewRound();

    return {
        playRound,
        getActivePlayer
    };
}

const game = GameController();
