const STORAGE_KEY = 'fake-chat-messages-v1';// acts as a folder name

// ready to use chat messages.

const PRESETS = [
  'Hey there! 👋',
  'How do you store messages?',
  'Show me a demo reply.',
  'Thanks!',
];

// linking to html elements
const messagesEl = document.getElementById('messages');
const inputEl = document.getElementById('input');
const sendBtn = document.getElementById('sendBtn');
const clearBtn = document.getElementById('clearBtn');
const presetsEl = document.getElementById('presets');

let messages = loadMessages();
renderMessages();
renderPresets();

sendBtn.addEventListener('click', handleSend);
inputEl.addEventListener('keydown', e => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    handleSend();
  }
});
clearBtn.addEventListener('click', () => {
  if (confirm('Clear conversation?')) {
    messages = [];
    saveMessages();
    renderMessages();
  }
});

function loadMessages() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try { return JSON.parse(raw); }
  catch { return []; }
}
function saveMessages() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
}
function renderMessages() {
  messagesEl.innerHTML = '';
  messages.forEach(m => {
    const div = document.createElement('div');
    div.className = `msg ${m.sender}`;
    div.innerHTML = `<div>${m.text}</div><div class="meta">${formatTime(m.time)}</div>`;
    messagesEl.appendChild(div);
  });
  messagesEl.scrollTop = messagesEl.scrollHeight;
}
function formatTime(ts) {
  const d = new Date(ts);
  return `${d.getHours()}:${String(d.getMinutes()).padStart(2,'0')}`;
}
function handleSend() {
  const text = inputEl.value.trim();
  if (!text) return;
  addMessage('me', text);
  inputEl.value = '';
  simulateReply(text);
}
function addMessage(sender, text) {
  messages.push({ sender, text, time: Date.now() });
  saveMessages();
  renderMessages();
}
function simulateReply(userText) {
  const typingEl = document.createElement('div');
  typingEl.className = 'typing';
  typingEl.textContent = 'Bot is typing...';
  messagesEl.appendChild(typingEl);
  messagesEl.scrollTop = messagesEl.scrollHeight;

  setTimeout(() => {
    typingEl.remove();
    const reply = generateReply(userText);
    addMessage('them', reply);
  }, 1000);
}
function generateReply(userText) {
  if(userText.toLowerCase().includes('hi'))
    return 'Hello.';
  if (userText.toLowerCase().includes('how'))
    return 'Iam Fine, Thank you';
  if (userText.toLowerCase().includes('store'))
    return 'I store messages in localStorage!';
  if (userText.toLowerCase().includes('demo'))
    return 'Here’s a demo reply.';
  if (userText.toLowerCase().includes('thank'))
    return 'You’re welcome!';
  return `You said: "${userText}"`;
}
function renderPresets() {
  PRESETS.forEach(text => {
    const btn = document.createElement('div');
    btn.className = 'preset';
    btn.textContent = text;
    btn.addEventListener('click', () => {
      inputEl.value = text;
      inputEl.focus();
    });
    presetsEl.appendChild(btn);
  });
}
