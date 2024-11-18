const containerJogo = document.getElementById("container-jogo");
const pontuacaoDisplay = document.getElementById("pontuacao");
const iniciarBotao = document.getElementById("iniciar");
const reiniciarBotao = document.getElementById("reiniciar");
const tamanhoGrade = 20;
let cobra = [{ x: 10, y: 10 }];
let direcao = { x: 0, y: 1 };
let comida = getPosicaoAleatoriaComida();
let corComida = getCorAleatoria();
let pontuacao = 0;
let intervaloJogo;

const somComida = new Audio('./sounds/comida.wav');
const somBotao = new Audio('./sounds/botao.mp3');
const somMorte = new Audio('./sounds/morte.wav');

for (let i = 0; i < tamanhoGrade * tamanhoGrade; i++) {
  const celula = document.createElement("div");
  celula.classList.add("celula");
  containerJogo.appendChild(celula);
}

const celulas = Array.from(document.querySelectorAll(".celula"));

function renderizar() {
  celulas.forEach(celula => celula.classList.remove("cobra", "comida", ...getTodasCoresComida()));
  cobra.forEach(segmento => {
    const index = segmento.y * tamanhoGrade + segmento.x;
    celulas[index].classList.add("cobra");
  });
  const indexComida = comida.y * tamanhoGrade + comida.x;
  celulas[indexComida].classList.add("comida", corComida);
}

function getPosicaoAleatoriaComida() {
  let novaPosicao;
  do {
    novaPosicao = {
      x: Math.floor(Math.random() * tamanhoGrade),
      y: Math.floor(Math.random() * tamanhoGrade)
    };
  } while (cobra.some(segmento => segmento.x === novaPosicao.x && segmento.y === novaPosicao.y));
  return novaPosicao;
}

function getCorAleatoria() {
  const cores = ["comida-vermelha", "comida-verde", "comida-roxa", "comida-amarela"];
  return cores[Math.floor(Math.random() * cores.length)];
}

function getTodasCoresComida() {
  return ["comida-vermelha", "comida-verde", "comida-roxa", "comida-amarela"];
}

function moverCobra() {
  const cabeca = { ...cobra[0] };
  cabeca.x += direcao.x;
  cabeca.y += direcao.y;
  cobra.unshift(cabeca);
  if (cabeca.x === comida.x && cabeca.y === comida.y) {
    pontuacao++;
    pontuacaoDisplay.innerText = pontuacao;
    comida = getPosicaoAleatoriaComida();
    corComida = getCorAleatoria();
    somComida.play();
  } else {
    cobra.pop();
  }
}

function tocarSomBotao() {
  somBotao.currentTime = 0;
  somBotao.play();
}

// Verificar colisões
function verificarColisoes() {
  const cabeca = cobra[0];
  if (
    cabeca.x < 0 ||
    cabeca.x >= tamanhoGrade ||
    cabeca.y < 0 ||
    cabeca.y >= tamanhoGrade ||
    cobra.slice(1).some(segmento => segmento.x === cabeca.x && segmento.y === cabeca.y)
  ) {
    fimDeJogo();
  }
}

function fimDeJogo() {
  somMorte.play();
  clearInterval(intervaloJogo);
  iniciarBotao.style.display = "none";
  reiniciarBotao.style.display = "block";
}

function iniciarJogo() {
  iniciarBotao.style.display = "none";
  reiniciarBotao.style.display = "none";
  cobra = [{ x: 10, y: 10 }];
  direcao = { x: 0, y: 1 };
  comida = getPosicaoAleatoriaComida();
  corComida = getCorAleatoria();
  pontuacao = 0;
  pontuacaoDisplay.innerText = pontuacao;
  renderizar();
  intervaloJogo = setInterval(() => {
    moverCobra();
    verificarColisoes();
    renderizar();
  }, 200);
}

function reiniciarJogo() {
  clearInterval(intervaloJogo);
  iniciarJogo();
}

document.addEventListener("keydown", evento => {
  switch (evento.key) {
    case "ArrowUp":
      if (direcao.y === 0) direcao = { x: 0, y: -1 };
      tocarSomBotao();
      break;
    case "ArrowDown":
      if (direcao.y === 0) direcao = { x: 0, y: 1 };
      tocarSomBotao();
      break;
    case "ArrowLeft":
      if (direcao.x === 0) direcao = { x: -1, y: 0 };
      tocarSomBotao();
      break;
    case "ArrowRight":
      if (direcao.x === 0) direcao = { x: 1, y: 0 };
      tocarSomBotao();
      break;
  }
});

document.getElementById("cima").addEventListener("click", () => {
  if (direcao.y === 0) direcao = { x: 0, y: -1 };
  tocarSomBotao();
});
document.getElementById("baixo").addEventListener("click", () => {
  if (direcao.y === 0) direcao = { x: 0, y: 1 };
  tocarSomBotao();
});
document.getElementById("esquerda").addEventListener("click", () => {
  if (direcao.x === 0) direcao = { x: -1, y: 0 };
  tocarSomBotao();
});
document.getElementById("direita").addEventListener("click", () => {
  if (direcao.x === 0) direcao = { x: 1, y: 0 };
  tocarSomBotao();
});

iniciarBotao.addEventListener("click", iniciarJogo);
reiniciarBotao.addEventListener("click", reiniciarJogo);
