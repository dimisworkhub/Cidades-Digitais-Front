    	var info = {login: "", senha: ""};
        function changer(){

        var x = document.getElementById("submitLogin") ;
		info.login = x.value;

		var y = document.getElementById("submitSenha") ;
		info.senha = y.value;
		}

		function envio(){
		    var objetivo = JSON.stringify(info);
		    fetch("http://localhost:8000", {
			    method: "GET"
			})
			.then(function(response) {
				response.json().then(function(user){
				console.log(user.name);
				});
			  })
		    .catch(function(error){
			    console.log("Ao menos aqui eu vejo o erro: " + error.message);
		    });
		}