window.addEventListener("load", () => {
    if(!localStorage.getItem("popupVisto")){
      setTimeout(() => {
        document.getElementById("promoPopup").style.display = "flex";
      }, 700);
    }
  });

  function cerrarPopup(){
    document.getElementById("promoPopup").style.display = "none";
    localStorage.setItem("popupVisto", "true");
  }

  function irAlMenu(){
    cerrarPopup();
    window.location.href = "menu.html";
  }

// Cuando la página termine de cargar, agregamos la clase 'cargado'
window.addEventListener('load', () => {
  document.body.classList.add('cargado');
});

// Toggle mobile menu visibility
        const hamburger = document.querySelector('.hamburger');
        const mobileMenu = document.querySelector('.mobile-menu');

        hamburger.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });