'use strict';

const CARROT_SIZE=80;
const CARROT_COUNT=10;
const BUG_COUNT=5;
const GAME_DURATION_SEC=10;

const field=document.querySelector('.game__field');
const fieldRect=field.getBoundingClientRect();
const gameBtn=document.querySelector('.game__button');
const gameTimer=document.querySelector('.game__timer');
const gameScore=document.querySelector('.game__score');

let started=false;
let score=0;
let timer=undefined; //🌟🌟🌟

gameBtn.addEventListener('click',()=>{
    if(started){
        stopGame();
    }else{
        startGame();
    }
    started=!started;
});

function startGame(){
    initGame();
    showStopBtn();
    showTimerAndScore();
    startGameTimer();
}
// function stopGame(){
//     hidePlayBtn();
//     stopGameTimer();
// }
// function hidePlayBtn(){
    
// }
// function stopTimer(){

// }
function startGameTimer(){
    let remainingTimeSec=GAME_DURATION_SEC;
    updateTimerText(remainingTimeSec);
    timer=setInterval(() => {
        if(remainingTimeSec<=0){
            clearInterval(timer);
        
            return;
        }else{
            updateTimerText(--remainingTimeSec);
        }
    }, 1000);
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
    const icon=gameBtn.querySelector('.fa-play');
    icon.classList.add('fa-stop');
    icon.classList.remove('fa-play');
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