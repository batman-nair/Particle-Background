var windowWidth = window.innerWidth,
    windowHeight = window.innerHeight,
    // Number of particles
    N_PARTICLES = 100,
    // If the particles should be connected
    P_CONNECTED = true,
    // Threshold for establishing connection
    CONN_THRESH = 100,
    // Particle constants
    P_MAX_VEL = 1,
    P_MAX_SIZE = 10,
    P_MIN_SIZE = 3,
    P_MIN_AGE = 50,
    // If the color should remain fixed
    P_CONST_COLOR_MODE = false,
    P_CONST_COLORR = 0,
    P_CONST_COLORG = 0,
    P_CONST_COLORB = 0,
    P_MAX_LIFE = 100,
    BACKGROUND = [0, 0, 0, 200];

var NUM_PRESETS = 3;
// Sets preset values, set to 0 to disable presetting
var PresetValue = 1;
setPresets(PresetValue);

var ParticleObject = function() {
    this.MAX_VEL = P_MAX_VEL;
    this.MAX_SIZE = P_MAX_SIZE;
    this.MIN_SIZE = P_MIN_SIZE;
    this.MIN_AGE = P_MIN_AGE;
    this.MAX_LIFE = P_MAX_LIFE;
    this.CONST_COLOR_MODE = P_CONST_COLOR_MODE;
    this.CONST_COLORR = P_CONST_COLORR;
    this.CONST_COLORG = P_CONST_COLORG;
    this.CONST_COLORB = P_CONST_COLORB;
    // FADE_TIME: fading in and out takes this percent of its life
    this.FADE_TIME = 0.2;
    // Keeps track of current Preset
    this.presetValue = PresetValue;

    // Always call init first
    this.init = function() {
        if(PresetValue != this.presetValue) {
            this.resetPresets();
        }
        this.life = random(50, 300);
        this.size = random(this.MIN_SIZE, this.MAX_SIZE);
        this.xx = random(windowWidth);
        this.yy = random(windowHeight);
        this.vx = random(-(this.MAX_VEL), this.MAX_VEL);
        this.vy = random(-(this.MAX_VEL), this.MAX_VEL);
        this.age = 0;
        if(this.CONST_COLOR_MODE) {
            this.colorr = this.CONST_COLORR;
            this.colorg = this.CONST_COLORG;
            this.colorb = this.CONST_COLORB;
        } else {
            this.colorr = random(255);
            this.colorg = random(255);
            this.colorb = random(255);
        }
        this.alpha = random(100);
        this.viewAlpha = this.alpha;
        // fadeAlpha: Change to alpha value when fading
        this.fadeAlpha = this.alpha/(this.FADE_TIME*this.life);
        this.fadeThresh = this.life * this.FADE_TIME;
        // fade age: Age at which fading sets in and out, precalculated
        this.fadeInAge = this.FADE_TIME * this.life;
        this.fadeOutAge = (1 - this.FADE_TIME) * this.life;
    }

    this.kill = function() {
        if (this.age < this.fadeOutAge) {
            this.age = this.fadeOutAge;
        }
        if(this.age <= 0) {
            this.init();
        }
    }

    this.draw = function() {
        this.alphaAdjust = 1;
        if(this.age < this.fadeInAge) {
            this.alphaAdjust = 1 - (this.fadeInAge - this.age) / this.fadeThresh;
        }
        else if(this.age > this.fadeOutAge) {
            this.alphaAdjust = 1 - (this.age - this.fadeOutAge) / this.fadeThresh;
        }
        this.alpha = this.viewAlpha * this.alphaAdjust;

        noStroke();
        fill(this.colorr, this.colorg, this.colorb, this.alpha);
        ellipse(this.xx, this.yy, this.size, this.size);
    }

    this.update = function() {
        this.age += 1;
        if(this.age > this.life) {
            this.init();
            return;
        }

        // Check if out of bounds
        if(this.xx > windowWidth || this.xx < 0
            || this.yy > windowHeight || this.yy < 0) {
                this.kill();
                return;
        }
        this.xx += this.vx;
        this.yy += this.vy;
    }

    this.resetPresets = function() {
        this.MAX_VEL = P_MAX_VEL;
        this.MAX_SIZE = P_MAX_SIZE;
        this.MIN_SIZE = P_MIN_SIZE;
        this.MIN_AGE = P_MIN_AGE;
        this.MAX_LIFE = P_MAX_LIFE;
        this.CONST_COLOR_MODE = P_CONST_COLOR_MODE;
        this.CONST_COLORR = P_CONST_COLORR;
        this.CONST_COLORG = P_CONST_COLORG;
        this.CONST_COLORB = P_CONST_COLORB;
    }
}

