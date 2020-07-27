// máscara utilizada para varios campos
function mascara(){
  $(document).ready(function(){
    $('.percentual').inputmask('[99]9,99%', {reverse: true, numericInput:true});
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

//mascaras usadas

//especifica para dinheiro.
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

//função comum para os valores em itens:
function mascaraPreco(preco) {

  //para organizar a mascara
  let preco2,preco2L,preco3,preco4;
  let preco2A = "";

  //console.log(preco.toString().length)

  //Verifica se o númera possui uma casa de milhar
  if((preco.toString()).length > 6){
    preco2 = preco.split(".");
    //para garantir que todas as partes dos valores sejam pegas
    preco2L = preco2.length;
    preco3 = preco2[(preco2L-1)].split(",");

    for(let i = 0; i < (preco2L-1); i++){
      preco2A += preco2[i];
    }

    preco4 = (preco2A + preco3[0] + preco3[1])/100;
    
    
  }else{
    preco2 = preco.split(",");
    
    preco4 = (preco2[0] + preco2[1])/100;
  }

  return preco4;

}

//especifica para dinheiro.
function mascaraQuebrados(valor){
  let qOriginal, qMudado;

  qOriginal = valor;
  qMudado = qOriginal.split(",")

  return (qMudado[0]+qMudado[1])/100;
}