import space from "color-space";

// Constants
const SpaceRGB = "rgb",
    SpaceHSL = "hsl",
    SpaceHSV = "hsv",
    SpaceHWB = "hwb",
    SpaceCMY = "cmy",
    SpaceLAB = "lab",
    SpaceLCH = "lch",
    SpaceXYZ = "xyz";

const Ranges = {
    [SpaceRGB]: [
        [0, 255],
        [0, 255],
        [0, 255]
    ],

    [SpaceHSL]: [
        [0, 360],
        [0, 100],
        [0, 100]
    ],

    [SpaceHSV]: [
        [0, 360],
        [0, 100],
        [0, 100]
    ],

    [SpaceHWB]: [
        [0, 360],
        [0, 100],
        [0, 100]
    ],

    [SpaceCMY]: [
        [0, 100],
        [0, 100],
        [0, 100]
    ],

    [SpaceLAB]: [
        [0, 100],
        [-128, 127],  // Lab 'a' component range
        [-128, 127]   // Lab 'b' component range
    ],

    [SpaceLCH]: [
        [0, 100],
        [0, 150],  // Depending on the implementation, Chroma can exceed 100
        [0, 360]
    ],

    [SpaceXYZ]: [
        [0, 96],   // X ranges up to 95.047 (reference white)
        [0, 100],      // Y ranges up to 100 (reference white)
        [0, 109]   // Z ranges up to 108.883 (reference white)
    ],
};

const Conversions = {
    rgb: {
        hsl: space.rgb.hsl,
        xyz: space.rgb.xyz,
        lab: (input) => space.xyz.lab(space.rgb.xyz(input)),
        lch: (input) => space.lab.lchab(space.xyz.lab(space.rgb.xyz(input))),
        hsv: space.rgb.hsv,
        cmy: space.rgb.cmy,
        hwb: space.rgb.hwb,
    },
    hsl: {
        rgb: space.hsl.rgb,
        xyz: (input) => space.rgb.xyz(space.hsl.rgb(input)),
        lab: (input) => space.xyz.lab(space.rgb.xyz(space.hsl.rgb(input))),
        lch: (input) => space.lab.lchab(space.xyz.lab(space.rgb.xyz(space.hsl.rgb(input)))),
        hsv: (input) => space.rgb.hsv(space.hsl.rgb(input)),
        cmy: (input) => space.rgb.cmy(space.hsl.rgb(input)),
        hwb: (input) => space.rgb.hwb(space.hsl.rgb(input)),
    },
    hsv: {
        rgb: space.hsv.rgb,
        hsl: (input) => space.rgb.hsl(space.hsv.rgb(input)),
        xyz: (input) => space.rgb.xyz(space.hsv.rgb(input)),
        lab: (input) => space.xyz.lab(space.rgb.xyz(space.hsv.rgb(input))),
        lch: (input) => space.lab.lchab(space.xyz.lab(space.rgb.xyz(space.hsv.rgb(input)))),
        cmy: (input) => space.rgb.cmy(space.hsv.rgb(input)),
        hwb: (input) => space.rgb.hwb(space.hsv.rgb(input)),
    },
    xyz: {
        rgb: space.xyz.rgb,
        hsl: (input) => space.rgb.hsl(space.xyz.rgb(input)),
        hsv: (input) => space.rgb.hsv(space.xyz.rgb(input)),
        lab: space.xyz.lab,
        lch: (input) => space.lab.lchab(space.xyz.lab(input)),
        cmy: (input) => space.rgb.cmy(space.xyz.rgb(input)),
        hwb: (input) => space.rgb.hwb(space.xyz.rgb(input)),
    },
    lab: {
        xyz: space.lab.xyz,
        rgb: (input) => space.xyz.rgb(space.lab.xyz(input)),
        hsl: (input) => space.rgb.hsl(space.xyz.rgb(space.lab.xyz(input))),
        hsv: (input) => space.rgb.hsv(space.xyz.rgb(space.lab.xyz(input))),
        lch: space.lab.lchab,
        cmy: (input) => space.rgb.cmy(space.xyz.rgb(space.lab.xyz(input))),
        hwb: (input) => space.rgb.hwb(space.xyz.rgb(space.lab.xyz(input))),
    },
    lch: {
        lab: space.lchab.lab,
        xyz: (input) => space.lab.xyz(space.lchab.lab(input)),
        rgb: (input) => space.xyz.rgb(space.lab.xyz(space.lchab.lab(input))),
        hsl: (input) => space.rgb.hsl(space.xyz.rgb(space.lab.xyz(space.lchab.lab(input)))),
        hsv: (input) => space.rgb.hsv(space.xyz.rgb(space.lab.xyz(space.lchab.lab(input)))),
        cmy: (input) => space.rgb.cmy(space.xyz.rgb(space.lab.xyz(space.lchab.lab(input)))),
        hwb: (input) => space.rgb.hwb(space.xyz.rgb(space.lab.xyz(space.lchab.lab(input)))),
    },
    cmy: {
        rgb: space.cmy.rgb,
        hsl: (input) => space.rgb.hsl(space.cmy.rgb(input)),
        hsv: (input) => space.rgb.hsv(space.cmy.rgb(input)),
        xyz: (input) => space.rgb.xyz(space.cmy.rgb(input)),
        lab: (input) => space.xyz.lab(space.rgb.xyz(space.cmy.rgb(input))),
        lch: (input) => space.lab.lchab(space.xyz.lab(space.rgb.xyz(space.cmy.rgb(input)))),
        hwb: (input) => space.rgb.hwb(space.cmy.rgb(input)),
    },
    hwb: {
        rgb: space.hwb.rgb,
        hsl: (input) => space.rgb.hsl(space.hwb.rgb(input)),
        hsv: (input) => space.rgb.hsv(space.hwb.rgb(input)),
        xyz: (input) => space.rgb.xyz(space.hwb.rgb(input)),
        lab: (input) => space.xyz.lab(space.rgb.xyz(space.hwb.rgb(input))),
        lch: (input) => space.lab.lchab(space.xyz.lab(space.rgb.xyz(space.hwb.rgb(input)))),
        cmy: (input) => space.rgb.cmy(space.hwb.rgb(input)),
    },
};

