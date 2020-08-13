// máscara utilizada para varios campos
function mascara(){
  $(document).ready(function(){
    $('.percentual').inputmask('[99]9,99%', {reverse: true, numericInput:true});
    $('.data').mask('00/00/0000');
    $('.data2').mask('00/00');
    $('.contrato').mask('999-9999');
    $('.ano').inputmask('9999');
    $('.cnpj').inputmask('99.999.999/9999-99', {autoUnmask: true, removeMaskOnSubmit: true});
    $('.quebrados').inputmask('[999999]9,99',{autoUnmask: true, unmaskAsNumber: true, reverse: true, greedy: false, numericInput:true, placeholder: ""});
    $('.inteiros').inputmask('[9999999999]9', {reverse: true, numericInput:true});
    $('.preco').inputmask( '[R$ 999999999]9,99',{autoUnmask: true, unmaskAsNumber: true, reverse: true, greedy: false, numericInput:true, placeholder: ""});
  });
}

//usar a função e a inspiração para colocar os pontos no lugar da mascara

// jeito de usar funçãos dentro



//mascaras usadas

//especifica para dinheiro (e quebrados?)
function arredondamento(valor){

  //split para arredondar valores nos campos subtotal e total
  let redondo = JSON.stringify(valor);
  let splitRedondo = redondo.split(".");

  //necessario para garantir que o campo possua
  let garantia = splitRedondo[1]+"00";
  let splitRedondo2 = garantia.split("");
  let redondoFinal = splitRedondo[0]+splitRedondo2[0]+splitRedondo2[1];

  return redondoFinal;
}

//função comum para os valores em itens: não será mais necessária se eu (dimi) estiver correto
/* function mascaraPreco(preco) {

  //para organizar a mascara
  let preco1,preco2,preco2L,preco3,preco4;
  let preco2A = "";

  //Verifica se o númera possui uma casa de milhar
  if((preco.toString()).length > 6){
    preco1 = preco.split("R$ ");
    preco2 = preco1[1].split(".");

    //para garantir que todas as partes dos valores sejam pegas
    preco2L = preco2.length;

    for(let i = 0; i < preco2L; i++){
      preco2A += preco2[i];
    }

    preco3 = preco2A.split(",");

    preco4 = (preco3[0] + preco3[1])/100;
    
  }else{
    preco2 = preco.split(",");
    
    preco4 = (preco2[0] + preco2[1])/100;
  }

  return preco4;

} */

//especifica para dinheiro.
function mascaraQuebrados(valor){
  return valor/100;
}
  
function arrumaData(data){
  // console.log(data);
  if(data === null || data === undefined || data === ''){

    let dataFinal = null;
    return dataFinal;
    
  }else{
    
    //utiliza split
    let dataSeparada = data.split("-");
  
    //retirar o horario que aparece normalmente junto ao formato de data
    let dataEspecial = dataSeparada[2].split("T");
    
    //junta todas as informações para ficar no padrão brasileiro
    let dataFinal = dataEspecial[0] + dataSeparada[1] + dataSeparada[0];
  
    return dataFinal;
  }
}

function mascaraData(data){
  let dataFinal;
  if(data === null || data === undefined || data === ''){
    dataFinal = null;

    return dataFinal;
  }
  else{

    //utiliza split
    let dataSeparada = data.split("/");

    if((data.toString().length)<6){

      //junta todas as informações para ficar no padrão do banco de dados
      dataFinal = "0000-" + dataSeparada[1] + "-" + dataSeparada[0];
      return dataFinal;
      
    }else{
      
      //junta todas as informações para ficar no padrão do banco de dados
      dataFinal = dataSeparada[2] + "-" + dataSeparada[1] + "-" + dataSeparada[0];
      return dataFinal;
    }
  }
}