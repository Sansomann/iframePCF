const fs = require('fs');
const path = require('path');

// Color palettes
const colors = {
  slate: { 50:'#f8fafc',100:'#f1f5f9',200:'#e2e8f0',300:'#cbd5e1',400:'#94a3b8',500:'#64748b',600:'#475569',700:'#334155',800:'#1e293b',900:'#0f172a' },
  white: { DEFAULT:'#ffffff' },
  black: { DEFAULT:'#000000' },
  red:   { 50:'#fef2f2',100:'#fee2e2',200:'#fecaca',300:'#fca5a5',400:'#f87171',500:'#ef4444',600:'#dc2626',700:'#b91c1c' },
  amber: { 50:'#fffbeb',100:'#fef3c7',200:'#fde68a',300:'#fcd34d',400:'#fbbf24',500:'#f59e0b',600:'#d97706',700:'#b45309',800:'#92400e',900:'#78350f' },
  yellow:{ 400:'#facc15' },
  green: { 400:'#4ade80',500:'#22c55e' },
  emerald:{ 50:'#ecfdf5',100:'#d1fae5',200:'#a7f3d0',400:'#34d399',500:'#10b981',600:'#059669',700:'#047857' },
  teal:  { 50:'#f0fdfa',100:'#ccfbf1',600:'#0d9488',700:'#0f766e' },
  blue:  { 50:'#eff6ff',100:'#dbeafe',200:'#bfdbfe',400:'#60a5fa',500:'#3b82f6',600:'#2563eb',700:'#1d4ed8' },
  purple:{ 50:'#faf5ff',100:'#f3e8ff',400:'#c084fc',500:'#a855f7',600:'#9333ea',700:'#7e22ce' },
  primary:{ 50:'#e8f0fa',100:'#c5d8f0',200:'#9dbde4',300:'#74a0d6',400:'#4f88cb',500:'#2e6fbf',600:'#1e5399',700:'#153d73',800:'#0f2847',900:'#091a30' },
  accent: { 50:'#fffbeb',100:'#fef3c7',200:'#fde68a',300:'#fcd34d',400:'#fbbf24',500:'#f59e0b',600:'#d97706',700:'#b45309' },
};

const sp = { 0:'0px','0.5':'2px',1:'4px','1.5':'6px',2:'8px','2.5':'10px',3:'12px','3.5':'14px',4:'16px',5:'20px',6:'24px',7:'28px',8:'32px',9:'36px',10:'40px',11:'44px',12:'48px',14:'56px',16:'64px',20:'80px',24:'96px',28:'112px',32:'128px',36:'144px',40:'160px',44:'176px',48:'192px',52:'208px',56:'224px',60:'240px',64:'256px',72:'288px',80:'320px',96:'384px' };

let css = `
/* ─── Base ─────────────────────────────────────────────── */
*, ::before, ::after { box-sizing: border-box; border: 0 solid #e2e8f0; }
html { scroll-behavior: smooth; line-height: 1.5; -webkit-text-size-adjust: 100%; }
body { margin: 0; }
a { color: inherit; text-decoration: inherit; }
button { cursor: pointer; background-color: transparent; background-image: none; border: 0; padding: 0; }
input, select, textarea { font: inherit; color: inherit; background: transparent; border: 1px solid #e2e8f0; outline: 0; }
textarea { resize: vertical; }
select { appearance: none; }
svg { display: block; vertical-align: middle; }
img { display: block; max-width: 100%; }
hr { border-top-color: #e2e8f0; }
.antialiased { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
.hero-gradient { background: linear-gradient(135deg, #0f2847 0%, #153d73 50%, #1e5399 100%); }
.card-gradient  { background: linear-gradient(135deg, #0f2847 0%, #153d73 60%, #1e5399 100%); }
`;

// Display
css += `
.block{display:block}.inline-block{display:inline-block}.inline{display:inline}.flex{display:flex}.inline-flex{display:inline-flex}.grid{display:grid}.hidden{display:none}.table{display:table}
`;

// Flex
css += `
.flex-1{flex:1 1 0%}.flex-auto{flex:1 1 auto}.flex-none{flex:none}.flex-grow{flex-grow:1}.flex-shrink-0,.shrink-0{flex-shrink:0}
.flex-row{flex-direction:row}.flex-col{flex-direction:column}.flex-wrap{flex-wrap:wrap}.flex-nowrap{flex-wrap:nowrap}
.items-start{align-items:flex-start}.items-center{align-items:center}.items-end{align-items:flex-end}.items-stretch{align-items:stretch}
.justify-start{justify-content:flex-start}.justify-center{justify-content:center}.justify-end{justify-content:flex-end}.justify-between{justify-content:space-between}
.self-start{align-self:flex-start}.self-center{align-self:center}
.flex-2{flex:2 1 0%}
`;

// Grid
css += `
.grid-cols-1{grid-template-columns:repeat(1,minmax(0,1fr))}.grid-cols-2{grid-template-columns:repeat(2,minmax(0,1fr))}.grid-cols-3{grid-template-columns:repeat(3,minmax(0,1fr))}.grid-cols-4{grid-template-columns:repeat(4,minmax(0,1fr))}.grid-cols-5{grid-template-columns:repeat(5,minmax(0,1fr))}.grid-cols-6{grid-template-columns:repeat(6,minmax(0,1fr))}.grid-cols-7{grid-template-columns:repeat(7,minmax(0,1fr))}
.col-span-1{grid-column:span 1/span 1}.col-span-2{grid-column:span 2/span 2}.col-span-3{grid-column:span 3/span 3}
`;

// Gaps
for (const [k,v] of Object.entries(sp)) {
  css += `.gap-${k.replace('.','\\.')}{gap:${v}}`;
  css += `.gap-x-${k.replace('.','\\.')}{column-gap:${v}}`;
  css += `.gap-y-${k.replace('.','\\.')}{row-gap:${v}}`;
}

// Spacing
const sides = { '':['margin','top','right','bottom','left'], 't':['margin','top'], 'r':['margin','right'], 'b':['margin','bottom'], 'l':['margin','left'], 'x':['margin','x'], 'y':['margin','y'] };
for (const [k,v] of Object.entries(sp)) {
  const kk = k.replace('.','\\.');
  css += `.p-${kk}{padding:${v}}`;
  css += `.pt-${kk}{padding-top:${v}}`;
  css += `.pr-${kk}{padding-right:${v}}`;
  css += `.pb-${kk}{padding-bottom:${v}}`;
  css += `.pl-${kk}{padding-left:${v}}`;
  css += `.px-${kk}{padding-left:${v};padding-right:${v}}`;
  css += `.py-${kk}{padding-top:${v};padding-bottom:${v}}`;
  css += `.m-${kk}{margin:${v}}`;
  css += `.mt-${kk}{margin-top:${v}}`;
  css += `.mr-${kk}{margin-right:${v}}`;
  css += `.mb-${kk}{margin-bottom:${v}}`;
  css += `.ml-${kk}{margin-left:${v}}`;
  css += `.mx-${kk}{margin-left:${v};margin-right:${v}}`;
  css += `.my-${kk}{margin-top:${v};margin-bottom:${v}}`;
}
css += `.-mt-8{margin-top:-32px}.-mx-1{margin-left:-4px;margin-right:-4px}.-ml-2{margin-left:-8px}`;
css += `.space-y-1>*+*{margin-top:4px}.space-y-2>*+*{margin-top:8px}.space-y-2\\.5>*+*{margin-top:10px}.space-y-3>*+*{margin-top:12px}.space-y-4>*+*{margin-top:16px}.space-y-5>*+*{margin-top:20px}`;
css += `.space-x-2>*+*{margin-left:8px}.space-x-3>*+*{margin-left:12px}.space-x-4>*+*{margin-left:16px}`;

