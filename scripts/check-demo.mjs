import {CUSTOMERS,SEGMENTS,DEMO_DOCS,PRODUCTS,customerAnalysis,buildDemoAgentReview} from '../lib/demo.js';
import {readFileSync} from 'node:fs';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
let ts;try{ts=require('typescript')}catch{ts=null}
for (const file of ['app/page.jsx','app/layout.jsx','lib/demo.js']) {
  const src=readFileSync(new URL('../'+file,import.meta.url),'utf8');
  const kind=ts?(file.endsWith('.jsx')?ts.ScriptKind.JSX:ts.ScriptKind.JS):null;
  if(ts){const parsed=ts.createSourceFile(file,src,ts.ScriptTarget.Latest,true,kind);
  if(parsed.parseDiagnostics.length)throw Error(`${file} has a syntax issue: ${parsed.parseDiagnostics[0].messageText}`);}
}
if(CUSTOMERS.length!==72||SEGMENTS.length!==72||new Set(SEGMENTS).size<2)throw Error('Seeded demo integrity check failed');
for(const c of CUSTOMERS)for(const mode of ['observed','normal','persistent','recovery']){
 const a=customerAnalysis(c,mode);
 if(a.series.length!==36||a.expected.length!==6||!Number.isFinite(a.demoPriorityScore)||a.productCandidates.length!==PRODUCTS.length||!buildDemoAgentReview(c,a).recommendation)throw Error('Bad scenario '+c.id+' '+mode);
}
if(!DEMO_DOCS.every(d=>d.status==='Illustrative'))throw Error('Sample doc status');
console.log('PASS: JSX syntax, 72 synthetic customers, 4 scenario modes, clustering, evidence and demo agents.');
