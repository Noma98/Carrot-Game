'use strict';
const AVERAGE_SIZE=80;
const BOSS_SIZE=230;
import * as sound from './sound.js';
export const ItemType=Object.freeze({
    carrot:'carrot',
    bug:'bug',
    rabbit:'rabbit',
    boss:'boss'
})

export class Field{
    constructor(carrotCount,bugCount,rabbitCount,bossCount){
        this.carrotCount=carrotCount;
        this.bugCount=bugCount;
        this.rabbitCount=rabbitCount;
        this.bossCount=bossCount;

        this.field=document.querySelector('.game__field');
        this.fieldRect=this.field.getBoundingClientRect();
        this.field.addEventListener('click',this.onClick);
    }
    setClickListener(onItemClick){
        this.onItemClick=onItemClick;
    }
    init(level){
        this.field.innerHTML='';
        if(level===3){
            this._addItem(ItemType.boss,this.bossCount,'img/boss.png',BOSS_SIZE,'div');
            return;
        }
        this._addItem(ItemType.bug,this.bugCount,'img/bug.png');
        this._addItem(ItemType.carrot,this.carrotCount,'img/carrot.png');
        if(level===2){
            this._addItem(ItemType.rabbit,this.rabbitCount,'img/rabbit.png');
        }
    }
    _addItem(className, count, imgPath,imgSize=AVERAGE_SIZE,toCreate='img'){
        const x1=0;
        const y1=0;
        const x2=this.fieldRect.width-imgSize;
        const y2=this.fieldRect.height-imgSize;
        for(let i=0;i<count;i++){
            const item=document.createElement(toCreate);
            item.setAttribute('class',className);
            item.style.position='absolute';
            const x=randomNumber(x1,x2);
            const y=randomNumber(y1,y2);
            item.style.left=`${x}px`;
            item.style.top=`${y}px`;
            if(className==='boss'){
                item.innerHTML=`
                <img src='img/boss.png' class="boss__img" alt="boss">
                <div class="boss__blood-box">
                    <div class="boss__remained-blood" data-blood=100></div>
                </div>
                `;
            }else{
                item.setAttribute('src',imgPath);
            }
            this.field.appendChild(item);
        }
    }
    onClick=(event)=>{
        const target=event.target;
        if(target.matches('.carrot')){
            target.remove();
            sound.playCarrot();
            this.onItemClick&&this.onItemClick(true);
        }else if(target.matches('.bug')||target.matches('.rabbit')){
            this.onItemClick&&this.onItemClick(false);
        }else if(target.matches('.boss__img')){
            sound.playHit();
            const targetBlood=target.nextSibling.nextSibling.childNodes[1];
            let blood=targetBlood.dataset["blood"];
            blood-=10;
            targetBlood.dataset["blood"]=blood;
            targetBlood.style.width=`${blood}%`;
        }
    }
    notClickable(property){
        this.field.style.pointerEvents=property;
    }
    hideReadyScreen(){
        const readyScreen=document.querySelector('.game--ready');
        readyScreen.classList.add('hide');
    }
}

function randomNumber(min,max){
    return Math.random()*(max-min)+min;
}


