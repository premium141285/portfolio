'use strict';
const codeSamples = {
  html: ['<!-- A solid foundation. -->', '<main class="experience">', '  <section class="idea">', '    <h1>Made for people.</h1>', '    <p>Built for the web.</p>', '    <button>Let’s begin</button>', '  </section>', '</main>'],
  css: ['/* Details that make a difference. */', '.experience {', '  display: grid;', '  gap: clamp(1rem, 3vw, 3rem);', '  color: #f0efea;', '  background: #08090b;', '  transition: color 300ms ease;', '}'],
  js: ['// A small interaction. A better feeling.', 'const button = document.querySelector("button");', '', 'button.addEventListener("click", () => {', '  document.body.classList.toggle("color-on");', '  button.textContent = "Looking good.";', '});', '// Test. Refine. Ship.']
};
function escapeHTML(value) { return value.replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char])); }
function showCode(file) {
  document.getElementById('code-filename').textContent = {html:'index.html',css:'style.css',js:'app.js'}[file];
  document.getElementById('code-content').innerHTML = codeSamples[file].map((line,i) => `<span class="code-line"><span class="line-number">${i+1}</span><span class="${line.startsWith('//') || line.startsWith('/*') || line.startsWith('<!--') ? 'syntax-comment' : file === 'html' ? 'syntax-tag' : 'syntax-string'}">${escapeHTML(line)}</span></span>`).join('');
  document.querySelectorAll('.file-tab').forEach(button => { const selected = button.dataset.file === file; button.classList.toggle('selected',selected); button.setAttribute('aria-pressed',String(selected)); });
}
showCode('html');
document.querySelectorAll('.file-tab').forEach(button => button.addEventListener('click', () => { showCode(button.dataset.file); if (matchMedia('(max-width:600px)').matches) { const pane=document.querySelector('.code-pane'); pane.hidden=false; pane.style.display='block'; } }));
document.getElementById('preview-toggle').addEventListener('click', function() { const active=document.getElementById('preview-card').classList.toggle('color-on'); this.setAttribute('aria-pressed',String(active)); this.innerHTML=(active?'Back to monochrome':'Try a little color')+' <span aria-hidden="true">◐</span>'; });
document.querySelectorAll('.device').forEach(button => button.addEventListener('click', () => { document.getElementById('preview-card').classList.toggle('mobile-preview',button.dataset.device==='mobile'); document.querySelectorAll('.device').forEach(b=>{b.classList.toggle('selected',b===button);b.setAttribute('aria-pressed',String(b===button));}); }));
const menuButton=document.querySelector('.menu-toggle'), navigation=document.getElementById('navigation');
function closeMenu() { navigation.classList.remove('open'); menuButton.setAttribute('aria-expanded','false'); menuButton.setAttribute('aria-label','Open navigation'); }
menuButton.addEventListener('click',()=>{ const open=navigation.classList.toggle('open');menuButton.setAttribute('aria-expanded',String(open));menuButton.setAttribute('aria-label',open?'Close navigation':'Open navigation'); });
navigation.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu();});
document.addEventListener('click',e=>{if(!e.target.closest('.site-header'))closeMenu();});
document.getElementById('year').textContent=new Date().getFullYear();
if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion:reduce)').matches) {
  document.documentElement.classList.add('js-motion');
  const revealObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');revealObserver.unobserve(entry.target);}}),{threshold:0.07});
  document.querySelectorAll('.reveal').forEach(el=>revealObserver.observe(el));
}
if ('IntersectionObserver' in window) {
  const sectionObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting)navigation.querySelectorAll('a').forEach(a=>a.classList.toggle('active',a.hash==='#'+entry.target.id));}),{rootMargin:'-15% 0px -60% 0px'});
  document.querySelectorAll('main>section').forEach(el=>sectionObserver.observe(el));
}
document.querySelectorAll('[data-filter]').forEach(button=>button.addEventListener('click',()=>{
  const filter=button.dataset.filter;
  document.querySelectorAll('[data-filter]').forEach(b=>{b.classList.toggle('selected',b===button);b.setAttribute('aria-pressed',String(b===button));});
  let count=0;document.querySelectorAll('[data-category]').forEach(card=>{card.hidden=filter!=='all'&&card.dataset.category!==filter;if(!card.hidden)count++;});
  document.querySelector('.project-filter-status').textContent=`${count} ${count===1?'project':'projects'} shown.`;
}));
document.querySelectorAll('[data-service]').forEach(a=>a.addEventListener('click',()=>{document.getElementById('project-type').value=a.dataset.service;}));
const settings=window.PORTFOLIO;
document.querySelectorAll('[data-email-link]').forEach(a=>{a.href='mailto:'+settings.email;a.textContent=settings.email;});
document.querySelector('.header-contact').href='mailto:'+settings.email;
for(const marketplace of ['upwork','fiverr']){const a=document.querySelector(`[data-${marketplace}-link]`);if(settings[marketplace]){a.href=settings[marketplace];a.hidden=false;}else a.hidden=true;}
let toastTimer;
function toast(message){const el=document.getElementById('toast');el.textContent=message;el.classList.add('visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('visible'),3500);}
async function copyText(text){
  try { await navigator.clipboard.writeText(text); return true; }
  catch { const input=document.createElement('textarea');input.value=text;input.style.position='fixed';input.style.opacity='0';document.body.append(input);input.select();const ok=document.execCommand('copy');input.remove();return ok; }
}
document.getElementById('copy-email').addEventListener('click',async()=>{toast(await copyText(settings.email)?'Email address copied.':'Copy the email address shown above.');});
const form=document.getElementById('brief-form');let brief='';
form.addEventListener('submit',e=>{e.preventDefault();if(!form.reportValidity())return;const data=new FormData(form);brief=`Hello ${settings.name},\n\nMy name is ${data.get('name').trim()}.\nI need help with: ${data.get('type')}.\n\n${data.get('message').trim()}\n\nYou can reach me at: ${data.get('email').trim()}\n\nThank you!`;document.getElementById('prepared-brief').value=brief;document.getElementById('brief-result').hidden=false;const link=document.createElement('a');link.href=`mailto:${settings.email}?subject=${encodeURIComponent('Project inquiry: '+data.get('type'))}&body=${encodeURIComponent(brief)}`;document.body.append(link);link.click();link.remove();toast('Email draft prepared. You can also copy or download it.');});
document.getElementById('copy-brief').addEventListener('click',async()=>{const ok=await copyText(brief);if(!ok)document.getElementById('prepared-brief').select();toast(ok?'Project brief copied.':'Select and copy the brief below.');});
document.getElementById('download-brief').addEventListener('click',()=>{const url=URL.createObjectURL(new Blob([brief],{type:'text/plain;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download='project-brief.txt';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);});
