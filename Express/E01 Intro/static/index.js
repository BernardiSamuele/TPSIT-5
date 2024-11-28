"use strict"
$(document).ready(function() {
	
	let div = $("div")

    $("#btnGet").on("click", async function() {
        let data = await inviaRichiesta("GET", "/api/richiesta1", { "nome": "Aurora" });
		console.log(data)
        if(data) {
           div.empty()
		   div.text(JSON.stringify(data))
        }
    });

    $("#btnPost").on("click", async function() {
        let data = await inviaRichiesta("PATCH", "/api/richiesta2", {"nome": "Unico", "nVampiri": 3});
        if(data) {
           div.empty()
		   div.text(JSON.stringify(data))
        }
    });

    $("#btnParams").on("click", async function() {
		// Richiedi gli unicorni di genere maschile e pelo grigio
        let data = await inviaRichiesta("GET", "/api/richiestaParams/m/brown");
        if(data) {
           div.empty()
		   for(let item of data) 
			 $("<div>").text(JSON.stringify(item)).appendTo(div)
        }
    });

});