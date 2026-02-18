console.log("login.js conectado ✅");

const form = document.querySelector("form");

form.addEventListener("submit", async (e) => {

  e.preventDefault();

  const email = document.querySelector('input[type="email"]').value;
  const password = document.querySelector('input[type="password"]').value;

  if (!email || !password) {
    alert("Completa todos los campos");
    return;
  }

  try {

    const res = await fetch("http://localhost:3000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email,
        password
      })
    });

    const data = await res.json();

    console.log("Respuesta backend:", data);

    if (!res.ok) {
      alert(data.msg || "Error al iniciar sesión");
      return;
    }

    // Guardar token
    localStorage.setItem("token", data.token);

    alert("Login exitoso ✅");

    // Redirigir según rol
    if (data.user.role === "admin") {
      window.location.href = "admin.html";
    } else {
      window.location.href = "perfil.html";
    }

  } catch (err) {

    console.error("Error:", err);
    alert("No se pudo conectar al servidor");

  }

});

