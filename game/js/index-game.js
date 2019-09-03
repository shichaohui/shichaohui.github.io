
window.onload = function() {

    // DOM 元素
    let road = document.getElementById("road");
    let player = document.getElementById("player");
    let cloudContainer = document.getElementById("cloudContainer");
    let obstacleContainer = document.getElementById("obstacleContainer");
    let foodContainer = document.getElementById("foodContainer");
    let score = document.getElementById("score");
    let tips = document.getElementById("tips");

    let isPlaying = false;

    let currentScore = 0;

    let jumpHeight = player.clientHeight * 2.5;

    let isJumping = false;

    // 移动速度
    let cloudSpeed = 1;
    let speed = 5;

    // 计时器 id
    let gameIntervalId = 0;
    let generateCloudIntervalId = 0;
    let generateObstacleIntervalId = 0;
    let generateFoodIntervalId = 0;

    // 云朵元素池
    let cloudPool = [];
    // 障碍物元素池
    let obstaclePool = [];
    // 食物元素池
    let foodPool = [];

    document.onkeydown = function(event) {
        let keyNum = window.event ? event.keyCode : event.which;
        if (keyNum == 32) { // 空格
            if (!isPlaying) {
                start();
            }
            jump();
        }
    }

    // 开始游戏
    function start() {
        isPlaying = true;
        
        gameIntervalId = setInterval(gameInterval, 16);
        generateCloudIntervalId = setTimeout(generateCloud, 0);
        generateObstacleIntervalId = setTimeout(generateObstacle, 0);
        generateFoodIntervalId = setTimeout(generateFood, 5000);

        score.style.visibility = "visible";
        tips.style.visibility = "hidden";
    }

    // 游戏间隔刷新函数
    function gameInterval() {
        moveRoad();
        moveObstacle();
        moveFood();
        checkGameState();
    }

    // 对路执行移动
    function moveRoad() {
        let newMarginLeft = parseInt(road.style.marginLeft || 0) - speed;
        if (Math.abs(newMarginLeft) > road.clientWidth / 2) {
            newMarginLeft = 0;
        }
        road.style.marginLeft = newMarginLeft + "px";
    }

    // 对障碍物执行移动
    function moveObstacle() {
        for (let i = 0; i < obstacleContainer.childNodes.length; i++) {
            let child = obstacleContainer.childNodes[i];
            child.style.marginLeft = parseInt(child.style.marginLeft) - speed + "px";
        }
    }

    // 对食物执行移动
    function moveFood() {
        for (let i = 0; i < foodContainer.childNodes.length; i++) {
            let child = foodContainer.childNodes[i];
            child.style.marginLeft = parseInt(child.style.marginLeft) - speed + "px";
        }
    }

    // 生成云朵
    function generateCloud() {
        let img;
        if (cloudPool.length > 0) {
            img = cloudPool.pop();
        } else {
            img = document.createElement('img');
            img.src = "./img/inner-game/cloud.svg";
            img.style.position = "absolute";
        }
        img.style.height = (Math.random() + 0.5) * player.clientHeight + "px";
        img.style.marginTop = Math.random() * cloudContainer.clientHeight / 3 + "px";
        img.style.marginLeft = cloudContainer.clientWidth + "px";
        cloudContainer.appendChild(img);

        // 最少 2500ms 最多 (1500+2500)ms 生成一个障碍物
        generateCloudIntervalId = setTimeout(generateCloud, Math.random() * 1500 + 2500);
    }

    // 生成障碍物
    function generateObstacle() {
        let img;
        if (obstaclePool.length > 0) {
            img = obstaclePool.pop();
        } else {
            img = document.createElement('img');
            img.src = "./img/inner-game/obstacle.gif";
            img.style.position = "absolute";
            img.style.bottom = "0px";
        }
        img.isScored = false;
        img.style.height = (Math.random() * currentScore / 10 * 0.1  + 1) * player.clientHeight + "px";
        img.style.marginLeft = obstacleContainer.clientWidth + "px";
        obstacleContainer.appendChild(img);

        // 最少 2000ms 最多 (1000+2000)ms 生成一个障碍物
        generateObstacleIntervalId = setTimeout(generateObstacle, Math.random() * 1000 + 2000);
    }

    // 生成食物
    function generateFood() {
        let img;
        if (foodPool.length > 0) {
            img = foodPool.pop();
        } else {
            img = document.createElement('img');
            img.src = "./img/inner-game/food.svg";
            img.style.position = "absolute";
            img.style.height = player.clientHeight / 3 * 2 + "px";
        }
        img.isScored = false;
        img.style.bottom = (Math.random() * jumpHeight) + "px";
        img.style.marginLeft = foodContainer.clientWidth + "px";
        foodContainer.appendChild(img);

        // 最少 5000ms 最多 (5000+5000)ms 生成一个食物
        generateFoodIntervalId = setTimeout(generateFood, Math.random() * 5000 + 5000);
    }

    // 检查游戏状态
    function checkGameState() {
        // 回收云朵
        if (cloudContainer.hasChildNodes()) {
            for (let i = 0; i < cloudContainer.childNodes.length; i++) {
                let child = cloudContainer.childNodes[i];
                if (parseInt(child.style.marginLeft) < -child.clientWidth) {
                    clearInterval(child.intervalId);
                    cloudContainer.removeChild(child);
                    cloudPool.push(child);
                }
            }
        }
        
        if (obstacleContainer.hasChildNodes()) {
            let playerRect = zoomOutBound(player.getBoundingClientRect());
            for (let i = 0; i < obstacleContainer.childNodes.length; i++) {
                let child = obstacleContainer.childNodes[i];
                // 判断游戏是否结束
                let obstacleRect = zoomOutBound(child.getBoundingClientRect());
                let isIntersect = !(playerRect.right < obstacleRect.left || playerRect.left > obstacleRect.right ||
                    playerRect.top > obstacleRect.bottom || playerRect.bottom < obstacleRect.top);
                if (isIntersect) {
                    over();
                    return;
                }
                // 判断是否得分
                if (playerRect.left > obstacleRect.right && !child.isScored) {
                    child.isScored = true;
                    scoring();
                }
                // 回收障碍物
                if (parseInt(child.style.marginLeft) < -child.clientWidth) {
                    clearInterval(child.intervalId);
                    obstacleContainer.removeChild(child);
                    obstaclePool.push(child);
                }
            }
        }

        if (foodContainer.hasChildNodes()) {
            let playerRect = zoomOutBound(player.getBoundingClientRect());
            for (let i = 0; i < foodContainer.childNodes.length; i++) {
                let child = foodContainer.childNodes[i];
                // 判断是否得分
                let foodRect = zoomOutBound(child.getBoundingClientRect());
                let isIntersect = !(playerRect.right < foodRect.left || playerRect.left > foodRect.right ||
                    playerRect.top > foodRect.bottom || playerRect.bottom < foodRect.top);
                if (isIntersect && !child.isScored) {
                    child.isScored = true;
                    scoring();
                }
                // 回收食物
                if (parseInt(child.style.marginLeft) < -child.clientWidth || child.isScored) {
                    clearInterval(child.intervalId);
                    foodContainer.removeChild(child);
                    foodPool.push(child);
                }
            }
        }
    }

    // 缩小范围
    function zoomOutBound(rect) {
        // 由于图片边缘有透明像素，所以缩小一下检测范围
        return {
            top: rect.top + rect.height * 0.1,
            right: rect.right - rect.width * 0.1,
            bottom: rect.bottom - rect.height * 0.1,
            left: rect.left + rect.width * 0.1
        };
    }

    // 计分
    function scoring() {
        currentScore += 1;
        score.innerHTML = "得分：" + currentScore;
    }

    // 游戏结束
    function over() {
        isPlaying = false;
        currentScore = 0;
        
        clearInterval(gameIntervalId);
        clearInterval(generateCloudIntervalId);
        clearInterval(generateObstacleIntervalId);
        clearInterval(generateFoodIntervalId);

        while(cloudContainer.lastChild) {
            clearInterval(cloudContainer.lastChild.intervalId);
            cloudContainer.removeChild(cloudContainer.lastChild);
        }
        while(obstacleContainer.lastChild) {
            clearInterval(obstacleContainer.lastChild.intervalId);
            obstacleContainer.removeChild(obstacleContainer.lastChild);
        }
        while(foodContainer.lastChild) {
            clearInterval(foodContainer.lastChild.intervalId);
            foodContainer.removeChild(foodContainer.lastChild);
        }

        score.style.visibility = "hidden";
        score.innerHTML = "";
        tips.style.visibility = "visible";
    }

    // 跳跃
    function jump() {
        if (isJumping) {
            return;
        }
        isJumping = true;
        let originBottom = parseInt(player.style.bottom || 0);
        let time = 0;
        let jumpIntervalId = setInterval(function() {
            let newBottom = Math.sin(time += 0.06 ) * jumpHeight;
            player.style.bottom = newBottom + "px";
            if (newBottom <= originBottom) {
                player.style.bottom = originBottom + "px";
                clearInterval(jumpIntervalId);
                isJumping = false;
            }
        }, 16);
    }

}