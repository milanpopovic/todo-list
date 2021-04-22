import http.server, os, json, pickle
BaseHandler = http.server.BaseHTTPRequestHandler

try:
    fileObject = open('storage','rb')
    zadaci = pickle.load(fileObject)
    fileObject.close()https://github.com/milanpopovic/zadaci.git
except:
    zadaci=[]
    
def dodajZadatak(path):
    ime, zadatak = path.split("?")[1].split("&")
    ime = ime.split("=")[1]
    zadatak = zadatak.split("=")[1]
    if ime != "" and zadatak != "":
        zadaci.append({"ime": ime, "zadatak": zadatak})
    za_slanje = [ zadatak for zadatak in zadaci if zadatak['ime'] == ime]
    return json.dumps(za_slanje, ensure_ascii=False)

def listajZadatke(path):
    ime = path.split("?")[1]
    ime = ime.split("=")[1]
    za_slanje = [ zadatak for zadatak in zadaci if zadatak['ime'] == ime]
    return json.dumps(za_slanje, ensure_ascii=False)

def brisiZadatak(path):
    ime, zadatak = path.split("?")[1].split("&")
    ime = ime.split("=")[1]
    zadatak = zadatak.split("=")[1]
    for i in range(len(zadaci)):
        if zadaci[i]['ime'] == ime and zadaci[i]['zadatak'] == zadatak:
            del zadaci[i]
            break
    za_slanje = [ zadatak for zadatak in zadaci if zadatak['ime'] == ime]
    return json.dumps(za_slanje, ensure_ascii=False)

class Handler(BaseHandler):
    def _set_headers(self, type):
        self.send_response(200)
        self.send_header('Content-type', type)
        self.end_headers()
    def do_GET(self):
        filename = self.path.split("/")[-1]
        if filename == "" : filename = "index.html"
        if os.access(filename, os.R_OK) and not os.path.isdir(filename):
            ext = filename.split(".")[-1]                       # Klijent zahteva fajl
            mode = "r"
            if ext in ["html","htm"]: content_type = "text/html"
            elif ext in ["txt","js","py","php"]: content_type = "text/plain"
            elif ext in ["css"]: content_type = "text/css"
            elif ext in ["ico","jpg","jpeg","png","gif"]:
                content_type = "image/x-icon"
                mode = "rb"
            content = open(filename, mode).read()
            if mode == "r": content = str.encode(content)
            self._set_headers(content_type)
            self.wfile.write(content)
        else: # Ajax zahtev
            odgovor = zadaci
            op = self.path.split("?")[0]
            if op == '/dodaj-zadatak':
                odgovor = dodajZadatak(self.path)
            elif op == '/brisi-zadatak':
                odgovor = brisiZadatak(self.path)
            elif op == '/listaj-zadatke':
                odgovor=listajZadatke(self.path)
            self._set_headers("text/json")
            self.wfile.write(str.encode(str(odgovor)))
    def do_POST(self):
        putanja = self.path
        metod = self.command
        duzina_sadrzaja = int(self.headers['Content-Length'])
        sadrzaj = self.rfile.read(duzina_sadrzaja).decode("utf-8")
        odgovor = {"metod": metod, "putanja": putanja, "sadrzaj": sadrzaj}
        self._set_headers("text/json")
        self.wfile.write(str.encode(str(odgovor)))
try:
    port = int(os.environ["PORT"])
    port = 9000
    httpd = http.server.HTTPServer(('0.0.0.0',port), Handler)
    #httpd = http.server.HTTPServer(('',port), Handler)
    print("Server startovan...")
    httpd.serve_forever()
except:
    fileObject = open('storage','wb')
    pickle.dump(zadaci,fileObject)
    fileObject.close()
    print("Server stopiran")

