# Edicionvideo-A

Proyecto Remotion vertical (1080x1920, 30 fps) para editar vídeos siguiendo `estilo.md`.

## Flujo

1. Sube `referencia.mp4` y `mi-video.mp4` a `public/`.
2. `npm run whisper:instalar`: compila whisper.cpp y descarga el modelo (`small`, multilingüe).
3. `npm run transcribir -- public/mi-video.mp4 es`: genera `public/mi-video.captions.json`.
4. `npm run dev`: abre Remotion Studio (composición `Vertical`).
5. `npm run render`: exporta `out/video.mp4`.

Las skills de Remotion están en `.agents/skills` (instaladas con `npx skills add remotion-dev/skills`).
