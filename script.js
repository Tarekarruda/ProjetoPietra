'use strict'

/* ════════════════════════════════════════
   GLOBALS
════════════════════════════════════════ */
const vw = () => window.innerWidth
const vh = () => window.innerHeight

let audioCtx     = null
let ringInterval = null
let boxAberta    = false
let cartaAtual   = 0        // próxima carta a soltar
let cartaAtiva   = null     // carta atualmente em zoom
let lineupCards  = []       // cartas no fileiro (em ordem)
let telaCaixaEl  = null
let boxWrapper   = null     // scene element (wrapper da caixa)
let overlay      = null

const CARTAS = [
  { emoji:'💌', frente:'Para você, Pietra',       verso:'Você é incrível e merece\ntudo de bom nessa vida! 💜' },
  { emoji:'🌸', frente:'Feliz Aniversário!',       verso:'Que esse ano seja lindo,\ncheio de alegria e conquistas\npra você 🌸' },
  { emoji:'✨', frente:'Sempre contigo',            verso:'Eu sempre vou torcer pelo\nteu sucesso e a tua vitória,\nde coração ✨' },
  { emoji:'🎂', frente:'Hoje é seu dia!',           verso:'Te desejo tudo de bom\ndo fundo do coração,\nminha princesa 💜' },
  { emoji:'👀', frente:'Ah, e mais uma coisa...', verso:'Esse não é meu último presente...\nTalvez você devesse voltar pra\ncasa às 11h da manhã 👀\nTalvez tenha uma surpresa\nte esperando lá!' },
]

/* ════════════════════════════════════════
   ÁUDIO
════════════════════════════════════════ */
function getCtx() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)()
  return audioCtx
}

function noise(dur) {
  const c = getCtx()
  const b = c.createBuffer(1, Math.ceil(c.sampleRate * dur), c.sampleRate)
  const d = b.getChannelData(0)
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1
  const s = c.createBufferSource(); s.buffer = b; return s
}

function somEnvelope() {
  const c=getCtx(), t=c.currentTime, n=noise(.6), f=c.createBiquadFilter(), g=c.createGain()
  f.type='bandpass'; f.frequency.setValueAtTime(3500,t); f.frequency.exponentialRampToValueAtTime(1200,t+.6); f.Q.value=1.2
  g.gain.setValueAtTime(.001,t); g.gain.linearRampToValueAtTime(.35,t+.05); g.gain.setValueAtTime(.28,t+.2); g.gain.exponentialRampToValueAtTime(.001,t+.6)
  n.connect(f); f.connect(g); g.connect(c.destination); n.start(); n.stop(t+.6)
}

function somAterr() {
  const c=getCtx(), t=c.currentTime
  const o=c.createOscillator(), go=c.createGain()
  o.type='sine'; o.frequency.setValueAtTime(120,t); o.frequency.exponentialRampToValueAtTime(30,t+.25)
  go.gain.setValueAtTime(.7,t); go.gain.exponentialRampToValueAtTime(.001,t+.3)
  o.connect(go); go.connect(c.destination); o.start(); o.stop(t+.3)
  const n=noise(.15), f=c.createBiquadFilter(), gn=c.createGain()
  f.type='lowpass'; f.frequency.value=400
  gn.gain.setValueAtTime(.4,t); gn.gain.exponentialRampToValueAtTime(.001,t+.15)
  n.connect(f); f.connect(gn); gn.connect(c.destination); n.start(); n.stop(t+.15)
}

function somTampa() {
  const c=getCtx(), t=c.currentTime
  const o=c.createOscillator(), fo=c.createBiquadFilter(), go=c.createGain()
  o.type='sawtooth'; o.frequency.setValueAtTime(60,t); o.frequency.linearRampToValueAtTime(38,t+1)
  fo.type='lowpass'; fo.frequency.value=300
  go.gain.setValueAtTime(.001,t); go.gain.linearRampToValueAtTime(.12,t+.1); go.gain.setValueAtTime(.1,t+.8); go.gain.exponentialRampToValueAtTime(.001,t+1.1)
  o.connect(fo); fo.connect(go); go.connect(c.destination); o.start(); o.stop(t+1.1)
  const n=noise(1), fn=c.createBiquadFilter(), gn=c.createGain()
  fn.type='bandpass'; fn.frequency.setValueAtTime(600,t); fn.Q.value=.5
  gn.gain.setValueAtTime(.001,t); gn.gain.linearRampToValueAtTime(.08,t+.15); gn.gain.exponentialRampToValueAtTime(.001,t+1)
  n.connect(fn); fn.connect(gn); gn.connect(c.destination); n.start(); n.stop(t+1)
}

