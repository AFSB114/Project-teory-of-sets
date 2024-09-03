function login(){
    let usuario = document.getElementById('usuarios').value.trim();
    let contra = document.getElementById('contrasena').value.trim();

    if (usuario.length == 0 || /^\s+$/.test(usuario)) {
        alert("Ingrese su nombre de usuario");

        return false;

    } else {
        null
    }

    if (contra.length == 0 || /^\s+$/.test(contra)) {
        alert("Ingrese su contraseña");

        return false;
    } else {
        null
    }

    alert("Inciando Sesión");
    return true;
}


function contrase() { 
    let email = document.getElementById('email').value.trim();

    if (email.length == 0 || /^\s+$/.test(email)) {
        alert("Ingrese su correo electronico");

        return false;
    } else {
        
        alert("Se ha enviado un enlace a su correo electrónico para restablecer su contraseña");
        window.location.href = '../log/logIn.html';
        return false;
    }
    return true;
}