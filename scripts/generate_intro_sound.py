"""Create an original, quiet 1.6-second welcome chime using only the standard library."""
from array import array
from pathlib import Path
import math
import sys
import wave

RATE = 24000
DURATION = 1.6
NOTES = ((523.25, 0.00), (659.25, 0.12), (783.99, 0.24), (1046.50, 0.38))
samples = []
for index in range(int(RATE * DURATION)):
    time = index / RATE
    value = 0.0
    for frequency, start in NOTES:
        age = time - start
        if age < 0:
            continue
        attack = min(1.0, age / 0.024)
        tail = math.exp(-age * 4.5)
        note = math.sin(2 * math.pi * frequency * age)
        note += 0.12 * math.sin(2 * math.pi * frequency * 2 * age)
        value += 0.115 * attack * tail * note
    # Smooth final fade to avoid an abrupt ending or clicks.
    fade = min(1.0, max(0.0, (DURATION - time) / 0.18))
    samples.append(int(max(-1, min(1, value * fade)) * 32767))
data = array('h', samples)
if sys.byteorder != 'little':
    data.byteswap()
target = Path(__file__).resolve().parents[1] / 'assets' / 'spotlight-chime.wav'
with wave.open(str(target), 'wb') as output:
    output.setnchannels(1)
    output.setsampwidth(2)
    output.setframerate(RATE)
    output.writeframes(data.tobytes())
print(f'{target.name}: {DURATION}s, {target.stat().st_size} bytes, peak {max(abs(s) for s in samples) / 32767:.3f}')
