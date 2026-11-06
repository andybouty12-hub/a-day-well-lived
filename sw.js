// Offline shell only. Never cache Supabase API responses or user data.
const CACHE='day-well-lived-shell-v2';
const SHELL=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png'];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(Promise.all([caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))),self.clients.claim()])));
self.addEventListener('fetch',event=>{const req=event.request;if(req.method!=='GET'||new URL(req.url).origin!==self.location.origin)return;
if(req.mode==='navigate'){event.respondWith(fetch(req).then(res=>{if(res.ok){const copy=res.clone();caches.open(CACHE).then(c=>c.put('./index.html',copy))}return res}).catch(()=>caches.match('./index.html')));return}
event.respondWith(caches.match(req).then(hit=>hit||fetch(req)))});

self.addEventListener('push',event=>{
 let payload={title:'A Day Well Lived',body:'You have a reminder.'};
 try{if(event.data)payload={...payload,...event.data.json()}}catch{}
 event.waitUntil(self.registration.showNotification(payload.title,{
  body:payload.body,icon:'./icon-192.png',badge:'./icon-192.png',
  tag:payload.tag||'planner-reminder',data:{url:'./'}
 }));
});
self.addEventListener('notificationclick',event=>{
 event.notification.close();
 event.waitUntil((async()=>{
  const target=new URL('./',self.registration.scope).href;
  const windows=await clients.matchAll({type:'window',includeUncontrolled:true});
  for(const w of windows){if(w.url.startsWith(target)){await w.focus();return}}
  await clients.openWindow(target);
 })());
});
