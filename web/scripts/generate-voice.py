# /// script
# requires-python = "==3.12.*"
# dependencies = ["kokoro==0.9.4", "soundfile", "numpy", "pip"]
# ///
"""Generates Allison's voice clips from web/src/lines.json with Kokoro. Run with: npm run web:voice"""
import json
from pathlib import Path

import numpy as np
import soundfile as sf
from kokoro import KPipeline

VOICE = "bf_emma"
SAMPLE_RATE = 24000
RECORDED_MOMENTS = {"greeting"}

web = Path(__file__).resolve().parent.parent
script = json.loads((web / "src" / "lines.json").read_text())
pipeline = KPipeline(lang_code="b", repo_id="hexgrad/Kokoro-82M")

for moment, lines in script.items():
  if moment in RECORDED_MOMENTS:
    continue
  for line in lines:
    audio = np.concatenate([result.audio.numpy() for result in pipeline(line["text"], voice=VOICE)])
    sf.write(web / "public" / "audio" / f"{line['id']}.wav", audio, SAMPLE_RATE, subtype="PCM_16")
    print(line["id"])
