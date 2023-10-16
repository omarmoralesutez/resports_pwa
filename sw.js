// Aquellos archivos propios de la aplicación
const STATIC = 'staticv3'
const INMUTABLE = 'inmutablev1'
const DYNAMIC = 'dynamicv1'
const APP_SHELL = [
    '/',
    '/index.html',
    'js/app.js',
    'img/medio_metro.jpg',
    'css/styles.css',
    'img/ivy.jpg',
    'pages/offline.html'
]

const APP_SHELL_INMUTABLE = [
    "https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js",
    "https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css"
]

self.addEventListener('install', e=>{
    console.log("Instalando");

    const staticCache = caches.open(STATIC)
    .then(cache =>{+
        cache.addAll(APP_SHELL);
    })
    const inmutableCache =  caches.open(INMUTABLE)
    .then(cache =>{
        cache.addAll(APP_SHELL_INMUTABLE);
    })
    e.waitUntil(Promise.all([staticCache, inmutableCache]))
    //e.skipWaiting();
})
self.addEventListener('activate', e=>{
    console.log("Activado");
})
self.addEventListener("fetch", e=>{
    //5. Cache and Network race
    // const source = new Promise((resolve, reject) =>{
    //     let flag = false;
    //     const failsOnce = () =>{
    //         // Si falló una vez aquí poner la lógica para controlarlo
    //         const url = e.request.url
    //         if(flag){
    //             if(/\.(html)/i.test(url)){
    //                 resolve(caches.match('pages/offline.html'))
    //             }else{
    //                 reject("SourceNotFound")
    //             }
    //         }else{
    //             flag = true;
    //         }
    //     }
    //     fetch(e.request).then(resFetch => {
    //         resFetch.ok ? resolve(resFetch) : failsOnce();
    //     }).catch(failsOnce);
    //     caches.match(e.request).then(sourceCache =>{
    //         sourceCache.ok ? resolve(sourceCache) : failsOnce();
    //     }).catch(failsOnce)
    // })

    // e.respondWith(source)

    //4. Cache with network update
    //Primero todo lo devuelve del caché
    //Despues actualiza el recurso
    //Se utiliza cuando el rendimiento del hardware es muy critico. Siempre se queda un paso atras
    /*const source = cache.open(STATIC).then(cache =>{
        fetch(e.request).then(resFetch =>{
            cache.put(e.request, resFetch);
        })
        return cache.match(e.request);
    });
    e.respondWith(source);*/
    //3. Network with cache fallback 
    const source = fetch(e.request)
    .then(res => {
        if(!res) throw Error('Not Found');
        caches.open(STATIC).then( cache =>{
            cache.put(e.request, res)
        })
        return res.clone()
    })
    .catch(err =>{
        return caches.match("pages/offline.html");
    })
    e.respondWith(source)
    //2. Cache with network fallback
    /*const source = caches.match(e.request)
    .then((res)=>{
        if(res) return res
        return fetch(e.request).then((resFetch)=>{
            caches.open(DYNAMIC)
            .then(cache =>{
                cache.put(e.request, resFetch)
            })
            return resFetch.clone();
        })
    })
    e.respondWith(source);*/
    //1. Cache Only
    //e.respondWith(caches.match(e.request))

    // const source = new Promise((resolver, reject) =>{

    // })
})
