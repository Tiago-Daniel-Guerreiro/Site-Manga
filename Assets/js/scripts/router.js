import { BASE_PATH } from './config.js';

// Caminho base do projeto para subdiretórios
// BASE_PATH é importado de './config.js'

import { inserirHeaderFooter, mostrarFooter, mostrarHeader } from './layout.js';
import { verificarManga_Utils, verificarCap_Utils } from './mangautils.js';

const Link_Termina_ComBarra = false; // Define Se o link termina com barra ou não

class PageLoader 
{
  static async carregarCss(pagina) 
  {
    document.querySelectorAll('link[id^="css-"]').forEach(link => link.remove());
    await new Promise(res => {
      const link = document.createElement('link');
      link.id = `css-${pagina.toLowerCase()}`;
      link.rel = 'stylesheet';
      link.href = BASE_PATH + `Assets/css/${pagina.toLowerCase()}.css`;
      link.onload = res;
      document.head.appendChild(link);
    });
  }

  static carregarJs(pagina, params) 
  {
    fetch(BASE_PATH + `Assets/js/${pagina.toLowerCase()}.js`, { method: 'HEAD' })
      .then(resp => 
      {
        if (resp.ok) 
        {
          import(BASE_PATH + `Assets/js/${pagina.toLowerCase()}.js`).then(mod => 
          {
            requestAnimationFrame(() => { // Obriga o carregamento ser chamado após .init
              if (typeof mod.init === 'function') 
              {
                if (Array.isArray(params) && params.length > 0) 
                  mod.init(...params);
                else 
                  mod.init();
              }
            });
          }).catch(err => 
          {
            console.error(`[carregarJs] Erro ao carregar o módulo JS para ${pagina}:`, err);
          });
        } 
      });
  }
}

class LinkVerifier
 {
  // Formata o link para manter o BASE_PATH SEMPRE no início
  static formatarLink(path) 
  {
    // Remove o BASE_PATH do início, se já existir, para evitar duplicidade
    let cleanPath = path;
    if (cleanPath.startsWith(BASE_PATH)) 
      cleanPath = cleanPath.slice(BASE_PATH.length);
    // Remove qualquer Assets/js/scripts/router.js ou Assets/css/global.css do final
    cleanPath = cleanPath.replace(/Assets\/(js|css)\/.*/i, '');
    const partes = cleanPath.split('/').filter(parte => parte.length > 0);
    const resultado = [];
    for (let i = 0; i < partes.length; i++) 
    {
      const parte = partes[i];
      if (Number(parte) == parte)
        resultado.push(parte);
      else
        resultado.push(parte.charAt(0).toUpperCase() + parte.slice(1).toLowerCase());
    }
    let formatted = BASE_PATH + resultado.join('/');
    if(Link_Termina_ComBarra == true)
    {
      if (!formatted.endsWith('/')) 
        formatted += '/';
    }
    return formatted;
  }

  static extrairMangaCap(path) 
  {
    // Remove o BASE_PATH do início, se existir
    let cleanPath = path;
    if (cleanPath.startsWith(BASE_PATH)) {
      cleanPath = cleanPath.slice(BASE_PATH.length);
    }
    const partes = cleanPath.toLowerCase().split('/').filter(Boolean);
    let mangaId = null, capId = null;

    if (partes[0] === 'manga' && partes[1]) 
    {
      mangaId = partes[1];
      if (partes[2] === 'cap' && partes[3]) 
        capId = partes[3];
    }
    return { mangaId, capId };
  }

  static async verificarManga(mangaId) 
  {
    return await verificarManga_Utils(mangaId);
  }

  static async verificarCap(mangaId, capId) 
  {
    return await verificarCap_Utils(mangaId, capId);
  }

  static extrairPagina(path) {
    // Remove o BASE_PATH do início, se existir
    let cleanPath = path;
    if (cleanPath.startsWith(BASE_PATH)) {
      cleanPath = cleanPath.slice(BASE_PATH.length);
    }
    const partes = cleanPath.split('/').filter(Boolean);
    if (partes.length > 0) return partes[0].toLowerCase();
    return 'home';
  }
}

