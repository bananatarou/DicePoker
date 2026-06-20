//-------フレーム処理
FPS = 30;
let stime,etime,ptime;

//============= この下に大域変数を追加 =========
let scene = 0;
let nextScene;
let dice = new Array(5);
let diceFlag = new Array(5);
let totalScore;
let chance;
let rerollChance;
let score;
let hand;
let pip;
let multi;
let bgm;

init();
loop();
// 効果音を再生する関数
function playSound(src) {
    let sound = new Audio(src);
    sound.volume = 0.5; // 音量を調整
    sound.play();
}

function init(){
    setCanvas(1200,720);
    loadImg(0,"1.png");
    loadImg(1,"2.png");
    loadImg(2,"3.png");
    loadImg(3,"4.png");
    loadImg(4,"5.png");
    loadImg(5,"6.png");
    dice.fill(1);
    diceFlag.fill("C");
    totalScore = 0;
    chance = 4
    rerollChance = 3;
    pip = 0;

    // BGMを初期化（初回のみ）
    if (!bgm) {
        bgm = new Audio("./audio/Funky_weekend_night.mp3");
        bgm.loop = true;
        bgm.volume = 0.5;

        // キーボード操作後に再生
        const startBGM = (event) => {
            bgm.play();
            window.removeEventListener("keydown", startBGM); // 一度だけ再生
        };
        window.addEventListener("keydown", startBGM);
    } else {
        // BGMが再生中であれば停止して再生
        bgm.pause();
        bgm.currentTime = 0;
        bgm.play();
    }
}

function loop(){
    stime = Date.now();	//処理開始時刻を取得

    //========= ここからフレーム内の処理を追加 =========
    if(scene == 0){
        print("Dice poker", "center", 600, 330);
        print("Press space to start", "center", 600, 360);

        if(key[32] > 0){
            nextScene = 1;
            key[32] = 0;
        }
    }

    if(scene == 1){
        bg();
        printStatus();
        print("Press space to roll", "center", 600, 180);

        if(key[32] > 0){
            roll();
            key[32] = 0;
        }

        for(let i = 0; i < 5; i++){
            drawImg(dice[i] - 1, i * 240, 360 - img[dice[i] -  1].height / 2);
        }
    }

    if(scene == 2){
        bg();
        print("Press r to reroll", "center", 600, 180);
        print("Press space to confirm", "center", 600, 210);

        for(i = 0; i < 5; i++){
            if(key[49 + i] > 0){
                if(diceFlag[i] == "H"){
                    diceFlag[i] = "C";
                }else{
                    diceFlag[i] = "H";
                }
                key[49 + i] = 0;
            }
        }

        if(key[82] > 0 && rerollChance != 0){
            roll();
            rerollChance--;
            key[82] = 0;
        }
        printStatus();
        for(let i = 0; i < 5; i++){
            drawImg(dice[i] - 1, i * 240, 360 - img[dice[i] -  1].height / 2);
            print(diceFlag[i], "center", 120 + i * 240, 540);
        }

        if(key[32] > 0){
            judge();
            chance--;
            diceFlag.fill("C");
            pip = 0;
            nextScene = 3;
            key[32] = 0;
        }
    }

    if(scene == 3){
        bg();
        printStatus();
        print(`hand:${hand}`, "center", 600, 180);
        print(`score:${score}`, "center", 600, 210);
        for(let i = 0; i < 5; i++){
            drawImg(dice[i] - 1, i * 240, 360 - img[dice[i] -  1].height / 2);
        }

        if(chance != 0){
            print("Press space to nextroll", "center", 600, 540);
            if(key[32] > 0){
                nextScene = 1;
                key[32] = 0;
            }
        }else{
            print("Press space to result", "center", 600, 540);
            if(key[32] > 0){
                nextScene = 4;
                key[32] = 0;
            }
        }
    }

    if(scene == 4){
        bg();
        print(`rank:${rank()}`, "center", 600, 330);
        print(`Totalscore:${totalScore}`, "center", 600, 360);
        print("Press esc to retry", "center", 600, 390);

        if(key[27] > 0){
            init();
            nextScene = 1;
            key[27] = 0;
        }
    }

    sceneChange();

    //========= ここまでフレーム内の処理を追加 ========= 
    
    etime = Date.now(); //処理終了時刻を取得
    ptime = etime - stime;  //処理にかかった時間
    setTimeout("loop()", parseInt(1000/FPS) - ptime);//再呼び出し
}


