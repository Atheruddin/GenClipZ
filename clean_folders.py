import os

base_dir = r"C:\Users\ather\shorts vid creater"
folders_to_clean = ["image", "audio", "temp", "videos"]

for folder_name in folders_to_clean:
    folder_path = os.path.join(base_dir, folder_name)
    if not os.path.exists(folder_path):
        continue
    for file in os.listdir(folder_path):
        file_path = os.path.join(folder_path, file)
        try:
            os.remove(file_path)
        except Exception as e:
            print(f" Failed to delete {file_path}: {e}")
print(" All folders cleaned.")
