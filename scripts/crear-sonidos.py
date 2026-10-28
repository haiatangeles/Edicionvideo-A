# Genera los efectos de sonido del vídeo (sin descargar nada). Uso: python3 scripts/crear-sonidos.py
import wave
from pathlib import Path

import numpy as np

SR = 44100
OUT = Path("public/sfx")
OUT.mkdir(parents=True, exist_ok=True)
rng = np.random.default_rng(7)


def t(seg):
    return np.arange(int(SR * seg)) / SR


def guardar(nombre, x):
    x = x / (np.max(np.abs(x)) + 1e-9) * 0.9
    est = np.stack([x, x], axis=1)
    with wave.open(str(OUT / f"{nombre}.wav"), "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes((est * 32767).astype(np.int16).tobytes())


def campanita(f, dur, decay):
    tt = t(dur)
    return sum(a * np.sin(2 * np.pi * f * m * tt) for m, a in [(1, 1), (2.76, 0.4), (5.4, 0.2)]) * np.exp(-tt * decay)


def pasa_bajos(x, alpha):
    y = np.zeros_like(x)
    for i in range(1, len(x)):
        y[i] = y[i - 1] + alpha * (x[i] - y[i - 1])
    return y


# Brillos: lluvia de campanitas agudas
dur = 1.8
brillos = np.zeros(int(SR * dur))
for _ in range(26):
    ini = int(rng.uniform(0, 1.2) * SR)
    nota = campanita(rng.uniform(2500, 6500), 0.6, rng.uniform(6, 12)) * rng.uniform(0.3, 1)
    fin = min(len(brillos), ini + len(nota))
    brillos[ini:fin] += nota[: fin - ini]
brillos *= np.minimum(1, t(dur) * 20)
guardar("brillos", brillos)

# Pop: burbuja corta
tt = t(0.14)
guardar("pop", np.sin(2 * np.pi * (900 - 3500 * tt) * tt) * np.exp(-tt * 30))

# Ding: campana suave
guardar("ding", campanita(1320, 1.2, 4) + 0.5 * campanita(1760, 1.2, 5))

# Click: tic seco
tt = t(0.05)
guardar("click", (np.sin(2 * np.pi * 2200 * tt) + rng.normal(0, 0.3, len(tt))) * np.exp(-tt * 120))

# Whoosh: ruido que barre
dur = 0.6
tt = t(dur)
ruido = rng.normal(0, 1, len(tt))
alpha = 0.02 + 0.25 * np.sin(np.pi * tt / dur) ** 2
woosh = np.zeros_like(ruido)
for i in range(1, len(ruido)):
    woosh[i] = woosh[i - 1] + alpha[i] * (ruido[i] - woosh[i - 1])
guardar("whoosh", woosh * np.sin(np.pi * tt / dur) ** 2)

# Avión: motor + aire que se acerca y se aleja (efecto Doppler)
dur = 3.0
tt = t(dur)
env = np.exp(-((tt - 1.4) ** 2) / 0.5)
f = 140 + 30 * np.tanh((1.4 - tt) * 3)
motor = np.sin(2 * np.pi * np.cumsum(f) / SR) + 0.5 * np.sin(2 * np.pi * np.cumsum(f * 2.01) / SR)
aire = pasa_bajos(rng.normal(0, 1, len(tt)), 0.08) * 3
guardar("avion", (0.6 * motor + aire) * env)
print("Sonidos creados en", OUT)