function somCarta() {
  const c=getCtx(), t=c.currentTime, n=noise(.35), f=c.createBiquadFilter(), g=c.createGain()
  f.type='bandpass'; f.frequency.setValueAtTime(2800,t); f.frequency.exponentialRampToValueAtTime(1600,t+.35); f.Q.value=1.5
  g.gain.setValueAtTime(.001,t); g.gain.linearRampToValueAtTime(.22,t+.04); g.gain.setValueAtTime(.18,t+.15); g.gain.exponentialRampToValueAtTime(.001,t+.35)
  n.connect(f); f.connect(g); g.connect(c.destination); n.start(); n.stop(t+.35)
}

function somCelSobe() {
  const c=getCtx(), t=c.currentTime, n=noise(.4), f=c.createBiquadFilter(), g=c.createGain()
  f.type='bandpass'; f.frequency.setValueAtTime(1000,t); f.frequency.exponentialRampToValueAtTime(2200,t+.4); f.Q.value=1
  g.gain.setValueAtTime(.001,t); g.gain.linearRampToValueAtTime(.18,t+.08); g.gain.exponentialRampToValueAtTime(.001,t+.4)
  n.connect(f); f.connect(g); g.connect(c.destination); n.start(); n.stop(t+.4)
}

function somNotif() {
  const c=getCtx(), t=c.currentTime
  function ping(fr,ini,dur) {
    const o=c.createOscillator(), g=c.createGain()
    o.type='sine'; o.frequency.value=fr
    g.gain.setValueAtTime(.001,t+ini); g.gain.linearRampToValueAtTime(.22,t+ini+.012); g.gain.exponentialRampToValueAtTime(.001,t+ini+dur)
    o.connect(g); g.connect(c.destination); o.start(t+ini); o.stop(t+ini+dur)
    const o2=c.createOscillator(), g2=c.createGain()
    o2.type='sine'; o2.frequency.value=fr*2
    g2.gain.setValueAtTime(.001,t+ini); g2.gain.linearRampToValueAtTime(.07,t+ini+.01); g2.gain.exponentialRampToValueAtTime(.001,t+ini+dur*.6)
    o2.connect(g2); g2.connect(c.destination); o2.start(t+ini); o2.stop(t+ini+dur)
  }
  ping(1318,.00,.18); ping(1568,.10,.18); ping(2093,.20,.30)
}

function buzz() {
  const c=getCtx(), t=c.currentTime
  function p(i,d) {
    const o=c.createOscillator(), f=c.createBiquadFilter(), g=c.createGain()
    o.type='square'; o.frequency.value=55; f.type='lowpass'; f.frequency.value=180
    g.gain.setValueAtTime(.001,t+i); g.gain.linearRampToValueAtTime(.35,t+i+.015)
    g.gain.setValueAtTime(.32,t+i+d-.02); g.gain.linearRampToValueAtTime(.001,t+i+d)
    o.connect(f); f.connect(g); g.connect(c.destination); o.start(t+i); o.stop(t+i+d)
  }
  p(0,.12); p(.18,.12); p(.36,.30)
}

function startRing() { buzz(); ringInterval = setInterval(buzz, 1400) }
function stopRing()  { clearInterval(ringInterval); ringInterval = null }

/* ════════════════════════════════════════
   OVERLAY (fundo escuro ao zoomar carta)
════════════════════════════════════════ */
function showOverlay() {
  if (overlay) return
  overlay = document.createElement('div')
  overlay.style.cssText = 'position:fixed;inset:0;background:rgba(5,1,20,.72);z-index:289;'
  gsap.set(overlay, { opacity: 0 })
  document.body.appendChild(overlay)
  gsap.to(overlay, { opacity: 1, duration: .3 })
}

function hideOverlay() {
  if (!overlay) return
  const o = overlay; overlay = null
  gsap.to(o, { opacity: 0, duration: .3, onComplete: () => o.remove() })
}

/* ════════════════════════════════════════
   ENVELOPE
════════════════════════════════════════ */
const envEl  = document.getElementById('envelope')
const telaEnv = document.getElementById('telaEnvelope')

envEl.addEventListener('click', () => { getCtx(); abrirEnvelope() })

function abrirEnvelope() {
  somEnvelope()
  gsap.to(envEl, {
    y: -200, opacity: 0, scale: .8, duration: .8, ease: 'power2.in',
    onComplete: () => { telaEnv.style.display = 'none'; mostrarCaixa() }
  })
}

