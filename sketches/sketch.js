const { Responsive } = P5Template;
let video;
let handPose;
let hands = [];
let emitters = [];

const tileW = 10;
const tileH = 20;
let tileXNum, tileYNum;
let noiseMult = 0.05;

let circleH = 150;

let speed = 1;
let xs = [0, 100, 200, 300, 400, 500, 600];
let ys = [];
let rs = [];
let nC = 7;

let time = 0;
let timeDelta = 0.01;

let seed = 0;

function preload() {
  handPose = ml5.handPose();
}

function gotHands(results) {
  hands = results;
}

function updateTileNum() {
  tileXNum = width / tileW;
  tileXNum = floor(tileXNum);

  tileYNum = height / tileH;
  tileYNum = floor(tileYNum);
}

function drawTile() {
  noStroke();
  for (let idxY = 0; idxY < 1; idxY++) {
    for (let idxX = 0; idxX < tileXNum; idxX++) {
      let idx = idxY * tileXNum + idxX;
      let x = idxX * tileW - 5;
      let cx = x + tileW * 0.5;
      let y = idxY * tileH + height * 0.62;
      let cy = y + tileH * 7;
      let noiseNum = noise(noiseMult * idxX, noiseMult * idxY, time);
      push();
      translate(cx, cy);
      rotate(radians(-100 * noiseNum));
      stroke('#537D5D');
      strokeWeight(4);
      line(0, 0, tileH * 0.9, 0);
      pop();
    }
  }
}

function setup() {
  new Responsive().createResponsiveCanvas(640, 480, 'contain', true);
  video = createCapture(VIDEO);
  video.hide();

  handPose.detectStart(video, gotHands);

  for (let i = 0; i < 21 * 2; i++) {
    emitters.push(new Emitter(width / 2, height / 2));
  }

  for (let i = 0; i < nC; i++) {
    ys[i] = random(100, 200);
    rs[i] = random(100, 250);
  }

  updateTileNum();
}

function draw() {
  clear();
  image(video, 0, 0, width, height);
  blendMode(ADD);

  let counter = 0;
  for (let hand of hands) {
    for (let i = 0; i < hand.keypoints.length; i += 4) {
      let keypoint = hand.keypoints[i];
      if (counter < emitters.length) {
        let emitter = emitters[counter];
        emitter.position.x = keypoint.x;
        emitter.position.y = keypoint.y;
        emitter.emit(1);
        counter++;
      }
    }
  }

  blendMode(BLEND);
  background('#8DBCC799');
  fill('#9EBC8A');
  rect(0, height * 0.9, width, height);

  drawTile();
  time += timeDelta;

  noiseSeed(seed);

  for (let emitter of emitters) {
    emitter.show();
    emitter.update();
  }

  fill('#FFE31A');
  circle(450, circleH - 50, 100);

  for (let cnt = 0; cnt < 12; cnt++) {
    let angleDegrees = map(cnt, 0, 12, 0, 360);
    push();
    translate(450, circleH - 50);
    rotate(radians(angleDegrees));
    stroke('#F09319');
    strokeWeight(2);
    line(50, 0, 65, 0);
    pop();
  }

  noStroke();
  fill('#ffffff90');
  for (let i = 0; i < nC; i++) {
    circle(xs[i], ys[i], rs[i]);
    xs[i] += speed;
    if (xs[i] - rs[i] / 2 > width) {
      xs[i] = -rs[i] / 2;
    }
  }
}
