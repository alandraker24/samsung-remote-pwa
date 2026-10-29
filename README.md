# Samsung Remote PWA (prototipo)

Interfaz PWA en español, optimizada para iPhone. Está configurada para probar comandos de control remoto Samsung Smart TV por WebSocket seguro.

## Importante antes de publicarla
- Este proyecto **no está publicado en Internet todavía**.
- La conexión directa desde una PWA servida por HTTPS a una TV local puede ser bloqueada por Safari/iOS debido a certificados locales, políticas de seguridad o permisos de red.
- Samsung puede pedir que se acepte la conexión en la propia TV.
- La IP de la TV debe ser la dirección local de la red Wi-Fi.
- La compatibilidad de los comandos debe verificarse con el modelo y firmware reales. No se garantiza que encendido desde apagado funcione.

## Publicar gratis con GitHub Pages
1. Crea o inicia sesión en GitHub.
2. Crea un repositorio público llamado `samsung-remote-pwa`.
3. Sube todos los archivos de esta carpeta a la raíz del repositorio.
4. En el repositorio, abre **Settings → Pages**.
5. En **Build and deployment**, elige **Deploy from a branch**, selecciona `main` y `/ (root)`, y guarda.
6. GitHub mostrará la URL pública en esa misma pantalla. Normalmente será `https://TU-USUARIO.github.io/samsung-remote-pwa/`.

## Añadir al iPhone
1. Abre la URL publicada en Safari.
2. Pulsa Compartir.
3. Selecciona **Añadir a pantalla de inicio**.
4. Abre la app desde el nuevo icono.

## Obtener la IP del televisor
En la TV, ve a Ajustes → General → Red → Estado de red o Configuración IP. La ruta exacta cambia según el firmware.

## Nota técnica
La app intenta usar el endpoint `wss://IP_DE_TV:8002/api/v2/channels/samsung.remote.control`. Si el navegador no puede completar el handshake por el certificado o por políticas de acceso local, no se puede arreglar solo con CSS/HTML; hará falta una app puente en la red local o una app iOS nativa.
