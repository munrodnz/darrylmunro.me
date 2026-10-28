/**
 * Model explorer (website edition). Original explorer by Darryl Munro; adapted
 * for darrylmunro.nz: data comes from the LinkML sources at build time, the
 * graph library is bundled, and suggestions go by email instead of a shared store.
 */
import cytoscape from "cytoscape";

const DATA_EL = document.getElementById("model-data");
const DATA = JSON.parse(DATA_EL.textContent);
const SUGGEST_TO = DATA_EL.dataset.suggestTo;
const $ = (s,el=document)=>el.querySelector(s);
const esc = s => String(s??"").replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const cssv = n => getComputedStyle(document.documentElement).getPropertyValue(n).trim();
const CLIENT = DATA.client.charAt(0).toUpperCase()+DATA.client.slice(1);
const REL = DATA.releases;
let M, C, REF, ANY, SA, curIdx = REL.length-1;

function index(m){
  M=m; C=Object.fromEntries(M.concepts.map(c=>[c.id,c]));
  REF=Object.fromEntries(M.reference_schemes.map(r=>[r.id,{...r,subject_area:"reference",type:"reference"}]));
  ANY=id=>C[id]||REF[id]; SA=Object.fromEntries(M.subject_areas.map(s=>[s.id,s]));
}
const label = id => (ANY(id)||{label:id}).label;
const colour = id => SA[(ANY(id)||{}).subject_area]?.colour||"#888";
const layerTag = l => l==="client"?`<span class="layer layer-client">${esc(CLIENT)}</span>`:l==="pack"?`<span class="layer layer-pack">Pack</span>`:"";
const chip = id => `<button type="button" class="chip" data-go="${esc(id)}"><i style="background:${colour(id)}"></i>${esc(label(id))}</button>`;

/* ---------- static chrome ---------- */
document.querySelectorAll("[data-clientname]").forEach(e=>e.textContent=CLIENT);
const VIEWS=[["method","How it works","Method"],["context","Context","L0"],["areas","Subject areas","L1"],["model","Concepts","L2"],["mapping","Databricks fit","L3"],["lexicon","Lexicon","Lens"],["questions","Questions","Lens"],["decisions","Decisions","Log"],["changes","Changes","Log"],["proposals","Suggest a change","Log"]];
$("#tabs").innerHTML = VIEWS.map(([id,n,s])=>`<a href="#${id}" data-v="${id}"><small>${s}</small>${n}</a>`).join("");
$("#ver").innerHTML = REL.map((r,i)=>`<option value="${i}">${esc(r.version)}${r.status!=="released"?" · "+esc(r.status):""}</option>`).join("");
$("#ver").value = String(curIdx);
const verOpts = REL.map((r,i)=>`<option value="${i}">${esc(r.version)}${r.status!=="released"?" ("+esc(r.status)+")":""}</option>`).join("");
$("#cmp-a").innerHTML=verOpts; $("#cmp-b").innerHTML=verOpts;
$("#cmp-a").value=String(Math.max(0,REL.length-2)); $("#cmp-b").value=String(REL.length-1);

