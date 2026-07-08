const transformBtn = document.getElementById('transform-btn');
const nextBtn = document.getElementById('next-btn');
const checkBtn = document.getElementById('check-btn');
const shapeMain = document.getElementById('shape-trapezoid');
const shapeTri = document.getElementById('shape-triangle');
const resultMessage = document.getElementById('result-message');
const userAnswer = document.getElementById('user-answer');

const labelBase = document.getElementById('label-base');
const labelHeight = document.getElementById('label-height');
const inputBase = document.getElementById('input-base');
const inputHeight = document.getElementById('input-height');
const instructionBox = document.getElementById('instruction-box');

// ガイド要素の取得
const heightLine = document.getElementById('height-line');
const heightText = document.getElementById('height-text');
const movingBaseContainer = document.getElementById('moving-base-container');

const GRID_SIZE = 40;

let currentBase = 5;
let currentHeight = 3;
let currentSkewUnits = 1;
let correctAnswer = 15;
let isTransformed = false;
let lastProblem = null; // 直前の問題と同じにならないようにするため記憶しておく

function generateNewQuestion() {
    isTransformed = false;
    shapeTri.style.transform = 'translateX(0px)';
    movingBaseContainer.style.transform = 'translateX(0px)'; 
    transformBtn.innerText = "【等積変形】の魔法を使う";
    transformBtn.style.background = "#34495e";
    userAnswer.value = "";
    inputBase.value = "";
    inputHeight.value = "";
    resultMessage.classList.add('hidden');
    nextBtn.classList.add('hidden');
    checkBtn.disabled = false;
    instructionBox.innerHTML = `<strong>【隊長からのヒント】</strong><br>魔法を使って形が変わったとき、元の図形の<strong>「底辺」</strong>と<strong>「高さ」</strong>が、長方形のどこの長さにぴったり重なるか、よーく見てみよう！`;

    // 直前の問題（底辺・高さ・斜辺の傾き）と全く同じにならないよう、違うものが出るまで作り直す
    let next;
    do {
        const newBase = Math.floor(Math.random() * 4) + 4;
        const newHeight = Math.floor(Math.random() * 3) + 3;
        // 斜辺の傾き：1〜(底辺-1)マスの範囲でランダムに変える（毎回同じ傾きにならないように）
        const newSkewUnits = Math.floor(Math.random() * (newBase - 1)) + 1;
        next = { base: newBase, height: newHeight, skewUnits: newSkewUnits };
    } while (
        lastProblem &&
        next.base === lastProblem.base &&
        next.height === lastProblem.height &&
        next.skewUnits === lastProblem.skewUnits
    );
    lastProblem = next;

    // ランダムなサイズ
    currentBase = next.base;
    currentHeight = next.height;
    currentSkewUnits = next.skewUnits;
    correctAnswer = currentBase * currentHeight;

    labelBase.innerText = currentBase;
    labelHeight.innerText = currentHeight;

    const startX = 160; 
    const startY = 40;  
    const widthPx = currentBase * GRID_SIZE;
    const heightPx = currentHeight * GRID_SIZE;
    const skewPx = currentSkewUnits * GRID_SIZE;

    // 台形
    shapeMain.style.left = `${startX + skewPx}px`;
    shapeMain.style.bottom = `${startY}px`;
    shapeMain.style.width = `${widthPx}px`;
    shapeMain.style.height = `${heightPx}px`;
    shapeMain.style.clipPath = `polygon(0px 0px, ${widthPx}px 0px, ${widthPx - skewPx}px ${heightPx}px, 0px ${heightPx}px)`;

    // 三角形
    shapeTri.style.left = `${startX}px`;
    shapeTri.style.bottom = `${startY}px`;
    shapeTri.style.width = `${skewPx}px`;
    shapeTri.style.height = `${heightPx}px`;
    shapeTri.style.clipPath = `polygon(${skewPx}px 0px, 0px ${heightPx}px, ${skewPx}px ${heightPx}px)`;

    // 高さの点線ガイド（傾きが変わっても、平行四辺形の内側に収まる位置に表示する）
    heightLine.style.left = `${startX + skewPx + GRID_SIZE}px`;
    heightLine.style.bottom = `${startY}px`;
    heightLine.style.height = `${heightPx}px`;

    heightText.style.left = `${startX + skewPx + GRID_SIZE + 5}px`;
    heightText.style.bottom = `${startY + heightPx / 2 - 10}px`;

    // 底辺コンテナの初期配置
    movingBaseContainer.style.left = `${startX}px`;
    movingBaseContainer.style.bottom = `${startY - 45}px`;
    movingBaseContainer.style.width = `${widthPx}px`;

    // 【修正】リピート回数を Math.floor で確実に整数化
    const arrowLine = movingBaseContainer.querySelector('.arrow-line');
    const repeatCount = Math.floor(currentBase * 3.3);
    arrowLine.innerText = "←" + "─".repeat(repeatCount) + "→";
}

