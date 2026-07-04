// ═══════════════════════════════════════════════════════
// ESTILOS INJETADOS
// ═══════════════════════════════════════════════════════
;(function injetarEstilos() {
  const s = document.createElement('style')
  s.textContent = `
    /* ── Lockscreen ── */
    .lockscreen {
      position: absolute; inset: 0; border-radius: 20px;
      background: linear-gradient(160deg, #0d0420 0%, #1a063a 60%, #0a0218 100%);
      display: flex; flex-direction: column; align-items: center;
      justify-content: space-between; padding: 20px 0 24px;
      cursor: pointer; z-index: 10; overflow: hidden;
    }
    .lock-topo {
      display: flex; flex-direction: column; align-items: center; gap: 3px;
      margin-top: 8px;
    }
    .lock-hora {
      font-size: 3.4rem; color: #f0e8ff;
      font-family: Georgia, serif; font-weight: 300; letter-spacing: -1px;
      text-shadow: 0 0 30px rgba(160,100,255,0.4);
    }
    .lock-data {
      font-size: 0.62rem; color: #9a6fd5; letter-spacing: 0.1em; text-transform: uppercase;
    }
    .lock-notif {
      width: 88%; background: rgba(40,12,80,0.85);
      border: 0.5px solid rgba(140,80,220,0.3);
      border-radius: 12px; padding: 8px 10px;
      display: flex; align-items: center; gap: 7px;
      animation: notifPulse 2s ease-in-out infinite;
    }
    @keyframes notifPulse {
      0%,100% { opacity: 1; } 50% { opacity: 0.7; }
    }
    .lock-notif-icon {
      font-size: 1.3rem; flex-shrink: 0;
    }
    .lock-notif-body { display: flex; flex-direction: column; gap: 1px; }
    .lock-notif-app  { font-size: 0.5rem; color: #7a5bb5; letter-spacing: 0.08em; text-transform: uppercase; }
    .lock-notif-msg  { font-size: 0.6rem; color: #d0b8f5; line-height: 1.4; }
    .lock-base {
      display: flex; flex-direction: column; align-items: center; gap: 4px;
    }
    .lock-bolinha {
      width: 32px; height: 4px; background: rgba(200,160,255,0.3);
      border-radius: 2px;
    }
    .lock-deslize {
      font-size: 0.5rem; color: #5a3a7a; letter-spacing: 0.15em; text-transform: uppercase;
    }

    /* ── Chat app ── */
    .chat-app {
      position: absolute; inset: 0; border-radius: 20px;
      background: #0a031a; display: flex; flex-direction: column;
      overflow: hidden; z-index: 9;
      transform: translateY(100%);
      transition: transform 0.45s cubic-bezier(0.4,0,0.2,1);
    }
    .chat-app.aberto { transform: translateY(0); }

    .chat-header {
      background: #100528; padding: 8px 10px;
      display: flex; align-items: center; gap: 7px;
      border-bottom: 0.5px solid #1e0d3a; flex-shrink: 0;
    }
    .chat-voltar { font-size: 0.9rem; color: #7a5bb5; }
    .chat-avatar {
      width: 26px; height: 26px; border-radius: 50%;
      background: #5a1090; display: flex; align-items: center;
      justify-content: center; font-size: 0.62rem; color: #e0d0ff; flex-shrink: 0;
    }
    .chat-info  { display: flex; flex-direction: column; gap: 1px; }
    .chat-nome  { font-size: 0.7rem; color: #e0d0ff; font-family: Georgia, serif; }
    .chat-status { font-size: 0.52rem; color: #4caf82; }

    .chat-msgs {
      flex: 1; overflow-y: scroll; padding: 8px 7px;
      display: flex; flex-direction: column; gap: 5px;
      scroll-behavior: smooth; -webkit-overflow-scrolling: touch;
    }
    .chat-msgs::-webkit-scrollbar { width: 2px; }
    .chat-msgs::-webkit-scrollbar-thumb { background: #2a1a4a; border-radius: 1px; }

    .msg {
      max-width: 85%; padding: 6px 10px; border-radius: 14px;
      font-size: 0.62rem; line-height: 1.5; word-break: break-word;
      animation: msgIn 0.22s ease;
    }
    @keyframes msgIn {
      from { opacity: 0; transform: translateY(5px) scale(0.97); }
      to   { opacity: 1; transform: none; }
    }
    .msg.recebida {
      background: #1a0a38; color: #c9a7f5;
      align-self: flex-start; border-bottom-left-radius: 3px;
      border: 0.5px solid #2a1a4a;
    }

    .digitando {
      display: flex; align-items: center; gap: 3px;
      padding: 7px 9px; background: #1a0a38; border-radius: 14px;
      border-bottom-left-radius: 3px; align-self: flex-start;
      border: 0.5px solid #2a1a4a; animation: msgIn 0.22s ease;
    }
    .digitando span {
      width: 4px; height: 4px; background: #7a5bb5;
      border-radius: 50%; animation: dotbounce 1.1s ease-in-out infinite;
    }
    .digitando span:nth-child(2) { animation-delay: 0.16s; }
    .digitando span:nth-child(3) { animation-delay: 0.32s; }
    @keyframes dotbounce {
      0%,60%,100% { transform: translateY(0); opacity: 0.4; }
      30%          { transform: translateY(-4px); opacity: 1; }
    }

    .chat-bottom {
      padding: 5px 7px; background: #100528;
      border-top: 0.5px solid #1e0d3a; flex-shrink: 0;
    }
    .input-fake {
      background: #1a0a38; border-radius: 14px; padding: 5px 10px;
      font-size: 0.58rem; color: #2a1a4a; font-family: Georgia, serif;
    }

    .fechar-hint {
      font-size: 0.52rem; color: #5a3a8a; text-align: center;
      padding: 4px 0; letter-spacing: 0.1em; text-transform: uppercase;
      animation: piscar 1.4s ease-in-out infinite; flex-shrink: 0;
    }
    @keyframes piscar { 0%,100%{opacity:1} 50%{opacity:0.2} }

    /* ── Timer ── */
    .timer-wrap {
      position: fixed; inset: 0; display: flex; flex-direction: column;
      align-items: center; justify-content: center;
      z-index: 2000; pointer-events: none; opacity: 0; text-align: center; gap: 8px;
    }
    .timer-label   { color: #9a6fd5; font-size: 0.9rem; letter-spacing: 0.04em; }
    .timer-display {
      color: #e0d0ff; font-size: 3.2rem;
      font-family: Georgia, serif; letter-spacing: 0.08em;
    }
    .timer-sub { color: #5a3a8a; font-size: 0.75rem; }
  `
  document.head.appendChild(s)
})()

