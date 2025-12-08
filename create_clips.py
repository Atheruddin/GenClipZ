import os
import subprocess
import re

# --- Path Setup ---
base_dir = r"C:\Users\ather\shorts vid creater"
image_dir = os.path.join(base_dir, "image")
audio_dir = os.path.join(base_dir, "audio")
temp_dir = os.path.join(base_dir, "temp")

os.makedirs(temp_dir, exist_ok=True)

# --- Step 1: Clean old .mp4 and list.txt files from temp ---
for f in os.listdir(temp_dir):
    if f.lower().endswith(".mp4") or f == "list.txt":
        try:
            os.remove(os.path.join(temp_dir, f))
        except Exception as e:
            print(f" Failed to delete {f}: {e}")

# --- Step 2: Normalization Function ---
def normalize(name):
    return re.sub(r'[^a-z0-9]', '', name.lower())

# --- Step 3: Map normalized audio file names ---
audio_files = [
    f for f in os.listdir(audio_dir)
    if f.lower().endswith(".mp3")
]
audio_map = {normalize(os.path.splitext(f)[0]): f for f in audio_files}

# --- Step 4: Process all images ---
image_files = sorted([
    f for f in os.listdir(image_dir)
    if f.lower().endswith((".png", ".jpg", ".jpeg"))
])

print("Generating short clips...\n")

for img_file in image_files:
    print(f"\n  Image: {img_file}")

    # Clean image file name
    raw_title = img_file.replace("img_", "").replace("_for_educational_short_video", "")
    raw_title_no_ext = os.path.splitext(raw_title)[0]
    norm_title = normalize(raw_title_no_ext)

    # Match with normalized audio name
    matched_audio = audio_map.get(norm_title)

    if matched_audio:
        audio_path = os.path.join(audio_dir, matched_audio)
        video_path = os.path.join(temp_dir, raw_title_no_ext + ".mp4")

        print(f" Matched audio: {matched_audio}")
        print(f" Creating video: {video_path}")

        cmd = [
                "ffmpeg", "-y",
                "-loop", "1", "-i", os.path.join(image_dir, img_file),
                "-i", audio_path,
                "-vf", "fade=t=in:st=0:d=0.5",
                "-c:v", "libx264", "-preset", "ultrafast", "-tune", "stillimage",
                "-c:a", "aac", "-b:a", "192k",
                "-pix_fmt", "yuv420p",
                "-shortest", video_path
        ]

        result = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)

        if not os.path.exists(video_path):
            print(f" FFmpeg failed for: {img_file}")
            print(result.stderr)
    else:
        print(f"  No matching audio for: {raw_title_no_ext} (normalized: {norm_title})")