// Typography sizes
const fontSizes = { xs:['12px','16px'],sm:['14px','20px'],base:['16px','24px'],lg:['18px','28px'],xl:['20px','28px'],'2xl':['24px','32px'],'3xl':['30px','36px'],'4xl':['36px','40px'],'5xl':['48px','1'],'6xl':['60px','1'] };
for (const [k,[fs,lh]] of Object.entries(fontSizes)) {
  css += `.text-${k}{font-size:${fs};line-height:${lh}}`;
}
css += `.text-\\[9px\\]{font-size:9px;line-height:1.5}.text-\\[10px\\]{font-size:10px;line-height:1.5}.text-\\[11px\\]{font-size:11px;line-height:1.5}`;
css += `.font-normal{font-weight:400}.font-medium{font-weight:500}.font-semibold{font-weight:600}.font-bold{font-weight:700}.font-extrabold{font-weight:800}`;
css += `.leading-none{line-height:1}.leading-tight{line-height:1.25}.leading-snug{line-height:1.375}.leading-normal{line-height:1.5}.leading-relaxed{line-height:1.625}`;
css += `.tracking-wide{letter-spacing:.025em}.tracking-wider{letter-spacing:.05em}.tracking-widest{letter-spacing:.1em}`;
css += `.uppercase{text-transform:uppercase}.italic{font-style:italic}.truncate{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.whitespace-nowrap{white-space:nowrap}`;
css += `.text-center{text-align:center}.text-left{text-align:left}.text-right{text-align:right}`;
css += `.font-mono{font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace}`;

// Sizing
const sizes = { ...sp, 'auto':'auto','px':'1px','full':'100%','screen':'100vw','min':'min-content','max':'max-content' };
const hSizes = { ...sp, 'px':'1px','auto':'auto','full':'100%','screen':'100vh' };
for (const [k,v] of Object.entries(sizes)) {
  css += `.w-${k.replace('.','\\.')}{width:${v}}`;
}
for (const [k,v] of Object.entries(hSizes)) {
  css += `.h-${k.replace('.','\\.')}{height:${v}}`;
}
css += `.w-1\\/2{width:50%}.w-1\\/3{width:33.333333%}.w-2\\/3{width:66.666667%}.w-3\\/4{width:75%}`;
css += `.h-px{height:1px}.min-h-screen{min-height:100vh}.min-h-\\[60vh\\]{min-height:60vh}.min-h-\\[80px\\]{min-height:80px}.min-h-\\[90px\\]{min-height:90px}.min-h-\\[56px\\]{min-height:56px}`;
css += `.max-w-xs{max-width:20rem}.max-w-sm{max-width:24rem}.max-w-md{max-width:28rem}.max-w-lg{max-width:32rem}.max-w-xl{max-width:36rem}.max-w-2xl{max-width:42rem}.max-w-3xl{max-width:48rem}.max-w-4xl{max-width:56rem}.max-w-5xl{max-width:64rem}.max-w-6xl{max-width:72rem}.max-w-7xl{max-width:80rem}.max-w-none{max-width:none}`;
css += `.w-\\[600px\\]{width:600px}.w-\\[400px\\]{width:400px}.w-\\[300px\\]{width:300px}.w-\\[250px\\]{width:250px}.w-\\[220px\\]{width:220px}.w-\\[200px\\]{width:200px}.w-\\[160px\\]{width:160px}`;
css += `.h-\\[600px\\]{height:600px}.h-\\[400px\\]{height:400px}.h-\\[300px\\]{height:300px}.h-\\[250px\\]{height:250px}.h-\\[220px\\]{height:220px}.h-\\[200px\\]{height:200px}.h-\\[160px\\]{height:160px}`;

