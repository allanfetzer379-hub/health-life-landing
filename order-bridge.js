(function(){
'use strict';
var busy=false;
function param(name){return new URLSearchParams(location.search).get(name)||'';}
function form(count){return document.getElementById('form'+(count||1))||document.querySelector('form');}
function phone(value){var n=value.normalize('NFKC').replace(/[^0-9]/g,'');if(n.indexOf('886')===0)n='0'+n.slice(3);return /^09[0-9]{8}$/.test(n)?n:'';}
async function submit(f){if(!f||busy)return false;var nameInput=f.querySelector('[name="name"]'),phoneInput=f.querySelector('[name="phone"]');var name=nameInput?nameInput.value:'',raw=phoneInput?phoneInput.value:'';if(!name.trim()||name.length>80){alert('請正確填寫姓名');nameInput&&nameInput.focus();return false;}if(!phone(raw)){alert('請輸入正確的臺灣手機號碼');phoneInput&&phoneInput.focus();return false;}
var c=window.BACKEND_CONFIG||{};if(!c.ready){alert('訂單系統正在維護，請稍後再試。');return false;}
var button=f.querySelector('button[type="submit"],.button-submit,.main-link,.order-btn');var old=button?button.textContent:'';busy=true;if(button){button.disabled=true;button.style.pointerEvents='none';button.textContent='提交中…';}
try{var fingerprint=name+'|'+phone(raw),attempt;try{attempt=JSON.parse(sessionStorage.getItem('nk-pending-order')||'null');}catch(ignore){}if(!attempt||attempt.fingerprint!==fingerprint){attempt={fingerprint:fingerprint,id:crypto.randomUUID()};try{sessionStorage.setItem('nk-pending-order',JSON.stringify(attempt));}catch(ignore){}}
var source=param('utm_source')||param('source')||param('entry_source');if(/facebook|^fb$|meta/i.test(source)||param('fbclid'))source='Facebook';else if(/tiktok|^tk$/i.test(source)||param('ttclid'))source='TikTok';else source=source||'直接访问';
var payload={request_id:attempt.id,name:name,phone:raw,source:source,ad_id:param('ad_id')||param('utm_content')||param('adid'),source_url:location.href,attribution:{campaign_id:param('campaign_id')||param('utm_id'),adset_id:param('adset_id'),utm_source:param('utm_source'),utm_campaign:param('utm_campaign'),fbclid:param('fbclid'),ttclid:param('ttclid')}};
var response=await fetch(c.url+'/functions/v1/submit-order',{method:'POST',headers:{'Content-Type':'application/json',apikey:c.publishableKey,Authorization:'Bearer '+c.publishableKey},body:JSON.stringify(payload)});var data=await response.json();if(!response.ok||data.ok!==true||!data.id)throw Error(data.error||'提交失敗，請稍後再試');try{sessionStorage.setItem('nk-confirmed-order',data.id);sessionStorage.removeItem('nk-pending-order');}catch(ignore){}location.href=new URL('thanks.html'+location.search,location.href).href;
}catch(error){alert(error.message||'提交失敗，請稍後再試');busy=false;if(button){button.disabled=false;button.style.pointerEvents='';button.textContent=old;}}return false;}
window.send=function(count){submit(form(count));return false;};document.addEventListener('submit',function(event){if(event.target.querySelector('[name="phone"]')){event.preventDefault();event.stopImmediatePropagation();submit(event.target);}},true);
})();