// ═══════════════════════════════════════════════════════
// ÁUDIO
// ═══════════════════════════════════════════════════════
let audioCtx     = null
let ringInterval = null

function getCtx() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)()
  return audioCtx
}

function criarRuido(dur) {
  const c = getCtx()
  const buf = c.createBuffer(1, Math.ceil(c.sampleRate * dur), c.sampleRate)
  const d = buf.getChannelData(0)
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1
  const src = c.createBufferSource(); src.buffer = buf; return src
}

function somEnvelope() {
  const c = getCtx(), t = c.currentTime
  const n = criarRuido(0.6), f = c.createBiquadFilter(), g = c.createGain()
  f.type = 'bandpass'
  f.frequency.setValueAtTime(3500, t); f.frequency.exponentialRampToValueAtTime(1200, t + 0.6)
  f.Q.value = 1.2
  g.gain.setValueAtTime(0.001, t); g.gain.linearRampToValueAtTime(0.35, t + 0.05)
  g.gain.setValueAtTime(0.28, t + 0.2); g.gain.exponentialRampToValueAtTime(0.001, t + 0.6)
  n.connect(f); f.connect(g); g.connect(c.destination); n.start(); n.stop(t + 0.6)
}

function somAterrissagem() {
  const c = getCtx(), t = c.currentTime
  const o = c.createOscillator(), go = c.createGain()
  o.type = 'sine'
  o.frequency.setValueAtTime(120, t); o.frequency.exponentialRampToValueAtTime(30, t + 0.25)
  go.gain.setValueAtTime(0.7, t); go.gain.exponentialRampToValueAtTime(0.001, t + 0.3)
  o.connect(go); go.connect(c.destination); o.start(); o.stop(t + 0.3)
  const n = criarRuido(0.15), f = c.createBiquadFilter(), gn = c.createGain()
  f.type = 'lowpass'; f.frequency.value = 400
  gn.gain.setValueAtTime(0.4, t); gn.gain.exponentialRampToValueAtTime(0.001, t + 0.15)
  n.connect(f); f.connect(gn); gn.connect(c.destination); n.start(); n.stop(t + 0.15)
}

