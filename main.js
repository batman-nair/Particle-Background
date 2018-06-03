var N_PARTICLES = 1000;

var ParticleObject = function() {
    this.MAX_VEL = 1;
    this.MAX_SIZE = 10;
    this.MIN_SIZE = 3;
    this.MIN_AGE = 50;
    this.MAX_LIFE = 100;
    // FADE_TIME: fading in and out takes this percent of its life
    this.FADE_TIME = 0.2;

    // Always call init first
    this.init = function() {
        this.life = random(50, 300);
        this.size = random(this.MIN_SIZE, this.MAX_SIZE);
        this.xx = random(window.innerWidth);
        this.yy = random(window.innerHeight);
        this.vx = random(-(this.MAX_VEL), this.MAX_VEL);
        this.vy = random(-(this.MAX_VEL), this.MAX_VEL);
        this.age = 0;
        this.colorr = random(255);
        this.colorg = random(255);
        this.colorb = random(255);
        this.alpha = random(100);
        // fadeAlpha: Change to alpha value when fading
        this.fadeAlpha = this.alpha/(this.FADE_TIME*this.life);
        // fade age: Age at which fading sets in and out, precalculated
        this.fadeInAge = this.FADE_TIME * this.life;
        this.fadeOutAge = (1 - this.FADE_TIME) * this.life;
    }
    
    this.draw = function() {
        fill(this.colorr, this.colorg, this.colorb, this.alpha);
        ellipse(this.xx, this.yy, this.size, this.size);
    }
    
    this.update = function() {
        this.age += 1;
        if(this.age > this.life) {
            this.init();
            return;
        }

        
        if(this.age < this.fadeInAge) {
            this.alpha += this.fadeAlpha;    
        }
        else if(this.age > this.fadeOutAge) {
            this.alpha -= this.fadeAlpha;    
        }
        // Check if out of bounds
        if(this.xx > window.innerWidth || this.xx < 0 
            || this.yy > window.innerHeight || this.yy < 0) {
                this.init();
                return;
        }
        this.xx += this.vx;
        this.yy += this.vy;
    }
}

var particles = [];

function setup() {
    createCanvas(displayWidth, displayHeight);
    noStroke();
    frameRate(100);

    for(var i = 0; i < N_PARTICLES; ++i) {
        particles.push(new ParticleObject());
        particles[i].init();
    }
}

function draw() {
    background(0, 0, 0, 200);
    for (var i = 0; i < N_PARTICLES; ++i) {
        particles[i].update();
        particles[i].draw();
    }
}