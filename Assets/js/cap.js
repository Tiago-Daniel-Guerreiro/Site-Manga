import { redirecionarPara404, verificarManga_Utils, verificarCap_Utils } from './scripts/mangautils.js';
import { BASE_PATH } from './scripts/config.js';

export function init(mangaId, capId) 
{
    const conteudo = document.getElementById('conteudo');

    if (conteudo === null)
        return;

    conteudo.innerHTML = `
        <div class="container-cap">
            <h1 id="titulo"></h1>
            <div id="nav-top"></div>
            <div id="paginas"></div>
            <div id="nav-bottom"></div>
        </div>
    `;

    let maxCapitulos = null;
    let infoManga = null;
    let PrimeiraImagemIgualAZero = null;

    async function carregarTextosCap() 
    {
        try 
        {
            const res = await fetch(BASE_PATH + 'Assets/conteudo.json');
            const data = await res.json();

            if (data.cap === undefined || data.cap === null)
                throw new Error();

            window.textosCap = data.cap;
        } 
        catch 
        {
            window.textosCap = {
                anterior: '\u25c0', // ◀
                proximo: '\u25b6', // ▶
                voltar: 'Voltar ao Manga' 
            };
        }
    }

    async function carregarTitulo() 
    {
        try 
        {
            const resposta = await fetch(`/Mangas/${mangaId}/Info.json`);
            infoManga = await resposta.json();
            const tituloEl = document.getElementById('titulo');

            if (tituloEl !== null)
                tituloEl.textContent = infoManga.Titulo + ' - Cap ' + capId;

            document.title = infoManga.Titulo + ' - Capítulo ' + capId;

            if (infoManga.Capitulos !== null && Array.isArray(infoManga.Capitulos) && infoManga.Capitulos.length > 0)
                maxCapitulos = infoManga.Capitulos.length;
        } 
        catch 
        {
            const tituloEl = document.getElementById('titulo');

            if (tituloEl !== null)
                tituloEl.textContent = 'Capítulo ' + capId;
        }
    }

    function criarNavegacao(idDiv, existeAnterior, existeProximo) 
    {
        const nav = document.getElementById(idDiv);

        if (nav === null)
            return;

        nav.className = 'nav';
        const textos = window.textosCap;

        let btnAnterior = '<a class="nav-btn disabled" tabindex="-1">' + textos.anterior + '</a>';
        let btnProximo = '<a class="nav-btn disabled" tabindex="-1">' + textos.proximo + '</a>';

        if (existeAnterior === true)
            btnAnterior = '<a class="nav-btn" href="/Manga/' + mangaId + '/Cap/' + (parseInt(capId, 10) - 1) + '" data-link="spa">' + textos.anterior + '</a>';

        if (existeProximo === true)
            btnProximo = '<a class="nav-btn" href="/Manga/' + mangaId + '/Cap/' + (parseInt(capId, 10) + 1) + '" data-link="spa">' + textos.proximo + '</a>';

        const btnManga = '<a class="nav-btn center" href="/manga/' + mangaId + '" data-link="spa">' + textos.voltar + '</a>';
        nav.innerHTML = btnAnterior + btnManga + btnProximo;
    }

    function verificaImagem(url) 
    {
        return new Promise(function(resolve) 
        {
            const imagem = new window.Image();
            imagem.onload = function() { resolve(true); };
            imagem.onerror = function() { resolve(false); };
            imagem.src = url;
        });
    }

    async function carregarPaginas() 
    {
        const mangaValido = await verificarManga_Utils(mangaId);

        if (mangaValido !== true)
        {
            redirecionarPara404();
            return;
        }

        const divPaginas = document.getElementById('paginas');

        if (divPaginas === null)
            return;

        divPaginas.innerHTML = '';

        PrimeiraImagemIgualAZero = true;
        let indice = 0;

        const primeiraExiste = await verificaImagem('/Mangas/' + mangaId + '/Cap/' + capId + '/0.webp');

        if (primeiraExiste !== true)
        {
            PrimeiraImagemIgualAZero = false;
            indice = 1;
        }

        while (true)
        {
            const urlImg = '/Mangas/' + mangaId + '/Cap/' + capId + '/' + indice + '.webp';
            const existe = await verificaImagem(urlImg);
            
            if (existe !== true)
                break;

            const img = document.createElement('img');
            img.src = urlImg;
            img.alt = 'Página ' + indice;
            divPaginas.appendChild(img);
            indice++;
        }
    }

    async function carregarBotoes() 
    {
        const existeAnterior = await verificarCap_Utils(mangaId, Number(capId) - 1);
        const existeProximo = await verificarCap_Utils(mangaId, Number(capId) + 1);

        criarNavegacao('nav-top', existeAnterior, existeProximo);
        criarNavegacao('nav-bottom', existeAnterior, existeProximo);
    }

    (async function() 
    {
        await carregarTextosCap();
        const capExiste = await verificarCap_Utils(mangaId, capId);

        if (capExiste !== true)
        {
            redirecionarPara404();
            return;
        }
        
        await carregarTitulo();
        await carregarBotoes();
        await carregarPaginas();
    })();
}