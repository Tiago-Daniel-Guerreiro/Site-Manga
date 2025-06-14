import { BASE_PATH } from './config.js';

// Garante que o DOM esteja pronto antes de executar a função
function domReady(callback)
{
    if (document.readyState === 'loading')
    {
        document.addEventListener('DOMContentLoaded', callback);
        return;
    }
    
    callback();
}

export function inserirHeaderFooter(pagina)
{
    domReady(function()
    {
        if (pagina === "404")
            return;

        const cabecalho = document.getElementById('header');
        if (cabecalho === null)
            return;

        const rodape = document.getElementById('footer');
        if (rodape === null)
            return;

        rodape.classList.remove('oculto');
        rodape.innerHTML =
            '<nav>' +
            '<table class="menu-table"><tr>' +
            `<td><a href="${BASE_PATH}Termos" data-link="spa">Termos</a></td>` +
            `<td><a href="${BASE_PATH}Contacto" data-link="spa">Contacto</a></td>` +
            '</tr></table>' +
            '</nav>';

        cabecalho.classList.remove('oculto');
        cabecalho.innerHTML =
            '<nav>' +
            '<table class="menu-table"><tr>' +
            `<td><a href="${BASE_PATH}Home" data-link="spa">Home</a></td>` +
            `<td><a href="${BASE_PATH}Pesquisa" data-link="spa">Pesquisa</a></td>` +
            `<td><a href="${BASE_PATH}Recrutamento" data-link="spa">Recrutamento</a></td>` +
            `<td><a href="${BASE_PATH}Links" data-link="spa">Links</a></td>` +
            '</tr></table>' +
            '</nav>';
    });
}

export function mostrarHeader(ativo)
{
    const cabecalho = document.getElementById('header');

    if (cabecalho === null)
        return;

    if (ativo === true)
    {
        cabecalho.classList.remove('oculto');
        return;
    }

    cabecalho.classList.add('oculto');
}

export function mostrarFooter(ativo)
{
    const rodape = document.getElementById('footer');

    if (rodape === null)
        return;

    if (ativo === true)
    {
        rodape.classList.remove('oculto');
        return;
    }

    rodape.classList.add('oculto');
}