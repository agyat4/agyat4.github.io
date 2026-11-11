// Skills & Experience page: clicking a skill capsule or an entry's skill tag highlights the
// experience entries that used that skill and dims the rest. Clicking the active skill again,
// or the Clear button, removes the filter.
(function () {
  const page = document.querySelector('[data-se-page]');
  if (!page) return;

  const entries = page.querySelectorAll('.se-entry[data-skills]');
  const toggles = page.querySelectorAll('button[data-skill]');
  const clearBtn = page.querySelector('[data-se-clear]');
  const status = page.querySelector('[data-se-status]');
  let active = null;

  function labelFor(skill) {
    const cap = page.querySelector('.se-cap[data-skill="' + skill + '"]');
    return cap ? cap.textContent.trim() : skill;
  }

  function apply(skill) {
    active = skill;
    page.classList.toggle('se-filtering', Boolean(skill));

    let matches = 0;
    entries.forEach(function (entry) {
      const hit = skill !== null && entry.dataset.skills.split(' ').includes(skill);
      entry.classList.toggle('se-match', hit);
      if (hit) matches += 1;
    });

    toggles.forEach(function (btn) {
      btn.setAttribute('aria-pressed', String(btn.dataset.skill === skill));
    });

    clearBtn.hidden = !skill;
    status.textContent = skill
      ? 'Showing ' + matches + (matches === 1 ? ' entry' : ' entries') + ' using ' + labelFor(skill) + '.'
      : '';
  }

  toggles.forEach(function (btn) {
    btn.addEventListener('click', function () {
      apply(active === btn.dataset.skill ? null : btn.dataset.skill);
    });
  });

  clearBtn.addEventListener('click', function () {
    const previous = active;
    apply(null);
    // Return focus to the capsule that set the filter, since the Clear button is now hidden
    const cap = page.querySelector('.se-cap[data-skill="' + previous + '"]');
    if (cap) cap.focus();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && active) apply(null);
  });
})();
