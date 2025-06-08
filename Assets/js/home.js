import { ObterListaDeIdsValidos, ObterTituloPeloId, ObterCapaPeloId } from './scripts/mangautils.js';

html_erro = '<div>Erro ao carregar mangás.</div>';

async function CarregarHome() 
{
    const conteudo = document.getElementById('conteudo');

    if (conteudo === null)
        return;

    conteudo.innerHTML = '';

    let tituloHome = 'Leitor de Mangás';
    try 
    {
        const res = await fetch('/Assets/conteudo.json');
        if (res.ok === true)
        {
            const data = await res.json();

            if (data !== null)
            {
                if (data.home !== undefined && data.home !== null)
                {
                    if (data.home.titulo !== undefined && data.home.titulo !== null && data.home.titulo !== '')
                        tituloHome = data.home.titulo;
                }
            }
        }
    }
    catch {}

    conteudo.innerHTML = `
        <div class="home-container">
            <h1 class="home-title">${tituloHome}</h1>
            <div id="mangas-tabela-container"></div>
        </div>
    `;

    const tabelaContainer = document.getElementById('mangas-tabela-container');

    if (tabelaContainer === null)
        return;

    let ids = [];

    try 
    {
        ids = await ObterListaDeIdsValidos();
    } 
    catch { }

    if (Array.isArray(ids) !== true || ids.length === 0) 
    {
        tabelaContainer.innerHTML = html_erro;
        return;
    }

    const mangas = [];
    for (let i = 0; i < ids.length; i++) 
    {
        const id = ids[i];
        let titulo = await ObterTituloPeloId(id);
        if (titulo === null || titulo === undefined || titulo === '') 
            continue;

        mangas.push({
            id: id,
            titulo: titulo,
            capa: ObterCapaPeloId(id)
        });
    }

    if (mangas.length === 0) 
    {
        tabelaContainer.innerHTML = html_erro;
        return;
    }

    let html = '';
    html += `<table id="mangas-table">
        <thead>
            <tr><th>Capa</th><th>Nome</th></tr>
        </thead>
        <tbody>`;

    for (let i = 0; i < mangas.length; i++) 
    {
        const manga = mangas[i];
        html += `<tr>
            <td><img src="${manga.capa}" alt="Capa" class="capa"></td>
            <td><a href="/Manga/${manga.id}" class="nome-manga">${manga.titulo}</a></td>
        </tr>`;
    }

    html += '</tbody></table>';
    tabelaContainer.innerHTML = html;
}

document.addEventListener('DOMContentLoaded', CarregarHome);

if (document.readyState !== 'loading')
    CarregarHome();