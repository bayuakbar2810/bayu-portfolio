"""Check document structure and every local asset before deployment."""
from collections import Counter
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit
import re
import sys

ROOT = Path(__file__).resolve().parents[1]
VOID = {"area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "param", "source", "track", "wbr"}


class SiteParser(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.ids = []
        self.references = []
        self.idrefs = []
        self.stack = []
        self.errors = []
        self.h1_count = 0
        self.projects = Counter()

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag not in VOID:
            self.stack.append(tag)
        if "id" in attrs:
            self.ids.append(attrs["id"])
        if tag == "h1":
            self.h1_count += 1
        if "data-category" in attrs:
            self.projects[attrs["data-category"]] += 1
        for name in ("href", "src", "data-lightbox"):
            if attrs.get(name):
                self.references.append(attrs[name])
        if "srcset" in attrs:
            self.references.extend(item.strip().split()[0] for item in attrs["srcset"].split(","))
        for name in ("aria-labelledby", "aria-describedby", "aria-controls"):
            self.idrefs.extend(attrs.get(name, "").split())
        if tag == "img" and "alt" not in attrs:
            self.errors.append("Image has no alt attribute")
        if tag == "a" and attrs.get("target") == "_blank" and "noopener" not in attrs.get("rel", ""):
            self.errors.append(f"External tab missing noopener: {attrs.get('href')}")
        if tag == "button" and attrs.get("type") != "button":
            self.errors.append("Button has no explicit button type")

    def handle_endtag(self, tag):
        if not self.stack or self.stack[-1] != tag:
            self.errors.append(f"Mismatched closing tag: {tag}, stack: {self.stack[-3:]}")
        else:
            self.stack.pop()


parser = SiteParser()
html = (ROOT / "index.html").read_text(encoding="utf-8")
parser.feed(html)
errors = parser.errors
errors.extend(f"Duplicate ID: {key}" for key, count in Counter(parser.ids).items() if count > 1)
errors.extend(f"Unclosed element: {tag}" for tag in parser.stack)
errors.extend(f"Missing ARIA target: {ref}" for ref in parser.idrefs if ref not in parser.ids)
if parser.h1_count != 1:
    errors.append(f"Expected one h1, got {parser.h1_count}")
if parser.projects != Counter({"marketing": 2, "data": 4}):
    errors.append(f"Unexpected project category counts: {parser.projects}")
for reference in parser.references:
    parsed = urlsplit(reference)
    if parsed.scheme or parsed.netloc:
        continue
    if parsed.path:
        path = ROOT / unquote(parsed.path)
        if not path.is_file():
            errors.append(f"Missing asset: {reference}")
    elif parsed.fragment and parsed.fragment not in parser.ids:
        errors.append(f"Broken anchor: {reference}")
if re.search(r"GAMBAR_SERTIFIKAT|cdn.tailwindcss|unpkg.com/aos", html):
    errors.append("An old placeholder or runtime CDN dependency remains")
if errors:
    print("\n".join(errors))
    sys.exit(1)
print(f"PASS: balanced HTML, {len(parser.ids)} unique IDs, {len(parser.references)} valid references, 6 projects, accessible control references.")
