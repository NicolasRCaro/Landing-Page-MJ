// ==========================================
// 1. INICIALIZACIÓN DE EMAILJS
// ==========================================
(function () {
  emailjs.init({
    publicKey: "FZ5MnISA1ILjLRyc_", // Tu Public Key
  });
})();

// ==========================================
// 2. MAPEO DE PLANTILLAS (2 TEMPLATES)
// ==========================================
const eraTemplateIDs = {
  thriller: 'template_rc2blfp',   // Inserte aquí el ID de la plantilla Thriller (Rojo)
  bad: 'template_spmbw9h',             // Inserte aquí el ID de la plantilla Bad (Blanco)
  offthewall: 'TU_TEMPLATE_ID_THRILLER'  // Fallback: redirige Off The Wall a Thriller
};

// ==========================================
// 3. CONMUTADOR DE ERAS & PRECARGA DE VIDEO
// ==========================================
const eraButtons = document.querySelectorAll('.era-btn');
const bgVideo = document.getElementById('bg-video');
const videoLoader = document.getElementById('video-loader');

eraButtons.forEach((btn) => {
  btn.addEventListener('click', function () {
    const selectedEra = this.getAttribute('data-era');
    const videoSrc = this.getAttribute('data-video');

    if (document.body.classList.contains(`era-${selectedEra}`)) return;

    eraButtons.forEach((b) => b.classList.remove('active'));
    this.classList.add('active');

    if (videoLoader) videoLoader.classList.add('is-loading');
    bgVideo.style.opacity = '0';

    bgVideo.src = videoSrc;
    bgVideo.load();

    const handleCanPlay = () => {
      bgVideo.play().catch(() => {});

      document.body.className = '';
      document.body.classList.add(`era-${selectedEra}`);

      bgVideo.style.opacity = '0.35';
      if (videoLoader) videoLoader.classList.remove('is-loading');

      bgVideo.removeEventListener('canplaythrough', handleCanPlay);
    };

    bgVideo.addEventListener('canplaythrough', handleCanPlay);
  });
});

// ==========================================
// 4. EXTRACCIÓN AUTOMÁTICA DEL NOMBRE
// ==========================================
function extractNameFromEmail(email) {
  const username = email.split('@')[0];
  const rawFirstName = username.split(/[._-]/)[0];
  const cleanName = rawFirstName.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ]/g, '');

  if (!cleanName) return 'Leyenda';
  return cleanName.charAt(0).toUpperCase() + cleanName.slice(1).toLowerCase();
}

// ==========================================
// 5. ENVÍO DE FORMULARIO SEGÚN LA ERA ACTIVA
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

  // Identificar la era actual seleccionada en la web
  const activeClass = Array.from(document.body.classList).find((c) => c.startsWith('era-'));
  const currentEra = activeClass ? activeClass.replace('era-', '') : 'thriller';

  // Seleccionar la plantilla según la era activa
  const selectedTemplateID = eraTemplateIDs[currentEra] || eraTemplateIDs.thriller;

  btnSend.innerText = 'Enviando...';
  btnSend.disabled = true;

  const serviceID = 'service_4lmru1r';

  const templateParams = {
    user_email: emailInput,
    user_name: extractedName,
  };

  emailjs.send(serviceID, selectedTemplateID, templateParams)
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