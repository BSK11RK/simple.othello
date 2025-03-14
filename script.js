let board = [
    ["","","","","","","",""],
    ["","","","","","","",""],
    ["","","","","","","",""],
    ["","","","B","W","","",""],
    ["","","","W","B","","",""],
    ["","","","","","","",""],
    ["","","","","","","",""],
    ["","","","","","","",""],
];

let currentPlayer = "B"; //黒が先行

const boardElement = document.querySelector(".board");

for(let i = 0; i < board.length; i++){
    for(let j = 0; j < board[i].length; j++){
        const cellElement = document.createElement("div");
        cellElement.classList.add("cell");
        if(board[i][j] === "B"){
            cellElement.classList.add("black");
        }else if(board[i][j] === "W"){
            cellElement.classList.add("white");
        }

        cellElement.addEventListener("click", function(){
            if(isValidMove(i, j, "B")){
                board[i][j] = "B";
                flipTiles(i, j,"B");
                updateBoard();
                currentPlayer = "W";

                console.log("ユーザーのターン完了、AIターン開始準備");

                setTimeout(() => {
                    aiMove();
                }, (Math.floor(Math.random() * 8) + 2) * 100);

                const randomRow = Math.floor(Math.random() * 8);
                const randomCol = Math.floor(Math.random() * 8);

                if(isValidMove(randomRow,randomCol , "W")){
                    board[randomRow][randomCol] = "W";
                    flipTiles(randomRow,randomCol, "W");
                    updateBoard();
                }
            }
        });
           boardElement.appendChild(cellElement);
    }
}

function updateBoard(){
    const cells = document.querySelectorAll(".cell");
    for(let i = 0; i < cells.length; i++){
        const row = Math.floor(i/8);
        const col = i % 8;
        cells[i].className = "cell";
        if(board[row][col] === "B"){
            cells[i].classList.add("black");
        }else if(board[row][col] === "W"){ 
            cells[i].classList.add("white");
        }
    }
}

function isValidMove(row, col, player){
    if(board[row][col] !== ""){
        return false;
    }

    const opponent = player === "B" ? "W" : "B";

    for(let dr = -1; dr <= 1; dr ++){
        for(let dc= -1; dc <= 1; dc ++){
            if(dr === 0 && dc === 0){
                continue;
            }

            let r = row + dr;
            let c = col + dc;

            let foundOpponent = false;

            while(r >= 0 && r < 8 && c >= 0 && c <8){
                if(board[r][c] === opponent){
                    foundOpponent = true;
                }else if(board[r][c] === player && foundOpponent){
                    return true;
                }else{
                    break;
                }

                r += dr;
                c += dc;
            }
        }
    }

    return false;
}

function aiMove(){
    let validMoves = [];

    for(let i = 0; i < board.length; i++){
        for (let j = 0; j <board[i].length; j++){
            if (isValidMove(i,j,"W")){
                validMoves.push({row: i , col: j});
            }
        }
    }

    if(validMoves.length > 0){
        const randomIndex = Math.floor(Math.random() * validMoves.length);
        const {row, col} = validMoves[randomIndex];
        board[row][col] = "W";
        flipTiles(row, col, "W");
        updateBoard();
        currentPlayer = "B";
    }

    if(isValidMove(i, j, "B")) {
        board[i][j] = "B";
        flipTiles(i, j, "B");
        updateBoard();
    
        console.log("ユーザーのターン完了、AIターン開始準備");
    
        setTimeout(() => {
            aiMove(); 
            console.log("AIのターン完了");
        }, 100); 
    }       
}

function flipTiles(row, col,player){
    const opponent = player === "B" ? "W" : "B";

    for(let dr = -1; dr <= 1; dr++){
        for(let dc =-1; dc <= 1; dc++){
            if(dr === 0 && dc === 0){
                continue;
            }

            let r = row + dr;
            let c = col + dc;
            let foundOpponent = false;
            let tilesToFlip = [];

            while(r >= 0 && r < 8 && c >= 0 && c< 8){
                if(board[r][c] === opponent){
                    foundOpponent = true;
                    tilesToFlip.push({row : r, col: c});
            }else if(board[r][c] === player && foundOpponent){
                for(const tile of tilesToFlip){
                    board[tile.row][tile.col] = player;
                }
                break;
                }else{
                break;
                }

                r += dr;
                c += dc;
            }
        }
    }
}

function isGameOver(){
    let isBoardFull = true;
    for(let i = 0; i < board.length; i++){
        for(let j =0; j < board[i].length; j++){
            if(board[i][j] === ""){
                isBoardFull = false;
                break;
            }
        }
         if(!isBoardFull){
            break;
        }
    }

    let hasValidMoves = false;
    for(let i = 0; i < board.length; i++){
        for(let j = 0; j < board[i].length; j++){
            if(isValidMove(i,j,currentPlayer)){
                hasValidMoves = true;
                break;
            }
        }

        if(hasValidMoves){
            break;
        }
    }

    return isBoardFull || !hasValidMoves;
}


