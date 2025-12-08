import shutil
import os
import re
import sys
from gradio_client import Client

# Get inputs
text = sys.argv[1]
voice = sys.argv[2]
speed = float(sys.argv[3])
title = sys.argv[4]

# Debug
print("Sending to Gradio with:")
print("  text =", repr(text))
print("  voice =", repr(voice))
print("  speed =", speed)
print("  use_gpu =", 'False')

# Clean title for filename
safe_title = re.sub(r'[^a-zA-Z0-9_\-]', '_', title)[:50]
filename = safe_title + ".mp3"
output_dir = r"C:\Users\ather\shorts vid creater\audio"
os.makedirs(output_dir, exist_ok=True)
final_path = os.path.join(output_dir, filename)

# Connect to Gradio
client = Client("http://localhost:40001")

try:
    # Important: send use_gpu as string 'False'
    result = client.predict(text, voice, speed, 'False', api_name="/generate_first")
except Exception as e:
    print(f"[ERROR] Gradio prediction failed: {e}")
    sys.exit(1)

# Save the file
try:
    if not result or not isinstance(result, tuple) or not os.path.exists(result[0]):
        raise FileNotFoundError(f"Audio file not created correctly: {result}")

    shutil.move(result[0], final_path)
    print(f"Saved to: {final_path}")
except Exception as e:
    print(f"[ERROR] Failed to save audio: {e}")
    sys.exit(1)
