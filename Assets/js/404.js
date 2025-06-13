import { BASE_PATH } from './scripts/config.js';

export function init() 
{
    let container = document.getElementById('conteudo');

    if (container === null)
    {
        container = document.createElement('div');
        container.id = 'conteudo';
        const app = document.getElementById('app');

        if (app !== null)
            app.appendChild(container);
        else
            return;
    }
    container.innerHTML = '';

    const htmlPadrao = `
        <div class="container">
            <h2>Erro 404</h2>
            <p class="Message_404">Página não encontrada.</p>
            <div class="center-text">
                <a id="voltar-home" class="nav-btn center" href="${BASE_PATH}" data-link="spa">Voltar para Home</a>
            </div>
        </div>
    `;

    fetch(BASE_PATH + 'Assets/conteudo.json')
        .then(function(res) 
        {
            if (res.ok === true)
                return res.json();

            return Promise.reject();
        })
        .then(function(data) 
        {
            let msg = null;
            let link = null;

            if (data !== null)
            {
                if (data['404'] !== undefined && data['404'] !== null)
                {
                    msg = data['404'];
                    
                    if (msg.link !== undefined && msg.link !== null)
                        link = msg.link;
                }
            }

            if (
                msg === null ||
                msg.titulo === undefined || msg.titulo === null ||
                msg.mensagem === undefined || msg.mensagem === null ||
                link === null ||
                link.texto === undefined || link.texto === null ||
                link.pagina === undefined || link.pagina === null
            )
            {
                container.innerHTML = htmlPadrao;
                return;
            }

            container.innerHTML = `
                <div class="container">
                    <h2>${msg.titulo}</h2>
                    <p class="Message_404">${msg.mensagem}</p>
                    <div class="center-text">
                        <a id="voltar-home" class="nav-btn center" href="${BASE_PATH + link.pagina.replace(/^\//, '')}" data-link="spa">${link.texto}</a>
                    </div>
                </div>
            `;
        })
        .catch(function() 
        {
            container.innerHTML = htmlPadrao;
        });
}
