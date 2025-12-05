// --- 初始變數選取 DOM ---
const boardEl = document.getElementById('board');
const cells = Array.from(document.querySelectorAll('.cell'));
const btnReset = document.getElementById('reset');
const btnResetAll = document.getElementById('reset-all');
const turnEl = document.getElementById('turn');
const stateEl = document.getElementById('state');
// 勝利連線元素
const lineEl = document.getElementById('win-line');

const scoreXEl = document.getElementById('score-x');
const scoreOEl = document.getElementById('score-o');
const scoreDrawEl = document.getElementById('score-draw');

// 遊戲狀態變數
let board, current, active;
let scoreX = 0;
let scoreO = 0;
let scoreDraw = 0;

// 符號對照表
const SYMBOLS = {
    'X': '⭐', // 海星
    'O': '🐚'  // 貝殼
};

// 勝利條件 (注意順序與 CSS class 對應)
const WIN_LINES = [
    [0,1,2], [3,4,5], [6,7,8], // 橫排 0-2
    [0,3,6], [1,4,7], [2,5,8], // 直排 3-5
    [0,4,8], [2,4,6]           // 斜線 6-7
];

// --- 函式定義 ---

function init() {
    board = Array(9).fill('');
    current = 'X';
    active = true;
    
    cells.forEach(c => {
        c.textContent = '';
        c.className = 'cell';
        c.disabled = false;
        c.style.transform = '';
    });

    // 重置並隱藏連線
    lineEl.className = 'win-line';

    turnEl.textContent = SYMBOLS[current];
    stateEl.textContent = '';
}

function place(idx) {
    if (!active || board[idx]) return;
    
    board[idx] = current;
    const cell = cells[idx];
    
    // 顯示 Emoji
    cell.textContent = SYMBOLS[current];
    cell.classList.add(current.toLowerCase());
    
    const result = evaluate();
    
    if (result.finished) {
        endGame(result);
    } else {
        switchTurn();
    }
}

function switchTurn() {
    current = current === 'X' ? 'O' : 'X';
    turnEl.textContent = SYMBOLS[current];
}

function evaluate() {
    for (let i = 0; i < WIN_LINES.length; i++) {
        const line = WIN_LINES[i];
        const [a, b, c] = line;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            // 回傳 index 以便畫線
            return { finished: true, winner: board[a], line: line, index: i };
        }
    }
    if (board.every(v => v)) {
        return { finished: true, winner: null };
    }
    return { finished: false };
}

function endGame({ winner, line, index }) {
    active = false;
    if (winner) {
        stateEl.textContent = `${SYMBOLS[winner]} 勝利!`;
        line.forEach(i => cells[i].classList.add('win'));
        
        // 畫出勝利線條
        lineEl.classList.add('show', `line-${index}`);

        if (winner === 'X') scoreX++; else scoreO++;
    } else {
        stateEl.textContent = '平手';
        scoreDraw++;
    }
    updateScoreboard();
    cells.forEach(c => c.disabled = true);
}

function updateScoreboard() {
    scoreXEl.textContent = scoreX;
    scoreOEl.textContent = scoreO;
    scoreDrawEl.textContent = scoreDraw;
}

// --- 事件綁定 ---
cells.forEach(cell => {
    cell.addEventListener('click', () => {
        const idx = +cell.getAttribute('data-idx');
        place(idx);
    });
});

btnReset.addEventListener('click', init);

btnResetAll.addEventListener('click', () => {
    scoreX = scoreO = scoreDraw = 0;
    updateScoreboard();
    init();
});

// 啟動遊戲
init();