/* ---------- render everything for the selected version ---------- */
function renderAll(){
  index(REL[curIdx].model);
  const latest = curIdx===REL.length-1;
  const ob=$("#oldbanner"); ob.hidden=latest;
  if(!latest) ob.innerHTML=`<span>You are viewing version <b class="mono">${esc(REL[curIdx].version)}</b>, not the latest.</span><button type="button" id="golatest">Show ${esc(REL[REL.length-1].version)}</button>`;
  $("#title").innerHTML = `${esc(M.meta.pack?.name||CLIENT)} <span>Model Explorer</span>`;
  $("#purpose").textContent = M.purpose?.statement||"";
  $("#tb-model").textContent = M.meta.version; $("#tb-pack").textContent = M.meta.pack?.version||"–";
  $("#tb-status").textContent = REL[curIdx].status==="released"?"Released":"Working"; $("#tb-asof").textContent = M.meta.as_of;
  $("#foot").innerHTML = `${esc(M.meta.basis||"")} Prepared by ${esc(M.meta.prepared_by||"")}. Industry pack: ${esc(M.meta.pack?.name||"")} ${esc(M.meta.pack?.version||"")}. Sources: `+(M.meta.sources||[]).map(s=>`<a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.title)}</a>`).join(" · ");

  const lvTarget={L0:"context",L1:"areas",L2:"model",L3:"mapping"};
  $("#levels").innerHTML = (M.levels||[]).map(l=>`<div class="level"><div class="code">${l.id}</div><h3>${esc(l.name)}</h3><p class="q">${esc(l.question)}</p><p class="meta"><span class="lbl">For</span><br>${esc(l.audience)}</p><p class="meta">${esc(l.content)}</p><a href="#${lvTarget[l.id]}">Open ${esc(l.name.toLowerCase())} →</a></div>`).join("");

  /* context */
  if(M.context){
    const g=Object.fromEntries(M.context.groups.map(x=>[x.id,x]));
    const order=[["shareholder","a"],["clients","d"],["owners","f"],["regulators","b"],["suppliers","e"],["public","g"]];
    let h=order.filter(([id])=>g[id]).map(([id,area])=>{const x=g[id];return `<div class="panel grp ga-${area}"><div class="lbl">${esc(x.name)}</div><div class="flow">${esc(x.flow)}</div><ul>${x.parties.map(p=>`<li>${esc(p)}</li>`).join("")}</ul></div>`}).join("");
    h+=`<div class="centre"><div class="lbl">Contractor and operator</div><h3>${esc(M.context.centre.name)}</h3><p class="muted" style="max-width:34ch">${esc(M.context.centre.note)}</p></div>`;
    h+=`<div class="panel grp ga-c"><div class="lbl">Why this matters</div><p style="font-size:.92rem">The organisation holds contracts, not customer accounts. It operates and maintains assets that others own. Its data model starts from <b>Contract</b>, <b>Work order</b> and <b>Infrastructure asset (owned by someone else)</b>, not from meter, tariff and bill.</p></div>`;
    $("#ctx").innerHTML=h; $("#ctx-h").textContent=`Who ${M.context.centre.name} works for, answers to, and works on behalf of`;
  }

  $("#areas").innerHTML = M.subject_areas.map(s=>{
    const items = s.id==="reference"?M.reference_schemes.map(r=>r.id):M.concepts.filter(c=>c.subject_area===s.id).map(c=>c.id);
    return `<div class="panel area" style="--c:${s.colour}" data-area="${s.id}"><h3>${esc(s.name)}</h3><p>${esc(s.blurb)}</p><p class="own"><span class="lbl">Owner</span> ${esc(s.owner_role)}</p><div class="chips">${items.map(chip).join("")}</div></div>`}).join("");

  $("#lex").innerHTML = M.lexicon.map(t=>`<div class="panel term"><div style="display:flex;justify-content:space-between;gap:8px;align-items:baseline"><h3>“${esc(t.term)}”</h3><span class="pill risk-${t.risk}">${t.risk} risk</span></div><ul class="senses">${t.senses.map(s=>`<li>${chip(s.concept)}<span class="muted">${esc(s.context)}</span></li>`).join("")}</ul><p class="g">${esc(t.guidance)}</p></div>`).join("");

  renderFitSummary(); renderMap();

  $("#dilemmas").innerHTML = M.dilemmas.map((d,i)=>`<details class="dl"${i===0?" open":""}><summary><span class="mono muted">${d.id}</span><b>${esc(d.title)}</b>${layerTag(d.layer)}</summary><div class="dbody"><p>${esc(d.context)}</p><div class="opts">${(d.options||[]).map((o,j,a)=>`<div class="opt${j===a.length-1?" rec":""}">${j===a.length-1?'<span class="lbl" style="color:var(--accent)">Chosen</span>':''}<b>${esc(o.name)}</b><span><span class="lbl">Commits us to</span> ${esc(o.commits)}</span><span><span class="lbl">Consequence</span> ${esc(o.consequence)}</span></div>`).join("")}</div><div><span class="lbl">Deciding questions</span><ul class="plain">${(d.deciding_questions||[]).map(q=>`<li>${esc(q)}</li>`).join("")}</ul></div><p class="rec-line"><span class="lbl">Recommendation</span><br>${esc(d.recommendation)}</p>${d.conditions?`<p class="muted"><span class="lbl">Revisit when</span> ${esc(d.conditions)}</p>`:""}</div></details>`).join("");
  $("#assumptions").innerHTML = M.assumptions.map(a=>`<p><span class="mono" style="color:var(--accent)">${a.id}</span> ${esc(a.text)}</p>`).join("")||`<p class="muted">None recorded.</p>`;
  $("#rules").innerHTML = M.rules.map(r=>`<div><span class="mono" style="color:var(--accent)">${r.id}</span> ${esc(r.text)}<br><span class="mono muted">test: ${esc(r.test)}</span>${r.enforced_by?`<br><span class="muted" style="font-size:.85rem">Enforced by: ${esc(r.enforced_by)}</span>`:""}</div>`).join("");
  $("#oq").innerHTML = M.open_questions.map(q=>`<tr><td class="mono">${q.id}</td><td>${esc(q.q)}</td><td class="muted">${esc(q.owner)}</td></tr>`).join("");
  $("#cqs").innerHTML = M.competency_questions.map(q=>`<div class="cqrow"><span class="id">${q.id}</span><div style="display:grid;gap:6px"><span>${esc(q.q)}</span><div class="chips">${q.concepts.filter(ANY).map(chip).join("")}</div></div><button type="button" data-cq="${q.id}">Trace on model</button></div>`).join("");

  $("#f-div").innerHTML = `<option value="">All divisions</option>`+M.divisions.map(d=>`<option value="${d.id}">${esc(d.name)}</option>`).join("");
  $("#f-cq").innerHTML = `<option value="">None</option>`+M.competency_questions.map(q=>`<option value="${q.id}">${q.id} — ${esc(q.q.length>70?q.q.slice(0,68)+"…":q.q)}</option>`).join("");
  $("#p-concept").innerHTML = `<option value="">(Not about one concept)</option>`+[...M.concepts].sort((a,b)=>a.label.localeCompare(b.label)).map(c=>`<option value="${c.id}">${esc(c.label)}</option>`).join("");
  $("#legend").innerHTML = M.subject_areas.filter(s=>s.id!=="reference"||$("#f-ref").checked).map(s=>`<span><i style="background:${s.colour}"></i>${esc(s.name)}</span>`).join("");

  if(selected && !ANY(selected)) selected=null;
  if(cy2){ cy2.destroy(); cy2=null } if(cy1){ cy1.destroy(); cy1=null }
  renderChanges(); renderProposals();
  show();
}

