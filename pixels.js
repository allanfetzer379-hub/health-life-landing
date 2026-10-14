(function(){
 'use strict';
 var c=window.BACKEND_CONFIG||{},settings={facebook:[],tiktok:[]};
 function loadFacebook(){if(window.fbq)return;var q=window.fbq=function(){q.callMethod?q.callMethod.apply(q,arguments):q.queue.push(arguments);};q.queue=[];q.loaded=true;q.version='2.0';window._fbq=q;var script=document.createElement('script');script.async=true;script.src='https://connect.facebook.net/en_US/fbevents.js';document.head.appendChild(script);}
 function loadTikTok(){if(window.ttq)return;window.TiktokAnalyticsObject='ttq';var q=window.ttq=[];q.methods=['page','track','identify','instances','debug','on','off','once','ready','alias','group','enableCookie','disableCookie'];q.setAndDefer=function(target,method){target[method]=function(){target.push([method].concat(Array.prototype.slice.call(arguments)));};};q.methods.forEach(function(method){q.setAndDefer(q,method);});q._i={};q._t={};q._o={};q.instance=function(id){var instance=q._i[id]||[];q.methods.forEach(function(method){q.setAndDefer(instance,method);});return instance;};q.load=function(id){q._i[id]=[];q._i[id]._u='https://analytics.tiktok.com/i18n/pixel/events.js';q._t[id]=Date.now();q._o[id]={};var script=document.createElement('script');script.async=true;script.src=q._i[id]._u+'?sdkid='+encodeURIComponent(id)+'&lib=ttq';document.head.appendChild(script);};}
 // Fixed one-box offer: matches the database default (quantity 1, TWD 1389).
 var product={content_ids:['nk-one-box'],content_type:'product',contents:[{id:'nk-one-box',quantity:1,item_price:1389}],value:1389,currency:'TWD',num_items:1};
 var ready=false,pending=[],memory={};
 function get(storage,key){try{return storage.getItem(key);}catch(ignore){return memory[key]||null;}}
 function put(storage,key,value){memory[key]=value;try{storage.setItem(key,value);}catch(ignore){}}
 function session(){try{return window.sessionStorage;}catch(ignore){return null;}}
 function persistent(){try{return window.localStorage;}catch(ignore){return null;}}
 function dispatch(event,id){
  if(!ready){pending.push([event,id]);return;}
  ['facebook','tiktok'].forEach(function(platform){settings[platform].forEach(function(p){
   var key='nk-event:'+platform+':'+p.id+':'+event+':'+id;
   var storage=event==='Purchase'||event==='Lead'?persistent():session();
   if(get(storage,key))return;
   try{
    if(platform==='facebook')window.fbq('trackSingle',p.id,event,event==='Lead'?{}:product,{eventID:event+':'+id});
    else window.ttq.instance(p.id).track(event==='Lead'?'SubmitForm':event,event==='Lead'?{}:{content_ids:product.content_ids,content_type:'product',quantity:1,value:1389,currency:'TWD'},{event_id:event+':'+id});
    put(storage,key,'1');
   }catch(ignore){/* A blocked pixel must not affect the checkout. */}
  });});
 }
 function checkoutId(){
  var saved;try{saved=JSON.parse(get(session(),'nk-checkout')||'null');}catch(ignore){}
  if(!saved||Date.now()-saved.at>30*60*1000){saved={id:crypto.randomUUID(),at:Date.now()};put(session(),'nk-checkout',JSON.stringify(saved));}
  return saved.id;
 }
 if(!c.ready)return;
 if(location.pathname.endsWith('order.html'))dispatch('InitiateCheckout',checkoutId());
 var offer=document.getElementById('product-offer');
 if(offer&&window.IntersectionObserver){
  var observer=new IntersectionObserver(function(entries){if(entries.some(function(e){return e.isIntersecting;})){observer.disconnect();dispatch('ViewContent',crypto.randomUUID());}},{threshold:0.1});
  observer.observe(offer);
 }
 fetch(c.url+'/rest/v1/rpc/get_pixel_config',{method:'POST',headers:{apikey:c.publishableKey,'Content-Type':'application/json'},body:'{}'}).then(function(r){if(!r.ok)throw Error();return r.json();}).then(function(data){
  settings.facebook=(data.facebook||[]).filter(function(p){return p.enabled&&/^\d+$/.test(p.id);});
  settings.tiktok=(data.tiktok||[]).filter(function(p){return p.enabled&&/^[A-Za-z0-9]+$/.test(p.id);});
  if(settings.facebook.length){loadFacebook();settings.facebook.forEach(function(p){window.fbq('init',p.id);window.fbq('trackSingle',p.id,'PageView');});}
  if(settings.tiktok.length){loadTikTok();settings.tiktok.forEach(function(p){window.ttq.load(p.id);window.ttq.instance(p.id).page();});}
  ready=true;pending.splice(0).forEach(function(e){dispatch(e[0],e[1]);});
  if(location.pathname.endsWith('thanks.html')){
   var id=get(session(),'nk-confirmed-order');
   if(id&&(settings.facebook.length||settings.tiktok.length)){
    dispatch('Purchase',id);
    dispatch('Lead',id); // Preserve existing lead campaigns while adding purchase reporting.
    try{session().removeItem('nk-confirmed-order');session().removeItem('nk-checkout');}catch(ignore){}
   }
  }
 }).catch(function(){/* Tracking failure must never block an order. */});
})();
