import { BASE_PATH } from './scripts/config.js';

function main() 
{
    const conteudo = document.getElementById('conteudo');

    if (conteudo === null)
        return;

    const html_padrao = `
        <div class="container">
            <h2>Recrutamento</h2>
            <p>Erro ao carregar conteúdo.</p>
        </div>
    `;

    conteudo.innerHTML = '';

    fetch(BASE_PATH + 'Assets/conteudo.json')
        .then(function(res) 
        {
            return res.json();
        })
        .then(function(data) 
        {
            if (data === null)
                return conteudo.innerHTML = html_padrao;

            if (data.recrutamento === undefined || data.recrutamento === null)
                return conteudo.innerHTML = html_padrao;

            let info = '';
            if (data.recrutamento.descricao !== undefined && data.recrutamento.descricao !== null && data.recrutamento.descricao !== '')
                info = data.recrutamento.descricao;

            let campos = [];
            if (Array.isArray(data.recrutamento.campos) && data.recrutamento.campos.length > 0)
                campos = data.recrutamento.campos;

            let requisitosPorFuncao = {};
            if (data.recrutamento.requisitos !== undefined && data.recrutamento.requisitos !== null)
                requisitosPorFuncao = data.recrutamento.requisitos;

            let nomeHtml = '';
            let contactoHtml = '';
            let selectHtml = '';
            let requisitosHtml = '';
            let motivosHtml = '';
            let experienciaHtml = '';

            for (let i = 0; i < campos.length; i++)
            {
                const campo = campos[i];

                if (campo.nome === 'nome')
                {
                    nomeHtml = `<label>${campo.label}:<br><input type="${campo.tipo}" name="${campo.nome}"`;

                    if (campo.obrigatorio === true)
                        nomeHtml += ' required';

                    nomeHtml += `></label>`;
                }

                if (campo.nome === 'contacto')
                {
                    contactoHtml = `<label>${campo.label}:<br><input type="${campo.tipo}" name="${campo.nome}"`;
                    
                    if (campo.obrigatorio === true)
                        contactoHtml += ' required';

                    contactoHtml += `></label>`;
                }

                if (campo.tipo === 'select')
                {
                    selectHtml = `<label>${campo.label}:<br>`;
                    selectHtml += `<select name="${campo.nome}" id="funcao-select"`;

                    if (campo.obrigatorio === true)
                        selectHtml += ' required';
                    
                    selectHtml += '>';

                    if (Array.isArray(campo.opcoes) && campo.opcoes.length > 0)
                    {
                        for (let j = 0; j < campo.opcoes.length; j++)
                        {
                            selectHtml += `<option value="${campo.opcoes[j]}">${campo.opcoes[j]}</option>`;
                        }
                    }
                    
                    selectHtml += `</select></label>`;
                    requisitosHtml = '<div id="requisitos"></div>';
                }

                if (campo.nome === 'motivos')
                {
                    motivosHtml = `<label>${campo.label}:<br><textarea name="${campo.nome}" rows="3"`;

                    if (campo.obrigatorio === true)
                        motivosHtml += ' required';

                    motivosHtml += `></textarea></label>`;
                }

                if (campo.nome === 'experiencia')
                {
                    experienciaHtml = `<label>${campo.label}:<br><textarea name="${campo.nome}" rows="2" `;
                    
                    if (campo.obrigatorio === true)
                        experienciaHtml += ' required';
                    
                    experienciaHtml += `></textarea></label>`;
                }
            }

            let formHtml = '<form id="form-recrutamento" autocomplete="off">'
            formHtml += nomeHtml + contactoHtml + selectHtml + requisitosHtml + motivosHtml + experienciaHtml;
            formHtml += `
                <div class="botoes">
                    <button type="submit">Confirmar</button>
                    <button type="button" id="cancelar-btn">Cancelar</button>
                </div>
            </form>
            <div id="resultado"></div>
            `;

            conteudo.innerHTML = `
                <div class="recrutamento-container">
                    <h1>Recrutamento</h1>
                    <div id="mensagem">${info}</div>
                    ${formHtml}
                </div>
            `;

            const select = document.getElementById('funcao-select');
            const form = document.getElementById('form-recrutamento');
            const requisitosDiv = document.getElementById('requisitos');
            const resultadoDiv = document.getElementById('resultado');

            function mostrarRequisitos() 
            {
                if (requisitosDiv === null || select === null)
                    return;

                const funcaoSelecionada = select.value;
                let lista = [];

                if (Array.isArray(requisitosPorFuncao[funcaoSelecionada]) && requisitosPorFuncao[funcaoSelecionada].length > 0)
                    lista = requisitosPorFuncao[funcaoSelecionada];

                if (lista.length > 0)
                {
                    let html = "<b>Requisitos:</b><ul>";

                    for (let k = 0; k < lista.length; k++)
                    {
                        html += `<li>${lista[k]}</li>`;
                    }

                    html += "</ul>";
                    requisitosDiv.innerHTML = html;
                    return;
                }
                requisitosDiv.innerHTML = '';
            }

            mostrarRequisitos();

            if (select !== null)
                select.addEventListener('change', mostrarRequisitos);

            if (form === null)
                return;

            form.addEventListener('submit', function(e) 
            {
                e.preventDefault();

                var dadosForm = {
                    nome: form.elements['nome'].value,
                    contacto: form.elements['contacto'].value,
                    funcao: form.elements['funcao-select'].value,
                    motivos: form.elements['motivos'].value,
                    experiencia: form.elements['experiencia'].value
                };

                console.log('Dados do formulário:', dadosForm);

                if (resultadoDiv !== null)
                    resultadoDiv.textContent = "Formulário enviado! Obrigado pelo interesse.";

                form.reset();
                mostrarRequisitos();
            });

            const cancelarBtn = document.getElementById('cancelar-btn');

            if (cancelarBtn !== null)
            {
                cancelarBtn.addEventListener('click', function() 
                {
                    form.reset();
                    mostrarRequisitos();

                    if (resultadoDiv !== null)
                        resultadoDiv.textContent = "";
                });
            }
        })
        .catch(function() 
        {
            conteudo.innerHTML = html_padrao;
        });
}

document.addEventListener('DOMContentLoaded', main);

if (document.readyState !== 'loading')
    main();