/* ---------- mapping ---------- */
const FITS=[["full","Full","--ok"],["partial","Partial","--warn"],["misfit","Misfit","--bad"],["gap","Gap","--gap"]];
let fitFilter="";
function renderFitSummary(){
  const counts=Object.fromEntries(FITS.map(([f])=>[f,0])); M.concepts.forEach(c=>counts[(M.mapping[c.id]||{fit:"gap"}).fit]++);
  const n=M.concepts.length;
  const tables=(M.reference_models||[]).reduce((a,r)=>a+(r.tables||0),0)||440;
  $("#fitsum").innerHTML = `<div class="fitbar" role="img" aria-label="Fit distribution">${FITS.map(([f,,v])=>`<div style="width:${counts[f]/n*100}%;background:var(${v})" title="${f}: ${counts[f]}"></div>`).join("")}</div>
  <div class="fitsum">${FITS.map(([f,l])=>`<span><span class="pill fit-${f}">${l}</span> <b class="mono" style="font-size:.95rem">${counts[f]}</b> of ${n}</span>`).join("")}<span class="muted">The reference models hold ${tables} tables. This model needs ${n} concepts to answer its ${M.competency_questions.length} questions.</span></div>`;
  $("#fitfilter").innerHTML = `<button type="button" data-f="">All</button>`+FITS.map(([f,l])=>`<button type="button" data-f="${f}">${l}</button>`).join("");
}
function renderMap(){
  const rows=M.concepts.filter(c=>!fitFilter||(M.mapping[c.id]||{}).fit===fitFilter);
  $("#maprows").innerHTML = rows.map(c=>{const m=M.mapping[c.id]||{fit:"gap",products:[],change:""};return `<tr><td>${chip(c.id)}</td><td><span class="pill fit-${m.fit}">${m.fit}</span></td><td>${m.products.map(p=>{const [mod,...r]=p.split(".");return `<span class="prod"><em>${esc(mod)}.</em>${esc(r.join("."))}</span>`}).join("")||'<span class="muted">—</span>'}</td><td style="min-width:240px">${esc(m.change)}</td></tr>`}).join("");
  document.querySelectorAll("#fitfilter button").forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.f===fitFilter)));
}
$("#fitfilter").addEventListener("click",e=>{const b=e.target.closest("button");if(!b)return;fitFilter=b.dataset.f;renderMap()});

