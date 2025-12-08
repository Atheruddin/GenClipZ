import os
import subprocess

# --- Path Config ---
base_dir = r"C:\Users\ather\shorts vid creater"
image_dir = os.path.join(base_dir, "image")
audio_dir = os.path.join(base_dir, "audio")
temp_dir = os.path.join(base_dir, "temp")
output_dir = os.path.join(base_dir, "videos")
output_file = os.path.join(output_dir, "final_video.mp4")

# Ensure necessary folders exist
os.makedirs(temp_dir, exist_ok=True)
os.makedirs(output_dir, exist_ok=True)

# --- Step 1: Create individual clips from image + audio ---
clips = []
image_files = sorted([
    f for f in os.listdir(image_dir)
    if f.lower().endswith((".png", ".jpg", ".jpeg"))
])

print(" Generating short clips...\n")

for img_file in image_files:
    base = os.path.splitext(img_file)[0].replace("img_", "").replace("_for_educational_short_video", "")
    audio_file = base + "_.mp3"
    audio_path = os.path.join(audio_dir, audio_file)

    if os.path.exists(audio_path):
        video_path = os.path.join(temp_dir, base + ".mp4")

        cmd = [
            "ffmpeg", "-y",
            "-loop", "1", "-i", os.path.join(image_dir, img_file),
            "-i", audio_path,
            "-vf", "fade=t=in:st=0:d=0.5",
            "-c:v", "libx264", "-tune", "stillimage",
            "-c:a", "aac", "-b:a", "192k",
            "-pix_fmt", "yuv420p",
            "-shortest", video_path
        ]

        print(f" Creating video: {video_path}")
        result = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)

        if os.path.exists(video_path):
            clips.append(video_path)
        else:
            print(f" FFmpeg failed for: {img_file}")
            print(result.stderr)
    else:
        print(f" Skipped (audio not found): {audio_path}")

# --- Step 2: Write concat list for FFmpeg ---
list_file = os.path.join(temp_dir, "list.txt")
with open(list_file, "w", encoding="utf-8") as f:
    for clip in clips:
        f.write(f"file '{clip.replace('\\', '/')}'\n")

# --- Step 3: Debug output ---
print("\n Contents of list.txt:")
with open(list_file, "r", encoding="utf-8") as f:
    contents = f.read()
    print(contents)

if contents.strip() == "":
    print(" list.txt is empty! No video clips were created. Aborting.")
    input("\nPress Enter to exit...")
    exit()

# --- Step 4: Concatenate videos ---
final_cmd = [
    "ffmpeg", "-y",
    "-f", "concat", "-safe", "0",
    "-i", list_file,
    "-c", "copy", output_file
]

print("\n Concatenating final video...\n")
result = subprocess.run(final_cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)

# --- Step 5: Final check ---
if os.path.exists(output_file):
    print(f"\n Final video created at:\n{output_file}")
else:
    print("\n Final video NOT created. Check FFmpeg logs below:\n")
    print(result.stderr)

