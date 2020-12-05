'use strict';
import * as sound from './sound.js';
import Field from './field.js';

export default class Game{
    constructor(carrotCount,bugCount,gameDuration){
        this.carrotCount=carrotCount;
        this.bugCount=bugCount;
        this.gameDuration=gameDuration;
        this.started=false;
        this.score=0;
        this.timer=undefined;

        this.gameBtn=document.querySelector('.game__button');
        this.gameTimer=document.querySelector('.game__timer');
        this.gameScore=document.querySelector('.game__score');
        this.gameBtn.addEventListener('click',()=>{
            if(this.started){
                this.stop();
            }else{
                this.start();
            }
        });
        this.gameField=new Field(this.carrotCount,this.bugCount);
        this.gameField.setClickListener(this.onItemClick);
    }
    setGameStopListener(onGameStop){
        this.onGameStop=onGameStop;
    }
    start(){
        this.started=true;
        this.score=0;
        sound.playbg();
        this.initGame();
        this.showStopBtn();
        this.showTimerAndScore();
        this.startGameTimer();
    }
    stop(){
        this.started=false;
        sound.playAlert();
        this.hideGameBtn();
        this.stopGameTimer();
        this.onGameStop&&this.onGameStop('cancel');
    }
    finish(win){
        this.started=false;
        this.hideGameBtn();
        this.stopGameTimer();
        win?sound.playWin():sound.playBug();
        this.onGameStop&&this.onGameStop(win?'win':'lose');
    }
    onItemClick=(item)=>{
        if(!this.started){
            return;
        }
        if(item==='carrot'){
            this.score++;
            this.updateScoreBoard();
            if(this.score===this.carrotCount){
                this.finish(true);
            }
        }else if(item==='bug'){
            this.finish(false);
        }
    }

    startGameTimer(){
        let remainingTimeSec=this.gameDuration;
        this.updateTimerText(remainingTimeSec);
        this.timer=setInterval(() => {
            if(remainingTimeSec<=0){
                clearInterval(this.timer);
                this.finish(this.carrotCount===this.score);
                return;
            }else{
                this.updateTimerText(--remainingTimeSec);
            }
        }, 1000);
    }
    stopGameTimer(){
        clearInterval(this.timer);
        sound.stopbg();
    }

    updateTimerText(time){
        let minutes=Math.floor(time/60);
        let seconds=time%60;
        this.gameTimer.textContent=`${minutes}:${seconds}`;
    }
    updateScoreBoard(){
        this.gameScore.textContent=this.carrotCount-this.score;
    }

    showTimerAndScore(){
        this.gameTimer.style.visibility='visible';
        this.gameScore.style.visibility='visible';
    }
    showStopBtn(){
        const icon=this.gameBtn.querySelector('.fas');
        icon.classList.add('fa-stop');
        icon.classList.remove('fa-play');
        this.gameBtn.style.visibility='visible';
    }
    hideGameBtn(){
        this.gameBtn.style.visibility='hidden';
    }

    initGame(){
        this.score=0;
        this.gameScore.textContent=this.carrotCount;
        this.gameField.init();
    }



}