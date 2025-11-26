// Configuration
const CONFIG = {
  adminPassword: 'azerty',
  songs: [
    'Nirvana – Smells Like Teen Spirit',
    'Britney Spears – ...Baby One More Time',
    'Spice Girls – Wannabe',
    'AC/DC – Thunderstruck',
    'Coolio – Gangsta\'s Paradise',
    'Gala – Freed from Desire',
    'Oasis – Wonderwall',
    'Eiffel 65 – Blue (Da Ba Dee)',
    'Dr. Dre ft. Snoop Dogg – Still D.R.E.',
    'Blur – Song 2 ("Woo-hoo!")',
    'Lou Bega – Mambo No. 5',
    'Céline Dion – Pour que tu m\'aimes encore',
    'Red Hot Chili Peppers – Under the Bridge',
    'Aqua – Barbie Girl',
    'Manau – La Tribu de Dana',
    'MC Hammer – U Can\'t Touch This',
    'R.E.M. – Losing My Religion',
    'Haddaway – What Is Love',
    'The Verve – Bitter Sweet Symphony',
    'IAM – Je danse le Mia',
    'Ricky Martin – Livin\' la Vida Loca',
    'Whitney Houston – I Will Always Love You',
    'Rednex – Cotton Eye Joe',
    'Michael Jackson – Black or White',
    'Daft Punk – Around the World',
    'The Offspring – Pretty Fly (For a White Guy) ("Gunter glieben glauchen globen")',
    'Backstreet Boys – Everybody (Backstreet\'s Back)',
    'The Cranberries – Zombie',
    'Will Smith – Men in Black',
    'Scorpions – Wind of Change (Le sifflement légendaire)',
    'Zebda – Tomber la chemise',
    'Ace of Base – All That She Wants',
    'Metallica – Enter Sandman',
    'Corona – The Rhythm of the Night',
    'No Doubt – Don\'t Speak',
    'Louise Attaque – J\'t\'emmène au vent (L\'intro violon)',
    'Shania Twain – Man! I Feel Like a Woman! ("Let\'s go girls!")',
    'House of Pain – Jump Around (Le bruit de sirène au début)',
    'Khaled – Aïcha',
    'Fool\'s Garden – Lemon Tree'
  ]
};

// État global
let gameState = {
  currentPage: 'home',
  playerName: '',
  currentGrid: [],
  checkedCells: [],
  hasBingo: false,
  songStates: {}
};

// Initialiser songStates
CONFIG.songs.forEach((song, index) => {
  gameState.songStates[index] = false;
});

// Fonction pour générer une grille aléatoire
function generateGrid() {
  const numbers = [];
  while (numbers.length < 25) {
    const num = Math.floor(Math.random() * 40) + 1;
    if (!numbers.includes(num)) {
      numbers.push(num);
    }
  }
  return numbers;
}

// Fonction pour rendre la page d'accueil
function renderHome() {
  const app = document.getElementById('app');
  app.innerHTML = `
    <div class="home-page">
      <div class="home-content">
        <h1 class="home-title">🎉 BINGO 🎆</h1>
        <p class="home-subtitle">Nouvel An 2026</p>
        <div class="form-group">
          <label class="form-label">Entrez votre nom :</label>
          <input type="text" id="playerNameInput" class="form-input" placeholder="Votre nom..." autofocus>
        </div>
        <button class="btn" onclick="startGame()">Commencer à jouer</button>
      </div>
      <button class="admin-button" onclick="goToAdminLogin()" title="Admin">⚙️</button>
    </div>
  `;

  document.getElementById('playerNameInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') startGame();
  });
}

// Fonction pour démarrer le jeu
function startGame() {
  const nameInput = document.getElementById('playerNameInput');
  const name = nameInput.value.trim();

  if (!name) {
    alert('Veuillez entrer votre nom');
    return;
  }

  gameState.playerName = name;
  gameState.currentGrid = generateGrid();
  gameState.checkedCells = Array(25).fill(false);
  gameState.hasBingo = false;
  gameState.currentPage = 'game';

  renderGame();
}

