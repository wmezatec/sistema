/* Avisos del sistema: al tocar uno, abre la pantalla correspondiente */
self.addEventListener("install",()=>self.skipWaiting());
self.addEventListener("activate",e=>e.waitUntil(self.clients.claim()));
self.addEventListener("notificationclick",e=>{
  e.notification.close();
  const ir=(e.notification.data&&e.notification.data.ir)||"";
  e.waitUntil(self.clients.matchAll({type:"window",includeUncontrolled:true}).then(l=>{
    const w=l.find(c=>c.url.startsWith(self.registration.scope));
    if(w){w.postMessage({ir});return w.focus()}
    return self.clients.openWindow(self.registration.scope+ir);
  }));
});
