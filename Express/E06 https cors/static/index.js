'use strict'
$(document).ready(function() {

	$("#btnUnicorns").on("click", function(){				
		//getData("https://robertomana-crudserver.onrender.com/api/recipes")		
		getData("/api/unicorns")	
	})


	$("#btnPeople").on("click", function(){		
		//getData("https://randomuser.me/api?results=5")	
		getData("/api/people")	
	})
		
	async function getData(url){
		let response = await inviaRichiesta("GET", url)
		if(response.status == 200){			
			// randomUser NON resitituisce un array ma un signolo json results
			if(!Array.isArray(data)) {
				data=data.results
			}
			
			let ref = $(".data") 
			ref.empty()
			for (let item of data){
				let text = JSON.stringify(item, null, 5)
				 .replaceAll("\n", "<br>")  // tolgo i 5 spazi
				 .replaceAll("     ", "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;")  
				$("<div>").appendTo(ref).html(text)
			}			
		}	
		else	
		    alert(response.status + " : " + response.err)	
	}


})
