function begin(){

}

let a = 0
function update(){
    background(0)
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
            let height = spectrum[distance] * 3
            if (height > 0){
                box(20, 20, height);
            }
            pop() 
        }
        translate(0, -gridCount * step)
    }
    srotate(Math.sin(a*2)/4 + 92, 0, a/2)
    a+=0.01
}