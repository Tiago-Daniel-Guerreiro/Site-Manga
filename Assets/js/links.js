import { BASE_PATH } from './scripts/config.js';

function mostrarLinks() 
{
    const conteudo = document.getElementById('conteudo');

    if (conteudo === null)
        return;

    conteudo.innerHTML = '';

    fetch(BASE_PATH + 'Assets/conteudo.json')
        .then(function(resposta) 
        {
            return resposta.json();
        })
        .then(function(dados) 
        {
            let links = [];

            if (Array.isArray(dados.links) && dados.links.length > 0)
                links = dados.links;

            let listaHtml = '<ul class="links-list">';

            for (let i = 0; i < links.length; i++)
            {
                const link = links[i];

                let texto = 'Link';
                
                if (link.texto !== undefined && link.texto !== null && link.texto !== '')
                    texto = link.texto;
                else if (link.nome !== undefined && link.nome !== null && link.nome !== '')
                    texto = link.nome;

                let url = '#';

                if (link.link !== undefined && link.link !== null && link.link !== '')
                    url = link.link;

                let corFundo = '';

                if (link.corFundo !== undefined && link.corFundo !== null && link.corFundo !== '')
                    corFundo = link.corFundo;

                let corTexto = '';

                if (link.corTexto !== undefined && link.corTexto !== null && link.corTexto !== '')
                    corTexto = link.corTexto;

                let corTextoPressionado = '';

                if (link.corTextoPressionado !== undefined && link.corTextoPressionado !== null && link.corTextoPressionado !== '')
                    corTextoPressionado = link.corTextoPressionado;

                let style = '';

                if (corFundo !== '')
                    style += 'background: ' + corFundo + ';';

                if (corTexto !== '')
                    style += 'color: ' + corTexto + ';';

                let dataPressed = '';

                if (corTextoPressionado !== '')
                    dataPressed = 'data-pressed-color="' + corTextoPressionado + '"';

                listaHtml += '<li>' +
                    '<a href="' + url + '" target="_blank" class="link-btn" style="' + style + '" ' + dataPressed + '>' +
                    texto +
                    '</a>' +
                    '</li>';
            }

            listaHtml += '</ul>';

            conteudo.innerHTML = 
                '<div class="links-container">' +
                '<h1 class="links-title">Links</h1>' +
                listaHtml +
                '</div>';

            const botoes = document.querySelectorAll('.link-btn[data-pressed-color]');

            for (let i = 0; i < botoes.length; i++)
            {
                const btn = botoes[i];
                const pressedColor = btn.getAttribute('data-pressed-color');

                if (pressedColor !== null && pressedColor !== '')
                {
                    btn.setAttribute('data-original-color', btn.style.color);

                    btn.addEventListener('mouseenter', function() 
                    {
                        btn.style.color = pressedColor;
                    });

                    btn.addEventListener('mouseleave', function() 
                    {
                        btn.style.color = btn.getAttribute('data-original-color');
                    });

                    btn.addEventListener('mousedown', function() 
                    {
                        btn.style.color = pressedColor;
                    });

                    btn.addEventListener('mouseup', function() 
                    {
                        btn.style.color = pressedColor;
                    });
                }
            }
        })
        .catch(function() 
        {
            conteudo.innerHTML = '<p>Erro ao carregar os links.</p>';
        });
}

document.addEventListener('DOMContentLoaded', mostrarLinks);

if (document.readyState !== 'loading')
    mostrarLinks();
