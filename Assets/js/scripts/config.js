// config.js
// Centraliza o BASE_PATH para todos os scripts
let BASE_PATH = undefined;

if (typeof BASE_PATH === 'undefined') {
  function getBasePath() {
    // Remove o domínio e pega só o caminho base até a pasta do projeto
    // Exemplo: https://site.com/site-escola/site-manga/-V1/qualquercoisa -> /site-escola/site-manga/-V1/
    const path = window.location.pathname;
    // Verifica se o caminho contém "/site-manga/" em qualquer posição após a barra inicial
    // ignora maisculas e minúsculas e qualquer outra barra antes
    // Exemplo: /qualquercoisa/site-manga/ -> /site-manga/
    let match = path.match(/^(.*?\/site-manga\/)/i);

    if (match) 
        return match[1];

    return '/';
  }

  BASE_PATH = getBasePath();
}

export { BASE_PATH };
