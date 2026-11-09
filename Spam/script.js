// ==========================================
// 1. INICIALIZACIÓN DE EMAILJS
// ==========================================
(function () {
  emailjs.init({
    publicKey: "FZ5MnISA1ILjLRyc_",
  });
})();

// ==========================================
// 2. CONMUTADOR DE ERAS & PRECARGA DE VIDEO
// ==========================================
const eraButtons = document.querySelectorAll('.era-btn');
const bgVideo = document.getElementById('bg-video');
const videoLoader = document.getElementById('video-loader');

eraButtons.forEach((btn) => {
  btn.addEventListener('click', function () {
    const selectedEra = this.getAttribute('data-era');
    const videoSrc = this.getAttribute('data-video');

    // Evita recargar si la era seleccionada ya está activa
    if (document.body.classList.contains(`era-${selectedEra}`)) return;

    // Actualiza la clase activa en los botones
    eraButtons.forEach((b) => b.classList.remove('active'));
    this.classList.add('active');

    // Muestra el loader e inicia desvanecimiento
    if (videoLoader) videoLoader.classList.add('is-loading');
    bgVideo.style.opacity = '0';

    // Carga la nueva fuente del video
    bgVideo.src = videoSrc;
    bgVideo.load();

    // Evento ejecutado solo cuando el video se ha precargado en memoria
    const handleCanPlay = () => {
      bgVideo.play().catch(() => {});

      // Cambia los estilos CSS de la Era
      document.body.className = '';
      document.body.classList.add(`era-${selectedEra}`);

      // Restaura la visibilidad y retira el loader
      bgVideo.style.opacity = '0.35';
      if (videoLoader) videoLoader.classList.remove('is-loading');

      // Limpia el listener para el próximo cambio
      bgVideo.removeEventListener('canplaythrough', handleCanPlay);
    };

    bgVideo.addEventListener('canplaythrough', handleCanPlay);
  });
});

// ==========================================
// 3. EXTRACCIÓN AUTOMÁTICA DEL NOMBRE
// ==========================================
function extractNameFromEmail(email) {
  const username = email.split('@')[0];
  const rawFirstName = username.split(/[._-]/)[0];
  const cleanName = rawFirstName.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ]/g, '');

  if (!cleanName) return 'Leyenda';
  return cleanName.charAt(0).toUpperCase() + cleanName.slice(1).toLowerCase();
}

// ==========================================
// 4. ENVÍO DE FORMULARIO Y PANTALLA DE ÉXITO
// ==========================================
const form = document.getElementById('email-form');
const btnSend = document.getElementById('btn-send');
const successGif = document.getElementById('success-gif');

function showSuccessScreen() {
  if (successGif && successGif.dataset.src) {
    successGif.src = successGif.dataset.src;
  }
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