/* ════════════════════════════════════════
   CAIXA 3D
════════════════════════════════════════ */
function mostrarCaixa() {
  telaCaixaEl = document.createElement('div')
  telaCaixaEl.className = 'tela-caixa'

  const scene = build3DBox()
  telaCaixaEl.appendChild(scene)

  const dica = document.createElement('p')
  dica.id = 'boxDica'
  dica.className = 'box-dica'
  dica.textContent = 'clique na caixa'
  telaCaixaEl.appendChild(dica)

  document.body.appendChild(telaCaixaEl)
  animarQueda(boxWrapper)
}

function build3DBox() {
  const BW = Math.min(220, vw() * .55)
  const BH = Math.min(148, vw() * .38)
  const BD = BW * .68
  const LH = Math.max(18, BH * .14)

  // Scene (perspective)
  const scene = document.createElement('div')
  scene.style.cssText = `perspective:700px;perspective-origin:50% 38%;cursor:pointer;width:${BW}px;position:relative;`
  boxWrapper = scene

  // Box group (ângulo 3D)
  const bg = document.createElement('div')
  bg.style.cssText = `transform-style:preserve-3d;-webkit-transform-style:preserve-3d;transform:rotateX(14deg) rotateY(-24deg);width:${BW}px;height:${BH}px;position:relative;margin-top:${BD*.28}px;`

  // Helper: cria uma face
  function mk(w, h, bgCol, tf, ex = '') {
    const d = document.createElement('div')
    d.style.cssText = `position:absolute;width:${w}px;height:${h}px;background:${bgCol};transform:${tf};backface-visibility:hidden;-webkit-backface-visibility:hidden;${ex}`
    return d
  }

  // ── Face frontal (com fita) ──
  const front = mk(BW, BH, 'linear-gradient(150deg,#6820a8,#4a0e82)', `translateZ(${BD/2}px)`,
    `border:2px solid #9a5fdf;box-shadow:inset 0 0 30px rgba(160,80,255,.15);`)
  const rH = document.createElement('div')
  rH.style.cssText = `position:absolute;width:100%;height:${Math.max(6,BH*.07)}px;background:#e855a0;top:${BH*.44}px;`
  const rV = document.createElement('div')
  rV.style.cssText = `position:absolute;width:${Math.max(5,BW*.054)}px;height:100%;background:#e855a0;left:${BW*.473}px;`
  front.appendChild(rH); front.appendChild(rV)

  // ── Face direita (visível no ângulo) ──
  const right = mk(BD, BH, 'linear-gradient(90deg,#3a0a60,#2e0850)', `rotateY(90deg) translateZ(${BW/2}px)`,
    `left:${(BW-BD)/2}px;border:1px solid #6a3fa0;`)
  const rrV = document.createElement('div')
  rrV.style.cssText = `position:absolute;width:${Math.max(5,BD*.08)}px;height:100%;background:#c8408a;left:${BD*.47}px;`
  right.appendChild(rrV)

  const left_  = mk(BD, BH, '#2e0850',  `rotateY(-90deg) translateZ(${BW/2}px)`,    `left:${(BW-BD)/2}px;`)
  const back_  = mk(BW, BH, '#380a70',  `rotateY(180deg) translateZ(${BD/2}px)`)
  const bot    = mk(BW, BD, '#1e0540',  `rotateX(-90deg) translateZ(${BH/2}px)`,    `top:${(BH-BD)/2}px;border:1px solid #4a2080;`)
  const topInner = mk(BW, BD, '#120330', `rotateX(90deg) translateZ(${-BH/2}px)`,  `top:${(BH-BD)/2}px;`)

  bg.appendChild(back_); bg.appendChild(left_); bg.appendChild(bot); bg.appendChild(topInner)
  bg.appendChild(front); bg.appendChild(right)

  // ── Tampa ──
  const lid = document.createElement('div')
  lid.style.cssText = `position:absolute;top:${-LH}px;left:-6px;width:${BW+12}px;height:${LH}px;transform-style:preserve-3d;-webkit-transform-style:preserve-3d;transform-origin:50% 100%;pointer-events:none;`

  const lF   = mk(BW+12, LH, 'linear-gradient(180deg,#8830c8,#5a10a0)', `translateZ(${BD/2+5}px)`,      `border:2px solid #c080f0;border-radius:6px 6px 0 0;`)
  const lR   = mk(BD+10, LH, '#4e18a0', `rotateY(90deg) translateZ(${(BW+12)/2}px)`,                   `left:${((BW+12)-(BD+10))/2}px;border:1px solid #8050c0;`)
  const lL   = mk(BD+10, LH, '#4a1490', `rotateY(-90deg) translateZ(${(BW+12)/2}px)`,                  `left:${((BW+12)-(BD+10))/2}px;`)
  const lB   = mk(BW+12, LH, '#3a0870', `rotateY(180deg) translateZ(${BD/2+5}px)`)
  const lTop = mk(BW+12, BD+10, 'linear-gradient(135deg,#9040d0,#7020b0)', `rotateX(90deg) translateZ(${LH}px)`,
    `top:${-(BD+10)/2+(LH/2)}px;left:-6px;border:1.5px solid #c080f0;border-radius:4px;`)

  // Fita na tampa
  const ltRH = document.createElement('div')
  ltRH.style.cssText = `position:absolute;width:100%;height:${Math.max(4,(BD+10)*.1)}px;background:#ff70c0;top:${(BD+10)*.44}px;`
  const ltRV = document.createElement('div')
  ltRV.style.cssText = `position:absolute;width:${Math.max(4,(BW+12)*.05)}px;height:100%;background:#ff70c0;left:${(BW+12)*.473}px;`
  const bow = document.createElement('div')
  bow.style.cssText = `position:absolute;width:100%;text-align:center;top:30%;font-size:${Math.max(14,BW*.09)}px;`
  bow.textContent = '🎀'
  lTop.appendChild(ltRH); lTop.appendChild(ltRV); lTop.appendChild(bow)

  // Fita na face frontal da tampa
  const lRibH = document.createElement('div')
  lRibH.style.cssText = `position:absolute;width:100%;height:3px;background:#ff70c0;bottom:0;`
  const bowF = document.createElement('div')
  bowF.style.cssText = `position:absolute;width:100%;text-align:center;top:50%;transform:translateY(-50%);font-size:${Math.max(12,LH*.6)}px;`
  bowF.textContent = '🎀'
  lF.appendChild(lRibH); lF.appendChild(bowF)

  lid.appendChild(lB); lid.appendChild(lL); lid.appendChild(lR); lid.appendChild(lTop); lid.appendChild(lF)

  // Guarda referências
  bg._lid  = lid
  bg._dims = { BW, BH, BD, LH }
  scene._bg = bg

  bg.appendChild(lid)
  scene.appendChild(bg)

  scene.addEventListener('click', () => onBoxClick(scene))
  return scene
}

