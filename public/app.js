const identifyForm = document.getElementById('identifyForm');
const emailInput = document.getElementById('email');
const phoneInput = document.getElementById('phoneNumber');
const responseBox = document.getElementById('responseBox');
const submitBtn = document.getElementById('submitBtn');
const serverDot = document.getElementById('serverDot');
const serverStatus = document.getElementById('serverStatus');

function setServerState(isUp, text) {
  serverDot.classList.remove('up', 'down');
  serverDot.classList.add(isUp ? 'up' : 'down');
  serverStatus.textContent = text;
}

async function checkHealth() {
  try {
    const res = await fetch('/health');
    if (!res.ok) throw new Error('Health check failed');
    setServerState(true, 'Server is running');
  } catch (error) {
    setServerState(false, 'Server unavailable');
  }
}

function renderJson(data) {
  responseBox.textContent = JSON.stringify(data, null, 2);
}

identifyForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const email = emailInput.value.trim();
  const phoneNumber = phoneInput.value.trim();

  if (!email && !phoneNumber) {
    renderJson({ error: 'Please provide email or phoneNumber' });
    return;
  }

  submitBtn.disabled = true;
  submitBtn.textContent = 'Sending...';

  try {
    const payload = {};
    if (email) payload.email = email;
    if (phoneNumber) payload.phoneNumber = phoneNumber;

    const response = await fetch('/identify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    renderJson(data);
  } catch (error) {
    renderJson({ error: 'Request failed', details: error.message });
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Send Identify Request';
  }
});

checkHealth();
