function AjaxZahtev(options, callback) {
  var req = new XMLHttpRequest();
  req.open(options.metod, options.putanja, true);
  req.addEventListener("load", function() {
    if (req.status < 400) {
 		  callback(req.responseText);
    }
    else {
 		  callback(new Error("Request failed: " + req.statusText));
    }
  });
  req.addEventListener("error", function() {
    callback(new Error("Network error"));
  });
  req.send(options.sadrzaj || null);
}

function dodajZadatak(ime, zadatak){
  var options = {}
  options.metod = "GET"
  options.putanja  = "dodaj-zadatak?ime=" + ime + "&zadatak=" + zadatak
  options.sadrzaj = ""
  AjaxZahtev(options, ProcesirajOdgovor)
}

function listajZadatke(ime, zadatak){
  var options = {}
  options.metod = "GET"
  options.putanja  = "listaj-zadatke?ime=" + ime
  options.sadrzaj = ""
  AjaxZahtev(options, ProcesirajOdgovor)
}

window.onload = function(){
  var form = document.querySelector("form");
  document.getElementById('ime').addEventListener('change',function(event){
    event.preventDefault();
    listajZadatke(document.querySelector("#ime").value)
  });
  form.addEventListener("submit", function(event) {
    event.preventDefault();
    dodajZadatak(document.querySelector("#ime").value,form.elements.zadatak.value);
    form.reset();
  });
}

function ProcesirajOdgovor(odgovor){
  odgovor = JSON.parse(decodeURI(odgovor));
  lista=document.getElementById("lista")
  lista.innerHTML=""
  for (i=0; i < odgovor.length; i++) { 
     lista.innerHTML += "<div><span class='zadatak'>"+odgovor[i]['zadatak']+"</span><span><button onclick='Brisi(this)'>Brisi</button></span><div>"
  }
}

function Brisi(x){
 var options = {}
  ime=document.getElementById('ime').value
  zadatak = x.parentNode.previousElementSibling.innerHTML
  options.metod = "GET"
  options.putanja  = "brisi-zadatak?ime=" + ime + "&zadatak=" + zadatak
  options.sadrzaj = ""
  AjaxZahtev(options, ProcesirajOdgovor)
}

