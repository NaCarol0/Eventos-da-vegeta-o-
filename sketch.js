let gotas = [];
let solo;
let tipoSolo = "vegetacao"; // valor inicial
let arvores = [];
let lagoa;
let predios = []; // Array para armazenar os prédios
let carros = [];  // Array para armazenar os carros

function setup() {
  let canvas = createCanvas(600, 400);
  canvas.parent("canvas-holder");
  solo = new Solo(tipoSolo);
  // Adiciona uma floresta densa e a lagoa inicialmente se o solo for de vegetação
  if (tipoSolo === "vegetacao") {
    criarFloresta();
    lagoa = new Lagoa(width * 0.7, solo.altura - 15, 80, 30); // Posição e dimensões da lagoa
  }
}

function draw() {
  background(200, 220, 255); // céu

  // Desenha o sol no canto superior direito
  fill(255, 200, 0); // Amarelo alaranjado
  noStroke();
  ellipse(width - 50, 50, 80, 80); // Posição e tamanho do sol

  for (let i = gotas.length - 1; i >= 0; i--) {
    gotas[i].cair();
    gotas[i].mostrar();

    if (gotas[i].atingeSolo(solo.altura)) {
      solo.aumentarErosao();
      gotas.splice(i, 1);
    }
  }

  solo.mostrar();

  // Mostra a lagoa apenas se o solo for de vegetação
  if (tipoSolo === "vegetacao" && lagoa) {
    lagoa.mostrar();
  }

  // Mostra as árvores
  for (let arvore of arvores) {
    arvore.mostrar();
  }

  // Mostra as plantas no solo exposto
  if (tipoSolo === "exposto") {
    for (let planta of solo.plantas) {
      planta.mostrar();
    }
  }

  // Mostra prédios e carros se o solo for urbanizado
  if (tipoSolo === "urbanizado") {
    for (let predio of predios) {
      predio.mostrar();
    }
    for (let carro of carros) {
      carro.mover();
      carro.mostrar();
    }
    // Adiciona novos carros periodicamente
    if (frameCount % 120 === 0) { // A cada 2 segundos (60 frames/seg)
      carros.push(new Carro(solo.altura + 10, random([-2, 2]))); // Carros na rua
    }
  }


  if (frameCount % 5 === 0) {
    gotas.push(new Gota());
  }
}

function setSoilType(tipo) {
  tipoSolo = tipo;
  solo = new Solo(tipoSolo);
  arvores = []; // Limpa as árvores ao mudar o tipo de solo
  lagoa = null; // Remove a lagoa ao mudar o tipo de solo
  predios = []; // Limpa os prédios
  carros = [];  // Limpa os carros

  // Adiciona elementos com base no novo tipo de solo
  if (tipoSolo === "vegetacao") {
    criarFloresta();
    lagoa = new Lagoa(width * 0.7, solo.altura - 15, 80, 30); // Recria a lagoa
  } else if (tipoSolo === "exposto") {
    criarPlantasExpostas(); // Adiciona plantas ao solo exposto
  } else if (tipoSolo === "urbanizado") {
    criarUrbanizacao(); // Adiciona prédios e carros
  }
}

function criarFloresta() {
  for (let i = 0; i < 50; i++) { // Aumentei ainda mais o número de árvores
    let x = random(width * 0.05, width * 0.95); // Espalha as árvores um pouco mais
    // Passa a altura do solo para a árvore para que ela se posicione corretamente
    arvores.push(new Arvore(x, solo.altura));
  }
}

function criarPlantasExpostas() {
  // Adiciona algumas plantas menores ao solo exposto
  for (let i = 0; i < 30; i++) { // Número de plantas
    let x = random(width * 0.05, width * 0.95);
    // Passa a altura do solo para a planta para que ela se posicione corretamente
    solo.plantas.push(new Planta(x, solo.altura));
  }
}

function criarUrbanizacao() {
  // Cria alguns prédios
  let currentX = 50;
  while (currentX < width - 50) {
    let larguraPredio = random(40, 80);
    let alturaPredio = random(80, 180);
    predios.push(new Predio(currentX, solo.altura - alturaPredio, larguraPredio, alturaPredio));
    currentX += larguraPredio + random(20, 50); // Espaçamento entre prédios
  }

  // Adiciona alguns carros iniciais
  for (let i = 0; i < 3; i++) {
    carros.push(new Carro(solo.altura + 10, random([-2, 2]))); // Carros na rua
  }
}

class Gota {
  constructor() {
    this.x = random(width);
    this.y = 0;
    this.vel = random(4, 6);
  }

  cair() {
    this.y += this.vel;
  }

  mostrar() {
    stroke(0, 0, 200);
    line(this.x, this.y, this.x, this.y + 10);
  }

  atingeSolo(ySolo) {
    return this.y > ySolo;
  }
}

class Solo {
  constructor(tipo) {
    this.tipo = tipo;
    this.altura = height - 80;
    this.erosao = 0;
    this.plantas = []; // Inicializa o array de plantas
  }

  aumentarErosao() {
    let taxa;
    if (this.tipo === "vegetacao") taxa = 0.01; // Reduzi ainda mais a erosão com mais árvores
    else if (this.tipo === "exposto") taxa = 0.12; // Ajustei a taxa para exposto com algumas plantas (ligeiramente menor)
    else if (this.tipo === "urbanizado") taxa = 0.05; // Erosão para solo urbanizado (impermeável, mas ainda tem escoamento)

    this.erosao += taxa;
    this.altura += taxa; // Aumenta a altura do solo (simulando acúmulo de detritos ou inchaço)
  }

