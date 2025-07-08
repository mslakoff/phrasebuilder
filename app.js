
let jsonData;
let currentMode = 'EQUIPMENT';
let lastText = '';

fetch('data.json')
  .then(response => response.json())
  .then(data => {
    jsonData = data.modes;
    loadGroups();
  });

const textBox = document.getElementById('textBox');
const groupsDiv = document.getElementById('groups');
const subgroupsDiv = document.getElementById('subgroups');
const phrasesDiv = document.getElementById('phrases');

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

function switchMode(mode) {
  currentMode = mode;
  document.getElementById('modeEquipment').classList.toggle('active', mode === 'EQUIPMENT');
  document.getElementById('modeRecommendations').classList.toggle('active', mode === 'RECOMMENDATIONS');
  clearChildren(groupsDiv);
  clearChildren(subgroupsDiv);
  clearChildren(phrasesDiv);
  loadGroups();
}

function loadGroups() {
  clearChildren(groupsDiv);
  Object.keys(jsonData[currentMode]).forEach(group => {
    const btn = createButton(group, () => loadSubGroups(group));
    groupsDiv.appendChild(btn);
  });
}

function loadSubGroups(group) {
  clearChildren(subgroupsDiv);
  clearChildren(phrasesDiv);
  Object.keys(jsonData[currentMode][group]).forEach(subgroup => {
    const btn = createButton(subgroup, () => loadPhrases(group, subgroup));
    subgroupsDiv.appendChild(btn);
  });
}

function loadPhrases(group, subgroup) {
  clearChildren(phrasesDiv);
  jsonData[currentMode][group][subgroup].forEach(phrase => {
    const btn = createButton(phrase, () => insertPhrase(phrase));
    phrasesDiv.appendChild(btn);
  });
}

function insertPhrase(phrase) {
  lastText = textBox.value;
  if (textBox.value !== '' && !textBox.value.endsWith('\n')) {
    textBox.value += '\n';
  }
  textBox.value += phrase;
}

function createButton(label, onClick) {
  const btn = document.createElement('button');
  btn.textContent = label;
  btn.addEventListener('click', onClick);
  return btn;
}

function clearChildren(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}
