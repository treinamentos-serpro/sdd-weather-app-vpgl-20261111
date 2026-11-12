# Discovery — Aplicação de Previsão do Tempo

## Contexto

A empresa solicitou uma aplicação para que usuários consultem condições meteorológicas de cidades. O briefing estabelece cinco capacidades: buscar cidades, visualizar o clima atual, consultar a previsão de cinco dias, alternar entre Celsius e Fahrenheit e usar a aplicação em dispositivos móveis. Ainda não foram definidos público-alvo específico, fonte dos dados, plataformas suportadas nem critérios quantitativos de qualidade.

## Personas (Hipóteses)

As personas abaixo são arquétipos iniciais derivados do briefing, não resultados de pesquisa com usuários. As metas de tempo são propostas para validação em testes de usabilidade.

| Persona | Objetivo principal | Contexto de uso | Métrica de sucesso do ponto de vista da pessoa |
|---|---|---|---|
| **Ana, a usuária cotidiana** | Consultar rapidamente o clima da própria cidade para decidir como se preparar para o dia. | Principalmente celular, em uma consulta rápida antes de sair. | Encontra a cidade correta e consulta o clima atual em até 30 segundos, sem ajuda ou repetição da busca. |
| **Marcos, o planejador de viagem** | Consultar o clima de uma cidade de destino e verificar os próximos cinco dias antes de viajar. | Desktop, durante o planejamento; pode repetir a consulta no celular. | Seleciona o destino correto e compreende a previsão exibida para o período de cinco dias em até 60 segundos. |
| **Rita, a usuária de Fahrenheit** | Consultar o clima usando a escala de temperatura com a qual está acostumada. | Celular ou desktop, em consultas cotidianas. | Alterna para Fahrenheit e interpreta corretamente as temperaturas do clima atual e da previsão, sem encontrar valores em unidades misturadas. |

## Requisitos Funcionais

- **RF-01 — Buscar cidades:** permitir que o usuário informe o nome de uma cidade e inicie uma busca.
- **RF-02 — Selecionar localização:** permitir que o usuário identifique e selecione a cidade desejada nos resultados. A busca deve distinguir resultados homônimos por informações de localização, se disponíveis.
- **RF-03 — Consultar clima atual:** exibir as condições meteorológicas atuais da cidade selecionada.
- **RF-04 — Consultar previsão:** exibir a previsão para cinco dias da cidade selecionada.
- **RF-05 — Alternar unidade:** permitir alternar entre Celsius e Fahrenheit e apresentar as temperaturas na unidade escolhida.
- **RF-06 — Informar estados da consulta:** comunicar quando uma busca ou consulta está em andamento, não retorna resultados ou falha. O conteúdo e a forma desses estados precisam ser definidos na especificação.

## Requisitos Não-Funcionais

- **RNF-01 — Responsividade:** a interface deve adaptar-se a dispositivos móveis, conforme solicitado no briefing, e permanecer utilizável em diferentes tamanhos de tela.
- **RNF-02 — Usabilidade móvel:** controles de busca, seleção de cidade, previsão e alternância de unidade devem ser operáveis em telas sensíveis ao toque e sem exigir precisão excessiva.
- **RNF-03 — Acessibilidade:** conteúdo e controles devem ser acessíveis por teclado e tecnologias assistivas; os critérios e nível de conformidade precisam ser definidos.
- **RNF-04 — Desempenho:** buscas e apresentação dos dados devem ocorrer com latência adequada à consulta interativa. A meta de tempo e as condições de medição estão em aberto.
- **RNF-05 — Resiliência:** falhas de rede ou indisponibilidade da fonte de dados não devem deixar a interface sem resposta; o usuário deve receber uma indicação compreensível e uma forma de tentar novamente, se aplicável.
- **RNF-06 — Clareza e consistência dos dados:** localização, horário de referência, período da previsão e unidade de temperatura devem ser apresentados sem ambiguidade.
- **RNF-07 — Compatibilidade:** navegadores e versões móveis suportados precisam ser acordados antes de estabelecer a matriz de testes.

## Riscos

