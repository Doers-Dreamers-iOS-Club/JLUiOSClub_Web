/** Tiny HTML-first cover: independent of Vue, GSAP and WebGL downloads. */
export const homeBoot = `
<style>
@font-face{font-family:'Club Instrument Serif';src:url('/fonts/instrument-serif/instrument-serif-latin.woff2') format('woff2');font-style:normal;font-weight:400;font-display:swap}
#club-boot{display:none;position:fixed;inset:0;z-index:99;place-content:center;background:#fff;color:#202023;overflow:hidden;font-family:'Club Instrument Serif',Georgia,serif}
html.dark #club-boot{background:#101010;color:#f5f5f6}
html.club-booting #club-boot{display:grid}
#club-boot .boot-line{font-size:clamp(24px,9.2vw,132px);line-height:1;white-space:nowrap;letter-spacing:-.025em}
#club-boot .boot-line span{display:inline-block;animation:boot-letter .85s cubic-bezier(.2,.7,.2,1) both;animation-delay:calc(var(--i)*18ms)}
#club-boot .boot-line span:nth-child(even){--shift:110%}
#club-boot .boot-echo{position:absolute;inset:calc(50% - 1.6em) 0 auto;text-align:center;font-size:clamp(24px,9.2vw,132px);opacity:.12;animation:boot-breathe 1.8s ease-in-out infinite alternate}
#club-boot .boot-echo:last-child{inset:calc(50% + .7em) 0 auto;animation-delay:-.9s}
@keyframes boot-letter{from{opacity:0;transform:translateY(var(--shift,-110%)) rotateX(65deg)}to{opacity:1;transform:none}}
@keyframes boot-breathe{from{opacity:.03;transform:translateX(-2vw)}to{opacity:.15;transform:translateX(2vw)}}
@media(prefers-reduced-motion:reduce){html.club-booting #club-boot{display:none}}
</style>
<div id="club-boot" aria-hidden="true"><div class="boot-echo">I dwell in Possibility</div><div class="boot-line">${Array.from('I dwell in Possibility').map((c,i)=>`<span style="--i:${i}">${c === ' ' ? '&nbsp;' : c}</span>`).join('')}</div><div class="boot-echo">I dwell in Possibility</div></div>
<script>(()=>{if((location.hash&&location.hash!=='#index')||matchMedia('(prefers-reduced-motion: reduce)').matches)return;document.documentElement.classList.add('club-booting');const end=()=>{document.documentElement.classList.remove('club-booting');document.getElementById('club-boot')?.remove();clearTimeout(timer);removeEventListener('keydown',key);removeEventListener('hashchange',end);removeEventListener('club:intro-ready',end)};const key=e=>{if(e.key==='Escape'){document.documentElement.dataset.clubIntroSkipped='true';end()}};const timer=setTimeout(end,6500);addEventListener('keydown',key);addEventListener('hashchange',end);addEventListener('club:intro-ready',end)})()</script>`