// Canvases, pog
const color = document.querySelector("#color canvas"),
    x = document.querySelector("#x canvas"),
    y = document.querySelector("#y canvas"),
    z = document.querySelector("#z canvas");

// Contexts
const colorCtx = color.getContext("2d"),
    xCtx = x.getContext("2d"),
    yCtx = y.getContext("2d"),
    zCtx = z.getContext("2d");

// Inputs
const xInput = document.querySelector("#x input"),
    yInput = document.querySelector("#y input"),
    zInput = document.querySelector("#z input");

// Knobs
const xKnob = document.querySelector("#x .knob"),
    yKnob = document.querySelector("#y .knob"),
    zKnob = document.querySelector("#z .knob");

// Other elements
const spaces = document.querySelectorAll(".space"),
    colorDiv = document.querySelector("#color");

// Variables
let colorSpace = SpaceHSL,
    xVal = Math.round(Math.random() * 360),
    yVal = 100,
    zVal = 50,
    aVal = 1.0;

// Functions
function convert(to, x, y, z) {
    if (colorSpace === to) {
        return [x, y, z];
    }

    const func = Conversions[colorSpace][to];

    return func([x, y, z]);
}

function asRGB() {
    const [r, g, b] = convert(SpaceRGB, xVal, yVal, zVal);

    if (isOutOfRange(r, g, b)) {
        return false;
    }

    return rgb2string(r, g, b, aVal);
}

function rgb2string(r, g, b, a) {
    return `rgba(${r}, ${g}, ${b}, ${a.toFixed(2)})`;
}

function isOutOfRange(r, g, b) {
    return r < 0 || r > 255 || g < 0 || g > 255 || b < 0 || b > 255;
}

function gradient(ctx, minmax, width, color) {
    const [min, max] = minmax,
        size = max - min;

    const grad = ctx.createLinearGradient(0, 0, width, 0);

    for (let i = min; i < max; i++) {
        const pos = (i - min) / size;

        let [r, g, b] = color(i);

        if (isOutOfRange(r, g, b)) {
            r = g = b = 128;
        }

        grad.addColorStop(pos, rgb2string(r, g, b, aVal));
    }

    return grad;
}

function updateInputs() {
    xInput.value = xVal;
    yInput.value = yVal;
    zInput.value = zVal;

    // Min and max attributes
    const range = Ranges[colorSpace];

    xInput.setAttribute("min", range[0][0]);
    xInput.setAttribute("max", range[0][1]);

    yInput.setAttribute("min", range[1][0]);
    yInput.setAttribute("max", range[1][1]);

    zInput.setAttribute("min", range[2][0]);
    zInput.setAttribute("max", range[2][1]);
}

