/* USUARIO TEMPORAL (LUEGO VA A BD) */

const ADMIN = {
  user: "admin",
  pass: "1234",
  rol: "Administrador"
};


/* LOGIN */

function login(){

  let u = document.getElementById("user").value;
  let p = document.getElementById("pass").value;

  if(u === ADMIN.user && p === ADMIN.pass){

    localStorage.setItem("sesion",JSON.stringify({
      user:u,
      rol:ADMIN.rol,
      login:true
    }));

    window.location = "admin.html";

  }else{

    document.getElementById("error")
    .innerText = "Usuario o contraseña incorrectos";

  }

}


/* VERIFICAR SESION */

function verificarSesion(){

  let sesion = JSON.parse(localStorage.getItem("sesion"));

  if(!sesion || !sesion.login){
    window.location = "login.html";
  }

  return sesion;
}


/* CERRAR SESION */

function cerrarSesion(){

  localStorage.removeItem("sesion");
  window.location = "login.html";

}
