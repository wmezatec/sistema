# Arma manual-de-marca.pdf a partir de manual/plantilla.html.
# Uso (desde la carpeta del sistema): python manual/armar.py
# Necesita Python 3 y Google Chrome instalado. Editar el texto en plantilla.html y volver a correrlo.
import os, re, subprocess
AQUI = os.path.dirname(os.path.abspath(__file__))
RAIZ = os.path.dirname(AQUI)
CHROME = r"C:\Program Files\Google\Chrome\Application\chrome.exe"

def svg(f, w):
    s = open(os.path.join(RAIZ, "logo", f), encoding="utf-8").read()
    s = re.sub(r'\swidth="\d+"\sheight="\d+"', "", s, count=1)
    return s.replace("<svg ", f'<svg style="width:{w};height:auto;display:block" ', 1)

t = open(os.path.join(AQUI, "plantilla.html"), encoding="utf-8").read()
for k, v in {"LOGO": svg("wmtec-logo-oscuro.svg", "78mm"), "ISO": svg("wmtec-isotipo.svg", "170mm"),
             "LOGO_CH": svg("wmtec-logo-oscuro.svg", "50mm"), "ISO_CH": svg("wmtec-isotipo.svg", "55mm"),
             "LOGO_MENU": svg("wmtec-logo-oscuro.svg", "26mm"), "LOGO_DOC": svg("wmtec-logo-oscuro.svg", "22mm"),
             "ISO_FIN": '<div style="display:inline-block">' + svg("wmtec-isotipo.svg", "22mm") + "</div>"}.items():
    t = t.replace("{{" + k + "}}", v)
html = os.path.join(AQUI, "manual.html")
open(html, "w", encoding="utf-8").write(t)
pdf = os.path.join(RAIZ, "manual-de-marca.pdf")
subprocess.run([CHROME, "--headless=new", "--disable-gpu", "--no-pdf-header-footer", "--virtual-time-budget=8000",
                "--print-to-pdf=" + pdf, "file:///" + html.replace("\\", "/")], capture_output=True)
os.remove(html)
print("Listo:", pdf)
