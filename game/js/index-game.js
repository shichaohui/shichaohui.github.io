
window.onload = function() {

    // DOM 元素
    let road = document.getElementById("road");
    let player = document.getElementById("player");
    let cloudContainer = document.getElementById("cloudContainer");
    let obstacleContainer = document.getElementById("obstacleContainer");
    let score = document.getElementById("score");
    let tips = document.getElementById("tips");

    let isPlaying = false;

    let currentScore = 0;

    let jumpHeight = player.clientHeight * 2.5;

    let isJumping = false;

    // 移动速度
    let cloudSpeed = 1;
    let obstacleSpeed = 5;
    let roadSpeed = obstacleSpeed;

    // 计时器 id
    let roadId = 0;
    let generateCloudId = 0;
    let generateObstacleId = 0;
    let checkGameStateId = 0;

    // 云朵元素池
    let cloudPool = [];
    // 障碍物元素池
    let obstaclePool = [];

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
        
        roadId = setInterval(moveRoad, 16);
        generateCloudId = setInterval(generateCloud(), 4000);
        generateObstacleId = setInterval(generateObstacle(), 3000);
        checkGameStateId = setInterval(checkGameState, 16);

        score.style.visibility = "visible";
        tips.style.visibility = "hidden";
    }

    // 对路执行移动
    function moveRoad() {
        let newMarginLeft = parseInt(road.style.marginLeft || 0) - roadSpeed;
        if (Math.abs(newMarginLeft) > road.clientWidth / 2) {
            newMarginLeft = 0;
        }
        road.style.marginLeft = newMarginLeft + "px";
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

        let interval = function(_img, marginLeft) {
            return function() { _img.style.marginLeft = (marginLeft -= cloudSpeed) + "px" };
        }
        img.intervalId = setInterval(interval(img, cloudContainer.clientWidth), 16);

        return generateCloud;
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
        img.style.height = (Math.random() + 1) * player.clientHeight + "px";
        img.style.marginLeft = obstacleContainer.clientWidth + "px";
        obstacleContainer.appendChild(img);

        let interval = function(_img, marginLeft) {
            return function() { _img.style.marginLeft = (marginLeft -= obstacleSpeed) + "px" };
        }
        img.intervalId = setInterval(interval(img, obstacleContainer.clientWidth), 16);

        return generateObstacle;
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
                let obstacleRect = zoomOutBound(obstacleContainer.childNodes[i].getBoundingClientRect());
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
        
        clearInterval(roadId);
        clearInterval(generateCloudId);
        clearInterval(generateObstacleId);
        clearInterval(checkGameStateId);

        while(cloudContainer.lastChild) {
            clearInterval(cloudContainer.lastChild.intervalId);
            cloudContainer.removeChild(cloudContainer.lastChild);
        }
        while(obstacleContainer.lastChild) {
            clearInterval(obstacleContainer.lastChild.intervalId);
            obstacleContainer.removeChild(obstacleContainer.lastChild);
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