// Positioning
css += `.static{position:static}.fixed{position:fixed}.absolute{position:absolute}.relative{position:relative}.sticky{position:sticky}`;
css += `.inset-0{inset:0}.inset-auto{inset:auto}`;
css += `.top-0{top:0}.top-1{top:4px}.top-2{top:8px}.top-3{top:12px}.top-4{top:16px}.top-8{top:32px}.top-10{top:40px}.top-16{top:64px}.-top-10{top:-40px}.-top-20{top:-80px}.-top-32{top:-128px}.top-1\\/2{top:50%}`;
css += `.right-0{right:0}.right-3{right:12px}.right-4{right:16px}.right-10{right:40px}.right-12{right:48px}.right-20{right:80px}.right-1\\/4{right:25%}.-right-10{right:-40px}.-right-20{right:-80px}.-right-32{right:-128px}`;
css += `.bottom-0{bottom:0}.bottom-6{bottom:24px}.bottom-8{bottom:32px}.-bottom-20{bottom:-80px}.-bottom-30{bottom:-120px}`;
css += `.left-0{left:0}.left-10{left:40px}.left-1\\/2{left:50%}.-left-40{left:-160px}`;
css += `.z-10{z-index:10}.z-50{z-index:50}`;

// Transform
css += `.-translate-x-1\\/2{transform:translateX(-50%)}.-translate-y-0\\.5{transform:translateY(-2px)}.-translate-y-1{transform:translateY(-4px)}.translate-x-1{transform:translateX(4px)}.-translate-y-1\\/2{transform:translateY(-50%)}.scale-105{transform:scale(1.05)}`;
css += `.pointer-events-none{pointer-events:none}.cursor-pointer{cursor:pointer}.cursor-default{cursor:default}.cursor-not-allowed{cursor:not-allowed}`;

// Overflow
css += `.overflow-hidden{overflow:hidden}.overflow-auto{overflow:auto}.overflow-x-auto{overflow-x:auto}`;

// Colors
function genColor(name, shades) {
  for (const [shade, val] of Object.entries(shades)) {
    const s = shade === 'DEFAULT' ? '' : `-${shade}`;
    const cls = name + s;
    css += `.bg-${cls}{background-color:${val}}`;
    css += `.text-${cls}{color:${val}}`;
    css += `.border-${cls}{border-color:${val}}`;
    css += `.ring-${cls}{--ring-color:${val}}`;
    css += `.fill-${cls}{fill:${val}}`;
    // Opacity variants
    css += `.bg-${cls}\\/5{background-color:${val}0d}`;
    css += `.bg-${cls}\\/10{background-color:${val}1a}`;
    css += `.bg-${cls}\\/20{background-color:${val}33}`;
    css += `.bg-${cls}\\/30{background-color:${val}4d}`;
    css += `.bg-${cls}\\/50{background-color:${val}80}`;
    css += `.bg-${cls}\\/80{background-color:${val}cc}`;
    css += `.bg-${cls}\\/95{background-color:${val}f2}`;
    css += `.text-${cls}\\/40{color:${val}66}`;
    css += `.text-${cls}\\/50{color:${val}80}`;
    css += `.text-${cls}\\/70{color:${val}b3}`;
    css += `.text-${cls}\\/75{color:${val}bf}`;
    css += `.text-${cls}\\/90{color:${val}e6}`;
    css += `.border-${cls}\\/10{border-color:${val}1a}`;
  }
}
for (const [name, shades] of Object.entries(colors)) {
  genColor(name, shades);
}

// Borders
css += `
.border{border-width:1px}.border-0{border-width:0}.border-2{border-width:2px}.border-t{border-top-width:1px}.border-b{border-bottom-width:1px}.border-l{border-left-width:1px}.border-r{border-right-width:1px}
.rounded{border-radius:0.25rem}.rounded-sm{border-radius:0.125rem}.rounded-md{border-radius:0.375rem}.rounded-lg{border-radius:0.5rem}.rounded-xl{border-radius:0.75rem}.rounded-2xl{border-radius:1rem}.rounded-3xl{border-radius:1.5rem}.rounded-full{border-radius:9999px}
`;