| Risco | Probabilidade | Impacto | Mitigação inicial |
|---|---|---|---|
| Indisponibilidade, latência ou limites de uso do provedor de dados meteorológicos. | Média | Alto | Avaliar provedores, limites e termos de uso; tratar falhas e permitir nova tentativa. |
| Busca retornar cidades homônimas ou uma localização incorreta. | Média | Alto | Apresentar contexto geográfico nos resultados e exigir seleção explícita quando houver ambiguidade. |
| Interpretação divergente do que significa “previsão de 5 dias” (inclui hoje ou não). | Alta | Médio | Definir período, fuso horário e granularidade antes de fechar os critérios de aceite. |
| Interface difícil de usar ou conteúdo cortado em telas móveis. | Média | Alto | Validar layouts em dimensões variadas e testar os fluxos principais em dispositivos móveis. |
| Dados ou horários exibidos de forma inconsistente entre cidades e fusos horários. | Média | Alto | Definir tratamento de fuso e validar o horário local da cidade usando dados da fonte escolhida. |
| Falta de conexão impede a consulta e não há comportamento definido para esse caso. | Média | Médio | Exibir estado de erro e esclarecer se haverá cache ou suporte offline. |

## Perguntas em Aberto

### Usuários e escopo

1. **Quem são os usuários prioritários e quais decisões eles precisam tomar com o app?** Impacto: sem personas e objetivos, não é possível priorizar dados, fluxos e critérios de sucesso.
2. **“Usar em dispositivos móveis” significa um web app responsivo ou também aplicativos nativos? Quais plataformas devem ser atendidas?** Impacto: muda arquitetura, distribuição, permissões, custos e testes.
3. **Além de celulares, quais tamanhos de tela, navegadores e versões devem ser suportados?** Impacto: sem uma matriz de compatibilidade, não há como definir implementação ou cobertura de testes.
4. **Quais países e regiões devem ter cobertura de busca e previsão?** Impacto: cobertura e qualidade podem variar por provedor e região, afetando a utilidade do produto.
5. **Quais idiomas e convenções regionais (data, hora, nomes de condições e unidades) são necessários?** Impacto: afeta interface, formatação dos dados, acessibilidade e esforço de localização.
6. **Há identidade visual, requisitos de marca ou padrões de design que devem ser seguidos?** Impacto: pode afetar layout, componentes, conteúdo e aprovação do produto.

### Busca e localização

7. **Quais entradas a busca deve aceitar: nome de cidade, país, região, código postal ou coordenadas? Deve sugerir resultados enquanto o usuário digita?** Impacto: define o escopo da busca, integração de geocodificação e comportamento da interface.
8. **Como tratar erros de digitação, acentos, nomes em diferentes idiomas e consultas sem resultados?** Impacto: sem regras, resultados podem ser inconsistentes e a busca pode falhar para entradas comuns.
9. **Como distinguir cidades homônimas e ordenar resultados?** Impacto: o usuário pode selecionar a localização errada e receber dados meteorológicos irrelevantes.
10. **O app deve detectar a localização atual do dispositivo? Em que momento solicitar permissão e qual alternativa oferecer se ela for negada?** Impacto: envolve privacidade, permissões, comportamento inicial e tratamento de recusa.
11. **Será possível consultar várias cidades, favoritos ou histórico de buscas?** Impacto: altera navegação, persistência de dados e complexidade; sem decisão, esses recursos podem entrar ou ficar fora de escopo por acidente.

### Dados meteorológicos e unidades

12. **Qual provedor fornecerá geocodificação, clima atual e previsão? Há restrições de custo, licença, chave, quotas ou atribuição?** Impacto: afeta cobertura, precisão, disponibilidade, segurança, custos e escolha técnica.
13. **Quais campos definem “clima atual” (por exemplo, temperatura, sensação térmica, condição, vento, umidade ou precipitação)?** Impacto: sem um conjunto mínimo, conteúdo e critérios de aceite ficam indefinidos.
14. **“Previsão de 5 dias” inclui hoje ou os cinco dias completos seguintes? Qual fuso horário define a virada do dia?** Impacto: altera o intervalo exibido e pode produzir resultados diferentes conforme a localização.
15. **A previsão deve ser diária, horária ou ambas, e quais variáveis deve apresentar?** Impacto: determina granularidade, volume de dados, layout e capacidade de comparação.
16. **Com que frequência os dados devem ser atualizados e como exibir o horário da última atualização?** Impacto: sem regra de atualização e indicação de atualidade, os usuários podem confiar em dados desatualizados.
17. **Celsius/Fahrenheit aplica-se apenas à temperatura ou também é necessário alternar unidades de vento, precipitação e outras medidas?** Impacto: pode deixar a apresentação inconsistente e afeta conversões e testes.
18. **Qual unidade deve ser padrão? A escolha deve persistir entre visitas ou dispositivos?** Impacto: afeta a experiência inicial e pode exigir armazenamento local, conta ou sincronização.

