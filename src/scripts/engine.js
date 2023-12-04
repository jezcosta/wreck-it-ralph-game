const initialValues = {
  gameVelocity: 1000,
  hitPosition: 0,
  result: 0,
  currentTime: 60,
  lives: 3,
};

const state = {
  view: {
    squares: document.querySelectorAll(".square"),
    enemy: document.querySelector(".enemy"),
    timeLeft: document.querySelector("#time-left"),
    score: document.querySelector("#score"),
    lives: document.querySelector("#lives"),
    gameOver: document.querySelector("#game-over"),
    startGame: document.querySelector("#start-game"),
  },
  values: { ...initialValues },
  actions: {
    countDownTimerId: null,
  },
};

function countDown() {
  state.values.currentTime--;
  state.view.timeLeft.textContent = state.values.currentTime;

  if (state.values.currentTime <= 0) {
    gameOver();
  }
}

function playSound(audioName) {
  let audio = new Audio(`./src/audios/${audioName}.m4a`);
  audio.volume = 0.2;
  audio.play();
}

function randomSquare() {
  state.view.squares.forEach((square) => {
    square.classList.remove("enemy");
  });

  let randomNumber = Math.floor(Math.random() * 9);
  let _randomSquare = state.view.squares[randomNumber];
  _randomSquare.classList.add("enemy");
  state.values.hitPosition = _randomSquare.id;
  state.values.gameVelocity = state.values.gameVelocity - 8;

  if (state.values.currentTime > 0 && state.values.lives > 0) {
    setTimeout(() => {
      randomSquare();
    }, state.values.gameVelocity);
  }
}

function addListenerHitBox() {
  state.view.squares.forEach((square) => {
    square.addEventListener("mousedown", onSquareClick);
  });
}

function onSquareClick(ev) {
  if (ev.srcElement.id === state.values.hitPosition) {
    state.values.result++;
    state.view.score.textContent = state.values.result;
    state.values.hitPosition = null;
    playSound("hit");
  } else {
    state.values.lives--;
    if (state.values.lives === 0) {
      state.view.lives.textContent = "0";
      gameOver();
    } else {
      state.view.lives.textContent = state.values.lives;
    }
  }
}

function gameOver() {
  clearInterval(state.actions.countDownTimerId);
  clearInterval(state.actions.timerId);
  state.view.squares.forEach((square) => {
    square.removeEventListener("mousedown", onSquareClick);
  });
  state.view.gameOver.classList.remove("hidden");
}

function restart() {
  state.view.gameOver.classList.add("hidden");
  state.values = { ...initialValues };
  startGame();
}

function startGame() {
  state.actions = {
    countDownTimerId: setInterval(countDown, 1000),
  };
  state.view.startGame.classList.add("hidden");
  state.view.lives.textContent = state.values.lives;
  state.view.timeLeft.textContent = state.values.currentTime;
  state.view.score.textContent = state.values.result;
  addListenerHitBox();
  randomSquare();
}