/* ---------- graphs ---------- */
let cy1=null, cy2=null, selected=null;
function baseStyle(){
  return [
    {selector:"node",style:{"label":"data(label)","font-family":"Source Sans 3, sans-serif","font-size":12,"color":cssv("--ink"),"text-valign":"bottom","text-margin-y":5,"text-wrap":"wrap","text-max-width":120,"background-color":"data(col)","width":20,"height":20,"border-width":0}},
    {selector:"node[type = 'event']",style:{"shape":"round-diamond","width":22,"height":22}},
    {selector:"node[type = 'reified-relation']",style:{"shape":"hexagon"}},
    {selector:"node[type = 'reference']",style:{"shape":"round-tag","width":16,"height":16}},
    {selector:"node[layer = 'client']",style:{"border-width":2,"border-color":cssv("--accent"),"border-style":"dashed"}},
    {selector:":parent",style:{"background-color":"data(col)","background-opacity":0.07,"border-width":1,"border-color":"data(col)","border-opacity":0.5,"border-style":"solid","label":"data(label)","text-valign":"top","text-halign":"center","font-family":"Outfit, sans-serif","font-size":15,"font-weight":600,"color":"data(col)","text-margin-y":-4,"padding":18,"shape":"round-rectangle"}},
    {selector:"edge",style:{"width":1.1,"line-color":cssv("--ink-3"),"target-arrow-color":cssv("--ink-3"),"target-arrow-shape":"triangle","arrow-scale":0.8,"curve-style":"bezier","opacity":0.3,"label":"","font-size":10,"color":cssv("--ink-2"),"text-background-color":cssv("--sheet"),"text-background-opacity":0.92,"text-background-padding":2,"text-rotation":"autorotate"}},
    {selector:"edge.hl",style:{"opacity":1,"width":2,"line-color":cssv("--accent"),"target-arrow-color":cssv("--accent"),"label":"data(label)","z-index":20}},
    {selector:"node.sel",style:{"border-width":3,"border-color":cssv("--accent"),"border-style":"solid","width":28,"height":28}},
    {selector:"node.hl",style:{"border-width":2,"border-color":cssv("--accent"),"border-style":"solid"}},
    {selector:".dim",style:{"opacity":0.14}},
    {selector:":parent.dim",style:{"opacity":0.35}}
  ];
}
function buildL2(){
  const showRef=$("#f-ref").checked, els=[];
  const ORDER=[["parties","commercial","work","finance"],["resources","places","compliance"].concat(showRef?["reference"]:[])];
  const colW=200,rowH=86,gapX=110,gapY=150,POS={};
  const members=a=>a==="reference"?M.reference_schemes.map(r=>r.id):M.concepts.filter(c=>c.subject_area===a).map(c=>c.id);
  let y=0;
  ORDER.forEach(row=>{let h=0; row.forEach((a,i)=>{members(a).forEach((id,k)=>{POS[id]={x:i*(2*colW+gapX)+(k%2)*colW,y:y+Math.floor(k/2)*rowH}}); h=Math.max(h,Math.ceil(members(a).length/2))}); y+=h*rowH+gapY});
  M.subject_areas.forEach(s=>{ if(s.id!=="reference"||showRef) els.push({data:{id:"sa_"+s.id,label:s.name,col:s.colour}}) });
  M.concepts.forEach(c=>els.push({data:{id:c.id,label:c.label,col:colour(c.id),type:c.type,layer:c.layer||"",parent:"sa_"+c.subject_area}}));
  if(showRef) M.reference_schemes.forEach(r=>els.push({data:{id:r.id,label:r.label,col:SA.reference?.colour||"#888",type:"reference",layer:r.layer||"",parent:"sa_reference"}}));
  M.relations.forEach((r,ri)=>r.to.forEach((t,i)=>{ if((C[r.from]||showRef&&REF[r.from])&&(C[t]||showRef&&REF[t])) els.push({data:{id:"e"+ri+"_"+i,source:r.from,target:t,label:r.label,rid:r.id}}) }));
  if(cy2) cy2.destroy();
  cy2=cytoscape({container:$("#cy2"),elements:els,style:baseStyle(),wheelSensitivity:0.25,minZoom:0.25,maxZoom:2.5,layout:{name:"preset",positions:n=>POS[n.id()],padding:24,fit:true}});
  cy2.on("tap","node",e=>{const id=e.target.id(); if(id.startsWith("sa_")) return; select(id,false)});
  cy2.on("tap",e=>{ if(e.target===cy2){selected=null;applyLens();renderDetail(null)} });
  applyLens();
  $("#legend").innerHTML = M.subject_areas.filter(s=>s.id!=="reference"||showRef).map(s=>`<span><i style="background:${s.colour}"></i>${esc(s.name)}</span>`).join("")+`<span><i style="background:transparent;border:2px dashed var(--accent)"></i>${esc(CLIENT)}-only</span>`;
}
function applyLens(){
  if(!cy2) return;
  cy2.elements().removeClass("dim hl sel");
  const div=$("#f-div").value, cq=$("#f-cq").value; let keep=null;
  if(div) keep=new Set(M.divisions.find(d=>d.id===div).concepts);
  if(cq) keep=new Set(M.competency_questions.find(x=>x.id===cq).concepts);
  if(keep){
    cy2.nodes().not(":parent").forEach(n=>{ if(!keep.has(n.id())) n.addClass("dim"); else if(cq) n.addClass("hl") });
    cy2.edges().forEach(e=>{ const a=keep.has(e.source().id()),b=keep.has(e.target().id()); if(!(a&&b)) e.addClass("dim"); else if(cq) e.addClass("hl") });
    cy2.nodes(":parent").forEach(p=>{ if(p.children().filter(n=>!n.hasClass("dim")).length===0) p.addClass("dim") });
  }
  if(selected&&cy2.getElementById(selected).length){ const n=cy2.getElementById(selected); n.addClass("sel"); n.connectedEdges().addClass("hl").removeClass("dim") }
}
function fitTo(eles){ if(!cy2||!eles.length) return; cy2.fit(eles,70); if(cy2.zoom()>1.3) cy2.zoom(1.3); cy2.center(eles) }
function select(id,center){
  selected=id; applyLens(); renderDetail(id);
  if(center&&cy2){ const n=cy2.getElementById(id); if(n.length) cy2.animate({center:{eles:n},zoom:Math.max(cy2.zoom(),1)},{duration:250}) }
}
function renderDetail(id){
  const d=$("#detail");
  if(!id){ d.innerHTML=`<div class="empty"><div class="lbl">No concept selected</div><p>Select a concept in the graph, or start with one of the concepts most likely to be misread:</p><div class="chips">${["InfrastructureAsset","PlantItem","WorkOrder","CostCollector","Contract","Obligation"].filter(ANY).map(chip).join("")}</div><p class="muted" style="font-size:.88rem">Shapes: circle = class, diamond = event, hexagon = reified relation, tag = reference vocabulary. A dashed outline marks a ${esc(CLIENT)}-only element.</p></div>`; return }
  const c=ANY(id), isRef=!!REF[id]&&!C[id], cf=new Set(c.client_fields||[]);
  const ct=k=>cf.has(k)?layerTag("client"):"";
  const out=M.relations.filter(r=>r.from===id), inn=M.relations.filter(r=>r.to.includes(id));
  const relLine=(r,dir)=>`<div><span class="mono muted">${esc(r.id)}</span>${dir==="out"?`<span class="rl">${esc(r.label)}</span>${r.to.map(chip).join("")}`:`${chip(r.from)}<span class="rl">${esc(r.label)}</span>`}<span class="mono muted">${esc(r.card)}${(r.chars||[]).length?" · "+r.chars.join(", "):""}${r.role?" · role: "+esc(r.role):""}</span></div>`;
  const divs=M.divisions.filter(x=>x.concepts.includes(id)).map(x=>x.name);
  const cqs=M.competency_questions.filter(q=>q.concepts.includes(id)).map(q=>q.id);
  const m=M.mapping[id];
  const f=(k,t)=>c[k]&&(!Array.isArray(c[k])||c[k].length)?`<div><dt>${t}${ct(k==="owner_role"?"owner":k)}</dt><dd>${Array.isArray(c[k])?esc(c[k].join("; ")):esc(c[k])}</dd></div>`:"";
  const props=proposalsFor(id);
  d.innerHTML=`<div class="head"><div style="display:flex;gap:6px;flex-wrap:wrap;align-items:center"><span class="pill" style="background:${colour(id)};color:#fff">${esc(SA[c.subject_area]?.name||"")}</span><span class="pill" style="border:1px solid var(--rule)">${esc(c.type)}</span>${c.rigidity?`<span class="pill" style="border:1px solid var(--rule)">${esc(c.rigidity)}</span>`:""}${layerTag(c.layer)}</div><h3 style="font-size:1.7rem">${esc(c.label)}</h3>${c.alt_labels?.length?`<p class="muted" style="font-size:.88rem">Also called: ${esc(c.alt_labels.join(", "))}</p>`:""}</div>
  <dl>${isRef?`<div><dt>Organising principle</dt><dd>${esc(c.principle)}</dd></div>${c.note?`<div><dt>Note</dt><dd>${esc(c.note)}</dd></div>`:""}<div><dt>Values</dt><dd>${esc((c.values||[]).join(" · ")||"Not listed — see principle")}</dd></div>${c.inherits?.length?`<div><dt>Extends</dt><dd>${c.inherits.map(chip).join("")}</dd></div>`:""}`:`<div><dt>Definition</dt><dd style="font-size:1.02rem">${esc(c.definition)}</dd></div>`}
  ${f("scope","Scope")}${f("excludes","Excludes")}${f("examples","Examples")}${f("non_examples","Not examples")}${f("identity","Identity")}
  ${c.disjoint_with?.length?`<div><dt>Never also a</dt><dd>${c.disjoint_with.map(chip).join("")}</dd></div>`:""}
  ${c.vagueness?`<div class="vague"><dt>Vagueness</dt><dd>${esc(c.vagueness)}</dd>${c.vagueness_decision?`<dt style="margin-top:6px">${esc(CLIENT)} decision ${layerTag("client")}</dt><dd>${esc(c.vagueness_decision)}</dd>`:""}</div>`:""}
  ${c.semantic_change?`<div class="change"><dt>Semantic change${ct("semantic_change")}</dt><dd>${esc(c.semantic_change)}</dd></div>`:""}
  ${f("notes","Notes")}${f("owner_role","Owner")}
  ${c.attributes?.length?`<div><dt>Recorded facts</dt><dd class="attrs">${c.attributes.map(a=>`<div><span>${esc(a.name)}</span> — ${esc(a.description||a.label)}${a.required?" <b>(required)</b>":""}</div>`).join("")}</dd></div>`:""}
  <div><dt>Relations</dt><dd class="rels">${out.map(r=>relLine(r,"out")).join("")}${inn.map(r=>relLine(r,"in")).join("")}</dd></div>
  ${divs.length?`<div><dt>Used by</dt><dd>${esc(divs.join(", "))}</dd></div>`:""}
  ${cqs.length?`<div><dt>Answers</dt><dd class="mono">${cqs.join(" ")}</dd></div>`:""}
  ${m?`<div><dt>Databricks fit</dt><dd><span class="pill fit-${m.fit}">${m.fit}</span> ${m.products.map(p=>`<span class="prod">${esc(p)}</span>`).join("")}<p style="margin-top:6px">${esc(m.change)}</p></dd></div>`:""}
  </dl>
  <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;border-top:1px solid var(--rule-2);padding-top:12px"><button type="button" class="primary" data-propose="${esc(id)}">Suggest a change</button>${props.length?`<a href="#proposals" class="muted" style="font-size:.9rem">${props.filter(p=>p.status==="open").length} open proposal(s)</a>`:""}</div>`;
}
function buildL1(){
  const w={};
  M.relations.forEach(r=>r.to.forEach(t=>{ const a=ANY(r.from)?.subject_area,b=ANY(t)?.subject_area; if(!a||!b||a===b) return; const k=[a,b].sort().join("|"); w[k]=(w[k]||0)+1 }));
  const els=M.subject_areas.map(a=>({data:{id:a.id,label:a.name,col:a.colour,n:a.id==="reference"?M.reference_schemes.length:M.concepts.filter(c=>c.subject_area===a.id).length}}));
  Object.entries(w).forEach(([k,v])=>{const [a,b]=k.split("|"); els.push({data:{id:k,source:a,target:b,w:v,label:String(v)}})});
  if(cy1) cy1.destroy();
  cy1=cytoscape({container:$("#cy1"),elements:els,userZoomingEnabled:false,userPanningEnabled:false,boxSelectionEnabled:false,autoungrabify:true,
    style:[{selector:"node",style:{"label":"data(label)","background-color":"data(col)","width":"mapData(n,1,8,26,56)","height":"mapData(n,1,8,26,56)","font-family":"Outfit, sans-serif","font-size":15,"font-weight":600,"color":cssv("--ink"),"text-valign":"bottom","text-margin-y":6,"text-wrap":"wrap","text-max-width":120}},
      {selector:"edge",style:{"width":"mapData(w,1,8,1,9)","line-color":cssv("--ink-3"),"opacity":0.45,"curve-style":"straight","label":"data(label)","font-size":11,"font-family":"JetBrains Mono, monospace","color":cssv("--ink-2"),"text-background-color":cssv("--sheet"),"text-background-opacity":1,"text-background-padding":2}}],
    layout:{name:"circle",padding:44,avoidOverlap:true,startAngle:-Math.PI/2}});
  cy1.on("tap","node",e=>goArea(e.target.id()));
}
function goArea(area){
  const first=area==="reference"?M.reference_schemes[0]:M.concepts.find(c=>c.subject_area===area); if(!first) return;
  if(area==="reference"&&!$("#f-ref").checked){$("#f-ref").checked=true; if(cy2) buildL2()}
  $("#f-div").value=""; $("#f-cq").value=""; location.hash="model"; setTimeout(()=>select(first.id,true),60);
}

