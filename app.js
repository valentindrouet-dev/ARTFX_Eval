/* ── ARTFX Évaluateur — app.js ─────────────────────────────────────────── */

// ── Default criteria ──────────────────────────────────────────────────────
const DEFAULT_CRITERIA = [
  {
    id: uid(), name: 'cadrage',
    options: [
      { id: uid(), label: 'cadres intéressants / originaux', checked: false },
      { id: uid(), label: 'bonnes idées de lumière', checked: false },
      { id: uid(), label: 'cadres pas toujours heureux', checked: false },
    ]
  },
  {
    id: uid(), name: 'exposition',
    options: [
      { id: uid(), label: 'quelques plans surexposés', checked: false },
      { id: uid(), label: 'quelques plans sous-exposés', checked: false },
      { id: uid(), label: 'exposition globalement maîtrisée', checked: false },
    ]
  },
  {
    id: uid(), name: 'mise au point',
    options: [
      { id: uid(), label: 'mise au point de plans difficiles réussie', checked: false },
      { id: uid(), label: 'beaucoup de plans flous', checked: false },
    ]
  },
  {
    id: uid(), name: 'rythme',
    options: [
      { id: uid(), label: 'montage bien rythmé', checked: false },
      { id: uid(), label: 'certains plans durent trop longtemps', checked: false },
      { id: uid(), label: 'montage manque de rythme', checked: false },
    ]
  },
  {
    id: uid(), name: 'raccords',
    options: [
      { id: uid(), label: 'quelques raccords pertinents', checked: false },
      { id: uid(), label: 'des raccords hasardeux / qui ne marchent pas', checked: false },
      { id: uid(), label: 'faux raccords visibles', checked: false },
    ]
  },
  {
    id: uid(), name: 'construction narrative',
    options: [
      { id: uid(), label: 'structure narrative intéressante', checked: false },
      { id: uid(), label: 'compréhension difficile ou brouillonne', checked: false },
    ]
  },
  {
    id: uid(), name: 'étalonnage',
    options: [
      { id: uid(), label: 'étalonnage réussi ou intéressant', checked: false },
      { id: uid(), label: 'étalonnage trop appuyé', checked: false },
      { id: uid(), label: 'étalonnage qui dessert le propos', checked: false },
    ]
  },
  {
    id: uid(), name: 'ambiance',
    options: [
      { id: uid(), label: 'bonne ambiance globale', checked: false },
      { id: uid(), label: 'effets qui ne fonctionnent pas et qui affaiblissent l\'ambiance', checked: false },
    ]
  },
  {
    id: uid(), name: 'effets caméra',
    options: [
      { id: uid(), label: 'effets de caméra pertinents', checked: false },
      { id: uid(), label: 'effets de caméra mal utilisés', checked: false },
    ]
  },
  {
    id: uid(), name: 'vfx',
    options: [
      { id: uid(), label: 'effets vfx pertinents', checked: false },
      { id: uid(), label: 'usage brouillon des VFX', checked: false },
    ]
  },
  {
    id: uid(), name: 'cohérence',
    options: [
      { id: uid(), label: 'ensemble cohérent', checked: false },
      { id: uid(), label: 'ensemble qui manque de cohérence', checked: false },
    ]
  },
  {
    id: uid(), name: 'technique',
    options: [
      { id: uid(), label: 'bonne utilisation du son', checked: false },
      { id: uid(), label: 'utilisation du son à peaufiner', checked: false },
    ]
  },
  {
    id: uid(), name: 'conclusion',
    options: [
      { id: uid(), label: 'Excellent travail', checked: false },
      { id: uid(), label: 'Bon travail', checked: false },
      { id: uid(), label: 'Assez bon travail', checked: false },
      { id: uid(), label: 'Travail à revoir', checked: false },
    ]
  },
  {
    id: uid(), name: 'remarques supplémentaires',
    options: [
      { id: uid(), label: '', checked: false },
    ]
  },
];

// ── Grade levels ──────────────────────────────────────────────────────────
const GRADE_OPTIONS = [
  { label: 'Très bon', color: 'green'  },
  { label: 'Bon',      color: 'yellow' },
  { label: 'Moyen',    color: 'orange' },
  { label: 'Mauvais',  color: 'red'    },
];

// ── State ─────────────────────────────────────────────────────────────────
let state = {
  workshopName: 'Workshop Photo',
  criteria: deepClone(DEFAULT_CRITERIA),
};

// ── Utils ─────────────────────────────────────────────────────────────────
function uid() {
  return Math.random().toString(36).slice(2, 9);
}

