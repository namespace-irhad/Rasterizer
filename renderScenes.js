const sceneSelectElement = document.getElementById('console-text-select-scene');
const renderButtonElement = document.getElementById('console-text-button');

renderButtonElement.addEventListener('click', () => {
  const scene = sceneSelectElement.value;

  switch (scene) {
    case '':
      break;
    case 'scene1':
      addQueryParameter(window.location.href, 'scene', 'scene1');
      break;
    case 'scene2':
      addQueryParameter(window.location.href, 'scene', 'scene2');
      break;
    case 'scene3':
      addQueryParameter(window.location.href, 'scene', 'scene3');
      break;
    case 'scene4':
      addQueryParameter(window.location.href, 'scene', 'scene4');
      break;
    default:
      addQueryParameter(window.location.href, 'scene', 'scene5');
      break;
  }
});

function addQueryParameter(url, key, value) {
  const query = url.split('?')[1];
  const vars = query.split('&');
  const newVars = [];
  for (let i = 0; i < vars.length; i++) {
    const pair = vars[i].split('=');
    if (pair[0] !== key) {
      newVars.push(vars[i]);
    }
  }
  newVars.push(key + '=' + value);
  const newQuery = newVars.join('&');
  const newUrl = url.split('?')[0] + '?' + newQuery;
  window.location.href = newUrl;
}

function getQueryParameter(key) {
  const query = window.location.search.substring(1);
  const vars = query.split('&');
  for (let i = 0; i < vars.length; i++) {
    const pair = vars[i].split('=');
    if (pair[0] === key) {
      return pair[1];
    }
  }
  return null;
}

if (getQueryParameter('scene') === 'scene1') {
  Scene1();
} else if (getQueryParameter('scene') === 'scene2') {
  Scene2();
} else if (getQueryParameter('scene') === 'scene3') {
  Scene3();
} else if (getQueryParameter('scene') === 'scene4') {
  Scene4();
} else if (getQueryParameter('scene') === 'scene5') {
  Scene5();
}
