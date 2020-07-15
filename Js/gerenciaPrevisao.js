//pega o CNPJ escolhido anteriormente
let meuCodigo = localStorage.getItem("cod_previsao_empenho");
let meuCodigoSec = localStorage.getItem("cod_lote");

window.onload = function () {

  mascara();

  //preenche os campos
  document.getElementById("cod_previsao_empenho").value = meuCodigo;
  document.getElementById("cod_lote").value = meuCodigoSec;
  document.getElementById("ano_referencia").value = localStorage.getItem("ano_referencia");
  //é parte de um join
  document.getElementById("cod_natureza_despesa").value = localStorage.getItem("natureza_despesa");

  document.getElementById("tipo").innerHTML = "<option value='o'>Original</option><option value='r'>Reajuste</option>";
  document.getElementById("tipo").value = localStorage.getItem("tipo");

  //este campo precisa de adaptação para ser aceito, como yyyy-MM-dd

  let data = localStorage.getItem("data");
  let dataSeparada = data.split("-");
  let dataEspecial = dataSeparada[2].split("T");
  document.getElementById("data").value = dataEspecial[0]+dataSeparada[1]+dataSeparada[0];

}

function enviar() {

  let data = document.getElementById("data").value;
  let dataSeparada = data.split("");
  //formato de data original (retirando mascara)
  let dataFinal = dataSeparada[6] + dataSeparada[7] + dataSeparada[8] + dataSeparada[9] + "-" + dataSeparada[3] + dataSeparada[4] + "-" + dataSeparada[0] + dataSeparada[1];

  //  JSON usado para mandar as informações no fetch
  let info = {
    "data": dataFinal,
    "tipo": document.getElementById("tipo").value,
    "ano_referencia": parseInt(document.getElementById("ano_referencia").value),
  };

  //transforma as informações em string para mandar
  let corpo = JSON.stringify(info);
  //função fetch para mandar
  fetch(servidor + 'read/previsaoempenho/' + parseInt(meuCodigo), {
    method: 'PUT',
    body: corpo,
    headers: {
      'Authorization': 'Bearer ' + meuToken
    },
  }).then(function (response) {

    //tratamento dos erros
    if (response.status == 200 || response.status == 201) {
      window.location.replace("./fiscPrevisao.html");
    } else {
      erros(response.status);
    }
  });
}