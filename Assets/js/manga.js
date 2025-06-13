import { redirecionarPara404, ObterCapsPeloId, ObterInfoPeloId } from './scripts/mangautils.js';
import { BASE_PATH } from './scripts/config.js';

export async function init(mangaId) 
{
    const conteudo = document.getElementById('conteudo');

    if (conteudo === null)
        return;

    conteudo.innerHTML = `
        <div class="manga-container">
            <div id="manga-info"></div>
            <section id="capitulos-section" style="display:none;">
                <h2>Capítulos</h2>
                <table id="capitulos-table">
                    <thead>
                        <tr><th>Capítulo</th><th>Data</th><th>Ler</th></tr>
                    </thead>
                    <tbody></tbody>
                </table>
            </section>
        </div>
    `;

    async function carregarInfo() 
    {
        let info = null;

        try 
        {
            info = await ObterInfoPeloId(mangaId);
        } 
        catch (e) 
        {
            redirecionarPara404();
            return null;
        }

        if (info === null || (info.Titulo === undefined || info.Titulo === null))
            return redirecionarPara404();

        const mangaInfoDiv = document.getElementById('manga-info');

        if (mangaInfoDiv === null)
            return redirecionarPara404();

        let categoriasHtml = '';

        if (Array.isArray(info.Categorias) && info.Categorias.length > 0)
        {
            for (let i = 0; i < info.Categorias.length; i++)
            {
                categoriasHtml += '<span class="categorias">' + info.Categorias[i] + '</span>';
            }
        }

        mangaInfoDiv.innerHTML = `
            <div class="manga-header">
                <img src="${BASE_PATH}Mangas/${mangaId}/Capa.webp" alt="Capa" class="capa">
                <div class="manga-details">
                    <h1>${info.Titulo}</h1>
                    <p><strong>Autor:</strong> ${info.Autor}</p>
                    <p>
                        <strong>Categorias:</strong>
                        ${categoriasHtml}
                    </p>
                    <div class="sinopse"><strong>Sinopse:</strong> ${info.Sinopse}</div>
                </div>
            </div>
        `;

        return info;
    }

    async function listarCapitulos() 
    {
        let capitulos = [];

        try 
        {
            capitulos = await ObterCapsPeloId(mangaId);
        } 
        catch (e) 
        {
            capitulos = [];
        }

        const tbody = document.querySelector('#capitulos-table tbody');

        if (tbody === null)
            return;

        tbody.innerHTML = '';

        if (Array.isArray(capitulos) && capitulos.length > 0)
        {
            for (let i = 0; i < capitulos.length; i++)
            {
                const cap = capitulos[i];
                let data = 'Desconhecida';
                if (cap.data !== undefined && cap.data !== null && cap.data !== '')
                    data = cap.data;

                tbody.innerHTML += `
                    <tr>
                        <td>${cap.nome}</td>
                        <td>${data}</td>
                        <td><a class="btn-cap" href="${BASE_PATH}Manga/${mangaId}/Cap/${cap.nome}" data-link="spa">Ler</a></td>
                    </tr>
                `;
            }
        }
        else
        {
            tbody.innerHTML = `
                <tr><td colspan="3" style="color:#ffb347;text-align:center;">Nenhum capítulo encontrado.</td></tr>
            `;
        }
    }

    const info = await carregarInfo();

    if (info === null)
        return;

    await listarCapitulos();

    const capitulosSection = document.getElementById('capitulos-section');

    if (capitulosSection !== null)
        capitulosSection.style.display = '';
}