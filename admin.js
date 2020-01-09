function deletar(item) {
	return fetch("http://localhost:8080/test", {
	  method: 'delete',
	  headers: {'content-type': 'application/json'},
	  body: JSON.stringify(/*put something here*/)
	})
	.then(res => res.json())
	.then(res => console.log(res))
}