var particles = [];

var AGE_CONN_FADE_THRESH = 20; // Age to which fading happens
var ALPHA_FINAL_ADJUST = 1; // A final adjustment to alpha value

function DrawConnections() {
    for (var i = 0; i < N_PARTICLES; ++i) {
        for(var j = i+1; j < N_PARTICLES; ++j) {
            strokeWeight(1);
            distance = Math.sqrt(Math.pow((particles[i].xx - particles[j].xx), 2) + Math.pow((particles[i].yy - particles[j].yy), 2));
            if (distance > CONN_THRESH) {
                alpha = 0;
            }
            else {
                alpha = (CONN_THRESH - distance) / CONN_THRESH;
            }

            // To create a fade effect as one particle is born or dying
            min_age = Math.min((particles[i].life - particles[i].age),
                (particles[j].life - particles[j].age),
                particles[i].age, particles[j].age);
            if (min_age < AGE_CONN_FADE_THRESH) {
                alpha *= min_age/AGE_CONN_FADE_THRESH;
            }

            alpha = Math.min(alpha, particles[i].alpha, particles[j].alpha);

            alpha *= ALPHA_FINAL_ADJUST;

            colorr = int((particles[i].colorr + particles[j].colorr) / 2);
            colorg = int((particles[i].colorg + particles[j].colorg) / 2);
            colorb = int((particles[i].colorb + particles[j].colorb) / 2);

            stroke('rgba(' + colorr +', '+ colorg +', '+ colorb +', '+ alpha + ')');

            line(particles[i].xx, particles[i].yy, particles[j].xx, particles[j].yy);

        }
    }
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    noStroke();
    frameRate(100);

    for(var i = 0; i < N_PARTICLES; ++i) {
        particles.push(new ParticleObject());
        particles[i].init();
    }
}

function draw() {
    background(BACKGROUND);
    for (var i = 0; i < N_PARTICLES; ++i) {
        particles[i].update();
        particles[i].draw();
    }

    if (P_CONNECTED) {
        DrawConnections();
    }
}

// Sets preset values
function setPresets(num) {
    switch(num) {
        case 1:
            N_PARTICLES = 1000;
            P_CONNECTED = false;
            CONN_THRESH = 100;
            P_MAX_VEL = 1;
            P_MAX_SIZE = 10;
            P_MIN_SIZE = 3;
            P_MIN_AGE = 50;
            P_CONST_COLOR_MODE = false;
            P_CONST_COLORR = 255;
            P_CONST_COLORG = 255;
            P_CONST_COLORB = 255;
            P_MAX_LIFE = 100;
            BACKGROUND = [0, 0, 0, 200];
            break;
        case 2:
            N_PARTICLES = 100;
            P_CONNECTED = true;
            CONN_THRESH = 100;
            P_MAX_VEL = 1;
            P_MAX_SIZE = 10;
            P_MIN_SIZE = 3;
            P_MIN_AGE = 50;
            P_CONST_COLOR_MODE = false;
            P_CONST_COLORR = 0;
            P_CONST_COLORG = 0;
            P_CONST_COLORB = 0;
            P_MAX_LIFE = 100;
            BACKGROUND = [0, 0, 0, 200];
            break;
        case 3:
            N_PARTICLES = 50;
            P_CONNECTED = true;
            CONN_THRESH = 100;
            P_MAX_VEL = 1;
            P_MAX_SIZE = 10;
            P_MIN_SIZE = 3;
            P_MIN_AGE = 50;
            P_CONST_COLOR_MODE = true;
            P_CONST_COLORR = 0;
            P_CONST_COLORG = 0;
            P_CONST_COLORB = 0;
            P_MAX_LIFE = 100;
            BACKGROUND = [255, 255, 255, 200];
            break;
    }
}

document.addEventListener("click", function() {
    if (PresetValue) {
        PresetValue = PresetValue % NUM_PRESETS + 1;
        setPresets(PresetValue);
    }
});


document.addEventListener("resize", function() {
    windowWidth = window.innerWidth;
    windowHeight = window.innerHeight;
});
