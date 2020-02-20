function editarUsuario(valor) {
  localStorage.setItem("cod_usuario", cod_usuarioQuery[valor]);
  window.location.href = "./gerenciaUsuario.html";
}