/* ---------- changes between versions ---------- */
function diffModels(A,B){
  const out=[];
  const byId=(arr,k="id")=>Object.fromEntries((arr||[]).map(x=>[x[k],x]));
  const sec=(name,a,b,key,labelOf,fields)=>{
    const rows=[]; const ma=byId(a,key), mb=byId(b,key);
    Object.keys(mb).forEach(k=>{ if(!ma[k]) rows.push({kind:"added",what:labelOf(mb[k]),detail:fields.main?mb[k][fields.main]:""}) });
    Object.keys(ma).forEach(k=>{ if(!mb[k]) rows.push({kind:"removed",what:labelOf(ma[k]),detail:""}) });
    Object.keys(mb).forEach(k=>{ if(!ma[k]) return; const diffs=[];
      fields.list.forEach(f=>{ const x=JSON.stringify(ma[k][f]??null), y=JSON.stringify(mb[k][f]??null); if(x!==y) diffs.push({f,was:ma[k][f],now:mb[k][f]}) });
      if(diffs.length) rows.push({kind:"changed",what:labelOf(mb[k]),diffs}) });
    if(rows.length) out.push({name,rows});
  };
  const lc=x=>x.label||x.id;
  sec("Concepts",A.concepts,B.concepts,"id",lc,{main:"definition",list:["label","definition","subject_area","type","rigidity","alt_labels","scope","excludes","identity","vagueness","owner_role","examples","non_examples","semantic_change"]});
  const relKey=r=>`${r.id}`;
  const relLab=r=>`${r.id}: ${(A.concepts.concat(B.concepts).find(c=>c.id===r.from)||{label:r.from}).label} → ${r.label} → ${r.to.join(", ")}`;
  sec("Relations",(A.relations||[]).map(r=>({...r,key:relKey(r)})),(B.relations||[]).map(r=>({...r,key:relKey(r)})),"key",relLab,{list:["from","to","label","card","chars"]});
  sec("Reference vocabularies",A.reference_schemes,B.reference_schemes,"id",lc,{list:["label","principle","values"]});
  sec("Lexicon",A.lexicon,B.lexicon,"term",t=>`“${t.term}”`,{list:["senses","guidance","risk"]});
  sec("Competency questions",A.competency_questions,B.competency_questions,"id",q=>`${q.id}: ${q.q}`,{list:["q","concepts"]});
  sec("Rules",A.rules,B.rules,"id",r=>`${r.id}: ${r.text}`,{list:["text","test","enforced_by"]});
  sec("Decisions",A.dilemmas,B.dilemmas,"id",d=>`${d.id}: ${d.title}`,{list:["title","recommendation","context"]});
  const fa=A.mapping||{}, fb=B.mapping||{}; const mrows=[];
  Object.keys(fb).forEach(k=>{ if(fa[k]&&fa[k].fit!==fb[k].fit) mrows.push({kind:"changed",what:k,diffs:[{f:"fit",was:fa[k].fit,now:fb[k].fit}]}) });
  if(mrows.length) out.push({name:"Databricks fit",rows:mrows});
  return out;
}
const fmt=v=>v==null?"—":Array.isArray(v)?v.map(x=>typeof x==="object"?JSON.stringify(x):x).join("; "):typeof v==="object"?JSON.stringify(v):String(v);
function renderChanges(){
  const ia=+$("#cmp-a").value, ib=+$("#cmp-b").value;
  const A=REL[ia].model, B=REL[ib].model;
  if(ia===ib){ $("#chg").innerHTML=`<p class="muted">Pick two different versions to compare.</p>`; $("#cmp-sum").textContent=""; return }
  const secs=diffModels(A,B);
  const counts={added:0,removed:0,changed:0}; secs.forEach(s=>s.rows.forEach(r=>counts[r.kind]++));
  $("#cmp-sum").textContent=`${counts.added} added · ${counts.removed} removed · ${counts.changed} changed`;
  const notes=[...(B.changelog?.pack||[]).map(x=>({...x,src:"Pack"})),...(B.changelog?.client||[]).map(x=>({...x,src:CLIENT}))].filter(x=>{const v=x.version.split(".").map(Number), a=REL[ia].version.split(".").map(Number); return v[0]>a[0]||v[0]===a[0]&&(v[1]>a[1]||v[1]===a[1]&&v[2]>a[2])});
  let h=notes.length?`<div class="panel chg-sec log"><h3>Release notes</h3>${notes.map(n=>`<div><span class="lbl">${esc(n.src)} ${esc(n.version)} · ${esc(n.date||"")}</span><ul>${n.changes.map(c=>`<li>${esc(c)}</li>`).join("")}</ul></div>`).join("")}</div>`:"";
  h+=secs.map(s=>`<div class="panel chg-sec"><h3>${esc(s.name)} <span class="muted mono" style="font-size:.8rem">${s.rows.length}</span></h3>${s.rows.map(r=>`<div class="chg-row"><span class="kind k-${r.kind}">${r.kind}</span><div style="display:grid;gap:4px;min-width:0"><b>${esc(r.what)}</b>${r.detail?`<span class="muted">${esc(r.detail)}</span>`:""}${(r.diffs||[]).map(d=>`<div><span class="fld">${esc(d.f)}</span><br><span class="was">${esc(fmt(d.was))}</span><br><span class="now">${esc(fmt(d.now))}</span></div>`).join("")}</div></div>`).join("")}</div>`).join("");
  $("#chg").innerHTML=h||`<p class="muted">No differences.</p>`;
}
$("#cmp-a").addEventListener("change",renderChanges); $("#cmp-b").addEventListener("change",renderChanges);

