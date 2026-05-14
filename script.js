
// PARTICLES
const canvas=document.getElementById('particles');
const ctx=canvas.getContext('2d');
let particles=[];
function resizeCanvas(){canvas.width=window.innerWidth;canvas.height=window.innerHeight}
resizeCanvas();
window.addEventListener('resize',resizeCanvas);
for(let i=0;i<60;i++)particles.push({x:Math.random()*window.innerWidth,y:Math.random()*window.innerHeight,vx:(Math.random()-0.5)*0.3,vy:(Math.random()-0.5)*0.3,size:Math.random()*1.5+0.5,opacity:Math.random()*0.4+0.1});
function animParticles(){ctx.clearRect(0,0,canvas.width,canvas.height);particles.forEach(p=>{p.x+=p.vx;p.y+=p.vy;if(p.x<0)p.x=canvas.width;if(p.x>canvas.width)p.x=0;if(p.y<0)p.y=canvas.height;if(p.y>canvas.height)p.y=0;ctx.beginPath();ctx.arc(p.x,p.y,p.size,0,Math.PI*2);ctx.fillStyle=`rgba(0,212,255,${p.opacity})`;ctx.fill()});requestAnimationFrame(animParticles)}
animParticles();

// SCROLL PROGRESS
window.addEventListener('scroll',()=>{
  const p=window.scrollY/(document.body.scrollHeight-window.innerHeight)*100;
  document.getElementById('progress-bar').style.width=p+'%';
  document.getElementById('back-top').classList.toggle('show',window.scrollY>500);
});

// SCROLL TO
function scrollSec(id){const el=document.getElementById(id);if(el)el.scrollIntoView({behavior:'smooth'});if(document.getElementById('mobileMenu').classList.contains('open'))toggleMobile()}

// THEME TOGGLE
let dark=true;
function toggleTheme(){dark=!dark;document.body.classList.toggle('light',!dark);document.querySelector('.theme-toggle').textContent=dark?'☀ Light':'🌙 Dark'}

// MOBILE MENU
function toggleMobile(){document.getElementById('mobileMenu').classList.toggle('open')}

// COUNTER ANIMATION
function animateCounter(el){
  const target=parseInt(el.dataset.count);
  const suffix=el.dataset.suffix||'';
  let start=0;
  const dur=2000;
  const step=timestamp=>{
    if(!start)start=timestamp;
    const prog=Math.min((timestamp-start)/dur,1);
    el.textContent=Math.floor(prog*target)+(prog===1?suffix:'');
    if(prog<1)requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}
const obs=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting){document.querySelectorAll('[data-count]').forEach(animateCounter);obs.disconnect()}})},{threshold:0.5});
const heroStats=document.querySelector('.hero-stats');
if(heroStats)obs.observe(heroStats);

// TESTIMONIAL AUTO SCROLL
let tPos=0;
const cards=document.querySelectorAll('.testimonial-card');
function scrollTest(){
  const track=document.getElementById('testimonialTrack');
  tPos=(tPos+1)%cards.length;
  track.style.transform=`translateX(-${tPos*360}px)`;
}
setInterval(scrollTest,3500);