function somLaco() {
  const c = getCtx(), t = c.currentTime
  const n = criarRuido(0.5), f = c.createBiquadFilter(), g = c.createGain()
  f.type = 'bandpass'
  f.frequency.setValueAtTime(800, t)
  f.frequency.exponentialRampToValueAtTime(2500, t + 0.25)
  f.frequency.exponentialRampToValueAtTime(600, t + 0.5)
  f.Q.value = 0.6
  g.gain.setValueAtTime(0.001, t); g.gain.linearRampToValueAtTime(0.2, t + 0.08)
  g.gain.setValueAtTime(0.15, t + 0.3); g.gain.exponentialRampToValueAtTime(0.001, t + 0.5)
  n.connect(f); f.connect(g); g.connect(c.destination); n.start(); n.stop(t + 0.5)
}

function somTampa() {
  const c = getCtx(), t = c.currentTime
  const o = c.createOscillator(), fo = c.createBiquadFilter(), go = c.createGain()
  o.type = 'sawtooth'
  o.frequency.setValueAtTime(60, t); o.frequency.linearRampToValueAtTime(38, t + 1.0)
  fo.type = 'lowpass'; fo.frequency.value = 300
  go.gain.setValueAtTime(0.001, t); go.gain.linearRampToValueAtTime(0.12, t + 0.1)
  go.gain.setValueAtTime(0.10, t + 0.8); go.gain.exponentialRampToValueAtTime(0.001, t + 1.1)
  o.connect(fo); fo.connect(go); go.connect(c.destination); o.start(); o.stop(t + 1.1)
  const n = criarRuido(1.0), fn = c.createBiquadFilter(), gn = c.createGain()
  fn.type = 'bandpass'; fn.frequency.setValueAtTime(600, t); fn.Q.value = 0.5
  gn.gain.setValueAtTime(0.001, t); gn.gain.linearRampToValueAtTime(0.08, t + 0.15)
  gn.gain.exponentialRampToValueAtTime(0.001, t + 1.0)
  n.connect(fn); fn.connect(gn); gn.connect(c.destination); n.start(); n.stop(t + 1.0)
}

function somCarta() {
  const c = getCtx(), t = c.currentTime
  const n = criarRuido(0.35), f = c.createBiquadFilter(), g = c.createGain()
  f.type = 'bandpass'
  f.frequency.setValueAtTime(2800, t); f.frequency.exponentialRampToValueAtTime(1600, t + 0.35)
  f.Q.value = 1.5
  g.gain.setValueAtTime(0.001, t); g.gain.linearRampToValueAtTime(0.22, t + 0.04)
  g.gain.setValueAtTime(0.18, t + 0.15); g.gain.exponentialRampToValueAtTime(0.001, t + 0.35)
  n.connect(f); f.connect(g); g.connect(c.destination); n.start(); n.stop(t + 0.35)
}

function somCelularSubindo() {
  const c = getCtx(), t = c.currentTime
  const n = criarRuido(0.4), f = c.createBiquadFilter(), g = c.createGain()
  f.type = 'bandpass'
  f.frequency.setValueAtTime(1000, t); f.frequency.exponentialRampToValueAtTime(2200, t + 0.4)
  f.Q.value = 1.0
  g.gain.setValueAtTime(0.001, t); g.gain.linearRampToValueAtTime(0.18, t + 0.08)
  g.gain.exponentialRampToValueAtTime(0.001, t + 0.4)
  n.connect(f); f.connect(g); g.connect(c.destination); n.start(); n.stop(t + 0.4)
}

