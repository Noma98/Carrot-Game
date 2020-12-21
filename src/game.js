'use strict';
import * as sound from './sound.js';
import {Field,ItemType} from './field.js';

export const Reason=Object.freeze({
    cancel:'cancel',
    next:'next',
    win:'win',
    lose:'lose'   
})
//Builder Pattern
export class GameBuilder{
    withGameDuration(duration){
        this.gameDuration=duration;
        return this;
    }
    withCarrotCount(num){
        this.carrotCount=num;
        return this;
    }
    withBugCount(num){
        this.bugCount=num;
        return this;
    }
    build(){
        return new Game(
            this.gameDuration,
            this.carrotCount,
            this.bugCount
        )
    }
}

class Game{
    constructor(gameDuration,carrotCount,bugCount){
        this.carrotCount=carrotCount;
        this.bugCount=bugCount;
        this.gameDuration=gameDuration;
        this.started=false;
        this.score=0;
        this.level=1;
        this.timer=undefined;
        this.ringing=undefined;

        this.gameBtn=document.querySelector('.game__button');
        this.gameTimerBox=document.querySelector('.game__timer-box');
        this.gameTimer=document.querySelector('.game__timer');
        this.gameScore=document.querySelector('.game__score');
        this.gameLevel=document.querySelector('.level');
        this.gameBtn.addEventListener('click',()=>{
            if(this.started){
                this.stop(Reason.cancel);
            }else{
                this.gameField.hideReadyScreen();
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
        this.clockRing();
        this.gameField.notClickable('auto');
        this.showLevel();
    }
    stop(reason){
        this.started=false;
        this.hideGameBtn();
        this.stopGameTimer();
        this.onGameStop&&this.onGameStop(reason);
        this.stopClockRing();
        this.gameField.notClickable('none');
    }
    onItemClick=(item)=>{
        if(!this.started){
            return;
        }
        if(item===ItemType.carrot){
            this.score++;
            this.updateScoreBoard();
            if(this.score===this.carrotCount){
                if(this.level!==3){
                    this.stop(Reason.next);
                    this.levelUp();
                    return;
                }
                this.stop(Reason.win);
                this.levelUp();
            }
        }else if(item===ItemType.bug){
            this.stop(Reason.lose);
        }
    }

    startGameTimer(){
        let remainingTimeSec=this.gameDuration;
        this.updateTimerText(remainingTimeSec);
        this.timer=setInterval(() => {
            if(remainingTimeSec<=0){
                clearInterval(this.timer);
                this.stop(this.carrotCount===this.score?Reason.win:Reason.lose);
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
    showLevel(){
        this.gameLevel.textContent=this.level;
    }
    levelUp(){
        this.level++;
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
        this.gameTimerBox.style.visibility='visible';
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
    clockRing(){
        const clock=document.querySelector('.clock');
        this.ringing=setInterval(() => {
                setTimeout(() => {
                clock.style.transform='rotate(-2deg)';
                }, 100);
                clock.style.transform='rotate(2deg)'; 
            }, 200);
    } 
    stopClockRing(){
        clearInterval(this.ringing);
    }
}