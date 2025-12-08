import os
import subprocess
import shutil

# --- Paths ---
base_dir = r"C:\Users\ather\shorts vid creater"
temp_dir = os.path.join(base_dir, "temp")
output_dir = os.path.join(base_dir, "videos")
output_file = os.path.join(output_dir, "final_video.mp4")

os.makedirs(output_dir, exist_ok=True)

# --- Get only valid mp4s ---
clips = sorted([
    os.path.join(temp_dir, f)
    for f in os.listdir(temp_dir)
    if f.lower().endswith(".mp4") and os.path.getsize(os.path.join(temp_dir, f)) > 10000
])

if not clips:
    print(" No valid clips found to join. Aborting.")
    exit()

# --- Write list.txt ---
list_file = os.path.join(temp_dir, "list.txt")
with open(list_file, "w", encoding="utf-8") as f:
    for clip in clips:
        # Use forward slashes for FFmpeg
        f.write(f"file '{clip.replace('\\', '/')}'\n")

# --- Combine with ffmpeg ---
print("\n  Concatenating final video...\n")

final_cmd = [
    "ffmpeg", "-y",
    "-f", "concat", "-safe", "0",
    "-i", list_file,
    "-c", "copy", output_file
]
result = subprocess.run(final_cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)

if os.path.exists(output_file):
    print(f" Final video created at:\n{output_file}")

import shutil

frontend_path = r"C:\Users\ather\shorts vid creater\front\public\videos\final_video.mp4"
shutil.copy(output_file, frontend_path)
