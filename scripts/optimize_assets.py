"""Create web-sized copies while preserving the original portfolio evidence."""
from pathlib import Path
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / "assets"
ASSETS.mkdir(exist_ok=True)

sources = {
    "SHOPEE-ADS.png": "shopee-ads.webp",
    "TIKTOK-ADS.png": "tiktok-ads.webp",
    "DASHBOARD.png": "dashboard.webp",
    "PRICING.png": "pricing.webp",
    "Screenshot 2026-07-12 141543.png": "store-leader.webp",
    "Screenshot 2026-07-12 142039.png": "geospatial.webp",
    "SERTIFIKAT FUNDAMENTAL EXCEL.jpg": "excel-certificate.webp",
    "img5.jpg": "data-mining.webp",
}

for source, target in sources.items():
    with Image.open(ROOT / source) as original:
        image = ImageOps.exif_transpose(original).convert("RGB")
        # Keep dashboard text legible in the full-screen viewer.
        image.thumbnail((1920, 1440), Image.Resampling.LANCZOS)
        image.save(ASSETS / target, "WEBP", quality=88, method=6)
        print(f"{target}: {image.width}x{image.height}, {(ASSETS / target).stat().st_size:,} bytes")

with Image.open(ROOT / "profile-bayu.png") as original:
    image = ImageOps.exif_transpose(original).convert("RGB")
    for width in (480, 720):
        resized = ImageOps.contain(image, (width, width), Image.Resampling.LANCZOS)
        resized.save(ASSETS / f"bayu-{width}.webp", "WEBP", quality=85, method=6)
    preview = ImageOps.contain(image, (720, 720), Image.Resampling.LANCZOS)
    preview.save(ASSETS / "social-preview.jpg", "JPEG", quality=85, optimize=True)