// Ring
css += `
.ring-1{box-shadow:0 0 0 1px var(--ring-color,rgba(0,0,0,0.1))}.ring-2{box-shadow:0 0 0 2px var(--ring-color,rgba(0,0,0,0.1))}.ring-inset{--ring-inset:inset}
.ring-slate-100{--ring-color:#f1f5f9}.ring-slate-200{--ring-color:#e2e8f0}.ring-primary-400{--ring-color:#4f88cb}.ring-primary-100{--ring-color:#c5d8f0}.ring-amber-400{--ring-color:#fbbf24}.ring-amber-300{--ring-color:#fcd34d}.ring-white{--ring-color:#ffffff}.ring-blue-400{--ring-color:#60a5fa}.ring-emerald-100{--ring-color:#d1fae5}
`;

// Shadows
css += `
.shadow{box-shadow:0 1px 3px rgba(0,0,0,.1),0 1px 2px rgba(0,0,0,.06)}.shadow-sm{box-shadow:0 1px 2px rgba(0,0,0,.05)}.shadow-md{box-shadow:0 4px 6px -1px rgba(0,0,0,.1),0 2px 4px -1px rgba(0,0,0,.06)}.shadow-lg{box-shadow:0 10px 15px -3px rgba(0,0,0,.1),0 4px 6px -2px rgba(0,0,0,.05)}.shadow-xl{box-shadow:0 20px 25px -5px rgba(0,0,0,.1),0 10px 10px -5px rgba(0,0,0,.04)}.shadow-2xl{box-shadow:0 25px 50px -12px rgba(0,0,0,.25)}.shadow-none{box-shadow:none}
.shadow-amber-200{box-shadow:0 8px 15px -3px rgba(253,230,138,.5)}.shadow-amber-100{box-shadow:0 4px 8px -2px rgba(254,243,199,.5)}
`;

// Divide
css += `
.divide-x>*+*{border-left-width:1px}.divide-y>*+*{border-top-width:1px}
.divide-slate-100>*+*{border-color:#f1f5f9}.divide-white\\/10>*+*{border-color:rgba(255,255,255,.1)}
`;

// Transitions
css += `
.transition{transition:color .15s ease-in-out,background-color .15s ease-in-out,border-color .15s ease-in-out,box-shadow .15s ease-in-out,transform .15s ease-in-out}
.transition-all{transition:all .15s ease-in-out}.transition-colors{transition:color .15s ease-in-out,background-color .15s ease-in-out,border-color .15s ease-in-out}.transition-transform{transition:transform .15s ease-in-out}
.duration-200{transition-duration:.2s}.duration-300{transition-duration:.3s}
`;

// Opacity
css += `.opacity-0{opacity:0}.opacity-20{opacity:.2}.opacity-25{opacity:.25}.opacity-30{opacity:.3}.opacity-35{opacity:.35}.opacity-40{opacity:.4}.opacity-50{opacity:.5}.opacity-70{opacity:.7}.opacity-75{opacity:.75}.opacity-100{opacity:1}`;

// Backdrop
css += `.backdrop-blur-sm{backdrop-filter:blur(4px)}`;

// Misc
css += `
.select-none{user-select:none}.resize-none{resize:none}
.list-none{list-style:none}.list-disc{list-style-type:disc}
.underline{text-decoration:underline}
`;

// Hover/focus/group states - generate for common utilities
const hoverBgs = ['primary-800','primary-700','primary-600','primary-50','accent-500','accent-600','accent-400','amber-50','amber-600','white','slate-50','slate-100','white/10','white/20','emerald-100','red-50','blue-50'];
const hoverTexts = ['white','primary-800','accent-400','amber-400','slate-800'];
const hoverBorders = ['slate-300','primary-800','white'];

