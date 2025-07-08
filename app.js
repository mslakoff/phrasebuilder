
let jsonData;
let currentMode = 'EQUIPMENT';
let lastText = '';

fetch('data.json')
  .then(response => response.json())
  .then(data => {
    jsonData = data;
    loadGroups();
    loadQuickToolbar();
  });

const textBox = document.getElementById('textBox');
const groupsDiv = document.getElementById('groups');
const subgroupsDiv = document.getElementById('subgroups');
const phrasesDiv = document.getElementById('phrases');
const quickToolbarDiv = document.getElementById('quickToolbar');

// Modal elements
const modal = document.getElementById('numberPadModal');
const closeModal = document.getElementById('closeModal');
const numberPadInput = document.getElementById('numberPadInput');
const insertNumberPad = document.getElementById('insertNumberPad');

document.getElementById('modeEquipment').addEventListener('click', () => switchMode('EQUIPMENT'));
document.getElementById('modeRecommendations').addEventListener('click', () => switchMode('RECOMMENDATIONS'));
document.getElementById('copyButton').addEventListener('click', () => {
  textBox.select();
  document.execCommand('copy');
});
document.getElementById('clearButton').addEventListener('click', () => {
  textBox.select();
  document.execCommand('copy');
  textBox.value = '';
});
document.getElementById('undoButton').addEventListener('click', () => {
  textBox.value = lastText;
});

// Modal handling
closeModal.onclick = function() { modal.style.display = "none"; numberPadInput.value = ""; }
insertNumberPad.onclick = function() {
    lastText = textBox.value;
    const value = numberPadInput.value.trim();
    if(value !== "") {
        textBox.value += value;
    }
    modal.style.display = "none";
    numberPadInput.value = "";
}
window.onclick = function(event) { if(event.target == modal){ modal.style.display = "none"; numberPadInput.value = ""; } }

function switchMode(mode) {
  currentMode = mode;
  document.getElementById('modeEquipment').classList.toggle('active', mode === 'EQUIPMENT');
  document.getElementById('modeRecommendations').classList.toggle('active', mode === 'RECOMMENDATIONS');
  clearChildren(groupsDiv);
  clearChildren(subgroupsDiv);
  clearChildren(phrasesDiv);
  loadGroups();
  loadQuickToolbar();
}

function loadGroups() {
  clearChildren(groupsDiv);
  Object.keys(jsonData.modes[currentMode]).forEach(group => {
    const btn = createButton({label: group, insert: group, spaceAfter: false, lineBreakAfter: false}, () => loadSubGroups(group));
    groupsDiv.appendChild(btn);
  });
}

function loadSubGroups(group) {
  clearChildren(subgroupsDiv);
  clearChildren(phrasesDiv);
  Object.keys(jsonData.modes[currentMode][group]).forEach(subgroup => {
    const btn = createButton({label: subgroup, insert: subgroup, spaceAfter: false, lineBreakAfter: false}, () => loadPhrases(group, subgroup));
    subgroupsDiv.appendChild(btn);
  });
}

function loadPhrases(group, subgroup) {
  clearChildren(phrasesDiv);
  jsonData.modes[currentMode][group][subgroup].forEach(phraseObj => {
    const btn = createButton(phraseObj, () => insertPhrase(phraseObj));
    phrasesDiv.appendChild(btn);
  });
}

function loadQuickToolbar() {
  clearChildren(quickToolbarDiv);
  jsonData.quickToolbar[currentMode].forEach(item => {
    const btn = createButton(item, () => {
      if(item.insert === "NUMBERPAD"){
        modal.style.display = "block";
      } else {
        insertPhrase(item);
      }
    });
    quickToolbarDiv.appendChild(btn);
  });
}

function insertPhrase(obj) {
  lastText = textBox.value;
  if (!obj) return;

  if (!obj.spaceAfter && /^[.,;!?]$/.test(obj.insert)) {
    if (textBox.value.endsWith(" ")) {
      textBox.value = textBox.value.slice(0, -1);
    }
  }

  textBox.value += obj.insert;

  if (obj.spaceAfter) {
    textBox.value += " ";
  }
  if (obj.lineBreakAfter) {
    textBox.value += "\n";
  }
}

function createButton(obj, onClick) {
  const btn = document.createElement('button');
  btn.textContent = obj.label;
  btn.addEventListener('click', onClick);
  return btn;
}

function clearChildren(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}
