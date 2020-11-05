
function hide(...ids) {
  for (const id of ids) {
    document.getElementById(id).style.display = 'none';
    document.getElementById(id+'Ref').className = '';
  }
}

function hideAll() {
  hide('home','tech','help');
}

function show(id) {
  hideAll();
  document.getElementById(id).style.display = 'inline';
  document.getElementById(id+'Ref').className = 'active';
}

function attachListeners() {
  document.getElementById('homeRef').addEventListener(
    'click', function (e) { show('home'); });
  document.getElementById('techRef').addEventListener(
    'click', function (e) { show('tech'); });
  document.getElementById('helpRef').addEventListener(
    'click', function (e) { show('help'); });
}

window.addEventListener('DOMContentLoaded', function (e) { 
  attachListeners();
  show(window.location.hash ? window.location.hash.slice(2) : 'home');
}); 
