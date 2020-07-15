// máscara utilizada para varios campos
function mascara(){
  $(document).ready(function(){
    $('.percentual').inputmask('999.99%', {reverse: true, numericInput:true, placeholder:"0"});
    $('.data').mask('00/00/0000');
    $('.data2').mask('00/00');
    $(".preco").inputmask('decimal', {
      'alias': 'numeric',
      'groupSeparator': ',',
      'autoGroup': true,
      'digits': 2,
      'radixPoint': ".",
      'digitsOptional': false,
      'allowMinus': false,
      'prefix': 'R$ ',
      'placeholder': ''
    });
    // usando id: $("#percentual").inputmask("999.99%",{reverse: true,numericInput:true, placeholder:"0"});
  });
}