// Som de notificação estilo iPhone (tri-tone simplificado)
function somNotificacao() {
  const c = getCtx(), t = c.currentTime
  function ping(freq, ini, dur) {
    const o = c.createOscillator(), g = c.createGain()
    o.type = 'sine'; o.frequency.value = freq
    g.gain.setValueAtTime(0.001, t + ini)
    g.gain.linearRampToValueAtTime(0.22, t + ini + 0.012)
    g.gain.exponentialRampToValueAtTime(0.001, t + ini + dur)
    o.connect(g); g.connect(c.destination)
    o.start(t + ini); o.stop(t + ini + dur)
    // Harmônico suave junto
    const o2 = c.createOscillator(), g2 = c.createGain()
    o2.type = 'sine'; o2.frequency.value = freq * 2
    g2.gain.setValueAtTime(0.001, t + ini)
    g2.gain.linearRampToValueAtTime(0.07, t + ini + 0.01)
    g2.gain.exponentialRampToValueAtTime(0.001, t + ini + dur * 0.6)
    o2.connect(g2); g2.connect(c.destination)
    o2.start(t + ini); o2.stop(t + ini + dur)
  }
  ping(1318, 0.00, 0.18)   // Mi5
  ping(1568, 0.10, 0.18)   // Sol5
  ping(2093, 0.20, 0.30)   // Do6
}

function tocarBuzz() {
  const c = getCtx(), t = c.currentTime
  function pulso(ini, dur) {
    const o = c.createOscillator(), f = c.createBiquadFilter(), g = c.createGain()
    o.type = 'square'; o.frequency.value = 55
    f.type = 'lowpass'; f.frequency.value = 180
    g.gain.setValueAtTime(0.001, t + ini)
    g.gain.linearRampToValueAtTime(0.35, t + ini + 0.015)
    g.gain.setValueAtTime(0.32, t + ini + dur - 0.02)
    g.gain.linearRampToValueAtTime(0.001, t + ini + dur)
    o.connect(f); f.connect(g); g.connect(c.destination)
    o.start(t + ini); o.stop(t + ini + dur)
  }
  pulso(0.00, 0.12); pulso(0.18, 0.12); pulso(0.36, 0.30)
}

function iniciarRing() { tocarBuzz(); ringInterval = setInterval(tocarBuzz, 1400) }
function pararRing()   { clearInterval(ringInterval); ringInterval = null }

// ═══════════════════════════════════════════════════════
// ENVELOPE
// ═══════════════════════════════════════════════════════
const envelope     = document.getElementById('envelope')
const telaEnvelope = document.getElementById('telaEnvelope')

envelope.addEventListener('click', () => { getCtx(); abrirEnvelope() })

function abrirEnvelope() {
  somEnvelope()
  gsap.to(envelope, {
    y: -200, opacity: 0, scale: 0.8, duration: 0.8, ease: 'power2.in',
    onComplete: () => { telaEnvelope.style.display = 'none'; mostrarCaixa() }
  })
}

// ═══════════════════════════════════════════════════════
// CAIXA
// ═══════════════════════════════════════════════════════
function mostrarCaixa() {
  const telaCaixa = document.createElement('div')
  telaCaixa.classList.add('tela-caixa')

  const wrapper = document.createElement('div')
  wrapper.classList.add('caixa-wrapper')

  const tampa = document.createElement('div'); tampa.classList.add('tampa')

  const laco = document.createElement('div')
  const loopEsq = document.createElement('div')
  const loopDir = document.createElement('div')
  const no = document.createElement('div')
  laco.classList.add('laco')
  loopEsq.classList.add('laco-loop', 'laco-loop-esq')
  loopDir.classList.add('laco-loop', 'laco-loop-dir')
  no.classList.add('laco-no')
  laco.appendChild(loopEsq); laco.appendChild(no); laco.appendChild(loopDir)
  tampa.appendChild(laco)

  const fitaH = document.createElement('div'); fitaH.classList.add('fita-h')
  const fitaV = document.createElement('div'); fitaV.classList.add('fita-v')
  const corpo = document.createElement('div'); corpo.classList.add('corpo-caixa')

  const dica = document.createElement('p')
  dica.style.color = '#c9a7f5'; dica.style.fontSize = '0.85rem'
  dica.textContent = 'clique na caixa'

  wrapper.appendChild(tampa); wrapper.appendChild(fitaH)
  wrapper.appendChild(fitaV); wrapper.appendChild(corpo)
  telaCaixa.appendChild(wrapper); telaCaixa.appendChild(dica)
  document.body.appendChild(telaCaixa)

  gsap.fromTo(wrapper,
    { y: -800, opacity: 0 },
    { y: 0, opacity: 1, duration: 1.1, ease: 'bounce.out', onComplete: () => somAterrissagem() }
  )

  wrapper.addEventListener('click', () => {
    abrirCaixa(tampa, loopEsq, loopDir, no, fitaV, fitaH, dica, wrapper, telaCaixa)
  })
}

