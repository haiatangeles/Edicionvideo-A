# Une los trozos de palabra de Whisper y aplica correcciones de texto.
# Uso: python3 scripts/limpiar-subtitulos.py <entrada.captions.json> <salida.json> <correcciones.json>
# correcciones.json: lista de ["texto mal", "texto bien"] (frases completas, palabra a palabra)
import json
import re
import sys

entrada, salida, ruta_correcciones = sys.argv[1:4]
tokens = json.load(open(entrada))
correcciones = json.load(open(ruta_correcciones))

# 1) Unir trozos: un trozo sin espacio delante continúa la palabra anterior
palabras = []
for t in tokens:
    texto = t["text"]
    if palabras and (not texto.startswith(" ") or re.fullmatch(r"[.,?!]+", texto.strip())):
        palabras[-1]["text"] += texto.strip() if not texto.startswith(" ") else texto.strip()
        palabras[-1]["endMs"] = t["endMs"]
    else:
        palabras.append({"text": texto.strip(), "startMs": t["startMs"], "endMs": t["endMs"]})
palabras = [p for p in palabras if p["text"] and not p["text"].startswith("[")]


def normal(s):
    return s.lower()


# 2) Correcciones: reemplaza una secuencia de palabras repartiendo su tiempo
for mal, bien in correcciones:
    m = mal.split()
    b = bien.split()
    i = 0
    while i <= len(palabras) - len(m):
        if [normal(p["text"]) for p in palabras[i : i + len(m)]] == [normal(x) for x in m]:
            ini, fin = palabras[i]["startMs"], palabras[i + len(m) - 1]["endMs"]
            paso = (fin - ini) / max(1, len(b))
            nuevas = [
                {"text": w, "startMs": round(ini + k * paso), "endMs": round(ini + (k + 1) * paso)}
                for k, w in enumerate(b)
            ]
            palabras[i : i + len(m)] = nuevas
            i += len(b)
        else:
            i += 1

# 3) Formato Caption de @remotion/captions (espacio delante de cada palabra salvo la primera)
caps = [
    {
        "text": (" " if k else "") + p["text"],
        "startMs": p["startMs"],
        "endMs": p["endMs"],
        "timestampMs": (p["startMs"] + p["endMs"]) // 2,
        "confidence": None,
    }
    for k, p in enumerate(palabras)
]
json.dump(caps, open(salida, "w"), ensure_ascii=False, indent=1)
print(len(caps), "palabras ->", salida)
print(" ".join(p["text"] for p in palabras))
