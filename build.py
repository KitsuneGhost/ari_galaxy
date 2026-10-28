"""Create the standalone gift after editing dist/content.js."""
from pathlib import Path

root = Path(__file__).parent
dist = root / 'dist'
html = (dist / 'index.html').read_text()
css = (dist / 'style.css').read_text()
html = html.replace('<link rel="stylesheet" href="style.css">', '<style>' + css + '</style>')
for filename in ('content.js', 'app.js'):
    source = (dist / filename).read_text().replace('</script', '<\\/script')
    html = html.replace(f'<script src="{filename}"></script>', '<script>' + source + '</script>')
output = root / 'a-universe-for-ari.html'
output.write_text(html)
print(output)