// Fonction pour rendre la page de jeu
function renderGame() {
  const app = document.getElementById('app');
  const checkedCount = gameState.checkedCells.filter(c => c).length;

  let gridHTML = '';
  gameState.currentGrid.forEach((num, index) => {
    const isChecked = gameState.checkedCells[index];
    gridHTML += `<button class="bingo-cell ${isChecked ? 'checked' : ''}" onclick="toggleCell(${index})">${num}</button>`;
  });

  app.innerHTML = `
    <div class="game-page">
      <div class="game-header">
        <h1 class="game-title">🎉 BINGO 🎆</h1>
        <p class="game-player">Grille de ${gameState.playerName}</p>
      </div>
      <div class="counter">Cases cochées : ${checkedCount}/25</div>
      <div class="game-grid">${gridHTML}</div>
      <div class="game-buttons">
        <button class="btn btn-secondary" onclick="resetGrid()">Réinitialiser</button>
        <button class="btn btn-secondary" onclick="newGrid()">Nouvelle grille</button>
        <button class="btn btn-secondary" onclick="goHome()">Retour</button>
      </div>
    </div>
  `;
}

// Fonction pour cocher/décocher une case
function toggleCell(index) {
  gameState.checkedCells[index] = !gameState.checkedCells[index];

  checkWinConditions();
  renderGame();
}

// Vérifier les conditions de victoire
function checkWinConditions() {
  const checked = gameState.checkedCells;

  // Vérifier si grille complète (victoire finale)
  if (checked.every(c => c)) {
    showVictoryPopup();
    return;
  }

  // Vérifier les lignes, colonnes, diagonales (premier bingo)
  if (!gameState.hasBingo) {
    if (checkBingo()) {
      gameState.hasBingo = true;
      playBingoSound();
      showBingoToast();
    }
  }
}

function checkBingo() {
  const checked = gameState.checkedCells;

  // Vérifier les lignes
  for (let i = 0; i < 5; i++) {
    if (checked[i*5] && checked[i*5+1] && checked[i*5+2] && checked[i*5+3] && checked[i*5+4]) {
      return true;
    }
  }

  // Vérifier les colonnes
  for (let i = 0; i < 5; i++) {
    if (checked[i] && checked[i+5] && checked[i+10] && checked[i+15] && checked[i+20]) {
      return true;
    }
  }

  // Vérifier les diagonales
  if (checked[0] && checked[6] && checked[12] && checked[18] && checked[24]) return true;
  if (checked[4] && checked[8] && checked[12] && checked[16] && checked[20]) return true;

  return false;
}

function showBingoToast() {
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = '🎉 BINGO! 🎉 ' + gameState.playerName;
  document.body.appendChild(toast);

  setTimeout(() => toast.remove(), 3000);
}