/* ── Animação de queda da caixa ── */
function animarQueda(scene) {
  const bg   = scene._bg
  const dims = bg ? bg._dims : { BH: 120 }
  const BH   = dims.BH

  gsap.set(scene, { y: -vh() * 1.15, rotateZ: 14, opacity: 0 })

  gsap.timeline()
    .to(scene, { opacity: 1, duration: .08 })
    .to(scene, { y: 8, rotateZ: 0, duration: .72, ease: 'power3.in' })
    .to(scene, { scaleY: .78, scaleX: 1.16, duration: .065, ease: 'power1.out' })
    .to(scene, { scaleY: 1, scaleX: 1, y: -BH * .28, duration: .22, ease: 'power2.out' })
    .to(scene, { y: 4, duration: .18, ease: 'power2.in' })
    .to(scene, { scaleY: .93, scaleX: 1.06, duration: .05 })
    .to(scene, { scaleY: 1, scaleX: 1, y: 0, duration: .18, ease: 'power1.out',
        onComplete: () => somAterr() })
}

/* ════════════════════════════════════════
   CLIQUE NA CAIXA
════════════════════════════════════════ */
function onBoxClick(scene) {
  if (cartaAtiva) return

  const bg  = scene._bg
  const lid = bg ? bg._lid : null

  // Primeiro clique: abre a tampa
  if (!boxAberta) {
    boxAberta = true
    somTampa()
    if (lid) gsap.to(lid, { rotateX: -122, duration: 1.1, ease: 'back.out(1.1)' })
    setTimeout(() => {
      const d = document.getElementById('boxDica')
      if (d) d.textContent = 'clique para pegar uma carta'
    }, 800)
    return
  }

  if (cartaAtual >= CARTAS.length) return

  // Solta a próxima carta
  const idx = cartaAtual++
  liberarCarta(CARTAS[idx], idx)

  const d = document.getElementById('boxDica')
  if (d) {
    const rem = CARTAS.length - cartaAtual
    d.textContent = rem > 0 ? `mais ${rem} carta${rem > 1 ? 's' : ''}` : '✦'
  }
}

/* ════════════════════════════════════════
   DIMENSÕES DAS CARTAS
════════════════════════════════════════ */
function cardDims() {
  const w = Math.min(268, vw() * .82)
  return { w, h: w * 1.5 }
}

