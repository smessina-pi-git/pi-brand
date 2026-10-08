(function(){
'use strict';
var CATS={tools:'Tools',videos:'Videos',skills:'Skills'};
var DL='<svg viewBox="0 0 16 16"><path d="M7 1h2v7.6l2.3-2.3 1.4 1.4L8 12.4 3.3 7.7l1.4-1.4L7 8.6zM2 13h12v2H2z"/></svg>';
var OPEN='<svg viewBox="0 0 16 16"><path d="M9 2h5v5h-2V5.4L7.7 9.7 6.3 8.3l4.3-4.3H9zM2 4h4v2H4v6h6v-2h2v4H2z"/></svg>';
var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;

function el(tag,cls,html){var e=document.createElement(tag);if(cls)e.className=cls;if(html!=null)e.innerHTML=html;return e;}
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}
function url(p){return encodeURI(p);}
function fmt(d){return new Date(d+'T12:00:00').toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'});}

function card(p){
  var c=el('article','card');
  var m=el('div','media');
  if(p.video){
    var v=document.createElement('video');
    v.muted=true;v.loop=true;v.playsInline=true;v.preload='metadata';v.src=url(p.video)+'#t=0.5';v.setAttribute('aria-label',p.title+' preview');
    if(!reduce){c.addEventListener('mouseenter',function(){v.play().catch(function(){});});c.addEventListener('mouseleave',function(){v.pause();});}
    m.appendChild(v);
  }else if(p.cover){m.innerHTML='<img src="'+url(p.cover)+'" alt="" style="width:100%;height:100%;object-fit:cover">';}
  else m.appendChild(el('div','type',esc(p.title)));
  c.appendChild(m);
  var b=el('div','body');
  b.appendChild(el('p','mono',esc(CATS[p.category]||p.category)+' · '+fmt(p.date)));
  b.appendChild(el('h3',null,esc(p.title)));
  b.appendChild(el('p',null,esc(p.blurb)));
  var a=el('div','actions');
  if(p.launch){var L=el('a','btn primary',OPEN+esc(p.launchLabel||'Launch'));L.href=url(p.launch);L.target='_blank';L.rel='noopener';a.appendChild(L);}
  var dls=p.downloads||[];
  dls.slice(0,p.launch?1:2).forEach(function(d){var l=el('a','btn',DL+esc(d.label));l.href=url(d.file);l.setAttribute('download','');a.appendChild(l);});
  b.appendChild(a);
  var rest=dls.slice(p.launch?1:2);
  if(rest.length){
    var more=el('div','more');
    rest.forEach(function(d){var l=el('a','mono',esc(d.label)+' ↓');l.href=url(d.file);l.setAttribute('download','');more.appendChild(l);});
    b.appendChild(more);
  }
  c.appendChild(b);
  return c;
}

function render(data){
  var ps=data.projects.slice().sort(function(a,b){return a.date<b.date?1:-1;});
  document.getElementById('status').textContent='Updated '+fmt(data.updated)+' · '+ps.length+' projects';
  var feat=document.getElementById('featured');
  ps.filter(function(p){return p.featured;}).forEach(function(p){feat.appendChild(card(p));});
  var cats=Object.keys(CATS).filter(function(k){return ps.some(function(p){return p.category===k;});});
  var filters=document.getElementById('filters'),sections=document.getElementById('sections'),cur='all';
  function draw(){
    sections.innerHTML='';
    cats.forEach(function(k){
      if(cur!=='all'&&cur!==k)return;
      var list=ps.filter(function(p){return p.category===k&&(cur!=='all'||!p.featured);});
      if(!list.length)return;
      var s=el('section','group');s.appendChild(el('h2',null,CATS[k]));
      var g=el('div','grid');list.forEach(function(p){g.appendChild(card(p));});s.appendChild(g);sections.appendChild(s);
    });
    [].forEach.call(filters.children,function(c){c.setAttribute('aria-pressed',String(c.dataset.k===cur));});
  }
  ['all'].concat(cats).forEach(function(k){
    var c=el('button','chip',k==='all'?'All':CATS[k]);c.type='button';c.dataset.k=k;
    c.addEventListener('click',function(){cur=k;draw();});filters.appendChild(c);
  });
  draw();
}

// Haze: the v7 waiting-room glow, drawn once at low resolution and scaled by CSS. Purple core, blue fringe, dithered; edges stay true black.
function haze(){
  var cv=document.getElementById('glow'),W=640,H=400;cv.width=W;cv.height=H;
  var g=cv.getContext('2d'),img=g.createImageData(W,H),D=img.data,P=[80,0,168],B=[51,168,211],K=.55,cx=W*.5,cy=H*.28,RX=W*.62,RY=H*.62;
  for(var y=0;y<H;y++)for(var x=0;x<W;x++){
    var i=(y*W+x)*4,dx=(x+.5-cx)/RX,dy=(y+.5-cy)/RY,d=Math.sqrt(dx*dx+dy*dy);D[i+3]=255;if(d>=1)continue;
    var f=Math.pow(1-d*d*(3-2*d),1.7)*K,mb=Math.min(1,d*d*(3-2*d)*1.6);
    for(var c=0;c<3;c++)D[i+c]=Math.max(0,Math.round((P[c]+(B[c]-P[c])*mb)*f+(Math.random()+Math.random()-1)));
  }
  g.putImageData(img,0,0);
  if(!reduce)cv.animate([{opacity:.85},{opacity:1},{opacity:.85}],{duration:9600,iterations:Infinity,easing:'ease-in-out'});
}

haze();
fetch('projects.json',{cache:'no-cache'}).then(function(r){if(!r.ok)throw new Error(r.status);return r.json();}).then(render)
 .catch(function(e){document.getElementById('status').textContent='Could not load projects ('+e.message+')';});
})();
