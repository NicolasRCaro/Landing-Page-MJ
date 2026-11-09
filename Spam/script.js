// 1. Inicialización de EmailJS con tu Public Key
(function () {
  emailjs.init({
    publicKey: "FZ5MnISA1ILjLRyc_",
  });
})();

// 2. Conmutador de Eras (Off The Wall / Thriller / Bad)
const eraButtons = document.querySelectorAll('.era-btn');
const bgVideo = document.getElementById('bg-video');

eraButtons.forEach((btn) => {
  btn.addEventListener('click', function () {
    const selectedEra = this.getAttribute('data-era');
    const videoSrc = this.getAttribute('data-video');

    // Cambiar clase activa en los botones
    eraButtons.forEach((b) => b.classList.remove('active'));
    this.classList.add('active');

    // Cambiar la clase de la Era en el <body>
    document.body.className = '';
    document.body.classList.add(`era-${selectedEra}`);

    // Cambiar la fuente del video con transición suave
    bgVideo.style.opacity = '0';
    setTimeout(() => {
      bgVideo.src = videoSrc;
      bgVideo.load();
      bgVideo.play();
      bgVideo.style.opacity = '0.35';
    }, 250);
  });
});

// 3. Extracción de nombre desde el correo
function extractNameFromEmail(email) {
  const username = email.split('@')[0];
  const rawFirstName = username.split(/[._-]/)[0];
  const cleanName = rawFirstName.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ]/g, '');

  if (!cleanName) return 'Leyenda';
  return cleanName.charAt(0).toUpperCase() + cleanName.slice(1).toLowerCase();
}

// 4. Procesamiento de formulario y pantalla de éxito
const form = document.getElementById('email-form');
const btnSend = document.getElementById('btn-send');
const successGif = document.getElementById('success-gif');

function showSuccessScreen() {
  successGif.src = successGif.dataset.src;
  document.body.classList.add('is-sent');
}

form.addEventListener('submit', function (event) {
  event.preventDefault();

  const emailInput = document.getElementById('user_email').value;
  const extractedName = extractNameFromEmail(emailInput);

  btnSend.innerText = 'Enviando...';
  btnSend.disabled = true;

  const serviceID = 'service_4lmru1r';
  const templateID = 'template_rc2blfp';

  const templateParams = {
    user_email: emailInput,
    user_name: extractedName,
  };

  emailjs.send(serviceID, templateID, templateParams)
    .then(() => {
      btnSend.innerText = 'Enviar';
      btnSend.disabled = false;
      form.reset();
      showSuccessScreen();
    })
    .catch((error) => {
      btnSend.innerText = 'Enviar';
      btnSend.disabled = false;
      alert('Error al enviar el correo: ' + JSON.stringify(error));
    });
});