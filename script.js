// --- 初始變數選取 DOM ---
const boardEl = document.getElementById('board');
const cells = Array.from(document.querySelectorAll('.cell'));
const btnReset = document.getElementById('reset');
const btnResetAll = document.getElementById('reset-all'); // 改良功能新增
const turnEl = document.getElementById('turn');
const stateEl = document.getElementById('state');

// 計分板元素
const scoreXEl = document.getElementById('score-x');
const scoreOEl = document.getElementById('score-o');
const scoreDrawEl = document.getElementById('score-draw');

// 遊戲狀態變數
let board, current, active;
// 計分用變數
let scoreX = 0;
let scoreO = 0;
let scoreDraw = 0;

// 勝利條件 (8種線條組合)
const WIN_LINES = [
    [0,1,2], [3,4,5], [6,7,8], // rows
    [0,3,6], [1,4,7], [2,5,8], // cols
    [0,4,8], [2,4,6]           // diags
];

// --- 函式定義 ---

// 起始函式
function init() {
    board = Array(9).fill('');
    current = 'X';
    active = true;
    
    cells.forEach(c => {
        c.textContent = '';
        c.className = 'cell'; // 重置 class，移除 x, o, win
        c.disabled = false;
    });
    
    turnEl.textContent = current;
    stateEl.textContent = '';
}

// 下手邏輯
function place(idx) {
    if (!active || board[idx]) return;
    
    board[idx] = current;
    const cell = cells[idx];
    cell.textContent = current;
    cell.classList.add(current.toLowerCase()); // 加入 .x 或 .o class
    
    const result = evaluate();
    
    if (result.finished) {
        endGame(result);
    } else {
        switchTurn();
    }
}

// 換手函式
function switchTurn() {
    current = current === 'X' ? 'O' : 'X';
    turnEl.textContent = current;
}

// 評估勝負
function evaluate() {
    for (const line of WIN_LINES) {
        const [a, b, c] = line;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return { finished: true, winner: board[a], line };
        }
    }
    // 檢查平手 (所有格子都有值)
    if (board.every(v => v)) {
        return { finished: true, winner: null };
    }
    return { finished: false };
}

// 遊戲結束處理 (包含計分板更新)
function endGame({ winner, line }) {
    active = false;
    if (winner) {
        stateEl.textContent = `${winner} 勝利!`;
        // 畫出勝利線條樣式
        line.forEach(i => cells[i].classList.add('win'));
        
        // 更新分數
        if (winner === 'X') scoreX++; else scoreO++;
    } else {
        stateEl.textContent = '平手';
        scoreDraw++;
    }
    updateScoreboard();
    
    // 鎖定所有格子
    cells.forEach(c => c.disabled = true);
}

// 更新計分板數字
function updateScoreboard() {
    scoreXEl.textContent = scoreX;
    scoreOEl.textContent = scoreO;
    scoreDrawEl.textContent = scoreDraw;
}

// --- 事件綁定 ---

// 綁定棋盤格點擊
cells.forEach(cell => {
    cell.addEventListener('click', () => {
        const idx = +cell.getAttribute('data-idx');
        place(idx);
    });
});

// 重開一局 (保留分數)
btnReset.addEventListener('click', init);

// 重置計分 (連同遊戲)
btnResetAll.addEventListener('click', () => {
    scoreX = scoreO = scoreDraw = 0;
    updateScoreboard();
    init();
});

// 啟動遊戲
init();