function lineupPos(slot) {
  const total  = CARTAS.length
  const gap    = Math.min(8, vw() * .016)
  const cw     = Math.min(66, (vw() - 28 - gap * (total - 1)) / total)
  const ch     = cw * 1.5
  const totalW = total * cw + (total - 1) * gap
  const x      = (vw() - totalW) / 2 + slot * (cw + gap)
  const y      = vh() - ch - 14
  return { x, y, w: cw, h: ch }
}

/* ════════════════════════════════════════
   CONSTRUIR CARTA
════════════════════════════════════════ */
function buildCard(carta, index) {
  const { w: CW, h: CH } = cardDims()

  const el = document.createElement('div')
  el.className = 'card'
  el.style.cssText = `width:${CW}px;height:${CH}px;z-index:300;`
  el.dataset.state = 'front'
  el.dataset.index = index

  // Frente
  const front = document.createElement('div')
  front.className = 'card-face card-front'
  front.innerHTML = `
    <div class="card-corner tl">${carta.emoji}</div>
    <div class="card-corner br">${carta.emoji}</div>
    <div style="font-size:${CW*.17}px;margin-bottom:10px;">${carta.emoji}</div>
    <div style="font-size:${Math.max(13,CW*.088)}px;color:#e0d0ff;text-align:center;padding:0 12px;line-height:1.5;">${carta.frente}</div>
    <div class="card-hint" style="font-size:${Math.max(9,CW*.058)}px;color:#5a3a8a;margin-top:auto;letter-spacing:.1em;text-transform:uppercase;opacity:0;transition:opacity .3s;"></div>
  `

  // Verso
  const back = document.createElement('div')
  back.className = 'card-face card-back'
  back.innerHTML = `
    <div class="card-corner tl">✦</div>
    <div class="card-corner br">✦</div>
    <div style="font-size:${Math.max(10,CW*.072)}px;color:#c9a7f5;text-align:center;white-space:pre-line;line-height:1.7;padding:0 10px;">${carta.verso}</div>
    <div class="back-hint" style="font-size:${Math.max(9,CW*.058)}px;color:#5a3a8a;margin-top:auto;letter-spacing:.1em;text-transform:uppercase;">toque para guardar</div>
  `

  el.appendChild(front)
  el.appendChild(back)
  return el
}

/* ════════════════════════════════════════
   SOLTAR CARTA (zoom da caixa para centro)
════════════════════════════════════════ */
function liberarCarta(carta, index) {
  const el = buildCard(carta, index)
  document.body.appendChild(el)
  cartaAtiva = el
  showOverlay()

  const { w: CW, h: CH } = cardDims()
  const rect = boxWrapper.getBoundingClientRect()
  const bCx  = rect.left + rect.width  / 2
  const bCy  = rect.top  + rect.height / 2

  gsap.set(el, {
    position: 'fixed',
    left: bCx - CW / 2, top: bCy - CH / 2,
    scale: .06, opacity: 0, rotateY: -30, rotateZ: 8
  })

  somCarta()
  gsap.to(el, {
    left: vw() / 2 - CW / 2,
    top:  vh() / 2 - CH / 2,
    scale: 1, opacity: 1, rotateY: 0, rotateZ: 0,
    duration: .8, ease: 'back.out(1.4)',
    onComplete: () => {
      const hint = el.querySelector('.card-hint')
      if (hint) { hint.textContent = 'toque para virar'; hint.style.opacity = '1' }
    }
  })

  el.onclick = () => onCartaClick(el, index, false)
}

/* ════════════════════════════════════════
   CLIQUE NA CARTA (virar / guardar)
════════════════════════════════════════ */
function onCartaClick(el, index, fromLineup) {
  const state = el.dataset.state
  if (state === 'flipping' || state === 'moving') return

  if (state === 'front') {
    // Vira para o verso
    el.dataset.state = 'flipping'
    gsap.to(el, {
      rotateY: 180, duration: .55, ease: 'power2.inOut',
      onComplete: () => { el.dataset.state = 'back' }
    })

  } else if (state === 'back') {
    // Manda para o fileiro ou retorna
    el.dataset.state = 'moving'
    cartaAtiva = null
    hideOverlay()

    if (fromLineup) {
      retornarFileira(el, index)
    } else {
      enviarFileira(el, index)
    }
  }
}

