var soundFile, fft
function preload(){
    soundFile = loadSound(audiofile)
}

function setup(){
    createCanvas(windowWidth, windowHeight, WEBGL)
    soundFile.loop()
    fft = new p5.FFT()
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

var x=0, y=0, z=0
function srotate(_x, _y, _z){
    x = _x
    y = _y
    z = _z
}

var gridCount = 20
var step = 20

let zoom = 0.6
let zmin = 0.1
let zmax = 2
let sensativity = 0.0005

function mouseWheel(event){
    zoom -= sensativity * event.delta
    zoom = constrain(zoom, zmin, zmax)
}
function draw(){
    background(255)
    orbitControl(10, 10, 0);
    rotateX(10)
    rotateY(y)
    rotateZ(z)

    scale(zoom)
    
    normalMaterial()
    let trX = -gridCount * step / 2
    translate(trX, trX - 100)
    let spectrum = fft.analyze()
    for(let i=0; i<gridCount; i++){
        translate(step, 0)
        for(let j=0; j<gridCount; j++){
            translate(0, step)
            push()
            let distance = round(dist(i, j, gridCount/2, gridCount/2))
            distance *= 6
            //fill(250, 250, 250)
            box(20, 20, spectrum[distance] * 3);
            pop() 
        }
        translate(0, -gridCount * step)
    }
}

let playbtn = document.getElementById('play')
let backbtn = document.getElementById('back')
let forwbtn = document.getElementById('forw')
let infobtn = document.getElementById('info')

let playing = true
playbtn.addEventListener('click', () => {
    playing = !playing
    console.log(playing)
    if(playing){
        soundFile.loop()
        playbtn.firstChild.classList.add('fa-pause-circle')
        playbtn.firstChild.classList.remove('fa-play-circle')
    } else{
        soundFile.pause()
        playbtn.firstChild.classList.add('fa-play-circle')
        playbtn.firstChild.classList.remove('fa-pause-circle')
    }
})

forwbtn.addEventListener('click', () => {
    let to = soundFile.currentTime() + 5
    soundFile.jump(to)
})

backbtn.addEventListener('click', () => {
    let to = soundFile.currentTime() - 5
    soundFile.jump(to)
})