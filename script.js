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
        console.log('success')
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
    playerOneName = prompt("Player One name?"),
    playerTwoName = prompt("Player Two name?")
) {
    const board = Gameboard();

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
        board.printBoard();
        console.log(`${getActivePlayer().name}'s turn`);
    };

    const playRound = (userInput) => {
        let row = Math.floor((userInput-1) / 3);
        let column = ((userInput - 1) % 3);
        console.log(`${getActivePlayer().name} has played.`);
        board.dropToken(row, column, getActivePlayer().token);
        
        console.log(getActivePlayer().token)
        console.log(board[0])
    //   const checkWin = (row) => {
    //     let checkNum = getActivePlayer().token;
    //     console.log(checkNum);
    //     if (board[row].includes(checkNum)) {
    //         console.log('no win')
    //     }}
    //     checkWin();
        
        //check for winner & handle that logic including win message.

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