/* ════════════════════════════════════════
   FILEIRO DE CARTAS
════════════════════════════════════════ */
function enviarFileira(el, index) {
  const slot = lineupCards.length
  el.dataset.slot = slot
  lineupCards.push(el)

  const pos = lineupPos(slot)

  gsap.to(el, {
    left: pos.x, top: pos.y,
    width: pos.w, height: pos.h,
    rotateY: 0, rotateZ: 0, scale: 1,
    zIndex: 30 + slot,
    duration: .7, ease: 'back.out(1.3)',
    onComplete: () => {
      el.dataset.state = 'lined'
      el.onclick = () => onLineupClick(el, index)

      // Reposiciona as cartas já no fileiro (caso dimensão tela tenha mudado)
      lineupCards.forEach((c, s) => {
        if (c !== el) {
          const p = lineupPos(s)
          gsap.to(c, { left: p.x, top: p.y, width: p.w, height: p.h, duration: .4, ease: 'power2.out' })
        }
      })

      // Todas as cartas no fileiro → mostra celular
      if (lineupCards.length === CARTAS.length) {
        setTimeout(() => mostrarCelular(telaCaixaEl), 900)
      }
    }
  })
}

function retornarFileira(el, index) {
  const slot = parseInt(el.dataset.slot)
  const pos  = lineupPos(slot)

  gsap.to(el, {
    left: pos.x, top: pos.y,
    width: pos.w, height: pos.h,
    rotateY: 0, rotateZ: 0, scale: 1,
    zIndex: 30 + slot,
    duration: .5, ease: 'power2.inOut',
    onComplete: () => {
      el.dataset.state = 'lined'
      el.onclick = () => onLineupClick(el, index)
    }
  })
}

/* ── Clique em carta no fileiro ── */
function onLineupClick(el, index) {
  if (cartaAtiva) return

  cartaAtiva = el
  showOverlay()

  // Traz esta carta para cima, as outras ficam na ordem normal
  lineupCards.forEach((c, i) => {
    gsap.set(c, { zIndex: c === el ? 100 : 30 + i })
  })

  const { w: CW, h: CH } = cardDims()

  // Sempre mostra a frente primeiro
  gsap.set(el, { rotateY: 0 })
  el.dataset.state = 'front'

  const hint = el.querySelector('.card-hint')
  if (hint) { hint.textContent = 'toque para virar'; hint.style.opacity = '1' }
  const bh = el.querySelector('.back-hint')
  if (bh) bh.textContent = 'toque para fechar'

  gsap.to(el, {
    left: vw() / 2 - CW / 2,
    top:  vh() / 2 - CH / 2,
    width: CW, height: CH,
    zIndex: 300,
    duration: .5, ease: 'back.out(1.4)'
  })

  el.onclick = () => onCartaClick(el, index, true)
}

/* ════════════════════════════════════════
   CELULAR
════════════════════════════════════════ */
function mostrarCelular(telaCaixa) {
  const wrapCel = document.createElement('div'); wrapCel.className = 'celular-wrapper'
  const cel     = document.createElement('div'); cel.className     = 'celular'
  const sp      = document.createElement('div'); sp.className      = 'celular-speaker'
  const ca      = document.createElement('div'); ca.className      = 'celular-camera'
  const tela    = document.createElement('div'); tela.className    = 'celular-tela'
  const hm      = document.createElement('div'); hm.className      = 'celular-home'
  const v1      = document.createElement('div'); v1.className      = 'celular-botao-vol um'
  const v2      = document.createElement('div'); v2.className      = 'celular-botao-vol dois'
  const pw      = document.createElement('div'); pw.className      = 'celular-botao-power'

  const efz = Math.min(2, vw() * .05) + 'rem'
  const tfz = Math.min(.58, vw() * .014) + 'rem'
  const nfz = Math.min(.65, vw() * .016) + 'rem'

  tela.innerHTML = `
    <div style="font-size:${efz};animation:notifPulse 1.8s ease-in-out infinite">💌</div>
    <div style="font-size:${tfz};color:#9a6fd5;margin-top:6px;letter-spacing:.05em;animation:notifPulse 1.8s ease-in-out infinite .3s">mensagem nova</div>
    <div style="font-size:${nfz};color:#c9a7f5;margin-top:3px;animation:notifPulse 1.8s ease-in-out infinite .6s">Tarek 💌</div>
  `

  cel.appendChild(sp); cel.appendChild(ca); cel.appendChild(tela)
  cel.appendChild(hm); cel.appendChild(v1); cel.appendChild(v2); cel.appendChild(pw)
  wrapCel.appendChild(cel)

  // Posição fixa, abaixo do fileiro e acima das cartas
  wrapCel.style.position  = 'fixed'
  wrapCel.style.bottom    = '120px'
  wrapCel.style.left      = '50%'
  wrapCel.style.transform = 'translateX(-50%)'
  wrapCel.style.zIndex    = '150'
  document.body.appendChild(wrapCel)

  somCelSobe()
  gsap.fromTo(wrapCel, { y: 300, opacity: 0 }, {
    y: 0, opacity: 1, duration: 1.2, ease: 'back.out(1.7)',
    onComplete: () => iniciarVibracao(wrapCel, tela)
  })
}

