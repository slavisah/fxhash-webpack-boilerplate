/* eslint-disable no-undef */
import p5 from "p5";
import { createCols } from "./utils";
import {
  FXInit,
  FXRandomBool,
  FXRandomIntBetween,
  getWeightedOption,
} from "@liamegan1/fxhash-helpers";

// these are the variables you can use as inputs to your algorithms
console.log(fxhash); // the 64 chars hex number fed to your algorithm
console.log(fxrand()); // deterministic PRNG function, use it instead of Math.random()

// note about the fxrand() function
// when the "fxhash" is always the same, it will generate the same sequence of
// pseudo random numbers, always

FXInit(fxrand);
const seed = ~~(fxrand() * 123456789);
let s;
let m;

const palettes = [
  "https://coolors.co/eef4d4-daefb3-ea9e8d-d64550-1c2826",
  "https://coolors.co/91f9e5-76f7bf-5fdd9d-499167-3f4531",
];
const palette = getWeightedOption([
  [0, 90],
  [1, 10],
]);
const colors = createCols(palettes[palette]);
const backgroundColor = colors.pop();

const numCircles = FXRandomIntBetween(0, 500) + 100;
const shadow = FXRandomBool(0.9);

// ----------------------
// defining features
// ----------------------
// You can define some token features by populating the $fxhashFeatures property
// of the window object.
// More about it in the guide, section features:
// [https://fxhash.xyz/articles/guide-mint-generative-token#features]
//
// window.$fxhashFeatures = {
//   "Background": "Black",
//   "Number of lines": 10,
//   "Inverted": true
// }
window.$fxhashFeatures = {
  palette,
  shadow,
  density: numCircles > 500 ? "High" : numCircles < 200 ? "Low" : "Medium",
};
// eslint-disable-next-line no-console
console.table(window.$fxhashFeatures);

const sketch = (p5) => {
  p5.setup = () => {
    p5.noLoop();
    s = p5.min(p5.windowWidth, p5.windowHeight);
    p5.createCanvas(s, s);

    m = s / 1000;
  };

  p5.draw = () => {
    p5.randomSeed(seed);
    p5.noiseSeed(seed);

    p5.background(backgroundColor);

    p5.drawingContext.shadowOffsetX = 10;
    p5.drawingContext.shadowOffsetY = 10;
    p5.drawingContext.shadowBlur = 20;
    p5.drawingContext.shadowColor = "#00000099";

    p5.push();
    for (let i = numCircles; i >= 0; i--) {
      const c = p5.color(p5.random(colors));
      p5.fill(c);
      p5.noStroke();
      const width = p5.abs(p5.randomGaussian(0, m * 50));
      const height = p5.abs(p5.randomGaussian(0, m * 50));
      p5.rect(
        p5.random() * s,
        p5.random() * s,
        width,
        height,
        p5.abs(p5.randomGaussian(0, m * 50)),
        p5.abs(p5.randomGaussian(0, m * 50)),
        p5.abs(p5.randomGaussian(0, m * 50)),
        p5.abs(p5.randomGaussian(0, m * 50))
      );
    }
    p5.pop();

    // eslint-disable-next-line no-undef
    fxpreview();
  };

  p5.windowResized = function () {
    s = p5.min(p5.windowWidth, p5.windowHeight);
    p5.resizeCanvas(s, s);
    m = s / 1000;
  };
};

const myp5 = new p5(sketch, window.document.body);
