var staticCache = 'wittr-static-v2'
self.addEventListener('install', function (event) {
    var urlsToCache = [
        '/',
        'js/main.js',
        'css/main.css',
        'imgs/icon.png',
        'https://fonts.gstatic.com/s/roboto/v15/2UX7WLTfW3W8TclTUvlFyQ.woff',
        'https://fonts.gstatic.com/s/roboto/v15/d-6IYplOFocCacKzxwXSOD8E0i7KZn-EPnyo3HZu7kw.woff'
    ];
    
    event.waitUntil(
        caches.open(staticCache).then((cache) => {            
           return cache.addAll(urlsToCache)
        })
    )
});

self.addEventListener('activate',function (event) {
    event.waitUntil(
        caches.keys().then(function(cachesNames) {
            cachesNames.filter((cacheName) =>{
                return cacheName.startsWith('wittr-') && 
                    cacheName !== staticCache;
            })
        }).map(())
        // ('wittr-static-v1')
        // caches.delete('wittr-static-v1')
        // cashes.delete('wittr-static-v2')
    )
});

self.addEventListener('fetch', function(event) {
    // console.log('jo! ysbkkjk',event.request);
    // if(event.request.url.endsWith('.jpg')){
    //     event.respondWith(
    //         // new Response('Hello <b>world</b>, <p class = "a-winner-is-me">my name is ayobami</p>',{
    //         //     headers:{'Content-Type': 'text/html'}
    //         // })
    //         fetch('/imgs/dr-evil.gif')
    //     ); 
    // }

    // event.respondWith(
    //    fetch(event.request).then((response)=>{
    //     if (response.status == 404) {
    //         // return new Response("Whoops, page not found")
    //         return fetch('/imgs/dr-evil.gif')
    //     }
    //     return response
    //    }).catch(()=>{
    //        return new Response("uhn looks like something went wrong")
    //    })
    // );
    
    event.respondWith(
        caches.match(event.request).then((response)=>{
            if(response) return response;
            return fetch(event.request);
        })        
    );
});