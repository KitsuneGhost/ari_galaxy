(() => {
'use strict';
const $ = s => document.querySelector(s);
const gift = window.GIFT;
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
let revealed = false;
let galaxyActive = false;
let animation = 0;
let lastTime = 0;
let rotation = 0;
let layout = [];
const canvas = $('#words');
const ctx = canvas.getContext('2d');
let width = 0, height = 0;
$('#invitation-title').replaceChildren(document.createTextNode('A little something'),document.createElement('br'));
const greeting = document.createElement('em'); greeting.textContent = `for you, ${gift.name}.`; $('#invitation-title').append(greeting);
$('#letter-title').textContent = `My dearest ${gift.name},`;
$('.reveal-name').textContent = `${gift.name},`;
$('#reveal-title').textContent = gift.revealTitle;
$('#reveal-copy').textContent = gift.revealText;
$('#signature').textContent = gift.signature;
for (const text of gift.letter.split(/\n\s*\n/)) {const p = document.createElement('p');p.textContent=text;$('#letter-body').append(p);}
for (const phrase of gift.phrases) {const li=document.createElement('li');li.textContent=phrase;$('#accessible-phrases').append(li);}
function openLetter(){
  $('#letter').showModal(); $('#letter').scrollTop=0;
  // Keep the complete letter in view initially instead of scrolling to the bottom button.
  $('#letter').focus({preventScroll:true}); pause();
}
$('#open-envelope').addEventListener('click',openLetter);
$('#open-letter').addEventListener('click',openLetter);
$('#reread').addEventListener('click',openLetter);
function revealGalaxy(){
  if(!revealed){revealed=true;$('#invitation').hidden=true;$('#galaxy').hidden=false;document.body.dataset.scene='galaxy';galaxyActive=true;resize();$('#center').focus({preventScroll:true});}
  resume();
}
$('#close-letter').addEventListener('click',()=>$('#letter').close());
$('#letter').addEventListener('close',revealGalaxy);
$('#center').addEventListener('click',()=>{pause();$('#reveal').showModal();});
$('#close-reveal').addEventListener('click',()=>$('#reveal').close());
$('#back-to-stars').addEventListener('click',()=>$('#reveal').close());
$('#reveal').addEventListener('close',()=>{resume();$('#center').focus({preventScroll:true});});
function pause(){cancelAnimationFrame(animation);animation=0;lastTime=0;}
function resume(){if(!galaxyActive||document.hidden||$('#letter').open||$('#reveal').open)return;pause();if(reduceMotion.matches){draw();return}animation=requestAnimationFrame(frame);}
// Four spiral arms, each physically formed from many tiny words.
// Rotate in the galaxy plane, then tilt the disk to give it depth.
function resize(){
  const rect=canvas.getBoundingClientRect();width=rect.width;height=rect.height;if(!width||!height)return;
  const dpr=Math.min(devicePixelRatio||1,2);canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);
  const mobile=width<600;
  const count=mobile?180:300;
  let seed=2718;const rand=()=>{seed=seed*16807%2147483647;return(seed-1)/2147483646};
  layout=Array.from({length:count},(_,i)=>{
    const arm=i%4;const t=(Math.floor(i/4)+1)/(Math.ceil(count/4)+1);
    return {radius:.17+Math.pow(t,.82)*.81,theta:arm*Math.PI/2+t*5.6+(rand()-.5)*.32,size:(mobile?6.2:7.2)+rand()*4.4,text:gift.phrases[i%gift.phrases.length],tint:rand(),alpha:.42+rand()*.5};
  });
  draw();
}
function draw(){
  if(!width||!height)return;ctx.clearRect(0,0,width,height);
  const cx=width/2,cy=height/2;
  const spread=Math.min(width*.44,height*.83,620);
  const glow=ctx.createRadialGradient(cx,cy,4,cx,cy,spread*.85);glow.addColorStop(0,'rgba(249,185,221,.13)');glow.addColorStop(.35,'rgba(162,89,200,.055)');glow.addColorStop(1,'rgba(80,30,120,0)');ctx.fillStyle=glow;ctx.fillRect(0,0,width,height);
  const points=layout.map(p=>{
    const a=p.theta+rotation,x=Math.cos(a)*p.radius*spread,y=Math.sin(a)*p.radius*spread;
    // Project an inclined disk onto the screen, with its major axis slightly diagonal.
    const tilt=.56,slant=-.18;
    return {...p,x:cx+x*Math.cos(slant)-y*tilt*Math.sin(slant),y:cy+x*Math.sin(slant)+y*tilt*Math.cos(slant),depth:Math.sin(a)};
  }).sort((a,b)=>a.depth-b.depth);
  ctx.textAlign='center';ctx.textBaseline='middle';
  for(const p of points){
    if(Math.hypot(p.x-cx,p.y-cy)<62)continue;
    const depth=.85+(p.depth+1)*.1;
    ctx.font=`${(p.size*depth).toFixed(1)}px Georgia, serif`;
    ctx.fillStyle=p.tint>.64?`rgba(228,190,255,${p.alpha})`:`rgba(255,205,224,${p.alpha})`;
    ctx.shadowBlur=p.size>10?5:2;ctx.shadowColor=p.tint>.64?'#ac68e8':'#ef96be';
    ctx.fillText(p.text,p.x,p.y);
  }
  ctx.shadowBlur=0;
}
function frame(time){if(lastTime)rotation+=Math.min(time-lastTime,50)*.000018;lastTime=time;draw();animation=requestAnimationFrame(frame);}
function background(){
  const bg=$('#space'), c=bg.getContext('2d'),dpr=Math.min(devicePixelRatio||1,2),w=innerWidth,h=innerHeight;
  bg.width=w*dpr;bg.height=h*dpr;c.setTransform(dpr,0,0,dpr,0,0);
  let seed=42;const rand=()=>{seed=seed*16807%2147483647;return(seed-1)/2147483646};
  for(let i=0;i<Math.min(w*h/3500,480);i++){c.beginPath();c.arc(rand()*w,rand()*h,rand()*.85+.12,0,Math.PI*2);c.fillStyle=`rgba(230,211,248,${rand()*.46+.09})`;c.fill();}
}
window.addEventListener('resize',()=>{background();if(galaxyActive)resize();});
document.addEventListener('visibilitychange',()=>document.hidden?pause():resume());
reduceMotion.addEventListener('change',()=>{pause();resume();});
background();
if(document.fonts)document.fonts.ready.then(()=>{if(galaxyActive)draw();});
})();