// ═══════════════════════════════════════════════════════
// CARTAS
// ═══════════════════════════════════════════════════════
const cartas = [
  { emoji: '💌', texto: 'Você é incrível, Pietra!' },
  { emoji: '🌸', texto: 'Feliz aniversário!' },
  { emoji: '✨', texto: 'Que esse ano seja lindo pra você' },
  { emoji: '🎂', texto: 'Muitas felicidades!' },
  { emoji: '💜', texto: 'Com carinho 💜' },
]

function abrirCaixa(tampa, loopEsq, loopDir, no, fitaV, fitaH, dica, wrapper, telaCaixa) {
  wrapper.style.pointerEvents = 'none'
  gsap.to(dica, { opacity: 0, duration: 0.3 })

  somLaco()
  gsap.to(loopEsq, { x: -90, y: -50, opacity: 0, rotation: -40, duration: 0.6, ease: 'power2.out' })
  gsap.to(loopDir, { x:  90, y: -50, opacity: 0, rotation:  40, duration: 0.6, ease: 'power2.out' })
  gsap.to(no,      { scale: 0, opacity: 0, duration: 0.4, ease: 'power2.in' })
  gsap.to([fitaV, fitaH], { opacity: 0, duration: 0.5, delay: 0.3 })

  setTimeout(() => somTampa(), 800)
  gsap.to(tampa, { rotateX: -130, duration: 1.1, delay: 0.8, ease: 'power2.inOut' })

  cartas.forEach((carta, i) => {
    setTimeout(() => { somCarta(); criarCarta(carta, i, cartas.length) }, 1800 + i * 600)
  })

  const tempoCartas = 1800 + cartas.length * 600 + 400
  setTimeout(() => mostrarCelular(telaCaixa), tempoCartas)
}

function criarCarta(carta, index, total) {
  const el = document.createElement('div')
  const cx = window.innerWidth / 2, cy = window.innerHeight / 2
  const spread  = (index - (total - 1) / 2) * 220
  const rotacao = (index - (total - 1) / 2) * 10

  el.style.cssText = `
    position: fixed; left: ${cx - 120}px; top: ${cy + 60}px;
    width: 240px; background: #2a0a50; border: 1px solid #7a4fbf;
    border-radius: 10px; padding: 28px; text-align: center;
    color: #c9a7f5; font-size: 1.25rem; line-height: 1.6;
    z-index: 100; opacity: 0; cursor: grab; user-select: none;
  `
  el.innerHTML = `
    <div style="font-size:3rem; margin-bottom:14px">${carta.emoji}</div>
    <div style="white-space: pre-line">${carta.texto}</div>
  `
  document.body.appendChild(el)

  gsap.to(el, {
    y: -320, x: spread, rotation: rotacao, opacity: 1,
    duration: 1.6, ease: 'elastic.out(1, 0.6)',
    onComplete: () => ativarArrasto(el, rotacao)
  })
}

// ═══════════════════════════════════════════════════════
// ARRASTAR CARTAS
// ═══════════════════════════════════════════════════════
function ativarArrasto(el, rotacaoInicial) {
  let arrastando = false, offsetX = 0, offsetY = 0, fixado = false

  function fixarPosicao() {
    if (fixado) return
    const rect = el.getBoundingClientRect()
    gsap.killTweensOf(el)
    el.style.left = rect.left + 'px'; el.style.top = rect.top + 'px'
    gsap.set(el, { x: 0, y: 0, rotation: rotacaoInicial })
    fixado = true
  }

  el.addEventListener('mousedown', (e) => {
    fixarPosicao(); arrastando = true
    const rect = el.getBoundingClientRect()
    offsetX = e.clientX - rect.left; offsetY = e.clientY - rect.top
    gsap.to(el, { scale: 1.05, boxShadow: '0 12px 40px rgba(0,0,0,0.5)', duration: 0.2 })
    el.style.cursor = 'grabbing'; el.style.zIndex = '999'
    e.preventDefault()
  })
  document.addEventListener('mousemove', (e) => {
    if (!arrastando) return
    el.style.left = (e.clientX - offsetX) + 'px'; el.style.top = (e.clientY - offsetY) + 'px'
  })
  document.addEventListener('mouseup', () => {
    if (!arrastando) return; arrastando = false
    el.style.cursor = 'grab'
    gsap.to(el, { scale: 1, boxShadow: 'none', duration: 0.2 })
  })
  el.addEventListener('touchstart', (e) => {
    fixarPosicao()
    const t = e.touches[0], rect = el.getBoundingClientRect()
    offsetX = t.clientX - rect.left; offsetY = t.clientY - rect.top
    gsap.killTweensOf(el); gsap.to(el, { scale: 1.05, duration: 0.2 })
    el.style.zIndex = '999'; e.preventDefault()
  }, { passive: false })
  el.addEventListener('touchmove', (e) => {
    const t = e.touches[0]
    el.style.left = (t.clientX - offsetX) + 'px'; el.style.top = (t.clientY - offsetY) + 'px'
    e.preventDefault()
  }, { passive: false })
  el.addEventListener('touchend', () => gsap.to(el, { scale: 1, duration: 0.2 }))
}

