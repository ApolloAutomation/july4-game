const IMAGES = [
  'images/A Mark Blue-Green.png',
  'images/A Mark Blue-Orange.png',
  'images/A Mark Blue-Red.png',
  'images/A Mark Greyscale.png',
  'images/A Mark Navy-Green.png',
  'images/A Mark White.png'
];
const NUM_HOLES = 9, TAPS_TO_WIN = 5, DISPLAY_TIME = 1100;

let taps = 0, currentTimeout = null;

const intro = document.getElementById('intro');
const game = document.getElementById('game');
const result = document.getElementById('result');
const board = document.getElementById('game-board');
const tapsCount = document.getElementById('taps-count');
const pipsWrap = document.getElementById('pips');
const startBtn = document.getElementById('start');
const holes = [];

// fireworks background (optional — guard so the game still works if the CDN is blocked)
let fireworks = null;
if (typeof Fireworks !== 'undefined') {
  fireworks = new Fireworks(document.body, {
    speed: 3, acceleration: 1.05, friction: 0.97, gravity: 1.5,
    particles: 50, trace: 3, autoresize: true,
    hue: { min: 0, max: 360 }, delay: { min: 12, max: 36 },
    rocketsPoint: { min: 0, max: 100 }
  });
  fireworks.start();
}

// build board + progress pips
for (let i = 0; i < NUM_HOLES; i++) {
  const hole = document.createElement('div');
  hole.className = 'hole';
  board.appendChild(hole);
  holes.push(hole);
}
for (let i = 0; i < TAPS_TO_WIN; i++) {
  const pip = document.createElement('span');
  pip.className = 'pip';
  pipsWrap.appendChild(pip);
}
const pips = Array.from(pipsWrap.children);

function updateProgress() {
  tapsCount.textContent = `${taps} / ${TAPS_TO_WIN}`;
  pips.forEach((pip, i) => pip.classList.toggle('on', i < taps));
}

function showMole() {
  holes.forEach(h => h.innerHTML = '');
  const hole = holes[Math.floor(Math.random() * NUM_HOLES)];
  const img = document.createElement('img');
  img.src = IMAGES[Math.floor(Math.random() * IMAGES.length)];
  img.className = 'mole';
  img.alt = 'Apollo mark';
  hole.appendChild(img);

  img.addEventListener('click', () => {
    if (fireworks) {
      const r = img.getBoundingClientRect();
      fireworks.fire({ x: r.left + r.width / 2, y: r.top + r.height / 2, particles: 24, trace: 2 });
    }
    taps++;
    updateProgress();
    hole.innerHTML = '<div class="celebration">🎆</div>';
    if (taps >= TAPS_TO_WIN) { endGame(); return; }
  });

  currentTimeout = setTimeout(showMole, DISPLAY_TIME);
}

function startGame() {
  intro.classList.add('hidden');
  game.classList.remove('hidden');
  updateProgress();
  showMole();
}

function endGame() {
  clearTimeout(currentTimeout);
  game.classList.add('hidden');
  result.classList.remove('hidden');
  result.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

startBtn.addEventListener('click', startGame);
