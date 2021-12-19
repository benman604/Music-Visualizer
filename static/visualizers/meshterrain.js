is3d = true
rotatable = true

function begin(){

}

let mult = 3
let gridSize = 30
let gridDist = 40
let trans = {x: 400, y:0}
let ctrans = {x:-4, y:-3}
function update(){
    let spectrum = fft.analyze()
    background(0);
    //stroke(255);
    strokeWeight(0.5);
    //noFill()
    rotateX(65);
    translate((-width/2) + trans.x, (-height/2) + trans.y)
    for(var y = 0; y < gridSize; y++){
        beginShape(TRIANGLE_STRIP);
        for(var x = 0; x < gridSize; x++){
            let distance = round(dist(ctrans.x + x, ctrans.y + y, gridCount/2, gridCount/2))
            let height = spectrum[distance] * mult

            fill(100, 255 - height/3, height/3)
            vertex(x * gridDist, y * gridDist, height);
            vertex(x * gridDist, (y + 1) * gridDist, height);
        }
        endShape();
    }
}