// 等積変形アニメーション
transformBtn.addEventListener('click', () => {
    if (!isTransformed) {
        const moveDistance = currentBase * GRID_SIZE;
        const skewPx = currentSkewUnits * GRID_SIZE;
        shapeTri.style.transform = `translateX(${moveDistance}px)`;
        movingBaseContainer.style.transform = `translateX(${skewPx}px)`;
        
        transformBtn.innerText = "元の形に戻す";
        instructionBox.innerHTML = `<strong>【発見のチャンス！】</strong><br>形が「長方形」になりましたね！<br>・青い部分が動いたことで、青い矢印の<strong>「底辺」</strong>は長方形の<strong>「横の長さ」</strong>と同じになりました！<br>・赤い点線の<strong>「高さ」</strong>は、長方形の<strong>「縦の長さ」</strong>と同じになっています！`;
        isTransformed = true;
    } else {
        shapeTri.style.transform = 'translateX(0px)';
        movingBaseContainer.style.transform = 'translateX(0px)'; 
        transformBtn.innerText = "【等積変形】の魔法を使う";
        instructionBox.innerHTML = `<strong>【隊長からのヒント】</strong><br>魔法を使って形が変わったとき、元の図形の<strong>「底辺」</strong>と<strong>「高さ」</strong>が、長方形のどこの長さにぴったり重なるか、よーく見てみよう！`;
        isTransformed = false;
    }
});

// 答え合わせ
checkBtn.addEventListener('click', () => {
    const base = parseInt(inputBase.value, 10);
    const height = parseInt(inputHeight.value, 10);
    const answer = parseInt(userAnswer.value, 10);
    resultMessage.classList.remove('hidden', 'success', 'fail');

    if (isNaN(base) || isNaN(height) || isNaN(answer)) {
        resultMessage.innerText = "😅 底辺・高さ・面積、すべてのマスに数字を入れてね。";
        resultMessage.classList.add('fail');
        return;
    }

    if (base !== currentBase || height !== currentHeight) {
        resultMessage.innerText = "😢 式に入れる「底辺」と「高さ」の数字をもう一度確認してみよう。";
        resultMessage.classList.add('fail');
        return;
    }

    if (answer === correctAnswer) {
        resultMessage.innerText = `🎉 正解！長方形の「縦×横」は、平行四辺形の「高さ×底辺」と同じ！だから『底辺×高さ』で面積が求められるんだね！`;
        resultMessage.classList.add('success');
        nextBtn.classList.remove('hidden');
        checkBtn.disabled = true;
    } else {
        resultMessage.innerText = "😢 底辺・高さはOK！かけ算をもう一度確認してみよう。";
        resultMessage.classList.add('fail');
    }
});

nextBtn.addEventListener('click', generateNewQuestion);
generateNewQuestion();