//projeto com objetivo de modularizar essas tabelas com paginação (vai facilitar varias coisas)
//vou desenvolver isso antes de resolver os problemas de paginação

//usando parte de previsao

//sistema de paginação
let contador = 0;
let porPagina = 5;
let totalPaginas;

function antes() {
  contador--;
  paginacao();
}

function depois() {
  contador++;
  paginacao();
}

//garantindo o limite de paginação
function pagina(valor) {
  contador = valor;
  paginacao();
}

//parte do projeto para escolher a pagina
// function selecionarPagina(){
//   contador = document.getElementById("selectPagina").value;
//   paginacao();
// }



//função que organiza o sistema com paginas
function paginasOrganizadas(json,comeco,fim){

  //checar o json
  //console.log(json);

  //mostra quanto do total aparece na tela
  document.getElementById("mostrando").innerHTML = "Mostrando " + (comeco + 1) + " a " + fim + " de " + json.length;
  if (porPagina > json.length - comeco) {
    document.getElementById("mostrando").innerHTML = "Mostrando " + (comeco + 1) + " a " + json.length + " de " + json.length;
  }



  //organizador de paginação
  totalPaginas = Math.floor((json.length-1) / porPagina);

  //primeira pagina
  let paginas = `<li id="anterior" class="page-item" ><a href="#" class="page-link" onclick="antes()">Anterior</a></li>`;

  //escolha de pagina
  //projeto inacabado
  //paginas += `<input id="selectPagina" placeholder="Pagina"></input><button type="button" class="btn btn-primary" onclick="selecionarPagina()"><i class="fa fa-search"></i></button>`;

  //apenas aciona se precisar de paginação
  if (json.length > porPagina) {
    //caso seja apenas 10 paginas
    if (totalPaginas < 10) {
      for (i = 0; i <= totalPaginas; i++) {
        if (contador == i) {
          paginas += `<li class="page-item" id="page` + i + `"><a href="#" onclick="pagina(` + i + `)" class="page-link btn active">` + (i + 1) + `</a></li>`;
        } else {
          paginas += `<li class="page-item" id="page` + i + `"><a href="#" onclick="pagina(` + i + `)" class="page-link">` + (i + 1) + `</a></li>`;
        }
      }
      //caso sejam mais de 10
    } else {
      //mostrar apenas inicio e fim
      if (contador == 0) {
        paginas += `<li class="page-item" id="page0"><a href="#" onclick="pagina(0)" class="page-link btn active">1</a></li>`;
        paginas += `<li class="page-item" id="page1"><a href="#" onclick="pagina(1)" class="page-link">2</a></li>`;
        paginas += `<li class="page-item" id="page2"><a href="#" onclick="pagina(2)" class="page-link">3</a></li>`;
        paginas += `<li><a>...</a></li>`;
        paginas += `<li class="page-item" id="page` + (totalPaginas) + `"><a href="#" onclick="pagina(` + (totalPaginas) + `)" class="page-link">` + (totalPaginas + 1) + `</a></li>`;
      }
      //opções do começo
      else if (contador == 1) {
        paginas += `<li class="page-item" id="page0"><a href="#" onclick="pagina(0)" class="page-link">1</a></li>`;
        paginas += `<li class="page-item" id="page1"><a href="#" onclick="pagina(1)" class="page-link btn active">2</a></li>`;
        paginas += `<li class="page-item" id="page2"><a href="#" onclick="pagina(2)" class="page-link">3</a></li>`;
        paginas += `<li class="page-item" id="page3"><a href="#" onclick="pagina(3)" class="page-link">4</a></li>`;
        paginas += `<li><a>...</a></li>`;
        paginas += `<li class="page-item" id="page` + (totalPaginas) + `"><a href="#" onclick="pagina(` + (totalPaginas) + `)" class="page-link">` + (totalPaginas + 1) + `</a></li>`;
      } else if (contador == 2) {
        paginas += `<li class="page-item" id="page0"><a href="#" onclick="pagina(0)" class="page-link">1</a></li>`;
        paginas += `<li class="page-item" id="page1"><a href="#" onclick="pagina(1)" class="page-link">2</a></li>`;
        paginas += `<li class="page-item" id="page2"><a href="#" onclick="pagina(2)" class="page-link btn active">3</a></li>`;
        paginas += `<li class="page-item" id="page3"><a href="#" onclick="pagina(3)" class="page-link">4</a></li>`;
        paginas += `<li class="page-item" id="page4"><a href="#" onclick="pagina(4)" class="page-link">5</a></li>`;
        paginas += `<li><a>...</a></li>`;
        paginas += `<li class="page-item" id="page` + (totalPaginas) + `"><a href="#" onclick="pagina(` + (totalPaginas) + `)" class="page-link">` + (totalPaginas + 1) + `</a></li>`;
      } else if (contador == 3) {
        paginas += `<li class="page-item" id="page0"><a href="#" onclick="pagina(0)" class="page-link">1</a></li>`;
        paginas += `<li class="page-item" id="page1"><a href="#" onclick="pagina(1)" class="page-link">2</a></li>`;
        paginas += `<li class="page-item" id="page2"><a href="#" onclick="pagina(2)" class="page-link">3</a></li>`;
        paginas += `<li class="page-item" id="page3"><a href="#" onclick="pagina(3)" class="page-link btn active">4</a></li>`;
        paginas += `<li class="page-item" id="page4"><a href="#" onclick="pagina(4)" class="page-link">5</a></li>`;
        paginas += `<li class="page-item" id="page5"><a href="#" onclick="pagina(5)" class="page-link">6</a></li>`;
        paginas += `<li><a>...</a></li>`;
        paginas += `<li class="page-item" id="page` + (totalPaginas) + `"><a href="#" onclick="pagina(` + (totalPaginas) + `)" class="page-link">` + (totalPaginas + 1) + `</a></li>`;
      }
      //opções no final
      else if (contador == (totalPaginas - 3)) {
        paginas += `<li class="page-item" id="page0"><a href="#" onclick="pagina(0)" class="page-link">1</a></li>`;
        paginas += `<li><a>...</a></li>`;
        paginas += `<li class="page-item" id="page` + (totalPaginas - 5) + `"><a href="#" onclick="pagina(` + (totalPaginas - 5) + `)" class="page-link">` + (totalPaginas - 4) + `</a></li>`;
        paginas += `<li class="page-item" id="page` + (totalPaginas - 4) + `"><a href="#" onclick="pagina(` + (totalPaginas - 4) + `)" class="page-link">` + (totalPaginas - 3) + `</a></li>`;
        paginas += `<li class="page-item" id="page` + (totalPaginas - 3) + `"><a href="#" onclick="pagina(` + (totalPaginas - 3) + `)" class="page-link btn active">` + (totalPaginas - 2) + `</a></li>`;
        paginas += `<li class="page-item" id="page` + (totalPaginas - 2) + `"><a href="#" onclick="pagina(` + (totalPaginas - 2) + `)" class="page-link">` + (totalPaginas - 1) + `</a></li>`;
        paginas += `<li class="page-item" id="page` + (totalPaginas - 1) + `"><a href="#" onclick="pagina(` + (totalPaginas - 1) + `)" class="page-link">` + (totalPaginas) + `</a></li>`;
        paginas += `<li class="page-item" id="page` + (totalPaginas) + `"><a href="#" onclick="pagina(` + (totalPaginas) + `)" class="page-link">` + (totalPaginas + 1) + `</a></li>`;
      } else if (contador == (totalPaginas - 2)) {
        paginas += `<li class="page-item" id="page0"><a href="#" onclick="pagina(0)" class="page-link">1</a></li>`;
        paginas += `<li><a>...</a></li>`;
        paginas += `<li class="page-item" id="page` + (totalPaginas - 4) + `"><a href="#" onclick="pagina(` + (totalPaginas - 4) + `)" class="page-link">` + (totalPaginas - 3) + `</a></li>`;
        paginas += `<li class="page-item" id="page` + (totalPaginas - 3) + `"><a href="#" onclick="pagina(` + (totalPaginas - 3) + `)" class="page-link">` + (totalPaginas - 2) + `</a></li>`;
        paginas += `<li class="page-item" id="page` + (totalPaginas - 2) + `"><a href="#" onclick="pagina(` + (totalPaginas - 2) + `)" class="page-link btn active">` + (totalPaginas - 1) + `</a></li>`;
        paginas += `<li class="page-item" id="page` + (totalPaginas - 1) + `"><a href="#" onclick="pagina(` + (totalPaginas - 1) + `)" class="page-link">` + (totalPaginas) + `</a></li>`;
        paginas += `<li class="page-item" id="page` + (totalPaginas) + `"><a href="#" onclick="pagina(` + (totalPaginas) + `)" class="page-link">` + (totalPaginas + 1) + `</a></li>`;
      } else if (contador == (totalPaginas - 1)) {
        paginas += `<li class="page-item" id="page0"><a href="#" onclick="pagina(0)" class="page-link">1</a></li>`;
        paginas += `<li><a>...</a></li>`;
        paginas += `<li class="page-item" id="page` + (totalPaginas - 3) + `"><a href="#" onclick="pagina(` + (totalPaginas - 3) + `)" class="page-link">` + (totalPaginas - 2) + `</a></li>`;
        paginas += `<li class="page-item" id="page` + (totalPaginas - 2) + `"><a href="#" onclick="pagina(` + (totalPaginas - 2) + `)" class="page-link">` + (totalPaginas - 1) + `</a></li>`;
        paginas += `<li class="page-item" id="page` + (totalPaginas - 1) + `"><a href="#" onclick="pagina(` + (totalPaginas - 1) + `)" class="page-link btn active">` + (totalPaginas) + `</a></li>`;
        paginas += `<li class="page-item" id="page` + (totalPaginas) + `"><a href="#" onclick="pagina(` + (totalPaginas) + `)" class="page-link">` + (totalPaginas + 1) + `</a></li>`;
      } else if (contador == (totalPaginas)) {
        paginas += `<li class="page-item" id="page0"><a href="#" onclick="pagina(0)" class="page-link">1</a></li>`;
        paginas += `<li><a>...</a></li>`;
        paginas += `<li class="page-item" id="page` + (totalPaginas - 2) + `"><a href="#" onclick="pagina(` + (totalPaginas - 2) + `)" class="page-link">` + (totalPaginas - 1) + `</a></li>`;
        paginas += `<li class="page-item" id="page` + (totalPaginas - 1) + `"><a href="#" onclick="pagina(` + (totalPaginas - 1) + `)" class="page-link">` + (totalPaginas) + `</a></li>`;
        paginas += `<li class="page-item" id="page` + (totalPaginas) + `"><a href="#" onclick="pagina(` + (totalPaginas) + `)" class="page-link btn active">` + (totalPaginas + 1) + `</a></li>`;
      } else {
        paginas += `<li class="page-item" id="page0"><a href="#" onclick="pagina(0)" class="page-link">1</a></li>`;
        paginas += `<li><a>...</a></li>`;
        paginas += `<li class="page-item" id="page` + (contador - 2) + `"><a href="#" onclick="pagina(` + (contador - 2) + `)" class="page-link">` + (contador - 1) + `</a></li>`;
        paginas += `<li class="page-item" id="page` + (contador - 1) + `"><a href="#" onclick="pagina(` + (contador - 1) + `)" class="page-link">` + contador + `</a></li>`;
        paginas += `<li class="page-item" id="page` + contador + `"><a href="#" onclick="pagina(` + contador + `)" class="page-link btn active">` + (contador + 1) + `</a></li>`;
        paginas += `<li class="page-item" id="page` + (contador + 1) + `"><a href="#" onclick="pagina(` + (contador + 1) + `)" class="page-link">` + (contador + 2) + `</a></li>`;
        paginas += `<li class="page-item" id="page` + (contador + 2) + `"><a href="#" onclick="pagina(` + (contador + 2) + `)" class="page-link">` + (contador + 3) + `</a></li>`;
        paginas += `<li><a>...</a></li>`;
        paginas += `<li class="page-item" id="page` + (totalPaginas) + `"><a href="#" onclick="pagina(` + (totalPaginas) + `)" class="page-link">` + (totalPaginas + 1) + `</a></li>`;
      }
    }
  }

  //proxima pagina
  paginas += `<li id="proximo" class="page-item" ><a href="#" class="page-link" onclick="depois()">Próximo</a></li>`;

  document.getElementById("paginacao").innerHTML = paginas;



  //limite das paginas
  if (contador > 0) {
    document.getElementById("anterior").style.visibility = "visible";
  } else {
    document.getElementById("anterior").style.visibility = "hidden";
  }
  if (fim < json.length) {
    document.getElementById("proximo").style.visibility = "visible";
  } else {
    document.getElementById("proximo").style.visibility = "hidden";
  }
}





//sistema de filtragem:

function filtro(json,linhaFiltrada){

  //variaveis:

  let filtragemFinal = [];
  let filtro = document.getElementById("filtro").value;
  let j=0, filtragem;
  let estrutura = new RegExp(filtro,"i");

  //sistema:

  for(i=0;i<json.length;i++){

    //caso não haja filtro
    if(filtro == ""){
      filtragemFinal[j] = json[i];
      j++;
    }

    //caso haja filtro
    else{
      //reiniciando variavel filtragem
      filtragem = "";

      //parte criada para poder colocar todos os campos de uma linha dentro da variavel que será pesquisada
      for(k=0;k<linhaFiltrada.length;k++){
        filtragem += JSON.stringify(json[i][linhaFiltrada[k]]);
      }
      //parte criada para arrumar o valor do tipo quando ele existe
      if(json[i]["tipo"]=="o"){
        filtragem += "Original";
      }
      else if(json[i]["tipo"]=="r"){
        filtragem += "Reajuste";
      }

      //a filtragem em si
      if(filtragem.search(estrutura) >= 0){
        filtragemFinal[j] = json[i];
        j++;
      }
    }

  }
  return filtragemFinal;
}