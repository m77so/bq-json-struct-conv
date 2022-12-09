(function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))u(t);new MutationObserver(t=>{for(const o of t)if(o.type==="childList")for(const a of o.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&u(a)}).observe(document,{childList:!0,subtree:!0});function c(t){const o={};return t.integrity&&(o.integrity=t.integrity),t.referrerpolicy&&(o.referrerPolicy=t.referrerpolicy),t.crossorigin==="use-credentials"?o.credentials="include":t.crossorigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function u(t){if(t.ep)return;t.ep=!0;const o=c(t);fetch(t.href,o)}})();const S={TIMESTAMP:e=>`SAFE_CAST(SAFE.STRING(${e}) AS TIMESTAMP)`,STRING:e=>`SAFE.STRING(${e})`,DATE:e=>`DATE(SAFE.STRING(${e}))`,INTEGER:e=>`SAFE.INT64(${e})`},E=(e,n)=>{const c=[];for(let l of e){let i="",s=l.mode==="REPEATED"?"":n;l.type==="RECORD"?i=`STRUCT(
${E(l.fields,`${s}${l.name}.`)}
)`:i=S[l.type](`${s}${l.name}`),l.mode==="REPEATED"&&(i=`ARRAY(
SELECT
${i}
FROM UNNEST(JSON_QUERY_ARRAY(${n}${l.name})) ${l.name}
WITH OFFSET ${l.name}_index
ORDER BY ${l.name}_index
)`),i+=` AS ${l.name}`,c.push(i)}const t=c.join(`,
`).split(`
`),o=[];let a=1;for(let l=0;l<t.length;++l){let i=t[l];const s=[...i.matchAll(/^([\)>}]|FROM|\s)+/g)].map(f=>f[0]).map(f=>[...f.matchAll(/(FROM|[\)}>])/g)]).flat().length;a-=s,i="  ".repeat(Math.max(0,a))+i,a-=[...i.matchAll(/([>}\)]|FROM)/g)].length-s,a+=[...i.matchAll(/([<{\(]|SELECT)/g)].length,o.push(i)}return`SELECT
`+o.join(`
`)+`
FROM t`};var T={check:function(e){return typeof e=="string"}},R={check:function(e){return typeof e=="number"}},A={check:function(e){return typeof e=="boolean"}},g={check:function(e){return e===null}},v={check:function(e){return!0}};function b(e){return{check:function(n){return n===e}}}function k(e){return{check:function(n){return e.some(function(c){return c.check(n)})}}}function N(e){return{check:function(n){return n===null||e.check(n)}}}function O(e){return{check:function(n){return Array.isArray(n)&&n.every(function(c){return e.check(c)})}}}function _(e){return{check:function(n){return typeof n!="object"||n===null?!1:Object.keys(e).every(function(c){var u=h(c);if(y(n,u)){var t=e[c];if(m(t))return t.check(n[u]);var o=t();return m(o)?o.check(n[u]):!1}else return d(c)})}}}function m(e){return typeof e=="object"&&e!==null&&y(e,"check")&&typeof e.check=="function"}function d(e){var n;return((n=e.match(/[^?]?(?:\?\?)*(\?)?$/))===null||n===void 0?void 0:n[1])==="?"}function h(e){var n,c,u=e.match(/^(.*?[^?]?)((?:\?\?)*)\??$/);if(u===null)return e;var t=(n=u[1])!==null&&n!==void 0?n:"",o=(c=u[2].replace(/\?\?/g,"?"))!==null&&c!==void 0?c:"";return""+t+o}function y(e,n){return n in e}var r=Object.freeze({__proto__:null,string:T,number:R,boolean:A,nil:g,unknown:v,literal:b,any:k,nullable:N,array:O,object:_,isOptionalProperty:d,unescapePropertyName:h});const $=r.any([r.literal("INTEGER"),r.literal("STRING"),r.literal("DATE"),r.literal("TIMESTAMP")]),L=r.object({name:r.string,mode:r.any([r.literal("REPEATED"),r.literal("NULLABLE"),r.literal("REQUIRED")]),type:$,"description?":r.string}),M=r.object({name:r.string,mode:r.any([r.literal("REPEATED"),r.literal("NULLABLE"),r.literal("REQUIRED")]),type:r.literal("RECORD"),"description?":r.string,fields:()=>r.array(p)}),p=r.any([L,M]),I=r.array(p);function q(e,n,c,u){e.addEventListener("click",()=>{const t=n.value;let o=!1;u.innerText="";try{o=I.check(JSON.parse(t))}catch(a){console.log(a),u.innerHTML=a.toString()}if(!o){u.innerHTML+="<br> \u7121\u52B9\u306AJSON\u3067\u3059\u3002\u3069\u3053\u304B\u304C\u9055\u3044\u307E\u3059",c.value="";return}c.value=E(JSON.parse(t),"jsoncol.")})}q(document.querySelector("#convert"),document.querySelector("#json_input"),document.querySelector("#query_output"),document.querySelector("#message"));