for (const c of hoverBgs) {
  const val = c.includes('/') ? (() => {
    const [name, opacity] = c.split('/');
    const [colorName, shade] = name.includes('-') ? name.split('-') : [name, 'DEFAULT'];
    const hex = colors[colorName]?.[shade] || colors[colorName]?.DEFAULT || '#000';
    const alphaHex = Math.round(parseInt(opacity)/100*255).toString(16).padStart(2,'0');
    return hex + alphaHex;
  })() : (() => {
    const parts = c.split('-');
    if (parts.length === 1) return colors[c]?.DEFAULT || '#000';
    const shade = parts[parts.length-1];
    const colorName = parts.slice(0,-1).join('-');
    return colors[colorName]?.[shade] || colors[colorName]?.DEFAULT || '#000';
  })();
  css += `.hover\\:bg-${c.replace(/\//g,'\\/')}:hover{background-color:${val}}`;
}
for (const c of hoverTexts) {
  const parts = c.split('-');
  const val = parts.length===1 ? (colors[c]?.DEFAULT||'#000') : (colors[parts.slice(0,-1).join('-')]?.[parts[parts.length-1]]||'#000');
  css += `.hover\\:text-${c}:hover{color:${val}}`;
}
for (const c of hoverBorders) {
  const parts = c.split('-');
  const val = parts.length===1 ? (colors[c]?.DEFAULT||'#000') : (colors[parts.slice(0,-1).join('-')]?.[parts[parts.length-1]]||'#000');
  css += `.hover\\:border-${c}:hover{border-color:${val}}`;
}
css += `.hover\\:-translate-y-0\\.5:hover{transform:translateY(-2px)}.hover\\:-translate-y-1:hover{transform:translateY(-4px)}.hover\\:translate-x-1:hover{transform:translateX(4px)}.hover\\:scale-105:hover{transform:scale(1.05)}`;
css += `.hover\\:shadow-md:hover{box-shadow:0 4px 6px -1px rgba(0,0,0,.1)}.hover\\:shadow-xl:hover{box-shadow:0 20px 25px -5px rgba(0,0,0,.1)}`;
css += `.hover\\:ring-slate-300:hover{--ring-color:#cbd5e1;box-shadow:0 0 0 1px #cbd5e1}`;

// Focus
css += `.focus\\:outline-none:focus{outline:none}.focus\\:ring-2:focus{box-shadow:0 0 0 2px var(--ring-color,rgba(0,0,0,.1))}.focus\\:ring-blue-400:focus{--ring-color:#60a5fa;box-shadow:0 0 0 2px #60a5fa}.focus\\:ring-primary-400:focus{--ring-color:#4f88cb;box-shadow:0 0 0 2px #4f88cb}.focus\\:ring-amber-400:focus{--ring-color:#fbbf24;box-shadow:0 0 0 2px #fbbf24}.focus\\:border-transparent:focus{border-color:transparent}.focus\\:ring-white:focus{--ring-color:#fff;box-shadow:0 0 0 2px #fff}`;

// Group hover
css += `.group:hover .group-hover\\:text-primary-800{color:#0f2847}.group:hover .group-hover\\:translate-x-1{transform:translateX(4px)}.group:hover .group-hover\\:text-white{color:#ffffff}`;

// Disabled
css += `.disabled\\:opacity-40:disabled{opacity:.4}.disabled\\:cursor-not-allowed:disabled{cursor:not-allowed}`;

// Animations
css += `
@keyframes fadeInUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}
@keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
@keyframes slideIn{from{opacity:0;transform:scale(.95) translateY(10px)}to{opacity:1;transform:scale(1) translateY(0)}}
.animate-fade-in,.anim{animation:fadeInUp .3s ease-out both}
.animate-bounce,.bounce{animation:bounce 1.5s infinite}
.animate-pulse,.pulse{animation:pulse 2s infinite}
.fade-in{animation:fadeInUp .6s ease-out both}
.fade-in-2{animation:fadeInUp .6s .15s ease-out both}
.fade-in-3{animation:fadeInUp .6s .3s ease-out both}
.modal-box{animation:slideIn .2s ease-out}
.success-check{animation:fadeInUp .4s ease-out both}
`;

