const game = document.getElementById("game");
const scoreEl = document.getElementById("score");
const roundEl = document.getElementById("round");
const ammoEl = document.getElementById("ammo");
const livesEl = document.getElementById("lives");
const statusEl = document.getElementById("status");

let score=0, round=1, ammo=3, lives=3;
let ducks=[], playing=false;
let dog;

function init(){
  dog=document.createElement("div");
  dog.id="dog";
  dog.textContent="🐶🔫";
  game.appendChild(dog);
  updateHUD();
  startRound();
}

function updateHUD(){
  scoreEl.textContent = score.toString().padStart(4,"0");
  roundEl.textContent = round;
  livesEl.textContent = "❤️".repeat(lives);
  ammoEl.textContent = "🔫".repeat(ammo);
}

function startRound(){
  ducks=[];
  ammo=3;
  updateHUD();
  statusEl.textContent="Раунд "+round+" — охота началась!";
  
  const num=Math.random()<0.5 ? 1:2;
  for(let i=0;i<num;i++){
    setTimeout(()=>spawnDuck(), i*1500);
  }
  playing=true;
}

function spawnDuck(){
  const duck=document.createElement("div");
  duck.classList.add("entity");
  duck.textContent="🦆";
  
  const dir=Math.random()<0.5 ? "r":"l";
  const y=Math.random() * (game.clientHeight - 200) + 60;
  let x,vx;
  if (dir==="r"){x=-50;vx=100+Math.random()*80}
  else {x=game.clientWidth;vx=-(100+Math.random()*80)}
  
  duck.style.top=y+"px";
  duck.style.left=x+"px";
  // зеркалим влево
  if(dir==="l"){
    duck.style.transform="scaleX(1)";
  } else {
    duck.style.transform="scaleX(-1)";
  }

  game.appendChild(duck);

  const obj={el:duck,x:x,y:y,vx:vx,dir:dir,dead:false};
  ducks.push(obj);
  moveDuck(obj);
}

function moveDuck(d){
  function step(){
    if(d.dead) return;
    d.x+=d.vx*0.02;
    d.el.style.left=d.x+"px";
    if(d.x<-60||d.x>game.clientWidth+20){
      d.dead=true;
      d.el.remove();
      missDuck();
    } else {
      setTimeout(step,20);
    }
  }
  step();
}

function missDuck(){
  lives--;
  dog.textContent="🐶😂";
  setTimeout(()=>dog.textContent="🐶🔫",1000);
  checkRoundEnd();
}

function clickDuck(e){
  if(!playing) return;
  if(ammo<=0) return;
  ammo--;
  updateHUD();

  const rect=game.getBoundingClientRect();
  const x=e.clientX-rect.left;
  const y=e.clientY-rect.top;

  ducks.forEach(d=>{
    if(!d.dead){
      const r=d.el.getBoundingClientRect();
      if(x>=r.left-rect.left && x<=r.right-rect.left && y>=r.top-rect.top && y<=r.bottom-rect.top){
        d.dead=true;
        d.el.remove();
        score+=10;
        dog.textContent="🐶👍🏻";
        setTimeout(()=>dog.textContent="🐶🔫",1000);
      }
    }
  });

  checkRoundEnd();
}

function checkRoundEnd(){
  if(ducks.every(d=>d.dead)){
    playing=false;
    if(lives<=0){
      statusEl.textContent="💀 Ты проиграл! Итоговый счёт: "+score;
      game.removeEventListener("click",clickDuck);
      return;
    }
    round++;
    setTimeout(()=>startRound(),2000);
  }
}

// Управление выстрелами
game.addEventListener("click",clickDuck);

init();