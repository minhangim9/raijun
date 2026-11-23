(function () {
  'use strict';

  const hub = window.RaijunHub;
  const cards = window.RaijunHangulCards;
  const legacyOrigin = 'http://127.0.0.1:8081';
  const $ = id => document.getElementById(id);
  const element = (tag, text, className) => {
    const node = document.createElement(tag);
    if (text) node.textContent = text;
    if (className) node.className = className;
    return node;
  };

  function activity({label, artwork}, url, status = '') {
    const node = element(url ? 'a' : 'div', '', 'location');
    if (url) node.href = url;
    else node.setAttribute('aria-disabled', 'true');
    node.append(picture(hub.art(artwork)));
    if (!url) {
      const lock = picture(hub.art('lock'));
      lock.className = 'lock';
      node.append(lock);
    }
    node.append(element('span', label));
    if (status) node.append(element('small', status));
    return node;
  }

  function progress(label, state) {
    const entry = element('p');
    entry.append(element('span', label), element('strong', state));
    return entry;
  }

  function count(value) {
    return Number.isSafeInteger(value) && value > 0 ? value : 0;
  }

  function picture(file) {
    const image = element('img');
    image.src = file;
    image.alt = '';
    image.loading = 'lazy';
    return image;
  }

  function collection(container, entries, emptyText) {
    container.replaceChildren(...(entries.length ? entries : [element('p', emptyText, 'empty')]));
  }

  function earned(catalog, stored, kind) {
    return Object.entries(catalog).filter(([id]) => Object.hasOwn(stored, id)).map(([id, [label]]) => {
      const card = element('article', '', 'collectible');
      card.append(picture(hub.art(kind + '-' + id)), element('strong', label));
      const got = validDate(hub.record(stored[id]).got);
      if (got) card.append(element('p', got.slice(0, 10)));
      return card;
    });
  }

  function render() {
    const inventory = hub.read(hub.inventoryKey);
    const numbersProgress = hub.numbersActivities.slice(0, 2);
    const worlds = hub.worlds.map((world, index) => ({
      ...world, ...hub.worldState(world.id), prerequisite: hub.worlds[index - 1]?.label,
    }));
    $('hangul-activities').replaceChildren(
      ...worlds.map(world => activity(world, world.unlocked ? '/hangul/?world=' + world.id : null,
        world.cleared ? '완료' : world.unlocked ? '' : world.prerequisite + ' 먼저')),
      activity({label: '한글 미니게임', artwork: 'place-minigames'}, '/hangul/?activity=minigames'),
    );
    $('numbers-activities').replaceChildren(...hub.numbersActivities.map(item => (
      activity(item, '/numbers/?activity=' + item.id,
        hub.numberState(item.id, inventory) === '완료' ? '완료' : '')
    )));
    $('hangul-progress').replaceChildren(...worlds.map(world => progress(world.label,
      world.cleared ? '완료' : world.unlocked ? '열림' : '잠김')));
    $('numbers-progress').replaceChildren(...numbersProgress.map(item => progress(item.label, hub.numberState(item.id, inventory))));
    const balances = ['빛의 구슬', '반짝 조각', '티켓'].map((label, index) =>
      label + ' ' + count(hub.parse(hub.get(['raijun_beads', 'raijun_shards', 'raijun_tickets'][index]))));
    $('hangul-balances').textContent = balances.join(' · ');

    const owned = hub.read('raijun_cards');
    const collected = cards.filter(card => count(owned[card.id])).map(card => {
      const node = element('article', '', 'collectible');
      node.append(picture('/hangul/' + card.image), element('strong', card.name + ' ×' + count(owned[card.id])),
        element('p', card.letter + ' · ' + card.fact));
      return node;
    });
    const stickers = earned(hub.stickers, hub.record(inventory.stickers), 'sticker');
    const gifts = earned(hub.gifts, {...hub.record(inventory.items), ...hub.record(inventory.rides)}, 'gift');
    $('card-title').textContent = '도감 카드 ' + collected.length + '/' + cards.length;
    $('sticker-title').textContent = '스티커 ' + stickers.length + '/' + Object.keys(hub.stickers).length;
    $('gift-title').textContent = '선물·탈것 ' + gifts.length + '/' + Object.keys(hub.gifts).length;
    collection($('cards'), collected, '모은 도감 카드가 없어요.');
    collection($('stickers'), stickers, '모은 스티커가 없어요.');
    collection($('gifts'), gifts, '받은 선물이나 탈것이 없어요.');
    const preferences = hub.prefs();
    for (const key of ['sound', 'vibration']) {
      const button = $(key);
      button.setAttribute('aria-pressed', preferences[key]);
      button.querySelector('img').src = hub.art(key + (preferences[key] ? '-on' : '-off'));
    }
  }

  function validDate(value) {
    return typeof value === 'string' && /^\d{4}-\d\d-\d\dT[\d:.]+Z$/.test(value) ? value : '';
  }

  function trustedArtwork(source) {
    if (typeof source !== 'string' || !source || source.length > 12000) return '';
    if (!/[<>]/.test(source)) return source.replaceAll('&', '&amp;');
    if (source === '<img src="img/mari.webp" alt="">') return source;
    if (source === '<div class="log3d" style="position:relative;display:inline-block;width:60px;height:24px"></div>') return source;
    const template = element('template');
    template.innerHTML = source;
    const svg = template.content.firstElementChild;
    if (template.content.childNodes.length !== 1 || svg?.localName !== 'svg' ||
        svg.namespaceURI !== 'http://www.w3.org/2000/svg') return '';
    const allowedTags = new Set(['svg', 'g', 'path', 'rect', 'circle', 'ellipse', 'line', 'polygon', 'polyline']);
    const allowedAttrs = new Set(['viewBox', 'width', 'height', 'x', 'y', 'x1', 'x2', 'y1', 'y2', 'cx', 'cy', 'r', 'rx', 'ry',
      'd', 'points', 'fill', 'stroke', 'stroke-width', 'stroke-linejoin', 'stroke-linecap', 'opacity', 'transform']);
    for (const node of [svg, ...svg.querySelectorAll('*')]) {
      if (node.namespaceURI !== svg.namespaceURI || !allowedTags.has(node.localName)) return '';
      for (const attr of [...node.attributes]) {
        if (!allowedAttrs.has(attr.name) || /url\s*\(|[<>]/i.test(attr.value)) node.removeAttributeNode(attr);
      }
    }
    return svg.outerHTML;
  }

  function importSave(payload) {
    const old = hub.record(hub.parse(payload.inventory));
    const legacySettings = hub.record(hub.parse(payload.settings));
    const hasInventory = old.schema === 1;
    const hasSettings = Object.keys(legacySettings).length > 0;
    if (!hasInventory && !hasSettings) {
      return payload.inventory || payload.settings ? '기존 기록을 읽을 수 없어요.' : '가져올 기록이 없어요.';
    }

    if (hasInventory) {
      const current = hub.read(hub.inventoryKey);
      const importedStickers = {};
      for (const [id, [label, icon]] of Object.entries(hub.stickers)) {
        if (!Object.hasOwn(hub.record(old.stickers), id)) continue;
        const entry = hub.record(old.stickers[id]);
        importedStickers[id] = {got: validDate(entry.got), icon: trustedArtwork(entry.icon) || icon};
      }
      const mergeRewards = (kind, keys) => ({
        ...Object.fromEntries(keys.filter(id => Object.hasOwn(hub.record(old[kind]), id)).map(id => [
          id, {got: validDate(hub.record(old[kind][id]).got), usable_in: 'next_episodes'},
        ])), ...hub.record(current[kind]),
      });
      const importedEpisodes = {};
      for (const key of ['ep1', 'space']) {
        const done = validDate(hub.record(hub.record(old.episodes)[key]).done);
        if (done) importedEpisodes[key] = {done};
      }
      const seen = validDate(hub.record(hub.record(old.episodes).ep1_hatch).seen);
      if (seen) importedEpisodes.ep1_hatch = {seen, state: 'locked', needs: 'key_hatch'};
      const oldBoard = Array.isArray(old.board) ? old.board.slice(-24).flatMap(value => {
        const item = hub.record(value);
        const icon = trustedArtwork(item.icon);
        return icon && Number.isFinite(item.x) && Number.isFinite(item.y) ? [{icon, x: item.x, y: item.y}] : [];
      }) : [];
      hub.write(hub.inventoryKey, {
        schema: 1,
        stickers: {...importedStickers, ...hub.record(current.stickers)},
        items: mergeRewards('items', ['fig_raijun', 'fig_raa', 'cert', 'key_hatch']),
        rides: mergeRewards('rides', ['ride_shape_cart', 'ride_boat']),
        episodes: {...importedEpisodes, ...hub.record(current.episodes)},
        board: Array.isArray(current.board) && current.board.length ? current.board : oldBoard,
        updated: new Date().toISOString(),
      });
    }
    const preferences = hub.read(hub.preferencesKey);
    const changes = {};
    if (typeof preferences.sound !== 'boolean' && typeof legacySettings.snd === 'boolean') changes.sound = legacySettings.snd;
    if (typeof preferences.vibration !== 'boolean' && hub.get('raijun_vib') === null && typeof legacySettings.vib === 'boolean') {
      changes.vibration = legacySettings.vib;
    }
    if (Object.keys(changes).length) hub.setPrefs(changes);
    const settings = hub.read('rj2_set');
    if (!settings.lang && ['ko', 'en', 'es', 'zh', 'fr'].includes(legacySettings.lang)) {
      hub.write('rj2_set', {...settings, lang: legacySettings.lang});
    }
    return payload.inventory && !hasInventory ? '설정을 가져왔어요. 기존 수집 기록은 읽을 수 없어요.' : '기존 기록을 가져왔어요.';
  }

  $('import').addEventListener('click', () => {
    const frame = element('iframe');
    frame.hidden = true;
    frame.title = '기존 라이준 기록';
    frame.setAttribute('sandbox', 'allow-scripts allow-same-origin');
    frame.src = legacyOrigin + '/transfer.html';
    $('import').disabled = true;
    $('import-message').textContent = '기록을 확인하고 있어요…';
    const timeout = setTimeout(() => finish('8081에 연결할 수 없어요. 로컬 서버를 확인하고 다시 시도해 주세요.'), 5000);
    function finish(message) {
      clearTimeout(timeout);
      removeEventListener('message', receive);
      frame.remove();
      $('import-message').textContent = message;
      $('import').disabled = false;
      render();
    }
    function receive(event) {
      if (event.origin !== legacyOrigin || event.source !== frame.contentWindow ||
          event.data?.type !== 'raijun:legacy-save') return;
      try { finish(event.data.unavailable ? '브라우저에서 기존 기록을 열 수 없어요.' : importSave(event.data)); }
      catch { finish('가져온 기록을 저장할 수 없어요. 다시 시도해 주세요.'); }
    }
    addEventListener('message', receive);
    frame.addEventListener('load', () => frame.contentWindow.postMessage({type: 'raijun:request-legacy-save'}, legacyOrigin));
    document.body.append(frame);
  });
  function showMap(focus = false) {
    const maps = {'#hangul-map': ['hangul', '한글 탐험 지도'], '#numbers-map': ['numbers', '숫자·도형 모험 지도']};
    const [map, title] = maps[location.hash] || ['world', '라이준 모험 지도'];
    document.querySelector('.stage').dataset.map = map;
    $('map-title').textContent = title;
    $('world-map').hidden = map !== 'world';
    $('hangul-activities').hidden = map !== 'hangul';
    $('numbers-activities').hidden = map !== 'numbers';
    $('map-back').hidden = map === 'world';
    if (focus) $('map-title').focus({preventScroll: true});
  }

  addEventListener('hashchange', () => showMap(true));
  $('collection-open').addEventListener('click', () => $('collection').showModal());
  $('settings-open').addEventListener('click', () => $('settings').showModal());
  for (const key of ['sound', 'vibration']) {
    $(key).addEventListener('click', () => {
      try { hub.setPrefs({[key]: !hub.prefs()[key]}); }
      catch { $('import-message').textContent = '설정을 저장할 수 없어요.'; }
      render();
    });
  }
  addEventListener('pageshow', render);
  addEventListener('storage', render);
  showMap();
  render();
}());
