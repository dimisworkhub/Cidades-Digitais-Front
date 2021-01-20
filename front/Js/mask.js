// máscara utilizada para varios campos
function mascara(){
  $(document).ready(function(){
    $('.telefone').inputmask({ mask: ["(99) 9999-9999", "(99) 99999-9999", ], autoUnmask: true, keepStatic: true});
    $('.percentual').inputmask('9{1,3},99%', {autoUnmask: true, unmaskAsNumber: true, reverse: true, greedy: false, numericInput:true, placeholder: "0"});
    $('.data').mask('00/00/0000');
    $('.data2').mask('00/00');
    $('.data3').mask('00/00/0000 00:00:00');
    $('.contrato').mask('999-9999');
    $('.ano').inputmask('9999');
    $('.cep').inputmask('99999-999', {autoUnmask: true, unmaskAsNumber: true, numericInput:true});
    $('.cnpj').inputmask('99.999.999/9999-99', {autoUnmask: true, unmaskAsNumber: true, numericInput:true});
    $('.quebrados').inputmask('9{1,9},99',{autoUnmask: true, unmaskAsNumber: true, reverse: true, greedy: false, numericInput:true, placeholder: "0"});
    $('.inteiros').inputmask('[9999999999]9', {reverse: true, numericInput:true, placeholder:""});
    $('.preco').inputmask( 'R$ 9{1,9},99',{autoUnmask: true, unmaskAsNumber: true, reverse: true, greedy: false, numericInput:true, placeholder: "0"});
  });
}

// arrumar o problema de pegar o campo vazio
// é assim que eu vou arrumar os pontos tbm
function zeros(valor){
  //retirar os zeros extras do valor
  let valorCortado,valorSemZero;
  valorCortado = valor.split("");

  //retira os zeros da frente 1 por 1
  for(let i = 0; valorCortado == 0; i++){
    valorSemZero = valorCortado;
  }
  valor = valorSemZero;

  return valor;
}

//funções usadas para alterar mascaras

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

function arrumaData2(data){
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
    let dataFinal = dataEspecial[0] + dataSeparada[1] + dataSeparada[0] + " " + dataEspecial[1];
  
    return dataFinal;
  }
}

function mascaraData(data){
  let dataFinal;
  if(data === null || data === undefined || data === ''){
    dataFinal = null;

    return dataFinal;
  }else{

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