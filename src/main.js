'use strict';
import PopUp from './popup.js';

const CARROT_SIZE=80;
const CARROT_COUNT=10;
const BUG_COUNT=5;
const GAME_DURATION_SEC=10;

const field=document.querySelector('.game__field');
const fieldRect=field.getBoundingClientRect();
const gameBtn=document.querySelector('.game__button');
const gameTimer=document.querySelector('.game__timer');
const gameScore=document.querySelector('.game__score');

const carrotSound=new Audio('sound/carrot_pull.mp3');
const bugSound=new Audio('sound/bug_pull.mp3');
const alertSound=new Audio('sound/alert.wav');
const winSound=new Audio('sound/game_win.mp3');
const bgSound=new Audio('sound/bg.mp3');

let started=false;
let score=0;
let timer=undefined; //🌟🌟🌟

const gameFinishBanner=new PopUp();
gameFinishBanner.setClickListener(()=>{
    startGame();
});
field.addEventListener('click',onFieldClick);
gameBtn.addEventListener('click',()=>{
    if(started){
        stopGame();
    }else{
        startGame();
    }
});
field.addEventListener('click',onFieldClick);
function onFieldClick(event){
    if(!started){
        return;
    }
    const target=event.target;
    if(target.matches('.carrot')){
        //당근!!
        target.remove();
        score++;
        playSound(carrotSound);
        updateScoreBoard();
        if(score===CARROT_COUNT){
            finishGame(true);
        }
    }else if(target.matches('.bug')){
        //벌레!!
        playSound(bugSound);
        finishGame(false);
    }
}
function playSound(sound){
    sound.play();   
}
function stopSound(sound){
    sound.currentTime=0;
    sound.pause();
}

function updateScoreBoard(){
    gameScore.textContent=CARROT_COUNT-score;
}
function finishGame(win){
    started=false;
    hideGameBtn();
    stopGameTimer();
    playSound(win?winSound:bugSound);
    gameFinishBanner.showWithText(win?'YOU WON🎉':'YOU LOST💥');
}

function startGame(){
    started=true;
    score=0;
    playSound(bgSound);
    initGame();
    showStopBtn();
    showTimerAndScore();
    startGameTimer();
}

function stopGame(){
    started=false;
    playSound(alertSound);
    hideGameBtn();
    stopGameTimer();
    gameFinishBanner.showWithText('Replay❓');
}

function startGameTimer(){
    let remainingTimeSec=GAME_DURATION_SEC;
    updateTimerText(remainingTimeSec);
    timer=setInterval(() => {
        if(remainingTimeSec<=0){
            clearInterval(timer);
            finishGame(CARROT_COUNT===score);
            return;
        }else{
            updateTimerText(--remainingTimeSec);
        }
    }, 1000);
}
function stopGameTimer(){
    clearInterval(timer);
    stopSound(bgSound);
}
function updateTimerText(time){
    let minutes=Math.floor(time/60);
    let seconds=time%60;
    gameTimer.textContent=`${minutes}:${seconds}`;
}
function showTimerAndScore(){
    gameTimer.style.visibility='visible';
    gameScore.style.visibility='visible';
}

function showStopBtn(){
    const icon=gameBtn.querySelector('.fas');
    icon.classList.add('fa-stop');
    icon.classList.remove('fa-play');
    gameBtn.style.visibility='visible';
}
function hideGameBtn(){
    gameBtn.style.visibility='hidden';
}
function initGame(){
    //당근과 벌레를 생성해서 랜덤으로 추가한다
    field.innerHTML='';
    gameScore.innerHTML=CARROT_COUNT;
    addItem('bug',BUG_COUNT,'img/bug.png');
    addItem('carrot',CARROT_COUNT,'img/carrot.png');
}

function addItem(className, count, imgPath){
    const x1=0;
    const y1=0;
    const x2=fieldRect.width-CARROT_SIZE;
    const y2=fieldRect.height-CARROT_SIZE;
    for(let i=0;i<count;i++){
        const item=document.createElement('img');
        item.setAttribute('class',className);
        item.setAttribute('src',imgPath);
        item.style.position='absolute';
        const x=randomNumber(x1,x2);
        const y=randomNumber(y1,y2);
        item.style.left=`${x}px`;
        item.style.top=`${y}px`;
        field.appendChild(item);
    }
}
function randomNumber(min,max){
    return Math.random()*(max-min)+min;
}