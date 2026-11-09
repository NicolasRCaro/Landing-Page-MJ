// Inicialización de EmailJS con tu Public Key
(function () {
  emailjs.init({
    publicKey: "FZ5MnISA1ILjLRyc_",
  });
})();

// Referencias a elementos del DOM
const form = document.getElementById('email-form');
const btn = document.getElementById('btn-send');
const successGif = document.getElementById('success-gif');

// Muestra la pantalla de éxito e inicia el desplazamiento del GIF
function showSuccessScreen() {
  successGif.src = successGif.dataset.src;
  document.body.classList.add('is-sent');
}

// Evento al enviar el formulario
form.addEventListener('submit', function (event) {
  event.preventDefault();

  btn.innerText = 'Enviando...';
  btn.disabled = true;

  const serviceID = 'service_4lmru1r';
  const templateID = 'template_rc2blfp';

  emailjs.sendForm(serviceID, templateID, this)
    .then(() => {
      btn.innerText = 'Enviar';
      btn.disabled = false;
      form.reset();
      showSuccessScreen();
    })
    .catch((error) => {
      btn.innerText = 'Enviar';
      btn.disabled = false;
      alert('Error al enviar el correo: ' + JSON.stringify(error));
    });
});