// ═══════════════════════════════════════════════════════
// CELULAR
// ═══════════════════════════════════════════════════════
function mostrarCelular(telaCaixa) {
  const wrapCel = document.createElement('div'); wrapCel.classList.add('celular-wrapper')
  const celular = document.createElement('div'); celular.classList.add('celular')
  const speaker = document.createElement('div'); speaker.classList.add('celular-speaker')
  const camera  = document.createElement('div'); camera.classList.add('celular-camera')
  const tela    = document.createElement('div'); tela.classList.add('celular-tela')
  const home    = document.createElement('div'); home.classList.add('celular-home')
  const vol1    = document.createElement('div'); vol1.classList.add('celular-botao-vol', 'um')
  const vol2    = document.createElement('div'); vol2.classList.add('celular-botao-vol', 'dois')
  const power   = document.createElement('div'); power.classList.add('celular-botao-power')

  // Notificação piscando na tela enquanto vibra
  tela.innerHTML = `
    <div style="font-size:2rem; animation: notifPulse 1.8s ease-in-out infinite;">💌</div>
    <div style="font-size:0.58rem; color:#9a6fd5; margin-top:6px; letter-spacing:0.05em; animation: notifPulse 1.8s ease-in-out infinite 0.3s;">mensagem nova</div>
    <div style="font-size:0.65rem; color:#c9a7f5; margin-top:3px; animation: notifPulse 1.8s ease-in-out infinite 0.6s;">Tarek 💌</div>
  `

  celular.appendChild(speaker); celular.appendChild(camera); celular.appendChild(tela)
  celular.appendChild(home);    celular.appendChild(vol1);   celular.appendChild(vol2); celular.appendChild(power)
  wrapCel.appendChild(celular); telaCaixa.appendChild(wrapCel)

  somCelularSubindo()
  gsap.fromTo(wrapCel,
    { y: 300, opacity: 0 },
    {
      y: 0, opacity: 1, duration: 1.2, ease: 'back.out(1.7)',
      onComplete: () => iniciarVibracao(wrapCel, tela, telaCaixa)
    }
  )
}

function iniciarVibracao(wrapCel, tela, telaCaixa) {
  const telaTween = gsap.to(tela, {
    backgroundColor: '#2a0850', repeat: -1, yoyo: true, duration: 0.5, ease: 'sine.inOut'
  })

  const vibTl = gsap.timeline({ repeat: -1, repeatDelay: 0.8 })
  vibTl
    .to(wrapCel, { x:  5, rotation:  1.5, duration: 0.05, ease: 'none' })
    .to(wrapCel, { x: -5, rotation: -1.5, duration: 0.05, ease: 'none' })
    .to(wrapCel, { x:  4, rotation:  1.2, duration: 0.05, ease: 'none' })
    .to(wrapCel, { x: -4, rotation: -1.2, duration: 0.05, ease: 'none' })
    .to(wrapCel, { x:  2, rotation:  0.6, duration: 0.05, ease: 'none' })
    .to(wrapCel, { x:  0, rotation:  0,   duration: 0.07, ease: 'none' })

  iniciarRing()
  if (navigator.vibrate) navigator.vibrate([120, 80, 120, 80, 300])

  wrapCel.style.cursor = 'pointer'
  wrapCel.addEventListener('click', () => {
    vibTl.kill(); telaTween.kill(); pararRing()
    gsap.killTweensOf(tela); tela.style.backgroundColor = ''
    wrapCel.style.cursor = 'default'
    zoomCelular(wrapCel, tela, telaCaixa)
  }, { once: true })
}

