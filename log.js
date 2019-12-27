    	var info = {login: "", senha: ""};
        function changer(){

        var x = document.getElementById("submitLogin") ;
		info.login = x.value;

		var y = document.getElementById("submitSenha") ;
		info.senha = y.value;
		}

		function envio(){
			//AQUI TEM QUE SER GET
		    var objetivo = JSON.stringify(info);
		    fetch("http://localhost:8000", {
			    method: "POST",
			    body: objetivo
			})
			.then(function() {
				console.log("ok");
			})
		    .catch(function(error){
			    console.log("Ao menos aqui eu vejo o erro: " + error.message);
		    });
		}