let cvs = document.getElementById("canvas");
let ctx = cvs.getContext("2d");

function setCanvas(width, height){
    cvs.width = width;
    cvs.height = height;
}

let img = new Array(256);
let img_loaded = new Array(256);

function loadImg(n,filename){
    img_loaded[n] = false;
    img[n] = new Image();

    img[n].onload = function(){
        img_loaded[n] = true;
    }
    img[n].src = "image/" + filename;
}

function drawImg(n, x, y){
    if(img_loaded[n] == true){
        ctx.drawImage(img[n], x, y);
    }
}

let key = new Array(256);

function onKey(event){
    if(!event.repeat){
        key[event.keyCode] = 1;
    }else{
        key[event.keyCode] = 0;
    }
}

function offKey(event){
    key[event.keyCode] = 0;
}

window.addEventListener("keydown", onKey);
window.addEventListener("keyup", offKey);

function rnd(max){
    return parseInt(Math.random() * max);
}

function getDistance(x1, y1, x2, y2){
    return (Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2));
}

function drawCircle(x, y, r, outsidecolor, insidecolor){
    ctx.strokeStyle = outsidecolor;
    ctx.fillStyle = insidecolor;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI*2, false);
    ctx.closePath();
    ctx.stroke();
    ctx.fill();
}