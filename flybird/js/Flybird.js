// 获取页面元素
var headDiv = document.getElementById("head");
var startMenu = document.getElementById("startMenu");
var startBtn = document.querySelector("#startMenu img");
var endMenu = document.getElementById("endMenu");
var curScore = document.getElementById("currentScore");
var bestScore = document.getElementById("bestScore");
var bird = document.getElementById("bird");
var scoreDiv = document.getElementById("score");
var pipeUL = document.getElementById("pipeUL");
var gameMus = document.getElementById("gameMusic");
var bulletMus = document.getElementById("bulletMusic");
var overMus = document.getElementById("overMusic");
var gameDiv = document.getElementById("game");

// 定义变量,接收计时器
var birdDownTimer, birdUpTimer;

// 开始按钮关联点击事件
startBtn.onclick = function(e) {
    var even = e || window.event
    //阻止事件传播
    even.stopPropagation();
    // 1, 背景音乐
    // 开始背景音乐
    gameMus.play();
    // 无限循环音乐
    gameMus.loop = "loop";
    // 2, 隐藏head标题
    headDiv.style.display = "none";
    // 3, 隐藏开始菜单
    startMenu.style.display = "none";
    // 4, 出现分数
    scoreDiv.style.display = "block";
    // 5, 生成管道
    setInterval(createPipe, 3000);
    // 6, 出现鸟
    bird.style.display = "block";
    // 7, 小鸟进行下落
    birdDownTimer = setInterval(birdDown, 30);
    // 8, 给gameDiv关联点击事件
    gameDiv.onclick = gameClick;
    // 9, 碰撞检测
    setInterval(function() {
        //获取li
        var lis = pipeUL.getElementsByTagName("li");
        for(var i = 0; i < lis.length; i++){
            checkP(lis[i].firstChild);
            checkP(lis[i].lastChild);
        }
    }, 16);
}
//定义一个碰撞检测函数
function checkP(pipe) {
    //获取小鸟的四个边距
    var birdL = bird.offsetLeft;
    var birdR = birdL + bird.clientWidth;
    var birdT = bird.offsetTop;
    var birdB = birdT + bird.clientHeight;

    //获取管道的四个边距
    var pipeL = pipe.offsetParent.offsetLeft;
    var pipeR = pipeL + pipe.clientWidth;
    var pipeT = pipe.offsetTop;
    var pipeB = pipeT + pipe.clientHeight;

    //作比较(!没有碰到一起)也就是碰到的时候
    if(!(birdL > pipeR || birdR < pipeL || birdB < pipeT || birdT > pipeB)){
        gameOver();
    }
}

// 定义函数,创建单个管道
function createPipe() {
    // 1, 创建li
    var li = document.createElement("li");
    li.className = "pipe";
    li.style.left = pipeUL.clientWidth + "px";
    pipeUL.appendChild(li);

    //小鸟通过的洞口高度
    var doorH = 123;
    //随机一个上管道高度[60, 423-123-60]
    var topH = Math.floor(Math.random() * (li.clientHeight - doorH - 60 - 60 + 1) + 60);
    // 计算下管道高度
    var botH = li.clientHeight - topH - doorH;
    // 创建上管道
    var topDiv = document.createElement("div");
    topDiv.className = "pipe_top";
    topDiv.style.height = topH + "px";
    li.appendChild(topDiv);

    // 创建下管道
    var botDiv = document.createElement("div");
    botDiv.className = "pipe_bottom";
    botDiv.style.height = botH + "px";
    li.appendChild(botDiv);

    //2, 移动管道
    var maxL = pipeUL.clientWidth;
    var pipeTimer = setInterval(function() {
        maxL--;
        li.style.left = maxL + "px";

        // 判断得分
        if (maxL == 0) {
            // 得分
            changeScore();
        }
        // 清除计时器
        if (maxL <= -li.clientWidth) {
            clearInterval(pipeTimer);
            // 删除li
            // pipeUL.removeChild(li);//闭包的使用,li被保存起来了,所以这个li就是已经出去的那个li
            //删除方法二:
            var firLi = pipeUL.firstElementChild;
            pipeUL.removeChild(firLi);
        }

    }, 16)
}

