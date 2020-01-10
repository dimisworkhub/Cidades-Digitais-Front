function CheckError(response) {
	if (response.status >= 200 && response.status < 300) {
	  return console.log(response);
	} else {
	  throw ("Erro encontrado: " + response.status);
  }
}

function deletar(item) {
	return fetch("localhost:8080/read/usuario/deleteuser", {
	  method: 'delete',
	  mode: 'no-cors',
	  headers: {'content-type' : 'application/json'},
	  body: JSON.stringify(/*put something here*/)
	})
	.then(CheckError)
	.then(response => console.log("ok"))
}