function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function toast(msg) {
  const el = document.createElement('div');
  el.className = 'toast';
  el.textContent = msg;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 2100);
}

function getSetting(key, fallback = '') {
  return localStorage.getItem('artfx_' + key) ?? fallback;
}

function setSetting(key, value) {
  localStorage.setItem('artfx_' + key, value);
}

// ── Render ─────────────────────────────────────────────────────────────────
function render() {
  const list = document.getElementById('criteriaList');
  list.innerHTML = '';
  state.criteria.forEach(criterion => {
    list.appendChild(buildCriterionCard(criterion));
  });
}

function buildCriterionCard(criterion) {
  const hasChecked = criterion.options.some(o => o.checked);

  const card = document.createElement('div');
  card.className = 'criterion-card' + (hasChecked ? ' has-checked' : '');
  card.dataset.id = criterion.id;

  // Header
  const header = document.createElement('div');
  header.className = 'criterion-header';

  const nameInput = document.createElement('input');
  nameInput.type = 'text';
  nameInput.className = 'criterion-name';
  nameInput.value = criterion.name;
  nameInput.placeholder = 'Nom du critère…';
  nameInput.addEventListener('input', e => {
    criterion.name = e.target.value;
    persistState();
  });

  const btnDelete = document.createElement('button');
  btnDelete.className = 'btn-icon btn-delete-criterion';
  btnDelete.textContent = '✕';
  btnDelete.title = 'Supprimer ce critère';
  btnDelete.addEventListener('click', () => {
    state.criteria = state.criteria.filter(c => c.id !== criterion.id);
    persistState();
    render();
  });

  header.appendChild(nameInput);
  header.appendChild(btnDelete);

  // Options
  const optionsList = document.createElement('div');
  optionsList.className = 'options-list';

  criterion.options.forEach(option => {
    optionsList.appendChild(buildOptionRow(criterion, option));
  });

  // Add option button
  const btnAdd = document.createElement('button');
  btnAdd.className = 'btn-add-option';
  btnAdd.textContent = '+ Ajouter une option';
  btnAdd.addEventListener('click', () => {
    criterion.options.push({ id: uid(), label: '', checked: false });
    persistState();
    render();
    // Focus new input
    const newRow = card.querySelectorAll('.option-label');
    if (newRow.length) newRow[newRow.length - 1].focus();
  });

  optionsList.appendChild(btnAdd);

  card.appendChild(header);
  card.appendChild(optionsList);

  return card;
}

function buildOptionRow(criterion, option) {
  const row = document.createElement('div');
  row.className = 'option-row';

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.checked = option.checked;
  checkbox.addEventListener('change', e => {
    option.checked = e.target.checked;
    persistState();
    const card = document.querySelector(`.criterion-card[data-id="${criterion.id}"]`);
    if (card) {
      const hasChecked = criterion.options.some(o => o.checked);
      card.classList.toggle('has-checked', hasChecked);
    }
  });

  const labelInput = document.createElement('input');
  labelInput.type = 'text';
  labelInput.className = 'option-label';
  labelInput.value = option.label;
  labelInput.placeholder = 'Libellé…';
  labelInput.addEventListener('input', e => {
    option.label = e.target.value;
    persistState();
  });

  // ── Grade pills (inline, at the end) ──
  const gradeContainer = document.createElement('div');
  gradeContainer.className = 'option-grade-row';

  GRADE_OPTIONS.forEach(g => {
    const pill = document.createElement('button');
    pill.className = `grade-pill grade-${g.color}${option.grade === g.label ? ' selected' : ''}`;
    pill.textContent = g.label;
    pill.addEventListener('click', () => {
      option.grade = option.grade === g.label ? null : g.label;
      persistState();
      gradeContainer.querySelectorAll('.grade-pill').forEach(p => p.classList.remove('selected'));
      if (option.grade) pill.classList.add('selected');
    });
    gradeContainer.appendChild(pill);
  });

  const btnDel = document.createElement('button');
  btnDel.className = 'btn-delete-option';
  btnDel.textContent = '✕';
  btnDel.title = 'Supprimer';
  btnDel.addEventListener('click', () => {
    criterion.options = criterion.options.filter(o => o.id !== option.id);
    persistState();
    render();
  });

  row.appendChild(checkbox);
  row.appendChild(labelInput);
  row.appendChild(gradeContainer);
  row.appendChild(btnDel);

  return row;
}

// ── Persistence ───────────────────────────────────────────────────────────
function persistState() {
  setSetting('criteria', JSON.stringify(state.criteria));
  setSetting('workshopName', state.workshopName);
}

