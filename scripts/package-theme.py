#!/usr/bin/env python3
"""Build a clean installable ZIP without repository, originals or local secrets."""
from pathlib import Path
import zipfile, hashlib
root=Path(__file__).resolve().parents[1]
theme=root/'wp-content/themes/dc-serwis'
output=root/'artifacts/dc-serwis.zip'
output.parent.mkdir(exist_ok=True)
with zipfile.ZipFile(output,'w',zipfile.ZIP_DEFLATED) as archive:
    for file in sorted(theme.rglob('*')):
        if file.is_file(): archive.write(file,Path('dc-serwis')/file.relative_to(theme))
print(output)
print('SHA256',hashlib.sha256(output.read_bytes()).hexdigest())