function zoomCelular(wrapCel, tela, telaCaixa) {
  const rect = wrapCel.getBoundingClientRect()
  wrapCel.style.position = 'fixed'
  wrapCel.style.left     = rect.left + 'px'
  wrapCel.style.top      = rect.top  + 'px'
  wrapCel.style.margin   = '0'
  wrapCel.style.zIndex   = '500'

  const scale  = Math.min((window.innerHeight * 0.88) / 340, (window.innerWidth * 0.85) / 180, 2.1)
  const targetX = (window.innerWidth  / 2) - (rect.left + 90)
  const targetY = (window.innerHeight / 2) - (rect.top  + 170)

  gsap.to(wrapCel, {
    x: targetX, y: targetY, scale: scale, duration: 0.7, ease: 'power2.out',
    onComplete: () => mostrarLockscreen(tela, wrapCel, telaCaixa)
  })
}

// ═══════════════════════════════════════════════════════
// LOCKSCREEN MELHORADA
// ═══════════════════════════════════════════════════════
function mostrarLockscreen(tela, wrapCel, telaCaixa) {
  tela.innerHTML = ''; tela.style.position = 'relative'; tela.style.overflow = 'hidden'
  tela.style.padding = '0'

  const lock = document.createElement('div'); lock.classList.add('lockscreen')

  // Topo — hora
  const topo = document.createElement('div'); topo.classList.add('lock-topo')
  const horaEl = document.createElement('div'); horaEl.classList.add('lock-hora')
  const dataEl = document.createElement('div'); dataEl.classList.add('lock-data')
  topo.appendChild(horaEl); topo.appendChild(dataEl)

  // Notificação no meio
  const notif = document.createElement('div'); notif.classList.add('lock-notif')
  notif.innerHTML = `
    <div class="lock-notif-icon">💌</div>
    <div class="lock-notif-body">
      <div class="lock-notif-app">Mensagens</div>
      <div class="lock-notif-msg">Tarek: Oiii...</div>
    </div>
  `

  // Base — deslize
  const base = document.createElement('div'); base.classList.add('lock-base')
  const bolinha = document.createElement('div'); bolinha.classList.add('lock-bolinha')
  const deslize = document.createElement('div'); deslize.classList.add('lock-deslize')
  deslize.textContent = 'toque para desbloquear'
  base.appendChild(bolinha); base.appendChild(deslize)

  lock.appendChild(topo); lock.appendChild(notif); lock.appendChild(base)
  tela.appendChild(lock)

  function atualizarHora() {
    const n = new Date()
    const h = String(n.getHours()).padStart(2, '0')
    const m = String(n.getMinutes()).padStart(2, '0')
    horaEl.textContent = h + ':' + m
    const dias  = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb']
    const meses = ['jan','fev','mar','abr','mai','jun','jul','ago','set','out','nov','dez']
    dataEl.textContent = dias[n.getDay()] + ', ' + n.getDate() + ' de ' + meses[n.getMonth()]
  }
  atualizarHora()
  const clockInt = setInterval(atualizarHora, 1000)

  const chatApp = criarChatApp()
  tela.appendChild(chatApp)

  lock.addEventListener('click', () => {
    clearInterval(clockInt)
    desbloquear(lock, chatApp, tela, wrapCel)
  })
}

// ═══════════════════════════════════════════════════════
// CHAT APP
// ═══════════════════════════════════════════════════════
function criarChatApp() {
  const app = document.createElement('div'); app.classList.add('chat-app')

  const header = document.createElement('div'); header.classList.add('chat-header')
  header.innerHTML = `
    <div class="chat-voltar">‹</div>
    <div class="chat-avatar">TK</div>
    <div class="chat-info">
      <div class="chat-nome">Tarek</div>
      <div class="chat-status">online</div>
    </div>
  `
  const msgs = document.createElement('div'); msgs.classList.add('chat-msgs')
  const bottom = document.createElement('div'); bottom.classList.add('chat-bottom')
  bottom.innerHTML = `<div class="input-fake">Mensagem</div>`

  app.appendChild(header); app.appendChild(msgs); app.appendChild(bottom)
  return app
}