function loadState() {
  const saved = getSetting('criteria');
  if (saved) {
    try { state.criteria = JSON.parse(saved); } catch {}
  }
  const wn = getSetting('workshopName');
  if (wn) state.workshopName = wn;
}

// ── Templates ─────────────────────────────────────────────────────────────
function getTemplates() {
  try { return JSON.parse(getSetting('templates', '[]')); } catch { return []; }
}

function saveTemplate(name, criteria) {
  const templates = getTemplates();
  const existing = templates.findIndex(t => t.name === name);
  const entry = { name, criteria: deepClone(criteria), savedAt: new Date().toISOString() };
  if (existing >= 0) templates[existing] = entry;
  else templates.push(entry);
  setSetting('templates', JSON.stringify(templates));
}

function deleteTemplate(name) {
  const templates = getTemplates().filter(t => t.name !== name);
  setSetting('templates', JSON.stringify(templates));
}

function openSaveTemplateFlow() {
  const name = prompt('Nom du modèle à sauvegarder :', state.workshopName || 'Nouveau modèle');
  if (!name) return;
  saveTemplate(name, state.criteria);
  toast(`Modèle "${name}" sauvegardé.`);
}

function openLoadTemplateModal() {
  const templates = getTemplates();
  const modal = document.getElementById('templateModal');
  const list = document.getElementById('templateList');
  const title = document.getElementById('templateModalTitle');

  title.textContent = 'Charger un modèle';
  list.innerHTML = '';

  if (!templates.length) {
    list.innerHTML = '<p class="modal-empty">Aucun modèle sauvegardé.</p>';
  } else {
    templates.forEach(t => {
      const item = document.createElement('div');
      item.className = 'template-item';

      const span = document.createElement('span');
      span.textContent = t.name;

      const btnLoad = document.createElement('button');
      btnLoad.className = 'btn-secondary';
      btnLoad.textContent = 'Charger';
      btnLoad.addEventListener('click', () => {
        state.criteria = deepClone(t.criteria);
        // Reset all checkboxes on load
        state.criteria.forEach(c => c.options.forEach(o => o.checked = false));
        document.getElementById('workshopName').value = t.name;
        state.workshopName = t.name;
        persistState();
        render();
        closeModal();
        toast(`Modèle "${t.name}" chargé.`);
      });

      const btnDel = document.createElement('button');
      btnDel.className = 'btn-ghost';
      btnDel.textContent = 'Supprimer';
      btnDel.addEventListener('click', () => {
        deleteTemplate(t.name);
        openLoadTemplateModal(); // refresh
      });

      item.appendChild(span);
      item.appendChild(btnLoad);
      item.appendChild(btnDel);
      list.appendChild(item);
    });
  }

  modal.classList.remove('hidden');
  document.getElementById('overlay').classList.remove('hidden');
}

function closeModal() {
  document.getElementById('templateModal').classList.add('hidden');
  document.getElementById('overlay').classList.add('hidden');
}

// ── AI Generation ─────────────────────────────────────────────────────────
function buildPrompt(workshopName, studentName, checkedItems) {
  const studentLine = studentName ? `Étudiant·e : ${studentName}\n` : '';
  const workshopLine = workshopName ? `Workshop : ${workshopName}\n` : '';

  const criteriaText = checkedItems
    .map(c => {
      const opts = c.options.filter(o => o.checked && o.label.trim());
      if (!opts.length) return null;
      return `${c.name} :\n${opts.map(o => {
        const grade = o.grade ? ` (${o.grade})` : '';
        return `  - ${o.label}${grade}`;
      }).join('\n')}`;
    })
    .filter(Boolean)
    .join('\n\n');

  return `Tu es un·e enseignant·e bienveillant·e dans une école d'arts visuels (ARTFX). Tu dois rédiger une évaluation personnalisée pour un·e étudiant·e à partir des critères cochés ci-dessous.

${workshopLine}${studentLine}
Critères d'évaluation cochés :
${criteriaText}

Rédige une évaluation textuelle en 3 à 5 phrases :
- Utilise un ton bienveillant, encourageant et constructif
- Reformule les points positifs en les valorisant
- Transforme les points négatifs en pistes d'amélioration concrètes
- Évite de lister mécaniquement les critères : synthétise-les en un texte fluide
- Termine par une phrase d'encouragement personnalisée
- Écris en français, à la deuxième personne du singulier (tu/ton/ta)
- Ne mentionne pas les noms des critères tels quels : intègre-les naturellement

Ne génère que le texte de l'évaluation, sans titre ni préambule.`;
}

