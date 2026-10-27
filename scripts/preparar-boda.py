# Prepara stickers de boda, marco vintage, fondo scrapbook y ramo con fondo transparente.
# Uso: python3 scripts/preparar-boda.py <emojis.jpg> <ramo.jpg> <scrapbook.jpg> <marco.jpg>
import sys

import numpy as np
from PIL import Image, ImageDraw, ImageFilter

emojis, ramo, scrapbook, marco = sys.argv[1:5]


def quitar_color(im, color, tol_baja, tol_alta):
    """Alfa 0 cerca del color de fondo y 255 lejos, con borde suave."""
    a = np.asarray(im).astype(float)
    d = np.sqrt(((a - np.array(color)) ** 2).sum(axis=2))
    alfa = np.clip((d - tol_baja) / (tol_alta - tol_baja), 0, 1) * 255
    return Image.fromarray(alfa.astype(np.uint8))


def fondo_desde_bordes(im, es_fondo):
    """Fondo = píxeles que cumplen es_fondo y están conectados con el borde."""
    m = Image.fromarray(np.where(es_fondo, 255, 0).astype(np.uint8)).copy()
    W, H = m.size
    for x in range(0, W, 10):
        for y in (0, H - 1):
            if m.getpixel((x, y)) == 255:
                ImageDraw.floodfill(m, (x, y), 128)
    for y in range(0, H, 10):
        for x in (0, W - 1):
            if m.getpixel((x, y)) == 255:
                ImageDraw.floodfill(m, (x, y), 128)
    return np.asarray(m) == 128


def guardar(rgb, alfa, ruta, recorte=None):
    rgba = rgb.convert("RGBA")
    rgba.putalpha(alfa)
    if recorte:
        rgba = rgba.crop(recorte)
    rgba = rgba.crop(rgba.getbbox())
    rgba.save(ruta, optimize=True)
    print(ruta, rgba.size)


# 1) Stickers de boda: gris liso conectado con el borde de cada caja -> transparente,
#    más los huecos cerrados que también son gris liso (p. ej. dentro de los anillos)
im = Image.open(emojis).convert("RGB")
GRIS = np.array((233, 233, 233))


def alfa_sticker(trozo, quitar_huecos):
    a = np.asarray(trozo).astype(int)
    gris = np.abs(a - GRIS).max(axis=2) <= 4
    fondo = fondo_desde_bordes(trozo, gris)
    m = Image.fromarray(np.where(gris & ~fondo, 255, 0).astype(np.uint8)).copy()
    restos = np.argwhere(np.asarray(m) == 255) if quitar_huecos else []
    for y, x in restos[:: max(1, len(restos) // 400)] if len(restos) else []:
        if m.getpixel((int(x), int(y))) != 255:
            continue
        ImageDraw.floodfill(m, (int(x), int(y)), 100)
        zona = np.asarray(m) == 100
        if zona.sum() > 600:
            fondo = fondo | zona
        m = Image.fromarray(np.where(zona, 50, np.asarray(m)).astype(np.uint8)).copy()
    return Image.fromarray(np.where(fondo, 0, 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(1))


cajas = {
    "arco": (35, 520, 320, 830),
    "cisnes": (360, 625, 715, 810),
    "copas": (785, 585, 1025, 835),
    "pastel": (50, 900, 305, 1210),
    "vestido": (360, 875, 715, 1200),
    "novia": (785, 875, 995, 1205),
    "anillos": (75, 1280, 330, 1490),
    "tacones": (395, 1260, 690, 1490),
    "traje": (785, 1220, 1005, 1520),
    "rosas": (35, 1520, 310, 1825),
    "auto": (345, 1635, 740, 1795),
    "corazon": (775, 1585, 1000, 1800),
}
for nombre, caja in cajas.items():
    trozo = im.crop(caja)
    guardar(trozo, alfa_sticker(trozo, nombre == "anillos"), f"public/stickers/{nombre}.png")

# 2) Ramo: fondo blanco/gris claro conectado con el borde
im = Image.open(ramo).convert("RGB")
a = np.asarray(im).astype(int)
claro = (a.min(axis=2) > 222) & ((a.max(axis=2) - a.min(axis=2)) < 10)
fondo = fondo_desde_bordes(im, claro)
alfa = Image.fromarray(np.where(fondo, 0, 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(1.5))
guardar(im, alfa, "public/stickers/ramo.png")

# 3) Marco vintage: fondo blanco -> transparente
im = Image.open(marco).convert("RGB")
a = np.asarray(im).astype(int)
fondo = fondo_desde_bordes(im, a.min(axis=2) > 246)
alfa = Image.fromarray(np.where(fondo, 0, 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(1))
guardar(im, alfa, "public/vintage/marco.png")

# 4) Scrapbook: se quita la franja con la marca de Pinterest y se rellena a 1080x1920
im = Image.open(scrapbook).convert("RGB")
im = im.crop((0, 130, 1080, 1920))
escala = 1920 / im.size[1]
im = im.resize((round(1080 * escala), 1920), Image.LANCZOS)
x = (im.size[0] - 1080) // 2
im.crop((x, 0, x + 1080, 1920)).save("public/vintage/scrapbook.jpg", quality=92)
print("scrapbook ok", escala)
