// Brand Asset Builder kit: small helpers that go with kit.css. No dependencies. See README.md.
//   BAB.bar(el, {logo, tool, home})     fill a <header class="bab-bar"> with the PI logo, "Brand Asset Builder", tool name
//   BAB.autosize(input)                 an inline .bab-input grows and shrinks with its text
//   BAB.picker(button, pop, opts)       a .bab-pick button that opens a .bab-pop listbox of {value, label, icon}
(function (root) {
  var BAB = {};

  BAB.bar = function (el, o) {
    o = o || {};
    el.classList.add('bab-bar');
    el.textContent = '';
    var a = document.createElement(o.home ? 'a' : 'span');
    if (o.home) { a.href = o.home; a.style.display = 'flex'; }
    // [PI mark] Brand Asset Builder | Tool name
    var img = document.createElement('img'); img.src = o.logo || 'pi-mark.svg'; img.alt = 'The Predictive Index';
    a.appendChild(img);
    var nm = document.createElement('span'); nm.className = 'bab-name'; nm.textContent = 'Brand Asset Builder'; a.appendChild(nm);
    el.appendChild(a);
    if (o.tool) {
      var sep = document.createElement('span'); sep.className = 'bab-sep'; sep.setAttribute('aria-hidden', 'true'); el.appendChild(sep);
      var t = document.createElement('span'); t.className = 'bab-tool'; t.textContent = o.tool; el.appendChild(t);
    }
    return el;
  };

  // width follows the text, measured with a hidden twin that shares the input's font
  BAB.autosize = function (input, min) {
    var m = document.createElement('span'); m.className = 'bab-measure'; m.setAttribute('aria-hidden', 'true');
    input.parentNode.appendChild(m);
    function fit() {
      var cs = getComputedStyle(input);
      m.style.font = cs.font; m.style.letterSpacing = cs.letterSpacing;
      m.textContent = input.value || input.placeholder || ' ';
      input.style.width = Math.max(min || 0, Math.ceil(m.getBoundingClientRect().width) + 4) + 'px';
    }
    input.addEventListener('input', fit);
    if (document.fonts && document.fonts.addEventListener) document.fonts.addEventListener('loadingdone', fit);
    window.addEventListener('resize', fit);
    fit();
    return fit;
  };

  // Accessible listbox popover. Arrows move (a grid: left/right by one, up/down by a row), Enter or Space
  // picks, Esc closes, typing a letter jumps to the next option starting with it, a click outside closes.
  BAB.picker = function (button, pop, o) {
    var items = o.items, value = o.value, cur = 0, opts = [];
    button.setAttribute('aria-haspopup', 'listbox'); button.setAttribute('aria-expanded', 'false');
    pop.setAttribute('role', 'listbox'); pop.tabIndex = -1;
    if (o.label) pop.setAttribute('aria-label', o.label);
    items.forEach(function (it, i) {
      var d = document.createElement('div'); d.className = 'bab-opt'; d.setAttribute('role', 'option'); d.id = pop.id + '-o' + i;
      if (it.icon) { var im = document.createElement('img'); im.src = it.icon; im.alt = ''; d.appendChild(im); }
      var s = document.createElement('span'); s.textContent = it.label; d.appendChild(s);
      d.addEventListener('click', function () { choose(i); });
      d.addEventListener('mousemove', function () { mark(i); });
      pop.appendChild(d); opts.push(d);
    });
    function cols() { return getComputedStyle(pop).gridTemplateColumns.split(' ').length || 1; }
    function sync() { opts.forEach(function (d, i) { d.setAttribute('aria-selected', items[i].value === value ? 'true' : 'false'); }); }
    function mark(i) {
      cur = (i + opts.length) % opts.length;
      opts.forEach(function (d, j) { d.classList.toggle('bab-cur', j === cur); });
      pop.setAttribute('aria-activedescendant', opts[cur].id);
      var r = opts[cur]; if (r.offsetTop < pop.scrollTop || r.offsetTop + r.offsetHeight > pop.scrollTop + pop.clientHeight) r.scrollIntoView({block: 'nearest'});
    }
    function place() {
      var host = pop.offsetParent || document.body, hb = host.getBoundingClientRect(), b = button.getBoundingClientRect();
      var left = b.left - hb.left, maxLeft = hb.width - pop.offsetWidth;
      pop.style.left = Math.max(0, Math.min(left, maxLeft)) + 'px';
      pop.style.top = (b.bottom - hb.top + 10) + 'px';
    }
    function open() {
      if (pop.classList.contains('bab-open')) return;
      place(); pop.classList.add('bab-open'); button.setAttribute('aria-expanded', 'true'); button.parentNode.classList.add('bab-active');
      mark(Math.max(0, items.findIndex(function (it) { return it.value === value; })));
      pop.focus({preventScroll: true});
    }
    function close(refocus) {
      if (!pop.classList.contains('bab-open')) return;
      pop.classList.remove('bab-open'); button.setAttribute('aria-expanded', 'false'); button.parentNode.classList.remove('bab-active');
      if (refocus) button.focus({preventScroll: true});
    }
    function choose(i) { set(items[i].value, true); close(true); }
    function set(v, fire) {
      if (v === value) return;
      value = v; sync();
      if (fire && o.onChange) o.onChange(v);
    }
    button.addEventListener('click', function () { pop.classList.contains('bab-open') ? close(true) : open(); });
    button.addEventListener('keydown', function (e) { if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); open(); } });
    pop.addEventListener('keydown', function (e) {
      var k = e.key, c = cols();
      if (k === 'ArrowRight') mark(cur + 1); else if (k === 'ArrowLeft') mark(cur - 1);
      else if (k === 'ArrowDown') mark(Math.min(opts.length - 1, cur + c)); else if (k === 'ArrowUp') mark(Math.max(0, cur - c));
      else if (k === 'Home') mark(0); else if (k === 'End') mark(opts.length - 1);
      else if (k === 'Enter' || k === ' ') choose(cur);
      else if (k === 'Escape' || k === 'Tab') { close(k === 'Escape'); if (k === 'Tab') return; }
      else if (k.length === 1 && /\S/.test(k)) {
        for (var n = 1; n <= opts.length; n++) { var j = (cur + n) % opts.length; if (items[j].label.toLowerCase().indexOf(k.toLowerCase()) === 0) { mark(j); break; } }
      } else return;
      e.preventDefault();
    });
    document.addEventListener('pointerdown', function (e) { if (!pop.contains(e.target) && !button.contains(e.target)) close(false); }, true);
    window.addEventListener('resize', function () { if (pop.classList.contains('bab-open')) place(); });
    sync();
    return {set: function (v) { set(v, false); }, close: close, get value() { return value; },
            disable: function (on) { button.disabled = !!on; if (on) close(false); }};
  };

  // swap a text node with a short rise-and-fade, for values that change under the user's eye
  BAB.swap = function (el, text) {
    if (el.textContent === text) return;
    el.textContent = text; el.classList.remove('bab-swap'); void el.offsetWidth; el.classList.add('bab-swap');
  };

  root.BAB = BAB;
})(typeof window !== 'undefined' ? window : globalThis);
