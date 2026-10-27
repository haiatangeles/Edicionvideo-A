# Recorta las flores de la imagen de referencia con fondo transparente.
# Uso: python3 scripts/recortar-flores.py <imagen>
import sys

import numpy as np
from PIL import Image, ImageDraw, ImageFilter

im = Image.open(sys.argv[1]).convert("RGB")
a = np.asarray(im).astype(int)

# Fondo = casi blanco y conectado con el borde
blanco = (a.min(axis=2) > 236) & ((a.max(axis=2) - a.min(axis=2)) < 18)
mascara = Image.fromarray(np.where(blanco, 255, 0).astype(np.uint8)).copy()
W, H = mascara.size
for x in range(0, W, 20):
    for y in (0, H - 1):
        if mascara.getpixel((x, y)) == 255:
            ImageDraw.floodfill(mascara, (x, y), 128)
for y in range(0, H, 20):
    for x in (0, W - 1):
        if mascara.getpixel((x, y)) == 255:
            ImageDraw.floodfill(mascara, (x, y), 128)
fondo = np.asarray(mascara) == 128

flores = {
    "orquidea-rosa": ((40, 114, 470, 435), (250, 260)),
    "lirio-tallo": ((535, 25, 855, 412), (720, 180)),
    "mariposa": ((780, 305, 1062, 590), (920, 440)),
    "orquidea-verde": ((45, 452, 458, 800), (150, 580)),
    "hibisco": ((508, 428, 812, 735), (660, 580)),
    "lirio-grande": ((420, 822, 945, 1290), (680, 1080)),
    "azucena": ((78, 1138, 485, 1510), (280, 1320)),
    "lirio-rosa": ((22, 1525, 418, 1875), (220, 1700)),
}
for nombre, ((x0, y0, x1, y1), semilla) in flores.items():
    solido = Image.fromarray(np.where(~fondo, 255, 0).astype(np.uint8)).copy()
    # Solo la pieza conectada con la semilla (descarta trozos de flores vecinas)
    ImageDraw.floodfill(solido, semilla, 128)
    pieza = (np.asarray(solido) == 128)[y0:y1, x0:x1]
    alfa = Image.fromarray((pieza * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(1.2))
    rgba = im.crop((x0, y0, x1, y1)).convert("RGBA")
    rgba.putalpha(alfa)
    rgba = rgba.crop(rgba.getbbox())
    rgba.save(f"public/flores/{nombre}.png", optimize=True)
    print(nombre, rgba.size, f"{pieza.mean():.0%}")