// Responsive breakpoints
css += `
@media(min-width:640px){
  .sm\\:grid-cols-2{grid-template-columns:repeat(2,minmax(0,1fr))}.sm\\:grid-cols-3{grid-template-columns:repeat(3,minmax(0,1fr))}
  .sm\\:flex-row{flex-direction:row}.sm\\:items-end{align-items:flex-end}
  .sm\\:block{display:block}.sm\\:inline-flex{display:inline-flex}.sm\\:hidden{display:none}
  .sm\\:text-4xl{font-size:36px;line-height:40px}.sm\\:text-5xl{font-size:48px;line-height:1}
  .sm\\:px-6{padding-left:24px;padding-right:24px}
  .sm\\:py-2\\.5{padding-top:10px;padding-bottom:10px}
  .sm\\:gap-3{gap:12px}
  .sm\\:shrink-0{flex-shrink:0}
}
@media(min-width:768px){
  .md\\:grid-cols-2{grid-template-columns:repeat(2,minmax(0,1fr))}.md\\:grid-cols-3{grid-template-columns:repeat(3,minmax(0,1fr))}
  .md\\:grid-cols-6{grid-template-columns:repeat(6,minmax(0,1fr))}
  .md\\:flex{display:flex}.md\\:hidden{display:none}.md\\:block{display:block}
  .md\\:col-span-2{grid-column:span 2/span 2}
  .md\\:divide-y-0>*+*{border-top-width:0}
}
@media(min-width:1024px){
  .lg\\:grid-cols-2{grid-template-columns:repeat(2,minmax(0,1fr))}.lg\\:grid-cols-3{grid-template-columns:repeat(3,minmax(0,1fr))}.lg\\:grid-cols-4{grid-template-columns:repeat(4,minmax(0,1fr))}
  .lg\\:col-span-2{grid-column:span 2/span 2}.lg\\:col-span-3{grid-column:span 3/span 3}
  .lg\\:flex{display:flex}.lg\\:block{display:block}.lg\\:hidden{display:none}
  .lg\\:py-32{padding-top:128px;padding-bottom:128px}
  .lg\\:text-6xl{font-size:60px;line-height:1}
  .lg\\:divide-y-0>*+*{border-top-width:0}
  .lg\\:px-8{padding-left:32px;padding-right:32px}
}
@media(min-width:1280px){
  .xl\\:grid-cols-2{grid-template-columns:repeat(2,minmax(0,1fr))}.xl\\:grid-cols-3{grid-template-columns:repeat(3,minmax(0,1fr))}.xl\\:grid-cols-5{grid-template-columns:repeat(5,minmax(0,1fr))}
  .xl\\:col-span-2{grid-column:span 2/span 2}.xl\\:col-span-3{grid-column:span 3/span 3}
  .xl\\:flex{display:flex}.xl\\:block{display:block}
}
`;

// Modal
css += `
.modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,.5);backdrop-filter:blur(4px);z-index:50;display:flex;align-items:center;justify-content:center;padding:1rem}
`;

// Day cell classes
css += `
.day-cell{min-height:80px;transition:all .15s;cursor:pointer}
.day-cell:hover{background:#f8fafc}
.day-cell.today{background:#fffbeb;outline:2px solid #f59e0b;outline-offset:-1px}
.day-cell.selected{background:#e8f0fa;outline:2px solid #2e6fbf;outline-offset:-1px}
.day-cell.other{opacity:.35;pointer-events:none}
.day-cell.disabled{opacity:.3;pointer-events:none;cursor:default}
`;

fs.writeFileSync(path.join(__dirname, 'static', 'style.css'), css);
console.log(`Generated style.css (${Math.round(css.length / 1024)}KB)`);
