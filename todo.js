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

var getBrowser = function() {
    var b = "unknown";
    try {
        var e;
        var f = e.width;
    } catch (e) {
        var err = e.toString();
        if(err.search("not an object") !== -1){
            return "safari";
        } else if(err.search("Cannot read") !== -1){
            return "chrome";
        } else if(err.search("e is undefined") !== -1){
            return "firefox";
        } else if(err.search("Unable to get property 'width' of undefined or null reference") !== -1){
            if(!(false || !!document.documentMode) && !!window.StyleMedia){
                return "edge";
            } else {
                return "IE";
            }
        } else if(err.search("cannot convert e into object") !== -1){
            return "opera";
        } else {
            return undefined;
        }
    }
};

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

function brisiZadatak(x){
 var options = {}
  ime=document.getElementById('ime').value
  zadatak = x.nextElementSibling.innerHTML
  options.metod = "GET"
  options.putanja  = "brisi-zadatak?ime=" + ime + "&zadatak=" + zadatak
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
     if (getBrowser() === "Safari"){
         lista.innerHTML += "<p><span class='dugme-code' onclick='brisiZadatak(this)'>&#128465;</span><span class='zadatak'>"+odgovor[i]['zadatak']+ "</span></p>"
     }
     else {
     lista.innerHTML += "<p><img src='trash.png' class='dugme-icon' onclick='brisiZadatak(this)'><span class='zadatak'>"+odgovor[i]['zadatak']+ "</span></p>"
     }
  }
}


