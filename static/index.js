var soundFile, fft
var is3d = true
function preload(){
    soundFile = loadSound(audiofile)
}

function setup(){
    if(is3d){
        createCanvas(windowWidth, windowHeight, WEBGL)
    } else{
        createCanvas(windowWidth, windowHeight)
    }
    soundFile.loop()
    fft = new p5.FFT()
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

var x=0, y=10, z=0
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
    background(0)

    if(is3d){
        orbitControl(10, 10, 0);
        rotateX(x)
        rotateY(y)
        rotateZ(z)
        scale(zoom)
    }
    update()
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