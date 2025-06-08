export function inserirHeaderFooter(pagina) 
{
    if (pagina === "404") // Não insere header/footer em páginas de erro
        return;

    const cabecalho = document.getElementById('main-header');
    const rodape = document.getElementById('footer');

    if (cabecalho === null)
        return;

    cabecalho.classList.remove('oculto');
    cabecalho.innerHTML = `
        <nav>
            <table class="menu-table"><tr>
                <td><a href="/" data-link="spa">Home</a></td>
                <td><a href="/Pesquisa" data-link="spa">Pesquisa</a></td>
                <td><a href="/Recrutamento" data-link="spa">Recrutamento</a></td>
                <td><a href="/Links" data-link="spa">Links</a></td>
            </tr></table>
        </nav>
    `;

    if (rodape !== null)
    {
        rodape.classList.remove('oculto');
        rodape.innerHTML = `
            <nav>
                <table class="menu-table"><tr>
                    <td><a href="/Termos" data-link="spa">Termos</a></td>
                    <td><a href="/Contacto" data-link="spa">Contacto</a></td>
                </tr></table>
            </nav>
        `;
    }

    if (window._headerScrollListener !== undefined && window._headerScrollListener !== null)
        window.removeEventListener('scroll', window._headerScrollListener);

    let ultimoScroll = window.scrollY;

    window._headerScrollListener = function () 
    {
        if (window.scrollY > ultimoScroll && window.scrollY > 60)
            cabecalho.classList.add('header-oculto');
        else
            cabecalho.classList.remove('header-oculto');

        ultimoScroll = window.scrollY;
    };

    window.addEventListener('scroll', window._headerScrollListener);

    cabecalho.classList.remove('header-oculto');
}

export function mostrarFooter(ativo = true)
{
    const rodape = document.getElementById('footer');

    if (rodape === null)
        return;

    rodape.classList.toggle('oculto', !ativo);
}