"""Prepare approved ad artwork as compact web assets. Run after replacing source PNGs."""
from pathlib import Path
import argparse
from PIL import Image

parser = argparse.ArgumentParser()
parser.add_argument('source', type=Path)
args = parser.parse_args()
out = Path(__file__).resolve().parents[1] / 'public/images/ads'
out.mkdir(parents=True, exist_ok=True)
for name in ('genstudio', 'localscribe', 'checkers'):
    with Image.open(args.source / f'{name}.png') as image:
        image.thumbnail((720, 600), Image.Resampling.LANCZOS)
        image.convert('RGB').save(out / f'{name}.webp', 'WEBP', quality=84, method=6)
    print(f'{name}: {(out / f"{name}.webp").stat().st_size} bytes')