function iniciarVibracao(wrapCel, tela) {
  const telaTween = gsap.to(tela, { backgroundColor: '#2a0850', repeat: -1, yoyo: true, duration: .5, ease: 'sine.inOut' })

  const vibTl = gsap.timeline({ repeat: -1, repeatDelay: .8 })
  vibTl
    .to(wrapCel, { x:  5, rotation:  1.5, duration: .05, ease: 'none' })
    .to(wrapCel, { x: -5, rotation: -1.5, duration: .05, ease: 'none' })
    .to(wrapCel, { x:  4, rotation:  1.2, duration: .05, ease: 'none' })
    .to(wrapCel, { x: -4, rotation: -1.2, duration: .05, ease: 'none' })
    .to(wrapCel, { x:  2, rotation:   .6, duration: .05, ease: 'none' })
    .to(wrapCel, { x:  0, rotation:    0, duration: .07, ease: 'none' })

  startRing()
  if (navigator.vibrate) navigator.vibrate([120, 80, 120, 80, 300])

  wrapCel.style.cursor = 'pointer'
  wrapCel.addEventListener('click', () => {
    vibTl.kill(); telaTween.kill(); stopRing()
    gsap.killTweensOf(tela); tela.style.backgroundColor = ''
    wrapCel.style.cursor = 'default'
    zoomCelular(wrapCel, tela)
  }, { once: true })
}

function zoomCelular(wrapCel, tela) {
  const rect = wrapCel.getBoundingClientRect()
  const celW = Math.min(180, vw() * .32)
  const celH = Math.min(340, vw() * .60)

  wrapCel.style.position  = 'fixed'
  wrapCel.style.left      = rect.left + 'px'
  wrapCel.style.top       = rect.top  + 'px'
  wrapCel.style.bottom    = ''
  wrapCel.style.transform = 'none'
  wrapCel.style.zIndex    = '500'

  const scale   = Math.min((vh() * .9) / celH, (vw() * .92) / celW, 2.4)
  const targetX = (vw() / 2) - (rect.left + celW / 2)
  const targetY = (vh() / 2) - (rect.top  + celH / 2)

  gsap.to(wrapCel, {
    x: targetX, y: targetY, scale: scale, duration: .7, ease: 'power2.out',
    onComplete: () => mostrarLockscreen(tela, wrapCel)
  })
}

/* ════════════════════════════════════════
   LOCKSCREEN
════════════════════════════════════════ */
function mostrarLockscreen(tela, wrapCel) {
  tela.innerHTML = ''; tela.style.position = 'relative'
  tela.style.overflow = 'hidden'; tela.style.padding = '0'

  const lock  = document.createElement('div'); lock.className  = 'lockscreen'
  const topo  = document.createElement('div'); topo.className  = 'lock-topo'
  const horaEl = document.createElement('div'); horaEl.className = 'lock-hora'
  const dataEl = document.createElement('div'); dataEl.className = 'lock-data'
  topo.appendChild(horaEl); topo.appendChild(dataEl)

  const notif = document.createElement('div'); notif.className = 'lock-notif'
  notif.innerHTML = `
    <div class="lock-notif-icon">💌</div>
    <div class="lock-notif-body">
      <div class="lock-notif-app">Mensagens</div>
      <div class="lock-notif-msg">Tarek: Oiii...</div>
    </div>
  `

  const base    = document.createElement('div'); base.className    = 'lock-base'
  const bolinha = document.createElement('div'); bolinha.className = 'lock-bolinha'
  const deslize = document.createElement('div'); deslize.className = 'lock-deslize'
  deslize.textContent = 'toque para desbloquear'
  base.appendChild(bolinha); base.appendChild(deslize)

  lock.appendChild(topo); lock.appendChild(notif); lock.appendChild(base)
  tela.appendChild(lock)

  function updHora() {
    const n = new Date()
    horaEl.textContent = String(n.getHours()).padStart(2,'0') + ':' + String(n.getMinutes()).padStart(2,'0')
    const dias  = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb']
    const meses = ['jan','fev','mar','abr','mai','jun','jul','ago','set','out','nov','dez']
    dataEl.textContent = dias[n.getDay()] + ', ' + n.getDate() + ' de ' + meses[n.getMonth()]
  }
  updHora()
  const ci = setInterval(updHora, 1000)

  const chatApp = buildChatApp()
  tela.appendChild(chatApp)

  lock.addEventListener('click', () => {
    clearInterval(ci)
    desbloquear(lock, chatApp, tela, wrapCel)
  })
}

