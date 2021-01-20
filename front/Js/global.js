//SEMPRE DEIXE GLOBAL ACIMA DO JS DA PAGINA

//para definir o caminho do servidor (ou algo do tipo)
let servidor = "http://localhost:8080/";

//pega o token do login
let meuToken = localStorage.getItem("token");

//tratamento de erros geral
function erros(value) {
	if (value == 400) {
		window.location.href = "./errors/400.html";
	} else if (value == 401) {
		window.location.replace("./errors/401.html");
	} else if (value == 403) {
		window.location.href = "./errors/403.html";
	} else if (value == 404) {
		window.location.href = "./errors/404.html";
	} else if (value == 409) {
		alert("Erro: Adição já existente.");
	} else if (value == 412) {
		alert("Erro: Informação colocada é incorreta ou improcessável.");
	} else if (value == 422) {
		alert("Erro: Valor(es) colocado(s) incorreto(s).");
	} else if (value == 500) {
		window.location.href = "./errors/500.html";
	} else if (value == 504) {
		window.location.href = "./errors/504.html";
	} else {
		alert("ERRO DESCONHECIDO: " + value);
	}
}