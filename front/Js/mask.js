// máscara utilizada para varios campos
function mascara(){
  $(document).ready(function(){
    $('.percentual').inputmask('[99]9.99%', {reverse: true, numericInput:true});
    $('.data').mask('00/00/0000');
    $('.data2').mask('00/00');
    $('.quebrados').inputmask('[999]9,99', {reverse: true, numericInput:true, placeholder: "0"});
    $('.inteiros').inputmask('[9999999999]9', {reverse: true, numericInput:true});
    $('.preco').inputmask('[9.999.999.99]9,99', {reverse: true, numericInput:true, prefix: "R$ ", placeholder: "0"});
    // $(".preco").inputmask('decimal', {
    //   'alias': 'numeric',
    //   'groupSeparator': ',',
    //   'autoGroup': true,
    //   'digits': 2,
    //   'radixPoint': ".",
    //   'digitsOptional': false,
    //   'allowMinus': false,
    //   'prefix': 'R$ ',
    //   'numericInput': true,
    // });
    // usando id: $("#percentual").inputmask("999.99%",{reverse: true,numericInput:true, placeholder:"0"});
  });
}

function arrumaData(data){
  
  // console.log(data)

  if(data === null || data === undefined || data === ''){

    let dataFinal = null;
    return dataFinal 
    
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