  mostrar() {
    noStroke();
    if (this.tipo === "vegetacao") {
      fill(60, 150, 60); // Verde para vegetação
    } else if (this.tipo === "exposto") {
      fill(139, 69, 19); // Marrom para solo exposto
    } else if (this.tipo === "urbanizado") {
      fill(80); // Cinza escuro para a rua/solo urbanizado
      rect(0, this.altura, width, height - this.altura); // Desenha a rua
      // Desenha as linhas da estrada
      stroke(255, 255, 0); // Amarelo
      strokeWeight(3);
      for (let i = 0; i < width; i += 40) {
        line(i, this.altura + 20, i + 20, this.altura + 20);
      }
      noStroke();
    }

    rect(0, this.altura, width, height - this.altura);

    fill(0);
    textSize(14);
    textAlign(LEFT);
    text(`Erosão: ${this.erosao.toFixed(1)}`, 10, 20);
    text(`Tipo de solo: ${this.tipo}`, 10, 40);
  }
}

class Arvore {
  constructor(x, soloAltura) {
    this.x = x;
    this.soloAltura = soloAltura; // Altura do solo onde a árvore está plantada
    this.larguraTronco = random(5, 12); // Varia a largura do tronco
    this.alturaTronco = random(20, 50); // Varia a altura do tronco
    this.raioCopa = random(15, 30); // Varia o tamanho da copa
    this.corTronco = color(101, 67, 33); // Marrom mais realista
    this.corCopa = color(34, random(100, 150), 34); // Varia um pouco a cor da copa
  }

  mostrar() {
    // Tronco: a base do tronco deve estar na altura do solo
    fill(this.corTronco);
    rectMode(CENTER);
    rect(this.x, this.soloAltura - this.alturaTronco / 2, this.larguraTronco, this.alturaTronco);

    // Copa: posicionada acima do tronco
    fill(this.corCopa);
    ellipse(this.x, this.soloAltura - this.alturaTronco - this.raioCopa, this.raioCopa * 2, this.raioCopa * 2);
    rectMode(CORNER); // Reset rectMode
  }
}

class Planta {
  constructor(x, soloAltura) {
    this.x = x;
    this.soloAltura = soloAltura; // Altura do solo onde a planta está
    this.altura = random(8, 18); // Altura da planta
    this.largura = random(4, 8); // Largura da planta
    this.cor = color(random(50, 100), random(150, 200), random(50, 100)); // Tons de verde
  }

  mostrar() {
    noStroke();
    fill(this.cor);
    // Desenha uma forma simples de planta (elipse) com a base no solo
    ellipse(this.x, this.soloAltura - this.altura / 2, this.largura, this.altura);
    // Opcional: Adicionar um pequeno caule que parte da base da elipse
    fill(100, 70, 40);
    rect(this.x - 1, this.soloAltura - this.altura / 2 + this.altura / 2, 2, this.altura / 3);
  }
}

class Lagoa {
  constructor(x, y, largura, altura) {
    this.x = x;
    this.y = y;
    this.largura = largura;
    this.altura = altura;
    this.cor = color(0, 100, 200, 200); // Azul transparente
  }

  mostrar() {
    fill(this.cor);
    ellipse(this.x, this.y, this.largura, this.altura);
  }
}

class Predio {
  constructor(x, y, largura, altura) {
    this.x = x;
    this.y = y;
    this.largura = largura;
    this.altura = altura;
    this.corPrincipal = color(random(100, 180)); // Tons de cinza para o prédio
    this.corJanela = color(100, 150, 200, 200); // Azul claro transparente para janelas
    this.numAndares = floor(altura / 30); // Número de andares baseado na altura
  }

  mostrar() {
    // Corpo do prédio
    fill(this.corPrincipal);
    rect(this.x, this.y, this.largura, this.altura);

    // Janelas
    let margemJanela = 5;
    let larguraJanela = (this.largura - margemJanela * 3) / 2; // Duas colunas de janelas
    let alturaJanela = 15;
    fill(this.corJanela);

    for (let i = 0; i < this.numAndares; i++) {
      let yJanela = this.y + margemJanela + i * (alturaJanela + margemJanela);
      if (yJanela + alturaJanela < this.y + this.altura - margemJanela) { // Garante que a janela não saia do prédio
        rect(this.x + margemJanela, yJanela, larguraJanela, alturaJanela);
        rect(this.x + this.largura - margemJanela - larguraJanela, yJanela, larguraJanela, alturaJanela);
      }
    }
  }
}

class Carro {
  constructor(y, velocidade) {
    this.y = y;
    this.largura = random(30, 50);
    this.altura = random(10, 15);
    this.velocidade = velocidade; // Pode ser positivo (direita) ou negativo (esquerda)
    this.cor = color(random(255), random(255), random(255)); // Cor aleatória para o carro

    // Define a posição inicial com base na direção
    if (this.velocidade > 0) {
      this.x = -this.largura; // Começa da esquerda, fora da tela
    } else {
      this.x = width + this.largura; // Começa da direita, fora da tela
    }
  }

  mover() {
    this.x += this.velocidade;

    // Reinicia o carro se ele sair da tela
    if (this.velocidade > 0 && this.x > width + this.largura) {
      this.x = -this.largura;
      this.cor = color(random(255), random(255), random(255)); // Nova cor
    } else if (this.velocidade < 0 && this.x < -this.largura) {
      this.x = width + this.largura;
      this.cor = color(random(255), random(255), random(255)); // Nova cor
    }
  }

  mostrar() {
    // Corpo do carro
    fill(this.cor);
    rect(this.x, this.y, this.largura, this.altura);

    // Rodas
    fill(50); // Cor das rodas
    let raioRoda = 5;
    ellipse(this.x + raioRoda, this.y + this.altura, raioRoda * 2, raioRoda * 2);
    ellipse(this.x + this.largura - raioRoda, this.y + this.altura, raioRoda * 2, raioRoda * 2);
  }
}