function updateSliders() {
    const range = Ranges[colorSpace];

    const xSize = range[0][1] - range[0][0],
        ySize = range[1][1] - range[1][0],
        zSize = range[2][1] - range[2][0];

    const xPos = (xVal - range[0][0]) / xSize,
        yPos = (yVal - range[1][0]) / ySize,
        zPos = (zVal - range[2][0]) / zSize;

    xKnob.style.left = `${xPos * 100}%`;
    yKnob.style.left = `${yPos * 100}%`;
    zKnob.style.left = `${zPos * 100}%`;
}

function draw() {
    // Draw color
    const rgb = asRGB();

    if (rgb) {
        colorCtx.fillStyle = rgb;

        colorDiv.classList.remove("out-of-gamut");
    } else {
        colorCtx.fillStyle = "#808080";

        colorDiv.classList.add("out-of-gamut");
    }

    colorCtx.fillRect(0, 0, color.width, color.height);

    // Draw sliders
    const range = Ranges[colorSpace];

    // x slider
    const xGradient = gradient(xCtx, range[0], x.width, v => {
        return convert(SpaceRGB, v, yVal, zVal);
    });

    xCtx.fillStyle = xGradient;
    xCtx.fillRect(0, 0, x.width, x.height);

    // y slider
    const yGradient = gradient(yCtx, range[1], y.width, v => {
        return convert(SpaceRGB, xVal, v, zVal);
    });

    yCtx.fillStyle = yGradient;
    yCtx.fillRect(0, 0, y.width, y.height);

    // z slider
    const zGradient = gradient(zCtx, range[2], z.width, v => {
        return convert(SpaceRGB, xVal, yVal, v);
    });

    zCtx.fillStyle = zGradient;
    zCtx.fillRect(0, 0, z.width, z.height);
}

function setColorSpace(space) {
    [xVal, yVal, zVal] = convert(space, xVal, yVal, zVal);

    const range = Ranges[space];

    // Clamp
    xVal = Math.min(range[0][1], Math.max(range[0][0], xVal));
    yVal = Math.min(range[1][1], Math.max(range[1][0], yVal));
    zVal = Math.min(range[2][1], Math.max(range[2][0], zVal));

    // Round
    xVal = Math.round(xVal);
    yVal = Math.round(yVal);
    zVal = Math.round(zVal);

    colorSpace = space;

    for (const sp of spaces) {
        const val = sp.dataset.space;

        if (val === colorSpace) {
            sp.classList.add("active");
        } else {
            sp.classList.remove("active");
        }
    }

    draw();
    updateInputs();
    updateSliders();
}

// Init
draw();
updateInputs();
updateSliders();

// Event listeners
spaces.forEach(space => {
    space.addEventListener("click", () => setColorSpace(space.dataset.space));
});

xInput.addEventListener("input", () => {
    xVal = parseInt(xInput.value);

    draw();
    updateSliders();
});

x.addEventListener("mousemove", event => {
    if (event.buttons !== 1) return;

    const box = x.getBoundingClientRect(),
        relative = event.clientX - box.left,
        pos = relative / box.width;

    const range = Ranges[colorSpace],
        size = range[0][1] - range[0][0],
        val = range[0][0] + pos * size;

    xVal = Math.round(val);

    updateSliders();
    updateInputs();
    draw();
});

yInput.addEventListener("input", () => {
    yVal = parseInt(yInput.value);

    draw();
    updateSliders();
});

y.addEventListener("mousemove", event => {
    if (event.buttons !== 1) return;

    const box = y.getBoundingClientRect(),
        relative = event.clientX - box.left,
        pos = relative / box.width;

    const range = Ranges[colorSpace],
        size = range[1][1] - range[1][0],
        val = range[1][0] + pos * size;

    yVal = Math.round(val);

    updateSliders();
    updateInputs();
    draw();
});

zInput.addEventListener("input", () => {
    zVal = parseInt(zInput.value);

    draw();
    updateSliders();
});

z.addEventListener("mousemove", event => {
    if (event.buttons !== 1) return;

    const box = z.getBoundingClientRect(),
        relative = event.clientX - box.left,
        pos = relative / box.width;

    const range = Ranges[colorSpace],
        size = range[2][1] - range[2][0],
        val = range[2][0] + pos * size;

    zVal = Math.round(val);

    updateSliders();
    updateInputs();
    draw();
});
