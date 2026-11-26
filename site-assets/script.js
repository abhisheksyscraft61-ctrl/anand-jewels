
const $=id=>document.getElementById(id),fine=matchMedia("(hover:hover)").matches,escHTML=value=>String(value??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c])),hashValue=()=>{const hash=location.hash.slice(1);try{return decodeURIComponent(hash)}catch{return hash}};
let CMS=null;
let D=[["Necklaces","Diamond Necklace","Gold 18K · 24.5 g","diamond-necklace.jpg"],["Pendants","Heart Pendant","Gold 22K · 6.2 g","heart-pendant.jpg"],["Necklaces","Drop Necklace","Gold 22K · 32 g","drop-necklace.jpg"],["Rings","Solitaire Ring","Diamond · 18K","solitaire-ring.jpg"],["Rings","Bridal Band","Gold 22K · 8 g","bridal-band.jpg"],["Earrings","Chandelier Earrings","Gold 22K · 14 g","chandelier-earrings.jpg"],["Earrings","Stud Earrings","Diamond · 18K","stud-earrings.jpg"],["Bangles","Temple Bangles","Gold 22K · 40 g","temple-bangles.jpg"]];
const ic={Necklaces:'<path d="M15 20c0 40 70 40 70 0" fill="none" stroke="#f3dc8a" stroke-width="4"/><polygon points="50,60 62,72 50,92 38,72" fill="#f3dc8a"/>',Pendants:'<path d="M50 78C20 55 22 30 40 30c8 0 10 6 10 6s2-6 10-6c18 0 20 25-10 48z" fill="#f3dc8a"/>',Rings:'<circle cx="50" cy="62" r="24" fill="none" stroke="#f3dc8a" stroke-width="8"/><polygon points="38,28 62,28 68,38 50,50 32,38" fill="#cfe9ff"/>',Earrings:'<circle cx="35" cy="30" r="5" fill="#f3dc8a"/><path d="M35 35v28" stroke="#f3dc8a" stroke-width="3"/><circle cx="35" cy="70" r="9" fill="#cfe9ff"/><circle cx="65" cy="30" r="5" fill="#f3dc8a"/><path d="M65 35v28" stroke="#f3dc8a" stroke-width="3"/><circle cx="65" cy="70" r="9" fill="#cfe9ff"/>',Bangles:'<ellipse cx="50" cy="55" rx="34" ry="26" fill="none" stroke="#f3dc8a" stroke-width="8"/><ellipse cx="50" cy="55" rx="22" ry="14" fill="none" stroke="#d4af37" stroke-width="3" stroke-dasharray="4 4"/>'};
let cats=["All",...new Set(D.map(d=>d[0]))];
function show(f){$("tabs").innerHTML=cats.map(c=>`<button class="${c==f?'a':''}" data-c="${escHTML(c)}">${escHTML(c)}</button>`).join("");
$("grid").innerHTML=D.filter(d=>f=="All"||d[0]==f).map((d,i)=>`<div class="card" style="animation-delay:${i*90}ms"><button class="hr" aria-label="Wishlist">♡</button><div class="ph"><img src="${escHTML(d[3])}" alt="${escHTML(d[1])}" loading="lazy" decoding="async"></div><div class="cb"><h3>${escHTML(d[1])}</h3><p>${escHTML(d[2])}</p><a href="#p-contact">Enquire now →</a></div></div>`).join("")}
$("tabs").onclick=e=>{if(e.target.dataset.c)show(e.target.dataset.c)};show("All");
$("grid").onclick=e=>{const b=e.target.closest(".hr");if(b){b.classList.toggle("on");b.textContent=b.classList.contains("on")?"♥":"♡"}};
if(fine){$("grid").addEventListener("pointermove",e=>{const c=e.target.closest(".card");if(!c)return;const r=c.getBoundingClientRect();c.style.setProperty("--ry",((e.clientX-r.left)/r.width-.5)*10+"deg");c.style.setProperty("--rx",(.5-(e.clientY-r.top)/r.height)*10+"deg")});
$("grid").addEventListener("pointerout",e=>{const c=e.target.closest(".card");if(c){c.style.setProperty("--ry","0deg");c.style.setProperty("--rx","0deg")}})}
document.querySelectorAll("[data-f]").forEach(a=>a.addEventListener("click",()=>show(a.dataset.f)));
let S=[["Bhopal Flagship","bhopal-flagship.png","19, Malviya Nagar, Bhopal, Madhya Pradesh 462003","Mon–Sun, 11:30 AM – 9:30 PM","4.9/5 (1,558 reviews)","+910000000000"],["Indore","indore-showroom.png","Address to be added","Timings to be added","","+910000000000"],["Raipur","raipur-showroom.webp","Address to be added","Timings to be added","","+910000000000"],["EISH by Anand Jewels","eish-showroom.jpg","Address to be added","Timings to be added","","+910000000000"],["Showroom · DB City Mall","db-city-showroom.jpg","DB City Mall, Zone-I, Arera Hills, Bhopal, Madhya Pradesh 462011","Mon–Sun, 11:45 AM – 9:30 PM","","+910000000000"]],MP=[[90,80],[220,150],[340,70],[450,170],[505,60]];
let featuredProducts=[];
const nv=$("nv"),bg=$("bg");bg.onclick=()=>{nv.classList.toggle("o");bg.classList.toggle("o")};
nv.onclick=e=>{if(e.target.tagName=="A"){nv.classList.remove("o");bg.classList.remove("o")}};
$("tp").onclick=()=>scrollTo({top:0,behavior:"smooth"});
function storeCard([name,image,addr,hrs,rate],i){
 const n=i+1;
 return `<article class="shop rv" style="--d:${n*.08}s">
  <a class="shop-media" href="#p-store-${n}" aria-label="Explore ${name} showroom">
   <img class="shop-img" src="${escHTML(image)}" alt="${escHTML(name)} showroom" loading="lazy" decoding="async">
   <span class="shop-photo-index">SHOWROOM ${String(n).padStart(2,"0")}</span>
   <span class="shop-photo-hint">View showroom <span aria-hidden="true">↗</span></span>
  </a>
  <div class="shop-content">
  <div class="shop-heading"><h3>${escHTML(name)}</h3></div>
   <div class="shop-facts">
    <p><span class="shop-icon" aria-hidden="true">📍</span><span>${escHTML(addr)}</span></p>
    <p><span class="shop-icon" aria-hidden="true">🕒</span><span>${escHTML(hrs)}</span></p>
   </div>
   ${rate?`<p class="shop-rating"><span aria-hidden="true">★</span><strong>${escHTML(rate)}</strong></p>`:""}
   <div class="shop-actions"><a class="shop-call" href="tel:${escHTML(S[i]?.[5]||"")}">Call showroom</a><a class="shop-details" href="#p-store-${n}">Details <span aria-hidden="true">→</span></a></div>
  </div>
 </article>`;
}
let tk=0;addEventListener("scroll",()=>{if(tk)return;tk=requestAnimationFrame(()=>{tk=0;const y=scrollY,h=document.documentElement.scrollHeight-innerHeight;
$("hd").classList.toggle("s",y>40);$("bar").style.width=(y/h*100)+"%";$("tp").classList.toggle("v",y>600)})},{passive:true});
["bk","ct"].forEach(id=>{const f=$(id);if(f)f.onsubmit=e=>{e.preventDefault();f.querySelector(".ok").style.display="block";f.reset()}});
function count(el){const n=+el.dataset.n,s=el.dataset.s||"";let t0=null;(function st(t){t0=t0||t;const p=Math.min((t-t0)/2000,1);el.textContent=Math.floor(n*(1-Math.pow(1-p,4)))+(p==1?s:"");if(p<1)requestAnimationFrame(st)})(performance.now())}
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add("in");e.target.querySelectorAll("[data-n]").forEach(count);if(e.target.dataset.n)count(e.target);io.unobserve(e.target)}}),{threshold:.15});
document.querySelectorAll(".rv").forEach(el=>io.observe(el));
addEventListener("load",()=>setTimeout(()=>$("pre").classList.add("x"),500));setTimeout(()=>$("pre").classList.add("x"),2500);
let T0=document.title,siteName="Anand Jewels";
const rate=(m,p)=>m=="Gold"?7500*p/22:90,pr=p=>p[5]*rate(p[3],p[4]),inr=n=>"₹"+Math.round(n).toLocaleString("en-IN"),bc=(...a)=>`<div class="bc"><a href="#home">Home</a>${a.map(x=>" › "+x).join("")}</div>`,op=(a,s)=>["All",...a].map(x=>`<option ${x==s?"selected":""}>${escHTML(x)}</option>`).join("");
let P=[[1,"Necklaces","Diamond Necklace","Gold",18,24.5,"Diamond","diamond-necklace.jpg"],[2,"Pendants","Heart Pendant","Gold",22,6.2,"None","heart-pendant.jpg"],[3,"Necklaces","Drop Necklace","Gold",22,32,"None","drop-necklace.jpg"],[4,"Rings","Solitaire Ring","Gold",18,5.4,"Diamond","solitaire-ring.jpg"],[5,"Rings","Bridal Band","Gold",22,8,"None","bridal-band.jpg"],[6,"Earrings","Chandelier Earrings","Gold",22,14,"None","chandelier-earrings.jpg"],[7,"Earrings","Diamond Studs","Gold",18,3.2,"Diamond","stud-earrings.jpg"],[8,"Bangles","Temple Bangles","Gold",22,40,"None","temple-bangles.jpg"],[9,"Bangles","Silver Kada","Silver",92.5,60,"None",null],[10,"Pendants","Diamond Pendant","Gold",18,4.1,"Diamond","heart-pendant.jpg"]];
async function loadPublicCatalog(){
 try{
  const response=await fetch("/api/public/catalog",{cache:"no-store"});
  if(!response.ok)throw new Error(`Catalog request failed (${response.status}).`);
  const catalog=await response.json();
  P=catalog.products.map(p=>[p.id,p.category,p.name,p.metal,p.purity,p.weight,p.stone,p.image||null]);
  featuredProducts=catalog.products.filter(p=>p.featured);
  D=featuredProducts.map(p=>[p.category,p.name,`${p.metal} ${p.purity}${p.metal=="Gold"?"K":"%"} · ${p.weight} g${p.stone!="None"?" · "+p.stone:""}`,p.image||""]);
  cats=["All",...new Set(D.map(p=>p[0]))];
  show("All");
  S=catalog.showrooms.map(s=>[s.name,s.image,s.address,s.hours,s.rating,s.phone]);
  FD=catalog.designs.map(design=>[design.name,design.category,design.image]);
  CMS=catalog.content;
  applySiteContent();
  const whatsappNumber=S[0]?.[5]?.replace(/\D/g,"");
  if(whatsappNumber)$("whatsapp-link").href=`https://wa.me/${whatsappNumber}`;
  while(MP.length<S.length)MP.push([60+(MP.length*97)%480,65+(MP.length*53)%125]);
  MP.splice(S.length);
  const activePage=location.hash.match(/^#p-([a-z]+)/)?.[1];
  const contactForm=document.querySelector("#contact-enquiry");
  const contactHasInput=contactForm&&[...contactForm.elements].some(field=>["name","phone","email","message"].includes(field.name)&&field.value);
  if(["product","collection","category","stores","store","about","insights","article","legal"].includes(activePage)||activePage=="contact"&&!contactHasInput){const y=scrollY;route();scrollTo(0,y)}
 }catch(error){console.error("Could not load live website content:",error)}
}
const LG={privacy:["Privacy Policy","We collect only the details you submit (name, phone, email) to answer enquiries and bookings, and handle them as per applicable Indian data protection requirements."],terms:["Terms of Use","Images and rates shown are indicative. The final price is confirmed at the showroom."],shipping:["Shipping, Returns and Exchange","Shipping, return, exchange and price-transparency policies will be added here as approved by Anand Jewels."],hallmark:["Hallmarking and Certification","Our jewellery carries BIS hallmark and purity assurance. Certificates are available on request."],cookie:["Cookie Notice","We use cookies for analytics and to remember your preferences."]};
const AR=[["Gold Purity Guide","Buying Guide","22K gold is 91.6% pure and 18K is 75%. Higher karat means richer colour but softer metal; lower karat is tougher for daily wear."],["Diamond Buying Guide","Buying Guide","Judge a diamond on the 4Cs: cut, colour, clarity and carat. Cut affects sparkle the most."],["Jewellery Care Tips","Care","Store pieces separately, keep them away from perfume and water, and wipe with a soft cloth after wearing."]];
const frm=(b,x="",department="Sales enquiry")=>`<form>${x}<input required name="name" placeholder="Name"><input required name="phone" type="tel" placeholder="Phone"><input type="hidden" name="department" value="${escHTML(department)}">${b}<input name="hp" tabindex="-1" autocomplete="off" style="position:absolute;left:-9999px"><div class="ok">Thank you! We will contact you shortly.</div></form>`;
const productVisual=p=>p[7]?`<img src="${escHTML(p[7])}" alt="${escHTML(p[2])}" loading="lazy" decoding="async">`:`<svg viewBox="0 0 100 100">${ic[p[1]]||ic.Necklaces}</svg>`;
const pc=(p,i=0)=>`<a class="card collection-card-reveal" style="--d:${Math.min(i,5)*.06}s" href="#p-product-${escHTML(p[0])}"><div class="ph">${productVisual(p)}</div><div class="cb"><h3>${escHTML(p[2])}</h3><p>${escHTML(p[3])} ${escHTML(p[4])}${p[3]=="Gold"?"K":p[3]=="Silver"?"%":""} · ${escHTML(p[5])} g${p[6]!="None"?" · "+escHTML(p[6]):""}</p><span style="font-size:13px;color:var(--h)">${inr(pr(p))}*</span></div></a>`;
function ld(o){let s=$("ld");if(!s){s=document.createElement("script");s.id="ld";s.type="application/ld+json";document.head.appendChild(s)}s.textContent=o?JSON.stringify(o):"{}"}
function fc(){const g=i=>$(i).value,o=g("fo");let l=P.filter(p=>(g("fc")=="All"||p[1]==g("fc"))&&(g("fm")=="All"||p[3]==g("fm"))&&(g("fs")=="All"||p[6]==g("fs"))&&pr(p)<=+g("fp"));if(o=="lo")l.sort((a,b)=>pr(a)-pr(b));if(o=="hi")l.sort((a,b)=>pr(b)-pr(a));$("cg2").innerHTML=l.length?l.map((p,i)=>pc(p,i)).join(""):"<p>No designs match these filters.</p>";$("cg2").querySelectorAll(".collection-card-reveal").forEach(e=>io.observe(e))}
function es(mv){const k=+$("mk").value||0,m=mv*k/100,g=(mv+m)*.03;$("eo").innerHTML=`<div><span>Metal value</span><b>${inr(mv)}</b></div><div><span>Making charges</span><b>${inr(m)}</b></div><div><span>GST (3%)</span><b>${inr(g)}</b></div><div class="estimate-total"><span>Estimated total</span><b>${inr(mv+m+g)}</b></div>`}
let FD=[["Ruby Velvet Necklace","Necklaces","collection-ruby-velvet-necklace.webp"],["Floral Pendant Design","Pendants","collection-floral-pendant.webp"],["Diamond Necklace Set","Necklaces","collection-diamond-necklace-set.webp"],["Statement Necklace","Necklaces","collection-statement-necklace.webp"],["Ranihar Antique Necklace","Necklaces","collection-ranihar-antique.webp"],["Emerald Teardrop Earrings","Earrings","collection-emerald-teardrop-earrings.webp"],["Polki Necklace","Necklaces","collection-polki-necklace.webp"]];
const fdc=()=>FD.map(([name,category,image],i)=>`<a class="card collection-card-reveal" style="--d:${Math.min(i,5)*.06}s" data-design-name="${name}" href="#p-contact" aria-label="Enquire about ${name}"><div class="ph"><img src="${image}" alt="${name}" loading="lazy" decoding="async"></div><div class="cb"><h3>${name}</h3><p>${category}</p><span style="font-size:13px;color:var(--h)">Enquire about this design →</span></div></a>`).join("");
function applySiteContent(){
 if(!CMS)return;
 const s=CMS.settings;siteName=s.siteName;T0=`${siteName} – ${s.tagline}`;
 document.title=T0;
 const description=document.querySelector('meta[name="description"]');if(description)description.content=s.description;
 const ogTitle=document.querySelector('meta[property="og:title"]');if(ogTitle)ogTitle.content=T0;
 const structuredData=document.querySelector('script[type="application/ld+json"]');
 if(structuredData){const schema=JSON.parse(structuredData.textContent);schema.name=siteName;schema.slogan=s.tagline;structuredData.textContent=JSON.stringify(schema)}
 $("home-headline").textContent=s.homepageHeadline;
 $("home-featured-title").innerHTML=escHTML(s.featuredTitle).replace(/\r?\n/g,"<br>");
 $("home-years").dataset.n=s.yearsOfTrust;$("home-years").textContent=`${s.yearsOfTrust}+`;
 $("home-showrooms").dataset.n=S.length;$("home-showrooms").textContent=S.length;
 $("home-team").dataset.n=s.teamMembers;$("home-team").textContent=`${s.teamMembers}+`;
 $("home-years-label").textContent=s.yearsLabel;$("home-showrooms-label").textContent=s.showroomsLabel;$("home-team-label").textContent=s.teamLabel;
 document.querySelectorAll("[data-home-chip]").forEach(link=>link.textContent=s[link.dataset.homeChip]);
 const hero=document.querySelector(".hero-photo");if(s.heroImage)hero.style.backgroundImage=`linear-gradient(180deg,rgba(49,27,19,.35),rgba(49,27,19,.08) 42%,rgba(30,14,10,.42)),url("${s.heroImage}")`;
 const banner=document.querySelector(".showroom-banner");if(s.showroomBannerImage)banner.style.backgroundImage=`url("${s.showroomBannerImage}")`;
 $("home-showroom-cta").textContent=s.showroomCta;
 $("home-quote").innerHTML=`“${escHTML(s.homepageQuote).replace(/\r?\n/g,"<br>")}”`;
 const quoteLink=$("home-quote-link");quoteLink.textContent=s.quoteLinkText;quoteLink.href="#p-insights";
 $("footer-tagline").textContent=s.footerTagline;
 const footerLogo=$("footer-logo");if(s.logoImage)footerLogo.src=s.logoImage;footerLogo.alt=siteName;
 const headerLogo=document.querySelector(".brand-mark");if(s.headerLogoImage)headerLogo.src=s.headerLogoImage;
 document.querySelectorAll("[data-site-nav]").forEach(link=>{const key=`nav${link.dataset.siteNav[0].toUpperCase()}${link.dataset.siteNav.slice(1)}`;link.textContent=s[key]});
 for(const [id,url] of [["social-facebook",s.socialFacebook],["social-instagram",s.socialInstagram],["social-linkedin",s.socialLinkedin]]){
  const link=$(id);link.style.display=url?"":"none";
  if(url){link.href=url;link.target="_blank";link.rel="noopener noreferrer"}
 }
 const featured=featuredProducts.filter(p=>p.image).slice(0,3);
 $("home-featured-items").innerHTML=featured.map((p,i)=>`<a class="rv" style="--d:${(i+1)*.08}s" href="#p-product-${encodeURIComponent(p[0])}"><img src="${escHTML(p[7])}" alt="${escHTML(p[2])}" loading="lazy" decoding="async"></a>`).join("");
 $("home-featured-items").querySelectorAll(".rv").forEach(el=>io.observe(el));
}
const productViewMarkup=(p,mv,rel)=>`
<div class="product-detail">
<div class="product-gallery rv l"><div class="product-image-frame">${productVisual(p)}<button class="product-zoom-toggle" type="button" aria-label="Zoom product image" aria-pressed="false"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"></circle><path d="M15.5 15.5 21 21M10.5 8v5M8 10.5h5"></path></svg><span>Zoom for detail</span></button></div><div class="product-image-caption"><span>${escHTML(p[1])} collection</span><span>Anand Jewels</span></div></div>
<div class="product-info">
<p class="product-kicker rv" style="--d:.06s"><span></span>${escHTML(p[1])} · Fine Jewellery</p>
<h1 class="product-title rv" style="--d:.12s">${escHTML(p[2])}</h1>
<div class="product-credibility rv" style="--d:.18s"><span class="badge"><span aria-hidden="true">✓</span> BIS Hallmarked</span><span class="badge"><span aria-hidden="true">✓</span> Certificate available</span></div>
<div class="product-spec-heading rv" style="--d:.22s"><span>Product details</span><span>01 — 04</span></div>
<table class="spc" aria-label="${escHTML(p[2])} specifications"><tbody>
<tr class="rv" style="--d:.24s"><th scope="row">Metal</th><td>${escHTML(p[3])}</td></tr>
<tr class="rv" style="--d:.29s"><th scope="row">Purity</th><td>${escHTML(p[4])}${p[3]=="Gold"?"K":p[3]=="Silver"?"%":""}</td></tr>
<tr class="rv" style="--d:.34s"><th scope="row">Gross weight</th><td>${escHTML(p[5])} g</td></tr>
<tr class="rv" style="--d:.39s"><th scope="row">Stone</th><td>${p[6]=="None"?"Plain metal":escHTML(p[6])}</td></tr>
</tbody></table>
<section class="est rv" style="--d:.44s" aria-labelledby="estimate-title">
<div class="est-head"><div><span class="est-overline">PERSONALISED ESTIMATE</span><h2 id="estimate-title">Price estimator</h2></div><span class="est-currency" aria-hidden="true">₹</span></div>
<p class="est-intro">Adjust making charges to explore an indicative total.</p>
<div class="estimate-control"><label for="mk">Making charges</label><div class="estimate-input"><input id="mk" type="number" min="0" max="100" step="1" value="12" aria-label="Making charges percentage" oninput="es(${mv})"><span>%</span></div></div>
<div class="estimate-breakdown" id="eo" aria-live="polite"></div>
<p class="est-note">Illustrative estimate based on sample rates. Final price is confirmed at the showroom.</p>
</section>
<div class="product-actions rv" style="--d:.5s"><a class="btn product-primary" href="#p-contact">Enquire about this piece <span aria-hidden="true">→</span></a><a class="product-secondary" href="#p-stores">Visit a showroom</a></div>
</div>
</div>
<section class="related-products"><div class="related-heading"><p class="product-kicker"><span></span>Discover more</p><h2>You may also like</h2></div><div class="grid related-grid">${rel.map(pc).join("")}</div></section>`;
const setZoomOrigin=(frame,event)=>{const r=frame.getBoundingClientRect();frame.style.setProperty("--zoom-x",`${Math.max(0,Math.min(100,(event.clientX-r.left)/r.width*100))}%`);frame.style.setProperty("--zoom-y",`${Math.max(0,Math.min(100,(event.clientY-r.top)/r.height*100))}%`)};
function toggleProductZoom(frame,button){const zoomed=frame.classList.toggle("zoomed");button.setAttribute("aria-pressed",String(zoomed));button.setAttribute("aria-label",zoomed?"Reset product image zoom":"Zoom product image");button.querySelector("span").textContent=zoomed?"Reset zoom":"Zoom for detail"}
document.addEventListener("pointermove",e=>{if(!fine)return;const frame=e.target.closest(".product-image-frame");if(frame)setZoomOrigin(frame,e)},{passive:true});
document.addEventListener("pointerdown",e=>{const frame=e.target.closest(".product-image-frame");if(!frame||e.pointerType=="mouse"||e.target.closest(".product-zoom-toggle"))return;setZoomOrigin(frame,e);if(!frame.classList.contains("zoomed"))toggleProductZoom(frame,frame.querySelector(".product-zoom-toggle"))},{passive:true});
document.addEventListener("click",e=>{const button=e.target.closest(".product-zoom-toggle");if(button)toggleProductZoom(button.closest(".product-image-frame"),button)});
function renderCmsAbout(a){
 const paragraphs=a.paragraphs.map((text,i)=>`<p class="rv" style="--d:${Math.min(i,8)*.06}s">${escHTML(text)}</p>`).join("");
 const milestones=a.milestones.map((item,i)=>`<li class="rv" style="--d:${Math.min(i+1,8)*.08}s"><strong>${escHTML(item.year)}</strong><span>${escHTML(item.title)}</span><b>${escHTML(item.location)}</b></li>`).join("");
 const stories=a.stories.map((story,i)=>`<article class="about-story rv" style="--d:${Math.min(i,8)*.07}s"><div class="about-story-copy"><span>${escHTML(story.label)}</span><h3>${escHTML(story.title)}</h3><p>${escHTML(story.body)}</p></div>${story.image?`<img src="${escHTML(story.image)}" alt="${escHTML(story.alt)}" loading="lazy" decoding="async">`:""}</article>`).join("");
 return[a.title,`<section class="about-intro about-band"><div class="about-inner">
<div class="about-label rv l" style="--d:.05s"><h1>${escHTML(a.title)}</h1></div><div class="about-copy">${paragraphs}</div></div></section>
<section class="about-growth about-band" aria-labelledby="about-growth-title"><div class="about-inner"><h2 class="rv" id="about-growth-title">${escHTML(a.growthTitle)}</h2><ol class="growth-list rv">${milestones}</ol></div></section>
<section class="about-journey about-band" aria-labelledby="about-journey-title"><div class="about-inner"><h2 class="rv" id="about-journey-title">${escHTML(a.journeyTitle).replace(/\n/g,"<br>")}</h2><div class="about-stories">${stories}</div></div></section>`];
}
const aboutPage=()=>CMS?renderCmsAbout(CMS.about):["About Us",`
<section class="about-intro about-band"><div class="about-inner">
<div class="about-label rv l" style="--d:.05s"><h1>About us</h1></div>
<div class="about-copy">
<p class="rv" style="--d:.08s">At Anand Jewels, we have always believed that the joy of owning beautiful jewellery should come with something equally precious — complete trust in what you are paying for. That belief has shaped us since 2015.</p>
<p class="rv" style="--d:.14s">For us, beautiful jewels are more than exquisite designs. They are pieces chosen with an eye for craftsmanship, quality and timeless appeal — jewellery made to celebrate today and remain meaningful for years to come.</p>
<p class="rv" style="--d:.2s">And honest prices are more than a promise. They reflect the way we believe jewellery should be offered: with transparency, fairness and a relationship with our customers that matters far beyond a single purchase.</p>
<p class="rv" style="--d:.26s">From gold and diamonds to Polki and silver, every collection at Anand Jewels carries this philosophy at its heart. As we have grown across Indore, Bhopal and Raipur, the scale of our world may have changed, but the principle behind it has remained remarkably simple: to bring you jewellery you will love, at a value you can trust.</p>
<p class="rv" style="--d:.32s">Because to us, that is what Beautiful Jewels at Honest Prices truly means.</p>
<p class="rv" style="--d:.38s">With a deep understanding of the jewellery industry and a passion for craftsmanship, Anand Jewels was envisioned as a brand where exceptional design and uncompromising quality are matched by an equally exceptional customer experience.</p>
<p class="rv" style="--d:.44s">What began as a vision has since grown into a brand shaped by relationships — with its customers, its craft and the generations that return to Anand Jewels for their most meaningful celebrations.</p>
<p class="rv" style="--d:.5s">The house continues to evolve while remaining firmly anchored in the values passed down through generations: quality without compromise, relationships built on trust, and jewellery created to endure beyond trends.</p>
<p class="rv" style="--d:.56s">The journey has never been about building a jewellery business alone. It is about carrying forward a legacy, strengthening a name people can believe in, and creating something meaningful for generations to come.</p>
</div></div></section>
<section class="about-growth about-band" aria-labelledby="about-growth-title"><div class="about-inner">
<h2 class="rv" id="about-growth-title">THE STORY OF OUR GROWTH</h2>
<ol class="growth-list rv">
<li class="rv" style="--d:.08s"><strong>2015</strong><span>The First Anand Jewels Store at</span><b>M.G. Road, Indore</b></li>
<li class="rv" style="--d:.16s"><strong>2020</strong><span>Anand Jewels in Bhopal</span><b>DB Mall, Bhopal</b></li>
<li class="rv" style="--d:.24s"><strong>2022</strong><span>Anand Jewels Expands to</span><b>Pandri, Raipur</b></li>
<li class="rv" style="--d:.32s"><strong>2024</strong><span>EISH by Anand Jewels at</span><b>A.B. Road, Indore</b></li>
<li class="rv" style="--d:.4s"><strong>2025</strong><span>Flagship Store at</span><b>Malviya Nagar, Bhopal</b></li>
</ol></div></section>
<section class="about-journey about-band" aria-labelledby="about-journey-title"><div class="about-inner">
<h2 class="rv" id="about-journey-title">The journey of<br>beautiful Jewels</h2>
<div class="about-stories">
<article class="about-story rv" style="--d:.05s"><div class="about-story-copy"><span>Indore - 2015</span><h3>Where the Anand Jewels Story Began</h3><p>In 2015, Anand Jewels opened its doors on MG Road, Indore, marking the beginning of a new chapter in the Anand family’s jewellery legacy. Built around trust, transparency and a deeply personal approach to jewellery, the Indore showroom became the foundation of the Anand Jewels experience — bringing together thoughtful craftsmanship, refined design and relationships that extend far beyond a purchase.</p></div><img src="indore-showroom.png" alt="Anand Jewels, Indore" loading="lazy" decoding="async"></article>
<article class="about-story rv" style="--d:.12s"><div class="about-story-copy"><span>Bhopal - 2020</span><h3>Taking the Anand Experience Forward</h3><p>In 2020, Anand Jewels expanded to Bhopal with its showroom at DB Mall, bringing its philosophy of beautiful jewellery, honest relationships and personalised service to a new city. The showroom reflects the same commitment to quality and trust in an elegant, welcoming environment.</p></div><img src="db-city-showroom.jpg" alt="Anand Jewels at DB Mall, Bhopal" loading="lazy" decoding="async"></article>
<article class="about-story rv" style="--d:.19s"><div class="about-story-copy"><span>Raipur - 2022</span><h3>A New Chapter in a Growing Legacy</h3><p>The Anand Jewels journey reached Raipur in 2022 with the opening of its showroom at Pandri. Designed to offer a refined and personal jewellery experience, it carries forward the values at the heart of Anand Jewels — craftsmanship, transparency and relationships built to last.</p></div><img src="raipur-showroom.webp" alt="Anand Jewels showroom in Raipur" loading="lazy" decoding="async"></article>
<article class="about-story rv" style="--d:.26s"><div class="about-story-copy"><span>EISH - 2024 <small>by Anand Jewels - Indore</small></span><h3>A Modern Expression of Fine Jewellery</h3><p>Created to make fine jewellery more relevant to the modern woman, EISH by Anand Jewels brings a contemporary perspective to the Anand legacy. Its exclusive 18-carat destination features refined collections in gold, natural diamonds and Polki, with versatile designs for modern, western and Indo-western dressing. Conceptualised by Ishika Anand, EISH reflects her vision of jewellery that feels effortless and individual while retaining Anand’s craftsmanship and trust.</p></div><img src="eish-showroom.jpg" alt="EISH by Anand Jewels in Indore" loading="lazy" decoding="async"></article>
<article class="about-story rv" style="--d:.33s"><div class="about-story-copy"><span>Bhopal - 2025</span><h3>Taking the Anand Experience Forward</h3><p>In 2025, Anand Jewels opened its flagship store at Malviya Nagar, Bhopal, marking an important new chapter in the brand’s journey. The flagship brings together refined interiors, personalised service, craftsmanship and the trust that has shaped Anand Jewels over the years — a destination created for meaningful celebrations, lasting relationships and generations to come.</p></div><img src="bhopal-flagship.png" alt="Anand Jewels flagship store in Bhopal" loading="lazy" decoding="async"></article>
</div></div></section>`];
function renderCmsCollection(c,category){
 const categories=[...new Set(P.map(product=>product[1]))],selected=categories.includes(category)?category:"All";
 const stories=c.stories.map((story,i)=>{
  const type=["diamond","polki","gold"][i]||"all",kind=["diamond","polki","gold"][i]||"extra";
  return`<article class="collection-story collection-story-${kind} rv" style="--d:${Math.min(i,5)*.12}s"><div class="collection-story-copy">
   <span class="collection-story-label">${escHTML(story.name)}</span><h2>${escHTML(story.title)}</h2>
   ${story.paragraphs.map(paragraph=>`<p>${escHTML(paragraph)}</p>`).join("")}
  <a class="collection-story-link" href="${type==="all"?"#p-collection":`#p-category-${type}`}">${escHTML(story.cta)}</a>
  </div><div class="collection-story-photo"><img src="${escHTML(story.image)}" alt="${escHTML(story.alt)}" loading="lazy" decoding="async"></div></article>`;
 }).join("");
 return[c.title,`<div class="collection-page">
  <header class="collection-intro-band rv"><div class="collection-intro-inner"><span class="collection-eyebrow">${escHTML(c.eyebrow)}</span>
   <h1>${escHTML(c.title)}</h1><h2>${escHTML(c.subtitle)}</h2><p>${escHTML(c.description)}</p></div></header>
  <div class="collection-editorials">${stories}</div><div class="collection-signoff rv">${escHTML(c.signoff)}</div>
  <section class="collection-browse" aria-labelledby="collection-browse-title" hidden>
   <div class="collection-browse-heading rv"><span class="collection-eyebrow">FIND YOUR FAVOURITE</span><h2 id="collection-browse-title">${escHTML(c.browseTitle)}</h2><p>${escHTML(c.browseDescription)}</p></div>
   <input id="fc" type="hidden" value="${escHTML(selected)}">
   <div class="collection-category"><span class="collection-filter-label">Category</span><div class="category-options" role="group" aria-label="Filter by category">${["All",...categories].map(value=>`<button type="button" class="category-option ${value==selected?"active":""}" data-category="${escHTML(value)}" aria-pressed="${value==selected}">${escHTML(value)}</button>`).join("")}</div></div>
   <div class="fl2"><label class="collection-filter"><span>Metal</span><select id="fm" onchange="fc()">${op(["Gold","Silver"],"All")}</select></label><label class="collection-filter"><span>Stone</span><select id="fs" onchange="fc()">${op(["Diamond","None"],"All")}</select></label><label class="collection-filter collection-filter-price"><span>Price</span><select id="fp" onchange="fc()"><option value="9999999">Any price</option><option value="50000">Up to ₹50,000</option><option value="100000">Up to ₹1,00,000</option><option value="200000">Up to ₹2,00,000</option></select></label><label class="collection-filter collection-filter-sort"><span>Sort by</span><select id="fo" onchange="fc()"><option value="d">Featured</option><option value="lo">Price: Low to High</option><option value="hi">Price: High to Low</option></select></label></div>
   <div class="grid" id="cg2"></div><p class="collection-price-note">${escHTML(c.priceNote)}</p>
   <div class="collection-more rv" id="more-designs"><h2>${escHTML(c.designsTitle)}</h2><p>${escHTML(c.designsDescription)}</p><div class="grid">${fdc()}</div></div>
  </section></div>`,c.description,null,fc];
}
const categoryGalleries={
 diamond:{title:"Diamond",label:"DIAMOND",message:true,images:[
  ["category-diamond-ring.jpg","Diamond ring on rich red fabric"],
  ["collection-emerald-teardrop-earrings.webp","Diamond and emerald earrings"],
  ["category-diamond-necklace.jpg","Diamond necklace on red velvet"],
  ["category-diamond-statement.jpg","Statement diamond necklace on dark velvet"]
 ]},
 polki:{title:"Polki",label:"POLKI",images:[
  ["category-polki-necklace.jpg","Traditional Polki necklace with coloured gemstones"],
  ["category-polki-bangles.jpg","Gemstone Polki bangles on red fabric"],
  ["category-polki-earrings.jpg","Traditional Polki drop earrings"],
  ["collection-polki-necklace.webp","Polki necklace displayed on a red velvet bust"],
  ["category-polki-bridal-necklace.jpg","Bridal Polki necklace in a red velvet setting"]
 ]},
 gold:{title:"Gold",label:"GOLD",images:[
  ["category-gold-bangles.jpg","Ornate gold bangles on red velvet"],
  ["category-gold-pendant.jpg","Traditional gold pendant necklace"],
  ["category-gold-necklace.jpg","Gold necklace arranged on a carved wooden display"],
  ["category-gold-bracelet.jpg","Gold bracelets presented by hand"],
  ["category-gold-bridal-set.jpg","Gold bridal necklace and earrings"]
 ]}
};
function renderCategoryPage(id){
 const gallery=categoryGalleries[id];if(!gallery)return V.nf();
 const collection=CMS?.collection||{eyebrow:"ANAND JEWELS · THE COLLECTION",title:"Our Collection",subtitle:"Crafted for Every Story",description:"From timeless traditions to contemporary expressions, discover jewellery created with thoughtful design, refined craftsmanship and the trust of Anand Jewels."};
 const story=CMS?.collection?.stories.find(item=>item.name.toLowerCase().includes(id));
 const label=story?.name||gallery.label;
 const images=gallery.images.map(([src,alt],index)=>`<figure class="category-mosaic-image category-mosaic-image-${index+1}"><img src="${escHTML(src)}" alt="${escHTML(alt)}" loading="lazy" decoding="async"></figure>`).join("");
 const message=gallery.message?'<p class="category-mosaic-message">Beautiful Jewels<br>at Honest Prices</p>':"";
 return[`${gallery.title} Jewellery`,`<div class="collection-page category-detail-page">
  <header class="collection-intro-band rv"><div class="collection-intro-inner"><span class="collection-eyebrow">${escHTML(collection.eyebrow)}</span><h1>${escHTML(collection.title)}</h1><h2>${escHTML(collection.subtitle)}</h2><p>${escHTML(collection.description)}</p></div></header>
  <section class="category-mosaic category-mosaic-${id}" aria-label="${escHTML(gallery.title)} jewellery collection"><div class="category-mosaic-label">${escHTML(label)}</div>${images}${message}</section>
 </div>`,collection.description];
}
const V={
about:aboutPage,
category:renderCategoryPage,
collection:a=>{
 if(CMS)return renderCmsCollection(CMS.collection,a);
 const C=[...new Set(P.map(p=>p[1]))],selected=C.includes(a)?a:"All";
 const stories=[
  {name:"DIAMOND",title:"Brilliance Refined.",key:"diamond",cta:"Explore Diamond Jewellery",image:"collection-diamond-reference.jpg",alt:"Diamond and emerald necklace on red fabric",copy:["Elegant, contemporary and effortlessly timeless, our diamond jewellery is designed to celebrate life's most meaningful moments.","From understated everyday pieces to striking occasion jewellery, every creation brings together refined design, exceptional craftsmanship and enduring brilliance."]},
  {name:"POLKI",title:"Tradition, Reimagined.",key:"polki",cta:"Explore Polki Jewellery",image:"collection-polki-necklace.webp",alt:"Traditional Polki necklace with green stones and pearls",copy:["Rooted in heritage and crafted for today, our Polki jewellery celebrates the beauty of Indian craftsmanship through intricate details, graceful forms and timeless character.","Designed for weddings, celebrations and moments meant to be remembered, each piece carries tradition forward with a distinctive Anand Jewels expression."]},
  {name:"GOLD",title:"Timeless by Nature.",key:"gold",cta:"Explore Gold Jewellery",image:"collection-gold-reference.jpg",alt:"Gold jewellery displayed against a warm neutral background",copy:["Gold has always been part of life's most cherished celebrations.","Our gold jewellery blends classic craftsmanship with contemporary design, creating pieces that feel equally beautiful for everyday moments, festive occasions and generations to come."]}
 ];
 return["Jewellery Collection",`<div class="collection-page">
  <header class="collection-intro-band rv">
   <div class="collection-intro-inner">
    <span class="collection-eyebrow">ANAND JEWELS · THE COLLECTION</span>
    <h1>Our Collection</h1>
    <h2>Crafted for Every Story</h2>
    <p>From timeless traditions to contemporary expressions, discover jewellery created with thoughtful design, refined craftsmanship and the trust of Anand Jewels.</p>
   </div>
  </header>
  <div class="collection-editorials">
   <article class="collection-story collection-story-diamond rv" aria-labelledby="collection-diamond-title" style="--d:.12s">
    <div class="collection-story-copy">
     <span class="collection-story-label">${stories[0].name}</span>
     <h2 id="collection-diamond-title">${stories[0].title}</h2>
     ${stories[0].copy.map(text=>`<p>${text}</p>`).join("")}
     <a class="collection-story-link" href="#p-category-diamond">${stories[0].cta}</a>
    </div>
    <div class="collection-story-photo"><img src="${stories[0].image}" alt="${stories[0].alt}" loading="eager" decoding="async"></div>
   </article>
   <article class="collection-story collection-story-polki rv" aria-labelledby="collection-polki-title" style="--d:.24s">
    <div class="collection-story-copy">
     <span class="collection-story-label">${stories[1].name}</span>
     <h2 id="collection-polki-title">Tradition,<br>Reimagined.</h2>
     ${stories[1].copy.map(text=>`<p>${text}</p>`).join("")}
     <a class="collection-story-link" href="#p-category-polki">${stories[1].cta}</a>
    </div>
    <div class="collection-story-photo"><img src="${stories[1].image}" alt="${stories[1].alt}" loading="lazy" decoding="async"></div>
    <div class="collection-story-spacer" aria-hidden="true"></div>
   </article>
   <article class="collection-story collection-story-gold rv" aria-labelledby="collection-gold-title" style="--d:.36s">
    <div class="collection-story-copy">
     <span class="collection-story-label">${stories[2].name}</span>
     <h2 id="collection-gold-title">${stories[2].title}</h2>
     ${stories[2].copy.map(text=>`<p>${text}</p>`).join("")}
     <a class="collection-story-link" href="#p-category-gold">${stories[2].cta}</a>
    </div>
    <div class="collection-story-photo"><img src="${stories[2].image}" alt="${stories[2].alt}" loading="lazy" decoding="async"></div>
   </article>
  </div>
  <div class="collection-signoff rv">Beautiful Jewels at Honest Prices</div>
  <section class="collection-browse" aria-labelledby="collection-browse-title" hidden>
   <div class="collection-browse-heading rv"><span class="collection-eyebrow">FIND YOUR FAVOURITE</span><h2 id="collection-browse-title">Explore every design</h2><p>Filter the collection to find a piece that feels like you.</p></div>
   <input id="fc" type="hidden" value="${escHTML(selected)}">
   <div class="collection-category"><span class="collection-filter-label">Category</span><div class="category-options" role="group" aria-label="Filter by category">${["All",...C].map(c=>`<button type="button" class="category-option ${c==selected?"active":""}" data-category="${escHTML(c)}" aria-pressed="${c==selected}">${escHTML(c)}</button>`).join("")}</div></div>
   <div class="fl2"><label class="collection-filter"><span>Metal</span><select id="fm" onchange="fc()">${op(["Gold","Silver"],["Gold","Silver"].includes(a)?a:"All")}</select></label><label class="collection-filter"><span>Stone</span><select id="fs" onchange="fc()">${op(["Diamond","None"],a=="Diamond"?a:"All")}</select></label><label class="collection-filter collection-filter-price"><span>Price</span><select id="fp" onchange="fc()"><option value="9999999">Any price</option><option value="50000">Up to ₹50,000</option><option value="100000">Up to ₹1,00,000</option><option value="200000">Up to ₹2,00,000</option></select></label><label class="collection-filter collection-filter-sort"><span>Sort by</span><select id="fo" onchange="fc()"><option value="d">Featured</option><option value="lo">Price: Low to High</option><option value="hi">Price: High to Low</option></select></label></div>
   <div class="grid" id="cg2"></div><p class="collection-price-note">*Indicative prices at demo rates. Final price is confirmed at the showroom.</p>
   <div class="collection-more rv" id="more-designs"><h2>More designs to discover</h2><p>Explore additional pieces from the Anand Jewels collection.</p><div class="grid">${fdc()}</div></div>
  </section>
 </div>`,"",null,fc]},
product:a=>{const p=P.find(x=>x[0]==a);if(!p)return V.nf();const mv=pr(p),rel=P.filter(x=>x[1]==p[1]&&x!=p).concat(P.filter(x=>x[1]!=p[1])).slice(0,3);return[p[2],`${bc('<a href="#p-collection">Collection</a>',escHTML(p[2]))}${productViewMarkup(p,mv,rel)}`,p[2]+" in "+p[3],{"@context":"https://schema.org","@type":"Product",name:p[2],brand:"Anand Jewels",material:p[3],weight:p[5]+" g",offers:{"@type":"Offer",priceCurrency:"INR",price:Math.round(mv)}},()=>es(mv)]},
stores:()=>["Store Locator",`${bc("Store Locator")}<div class="stores-intro rv"><div><span class="store-eyebrow">COME VISIT US</span><h1>Our 5 Showrooms</h1><p>Step into Anand Jewels and discover a more personal jewellery experience.</p></div><a class="store-nearby" target="_blank" rel="noopener" href="https://www.google.com/maps/search/Anand+Jewels+near+me"><span aria-hidden="true">⌖</span>Find a showroom near me <span aria-hidden="true">↗</span></a></div><svg class="map" viewBox="0 0 600 240"><defs>${MP.map((c,i)=>`<clipPath id="cl${i}"><circle cx="${c[0]}" cy="${c[1]}" r="24"/></clipPath>`).join("")}</defs>${MP.map((c,i)=>`<a href="#p-store-${i+1}" aria-label="View ${S[i][0]} showroom"><g class="pn"><circle cx="${c[0]}" cy="${c[1]}" r="27" fill="#f3dc8a"/><image href="${S[i][1]}" x="${c[0]-24}" y="${c[1]-24}" width="48" height="48" preserveAspectRatio="xMidYMid slice" clip-path="url(#cl${i})"/></g><text x="${c[0]}" y="${c[1]+46}" fill="#f3dc8a" font-size="12.5" text-anchor="middle">${S[i][0]}</text></a>`).join("")}</svg><p class="store-guide rv">Choose a showroom to explore its details and plan your visit.</p><div class="shops">${S.map(storeCard).join("")}</div>`],
store:a=>{const s=S[a-1];if(!s)return V.nf();const [name,image,addr,hrs,rate]=s;return[name,`${bc('<a href="#p-stores">Showrooms</a>',name)}<div class="pd"><img src="${image}" alt="${name} showroom" style="width:100%;border-radius:20px;max-height:480px;object-fit:cover"><div><h1>${name}</h1><p>📍 ${addr}</p><p>🕒 ${hrs}</p>${rate?`<p>⭐ ${rate}</p>`:""}<p><a href="tel:+910000000000" style="color:var(--h)">📞 Call</a></p><a class="btn" target="_blank" rel="noopener" href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent("Anand Jewels "+(addr.startsWith("Address")?name:addr))}" style="color:var(--m2)">Get Directions</a></div></div><h2>Book a Visit</h2>${frm('<input required type="date"><button class="btn f">Confirm Appointment</button>')}`,"Visit Anand Jewels "+name,{"@context":"https://schema.org","@type":"JewelryStore",name:"Anand Jewels "+name}]},
contact:()=>{
 const settings=CMS?.settings||{};
 const contactTitle=(settings.contactTitle||"Let’s talk,\njewellery.").split(/\r?\n/);
 const flagship=S[0]||["Bhopal Flagship","","19, Malviya Nagar, Bhopal, Madhya Pradesh 462003","Open daily · 11:30 AM – 9:30 PM","",""];
 const address=flagship[2],showroomName=flagship[0],showroomHours=flagship[3];
 const query=encodeURIComponent(`Anand Jewels, ${address}`);
 const directions=`https://www.google.com/maps/search/?api=1&query=${query}`;
 const map=`https://maps.google.com/maps?q=${query}&output=embed`;
 return["Contact Us",`${bc("Contact Us")}<section class="contact-page" aria-labelledby="contact-title">
  <div class="contact-hero rv">
   <div class="contact-hero-copy">
    <span class="contact-eyebrow">CONTACT ANAND JEWELS</span>
    <h1 id="contact-title">${escHTML(contactTitle[0])}${contactTitle[1]?`<br><em>${escHTML(contactTitle.slice(1).join(" "))}</em>`:""}</h1>
    <p>${escHTML(settings.contactIntro||"Questions, custom designs, or planning a visit? Our team is happy to help.")}</p>
    <button class="contact-hero-action" type="button" data-contact-scroll>Send an enquiry <span aria-hidden="true">↘</span></button>
   </div>
  </div>
  <div class="contact-grid">
   <div class="contact-details rv l" style="--d:.08s">
    <span class="contact-overline">VISIT OUR ${escHTML(showroomName.toUpperCase())}</span>
    <h2>Come by for a visit.</h2>
    <p class="contact-description">Explore the collection in person, discuss a custom design, or plan a visit with our team.</p>
    <div class="contact-location-card">
     <span class="contact-location-icon" aria-hidden="true">⌖</span>
     <div><span class="contact-card-label">VISIT OUR FLAGSHIP</span><h3>${escHTML(showroomName)}</h3><p>${escHTML(address)}</p></div>
    </div>
    <div class="contact-hours"><span class="contact-hours-icon" aria-hidden="true">◷</span><div><span class="contact-card-label">SHOWROOM HOURS</span><strong>${escHTML(showroomHours)}</strong></div></div>
    <p class="contact-note">Can’t visit today? Send us an enquiry and we’ll be happy to help.</p>
   </div>
   <form class="contact-form rv r" id="contact-enquiry" style="--d:.14s">
    <div class="contact-form-heading"><span class="contact-card-label">A NOTE TO OUR TEAM</span><h2>How can we help?</h2><p>Share a few details and we’ll be in touch.</p></div>
    <div class="contact-fields">
     <label class="contact-field">Full name<input id="contact-name" name="name" type="text" autocomplete="name" placeholder="Your name" required></label>
     <label class="contact-field">Phone number<input name="phone" type="tel" autocomplete="tel" placeholder="Your phone number" required></label>
     <label class="contact-field contact-field-wide">Email address <span class="contact-optional">(optional)</span><input name="email" type="email" autocomplete="email" placeholder="you@example.com"></label>
     <label class="contact-field contact-field-wide">What can we help with?<select name="department"><option>Sales enquiry</option><option>Custom design</option><option>Book a showroom visit</option><option>Order support</option></select></label>
     <label class="contact-field contact-field-wide">Your message<textarea name="message" rows="4" placeholder="Tell us what you have in mind"></textarea></label>
    </div>
    <input class="contact-honeypot" name="hp" tabindex="-1" autocomplete="off" aria-hidden="true">
    <button class="btn contact-submit" type="submit">Send enquiry <span aria-hidden="true">→</span></button>
    <p class="contact-privacy">Your details are only used to respond to your enquiry.</p>
    <div class="ok" role="status" aria-live="polite">Thank you! We’ll be in touch shortly.</div>
   </form>
  </div>
  <div class="contact-map-section rv" style="--d:.1s">
   <div class="contact-map-heading"><div><span class="contact-overline">COME VISIT US</span><h2>Find our showroom</h2></div><a href="${directions}" target="_blank" rel="noopener">Get directions <span aria-hidden="true">↗</span></a></div>
   <div class="contact-map-frame"><iframe title="Map to ${escHTML(showroomName)}" src="${map}" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe></div>
   <div class="contact-map-caption"><span><span aria-hidden="true">⌖</span> ${escHTML(address)}</span><a href="${directions}" target="_blank" rel="noopener">Open in Google Maps <span aria-hidden="true">↗</span></a></div>
  </div>
 </section>`];
},
insights:()=>["The Anand Insights",`${bc("Insights")}<h1>The Anand Insights</h1><p>Buying guides, care tips, trends and festive collections.</p><div class="grid" style="margin-top:26px">${AR.map((x,i)=>`<a class="card" href="#p-article-${i}"><div class="cb"><small style="color:var(--g)">${x[1].toUpperCase()}</small><h3>${x[0]}</h3><p>${x[2].slice(0,70)}…</p></div></a>`).join("")}</div>`],
article:a=>{const x=AR[a];if(!x)return V.nf();return[x[0],`${bc('<a href="#p-insights">Insights</a>',x[0])}<h1>${x[0]}</h1><p>By Anand Jewels Editorial · ${x[1]} · Date to be added</p><p style="color:var(--ink);font-size:17px">${x[2]}</p><a class="btn" target="_blank" rel="noopener" href="https://wa.me/?text=${encodeURIComponent(x[0])}" style="color:var(--m2)">Share on WhatsApp</a><h2>Related posts</h2>${AR.map((y,i)=>i==a?"":`<a class="pk" href="#p-article-${i}">${y[0]}</a>`).join("")}`,x[2],{"@context":"https://schema.org","@type":"Article",headline:x[0],author:"Anand Jewels"}]},
legal:a=>{const x=LG[a]||LG.privacy;return[x[0],`${bc(x[0])}<h1>${x[0]}</h1><div style="margin:18px 0">${Object.keys(LG).map(k=>`<a class="pk ${LG[k]==x?"a":""}" href="#p-legal-${k}">${LG[k][0]}</a>`).join("")}</div><p style="color:var(--ink)">${x[1]}</p><p style="font-size:12px">Draft text, to be finalised by Anand Jewels.</p>`]},
sitemap:()=>["Sitemap",`${bc("Sitemap")}<h1>Sitemap</h1><ul style="line-height:2.2;margin-top:16px">${["about","collection","stores","insights","contact","legal-privacy","legal-terms","legal-shipping","legal-hallmark","legal-cookie"].map(k=>`<li><a href="#p-${k}" style="color:var(--h)">${k.replace("-"," · ")}</a></li>`).join("")}</ul>`],
nf:()=>["Page not found",`<div style="text-align:center;padding:60px 0"><h1>404</h1><p>This page could not be found.</p><a class="btn" href="#home" style="color:var(--m2);margin-top:16px">Back to Home</a></div>`]};
const legacyInsights=V.insights,legacyArticle=V.article,legacyLegal=V.legal,legacySitemap=V.sitemap;
function renderCmsInsights(data){
 return[data.title,`${bc(escHTML(data.title))}<h1>${escHTML(data.title)}</h1><p>${escHTML(data.description)}</p><div class="grid" style="margin-top:26px">${data.articles.map(article=>`<a class="card" href="#p-article-${encodeURIComponent(article.id)}"><div class="cb"><small style="color:var(--g)">${escHTML(article.category.toUpperCase())}</small><h3>${escHTML(article.title)}</h3><p>${escHTML(article.excerpt)}</p></div></a>`).join("")}</div>`];
}
function renderCmsArticle(id){
 const article=CMS.insights.articles.find(item=>item.id===id);if(!article)return V.nf();
 const related=CMS.insights.articles.filter(item=>item.id!==id).slice(0,3);
 const paragraphs=article.body.split(/\r?\n/).filter(Boolean).map(text=>`<p style="color:var(--ink);font-size:17px">${escHTML(text)}</p>`).join("");
 const number=S[0]?.[5]?.replace(/\D/g,"")||"";
 return[article.title,`${bc(`<a href="#p-insights">${escHTML(CMS.insights.title)}</a>`,escHTML(article.title))}<h1>${escHTML(article.title)}</h1><p>By ${escHTML(CMS.insights.author)} · ${escHTML(article.category)}</p>${paragraphs}<a class="btn" target="_blank" rel="noopener" href="https://wa.me/${number}?text=${encodeURIComponent(article.title)}" style="color:var(--m2)">Share on WhatsApp</a><h2>Related posts</h2>${related.map(item=>`<a class="pk" href="#p-article-${encodeURIComponent(item.id)}">${escHTML(item.title)}</a>`).join("")}`,article.excerpt,{"@context":"https://schema.org","@type":"Article",headline:article.title,author:CMS.insights.author}];
}
function renderCmsPolicy(id){
 const policy=CMS.policies.find(item=>item.id===id)||CMS.policies[0];if(!policy)return V.nf();
 return[policy.title,`${bc(escHTML(policy.title))}<h1>${escHTML(policy.title)}</h1><div style="margin:18px 0">${CMS.policies.map(item=>`<a class="pk ${item.id===policy.id?"a":""}" href="#p-legal-${encodeURIComponent(item.id)}">${escHTML(item.title)}</a>`).join("")}</div>${policy.body.split(/\r?\n/).filter(Boolean).map(text=>`<p style="color:var(--ink)">${escHTML(text)}</p>`).join("")}`];
}
V.insights=()=>CMS?renderCmsInsights(CMS.insights):legacyInsights();
V.article=id=>CMS?renderCmsArticle(id):legacyArticle(id);
V.legal=id=>CMS?renderCmsPolicy(id):legacyLegal(id);
V.sitemap=()=>CMS?["Sitemap",`${bc("Sitemap")}<h1>Sitemap</h1><ul style="line-height:2.2;margin-top:16px">${["about","collection","stores","insights","contact",...CMS.policies.map(policy=>`legal-${policy.id}`)].map(key=>`<li><a href="#p-${encodeURIComponent(key)}" style="color:var(--h)">${escHTML(key.replace("-"," · "))}</a></li>`).join("")}</ul>`]:legacySitemap();
function route(){const h=hashValue(),hv=$("hv"),pg=$("pg"),on=h.startsWith("p-");$("hd").classList.toggle("pg",on);document.title=T0;ld(null);
if(!on){document.body.classList.remove("product-page-active","about-page-active","contact-page-active");pg.classList.remove("contact-page-active");hv.style.display="";pg.style.display="none";if(h){const t=$(h);t&&t.scrollIntoView()}return}
const [,k,...r]=h.split("-"),x=(V[k]||V.nf)(r.join("-"))||V.nf();pg.classList.toggle("about-page-active",k=="about");pg.classList.toggle("collection-page-active",k=="collection"||k=="category");pg.classList.toggle("category-page-active",k=="category");pg.classList.toggle("product-page-active",k=="product");document.body.classList.toggle("product-page-active",k=="product");document.body.classList.toggle("about-page-active",k=="about");document.body.classList.toggle("contact-page-active",k=="contact");hv.style.display="none";pg.style.display="block";pg.innerHTML=k=="category"?x[1]:`<div class="wrap">${x[1]}</div>`;document.title=x[0]+" – "+siteName;
pg.classList.toggle("contact-page-active",k=="contact");
const contactScroll=pg.querySelector("[data-contact-scroll]");
if(contactScroll)contactScroll.addEventListener("click",()=>pg.querySelector("#contact-enquiry").scrollIntoView({behavior:matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth",block:"center"}));
const storesHeading=pg.querySelector(".stores-intro h1");if(k=="stores"&&storesHeading)storesHeading.textContent=(CMS?.settings.storesTitle||"Our {count} Showrooms").replace("{count}",S.length);
if(k=="stores"&&CMS?.settings.storesDescription){const description=pg.querySelector(".stores-intro p");if(description)description.textContent=CMS.settings.storesDescription}
if(k=="store"){const phone=pg.querySelector('.pd a[href^="tel:"]');if(phone&&S[Number(r.join("-"))-1]?.[5])phone.href=`tel:${S[Number(r.join("-"))-1][5]}`;const visitDate=pg.querySelector('input[type="date"]');if(visitDate)visitDate.name="visitDate";const department=pg.querySelector('input[name="department"]');if(department)department.value="Book a showroom visit"}
const categoryOptions=pg.querySelector(".category-options");if(categoryOptions)categoryOptions.addEventListener("click",e=>{const b=e.target.closest(".category-option");if(!b)return;$("fc").value=b.dataset.category;categoryOptions.querySelectorAll(".category-option").forEach(x=>{const active=x===b;x.classList.toggle("active",active);x.setAttribute("aria-pressed",String(active))});fc()});
if(x[2]){let m=document.querySelector('meta[name=description]');m&&m.setAttribute("content",x[2])}x[3]&&ld(x[3]);x[4]&&x[4]();scrollTo(0,0);pg.querySelectorAll(".rv,.collection-card-reveal").forEach(e=>io.observe(e))}
addEventListener("hashchange",route);route();loadPublicCatalog();
document.addEventListener("click",e=>{const link=e.target.closest(".product-primary");if(!link)return;const id=location.hash.match(/^#p-product-(.+)$/)?.[1],product=P.find(p=>String(p[0])==id);if(product)try{sessionStorage.setItem("enquiryProduct",product[2])}catch(error){console.warn("Could not save product enquiry context:",error)}});
document.addEventListener("submit",async e=>{
 if(!e.target.closest("#pg"))return;
 e.preventDefault();
 const f=e.target,hp=f.querySelector('[name=hp]');
 if(hp?.value)return;
 const success=f.querySelector(".ok");
 try{
  const values=Object.fromEntries(new FormData(f).entries());
  try{values.product=sessionStorage.getItem("enquiryProduct")||""}catch(error){console.warn("Could not load product enquiry context:",error)}
  const storeMatch=location.hash.match(/^#p-store-(\d+)$/);
  if(storeMatch)values.showroom=S[Number(storeMatch[1])-1]?.[0]||"";
  if(f.querySelector('[name=visitDate]'))values.visitDate=f.querySelector('[name=visitDate]').value;
  const response=await fetch("/api/public/enquiries",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(values)});
  const result=await response.json();
  if(!response.ok)throw new Error(result.error||"Your enquiry could not be sent.");
  success.style.display="block";success.textContent="Thank you! We’ll be in touch shortly.";
  f.reset();try{sessionStorage.removeItem("enquiryProduct")}catch(error){console.warn("Could not clear product enquiry context:",error)}
 }catch(error){
  if(success){success.style.display="block";success.style.color="#a63636";success.textContent=error.message}
 }
});
const so=document.createElement("div");so.id="so";so.innerHTML='<input id="si" placeholder="Search rings, necklaces, gold…"><div id="sr2"></div>';document.body.appendChild(so);
$("sb").onclick=()=>{so.classList.add("o");$("si").focus()};so.onclick=e=>{if(e.target==so||e.target.tagName=="A")so.classList.remove("o")};addEventListener("keydown",e=>e.key=="Escape"&&so.classList.remove("o"));
$("si").oninput=e=>{
 const q=e.target.value.toLowerCase().trim(),results=[];
 if(q){
  for(const category of new Set(P.map(p=>p[1]).filter(category=>category.toLowerCase().includes(q)))){
   const link=document.createElement("a");link.href=`#p-collection-${encodeURIComponent(category)}`;link.textContent=`${category} `;const label=document.createElement("small");label.textContent="category";link.append(label);results.push(link)
  }
  for(const product of P.filter(p=>(p[2]+p[3]+p[6]).toLowerCase().includes(q))){
   const link=document.createElement("a");link.href=`#p-product-${encodeURIComponent(product[0])}`;link.textContent=product[2];results.push(link)
  }
 }
 $("sr2").replaceChildren(...results)
};
try{if(!localStorage.ck){const c=document.createElement("div");c.id="ck";c.innerHTML='We use cookies to improve your experience. <a href="#p-legal-cookie" style="color:var(--g2)">Learn more</a><button class="btn" style="padding:8px 20px">Accept</button>';document.body.appendChild(c);c.querySelector("button").onclick=()=>{try{localStorage.ck=1}catch(e){}c.remove()}}}catch(e){}
