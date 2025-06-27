const itemSets = [
    [ {icon:'🥤',type:'recycle'}, {icon:'📰',type:'recycle'}, {icon:'🍌',type:'compost'}, {icon:'🍎',type:'compost'}, {icon:'🚬',type:'trash'}, {icon:'🧻',type:'trash'} ],
    [ {icon:'📦',type:'recycle'}, {icon:'🧃',type:'recycle'}, {icon:'🥕',type:'compost'}, {icon:'🍗',type:'compost'}, {icon:'🧷',type:'trash'}, {icon:'💊',type:'trash'} ],
    [ {icon:'🥛',type:'recycle'}, {icon:'🧴',type:'recycle'}, {icon:'🥥',type:'compost'}, {icon:'🍞',type:'compost'}, {icon:'🗿',type:'trash'}, {icon:'🧢',type:'trash'} ],
    [ {icon:'📱',type:'recycle'}, {icon:'🍉',type:'compost'}, {icon:'🥓',type:'compost'}, {icon:'⚰️',type:'trash'}, {icon:'🎧',type:'trash'}, {icon:'📌',type:'trash'} ]
  ];
  
  let score = 0, wrong = 0, level = 0, time = 60, timer;
  const MAX_WRONG = 3;
  
  const startScreen = document.getElementById('startScreen');
  const gameScreen = document.getElementById('gameScreen');
  const gameOverScreen = document.getElementById('gameOverScreen');
  
  const scoreSpan = document.getElementById('score');
  const wrongSpan = document.getElementById('wrong');
  const timeSpan = document.getElementById('time');
  const levelDisp = document.getElementById('levelDisp');
  const finalScore = document.getElementById('finalScore');
  const bestScore = document.getElementById('bestScore');
  const gameOverTitle = document.getElementById('gameOverTitle');
  
  const bgm = document.getElementById('bgm');
  const correctSound = document.getElementById('correctSound');
  const wrongSound = document.getElementById('wrongSound');
  const gameOverSound = document.getElementById('gameOverSound');
  
  document.getElementById('startBtn').onclick = startGame;
  document.getElementById('restartBtn').onclick = () => location.reload();
  
  function allowDrop(ev) { ev.preventDefault(); }
  function drag(ev) { ev.dataTransfer.setData('text', ev.target.id); }
  
  function drop(ev) {
    ev.preventDefault();
    const itm = document.getElementById(ev.dataTransfer.getData('text'));
    const expect = itm.dataset.type;
    if (ev.currentTarget.classList.contains(expect)) {
      score++; correctSound.play(); itm.remove();
    } else {
      wrong++; wrongSound.play(); itm.style.background = 'red';
      setTimeout(() => itm.style.background = 'white', 300);
    }
    updateStatus();
    checkProgress();
  }
  
  function updateStatus() {
    scoreSpan.textContent = score;
    wrongSpan.textContent = wrong;
    levelDisp.textContent = level + 1;
  
    const progress = document.getElementById('progress');
    const levelMax = 5;
    const widthPercent = Math.min((level + 1) / levelMax * 100, 100);
    progress.style.width = widthPercent + '%';
  }
  
  function startTimer() {
    time = 60;
    timeSpan.textContent = time;
    clearInterval(timer);
    timer = setInterval(() => {
      time--;
      timeSpan.textContent = time;
      if (time <= 0) gameOver("⏰ 시간 종료!");
    }, 1000);
  }
  
  function loadLevel() {
    const itemsDiv = document.getElementById('items');
    itemsDiv.innerHTML = '';
    let items = itemSets[level] || itemSets[itemSets.length - 1];
    const repeat = level + 1;
    let pool = [];
    for (let i = 0; i < repeat; i++) pool = pool.concat(items);
    pool.sort(() => Math.random() - 0.5).forEach((it, i) => {
      const d = document.createElement('div');
      d.id = `it${level}_${i}`; d.className = 'item';
      d.textContent = it.icon; d.dataset.type = it.type;
      d.draggable = true; d.addEventListener('dragstart', drag);
      itemsDiv.appendChild(d);
    });
  }
  
  function checkProgress() {
    if (wrong > MAX_WRONG) return gameOver("💥 오답 초과!");
    if (document.getElementById('items').children.length === 0) {
      level++;
      loadLevel();
    }
  }
  
  function startGame() {
    startScreen.classList.remove('active');
    gameScreen.classList.add('active');
    score = wrong = level = 0;
    updateStatus();
    loadLevel();
    startTimer();
    bgm.play();
  }
  
  // 기존 코드와 동일 — 시각 관련 메시지만 강조
function gameOver(msg) {
    clearInterval(timer);
    bgm.pause();
    bgm.currentTime = 0;
    gameOverSound.play();
    gameScreen.classList.remove('active');
    gameOverScreen.classList.add('active');
  
    finalScore.textContent = score;
    const best = Math.max(score, localStorage.getItem('bestScore') || 0);
    localStorage.setItem('bestScore', best);
    bestScore.textContent = best;
  
    gameOverTitle.textContent = msg;
  }
  
  