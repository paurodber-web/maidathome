
import os
from PIL import Image

SUBURBS_PHOTOS_DIR = "../suburb_photos"

# Ensure the directory exists
if not os.path.exists(SUBURBS_PHOTOS_DIR):
    print(f"Error: {SUBURBS_PHOTOS_DIR} does not exist.")
    exit(1)

# List all webp files
files = [f for f in os.listdir(SUBURBS_PHOTOS_DIR) if f.lower().endswith(".webp")]

print(f"Optimizing {len(files)} images...")

for filename in files:
    filepath = os.path.join(SUBURBS_PHOTOS_DIR, filename)
    try:
        with Image.open(filepath) as img:
            # We want to re-save with higher compression (lower quality) but max method
            # Quality 75 provides a great balance for photos (almost indistinguishable from 85)
            # method 6 uses the most CPU to find the smallest file size for that quality
            img.save(filepath, "WEBP", quality=75, method=6)
            print(f"Optimized: {filename}")
    except Exception as e:
        print(f"Error processing {filename}: {e}")

print("All images optimized.")