// CALENDAR
let calDate=new Date(2025,5,1);
const availDays=[3,5,9,10,12,16,17,19,23,24,26];
const times=['9:00 AM','10:00 AM','11:00 AM','2:00 PM','3:00 PM','4:00 PM'];
let selDay=null,selTime=null;
function renderCal(){
  const months=['January','February','March','April','May','June','July','August','September','October','November','December'];
  document.getElementById('calMonth').textContent=months[calDate.getMonth()]+' '+calDate.getFullYear();
  const grid=document.getElementById('calGrid');
  grid.innerHTML='';
  ['Su','Mo','Tu','We','Th','Fr','Sa'].forEach(d=>{const l=document.createElement('div');l.className='cal-day-label';l.textContent=d;grid.appendChild(l)});
  const first=new Date(calDate.getFullYear(),calDate.getMonth(),1).getDay();
  const days=new Date(calDate.getFullYear(),calDate.getMonth()+1,0).getDate();
  for(let i=0;i<first;i++){const e=document.createElement('div');e.className='cal-day empty';e.textContent='x';grid.appendChild(e)}
  for(let d=1;d<=days;d++){
    const el=document.createElement('div');
    el.textContent=d;
    const isAvail=availDays.includes(d);
    el.className='cal-day'+(isAvail?' available':'')+(selDay===d?' selected':'');
    if(isAvail)el.onclick=()=>{selDay=d;document.getElementById('selectedSlot').textContent=`Selected: ${months[calDate.getMonth()]} ${d}${selTime?', '+selTime:''}`;renderCal();renderTimes()};
    grid.appendChild(el);
  }
}
function renderTimes(){
  const grid=document.getElementById('timeGrid');
  grid.innerHTML='';
  times.forEach(t=>{
    const el=document.createElement('div');
    el.className='time-slot available'+(selTime===t?' selected':'');
    el.textContent=t;
    el.onclick=()=>{selTime=t;const months=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];if(selDay)document.getElementById('selectedSlot').textContent=`Slot: ${months[calDate.getMonth()]} ${selDay}, ${t}`;renderTimes()};
    grid.appendChild(el);
  });
}
function prevMonth(){calDate=new Date(calDate.getFullYear(),calDate.getMonth()-1,1);renderCal();renderTimes()}
function nextMonth(){calDate=new Date(calDate.getFullYear(),calDate.getMonth()+1,1);renderCal();renderTimes()}
renderCal();renderTimes();

// FAQ
const faqs=[
  {q:"What's your typical project timeline?",a:"Small projects (CI/CD setup, Docker): 1–2 weeks. Medium (Kubernetes cluster, full deployment): 3–6 weeks. Large (cloud migration, full product): 2–4 months. I provide detailed estimates after a discovery call."},
  {q:"Do you work with startups or enterprises?",a:"Both. I've worked with pre-seed startups needing fast MVPs and Fortune 500 companies doing cloud transformations. My approach adapts to your scale, budget, and team maturity."},
  {q:"What's included in post-project support?",a:"All projects include 30 days of free bug fixes and support. Extended support retainers are available. For ongoing operations, I offer monthly SRE retainer plans."},
  {q:"Can you join an existing team?",a:"Absolutely. I often work embedded in client engineering teams as a senior DevOps/cloud specialist, integrating with Jira, Slack, and your existing workflows."},
  {q:"Do you sign NDAs?",a:"Yes, always. I take confidentiality seriously. NDAs are standard for all client engagements and I'll never share details of your project without explicit written consent."},
  {q:"What cloud providers do you work with?",a:"AWS (primary), Google Cloud, and Azure. I also work with Cloudflare, DigitalOcean, and Hetzner for cost-sensitive workloads. Multi-cloud architectures are a specialty."},
];
const faqList=document.getElementById('faqList');
faqs.forEach((f,i)=>{
  const item=document.createElement('div');
  item.className='faq-item';
  item.innerHTML=`<div class="faq-q" onclick="toggleFaq(${i})"><span>${f.q}</span><span class="faq-icon">+</span></div><div class="faq-a"><div class="faq-a-inner">${f.a}</div></div>`;
  faqList.appendChild(item);
});
function toggleFaq(i){const items=document.querySelectorAll('.faq-item');items[i].classList.toggle('open')}

// TOAST
function showToast(msg,type='success'){
  const t=document.createElement('div');
  t.className=`toast toast-${type}`;t.textContent=msg;
  document.body.appendChild(t);
  setTimeout(()=>t.remove(),4000);
}

// FORM SUBMIT
function submitForm(){
  const name=document.getElementById('fName').value;
  const email=document.getElementById('fEmail').value;
  const msg=document.getElementById('fMsg').value;
  if(!name||!email||!msg){showToast('Please fill required fields.','error');return}
  const btn=document.getElementById('submitBtn');
  btn.disabled=true;btn.textContent='Sending...';
  setTimeout(()=>{btn.disabled=false;btn.textContent='Send Message →';showToast('🚀 Message sent! I\'ll reply within 4 hours.');}
  ,1800);
}

// QUOTE SUBMIT
function submitQuote(){
  const email=document.getElementById('qEmail').value;
  const summary=document.getElementById('qSummary').value;
  if(!email||!summary){showToast('Please fill required fields.','error');return}
  showToast('✅ Quote request received! Proposal within 24 hours.');
  closeModal('quoteModal');
}

