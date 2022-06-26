const sceneSelectElement = document.getElementById('console-text-select-scene');
const renderButtonElement = document.getElementById('console-text-button');

renderButtonElement.addEventListener('click', () => {
  const scene = sceneSelectElement.value;

  switch (scene) {
    case '':
      break;
    case 'scene1':
      saveScene('scene1');
      break;
    case 'scene2':
      saveScene('scene2');
      break;
    case 'scene3':
      saveScene('scene3');
      break;
    case 'scene4':
      saveScene('scene4');
      break;
    default:
      saveScene('scene5');
      break;
  }
});

// Save scene to local storage
const saveScene = (scene) => {
  // Check if scene is already saved
  if (localStorage.getItem('scene') === null) {
    localStorage.setItem('scene', scene);
  }
  // If exists replace
  else {
    localStorage.removeItem('scene');
    localStorage.setItem('scene', scene);
  }
  // Reload page
  window.location.reload();
};

// When page loads, check if scene is saved and call Scene
const checkScene = () => {
  console.log(localStorage);
  if (localStorage.getItem('scene') === 'scene1') {
    Scene1();
  }
  if (localStorage.getItem('scene') === 'scene2') {
    Scene2();
  }
  if (localStorage.getItem('scene') === 'scene3') {
    Scene3();
  }
  if (localStorage.getItem('scene') === 'scene4') {
    Scene4();
  }
  if (localStorage.getItem('scene') === 'scene5') {
    Scene5();
  }
};

document.addEventListener('DOMContentLoaded', checkScene);
