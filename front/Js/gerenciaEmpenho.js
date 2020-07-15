//pega o CNPJ escolhido anteriormente
let meuCodigo = localStorage.getItem("id_empenho");
let meuCodigoSec = localStorage.getItem("cod_previsao_empenho");

//colocar natureza de despesa como campo para chamar as opções de previsão no FiscEmpenho de adição

window.onload = function () {
  //preenche os campos
  document.getElementById("cod_empenho").value = localStorage.getItem("cod_empenho");

  //adiciona a descrição e o tipo à previsão e coloca no local
  let tipo=localStorage.getItem("tipo");
  if(tipo=="o"){
    tipo="Original";
  }
  else{
    tipo="Reajuste";
  }
  document.getElementById("cod_previsao_empenho").value = meuCodigoSec + " - " + localStorage.getItem("descricao") + " - " + tipo;

  //este campo precisa de adaptação para ser aceito, como yyyy-MM-dd
  let data1 = new Date(localStorage.getItem("data"));
  let dataFinal1 = String(data1.getFullYear()).padStart(4, '0') + "-" + String(data1.getMonth() + 1).padStart(2, '0') + "-" + String(data1.getDate()).padStart(2, '0');
  document.getElementById("data").value = dataFinal1;
}

function enviar() {
  //JSON usado para mandar as informações no fetch
  let info = {
    "cod_empenho": document.getElementById("cod_empenho").value,
    "data": document.getElementById("data").value,
  };

  //transforma as informações em string para mandar
  let corpo = JSON.stringify(info);
  //função fetch para mandar
  fetch(servidor + 'read/empenho/' + meuCodigo, {
    method: 'PUT',
    body: corpo,
    headers: {
      'Authorization': 'Bearer ' + meuToken
    },
  }).then(function (response) {

    //checar o status do pedido
    //console.log(response);

    //tratamento dos erros
    if (response.status == 200 || response.status == 201) {
      window.location.replace("./fiscEmpenho.html");
    } else {
      erros(response.status);
    }
  });
}