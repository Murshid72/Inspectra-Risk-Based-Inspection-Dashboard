const seedInspections = [
  {id:"INS-1048",site:"North Zone Warehouse",inspector:"A. Kumar",date:"Oct 13, 2026",trust:38,risk:82,status:"Flagged",reason:"No photo evidence attached",evidence:"missing",location:"verified"},
  {id:"INS-1047",site:"Riverbank Facility",inspector:"S. Priya",date:"Oct 13, 2026",trust:96,risk:12,status:"Verified",reason:"All verification checks passed",evidence:"complete",location:"verified"},
  {id:"INS-1041",site:"Central Zone Depot",inspector:"M. Rahman",date:"Oct 12, 2026",trust:57,risk:64,status:"Flagged",reason:"Reported position outside site radius",evidence:"complete",location:"mismatch"},
  {id:"INS-1040",site:"Westside Storage",inspector:"J. David",date:"Oct 12, 2026",trust:88,risk:22,status:"Verified",reason:"Evidence and location verified",evidence:"complete",location:"verified"},
  {id:"INS-1039",site:"South Zone Pumping",inspector:"R. Devi",date:"Oct 11, 2026",trust:71,risk:48,status:"In review",reason:"Submitted after assigned window",evidence:"complete",location:"verified"},
  {id:"INS-1037",site:"Market Road Unit",inspector:"K. Arjun",date:"Oct 10, 2026",trust:91,risk:18,status:"Verified",reason:"Checks consistent",evidence:"complete",location:"verified"},
  {id:"INS-1034",site:"Hillview Plant",inspector:"F. Nisha",date:"Oct 09, 2026",trust:64,risk:55,status:"In review",reason:"Timestamp requires review",evidence:"complete",location:"verified"},
  {id:"INS-1031",site:"East Zone Workshop",inspector:"P. Anand",date:"Oct 08, 2026",trust:99,risk:5,status:"Verified",reason:"All verification checks passed",evidence:"complete",location:"verified"}
];
let inspections = [...seedInspections];
const $ = (id) => document.getElementById(id);
const esc = (value) => String(value).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
function riskBand(score){return score>=70?"high":score>=35?"medium":"low"}
function statusClass(status){return status==="Verified"?"verified":status==="Flagged"?"flagged":"review"}
function renderRows(){
  const query=$("searchInput").value.trim().toLowerCase(), filter=$("statusFilter").value;
  const rows=inspections.filter(x=>(filter==="all"||x.status===filter)&&[x.id,x.site,x.inspector].some(v=>v.toLowerCase().includes(query)));
  $("inspectionRows").innerHTML=rows.length?rows.map(x=>`<tr>
    <td><div class="site-cell"><span class="site-icon">▦</span><div><strong>${esc(x.site)}</strong><small>${esc(x.id)}</small></div></div></td>
    <td>${esc(x.inspector)}</td><td>${esc(x.date)}</td>
    <td><div class="score-cell"><strong>${x.trust}</strong><span class="score-mini ${x.trust<65?"low":""}"><span style="width:${x.trust}%"></span></span></div></td>
    <td><span class="risk-tag ${riskBand(x.risk)}">● ${x.risk} · ${riskBand(x.risk)==="high"?"High":riskBand(x.risk)==="medium"?"Medium":"Low"}</span></td>
    <td><span class="status-tag ${statusClass(x.status)}">● ${esc(x.status)}</span></td>
    <td><button class="row-action" data-id="${esc(x.id)}" aria-label="Review ${esc(x.id)}" title="Review inspection">···</button></td>
  </tr>`).join(""):`<tr><td colspan="7" class="empty-state">No inspections match your search.</td></tr>`;
  $("resultCount").textContent=`Showing ${rows.length} of ${inspections.length} inspections`;
  $("navCount").textContent=inspections.length;
  $("riskStat").textContent=inspections.filter(x=>x.status==="Flagged"||x.risk>=35).length;
  $("totalStat").textContent=128+Math.max(0,inspections.length-seedInspections.length);
  $("alertCount").textContent=`${inspections.filter(x=>x.status==="Flagged").length} active`;
  renderAlerts();
}
function renderAlerts(){
  const flagged=inspections.filter(x=>x.status==="Flagged"||x.risk>=45).sort((a,b)=>b.risk-a.risk).slice(0,3);
  $("alertList").innerHTML=flagged.length?flagged.map(x=>`<div class="alert-item"><span class="alert-symbol ${riskBand(x.risk)==="high"?"high":"medium"}">!</span><div class="alert-copy"><strong>${esc(x.reason)}</strong><small>${esc(x.id)} · ${esc(x.site)}</small><div class="alert-reason">${esc(x.inspector)}</div></div><span class="risk-number ${riskBand(x.risk)==="high"?"high-text":"medium-text"}">${x.risk}</span></div>`).join(""):`<div class="empty-state">No active priority alerts. Nice work.</div>`;
}
function toast(message){const el=$("toast");el.textContent=message;el.classList.add("show");clearTimeout(toast.timer);toast.timer=setTimeout(()=>el.classList.remove("show"),2800)}
$("searchInput").addEventListener("input",renderRows);
$("statusFilter").addEventListener("change",renderRows);
$("addBtn").addEventListener("click",()=>$("inspectionDialog").showModal());
$("closeDialog").addEventListener("click",()=>$("inspectionDialog").close());
$("cancelDialog").addEventListener("click",()=>$("inspectionDialog").close());
$("inspectionForm").addEventListener("submit",e=>{
  e.preventDefault();const form=new FormData(e.currentTarget),evidence=form.get("evidence"),location=form.get("location");
  let risk=0,trust=100,reason="All verification checks passed";
  if(evidence==="missing"){risk+=45;trust-=35;reason="Missing photo evidence";}
  if(location==="mismatch"){risk+=40;trust-=30;reason=evidence==="missing"?"Missing evidence and location mismatch":"Reported position outside site radius";}
  const id=`INS-${1050+inspections.length-seedInspections.length}`;
  inspections.unshift({id,site:form.get("site").trim(),inspector:form.get("inspector").trim(),date:"Oct 13, 2026",trust,risk,status:risk>=35?"Flagged":"In review",reason,evidence,location});
  e.currentTarget.reset();$("inspectionDialog").close();$("searchInput").value="";$("statusFilter").value="all";renderRows();toast(`${id} created. Scores are rule-based demo estimates.`);
});
$("inspectionRows").addEventListener("click",e=>{
  const button=e.target.closest("[data-id]");if(!button)return;const item=inspections.find(x=>x.id===button.dataset.id);if(!item)return;
  const details=`${item.id} — ${item.site}\nInspector: ${item.inspector}\nTrust score: ${item.trust}/100\nRisk score: ${item.risk}/100 (${riskBand(item.risk)})\nStatus: ${item.status}\nReason: ${item.reason}`;
  if(item.status!=="Verified"&&confirm(details+"\n\nMark this inspection as verified? This only changes local demo data.")){item.status="Verified";item.risk=Math.min(item.risk,30);renderRows();toast(`${item.id} marked verified in this browser.`)}
  else if(item.status==="Verified")alert(details);
});
$("exportBtn").addEventListener("click",()=>{
  const header=["id","site","inspector","date","trust_score","risk_score","status","reason"];
  const lines=[header,...inspections.map(x=>[x.id,x.site,x.inspector,x.date,x.trust,x.risk,x.status,x.reason])].map(row=>row.map(v=>`"${String(v).replace(/"/g,'""')}"`).join(",")).join("\r\n");
  const blob=new Blob([lines],{type:"text/csv;charset=utf-8;"}),url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download="inspectra-demo-inspections.csv";a.click();URL.revokeObjectURL(url);toast("CSV exported.");
});
$("viewAlerts").addEventListener("click",()=>{$("statusFilter").value="Flagged";renderRows();$("inspections").scrollIntoView({behavior:"smooth"});});
$("chartToggle").addEventListener("click",()=>toast("The chart currently displays the sample last-7-days view."));
$("menuToggle").addEventListener("click",()=>$("sidebar").classList.toggle("open"));
document.querySelectorAll(".nav-item").forEach(a=>a.addEventListener("click",()=>{$("sidebar").classList.remove("open");document.querySelectorAll(".nav-item").forEach(n=>n.classList.remove("active"));a.classList.add("active")}));
renderRows();
