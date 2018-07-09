// Number of particles
var N_PARTICLES = 100;
// If the particles should be connected
var P_CONNECTED = true;

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

// Threshold for establishing connection
var CONN_THRESH = 100;

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
                particles[i].age, particles[j].age,
                particles[i].alpha, particles[j].alpha);
            if (min_age < AGE_CONN_FADE_THRESH) {
                alpha *= min_age/AGE_CONN_FADE_THRESH;
            }

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

    if (P_CONNECTED) {
        DrawConnections();
    }
}
