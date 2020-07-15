//ATENÇÃO
//este js é utilizado para contenção de estruturas que possam ser utilizadas em qualquer tabel1a

document.write(`
	<section>
		<div class="container-fluid">
			<header class="cd-header"><!--Barra Menu-->
				<div id="cd-logo">
					<a onclick="logoff()"><img src="img/cd-logo.svg" alt="Logo"></a>
				</div>
				<a class="cd-menu-trigger" href="#main-nav">Menu<span></span></a>
			</header>
		</div>
		<div class="cd-blurred-bg"></div>
		<nav id="main-nav">
			<ul>
			<li><a href="./home.html"><span>Home</span></a></li>	
			<li><a href="./entidade.html"><span>Entidade</span></a></li>
			<li><a href="./cd.html"><span>Cidades Digitais</span></a></li>
			<li><a href="./lote.html"><span>Lote</span></a></li>
			<li><a href="./usuario.html"><span>Usuario</span></a></li>
			<li><a href="./administracao.html"><span>Administração</span></a></li>
			<li><a href="./fiscalizacao.html"><span>Fiscalização</span></a></li>
			</ul>
			<a href="#0" class="cd-close-menu">Close<span></span></a>
		</nav>
	</section>
<div class="cd-shadow-layer"></div>`);

//função usada pelo botão de logoff
function logoff() {
	window.location.replace("./index.html");
	localStorage.clear();
}

//define o total de horas para o login atual
let hours = 13;
//script que mantêm o login apenas até o tempo limite
let now = new Date().getTime();
let setupTime = localStorage.getItem('setupTime');
if (setupTime == null) {
	localStorage.setItem('setupTime', now);
} else {
	if (now - setupTime > hours * 60 * 60 * 1000) {
		window.location.replace("./index.html");
		localStorage.clear();
	}
}



//global

//para definir o ip do servidor (ou algo do tipo, podem corrigir)
let servidor = "http://localhost:8080/";

//pega o token do login
let meuToken = localStorage.getItem("token");

//tratamento de erros
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
		alert("Erro: Informação colocada é incorreta.");
	} else if (value == 422) {
		alert("Erro: Formato de informação não aceito.");
	} else if (value == 500) {
		window.location.href = "./errors/500.html";
	} else if (value == 504) {
		window.location.href = "./errors/504.html";
	} else {
		alert("ERRO DESCONHECIDO");
	}
}