### Qualidade, operação e privacidade

19. **Qual é o tempo máximo aceitável para busca e carregamento dos dados, e em que condições de rede/dispositivo será medido?** Impacto: sem metas mensuráveis, desempenho não pode ser validado nem comparado.
20. **Qual disponibilidade é esperada e como indisponibilidade, lentidão ou limite de uso do provedor externo será tratada?** Impacto: sem uma meta e uma estratégia, não há expectativa operacional clara nem resposta definida para falhas externas.
21. **O que o usuário deve ver e poder fazer em falhas de rede, timeout, limite de requisições ou indisponibilidade do provedor?** Impacto: determina estados de erro, nova tentativa e risco de uma experiência sem saída.
22. **O app precisa funcionar offline ou apresentar dados em cache? Qual idade máxima de dados ainda pode ser mostrada?** Impacto: envolve atualidade, armazenamento e comunicação de que os dados podem estar desatualizados.
23. **Quais critérios de acessibilidade devem ser atendidos (teclado, leitores de tela, contraste, ampliação e alvos de toque)?** Impacto: sem critérios, acessibilidade não pode ser verificada de forma consistente e usuários podem ser impedidos de usar o app.
24. **Que dados pessoais ou de localização podem ser coletados, para quais finalidades e por quanto tempo?** Impacto: afeta permissões, avisos de privacidade, armazenamento, conformidade legal e confiança do usuário.
25. **Haverá contas, autenticação ou sincronização de preferências?** Impacto: adiciona requisitos de segurança, backend e gestão de dados; a ausência dessa decisão pode levar a escopo inesperado.
26. **Quais metas de adoção ou sucesso do produto serão usadas para avaliar o lançamento?** Impacto: sem métricas de sucesso, não será possível saber se a solução atende à necessidade de negócio.
27. **Qual volume de usuários e consultas simultâneas deve ser suportado?** Impacto: influencia limites do provedor, desempenho, escalabilidade e custos operacionais.
28. **Como o app será publicado, monitorado e mantido após o lançamento?** Impacto: afeta hospedagem, alertas, diagnóstico de falhas, atualização e responsabilidade operacional.

## Decisões

| Decisão | Justificativa | Perguntas em aberto resolvidas |
|---|---|---|
| **Fonte de dados: Open-Meteo, sem API key.** | Define a fonte para geocodificação e dados meteorológicos e evita exigir uma chave de API para o uso previsto. Cobertura, limites e termos de uso ainda devem ser validados. | Resolve parte da pergunta 12 sobre provedor e necessidade de chave; custos, quotas, cobertura e atribuição ainda precisam ser confirmados. |
| **“5 dias” significa hoje mais os quatro dias seguintes.** | Estabelece um intervalo previsível para a consulta da previsão. | Resolve a pergunta 14 sobre incluir ou não o dia atual; granularidade e tratamento de fuso horário permanecem em aberto. |
| **Unidade padrão: Celsius.** | Define a experiência inicial para o público da interface em pt-BR. | Resolve a pergunta 18 sobre a unidade inicial; persistência local da escolha e unidades além de temperatura continuam em aberto. |
| **Sem autenticação e sem persistência de servidor.** | Mantém o escopo sem contas e evita armazenar dados de usuário em um backend. | Resolve a pergunta 25 sobre contas e autenticação. Delimita parte da pergunta 24, mas coleta local, telemetria e retenção em outros sistemas ainda precisam ser esclarecidas. |
| **Idioma da interface: pt-BR.** | Define idioma e convenções regionais da interface para a primeira versão. | Resolve a parte da pergunta 5 referente ao idioma da interface; países atendidos pela busca e demais requisitos de localização ainda precisam ser definidos. |

## Suposições

- O produto é uma aplicação voltada a usuários finais, e não uma ferramenta interna de meteorologistas.
- “Clima atual” e “previsão de cinco dias” devem corresponder à cidade selecionada pelo usuário.
- A alternância Celsius/Fahrenheit aplica-se, no mínimo, aos valores de temperatura exibidos no clima atual e na previsão.
- O suporte a dispositivos móveis implica interface responsiva; o briefing não define a necessidade de aplicativos nativos.
- Não se presume geolocalização automática nem funcionamento offline. A persistência local da preferência de unidade continua em aberto; a decisão exclui persistência no servidor.