var num = 0;
// 定义函数,处理分数的变化
function changeScore() {
    num++;
    // 清除内部的内容
    scoreDiv.innerHTML = "";
    // 根据num生成对应的img
    if (num < 10) {
        // 一个img
        var img1 = document.createElement("img");
        img1.src = "img/" + num + ".jpg";
        scoreDiv.appendChild(img1);
    } else if(num < 100){
        // 两个img
        // 十位
        var imgS = document.createElement("img");
        imgS.src = "img/" + Math.floor(num / 10) + ".jpg";
        scoreDiv.appendChild(imgS);

        //个位
        var imgG = document.createElement("img");
        imgG.src = "img/" + (num % 10) + ".jpg";
        scoreDiv.appendChild(imgG);
    } else if(num < 1000){
        // 三个img
        //百位
        var imgB = document.createElement("img");
        imgB.src = "img/" + Math.floor(num / 100) + ".jpg";
        scoreDiv.appendChild(imgB);
        //十位
        var imgS = document.createElement("img");
        imgS.src = "img/" + Math.floor(num / 10) + ".jpg";
        scoreDiv.appendChild(imgS);
        //个位
        var imgG = document.createElement("img");
        imgG.src = "img/" + (num % 10) + ".jpg";
        scoreDiv.appendChild(imgG);
    }

}

var speed = 0;
// 定义函数,处理小鸟下落
function birdDown() {
    // 1, 修改小鸟src
    bird.src = "img/down_bird.png";
    //2, 修改top值
    speed += 0.5;
    if(speed >= 8){
        speed = 8;//设置最大速度
    }
    bird.style.top = bird.offsetTop + speed + "px";
    //3, 判断是否接触地面
    if(bird.offsetTop + bird.clientHeight >= 423) {
        //游戏结束
        gameOver();
    }
}

// 定义函数,处理小鸟上升
function birdUp() {
    //1, 修改src    
    bird.src = "img/up_bird.png";
    //2, 修改top值
    speed -= 0.5;
    //当小鸟上升速度小于0时
    if(speed < 0){
        //不能继续上升
        clearInterval(birdUpTimer);
        //小鸟开始下落
        speed = 0;
        birdDownTimer = setInterval(birdDown, 30);
    }
    bird.style.top = bird.offsetTop - speed + "px";
    //3,判断是否触底
    if (bird.offsetTop <= 0) {
        //游戏结束
        gameOver();
    }
}

// gameDiv 的点击事件
function gameClick() {
    //1, 播放音效
    bulletMus.play();
    //2, 停止下落
    clearInterval(birdDownTimer);
    //3, 开始上升
    clearInterval(birdUpTimer);
    speed = 8;
    birdUpTimer = setInterval(birdUp, 30);
}

// 游戏结束
function gameOver() {
    //1, 播放游戏结束的音乐
    overMus.play();
    //2, 停止游戏背景音乐
    gameMus.pause();
    //3, 清除页面所有计时器
    var newTimer = setInterval(function() {},1);
    // console.log(newTimer);
    for(var i = 1; i < newTimer; i++) {
        clearInterval(i);
    }
    //4, 清除点击事件
    gameDiv.onclick = null;

    //5, 显示结束菜单
    endMenu.style.display = "block";
    //6, 处理分数
	if(localStorage.nPoint) {
		if(num > localStorage.nPoint){
            localStorage.nPoint = num;
            console.log(localStorage.nPoint);
		}
	}else{
        localStorage.nPoint = num;
        console.log(localStorage.nPoint);
	}
    curScore.innerHTML = num;
    bestScore.innerHTML = localStorage.nPoint;
    
}