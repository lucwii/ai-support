(function () {
  'use strict';

  var script = document.currentScript;
  if (!script) return;

  var ORG_ID = script.getAttribute('data-org');
  var ACCENT = script.getAttribute('data-color') || '#6366F1';
  var POSITION = script.getAttribute('data-position') || 'bottom-right';
  var PLACEHOLDER = script.getAttribute('data-placeholder') || 'How can we help you today?';
  var BTN_TEXT = script.getAttribute('data-button-text') || 'Send message';
  var API_URL = script.getAttribute('data-api') || 'http://localhost:3001';

  if (!ORG_ID) return;

  var isOpen = false;
  var orgName = 'Support';

  fetch(API_URL + '/widget/' + ORG_ID + '/config')
    .then(function (r) { return r.json(); })
    .then(function (data) { orgName = data.name || orgName; })
    .catch(function () {});

  var positionSide = POSITION === 'bottom-left' ? 'left: 24px' : 'right: 24px';

  var styleEl = document.createElement('style');
  styleEl.textContent = [
    '#sai-btn{position:fixed;' + positionSide + ';bottom:24px;width:56px;height:56px;border-radius:50%;background:' + ACCENT + ';border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 20px rgba(0,0,0,.25);z-index:999998;transition:transform .2s,box-shadow .2s;}',
    '#sai-btn:hover{transform:scale(1.06);box-shadow:0 6px 28px rgba(0,0,0,.3);}',
    '#sai-popup{position:fixed;' + positionSide + ';bottom:96px;width:360px;max-width:calc(100vw - 32px);background:#fff;border-radius:16px;box-shadow:0 8px 40px rgba(0,0,0,.18);z-index:999999;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;overflow:hidden;display:none;flex-direction:column;}',
    '#sai-popup.open{display:flex;animation:sai-up .18s ease;}',
    '@keyframes sai-up{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}',
    '.sai-hd{background:' + ACCENT + ';padding:16px 20px;display:flex;align-items:center;justify-content:space-between;}',
    '.sai-hd-title{color:#fff;font-size:15px;font-weight:600;margin:0;}',
    '.sai-hd-sub{color:rgba(255,255,255,.75);font-size:12px;margin:2px 0 0;}',
    '.sai-x{background:none;border:none;color:rgba(255,255,255,.75);cursor:pointer;padding:4px;display:flex;align-items:center;border-radius:6px;transition:background .15s;}',
    '.sai-x:hover{background:rgba(255,255,255,.15);color:#fff;}',
    '.sai-bd{padding:20px;display:flex;flex-direction:column;gap:12px;}',
    '.sai-lbl{font-size:12px;font-weight:500;color:#64748b;margin:0 0 4px;display:block;}',
    '.sai-inp,.sai-ta{width:100%;border:1.5px solid #e2e8f0;border-radius:8px;font-size:13px;color:#1e293b;padding:9px 12px;box-sizing:border-box;outline:none;font-family:inherit;transition:border-color .15s;}',
    '.sai-inp:focus,.sai-ta:focus{border-color:' + ACCENT + ';}',
    '.sai-ta{resize:none;height:96px;}',
    '.sai-sub{background:' + ACCENT + ';color:#fff;border:none;border-radius:8px;padding:10px 16px;font-size:14px;font-weight:600;cursor:pointer;width:100%;font-family:inherit;transition:opacity .15s;}',
    '.sai-sub:hover:not(:disabled){opacity:.88;}',
    '.sai-sub:disabled{opacity:.55;cursor:not-allowed;}',
    '.sai-err{font-size:12px;color:#ef4444;margin:0;}',
    '.sai-ok{padding:24px 20px;text-align:center;display:flex;flex-direction:column;align-items:center;gap:12px;}',
    '.sai-ok-icon{width:44px;height:44px;border-radius:50%;background:#f0fdf4;display:flex;align-items:center;justify-content:center;}',
    '.sai-ok-title{font-size:15px;font-weight:600;color:#1e293b;margin:0;}',
    '.sai-answer{background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:14px;text-align:left;font-size:13px;color:#334155;line-height:1.6;width:100%;box-sizing:border-box;}',
    '.sai-answer-lbl{font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.05em;color:#94a3b8;margin:0 0 6px;}',
    '.sai-again{background:none;border:1.5px solid #e2e8f0;border-radius:8px;padding:8px 16px;font-size:13px;color:#64748b;cursor:pointer;font-family:inherit;transition:border-color .15s,color .15s;}',
    '.sai-again:hover{border-color:' + ACCENT + ';color:' + ACCENT + ';}',
    '.sai-footer{padding:10px 20px;border-top:1px solid #f1f5f9;text-align:center;font-size:11px;color:#cbd5e1;}',
    '.sai-footer a{color:#94a3b8;text-decoration:none;}',
  ].join('');
  document.head.appendChild(styleEl);

  var btn = document.createElement('button');
  btn.id = 'sai-btn';
  btn.setAttribute('aria-label', 'Open support chat');
  btn.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  document.body.appendChild(btn);

  var popup = document.createElement('div');
  popup.id = 'sai-popup';
  document.body.appendChild(popup);

  function header() {
    return '<div class="sai-hd"><div><p class="sai-hd-title">' + orgName + '</p><p class="sai-hd-sub">We typically reply instantly</p></div><button class="sai-x" id="sai-x" aria-label="Close"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button></div>';
  }

  function footer() {
    return '<div class="sai-footer">Powered by <a href="#" target="_blank">SupportAI</a></div>';
  }

  function checkIcon() {
    return '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>';
  }

  function renderForm() {
    popup.innerHTML = header() +
      '<div class="sai-bd">' +
        '<div><label class="sai-lbl" for="sai-email">Email (optional)</label><input class="sai-inp" type="email" id="sai-email" placeholder="you@example.com" /></div>' +
        '<div><label class="sai-lbl" for="sai-msg">Your message</label><textarea class="sai-ta" id="sai-msg" placeholder="' + PLACEHOLDER + '"></textarea></div>' +
        '<p class="sai-err" id="sai-err" style="display:none"></p>' +
        '<button class="sai-sub" id="sai-sub">' + BTN_TEXT + '</button>' +
      '</div>' +
      footer();

    document.getElementById('sai-x').onclick = togglePopup;
    document.getElementById('sai-sub').onclick = handleSubmit;
  }

  function renderSuccess(wasAutoAnswered, aiResponse) {
    var body = wasAutoAnswered
      ? '<div class="sai-ok-icon">' + checkIcon() + '</div>' +
        '<p class="sai-ok-title">Here\'s your answer</p>' +
        '<div class="sai-answer"><p class="sai-answer-lbl">AI Answer</p>' + escapeHtml(aiResponse) + '</div>' +
        '<button class="sai-again" id="sai-again">Ask another question</button>'
      : '<div class="sai-ok-icon">' + checkIcon() + '</div>' +
        '<p class="sai-ok-title">Ticket submitted!</p>' +
        '<p style="font-size:13px;color:#64748b;margin:0">A support agent will get back to you shortly.</p>' +
        '<button class="sai-again" id="sai-again">Submit another</button>';

    popup.innerHTML = header() +
      '<div class="sai-ok">' + body + '</div>' +
      footer();

    document.getElementById('sai-x').onclick = togglePopup;
    document.getElementById('sai-again').onclick = renderForm;
  }

  function handleSubmit() {
    var email = document.getElementById('sai-email').value.trim();
    var message = document.getElementById('sai-msg').value.trim();
    var errEl = document.getElementById('sai-err');
    var subBtn = document.getElementById('sai-sub');

    if (message.length < 5) {
      errEl.textContent = 'Please enter at least 5 characters.';
      errEl.style.display = 'block';
      return;
    }

    errEl.style.display = 'none';
    subBtn.disabled = true;
    subBtn.textContent = 'Sending...';

    var body = { organization_id: ORG_ID, content: message };
    if (email) body.customer_email = email;

    fetch(API_URL + '/tickets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
      .then(function (res) {
        if (!res.ok) throw new Error('error');
        return res.json();
      })
      .then(function (json) {
        var wasAutoAnswered = (json.data && json.data.wasAutoAnswered) || false;
        var aiResponse = (json.data && json.data.ticket && json.data.ticket.ai_response) || '';
        renderSuccess(wasAutoAnswered, aiResponse);
      })
      .catch(function () {
        errEl.textContent = 'Something went wrong. Please try again.';
        errEl.style.display = 'block';
        subBtn.disabled = false;
        subBtn.textContent = BTN_TEXT;
      });
  }

  function togglePopup() {
    isOpen = !isOpen;
    if (isOpen) {
      renderForm();
      popup.classList.add('open');
    } else {
      popup.classList.remove('open');
    }
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  btn.onclick = togglePopup;
})();