function desbloquear(lock, chatApp, tela, wrapCel) {
  gsap.to(lock, {
    y: '-100%', opacity: 0, duration: 0.45, ease: 'power2.in',
    onComplete: () => lock.remove()
  })
  setTimeout(() => {
    chatApp.classList.add('aberto')
    const msgs = chatApp.querySelector('.chat-msgs')
    iniciarConversa(msgs, chatApp, wrapCel)
  }, 200)
}

// ═══════════════════════════════════════════════════════
// CONVERSA
// ═══════════════════════════════════════════════════════
function esperar(ms) { return new Promise(r => setTimeout(r, ms)) }

function criarDigitando(container) {
  const el = document.createElement('div'); el.classList.add('digitando')
  el.innerHTML = '<span></span><span></span><span></span>'
  container.appendChild(el)
  container.scrollTop = container.scrollHeight
  return el
}

function adicionarMsg(container, texto) {
  const el = document.createElement('div'); el.classList.add('msg', 'recebida')
  el.textContent = texto
  container.appendChild(el)
  container.scrollTop = container.scrollHeight
  somNotificacao()
}

async function iniciarConversa(msgs, chatApp, wrapCel) {
  const TYPING = 2200

  async function enviar(texto, delayAntes) {
    await esperar(delayAntes)
    const dot = criarDigitando(msgs)
    await esperar(TYPING)
    dot.remove()
    adicionarMsg(msgs, texto)
  }

  await enviar('Oiii', 700)
  await enviar('Hoje é um dia muito especial e eu não poderia deixar de fazer algo especial, para uma pessoa muito especial para mim', 2000)
  await enviar('Voce é uma pessoa incrível e merece tudo de bom e melhor nessa vida', 2000)
  await enviar('Eu sempre vou torcer pelo teu sucesso e a tua vitória, te desejo tudo de bom minha princesa,', 2000)
  await enviar('Ah e antes que eu me esqueça, esse não é meu ultimo presente, talvez vc devesse voltar para a casa as 11 horas da manhã, talvez tenha outra surpresa te esperando lá 👀', 5000)

  // Todas as mensagens enviadas — mostra hint de fechar e espera clique
  await esperar(800)
  mostrarHintFechar(chatApp, wrapCel)
}

function mostrarHintFechar(chatApp, wrapCel) {
  const hint = document.createElement('div'); hint.classList.add('fechar-hint')
  hint.textContent = 'toque para fechar'
  chatApp.appendChild(hint)

  // Qualquer toque/clique no celular fecha
  const cel = wrapCel.querySelector('.celular')
  cel.style.cursor = 'pointer'
  cel.addEventListener('click', () => {
    hint.remove()
    cel.style.cursor = 'default'
    fecharCelular(wrapCel)
  }, { once: true })
}

// ═══════════════════════════════════════════════════════
// FECHAR CELULAR
// ═══════════════════════════════════════════════════════
function fecharCelular(wrapCel) {
  gsap.to(wrapCel, {
    y: '+=' + (window.innerHeight + 400), opacity: 0,
    duration: 1.0, ease: 'power2.in',
    onComplete: () => { wrapCel.remove(); mostrarTimer() }
  })
}

// ═══════════════════════════════════════════════════════
// TIMER
// ═══════════════════════════════════════════════════════
function mostrarTimer() {
  const wrap = document.createElement('div'); wrap.classList.add('timer-wrap')
  wrap.innerHTML = `
    <div class="timer-label">sua próxima surpresa em</div>
    <div class="timer-display" id="timerDisplay">--:--:--</div>
    <div class="timer-sub">às 11h da manhã 🎁</div>
  `
  document.body.appendChild(wrap)
  gsap.to(wrap, { opacity: 1, duration: 1.0, ease: 'power2.out' })
  iniciarContagem(wrap.querySelector('#timerDisplay'))
}

function iniciarContagem(display) {
  function atualizar() {
    const agora = new Date(), alvo = new Date()
    alvo.setHours(11, 0, 0, 0)
    if (agora >= alvo) alvo.setDate(alvo.getDate() + 1)
    const diff = alvo - agora
    const h = Math.floor(diff / 3600000)
    const m = Math.floor((diff % 3600000) / 60000)
    const s = Math.floor((diff % 60000)  / 1000)
    display.textContent =
      String(h).padStart(2, '0') + ':' +
      String(m).padStart(2, '0') + ':' +
      String(s).padStart(2, '0')
  }
  atualizar(); setInterval(atualizar, 1000)
}