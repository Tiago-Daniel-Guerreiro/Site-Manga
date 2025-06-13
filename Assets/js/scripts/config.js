// config.js
// Centraliza o BASE_PATH para todos os scripts
let BASE_PATH = "site-manga";

if (typeof BASE_PATH === 'undefined' || BASE_PATH === undefined) {
  function getBasePath() {
    const path = window.location.pathname;
    // Procura por /site-manga/ em qualquer parte do path
    let match = path.match(/(\/site-manga\/)/i);
    if (match) 
        return match[1];
    // Se não encontrar, retorna '/'
    return '/';
  }
  BASE_PATH = getBasePath();
}

export { BASE_PATH };
