console.log('APP.js');
if(navigator.serviceWorker){ //Validar si es soportado el service worker en el navegador
    navigator.serviceWorker.register("sw.js")
}