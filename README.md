# Site-Manga (Primeiro Projeto Web)
![Technologies](https://img.shields.io/badge/Tech-HTML%20%7C%20CSS%20%7C%20JS-blue.svg)
![Deployment](https://img.shields.io/badge/Hosted%20On-GitHub%20Pages-orange.svg)
![Architecture](https://img.shields.io/badge/Arch-SPA%20(from%20scratch)-purple.svg)
![Status](https://img.shields.io/badge/Status-Projeto%20Escolar-brightgreen)

Este foi o meu primeiro projeto de desenvolvimento web, criado como um exercício prático para dominar os fundamentos de **HTML, CSS e JavaScript**. O principal desafio técnico foi construir uma **Single Page Application (SPA)** a partir do zero, sem o auxílio de qualquer framework.

> **Aviso:** Todas as imagens de manga incluindo as capas foram intencionalmente removidas para respeitar os direitos autorais. O foco do projeto está no código e na arquitetura.

**Visite:** [**https://tiago-daniel-guerreiro.github.io**](https://tiago-daniel-guerreiro.github.io/Site-Manga/)

## 🚀 Tecnologias Utilizadas
- **HTML:** Para a estrutura semântica do conteúdo.
- **CSS:** Para a estilização e o layout responsivo das diferentes secções.
- **JavaScript (Vanilla JS):** O coração da aplicação, responsável por toda a lógica da SPA.

A decisão de não usar frameworks (como React ou Vue) foi intencional, com o objetivo de compreender em profundidade como estas ferramentas funcionam.

## 🎯 Objetivo Principal
O projeto nasceu de uma pergunta simples: **"Como construir uma experiência de navegação fluida, sem recarregar a página a cada clique, usando apenas as tecnologias base da web?"**. O objetivo era, portanto, aprender a manipular o DOM, gerir eventos e simular a navegação entre páginas de forma eficiente.

## ✔️ A Solução
A solução foi criar uma SPA estática onde todo o conteúdo reside num único ficheiro `index.html`. A "magia" acontece no JavaScript:
- **Renderização Dinâmica:** Em vez de navegar para novos ficheiros HTML, o JavaScript mostra e esconde `divs` (secções) de conteúdo com base nas interações do utilizador inserindo o conteudo necessário nas mesmas.
- **Roteamento no Cliente:** Foi implementado um sistema de roteamento simples que escuta cliques em links de navegação. Em vez de seguir o `href`, ele aciona uma função que exibe a secção correspondente.
- **Manipulação do Histórico:** Para uma melhor experiência de utilizador e URLs mais limpas, a `History API` (`history.pushState`) foi utilizada para atualizar a URL na barra de endereço sem recarregar a página, permitindo também o uso do botão "voltar" do navegador.

## 👤 Meu Papel
Este projeto foi um esforço colaborativo, e a minha contribuição foi dupla: definir a visão do produto e liderar a sua execução técnica.

- **Idealização e Design de Produto:** Tive um papel central na concepção inicial do projeto. Aproveitando o meu conhecimento sobre as expectativas dos utilizadores para este tipo de plataforma, ajudei a definir a visão geral do site e propus várias funcionalidades específicas para garantir uma experiência de navegação autêntica e intuitiva.

- **Arquitetura da Single Page Application (SPA):** Tecnicamente, fui o principal responsável por transformar essa visão numa realidade, desenhando e implementando a arquitetura da SPA. Isto incluiu:
    - Criar do zero a lógica de roteamento em JavaScript para a navegação sem recarregar a página.
    - Implementar as funções de manipulação do DOM para a renderização dinâmica do conteúdo.
    - Integrar a `History API` para uma experiência de utilizador fluida e URLs limpas.

## ⚙️ Principais Desafios
- **Aprender as 3 Tecnologias em Simultâneo:** O principal desafio foi internalizar os conceitos de estrutura (HTML), apresentação (CSS) e comportamento (JS) e como eles se interligam.
- **Construir a Lógica da SPA do Zero:** Desenvolver o roteador e o sistema de renderização de conteúdo em JavaScript puro foi um exercício complexo, mas extremamente gratificante.
- **Organização do CSS:** Manter o CSS organizado e evitar conflitos de estilo entre as diferentes "páginas" virtuais.

## ✅ Resultados
- **Compreensão Sólida dos Fundamentos:** A conclusão do projeto solidificou a minha base em desenvolvimento web front-end.
- **Base para o Futuro:** A experiência adquirida aqui foi o alicerce que me permitiu aprender frameworks modernos com muito mais facilidade, pois já entendia os problemas que eles se propõem a resolver.
- **Primeiro Projeto Funcional:** Transformar conhecimento teórico num produto funcional, mesmo que simples, foi a principal conquista.

## 🔮 Próximos Passos
Sendo um projeto de aprendizagem já concluído, os próximos passos possíveis seriam:
- **Conectar a uma API:** Transformar o site de estático para dinâmico, buscando os dados de manga a partir de uma API externa.
- **Melhorar o Design:** Aplicar os conhecimentos de UI/UX adquiridos desde então para modernizar a aparência.
