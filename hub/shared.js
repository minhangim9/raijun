(function () {
  'use strict';

  const preferencesKey = 'rj_hub_preferences_v1';
  const inventoryKey = 'rj2_inventory';
  const worlds = [
    {id: 'g', label: 'ㄱ 얼음나라', artwork: 'place-ice'},
    {id: 'n', label: 'ㄴ 홍수나라', artwork: 'place-river'},
    {id: 'd', label: 'ㄷ 동굴나라', artwork: 'place-cave'},
    {id: 'l', label: 'ㄹ 리듬나라', artwork: 'place-rhythm'},
  ];
  const numbersActivities = [
    {id: 'ep1', label: '1화 · 숫자·도형 모험', artwork: 'place-forest'},
    {id: 'space', label: '우주 도형 놀이', artwork: 'place-space'},
    {id: 'playmenu', label: '스티커 놀이', artwork: 'place-stickers'},
    {id: 'shelf', label: '선물 선반', artwork: 'place-gifts'},
  ];
  const stickers = {
    log: ['통나무', '🪵'], ele: ['코끼리', '🐘', 'img/mari.webp'], field: ['밭', '🟫'],
    sprout: ['새싹', '🌱'], berry: ['딸기', '🍓'], share: ['나누기', '🤝'], cart: ['수레', '🛒'],
    goal: ['목표 깃발', '🏁'], planet: ['행성', '🌍'], bridge: ['세모 다리', '🔺'],
    station: ['정거장', '🏠'], compare: ['크기 비교', '⚖️'], boat: ['배', '⛵'],
    p_board: ['스티커 보드', '🖼️'], p_shape: ['같은 모양 잇기', '🔺'],
    p_num: ['숫자와 개수 잇기', '🔢'], p_name: ['도형 이름 잇기', '🔤'],
  };
  const gifts = {
    fig_raijun: ['라이준 피규어', '🎁', 'img/raijun.webp'],
    fig_raa: ['라아 피규어', '🎁', 'img/raa.webp'],
    cert: ['상장', '🏅'], ride_shape_cart: ['도형 수레', '🛒'],
    ride_boat: ['작은 배', '⛵'], key_hatch: ['비밀 문 열쇠', '🗝️'],
  };

  function get(key) {
    try { return localStorage.getItem(key); } catch { return null; }
  }

  function parse(value) {
    try { return JSON.parse(value); } catch { return null; }
  }

  function record(value) {
    return value && typeof value === 'object' && !Array.isArray(value) ? value : {};
  }

  function read(key) { return record(parse(get(key))); }
  function write(key, value) { localStorage.setItem(key, JSON.stringify(value)); }

  function prefs() {
    const stored = read(preferencesKey);
    return {
      sound: typeof stored.sound === 'boolean' ? stored.sound : true,
      vibration: typeof stored.vibration === 'boolean' ? stored.vibration : get('raijun_vib') !== '0',
    };
  }

  function setPrefs(changes) {
    write(preferencesKey, {...read(preferencesKey), ...changes});
  }

  function worldState(id) {
    const index = worlds.findIndex(world => world.id === id);
    if (index < 0) return null;
    const cleared = get('raijun_clear_' + id) === '1';
    return {cleared, unlocked: cleared || index === 0 || get('raijun_clear_' + worlds[index - 1].id) === '1'};
  }

  function numberState(id, inventory) {
    if (record(record(inventory.episodes)[id]).done) return '완료';
    if ((id === 'ep1' && record(record(inventory.episodes).ep1_hatch).seen) ||
        (id === 'space' && Object.hasOwn(record(inventory.stickers), 'boat'))) return '마지막 활동 도달';
    return '완료 기록 없음';
  }

  const art = id => '/lobby-art/' + id + '.webp';

  function imageButton(button, id, label) {
    const image = document.createElement('img');
    image.src = art(id);
    image.alt = '';
    const text = document.createElement('span');
    text.textContent = label;
    button.replaceChildren(image, text);
  }

  function navigation(isPlaying, onLeave, {checkHub = false, setDialogOpen} = {}) {
    const dialog = document.createElement('dialog');
    dialog.className = 'hub-game-dialog';
    const heading = document.createElement('h2');
    heading.id = 'hub-game-dialog-title';
    dialog.setAttribute('aria-labelledby', heading.id);
    const buttons = document.createElement('form');
    buttons.method = 'dialog';
    const secondary = document.createElement('button');
    const primary = document.createElement('button');
    secondary.value = 'cancel';
    primary.value = 'confirm';
    buttons.append(secondary, primary);
    dialog.append(heading, buttons);
    const home = document.createElement('button');
    home.type = 'button';
    home.className = 'hub-game-home';
    imageButton(home, 'home', '통합 홈');
    document.body.append(home, dialog);
    let accept, dismiss;
    buttons.addEventListener('submit', event => {
      event.preventDefault();
      dialog.close();
      if (event.submitter === primary) accept?.();
      else dismiss?.();
    });
    dialog.addEventListener('cancel', () => {
      dismiss?.();
    });
    dialog.addEventListener('close', () => {
      if (!dialog.open) setDialogOpen?.(false);
    });

    function prompt(title, confirmLabel, cancelLabel, onConfirm, onDismiss, focusCancel = false) {
      if (dialog.open) return;
      heading.textContent = title;
      imageButton(primary, confirmLabel === '홈으로 가기' ? 'home' : confirmLabel === '시작' ? 'play' : 'back', confirmLabel);
      secondary.hidden = !cancelLabel;
      imageButton(secondary, 'back', cancelLabel || '');
      dialog.returnValue = '';
      accept = onConfirm;
      dismiss = onDismiss;
      setDialogOpen?.(true);
      dialog.showModal();
      (focusCancel ? secondary : primary).focus();
    }
    const goHome = async () => {
      if (checkHub) {
        home.disabled = true;
        try {
          const response = await fetch('/', {method: 'HEAD', cache: 'no-store', signal: AbortSignal.timeout(2500)});
          if (!response.ok) throw new Error('Home unavailable');
        } catch {
          prompt('통합 홈을 열려면 로컬 서버를 켜 주세요.', '계속하기', null);
          return;
        } finally {
          home.disabled = false;
        }
      }
      onLeave?.();
      location.assign('/');
    };
    home.addEventListener('click', () => {
      if (!isPlaying()) goHome();
      else prompt('통합 홈으로 돌아갈까요?', '홈으로 가기', '계속하기', goHome, null, true);
    });

    return {
      invite(label, begin) {
        const clearSelection = () => {
          const url = new URL(location.href);
          for (const key of ['world', 'stage', 'activity']) url.searchParams.delete(key);
          history.replaceState(history.state, '', url);
        };
        if (!begin) {
          prompt(label, '게임 메뉴', null, clearSelection, clearSelection);
          return;
        }
        prompt(label, '시작', '게임 메뉴', () => {
          clearSelection();
          begin();
        }, clearSelection);
      },
    };
  }

  window.RaijunHub = {
    preferencesKey, inventoryKey, worlds, numbersActivities, stickers, gifts,
    get, parse, record, read, write, prefs, setPrefs, worldState, numberState, art, navigation,
  };
}());