function showVictoryPopup() {
  const overlay = document.createElement('div');
  overlay.className = 'popup-overlay';
  overlay.innerHTML = `
    <div class="popup-content">
      <h2 class="popup-title">🏆 ${gameState.playerName} A GAGNÉ! 🏆</h2>
      <p class="popup-text">Grille complète!</p>
      <div class="popup-buttons">
        <button class="btn" onclick="newGrid()">🎉 Nouvelle grille</button>
        <button class="btn btn-secondary" onclick="goHome()">🏠 Retour</button>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);

  playVictorySound();
  createConfetti();
}

function resetGrid() {
  gameState.checkedCells = Array(25).fill(false);
  renderGame();
}

function newGrid() {
  gameState.currentGrid = generateGrid();
  gameState.checkedCells = Array(25).fill(false);
  gameState.hasBingo = false;
  renderGame();
}

function goHome() {
  gameState.currentPage = 'home';
  gameState.playerName = '';
  gameState.currentGrid = [];
  gameState.checkedCells = [];
  gameState.hasBingo = false;
  renderHome();
}

// ADMIN SECTION
function goToAdminLogin() {
  const app = document.getElementById('app');
  app.innerHTML = `
    <div class="admin-page">
      <div class="admin-container">
        <h1 class="admin-title">Admin</h1>
        <div class="admin-login">
          <div class="form-group">
            <label class="form-label">Mot de passe :</label>
            <input type="password" id="adminPassword" class="form-input" placeholder="Mot de passe..." autofocus>
          </div>
          <button class="btn" onclick="checkAdminPassword()">Connexion</button>
          <button class="btn btn-secondary" style="margin-top: 10px;" onclick="goHome()">Retour</button>
        </div>
      </div>
    </div>
  `;

  document.getElementById('adminPassword').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') checkAdminPassword();
  });
}

function checkAdminPassword() {
  const password = document.getElementById('adminPassword').value;

  if (password === CONFIG.adminPassword) {
    showAdminPage();
  } else {
    alert('Mot de passe incorrect');
  }
}

function showAdminPage() {
  const app = document.getElementById('app');

  let songsHTML = '';
  CONFIG.songs.forEach((song, index) => {
    const isChecked = gameState.songStates[index];
    songsHTML += `
      <div class="song-item">
        <input type="checkbox" id="song_${index}" ${isChecked ? 'checked' : ''} onchange="toggleSong(${index})">
        <label for="song_${index}">${index + 1}. ${song}</label>
      </div>
    `;
  });

  app.innerHTML = `
    <div class="admin-page">
      <div class="admin-container">
        <h1 class="admin-title">Liste des chansons</h1>
        <div class="songs-list">${songsHTML}</div>
        <div class="admin-buttons">
          <button class="btn" onclick="resetAllSongs()">Réinitialiser</button>
          <button class="btn btn-secondary" onclick="goHome()">Retour au jeu</button>
        </div>
      </div>
    </div>
  `;
}

function toggleSong(index) {
  gameState.songStates[index] = !gameState.songStates[index];
}

function resetAllSongs() {
  CONFIG.songs.forEach((_, index) => {
    gameState.songStates[index] = false;
  });
  showAdminPage();
}

// AUDIO & EFFECTS
function playBingoSound() {
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const now = audioContext.currentTime;

  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  oscillator.frequency.setValueAtTime(587.33, now);
  oscillator.frequency.setValueAtTime(880, now + 0.1);
  oscillator.frequency.setValueAtTime(1174.66, now + 0.2);

  gainNode.gain.setValueAtTime(0.3, now);
  gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.5);

  oscillator.start(now);
  oscillator.stop(now + 0.5);
}

function playVictorySound() {
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const now = audioContext.currentTime;

  for (let i = 0; i < 4; i++) {
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();

    osc.connect(gain);
    gain.connect(audioContext.destination);

    osc.frequency.value = 523.25 + (i * 261.63);
    gain.gain.setValueAtTime(0.3, now + i * 0.15);
    gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.15 + 0.3);

    osc.start(now + i * 0.15);
    osc.stop(now + i * 0.15 + 0.3);
  }
}

function createConfetti() {
  for (let i = 0; i < 50; i++) {
    const confetti = document.createElement('div');
    confetti.className = 'confetti';
    confetti.style.left = Math.random() * window.innerWidth + 'px';
    confetti.style.backgroundColor = ['#FFD700', '#FF6B6B', '#4169E1'][Math.floor(Math.random() * 3)];
    confetti.style.width = '10px';
    confetti.style.height = '10px';
    confetti.style.borderRadius = '50%';
    document.body.appendChild(confetti);

    const duration = 2 + Math.random() * 1;
    confetti.animate([
      { transform: 'translateY(0)', opacity: 1 },
      { transform: 'translateY(' + window.innerHeight + 'px)', opacity: 0 }
    ], {
      duration: duration * 1000,
      easing: 'ease-in'
    }).onfinish = () => confetti.remove();
  }
}

// Initialiser l'app
renderHome();
