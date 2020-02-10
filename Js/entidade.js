let cnpjQuery=[];
window.onload=function(){

    //pega o token do login
    let meuToken = sessionStorage.getItem("Token");
    //função fetch para mandar
    fetch('http://localhost:8080/read/entidade', {
      method: 'GET',
      headers: {'Authorization': 'Bearer ' + meuToken},
    }).then(function(response){
      //tratamento dos erros
      if(response.status == 200){
        console.log("ok");
      }
      else if(response.status ==201){
        console.log("Entidade criada com sucesso");
      }
      else if(response.status ==204){
        console.log("Apagado com sucesso.");
      }
      else if(response.status ==400){
        window.location.replace("./errors/400.html");
      }
      else if(response.status ==401){
        window.location.replace("./errors/401.html");
      }
      else if(response.status ==403){
        window.location.replace("./errors/403.html");
      }
      else if(response.status ==404){
        window.location.replace("./errors/404.html");
      }
      else if(response.status ==409){
        console.log("Erro: Usuário já existente.");
      }
      else if(response.status == 412){
        console.log("Erro: Informação colocada é incorreta.");
      }
      else if(response.status == 422){
        console.log("Erro: Usuário ou senha inválidos.");
      }
      else if(response.status == 500){
        window.location.replace("./errors/500.html");
      }
      else if(response.status == 504){
        window.location.replace("./errors/504.html");
      }
      //caso seja um dos erros não listados
      else{
        console.log("ERRO DESCONHECIDO");
      }
      //pegar o json que possui a tabela
      return response.json().then(function(json){
        console.log(json);

        let tabela = (`<thead style="background: #4b5366; color:white; font-size:15px">
          <tr>
          <th> <span class="custom-checkbox">
          <input type="checkbox" id="selectAll">
          <label for="selectAll"></label>
          </span></th>
          <th scope="col">CNPJ</th>
          <th scope="col">Nome</th>
          <th scope="col">Endereço</th>
          <th scope="col">Número</th>
          <th scope="col">Bairro</th>
          <th scope="col">CEP</th>
          <th scope="col">UF</th>
          <th scope="col">Município</th>
          <th scope="col">Observações</th>
          <th scope="col">Opções</th>
          </tr>
          </thead>`);
        tabela += (`<tbody> <tr>`);



            for(let i=0;i<json.length;i++){
              cnpjQuery[i]=json[i]["cnpj"]; 
            tabela += (`<td>
                        <span class="custom-checkbox">
                        <input type="checkbox" id="checkbox1" name="options[]" value="1">
                        <label for="checkbox1"></label>
                        </span>
                        </td>`);
            tabela += (`<td>`);
            tabela += json[i]["cnpj"]; 
            tabela += (`</td> <td>`);
            tabela += json[i]["nome"] 
            tabela += (`</td> <td>`);
            tabela += json[i]["endereco"] 
            tabela += (`</td> <td>`);
            tabela += json[i]["numero"] 
            tabela += (`</td> <td>`);
            tabela += json[i]["bairro"] 
            tabela += (`</td> <td>`);
            tabela += json[i]["cep"] 
            tabela += (`</td> <td>`);
            tabela += json[i]["uf"] 
            tabela += (`</td> <td>`);
            tabela += json[i]["nome_municipio"] 
            tabela += (`</td> <td>`);
            tabela += json[i]["observacao"] 
            tabela += (`</td> <td> 
                      <span class="d-flex">
                      <button onclick="editarEntidade(`+ i +`)" class="btn btn-success">
                      <i class="material-icons"data-toggle="tooltip" title="Edit">&#xE254;</i>
                      </button>
                      <button onclick="apagarEntidade()" class="btn btn-danger">
                      <i class="material-icons"data-toggle="tooltip" title="Delete">&#xE872;</i>
                      </button> 
                      </span> </td>`);
            tabela += (`</tr> <tr>`);          
            }


        tabela += (`</tr> </tbody>`);
        document.getElementById("tabela").innerHTML= tabela;
            
            $(document).ready(function () {
            // Select/Deselect checkboxes
            var checkbox = $('table tbody input[type="checkbox"]');
            $("#selectAll").click(function () {
              if (this.checked) {
                checkbox.each(function () {
                   this.checked = true;
                 });
              }else {
                checkbox.each(function () {
                  this.checked = false;
                 });
               }
             });
            checkbox.click(function () {
              if (!this.checked) {
                 $("#selectAll").prop("checked", false);
              }
            });
          });


        });
      });
}

function editarEntidade(valor){
sessionStorage.setItem("CNPJ", cnpjQuery[valor]);
window.location.href = "./gerenciaEntidade.html";
}