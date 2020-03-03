document.write(`
		<section>
			<div class="container-fluid">
				<header class="cd-header"><!--Barra Menu-->
			<div id="cd-logo">
				<a href=""><img src="img/cd-logo.svg" alt="Logo"></a>
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
				<input value="Sair" onclick="logoff()" type="button">
				</ul>
				<a href="#0" class="cd-close-menu">Close<span></span></a>
			</nav>
		</section>

	<div class="cd-shadow-layer"></div>`);

function logoff() {
	localStorage.clear();
	window.location.replace("./index.html");
}

//define as horas do login
let hours = 13;
//script para que 
let now = new Date().getTime();
let setupTime = localStorage.getItem('setupTime');
if (setupTime == null) {
	localStorage.setItem('setupTime', now)
} else {
	if (now - setupTime > hours * 60 * 60 * 1000) {
		localStorage.clear();
		window.location.replace("./index.html");
	}
}