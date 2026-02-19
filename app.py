from flask import Flask, render_template, request, redirect, url_for, session
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
app.secret_key = "clave_super_secreta_cambiala"

# 🔐 Admin
ADMIN_USER = "admin"
ADMIN_PASSWORD_HASH = generate_password_hash("123456")  # cambia esta contraseña


# ======================
# PÁGINA INICIAL (SELECT)
# ======================
@app.route("/")
def select():
    return render_template("select.html")


# ======================
# CLIENTE (PÁGINAS PÚBLICAS)
# ======================
@app.route("/index")
def index():
    return render_template("index.html")


@app.route("/menu")
def menu():
    return render_template("menu.html")


@app.route("/ubicacion")
def ubicacion():
    return render_template("ubicacion.html")


# ======================
# LOGIN ADMIN
# ======================
@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        user = request.form["username"]
        password = request.form["password"]

        if user == ADMIN_USER and check_password_hash(ADMIN_PASSWORD_HASH, password):
            session["admin"] = True
            return redirect(url_for("admin_panel"))

        return render_template("login.html", error="Credenciales incorrectas")

    return render_template("login.html")


# ======================
# PANEL ADMIN (PROTEGIDO)
# ======================
@app.route("/admin")
def admin_panel():
    if not session.get("admin"):
        return redirect(url_for("login"))
    return render_template("admin.html")


# ======================
# LOGOUT
# ======================
@app.route("/logout")
def logout():
    session.clear()
    return redirect(url_for("select"))


# ======================
# RUN
# ======================
if __name__ == "__main__":
    app.run()
