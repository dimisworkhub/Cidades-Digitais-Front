//talvez tenha que virar ponteiro
function editar(i){
  document.getElementById(i).innerHTML = "<tr id=" + i + ">" + "<td>" + '<input type="text" id="submitCNPJ" maxlength="18" OnKeyPress="formatar(' + '##.###.###/####-##' + ', this)" value="" onchange="changer()"></input>' + "</td>" + "<td>" + '<input type="text" class="form-control" id="submitNome" maxlength="50" value="" onchange="changer()">'  + "</td>" + "<td>" + '<input type="text" id="submitEndereco" maxlength="100" value="" onchange="changer()"></input>' + "</td>" + "<td>" + '<input type="text" id="submitNumero" maxlength="10" value="" onchange="changer()"></input>' + "</td>" + "<td>" + '<input type="text" id="submitBairro" maxlength="100" value="" onchange="changer()"></input>' + "</td>" + "<td>" + '<input type="text" id="submitCEP" maxlength="9" OnKeyPress="formatar(' + '#####-###' + ', this)" value="" onchange="changer()"></input>' + "</td>" + "<td>" + '<select type="text" id="submitUF" value="" onchange="changer()"><p id="estados"></p></select>' + "</td>" + "<td>" + '<select type="text" id="submitNomeMun" value="" onchange="changer()"><p id="municipios"></p></select>' + "</td>" + "<td>" + '<input type="text" id="submitObs"  maxlength="1000" value="" onchange="changer()"></input>' + "</td>" + "</tr>" + '<button type="button" class="btn btn-primary" onclick="mudar(' + i + ')" >' + "Editar Entidade" + "</button>";
  
  let info = {"cnpj" : " ","nome" : " ","endereco" : " ","numero" : " ","bairro" : " ","cep" : " ","nome_municipio" : " ","uf" : " ","observacao" : " "};


  //função de edição
  function mudar(){
      let objetivo = JSON.stringify(info);
      //ja com o site para testes
      fetch("localhost:8080/read/entidade", {
      method: "EDIT",
      mode: 'no-cors',
      headers: {'content-type' : 'application/json'},
      body: objetivo
      })
      .then(CheckError);
  }

  
  window.onload=function estados(){
      let i = 0;
      let x;
      //ja com o site para testes
      fetch("localhost:8080/read/municipios", {
      method: "GET",
      mode: 'no-cors',
      headers: {'content-type' : 'application/json'},
      })
      .then(CheckError)
      .then(function(response)
      {
      return response;
      let objeto = JSON.parse(this.response);
      });
      for (i in objeto) {
      x += "<option>" + response.uf[i] + "</option>";
      }
    document.getElementById("estados").innerHTML = x;
  }



  
  window.onload=function municipios(){
  let i = 0;
  let x;
  //ja com o site para testes
  fetch("localhost:8080/read/municipios", {
  method: "GET",
      mode: 'no-cors',
      headers: {'content-type' : 'application/json'},
  })
  .then(CheckError)
  .then(function(response)
  {
      return response;
      let objeto = JSON.parse(this.response);
  });
  for (i in objeto) {
  x += "<option>" + response.nome_municipio[i] + "</option>";
  }
  document.getElementById("municipios").innerHTML = x;
  }

}


//testar se funciona depois
  window.onload=function lista(){
    let i = 0;
    let x;
    //ja com o site para testes
    fetch("localhost:8080/read/entidade", {
		method: "POST",
    mode: 'no-cors',
    headers: {'content-type' : 'application/json'},
    body: this.form
	})
    .then(CheckError)
    .then(function(response)
    {
        return response;
       let objeto = JSON.parse(this.response);
    });
    for (i in objeto) {
    x += "<tr id=" + i + ">" + "<td>" + response.cnpj[i] + "</td>" + "<td>" + response.nome[i] + "</td>" + "<td>" + response.endereco[i] + "</td>" + "<td>" + response.numero[i] + "</td>" + "<td>" + response.bairro[i] + "</td>" + "<td>" + response.cep[i] + "</td>" + "<td>" + response.uf[i] + "</td>" + "<td>" + response.nome_municipio[i] + "</td>" + "<td>" + response.observacao[i] + "</td>" + "</tr>" + '<button type="button" class="btn btn-primary" onclick="editar(' + i + ')" >' + "Editar Entidade" + "</button>";
    }
    document.getElementById("lista").innerHTML = x;
}

function deletar(){
  let objetivo = JSON.stringify(info);
      //ja com o site para testes
      fetch("localhost:8080/read/entidade", {
      method: "DELETE",
      headers: {'content-type' : 'application/json'},
      body: form
      })
      .then(CheckError)
      .then(response => console.log("ok?"));
}