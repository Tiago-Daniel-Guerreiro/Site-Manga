function mostrarContacto() 
{
    const conteudo = document.getElementById('conteudo');

    if (conteudo === null)
        return;

    conteudo.innerHTML = '';

    const htmlPadrao =
        '<div class="container">' +
        '<h2>Contacto</h2>' +
        '<p>Erro ao carregar o formulário de contacto.</p>' +
        '</div>';

    fetch('/Assets/conteudo.json')
        .then(function(res) 
        {
            if (res.ok === true)
                return res.json();

            return Promise.reject();
        })
        .then(function(data) 
        {
            if (data === null || data['contacto'] === undefined || data['contacto'] === null)
            {
                conteudo.innerHTML = htmlPadrao;
                return;
            }

            const campos = data['contacto'].campos;

            if (Array.isArray(campos) === false || campos.length === 0)
            {
                conteudo.innerHTML = htmlPadrao;
                return;
            }

            let formHtml = '<form id="form-contato" class="contato-form">';
            for (let i = 0; i < campos.length; i++) 
            {
                const campo = campos[i];
                formHtml += '<label for="' + campo.nome + '">' + campo.label + ':</label>';

                if (campo.tipo === 'textarea') 
                {
                    let textareaHtml = '<textarea id="' + campo.nome + '" name="' + campo.nome + '" rows="5"';
                    
                    if (campo.obrigatorio === true)
                        textareaHtml += ' required';

                    textareaHtml += '></textarea>';
                    formHtml += textareaHtml;
                }
                else
                {
                    let inputHtml = '<input type="' + campo.tipo + '" id="' + campo.nome + '" name="' + campo.nome + '"';
                    
                    if (campo.obrigatorio === true)
                        inputHtml += ' required';

                    inputHtml += '>';
                    formHtml += inputHtml;
                }
            }
            formHtml += '<button type="submit">Enviar</button></form>';
            conteudo.innerHTML =
                '<div class="container contato-container">' +
                '<h2 class="contato-title">Contacto</h2>' +
                '<p>Use o formulário abaixo para entrar em contato com a equipa do site.</p>' +
                formHtml +
                '</div>';

            const form = document.getElementById('form-contato');

            if (form === null)              
                return;

            form.addEventListener('submit', function (e) 
            {
                e.preventDefault();
                if(document.getElementById('nome').value.trim() === '' ||
                   document.getElementById('email').value.trim() === '' ||
                   document.getElementById('mensagem').value.trim() === '') 
                {
                    window.alert('Por favor, preencha todos os campos obrigatórios.');
                    return;
                }

                var dados = {
                    nome: document.getElementById('nome').value,
                    email: document.getElementById('email').value,
                    mensagem: document.getElementById('mensagem').value
                };
                console.log('Dados do formulário:', dados);
                window.alert('Mensagem enviada com sucesso!');
                form.reset();
            });
        })
        .catch(function() 
        {
            conteudo.innerHTML = htmlPadrao;
        });
}

document.addEventListener('DOMContentLoaded', mostrarContacto);

if (document.readyState !== 'loading')
{
    mostrarContacto();
}