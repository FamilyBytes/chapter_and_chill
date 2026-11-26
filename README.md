# Chapter & Chill · Guía para publicarla como app (PWA)

## Archivos

```
index.html               ← la app
manifest.webmanifest     ← nombre, colores e iconos de la app instalada
sw.js                    ← service worker (funciona sin conexión)
icons/
  icon.svg               ← icono principal (pestaña del navegador)
  icon-maskable.svg      ← versión a sangre para Android
  icon-192.png
  icon-512.png
  icon-maskable-512.png
  apple-touch-icon.png   ← 180×180 para iPhone
```

Sube todo a la raíz del repositorio, respetando la carpeta `icons/`.

> Si generas los PNG tú misma desde los SVG: `icon-192.png` (192×192) y `icon-512.png` (512×512) salen de `icon.svg`. `icon-maskable-512.png` (512×512) y `apple-touch-icon.png` (180×180) salen de `icon-maskable.svg`. Sin estos PNG el service worker no se instala.

## 1. Antes de nada: guarda tus datos

Cada dirección web tiene su propio almacenamiento, así que en la nueva dirección la app empezará vacía.

1. Abre la versión que usas ahora → **Control** → **Copia completa**. Guarda el `.json`.
2. Pásate ese archivo al móvil (Drive, correo, AirDrop…).

## 2. Publicar en GitHub Pages

1. En GitHub: **New repository**, por ejemplo `chapter-and-chill`. Puede ser público.
2. **Add file → Upload files** → arrastra todos los archivos y la carpeta `icons` → **Commit changes**.
3. **Settings → Pages** → *Source*: **Deploy from a branch** → rama `main`, carpeta `/ (root)` → **Save**.
4. Espera 1–2 minutos. La app queda en `https://TU-USUARIO.github.io/chapter-and-chill/`.

Tus calendarios no se suben a GitHub: solo se sube el código. Los datos viven en tu móvil.

## 3. Instalarla

**Android (Chrome)**
1. Abre la dirección.
2. Menú **⋮** → **Instalar app** (o *Añadir a pantalla de inicio* → *Instalar*).

**iPhone (Safari)**
1. Abre la dirección en Safari. Desde otros navegadores no se puede instalar en iOS.
2. Botón **Compartir** → **Añadir a pantalla de inicio** → **Añadir**.

## 4. Recuperar tus datos

1. Abre la app desde el icono de la pantalla de inicio, no desde el navegador. En iPhone son almacenamientos distintos.
2. **Control** → **Importar** → **Reemplazar todo** → **Elegir archivo** → elige el `.json`.

## 5. Publicar cambios

1. Sube el `index.html` nuevo (y lo que hayas cambiado).
2. En `sw.js`, cambia `const VERSION = 'v1'` por `'v2'`, `'v3'`… y súbelo también.
3. Cierra y vuelve a abrir la app con conexión. Si no ves el cambio, ciérrala del todo una segunda vez.

## Ten en cuenta

- **Sin conexión:** la app, las fuentes y las portadas que ya hayas visto funcionan sin internet. La búsqueda de portadas necesita conexión.
- **Copias:** exporta de vez en cuando. Si desinstalas la app o borras los datos del navegador, se pierden los calendarios.
- **No cambies la dirección:** si renombras el repositorio, la app instalada se queda en la antigua y los datos no se mudan.
- **Probar en el ordenador:** abrir `index.html` con doble clic funciona, pero sin modo instalable. Para probar la PWA hace falta un servidor, por ejemplo `npx serve .` y abrir `http://localhost:3000`.
