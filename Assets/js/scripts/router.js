import { inserirHeaderFooter } from '/Assets/js/scripts/layout.js';
import { verificarManga_Utils, verificarCap_Utils } from '/Assets/js/scripts/mangautils.js';

const Link_Termina_ComBarra = false; // Define Se o link termina com barra ou não

class PageLoader 
{
  static async carregarCss(pagina) 
  {
    document.querySelectorAll('link[id^="css-"]').forEach(link => link.remove());
    await new Promise(res => {
      const link = document.createElement('link');
      link.id = `css-${pagina}`;
      link.rel = 'stylesheet';
      link.href = `/Assets/css/${pagina}.css`;
      link.onload = res;
      document.head.appendChild(link);
    });
  }

  static carregarJs(pagina, params) 
  {
    fetch(`/Assets/js/${pagina.toLowerCase()}.js`, { method: 'HEAD' })
      .then(resp => 
      {
        if (resp.ok) 
        {
          import(`/Assets/js/${pagina.toLowerCase()}.js`).then(mod => 
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
  // Formata o link para que cada segmento tenha a primeira letra maiúscula
  static formatarLink(path) 
  {
    const partes = path.split('/').filter(parte => parte.length > 0);
    const resultado = [];

    for (let i = 0; i < partes.length; i++) 
    {
      const parte = partes[i];

      if (Number(parte) == parte)
        resultado.push(parte);
      else
        resultado.push(parte.charAt(0).toUpperCase() + parte.slice(1).toLowerCase());
    }

    let formatted = '/' + resultado.join('/');

    if(Link_Termina_ComBarra == true)
    {
      if (!formatted.endsWith('/')) 
        formatted += '/';
    }

    return formatted;
  }

  static extrairMangaCap(path) 
  {
    const partes = path.toLowerCase().split('/').filter(Boolean);
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

}

class Router {
  static async existeJsPagina(pagina) 
  {
    try 
    {
      const resp = await fetch(`/Assets/js/${pagina}.js`, { method: 'HEAD' });
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
    if (window.location.pathname !== formattedPath) {
        window.history.pushState({}, '', formattedPath);
    }
  }

  static async navegar(pagina, params = []) 
  {
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
    const conteudo = garantirConteudoDiv();
    conteudo.style.display = '';
    conteudo.innerHTML = '';
    document.getElementById('app').style.visibility = 'hidden';
    await PageLoader.carregarCss(pagina);
    inserirHeaderFooter(pagina);
    document.getElementById('app').style.visibility = 'visible';

    // Só importa o JS se realmente existir
    if (await Router.existeJsPagina(pagina) === true)
      PageLoader.carregarJs(pagina, params.length > 0 ? params : []);
}

  static async router() 
  {
    let path = LinkVerifier.formatarLink(window.location.pathname);
    const partes = path.split('/').filter(Boolean); // filter tira as partes vazias
    const pagina = (partes[0] || 'home').toLowerCase();
    const { mangaId, capId } = LinkVerifier.extrairMangaCap(path); // pois retorna mangaId, capId

    // Se for arquivo estático, não navega SPA
    if (window.location.pathname.includes('.'))
      return;

    // Mangá e capítulo
    if (mangaId !== null && mangaId !== '' && mangaId !== undefined && mangaId !== 'undefined')
   {
      const mangaExiste = await verificarManga_Utils(mangaId);

      if (mangaExiste === false) 
        return Router.navegar('404', []);

      if (capId !== null && capId !== '' && capId !== undefined && capId !== 'undefined') 
      {
        const capExiste = await verificarCap_Utils(mangaId, capId);

        if (capExiste === false)
          return Router.navegar('404', []);

        return Router.navegar('cap', [mangaId, capId]);
      }

      return Router.navegar('manga', [mangaId]);
    }

    // Página JS existe?
    if (await Router.existeJsPagina(pagina) === true)
      return Router.navegar(pagina, []);

    return Router.navegar('404', []); // Se nada foi encontrado, envia para 404
  }
}

// Garante que a div conteudo existe SEMPRE no app
function garantirConteudoDiv() {
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

const res = await fetch('/Assets/conteudo.json');