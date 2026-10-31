'use strict';

const gameData = {racing:{title:'한글 레이싱'},stairs:{title:'한글 계단'},break:{title:'통글자 브레이크'}};
const gameButtons = [...document.querySelectorAll('[data-game]')];
const gamePanel = document.querySelector('#game-panel');
function chooseGame(key, focus = false) {
  const game = gameData[key];
  if (!game) return;
  gameButtons.forEach(button => {
    const active = button.dataset.game === key;
    button.classList.toggle('active', active);
    button.setAttribute('aria-selected', String(active));
    button.tabIndex = active ? 0 : -1;
    if (active && focus) button.focus();
  });
  gamePanel.dataset.theme = key;
  gamePanel.setAttribute('aria-labelledby', `tab-${key}`);
  window.dispatchEvent(new CustomEvent('glim-game-change', {detail:{key,title:game.title}}));
}
gameButtons.forEach(button => button.addEventListener('click', () => chooseGame(button.dataset.game)));

function tabKeyboard(buttons, selector, select, vertical = false) {
  buttons.forEach((button, index) => button.addEventListener('keydown', event => {
    let next;
    if (event.key === 'ArrowRight' || (vertical && event.key === 'ArrowDown')) next = (index + 1) % buttons.length;
    if (event.key === 'ArrowLeft' || (vertical && event.key === 'ArrowUp')) next = (index - 1 + buttons.length) % buttons.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = buttons.length - 1;
    if (next === undefined) return;
    event.preventDefault();
    select(buttons[next].dataset[selector], true);
  }));
}
tabKeyboard(gameButtons, 'game', chooseGame);

const stages = {
  word: {index: '01', caption: '이 그림의 이름은 ‘사과’예요.', markup: '<span class="whole-word">사과</span>'},
  syllable: {index: '02', caption: '‘사’와 ‘과’, 두 글자가 모여요.', markup: '<span class="syllable-tile">사</span><span class="syllable-tile">과</span>'},
  phoneme: {index: '03', caption: '자음과 모음을 하나씩 만나고, 글자로 모아요.', markup: '<div class="jamo-word" role="img" aria-label="사과를 이루는 자음과 모음: 시옷, 아, 기역, 와."><span class="jamo-tile">ㅅ</span><span class="jamo-tile">ㅏ</span><span class="jamo-tile">ㄱ</span><span class="jamo-tile">ㅘ</span></div><span class="jamo-result">ㅅ + ㅏ = 사 &nbsp; · &nbsp; ㄱ + ㅘ = 과</span>'}
};
const stageButtons = [...document.querySelectorAll('[data-stage]')];
const learningPanel = document.querySelector('#learning-panel');
function chooseStage(key, focus = false) {
  const stage = stages[key];
  if (!stage) return;
  stageButtons.forEach(button => {
    const active = button.dataset.stage === key;
    button.classList.toggle('active', active);
    button.setAttribute('aria-selected', String(active));
    button.tabIndex = active ? 0 : -1;
    if (active && focus) button.focus();
  });
  learningPanel.setAttribute('aria-labelledby', `learn-${key}`);
  document.querySelector('#word-display').innerHTML = stage.markup;
  document.querySelector('#demo-step').textContent = `${stage.index} / 03`;
  document.querySelector('#demo-caption').textContent = stage.caption;
  learningPanel.classList.remove('changed');
  requestAnimationFrame(() => learningPanel.classList.add('changed'));
}
stageButtons.forEach(button => button.addEventListener('click', () => chooseStage(button.dataset.stage)));
tabKeyboard(stageButtons, 'stage', chooseStage, true);

const menuToggle = document.querySelector('.menu-toggle');
const mobileNav = document.querySelector('#mobile-nav');
function setMenu(open) {
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.setAttribute('aria-label', open ? '메뉴 닫기' : '메뉴 열기');
  mobileNav.hidden = !open;
}
menuToggle.addEventListener('click', () => setMenu(menuToggle.getAttribute('aria-expanded') !== 'true'));
mobileNav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', event => {if (event.key === 'Escape') setMenu(false);});
const smallScreen = window.matchMedia('(max-width:700px)');
function onScreenChange() {
  if (!smallScreen.matches) setMenu(false);
  document.querySelector('.learning-tabs').setAttribute('aria-orientation', smallScreen.matches ? 'horizontal' : 'vertical');
}
smallScreen.addEventListener('change', onScreenChange);
onScreenChange();

let returnFocus;
function openDialog(dialog, source) {
  returnFocus = source || document.activeElement;
  document.body.classList.add('modal-open');
  dialog.showModal();
}
document.querySelectorAll('dialog').forEach(dialog => {
  dialog.querySelector('[data-close]').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    const rect = dialog.getBoundingClientRect();
    if (event.target === dialog && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) dialog.close();
  });
  dialog.addEventListener('close', () => {
    document.body.classList.remove('modal-open');
    if (returnFocus && typeof returnFocus.focus === 'function') returnFocus.focus({preventScroll:true});
  });
});
document.querySelectorAll('[data-contact]').forEach(button => button.addEventListener('click', () => {
  setMenu(false);
  openDialog(document.querySelector('#contact-dialog'), button);
}));


const email = 'teamglim06@gmail.com';
document.querySelector('#contact-form').addEventListener('submit', event => {
  event.preventDefault();
  const form = event.currentTarget;
  if (!form.reportValidity()) return;
  const type = document.querySelector('#contact-type').value;
  const name = document.querySelector('#contact-name').value.trim();
  const message = document.querySelector('#contact-message').value.trim();
  if (!message) {
    document.querySelector('#contact-message').setCustomValidity('문의 내용을 입력해 주세요.');
    form.reportValidity();
    return;
  }
  const subject = `[글림] ${type}${name ? ` — ${name}` : ''}`;
  const body = `문의 유형: ${type}\n성함/기관명: ${name || '(미입력)'}\n\n${message}`;
  window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  document.querySelector('.contact-status').textContent = '메일 앱에서 내용을 확인하고 보내주세요. 앱이 열리지 않으면 이메일 주소를 복사해 이용해 주세요.';
});
document.querySelector('#contact-message').addEventListener('input', event => event.currentTarget.setCustomValidity(''));
document.querySelector('#copy-email').addEventListener('click', async event => {
  const button = event.currentTarget;
  const status = document.querySelector('.contact-status');
  try {
    if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
    await navigator.clipboard.writeText(email);
    button.textContent = '복사 완료 ✓';
    status.textContent = '이메일 주소를 복사했어요.';
    setTimeout(() => {button.textContent = '주소 복사';}, 2500);
  } catch {
    status.textContent = '주소를 길게 누르거나 선택해서 복사해 주세요: ' + email;
  }
});

if ('IntersectionObserver' in window) {
  const navLinks = [...document.querySelectorAll('.desktop-nav a')];
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      navLinks.forEach(link => {
        if (link.getAttribute('href') === `#${entry.target.id}`) link.setAttribute('aria-current','location');
        else link.removeAttribute('aria-current');
      });
    });
  }, {rootMargin: '-20% 0px -55% 0px', threshold: 0});
  ['top','about','games','learning','ai','together','field','faq'].forEach(id => observer.observe(document.getElementById(id)));
}
