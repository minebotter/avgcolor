var imgsList = [];
var fr = new FileReader();
var avg = new FastAverageColor();
var canv;
var ctx;
var gfiles;

window.onload = () => {
    canv = document.getElementById("canv");
    ctx = canv.getContext("2d");
};

async function filesReceive(files) {
    gfiles = files;
    console.log(files);
    for(let i = 0; i < files.length; i++) {
        if(files[i].type.startsWith("image")) {
        let img = document.getElementById("img");
        let image = new Image();
        await readAsDataURLAsync(files[i]);
        img.src = fr.result;
        image.src = fr.result
        //ctx.clearRect(0,0,canv.width,canv.height);
        //ctx.drawImage(image, 0, 0);
        //let imgData = ctx.getImageData(0,0,image.width,image.height).data;
        let avgcolor = await avg.getColorAsync(image);
        console.log(avgcolor);
        //document.body.style.background = avgcolor.rgb;
        imgsList.push({name: files[i].name, avgcolor: avgcolor});
        //console.log(imgData)
        }
    }
    console.log(imgsList);
}

async function getClosestColor() {
    let r = document.getElementById("r").value;
    let g = document.getElementById("g").value;
    let b = document.getElementById("b").value;
    let difference = [];
    for(let i = 0; i < imgsList.length; i++) {
        difference.push({block: imgsList[i].name, difference: colorDifference(r,g,b,imgsList[i].avgcolor.value[0],imgsList[i].avgcolor.value[1],imgsList[i].avgcolor.value[2])});
    }
    console.log(difference);
    difference = difference.sort((a, b) => a.difference - b.difference);
    console.log(difference);
    document.getElementById("resBlock").innerHTML = difference[0].block;
    await readAsDataURLAsync(Array.from(gfiles).find((e) => e.name == difference[0].block));
    document.getElementById("resImg").src = fr.result;
    document.getElementById("secondColor").style.background = imgsList.find((e) => e.name == difference[0].block).avgcolor.rgb;
    document.getElementById("secondColor").innerHTML = imgsList.find((e) => e.name == difference[0].block).avgcolor.rgb;
    document.getElementById("firstColor").style.background = "rgb("+r+","+g+","+b+")";
    document.getElementById("firstColor").innerHTML = "rgb("+r+","+g+","+b+")";
}

function colorDifference (r1, g1, b1, r2, g2, b2) {
    var sumOfSquares = 0;

    sumOfSquares += Math.pow(r1 - r2, 2);
    sumOfSquares += Math.pow(g1 - g2, 2);
    sumOfSquares += Math.pow(b1 - b2, 2);
    
    return Math.sqrt(sumOfSquares);
}

function readAsDataURLAsync(blob) {
    return new Promise(resolve => {
        fr.onloadend = () => {
            resolve();
        };
        fr.readAsDataURL(blob);
    });
}