	var cors_anywhere_url = 'https://cors-anywhere.herokuapp.com/';	
	var yelp_search_url = cors_anywhere_url + "https://api.yelp.com/v3/businesses/search?location=CITY&term=TERM";
	var btn = document.getElementById('find');

	function fetchTerms() {
		$.ajax({
		    type: "POST",
		    url: "/saltydog",		    
		    success: prepQuery
		});
	}

	function prepQuery(terms) {	 
		var inputs = JSON.parse(terms); // salted bearer token here in inputs
		var city = 'boston';  // get this from user input
		var term = 'burger';  // get this from user input
        var search_url = yelp_search_url.replace("CITY",city);
        search_url = search_url.replace("TERM",term);        
		seek(search_url,inputs,mycallbackfunc);
	}

	btn.addEventListener("click",function(){
		fetchTerms();
	});

	function mycallbackfunc(info){
		console.log(info);// do whatever you want with your info in the browser here
	}


    function seek(search_url,inputs,mycallbackfunc) {
		var xhr = new XMLHttpRequest();		
		xhr.open('GET', search_url, true);
		// bearer token is evaluated and sent off immediately in our query request to Yelp
		xhr.setRequestHeader("Authorization", "Bearer " + inputs[0].term1.replace(inputs[1].term2,""));
	  	xhr.onreadystatechange = function() {
		   if (xhr.readyState == 4 && xhr.status == 200) {            	          	             
	             mycallbackfunc(xhr.responseText);
	           }
	  	};		
		xhr.send();
	}