//============= この下に関数を追加 =========
//-----.文字用関数-----
function print(text, pos, x, y){
    ctx.fillStyle = "white";
    ctx.font = parseInt(30) + "px bold monospace";
    ctx.textAlign = pos;
    ctx.fillText(text, x, y);
}

//-----.背景用関数-----
function bg(){
    ctx.fillStyle = "green";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

//-----.ステータス用関数-----
function printStatus(){
    print(`Totalscore:${totalScore}`, "left", 0, 30);
    print(`Chance:${chance}`, "left", 0, 60);
    print(`Rerollchance:${rerollChance}`, "left", 0, 90);
}

//-----.ロール用関数-----
function roll(){
    for(let i = 0; i < 5; i++){
        if(diceFlag[i] == "C"){
            dice[i] = Math.floor(Math.random() * 6) + 1;
        }
        nextScene = 2;
    }
    playSound("./audio/賽を振る_3.mp3");
}

//-----.役判定、スコア計算用関数-----
function judge(){
    let numCount = new Array(6)
    numCount.fill(0);
    let sameCount = new Array(4)
    sameCount.fill(0)
    let sum = 0;

    for(let i = 0; i < 5; i++){
        switch(dice[i]){
            case 1:
                numCount[0]++;
                break;
            case 2:
                numCount[1]++;
                break;
            case 3:
                numCount[2]++;
                break;
            case 4:
                numCount[3]++;
                break;
            case 5:
                numCount[4]++;
                break;
            case 6:
                numCount[5]++;
                break;
        }
        sum += dice[i];
    }

    for(let i = 0; i < 6; i++){
        switch(numCount[i]){
            case 5:
                sameCount[3]++;
                pip += (i + 1) * 5
                break;
            case 4:
                sameCount[2]++;
                pip += (i + 1) * 4
                break;
            case 3:
                sameCount[1]++;
                pip += (i + 1) * 3
                break;
            case 2:
                sameCount[0]++;
                pip += (i + 1) * 2
                break;
            default:
                break;
        }
    }

    if(sameCount[3] == 1){
        hand = "Five dice";
        pip += 120;
        multi = 12;
    }else if(sameCount[2] == 1){
        hand = "Four dice";
        pip += 60;
        multi = 7;
    }else if(sameCount[1] == 1 && sameCount[0] == 1){
        hand = "Full house";
        pip += 40;
        multi = 4;
    }else if(sameCount[1] == 1){
        hand = "Three dice";
        pip += 30;
        multi = 3;
    }else if(sameCount[0] == 2){
        hand = "Two pair";
        pip += 20;
        multi = 2;
    }else if(sameCount[0] == 1){
        hand = "One pair";
        pip += 10;
        multi = 2;
    }else if(sum == 15 || sum == 20){
        hand = "Straight";
        pip += 30 + sum;
        multi = 4;
    }else{
        hand = "No pair";
        pip += 5 + 6;
        multi = 1;
    }

    score = pip * multi;
    totalScore += score;
}

//-----.ランク計算用関数-----
function rank(){
    switch(true){
        case totalScore >= 1000:
            return "A";
        case totalScore >= 500:
            return "B";
        default:
            return "C";
    } 
}

//-----.シーン変更用関数-----
function sceneChange(){
    switch(nextScene){
        case 0:
            scene = 0;
            break;
        
        case 1:
            scene = 1;
            break;
        
        case 2:
            scene = 2;
            break;

        case 3:
            scene = 3;
            break;

        case 4:
            scene = 4;
            break;
    }
}