// BOOKING
function bookSlot(){
  const name=document.getElementById('bkName').value;
  const email=document.getElementById('bkEmail').value;
  if(!name||!email){showToast('Please fill your name and email.','error');return}
  if(!selDay||!selTime){showToast('Please select a date and time.','error');return}
  showToast('📅 Consultation booked! Check your email for confirmation.');
}

// NEWSLETTER
function subscribeNL(){
  const email=document.getElementById('nlEmail').value;
  if(!email||!email.includes('@')){showToast('Please enter a valid email.','error');return}
  showToast('🎉 Subscribed! Welcome to the community.');
  document.getElementById('nlEmail').value='';
}

// MODALS
const caseStudies=[
  {title:'CloudOps Dashboard',desc:'A real-time observability platform for Kubernetes clusters serving 200+ microservices.',problem:'Client had no visibility into cluster health. Alerts were manual, slow, and unreliable.',solution:'Built a React dashboard consuming Prometheus metrics via a Go API gateway. Added cost analytics by integrating with AWS Cost Explorer. Implemented intelligent alert routing via PagerDuty.',result:'95% reduction in MTTR. Ops team from 6 people to 3. $18K/month saved on cloud costs through right-sizing recommendations.',stack:'React, TypeScript, Go, Prometheus, Grafana, PostgreSQL, EKS, Helm'},
  {title:'AutoDeploy Platform',desc:'A PaaS for Node.js/Python apps with zero-config deployments like Vercel but on client-owned infrastructure.',problem:'Developer team spent 30% of time on deployment and environment management.',solution:'Built a CLI + web dashboard that wraps Docker, Terraform, and AWS ECS. Automatic SSL via Let\'s Encrypt, CDN via CloudFront, and instant rollback.',result:'Deploy time from 2 hours to 4 minutes. Developer satisfaction scores up 60%. Platform now has 120+ active users.',stack:'Node.js, React, Docker, Terraform, AWS ECS, CloudFront, Route53'},
  {title:'FinTrack SaaS',desc:'Multi-tenant financial analytics platform with real-time dashboards and AI-powered insights.',problem:'Excel-based reporting was unsustainable at 10K+ users. No real-time data. No audit trails.',solution:'Event-driven architecture on AWS: Kinesis for event streaming, Lambda for processing, RDS Aurora for storage. React frontend with WebSocket live updates.',result:'From 10K to 100K users with no infrastructure changes. 99.9% uptime. 3-second dashboard loads globally via CloudFront.',stack:'React, Node.js, AWS Lambda, Kinesis, RDS Aurora, Redis, CloudFront'},
];
function openCaseStudy(i){
  const cs=caseStudies[i];
  document.getElementById('caseContent').innerHTML=`<h3>${cs.title}</h3><p style="font-size:0.78rem;color:var(--text2);margin:0.5rem 0 1.5rem">${cs.desc}</p><div style="margin-bottom:1rem"><strong style="font-size:0.7rem;letter-spacing:0.1em;text-transform:uppercase;color:var(--accent)">Problem</strong><p style="font-size:0.78rem;color:var(--text2);margin-top:0.4rem;line-height:1.7">${cs.problem}</p></div><div style="margin-bottom:1rem"><strong style="font-size:0.7rem;letter-spacing:0.1em;text-transform:uppercase;color:var(--accent)">Solution</strong><p style="font-size:0.78rem;color:var(--text2);margin-top:0.4rem;line-height:1.7">${cs.solution}</p></div><div style="margin-bottom:1.5rem"><strong style="font-size:0.7rem;letter-spacing:0.1em;text-transform:uppercase;color:var(--accent3)">Results</strong><p style="font-size:0.78rem;color:var(--text2);margin-top:0.4rem;line-height:1.7">${cs.result}</p></div><div style="font-size:0.7rem;color:var(--text3)">Stack: ${cs.stack}</div>`;
  document.getElementById('caseModal').classList.add('open');
}
function openQuoteModal(){document.getElementById('quoteModal').classList.add('open')}
function closeModal(id){document.getElementById(id).classList.remove('open')}
document.querySelectorAll('.modal-overlay').forEach(m=>m.addEventListener('click',e=>{if(e.target===m)m.classList.remove('open')}));

// LEAD POPUP
setTimeout(()=>document.getElementById('leadPopup').classList.add('show'),5000);
function closeLead(){document.getElementById('leadPopup').classList.remove('show')}
