
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

// Keypad modal
const modal = document.getElementById('numberPadModal');
const numberDisplay = document.getElementById('numberDisplay');
const keypad = document.getElementById('keypad');

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

keypad.addEventListener('click', (e) => {
    if (!e.target.classList.contains('key')) return;
    const key = e.target.textContent;
    if (key === 'DEL') {
        numberDisplay.textContent = numberDisplay.textContent.slice(0, -1) || '0';
    } else if (key === 'OK') {
        lastText = textBox.value;
        const val = numberDisplay.textContent;
        if (val !== '0') {
            textBox.value += val;
        }
        numberDisplay.textContent = '0';
        modal.style.display = 'none';
    } else if (key === 'CANCEL') {
        numberDisplay.textContent = '0';
        modal.style.display = 'none';
    } else {
        if (numberDisplay.textContent === '0') numberDisplay.textContent = '';
        numberDisplay.textContent += key;
    }
});

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
  if (!jsonData.modes[currentMode]) return;
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
  if (!jsonData.quickToolbar[currentMode]) return;
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

  if (obj.trimBeforeInsert) {
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
