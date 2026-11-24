/* All records and predictions in this file are synthetic demonstration data.
   No banking records, actual XGBoost models, Bedrock agents or live policy engine are used. */
export const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
export const PRODUCTS = [
  {id:'savings', name:'Savings Account', type:'Savings & deposits'},
  {id:'fixed', name:'Fixed Deposit', type:'Savings & deposits'},
  {id:'merchant', name:'Merchant Services', type:'Business banking'},
  {id:'card', name:'Debit/Credit Card Upgrade', type:'Cards & payments'},
  {id:'digital', name:'Digital Banking Plus', type:'Digital services'},
];
export const DEMO_DOCS = [
  {id:'POL-01',title:'Customer Contact & Retention Guidance',category:'Retention',version:'v2.1',updated:'2026-05-01',status:'Illustrative',text:'When unusual activity changes are detected, review the evidence before considering customer contact. Customer communication requires recorded permissions and authorised approval. Do not assume a behavioural anomaly proves churn.',section:'§ 3.2 — Relationship reviews'},
  {id:'POL-02',title:'Savings Product Eligibility Guide',category:'Products',version:'v3.0',updated:'2026-07-12',status:'Illustrative',text:'Confirm customer eligibility, product ownership, documented suitability and required identity information. Any missing verification must be resolved before a product offer is authorised.',section:'§ 4.1 — Product suitability'},
  {id:'POL-03',title:'Merchant Services Product Guide',category:'Products',version:'v1.7',updated:'2026-04-20',status:'Illustrative',text:'Merchant products are intended for verified business use. Evaluate transaction patterns and merchant needs. A pattern alone is not proof that a customer operates a business.',section:'§ 2.4 — Business verification'},
  {id:'POL-04',title:'Marketing Permissions & Consent',category:'Compliance',version:'v2.3',updated:'2026-09-10',status:'Illustrative',text:'Check channel-specific marketing permissions before initiating outreach. Where consent or contact preferences are unavailable, refer the case to authorised staff.',section:'§ 5.3 — Permitted communication'},
  {id:'COST-01',title:'Campaign Unit Cost Schedule',category:'Finance',version:'v1.2',updated:'2026-08-02',status:'Illustrative',text:'Illustrative demo unit costs: relationship review $1.20 per case; email outreach $0.08 per contact; call centre outreach $0.65 per contact. These figures are fabricated for demonstration.',section:'§ 1 — Unit costs'},
  {id:'POL-05',title:'Human Approval and AI Governance',category:'Governance',version:'v1.4',updated:'2026-06-15',status:'Illustrative',text:'Automated scores and agent narratives are advisory. Mandatory product restrictions are applied by authorised rules and the final customer-facing decision requires a bank employee.',section:'§ 6.1 — Decision rights'},
];
const FIRST=['Emily','Daniel','Sophia','Michael','Tariro','Tinashe','Rudo','Farai','Nomsa','Tawanda','Nyasha','Sibongile','Anesu','Munashe','Rumbidzai','Simbarashe','Lerato','Brandon','Patience','Tendai'];
const LAST=['Carter','Price','Reed','Chen','Moyo','Ndlovu','Dube','Mutsvairo','Chikore','Ncube','Sibanda','Zhou','Mlambo','Banda','Dlamini','Mabika'];
const TYPES=['seasonal','persistent','steady','infrequent','growth','recovery','volatile'];
const round=(n,d=0)=>Number(n.toFixed(d));
const clamp=(v,lo,hi)=>Math.min(hi,Math.max(lo,v));
export const money=(n)=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(n);
export const pct=(n)=>`${round(n,1)}%`;
const mod=(n,m)=>((n % m)+m)%m;
const stableNoise=(i,y,m)=>Math.sin(i*7.37+y*3.21+m*2.43)*1.5+Math.cos(i*1.17+m*3.2);
function syntheticSeries(i,type){
  const base=type==='infrequent'?1.7: type==='growth'?15: 17+mod(i*5,11);
  return Array.from({length:36},(_,t)=>{
    const year=Math.floor(t/12), month=t%12;
    let seasonal=type==='seasonal'?8*Math.cos((month-1)*Math.PI/6)+4*Math.sin(month*Math.PI/3):type==='volatile'?5*Math.sin(month*1.7):3*Math.cos(month*Math.PI/6);
    let v=base+seasonal+stableNoise(i,year,month)+(type==='growth'?t*.34:0);
    if(type==='persistent' && t>=30) v*=0.19;
    if(type==='recovery' && t>=29 && t<=31) v*=.16;
    if(type==='infrequent') v=mod(t+i*2,3)===0?1:0;
    return Math.max(0,Math.round(v));
  });
}
export function generateCustomers(count=72){
  return Array.from({length:count},(_,i)=>{
    const type=TYPES[i%TYPES.length];
    const counts=syntheticSeries(i,type);
    const amount=type==='infrequent'?150+mod(i*17,90):55+mod(i*71,170);
    const balance=480+mod(i*1073,16700)+(type==='growth'?6000:0);
    const owned=i%4===0?['Current Account','Debit Card']:i%3===0?['Current Account','Savings Account']:['Current Account','Digital Banking'];
    return {id:`C${String(104892+i).padStart(6,'0')}`,name:`${FIRST[i%FIRST.length]} ${LAST[Math.floor(i/FIRST.length)%LAST.length]}`,type,counts,amount,balance,owned,tenure:1+mod(i*7,9),marketingConsent:i%9!==0,kycComplete:i%11!==0,monthlyDeposit:Math.round(amount*(8+mod(i*3,13))),monthlyWithdrawal:Math.round(amount*(5+mod(i*2,10))),business:i%7===0||i%13===0,region:['Harare','Bulawayo','Gweru','Mutare','Masvingo'][i%5],currency:'USD'};
  });
}
export const CUSTOMERS=generateCustomers();
export function makeSeries(customer,scenario='observed'){
  const result=customer.counts.slice();
  if(scenario==='expected') return result;
  if(scenario==='recovery') {result[30]=Math.max(0,Math.round(result[30]*.28));result[31]=Math.max(0,Math.round(result[31]*.35));result[32]=result[20];result[33]=result[21];result[34]=result[22];result[35]=result[23];}
  if(scenario==='persistent')for(let t=30;t<36;t++)result[t]=Math.max(0,Math.round(result[t]*.2));
  if(scenario==='normal')for(let t=24;t<36;t++)result[t]=result[t-12]+(t%3===0?1:0);
  return result;
}
export function customerAnalysis(customer,scenario='observed'){
  const series=makeSeries(customer,scenario);
  const historical=series.slice(0,24);
  const recent=series.slice(30,36);
  const expected=Array.from({length:6},(_,j)=>(historical[6+j]+historical[18+j])/2);
  const historicalMean=historical.reduce((a,b)=>a+b,0)/24;
  const std=Math.sqrt(historical.reduce((a,b)=>a+(b-historicalMean)**2,0)/24);
  const typicalGap=historicalMean<1?90:Math.round(30/Math.max(1,historicalMean));
  const deviations=recent.map((v,j)=>(v-expected[j])/Math.max(expected[j],1));
  let streak=0;for(let i=deviations.length-1;i>=0;i--){if(deviations[i]<-.4)streak++;else break;}
  const persistent=streak>=3;
  const expectedSum=expected.reduce((a,b)=>a+b,0), recentSum=recent.reduce((a,b)=>a+b,0);
  const change=(recentSum-expectedSum)/Math.max(expectedSum,1)*100;
  const last90=series.slice(-3).reduce((a,b)=>a+b,0);
  const inactivity=series[35]===0?Math.max(30,typicalGap):Math.round(typicalGap*.7);
  const rfm={r:clamp(5-Math.floor(inactivity/25),1,5),f:clamp(Math.round(last90/19),1,5),m:clamp(Math.round(customer.amount*last90/3000),1,5)};
  const savingsGain=customer.monthlyDeposit-customer.monthlyWithdrawal;
  const valueScore=rfm.r+rfm.f+rfm.m+Math.min(5,customer.balance/4000)+customer.tenure*.15;
  const valueTier=valueScore>17?'High':valueScore>12?'Growing':'Standard';
  const baseline={frequency:round(historicalMean,1),typicalAmount:customer.amount,normalGap:typicalGap,variance:round(std,1),avgDeposits:customer.monthlyDeposit,avgWithdrawals:customer.monthlyWithdrawal};
  // This number is deliberately NOT an actual supervised model prediction.
  const demoPriorityScore=clamp(Math.round(22+Math.max(0,-change)*.55+(persistent?19:0)+(customer.tenure<2?3:0)-(customer.type==='seasonal'?5:0)),9,97);
  const riskLabel=demoPriorityScore>=70?'High':demoPriorityScore>=48?'Medium':'Low';
  const candidates=PRODUCTS.map((p,index)=>{
    let score=25+mod(customer.amount*3+customer.balance/100+index*37,48);
    if(p.id==='savings'&&savingsGain>100)score+=18;
    if(p.id==='fixed'&&customer.balance>7500)score+=18;
    if(p.id==='merchant'&&customer.business)score+=26;
    if(p.id==='digital'&&customer.type==='infrequent')score+=15;
    if(p.id==='card'&&last90>40)score+=12;
    const owned=customer.owned.some(o=>o.toLowerCase().includes(p.name.toLowerCase().split(' ')[0]));
    return {...p,score:clamp(Math.round(score),9,95),owned,eligible:p.id!=='merchant'||customer.business};
  }).sort((a,b)=>b.score-a.score);
  return {series,historical,recent,expected,baseline,deviations,streak,persistent,change,last90,inactivity,rfm,valueTier,productCandidates:candidates,demoPriorityScore,riskLabel,seasonal:customer.type==='seasonal',valueScore};
}
// Small actual K-Means implementation over generated historical customer features.
export function calculateSegments(customers=CUSTOMERS){
  const matrix=customers.map(c=>{let h=c.counts.slice(0,24);let avg=h.reduce((a,b)=>a+b,0)/h.length;let volatility=Math.sqrt(h.reduce((a,b)=>a+(b-avg)**2,0)/h.length);return [avg,c.balance/550,c.monthlyDeposit/330,volatility];});
  const centres=[matrix[2].slice(),matrix[5].slice(),matrix[14].slice(),matrix[7].slice()];
  const labels=Array(matrix.length).fill(0);
  for(let iteration=0;iteration<20;iteration++){
    matrix.forEach((v,i)=>{let best=Infinity;centres.forEach((c,k)=>{let distance=v.reduce((sum,n,j)=>sum+(n-c[j])**2,0);if(distance<best){best=distance;labels[i]=k;}});});
    centres.forEach((c,k)=>{let members=matrix.filter((_,i)=>labels[i]===k);if(members.length)for(let j=0;j<c.length;j++)c[j]=members.reduce((sum,m)=>sum+m[j],0)/members.length;});
  }
  return labels;
}
export const SEGMENTS=calculateSegments();
export const SEGMENT_NAMES=['Regular Activity','Higher-Balance Customers','Growing Relationships','Seasonal / Variable Activity'];
export const CASE_PRESETS=[
  {id:'case-1',customerId:CUSTOMERS[1].id,type:'Retention review',owner:'Relationship manager'},
  {id:'case-2',customerId:CUSTOMERS[4].id,type:'Growth opportunity',owner:'Product specialist'},
  {id:'case-3',customerId:CUSTOMERS[11].id,type:'Compliance review',owner:'Compliance officer'},
  {id:'case-4',customerId:CUSTOMERS[6].id,type:'Relationship review',owner:'Branch manager'},
  {id:'case-5',customerId:CUSTOMERS[16].id,type:'Product suitability',owner:'Product specialist'},
];
export function buildDemoAgentReview(customer,a){
  const best=a.productCandidates.find(x=>!x.owned&&x.eligible)||a.productCandidates[0];
  const retention=a.persistent?`Recent activity is ${Math.abs(Math.round(a.change))}% below the matched historical period and remains unusually low for ${a.streak} consecutive periods. This warrants relationship review; the cause is unknown.`:`Activity is ${Math.abs(Math.round(a.change))}% ${a.change<0?'below':'above'} historical expectation, without a qualifying sustained decline. Avoid assuming customer disengagement.`;
  const growth=`${best.name} is the highest ranked current demo candidate (${best.score} / 100 simulated suitability signal). It was ranked from customer features and should not be mistaken for a validated adoption probability.`;
  const finance=`Illustrative outreach scenario: 1 relationship review × $1.20 = $1.20; an email contact would cost $0.08. These fictional unit costs are retrieved from COST-01; financial benefits cannot be determined from this demo.`;
  const compliance=customer.kycComplete&&customer.marketingConsent?'Demo KYC and marketing-permission flags are available. Further actual product eligibility and suitability would require bank-approved rules.':'A customer verification or marketing-permission flag is missing. Do not initiate an offer before authorised review.';
  const recommendation=a.persistent?'Prioritise a relationship review; retain product opportunities for later suitability and compliance checks.':'Review relevant product opportunities if suitable; do not launch a retention intervention solely because this customer is naturally infrequent or variable.';
  return {best,retention,growth,finance,compliance,recommendation,docs:['POL-01','POL-02','POL-04','COST-01','POL-05'],approvalRequired:true};
}
