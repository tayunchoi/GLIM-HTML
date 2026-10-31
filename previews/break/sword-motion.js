/* Rising sword cut: original bear poses, canvas-native trails, one attack clock. */
(() => {
  'use strict';
  const clamp = (x,a=0,b=1) => Math.max(a,Math.min(b,x));
  const mix = (a,b,t) => a+(b-a)*t;
  const smooth = x => {x=clamp(x);return x*x*(3-2*x);};
  const timing = Object.freeze({windup:.26,release:.43,impact:.75,end:1.16});
  const blue='#91c5ee', light='#f8fcff', gold='#f7dfa0';

  function poseWeights(age) {
    // Pose 2 is a forward thrust. This cut uses the original lowered, crossing,
    // raised and settling drawings instead, without replacing any source pixels.
    const points=[[0,0],[.045,7],[.305,4],[.378,6],[.77,1],[.98,0]];
    let k=0;while(k+1<points.length&&age>=points[k+1][0])k++;
    if(!k)return [[points[k][1],1]];
    const u=smooth((age-points[k][0])/(k===2?.035:.055));
    return u>=1?[[points[k][1],1]]:[[points[k-1][1],1-u],[points[k][1],u]];
  }
  function pose(age,options={},base={}) {
    const prep=smooth(age/timing.windup);
    const sweep=smooth((age-timing.windup)/(timing.release-timing.windup));
    const recover=smooth((age-.76)/(.40));
    const active=1-recover;
    const reduced=!!options.reducedMotion||options.animated===false;
    const facing=options.facing===-1?-1:1;
    return {...base,weights:poseWeights(age),kind:'attack',age,
      release:timing.release,duration:timing.end,artFacing:-facing,
      // Plant and lower the hips, transfer weight into the rising cut, settle.
      dx:reduced?0:mix(.022*prep,-.042,sweep)*active,
      dy:reduced?0:mix(.042*prep,-.012,sweep)*active,
      rot:reduced?0:mix(.044*prep,-.062,sweep)*active,
      arm:reduced?0:mix(.022,-.034,sweep)*active,
      gait:0,cloth:reduced?0:-.013*Math.sin(sweep*Math.PI)*active};
  }
  function path(start,end,progress) {
    const t=clamp(progress),v=.20*t+.80*t*t;
    const dx=end.x-start.x,dy=end.y-start.y;
    const bend=Math.min(33,Math.hypot(dx,dy)*.12);
    const cx=(start.x+end.x)*.5,cy=(start.y+end.y)*.5-bend;
    return {x:(1-v)*(1-v)*start.x+2*(1-v)*v*cx+v*v*end.x,
      y:(1-v)*(1-v)*start.y+2*(1-v)*v*cy+v*v*end.y};
  }
  function ribbon(g,cx,cy,r,from,to,width,fill,alpha=1) {
    const n=22;g.save();g.globalAlpha*=alpha;g.beginPath();
    for(let i=0;i<=n;i++){
      const u=i/n,a=mix(from,to,u),w=width*Math.sin(u*Math.PI*.72+.12);
      const x=cx+Math.cos(a)*(r+w*.5),y=cy+Math.sin(a)*(r+w*.5);
      i?g.lineTo(x,y):g.moveTo(x,y);
    }
    for(let i=n;i>=0;i--){
      const u=i/n,a=mix(from,to,u),w=width*Math.sin(u*Math.PI*.72+.12);
      g.lineTo(cx+Math.cos(a)*(r-w*.5),cy+Math.sin(a)*(r-w*.5));
    }
    g.closePath();g.fillStyle=fill;g.fill();g.restore();
  }
  function drawSwing(g,actor) {
    const age=actor.age;
    if(age<timing.windup||age>timing.release+.14)return;
    const q=clamp((age-timing.windup)/(timing.release-timing.windup));
    const fade=age<=timing.release?1:1-(age-timing.release)/.14;
    const m=pose(age,{facing:actor.facing,reducedMotion:actor.reduced});
    const h=actor.height,lead=mix(.64,-2.14,smooth(q));
    const tail=mix(.64,-2.14,smooth(Math.max(0,q-.56)));
    if(Math.abs(lead-tail)<.02)return;
    g.save();g.translate(actor.x+m.dx*h*m.artFacing,actor.y+m.dy*h);
    g.scale(m.artFacing,1);g.rotate(m.rot);
    const radius=mix(.52,.62,q)*h;
    ribbon(g,.02*h,-.40*h,radius,tail,lead,.105*h,blue,.68*fade);
    ribbon(g,.02*h,-.40*h,radius+.012*h,tail,lead,.040*h,light,.95*fade);
    ribbon(g,.02*h,-.40*h,radius+.035*h,mix(tail,lead,.22),lead,.012*h,gold,.95*fade);
    g.restore();
  }
  function crescent(g,x,y,r,angle,alpha=1) {
    g.save();g.globalAlpha*=alpha;g.translate(x,y);g.rotate(angle);
    g.beginPath();g.moveTo(-r*.25,-r);
    g.quadraticCurveTo(r*.95,0,-r*.25,r);
    g.quadraticCurveTo(r*.38,0,-r*.25,-r);
    g.fillStyle=blue;g.fill();
    g.beginPath();g.moveTo(-r*.25,-r);g.quadraticCurveTo(r*.95,0,-r*.25,r);
    g.strokeStyle=light;g.lineWidth=3;g.lineCap='round';g.stroke();
    g.beginPath();g.moveTo(-r*.18,-r*.87);g.quadraticCurveTo(r*.66,0,-r*.18,r*.87);
    g.strokeStyle=gold;g.lineWidth=1.5;g.stroke();g.restore();
  }
  function drawProjectile(g,p,height) {
    if(!p.released||p.done)return;
    const end={x:p.target.x,y:p.target.y};
    const u=clamp((p.t-p.release)/(p.duration-p.release));
    const start={x:p.sx,y:p.sy},point=path(start,end,u),prev=path(start,end,Math.max(0,u-.02));
    const angle=Math.atan2(point.y-prev.y,point.x-prev.x||.001);
    // The visible wave samples exactly the same curve as the colliding projectile.
    for(let i=3;i>0;i--){const v=u-i*.085;if(v<0)continue;
      const tail=path(start,end,v);crescent(g,tail.x,tail.y,height*(.105+.075*v),angle,(4-i)*.065);
    }
    crescent(g,point.x,point.y,height*(.12+.075*u),angle,1);
  }
  function drawImpact(g,impact) {
    const q=clamp(impact.age/impact.duration),h=impact.height;
    const fade=1-q;
    g.save();g.translate(impact.x,impact.y);g.rotate(impact.angle);
    g.globalAlpha*=fade;
    // One directional cut and a brief contact flash, followed by small sparks.
    const span=h*(.27+.10*q),length=h*(.30+.14*q);
    g.beginPath();g.moveTo(-span,-length*.65);
    g.quadraticCurveTo(-span*.12,-length*.10,span,length*.65);
    g.strokeStyle=blue;g.lineWidth=h*.063*fade+1;g.lineCap='round';g.stroke();
    g.strokeStyle=light;g.lineWidth=h*.027*fade+1;g.stroke();
    if(q<.28){
      const r=h*(.15-.10*q);g.beginPath();
      for(let i=0;i<8;i++){const a=i*Math.PI/4,rr=i%2?r*.24:r;
        const x=Math.cos(a)*rr,y=Math.sin(a)*rr;i?g.lineTo(x,y):g.moveTo(x,y);}
      g.closePath();g.fillStyle=gold;g.fill();
    }
    for(let i=0;i<7;i++){
      const a=i*Math.PI*2/7+.25,dist=h*(.09+q*.29),r=h*.023*(1-q);
      const x=Math.cos(a)*dist,y=Math.sin(a)*dist;
      g.strokeStyle=i%2?gold:blue;g.lineWidth=Math.max(1.3,r*.8);
      g.beginPath();g.moveTo(x,y);g.lineTo(x+Math.cos(a)*r*2,y+Math.sin(a)*r*2);g.stroke();
    }
    g.restore();
  }
  window.GlimSwordMotion=Object.freeze({version:'rising-cut-v3',timing,pose,path,drawSwing,drawProjectile,drawImpact});
})();