async function generateEvaluation() {
  const apiKey = getSetting('apiKey');
  if (!apiKey) {
    toast('Clé API manquante — configurez-la dans les paramètres ⚙');
    document.getElementById('settingsPanel').classList.remove('hidden');
    return;
  }

  const checkedItems = state.criteria.filter(c => c.options.some(o => o.checked));
  if (!checkedItems.length) {
    toast('Cochez au moins un critère pour générer une évaluation.');
    return;
  }

  const workshopName = document.getElementById('workshopName').value.trim();
  const studentName = document.getElementById('studentName').value.trim();
  const model = getSetting('model', 'claude-sonnet-4-6');

  const outputSection = document.getElementById('outputSection');
  const outputText = document.getElementById('outputText');
  const outputMeta = document.getElementById('outputMeta');
  const btnGenerate = document.getElementById('btnGenerate');

  outputSection.classList.remove('hidden');
  outputText.className = 'output-text loading';
  outputText.textContent = 'Génération en cours…';
  outputMeta.textContent = '';
  btnGenerate.disabled = true;

  const prompt = buildPrompt(workshopName, studentName, checkedItems);

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify({
        model,
        max_tokens: 512,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err?.error?.message || `HTTP ${response.status}`);
    }

    const data = await response.json();
    const text = data.content?.[0]?.text ?? '';

    outputText.className = 'output-text';
    outputText.textContent = text;

    const usage = data.usage;
    if (usage) {
      outputMeta.textContent = `${usage.input_tokens} tokens entrée · ${usage.output_tokens} tokens sortie · modèle : ${model}`;
    }

  } catch (err) {
    outputText.className = 'output-text';
    outputText.textContent = '';
    toast('Erreur : ' + err.message);
    console.error(err);
  } finally {
    btnGenerate.disabled = false;
  }
}

// ── Copy ──────────────────────────────────────────────────────────────────
async function copyOutput() {
  const text = document.getElementById('outputText').textContent;
  if (!text) return;
  try {
    await navigator.clipboard.writeText(text);
    toast('Évaluation copiée !');
  } catch {
    toast('Copie non disponible dans ce navigateur.');
  }
}

// ── Init ──────────────────────────────────────────────────────────────────
function init() {
  loadState();

  // Workshop name
  const workshopInput = document.getElementById('workshopName');
  workshopInput.value = state.workshopName;
  workshopInput.addEventListener('input', e => {
    state.workshopName = e.target.value;
    persistState();
  });

  render();

  // Buttons
  document.getElementById('btnAddCriterion').addEventListener('click', () => {
    state.criteria.push({
      id: uid(),
      name: '',
      options: [
        { id: uid(), label: '', checked: false },
      ],
    });
    persistState();
    render();
    const inputs = document.querySelectorAll('.criterion-name');
    if (inputs.length) inputs[inputs.length - 1].focus();
  });

  document.getElementById('btnGenerate').addEventListener('click', generateEvaluation);
  document.getElementById('btnCopy').addEventListener('click', copyOutput);

  document.getElementById('btnClearAll').addEventListener('click', () => {
    state.criteria.forEach(c => c.options.forEach(o => o.checked = false));
    persistState();
    render();
    document.getElementById('studentName').value = '';
    document.getElementById('outputSection').classList.add('hidden');
  });

  // Settings
  document.getElementById('btnSettings').addEventListener('click', () => {
    document.getElementById('settingsPanel').classList.toggle('hidden');
  });

  document.getElementById('btnCloseSettings').addEventListener('click', () => {
    document.getElementById('settingsPanel').classList.add('hidden');
  });

  // Load saved API key & model
  const savedKey = getSetting('apiKey');
  if (savedKey) document.getElementById('apiKeyInput').value = savedKey;

  const savedModel = getSetting('model', 'claude-sonnet-4-6');
  document.getElementById('modelSelect').value = savedModel;

  document.getElementById('btnSaveKey').addEventListener('click', () => {
    const key = document.getElementById('apiKeyInput').value.trim();
    setSetting('apiKey', key);
    toast('Clé API enregistrée.');
  });

  document.getElementById('modelSelect').addEventListener('change', e => {
    setSetting('model', e.target.value);
  });

  // Templates
  document.getElementById('btnSaveTemplate').addEventListener('click', openSaveTemplateFlow);
  document.getElementById('btnLoadTemplate').addEventListener('click', openLoadTemplateModal);
  document.getElementById('btnCloseModal').addEventListener('click', closeModal);
  document.getElementById('overlay').addEventListener('click', closeModal);
}

document.addEventListener('DOMContentLoaded', init);