/* ---------- suggestions (by email) ---------- */
const proposalsFor=()=>[];
function renderProposals(){}
const KINDS={definition:"Definition",term:"Different word",example:"Example",relation:"Link to another concept",new:"Missing concept",other:"Other"};
$("#pform").addEventListener("submit",e=>{
  e.preventDefault();
  const text=$("#p-text").value.trim(), msg=$("#p-msg");
  if(!text){ msg.textContent="Write your suggestion first."; $("#p-text").focus(); return }
  const concept=$("#p-concept").value, kind=$("#p-kind").value, why=$("#p-why").value.trim();
  const pack=M.meta.pack||{};
  const subject=`Model suggestion: ${concept?label(concept):"General"} (${KINDS[kind]||kind})`;
  const body=[`Model: ${pack.name||""} ${pack.version||""} (overlay ${M.meta.version||""})`,`Concept: ${concept?label(concept)+" ["+concept+"]":"Not about one concept"}`,`Kind: ${KINDS[kind]||kind}`,"",`Suggestion:`,text,"",`Why it matters:`,why||"(not given)"].join("\n");
  location.href=`mailto:${SUGGEST_TO}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  msg.textContent="Your email app should open with the suggestion ready to send.";
});

/* ---------- routing and events ---------- */
function show(){
  let v=(location.hash||"#method").slice(1); if(!VIEWS.some(x=>x[0]===v)) v="method";
  VIEWS.forEach(([id])=>{ $("#v-"+id).hidden=id!==v });
  document.querySelectorAll("#tabs a").forEach(a=>{ if(a.dataset.v===v) a.setAttribute("aria-current","page"); else a.removeAttribute("aria-current") });
  if(v==="model"){ if(!cy2) buildL2(); else cy2.resize(); renderDetail(selected) }
  if(v==="areas"){ if(!cy1) buildL1(); else cy1.resize() }
}
window.addEventListener("hashchange",show);
document.addEventListener("click",e=>{
  if(e.target.closest("#golatest")){ curIdx=REL.length-1; $("#ver").value=String(curIdx); renderAll(); return }
  const pr=e.target.closest("[data-propose]"); if(pr){ $("#p-concept").value=pr.dataset.propose; location.hash="proposals"; setTimeout(()=>$("#p-text").focus(),60); return }
  const ar=e.target.closest(".area[data-area]"); if(ar&&!e.target.closest("[data-go]")){ goArea(ar.dataset.area); return }
  const g=e.target.closest("[data-go]"); if(g){ e.preventDefault(); const id=g.dataset.go; if(!ANY(id)) return; if(REF[id]&&!C[id]&&!$("#f-ref").checked){$("#f-ref").checked=true; if(cy2) buildL2()} if(location.hash!=="#model") location.hash="model"; setTimeout(()=>select(id,true),60); return }
  const q=e.target.closest("[data-cq]"); if(q){ $("#f-div").value=""; $("#f-cq").value=q.dataset.cq; selected=null; location.hash="model"; setTimeout(()=>{applyLens(); if(cy2) fitTo(cy2.nodes(".hl"))},80) }
});
$("#ver").addEventListener("change",()=>{ curIdx=+$("#ver").value; renderAll() });
$("#f-div").addEventListener("change",()=>{ if($("#f-div").value) $("#f-cq").value=""; applyLens() });
$("#f-cq").addEventListener("change",()=>{ if($("#f-cq").value) $("#f-div").value=""; applyLens(); if(!cy2) return; if($("#f-cq").value) fitTo(cy2.nodes(".hl")); else cy2.fit(undefined,24) });
$("#f-ref").addEventListener("change",buildL2);
$("#f-fit").addEventListener("click",()=>cy2&&cy2.fit(undefined,20));
const restyle=()=>{ if(cy2) cy2.style(baseStyle()); if(cy1){ cy1.destroy(); cy1=null; if(!$("#v-areas").hidden) buildL1() } };
window.matchMedia("(prefers-color-scheme: dark)").addEventListener?.("change",restyle);
new MutationObserver(restyle).observe(document.documentElement,{attributes:true,attributeFilter:["data-theme"]});
renderAll();