/* ════════════════════════════════════════
   CHAT
════════════════════════════════════════ */
function buildChatApp() {
  const app = document.createElement('div'); app.className = 'chat-app'
  const hdr = document.createElement('div'); hdr.className = 'chat-header'
  hdr.innerHTML = `
    <div class="chat-voltar">‹</div>
    <div class="chat-avatar">TK</div>
    <div class="chat-info">
      <div class="chat-nome">Tarek</div>
      <div class="chat-status">online</div>
    </div>
  `
  const msgs = document.createElement('div'); msgs.className = 'chat-msgs'
  const bot  = document.createElement('div'); bot.className  = 'chat-bottom'
  bot.innerHTML = '<div class="input-fake">Mensagem</div>'
  app.appendChild(hdr); app.appendChild(msgs); app.appendChild(bot)
  return app
}

function desbloquear(lock, chatApp, tela, wrapCel) {
  gsap.to(lock, { y: '-100%', opacity: 0, duration: .45, ease: 'power2.in', onComplete: () => lock.remove() })
  setTimeout(() => {
    chatApp.classList.add('aberto')
    iniciarConversa(chatApp.querySelector('.chat-msgs'), chatApp, wrapCel)
  }, 200)
}

const esperar = ms => new Promise(r => setTimeout(r, ms))

function criarDigitando(c) {
  const el = document.createElement('div'); el.className = 'digitando'
  el.innerHTML = '<span></span><span></span><span></span>'
  c.appendChild(el); c.scrollTop = c.scrollHeight; return el
}

function addMsg(c, texto) {
  const el = document.createElement('div'); el.className = 'msg recebida'
  el.textContent = texto; c.appendChild(el); c.scrollTop = c.scrollHeight; somNotif()
}

async function iniciarConversa(msgs, chatApp, wrapCel) {
  const TY = 2200
  async function send(txt, del) {
    await esperar(del)
    const d = criarDigitando(msgs)
    await esperar(TY); d.remove(); addMsg(msgs, txt)
  }
  await send('Oiii', 700)
  await send('Hoje é um dia muito especial e eu não poderia deixar de fazer algo especial, para uma pessoa muito especial para mim', 2000)
  await send('Voce é uma pessoa incrível e merece tudo de bom e melhor nessa vida', 2000)
  await send('Eu sempre vou torcer pelo teu sucesso e a tua vitória, te desejo tudo de bom minha princesa,', 2000)
  await send('Ah e antes que eu me esqueça, esse não é meu ultimo presente, talvez vc devesse voltar para a casa as 11 horas da manhã, talvez tenha outra surpresa te esperando lá 👀', 5000)
  await esperar(800)

  const hint = document.createElement('div'); hint.className = 'fechar-hint'
  hint.textContent = 'toque para fechar'
  chatApp.appendChild(hint)
  const cel = wrapCel.querySelector('.celular'); cel.style.cursor = 'pointer'
  cel.addEventListener('click', () => { hint.remove(); cel.style.cursor = 'default'; fecharCelular(wrapCel) }, { once: true })
}

function fecharCelular(wrapCel) {
  gsap.to(wrapCel, {
    y: '+=' + (vh() + 400), opacity: 0, duration: 1, ease: 'power2.in',
    onComplete: () => { wrapCel.remove(); mostrarTimer() }
  })
}

/* ════════════════════════════════════════
   TIMER
════════════════════════════════════════ */
function mostrarTimer() {
  const w = document.createElement('div'); w.className = 'timer-wrap'
  w.innerHTML = `
    <div class="timer-label">sua próxima surpresa em</div>
    <div class="timer-display" id="timerD">--:--:--</div>
    <div class="timer-sub">às 11h da manhã 🎁</div>
  `
  document.body.appendChild(w)
  gsap.to(w, { opacity: 1, duration: 1, ease: 'power2.out' })

  const disp = w.querySelector('#timerD')
  function tick() {
    const n = new Date(), a = new Date()
    a.setHours(11, 0, 0, 0); if (n >= a) a.setDate(a.getDate() + 1)
    const d = a - n
    const h = Math.floor(d / 3600000)
    const m = Math.floor((d % 3600000) / 60000)
    const s = Math.floor((d % 60000) / 1000)
    disp.textContent = String(h).padStart(2,'0') + ':' + String(m).padStart(2,'0') + ':' + String(s).padStart(2,'0')
  }
  tick(); setInterval(tick, 1000)
}