class Router {
  static async existeJsPagina(pagina) 
  {
    try 
    {
      const resp = await fetch(BASE_PATH + `Assets/js/${pagina}.js`, { method: 'HEAD' });
      return resp.ok;
    } 
    catch 
    {
      return false;
    }
  }

  static atualizarUrlFormatada(path) 
  {
    const formattedPath = LinkVerifier.formatarLink(path);
    // Só atualiza a URL se ela for diferente da atual, evitando recarregamento desnecessário
    if (window.location.pathname !== formattedPath)
        window.history.pushState({}, '', formattedPath);

  }

  static async navegar(pagina, params = []) 
  {
    if( pagina == null || pagina == undefined || pagina == '404' ||params == null || params == undefined || !Array.isArray(params))
    {
      pagina = '404';
      params = [];
      mostrarHeader(false);
      mostrarFooter(false);
    }

    let path;
    if (pagina.toLowerCase() === 'cap' && params.length === 2) 
      path = `/Manga/${params[0]}/Cap/${params[1]}`;
    else if (pagina.toLowerCase() === 'manga' && params.length === 1)
      path = `/Manga/${params[0]}`;
    else 
    {
      pagina = pagina.toLowerCase();
      path = '/' + pagina;
      if (Array.isArray(params) && params.length > 0)
          path += '/' + params.join('/');
    }
    
    Router.atualizarUrlFormatada(path);
    await PageLoader.carregarCss(pagina);

    // Sempre carrega o JS da página 404 ao navegar para ela
    if (pagina === '404') {
      PageLoader.carregarJs('404', []);
      return;
    }

    // Só importa o JS se realmente existir
    if (await Router.existeJsPagina(pagina) === true)
    {
      if(params.length > 0 || params == [])
        PageLoader.carregarJs(pagina, params);
      else
        PageLoader.carregarJs(pagina);
    }
}

  static async router() 
  {
    inserirHeaderFooter();
    let path = window.location.pathname;
    const pagina = LinkVerifier.extrairPagina(path);
    const partes = path.split('/').filter(Boolean);
    const { mangaId, capId } = LinkVerifier.extrairMangaCap(path);

    // Se for arquivo estático, não navega SPA
    if (window.location.pathname.includes('.'))
      return;

    // Mangá e capítulo
    if (mangaId) 
      {
      const mangaExiste = await verificarManga_Utils(mangaId);
      if (!mangaExiste) 
        return Router.navegar('404', []);
      if (capId) 
      {
        const capExiste = await verificarCap_Utils(mangaId, capId);
        if (!capExiste) 
          return Router.navegar('404', []);
        return Router.navegar('cap', [mangaId, capId]);
      }
      return Router.navegar('manga', [mangaId]);
    }
    // Corrigir: qualquer rota vazia, '/', '/Site-Manga/' ou equivalente navega para home
    if (!pagina || pagina === '' || pagina === BASE_PATH.replace(/\//g, '') || window.location.pathname === '/' || window.location.pathname === BASE_PATH || window.location.pathname === BASE_PATH.slice(0, -1))
      return Router.navegar('home', []);
    if (await Router.existeJsPagina(pagina))
      return Router.navegar(pagina, []);
    return Router.navegar('404', []);
  }
}

// Garante que a div conteudo existe SEMPRE no app
function garantirConteudoDiv() 
{
  let conteudo = document.getElementById('conteudo');

  if (conteudo === null)
  {
    conteudo = document.createElement('div');
    conteudo.id = 'conteudo';
    document.getElementById('app').appendChild(conteudo);
  }

  return conteudo;
}

document.addEventListener('DOMContentLoaded', () => {
  garantirConteudoDiv();
});

window.addEventListener('popstate', Router.router);
window.addEventListener('DOMContentLoaded', Router.router);

const res = await fetch(BASE_PATH + 'Assets/conteudo.json');