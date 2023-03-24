const CACHE_NAME = "version-1";
const urlsToCache = [ 'index.html', 'offline.html' ];

const self = this;

// Install sw
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
        .then((cache) => {
            console.log('Opened cache');

            return cache.addAll(urlsToCache);
        })
    )
});

//Listen for reqs
self.addEventListener('fetch', (event) => {
    event.respondWith(async function() {
        try{
          var res = await fetch(event.request);
          var cache = await caches.open('cache');
          cache.put(event.request.url, res.clone());
          return res;
        }
        catch(error){
          return caches.match('offline.html');
         }
       }());
    });

//         caches.match(event.request)
//         .then(() => {
//             return fetch(event.request)
//             .catch(() => caches.match('offline.html'))
//         })
//     )
// });

// async function() {
//     try{
//       var res = await fetch(event.request);
//       var cache = await caches.open('cache');
//       cache.put(event.request.url, res.clone());
//       return res;
//     }
//     catch(error){
//       return caches.match(event.request);
//      }
//    }());
// });

// Activate the sw
self.addEventListener('activate', (event) => {
    const cacheWhitelist = [];
    cacheWhitelist.push(CACHE_NAME);

    event.waitUntil(
        caches.keys().then((cacheNames) => Promise.all(
            cacheNames.map((cacheName) => {
                if(!cacheWhitelist.includes(cacheName)) {
                    return caches.delete(cacheName);
                }
            })
        ))
            
    )
});



