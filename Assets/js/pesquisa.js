import { ObterListaDeIdsValidos, ObterTituloPeloId, ObterCapaPeloId } from './scripts/mangautils.js';

function renderPesquisa() 
{
    const conteudo = document.getElementById('conteudo');

    if (conteudo === null)
        return;

    conteudo.innerHTML = `
        <div class="pesquisa-container">
            <h1 class="pesquisa-title">Pesquisar Mangá</h1>
            <form class="pesquisa-form" onsubmit="return false;">
                <input id="pesquisa-input" type="text" placeholder="Digite o nome do mangá..." autocomplete="off" />
                <button type="submit">Pesquisar</button>
            </form>
            <div id="pesquisa-resultado"></div>
        </div>
    `;

    const input = document.getElementById('pesquisa-input');
    const resultado = document.getElementById('pesquisa-resultado');
    const form = conteudo.querySelector('.pesquisa-form');

    if (input === null || resultado === null || form === null)
        return;

    form.addEventListener('submit', pesquisar);
    input.addEventListener('input', function(e) 
    {
        if (input.value.trim() === '')
            resultado.innerHTML = '';
    });

    async function pesquisar(e) 
    {
        if (e !== undefined && e !== null)
            e.preventDefault();

        const ValorPesquisado = input.value.trim().toLowerCase();

        if (ValorPesquisado === '')
        {
            resultado.innerHTML = '';
            return;
        }

        let ids = [];

        try 
        {
            ids = await ObterListaDeIdsValidos();
        }
        catch (err)
        {
            resultado.innerHTML = '<p>Erro ao buscar mangás.</p>';
            return;
        }

        let encontrados = [];

        for (let i = 0; i < ids.length; i++)
        {
            const id = ids[i];
            let titulo = '';

            try 
            {
                titulo = await ObterTituloPeloId(id);
            }
            catch (err)
            {
                continue;
            }

            if (titulo === '')
                continue;

            if (titulo.toLowerCase().includes(ValorPesquisado))
                encontrados.push({ id: id, titulo: titulo });
        }

        if (encontrados.length === 0)
        {
            resultado.innerHTML = '<p>Nenhum mangá encontrado.</p>';
            return;
        }

        let html = '';
        for (let i = 0; i < encontrados.length; i++)
        {
            const manga = encontrados[i];
            html += `<div style="display:flex;align-items:center;margin-bottom:8px;">
                <img src="${ObterCapaPeloId(manga.id)}" alt="Capa">
                <a href="/Manga/${manga.id}"><strong>${manga.titulo}</strong></a>
            </div>`;
        }
        resultado.innerHTML = html;
    }
}

if (document.readyState !== 'loading')
    renderPesquisa();

document.addEventListener('DOMContentLoaded', renderPesquisa);