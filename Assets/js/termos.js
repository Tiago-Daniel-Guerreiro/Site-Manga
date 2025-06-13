import { BASE_PATH } from './scripts/config.js';

function mostrarTermos() 
{
    const conteudo = document.getElementById('conteudo');

    if (conteudo === null)
        return;

    const html_padrao = `
        <div class="container">
            <h2>Termos de Uso</h2>
            <p>Erro ao carregar conteúdo.</p>
        </div>
    `;

    conteudo.innerHTML = '';

    fetch(BASE_PATH + 'Assets/conteudo.json')
        .then(function(res) 
        {
            return res.json();
        })
        .then(function(dados) 
        {
            if (dados === null)
                return conteudo.innerHTML = html_padrao;

            if (dados.termos === undefined || dados.termos === null)
                return conteudo.innerHTML = html_padrao;

            let PartesHTML = '';

            if (Array.isArray(dados.termos.secoes) && dados.termos.secoes.length > 0)
            {
                for (let i = 0; i < dados.termos.secoes.length; i++)
                {
                    const ParteHTML = dados.termos.secoes[i];

                    if (ParteHTML.titulo !== undefined && ParteHTML.titulo !== null && ParteHTML.titulo !== '')
                        PartesHTML += `<h2>${ParteHTML.titulo}</h2>`;

                    if (ParteHTML.texto !== undefined && ParteHTML.texto !== null && ParteHTML.texto !== '')
                        PartesHTML += `<p>${ParteHTML.texto}</p>`;
                }
            }

            let titulo = '';
            if (dados.termos.titulo !== undefined && dados.termos.titulo !== null && dados.termos.titulo !== '')
                titulo = dados.termos.titulo;

            let contato = '';
            if (dados.termos.contato !== undefined && dados.termos.contato !== null && dados.termos.contato !== '')
                contato = dados.termos.contato;

            conteudo.innerHTML = `
                <div class="termos-container">
                    <h1 class="termos-title">${titulo}</h1>
                    ${PartesHTML}
                    <p>${contato}</p>
                </div>
            `;
        })
        .catch(function() 
        {
            conteudo.innerHTML = html_padrao;
        });
}

document.addEventListener('DOMContentLoaded', mostrarTermos);

if (document.readyState !== 'loading')
    mostrarTermos();
