# Tarefas de Implementação — Weather App

Tarefas derivadas de `plans/weather-app-plan.md` e rastreáveis a `specs/weather-app-spec.md`. A implementação segue dependências e camadas: bootstrap → tipos/funções puras → services → hook → componentes → integração. O setup de testes começa após o bootstrap, testes unitários avançam junto de cada camada e E2E começa após a integração. Cada dependência aponta para uma tarefa anterior; tarefas sem dependência comum podem ser paralelizadas.

## Rastreabilidade dos Requisitos Funcionais

| Requisito da spec | Tarefas de implementação | Tarefas de teste | Cobertura |
|---|---|---|---|
| FR-01 — Buscar cidades | T-07, T-10, T-12, T-18 | T-22, T-24, T-26, T-30, T-31 | Coberto |
| FR-02 — Identificar e selecionar localização | T-06, T-07, T-10, T-13, T-18 | T-21, T-22, T-24, T-27, T-30, T-32 | Coberto |
| FR-03 — Consultar clima atual | T-06, T-08, T-11, T-15, T-38 | T-21, T-23, T-25, T-28, T-30, T-32 | Coberto |
| FR-04 — Consultar previsão diária | T-06, T-08, T-11, T-16, T-38 | T-21, T-23, T-25, T-29, T-30, T-32 | Coberto |
| FR-05 — Alternar unidade | T-05, T-11, T-15, T-16, T-17, T-38 | T-20, T-25, T-28, T-29, T-30, T-32 | Coberto |
| FR-06 — Comunicar estados da consulta | T-08, T-09, T-10, T-11, T-14, T-18, T-38 | T-23, T-24, T-25, T-27, T-31 | Coberto |
| FR-07 — Tentar novamente após falha | T-08, T-11, T-14, T-38 | T-23, T-25, T-27, T-31 | Coberto |

Todos os requisitos funcionais FR-01–FR-07 têm tarefas de implementação e tarefas de teste associadas; nenhum está sem cobertura no backlog.

## Prioridade, Tamanho e Fatias

**Prioridade:** P0 bloqueia o MVP funcional; P1 é necessário para release/hardening; P2 é opcional e não bloqueia a primeira publicação. **Tamanho:** P é uma mudança focada; M envolve vários comportamentos ou validações; G tem maior incerteza, integração ou esforço operacional. O tamanho é relativo, não uma estimativa de duração.

| Tarefa | Prioridade | Tamanho |
|---|---|---|
| T-01 | P0 | P |
| T-02 | P0 | P |
| T-03 | P0 | M |
| T-04 | P0 | P |
| T-05 | P0 | P |
| T-06 | P0 | M |
| T-07 | P0 | M |
| T-08 | P0 | G |
| T-09 | P0 | M |
| T-10 | P0 | M |
| T-11 | P0 | M |
| T-12 | P0 | P |
| T-13 | P0 | P |
| T-14 | P0 | P |
| T-15 | P0 | P |
| T-16 | P0 | M |
| T-17 | P0 | P |
| T-18 | P0 | M |
| T-19 | P0 | P |
| T-20 | P0 | P |
| T-21 | P0 | M |
| T-22 | P0 | M |
| T-23 | P0 | M |
| T-24 | P0 | M |
| T-25 | P0 | M |
| T-26 | P0 | P |
| T-27 | P0 | M |
| T-28 | P0 | P |
| T-29 | P0 | M |
| T-30 | P0 | M |
| T-31 | P0 | M |
| T-32 | P0 | M |
| T-33 | P1 | G |
| T-34 | P1 | P |
| T-35 | P1 | P |
| T-36 | P1 | G |
| T-37 | P1 | M |
| T-38 | P0 | M |

Não há tarefas P2: o backlog atual cobre apenas o MVP e os gates necessários ao release. Recursos explicitamente fora do escopo não foram priorizados como trabalho futuro.

### Sequência sugerida

| Fatia | Entrega visível | Tarefas na sequência sugerida |
|---|---|---|
| Fundação | Aplicação inicial compilando | T-01 → T-02 → T-03 |
| 1 — Busca | Buscar e selecionar uma cidade, com estados loading/empty/error | T-04 → T-06 → T-07 → T-09 → T-10 → T-12–T-14 → T-18; depois validar com T-19, T-21, T-22, T-24, T-26 e T-27 |
| 2 — Clima | Ver clima atual e cinco dias; alternar Celsius/Fahrenheit | T-05 → T-08 → T-11 → T-15–T-17 → T-38; depois validar com T-20, T-23, T-25, T-28–T-30 |
| 3 — Resiliência mobile | Validar erros/retry e fluxo completo em mobile | T-31 → T-32 |
| 4 — Hardening | Cobrir SLOs, condições do provedor, hospedagem e gates finais | T-33 → T-34 → T-35 → T-36 → T-37 |

T-18 entrega a primeira fatia utilizável sem esperar pelo forecast; T-38 acrescenta o fluxo meteorológico completo. A execução deve respeitar as dependências declaradas em cada tarefa, mesmo quando tarefas independentes forem paralelizadas.

## Plano Semanal Recomendado

**Premissas:** cinco dias úteis por semana, com 4–6 horas de trabalho focado por dia (20–30 horas semanais). Os blocos diários abaixo são uma alocação de capacidade, não estimativas precisas por tarefa: os tamanhos P/M/G do backlog não representam horas. Reservar parte do limite diário para revisão, integração e correções; se uma tarefa G ultrapassar a semana, deslocar o marco seguinte em vez de reduzir os critérios de aceite.

| Semana | Alocação diária (cada dia: 4–6 h) | Dependências principais | Entrega e definição de pronto |
|---|---|---|---|
| 1 — Fundação | D1: T-01–T-02; D2: T-03–T-05; D3: T-06; D4: T-19; D5: T-20 e validação da base | T-02/T-03 dependem do bootstrap; T-04–T-06 dependem dos tipos e tarefas predecessoras; T-19 depende apenas de T-01; T-20 depende de T-05 e T-19. | Shell responsivo, tipos, mapper e funções puras compilam; setup Vitest está registrado na configuração e conversões têm teste. `pnpm lint`, `pnpm build` e `pnpm test` passam. |
| 2 — Dados e estado | D1: T-07; D2: T-08; D3: T-09; D4: T-10; D5: T-21–T-23 e integração | T-07/T-08 dependem dos mappers e services; T-10 depende de T-07 e T-09; T-21–T-23 cobrem contratos, geocoding e forecast já implementados. | Busca e forecast estão isolados em services, estados e transições estão tipados, erros/timeout/retry têm cobertura unitária; nenhum teste chama a API real. Lint, build e unit tests passam. |
| 3 — Busca utilizável | D1: T-11; D2: T-12–T-14; D3: T-24; D4: T-26–T-27; D5: T-18 e regressão | T-11 depende de T-05/T-08/T-10; T-18 depende de T-02/T-10/T-12–T-14; testes de hook e componentes dependem das respectivas implementações e de T-19. | Pessoa consegue buscar e selecionar explicitamente uma cidade; loading, vazio e erro são acessíveis; a primeira fatia funciona em 320 CSS px. `pnpm test`, lint e build passam. |
| 4 — Clima e unidade | D1: T-15; D2: T-16–T-17; D3: T-25; D4: T-28–T-29; D5: T-38 e regressão | T-15–T-17 dependem dos tipos/funções; T-25 depende de T-11; T-29 depende de T-16/T-17/T-25/T-19; T-38 depende de T-18 e T-11/T-15–T-17. | Fluxo completo mostra clima atual e cinco dias; alternar Celsius/Fahrenheit atualiza a tela sem nova chamada; dados antigos não persistem ao trocar de cidade. Unit tests, lint e build passam. |
| 5 — E2E e MVP funcional | D1: T-30; D2: T-31; D3: T-32; D4: corrigir falhas encontradas; D5: executar regressão completa e revisar acessibilidade | T-30 depende de T-18/T-38 e T-20–T-29; T-31/T-32 dependem de T-30. | Fluxos de sucesso, erro, retry, concorrência e mobile passam com APIs interceptadas; confirmar viewport de 320 px e navegação por teclado/toque. `pnpm lint`, `pnpm build`, `pnpm test` e `pnpm test:e2e` passam. Ao fim desta semana o MVP funcional P0 está concluído, condicionado aos bloqueios externos abaixo. |
| 6 — Hardening e publicação | D1: T-33; D2: T-34; D3: T-35 (ou registrar como não aplicável); D4: T-36; D5: T-37 e evidências | T-33 depende de T-30/T-38; T-35 depende de T-34/T-38; T-36 depende de T-32/T-34/T-35/T-38; T-37 depende de T-31–T-36/T-38. | Registrar resultado do SLO, termos/atribuição do provedor, URL publicada e monitoramento separado de falhas do provedor. Gates finais passam e o checklist WCAG 2.2 AA tem evidências; a publicação só é considerada pronta após T-37. |

### Bloqueadores do MVP e da publicação

- **MVP funcional (P0):** T-18 é bloqueadora porque implementa busca e seleção explícita exigida por FR-02; T-38 é bloqueadora porque completa clima, previsão e unidade. Sem ambas, não existe fluxo de ponta a ponta. T-30–T-32 bloqueiam a validação automatizada P0 do fluxo; T-37 é um gate separado de publicação.
- **Publicação:** T-34 precisa confirmar cobertura, limites, termos e atribuição do Open-Meteo; T-35 é condicional ao resultado. T-36 bloqueia a publicação monitorada e a verificação da meta de disponibilidade; T-33 bloqueia a comprovação do SLO de desempenho. T-37 fecha os gates e não deve ser marcado como concluído sem evidências.
- **Bloqueio de ambiente conhecido:** a execução Playwright depende dos browsers e bibliotecas do sistema disponíveis no ambiente. Se Chromium/WebKit não iniciar, a implementação dos testes pode avançar, mas o gate E2E permanece aberto até a execução em um ambiente compatível; não registrar falha de assertion sem que o teste tenha iniciado.
- **Bloqueio externo:** disponibilidade, limites e termos do Open-Meteo podem impedir a medição de 100 consultas válidas ou exigir mudanças de atribuição. Registrar a evidência e ajustar a janela de release; não substituir os gates por chamadas não controladas em produção.

## Entrega 0 — Bootstrap

### T-01 — Criar a entrada e o shell da aplicação
- **ID:** T-01
- **Tipo:** UI
- **Descrição:** Criar o ponto de entrada React e o componente raiz inicial.
- **Critérios de aceite:** `#root` contém a árvore React após inicialização; `pnpm build` termina com código 0; o shell inicial não faz requisições de rede.
- **Rastreabilidade:** NFR-01.
- **Dependências:** Nenhuma.
- **Arquivos prováveis:** `src/main.tsx`, `src/App.tsx`.

### T-02 — Definir os estilos-base responsivos
- **ID:** T-02
- **Tipo:** UI
- **Descrição:** Configurar estilos globais e importar a folha de estilos na entrada.
- **Critérios de aceite:** `main.tsx` importa `index.css`; diretivas Tailwind compilam em CSS; `pnpm build` termina com código 0.
- **Rastreabilidade:** NFR-01.
- **Dependências:** T-01.
- **Arquivos prováveis:** `src/index.css`, `src/main.tsx`.

## Entrega 1 — Tipos e funções puras

### T-03 — Definir os tipos de domínio
- **ID:** T-03
- **Tipo:** Data
- **Descrição:** Criar os contratos compartilhados de localização, clima, previsão, unidade, estado e erro.
- **Critérios de aceite:** `weather.ts` exporta `Unit`, `City`, `CurrentWeather`, `ForecastDay`, `WeatherData`, `QueryState` e `AppError`; campos meteorológicos ausentes são representáveis como `null`; build strict passa sem `any` nos contratos.
- **Rastreabilidade:** FR-01–FR-07; AC-01.1–AC-07.2.
- **Dependências:** T-01.
- **Arquivos prováveis:** `src/types/weather.ts`.

### T-04 — Implementar o mapeamento de códigos WMO
- **ID:** T-04
- **Tipo:** Data
- **Descrição:** Criar a função pura que associa códigos WMO aos rótulos pt-BR da spec.
- **Critérios de aceite:** Cada código WMO listado retorna exatamente o rótulo especificado; código desconhecido retorna `null`; o módulo não importa React, DOM ou APIs de rede.
- **Rastreabilidade:** FR-03, FR-04; AC-03.3, AC-04.2.
- **Dependências:** T-03.
- **Arquivos prováveis:** `src/lib/weatherConditions.ts`.

### T-05 — Implementar conversões de temperatura
- **ID:** T-05
- **Tipo:** Data
- **Descrição:** Criar funções puras para converter e formatar Celsius e Fahrenheit.
- **Critérios de aceite:** Para entradas finitas, aplicar as fórmulas da spec; formatter retorna uma casa decimal; entrada `null` não produz número.
- **Rastreabilidade:** FR-05; AC-05.1–AC-05.3; NFR-05.
- **Dependências:** T-03.
- **Arquivos prováveis:** `src/lib/temperature.ts`.

### T-06 — Implementar o mapper Open-Meteo
- **ID:** T-06
- **Tipo:** Data
- **Descrição:** Normalizar payloads de geocoding e forecast para os tipos de domínio e validar a resposta na fronteira.
- **Critérios de aceite:** Payload válido é convertido para os tipos definidos; arrays diários paralelos são associados por índice; o resultado contém cinco datas ordenadas; ausências viram `null`/`unavailable`; estrutura inválida é rejeitada como `invalid-response`.
- **Rastreabilidade:** FR-02–FR-04; AC-02.1, AC-03.2, AC-04.1–AC-04.4.
- **Dependências:** T-03, T-04.
- **Arquivos prováveis:** `src/lib/openMeteoMapper.ts`.

## Entrega 2 — Services

### T-07 — Implementar a busca de cidades
- **ID:** T-07
- **Tipo:** Data
- **Descrição:** Implementar a chamada de geocoding e seu mapeamento para `City[]`.
- **Critérios de aceite:** Enviar `name`, `language=pt` e `format=json` com `URLSearchParams`; preservar caracteres; mapear cada resultado; lista ausente/vazia retorna `[]`; encaminhar o `AbortSignal` à requisição.
- **Rastreabilidade:** FR-01, FR-02; AC-01.1, AC-01.3, AC-02.1.
- **Dependências:** T-03, T-06.
- **Arquivos prováveis:** `src/services/openMeteoClient.ts`.

### T-08 — Implementar forecast e classificação HTTP
- **ID:** T-08
- **Tipo:** Data
- **Descrição:** Implementar a chamada única de forecast para clima atual e cinco dias, timeout e classificação de respostas HTTP.
- **Critérios de aceite:** `fetch` recebe coordenadas selecionadas, campos `current`/`daily`, `timezone=auto`, `forecast_days=5` e Celsius; timeout ocorre em 10 s; rede, 429/5xx, outros 4xx e payload inválido recebem as classes definidas; interpretar `Retry-After`; não fazer retry automático.
- **Rastreabilidade:** FR-03, FR-04, FR-06, FR-07; AC-03.1–AC-04.4, AC-06.3–AC-06.6, AC-07.1.
- **Dependências:** T-06, T-07.
- **Arquivos prováveis:** `src/services/openMeteoClient.ts`.

## Entrega 3 — Hook e estado

### T-09 — Definir o reducer e os estados de consulta
- **ID:** T-09
- **Tipo:** Data
- **Descrição:** Criar o estado inicial, ações e transições discriminadas para busca e clima.
- **Critérios de aceite:** Estado inicial de busca/clima é `idle`; reducer representa os cinco estados; somente busca concluída com zero cidades produz `empty`; resposta parcial produz `success`; ação de erro limpa dados da operação anterior; `pnpm build` passa.
- **Rastreabilidade:** FR-06; AC-03.2, AC-04.3, AC-06.1–AC-06.3.
- **Dependências:** T-03.
- **Arquivos prováveis:** `src/hooks/useWeatherApp.ts`.

### T-10 — Orquestrar busca e seleção no hook
- **ID:** T-10
- **Tipo:** Data
- **Descrição:** Implementar busca explícita, validação local, seleção da cidade e proteção contra respostas obsoletas.
- **Critérios de aceite:** Entrada vazia não chama geocoding; HTTP 200 com lista vazia define `empty` e não chama forecast; ao concluir busca B antes de A, somente B é exibida; selecionar B remove dados de A e encaminha coordenadas de B.
- **Rastreabilidade:** FR-01, FR-02, FR-06; AC-01.2, AC-01.4, AC-02.2–AC-02.5, AC-06.2.
- **Dependências:** T-07, T-09.
- **Arquivos prováveis:** `src/hooks/useWeatherApp.ts`.

### T-11 — Orquestrar clima, retry e unidade no hook
- **ID:** T-11
- **Tipo:** Data
- **Descrição:** Completar o hook com consulta meteorológica, retry manual e unidade mantida durante a sessão.
- **Critérios de aceite:** Mock verifica coordenadas exatas; resposta A após seleção de B não altera o estado de B; retry envia uma chamada com parâmetros originais; mudança de unidade não chama serviço; estado inicial em nova instância é Celsius.
- **Rastreabilidade:** FR-03–FR-07; AC-02.2, AC-02.5, AC-03.1–AC-04.4, AC-05.1–AC-05.4, AC-07.1–AC-07.2.
- **Dependências:** T-05, T-08, T-10.
- **Arquivos prováveis:** `src/hooks/useWeatherApp.ts`.

## Entrega 4 — Componentes

### T-12 — Implementar o campo de busca
- **ID:** T-12
- **Tipo:** UI
- **Descrição:** Criar o campo de cidade e ação explícita de envio com validação acessível.
- **Critérios de aceite:** Termo com acentos permanece intacto; clique e Enter chamam `onSubmit` uma vez; termo vazio mostra mensagem associada ao input e não chama callback; módulo não importa services.
- **Rastreabilidade:** FR-01; AC-01.1–AC-01.3; NFR-02.
- **Dependências:** T-03.
- **Arquivos prováveis:** `src/components/CitySearch.tsx`.

### T-13 — Implementar a lista e seleção de cidades
- **ID:** T-13
- **Tipo:** UI
- **Descrição:** Apresentar resultados e permitir selecionar uma localização.
- **Critérios de aceite:** Exibir nome e contexto disponível; sem região e país, coordenadas aparecem com duas casas; cada resultado tem nome acessível e seleção por Enter/clique chama `onSelect` com o `City` correspondente.
- **Rastreabilidade:** FR-02; AC-02.1–AC-02.4; NFR-02.
- **Dependências:** T-03.
- **Arquivos prováveis:** `src/components/LocationResults.tsx`.

### T-14 — Implementar estados visuais da consulta
- **ID:** T-14
- **Tipo:** UI
- **Descrição:** Criar a apresentação reutilizável de carregamento, vazio e erro.
- **Critérios de aceite:** `loading` renderiza role `status`; `error` renderiza alerta em pt-BR; `empty` mostra mensagem e mantém nova busca habilitada; mudança de estado não move o foco.
- **Rastreabilidade:** FR-06; AC-06.1–AC-06.6; NFR-02, NFR-07.
- **Dependências:** T-03, T-09.
- **Arquivos prováveis:** `src/components/QueryStatus.tsx`.

### T-15 — Implementar a apresentação do clima atual
- **ID:** T-15
- **Tipo:** UI
- **Descrição:** Apresentar cidade, temperatura, condição e horário local disponíveis.
- **Critérios de aceite:** Fixture renderiza cidade, temperatura com uma casa decimal/sufixo, rótulo WMO e horário; valores `null` mostram indisponibilidade sem zero ou texto de dado válido.
- **Rastreabilidade:** FR-03, FR-05, FR-06; AC-03.1–AC-03.3, AC-05.1–AC-05.3; NFR-05, NFR-07.
- **Dependências:** T-03, T-04, T-05.
- **Arquivos prováveis:** `src/components/CurrentWeather.tsx`.

### T-16 — Implementar a lista de previsão
- **ID:** T-16
- **Tipo:** UI
- **Descrição:** Apresentar as cinco datas locais e seus dados disponíveis.
- **Critérios de aceite:** Fixture com cinco datas renderiza cinco itens ordenados; cada item mostra condição e mínimas/máximas válidas com unidade; valores ausentes exibem indisponibilidade, nunca `0` como substituto.
- **Rastreabilidade:** FR-04–FR-06; AC-03.3, AC-04.1–AC-04.4, AC-05.2–AC-05.3; NFR-05, NFR-07.
- **Dependências:** T-03, T-04, T-05.
- **Arquivos prováveis:** `src/components/ForecastList.tsx`.

### T-17 — Implementar o controle de unidade
- **ID:** T-17
- **Tipo:** UI
- **Descrição:** Criar controle acessível para selecionar Celsius ou Fahrenheit.
- **Critérios de aceite:** Controle anuncia a unidade selecionada; teclado/toque alternam as opções e chamam `onChange` uma vez; componente não importa services nem altera valores meteorológicos.
- **Rastreabilidade:** FR-05; AC-05.1–AC-05.4; NFR-02, NFR-05.
- **Dependências:** T-03.
- **Arquivos prováveis:** `src/components/UnitToggle.tsx`.

## Entrega 5 — Integração

### T-18 — Integrar a primeira fatia: busca e seleção
- **ID:** T-18
- **Tipo:** UI
- **Descrição:** Compor busca, resultados, seleção e estados de consulta numa primeira tela funcional.
- **Critérios de aceite:** Com geocoding mockado, enviar uma cidade exibe os resultados; selecionar um resultado identifica a cidade escolhida sem iniciar forecast até a integração da fatia meteorológica; a tela não tem rolagem horizontal em 320 CSS px.
- **Rastreabilidade:** FR-01, FR-02, FR-06; AC-01.1–AC-02.5, AC-06.1–AC-06.3; NFR-01, NFR-02, NFR-07.
- **Dependências:** T-02, T-10, T-12–T-14.
- **Arquivos prováveis:** `src/App.tsx`, `src/index.css`.

### T-38 — Integrar clima, previsão e unidade
- **ID:** T-38
- **Tipo:** UI
- **Descrição:** Completar a aplicação conectando os dados meteorológicos e o controle de unidade à tela da primeira fatia.
- **Critérios de aceite:** Selecionar uma cidade renderiza clima atual, cinco dias e controle de unidade; alternar unidade atualiza todos os valores sem nova chamada; ao trocar cidade, dados anteriores deixam de ser apresentados como atuais; nenhum estado é persistido.
- **Rastreabilidade:** FR-03–FR-07; AC-02.5, AC-03.1–AC-07.2; NFR-01, NFR-02, NFR-05–NFR-07.
- **Dependências:** T-18, T-11, T-15–T-17.
- **Arquivos prováveis:** `src/App.tsx`, `src/index.css`.

## Entrega 6 — Testes

### T-19 — Preparar o setup de testes
- **ID:** T-19
- **Tipo:** Infra
- **Descrição:** Criar o setup compartilhado do Vitest e dos matchers Testing Library já configurados.
- **Critérios de aceite:** `tests/setup.ts` importa `@testing-library/jest-dom` e está registrado na configuração do Vitest; um teste pode usar `toBeInTheDocument` sem import local.
- **Rastreabilidade:** Suporte técnico à estratégia de testes do plano; sem requisito funcional direto.
- **Dependências:** T-01.
- **Arquivos prováveis:** `tests/setup.ts`, `vite.config.ts`.

### T-20 — Testar conversão de unidade
- **ID:** T-20
- **Tipo:** Test
- **Descrição:** Testar isoladamente as funções puras Celsius/Fahrenheit.
- **Critérios de aceite:** Testes parametrizados afirmam conversões nos dois sentidos por fórmula, incluindo temperatura negativa; formatter produz exatamente uma casa decimal; `null` permanece indisponível e não gera valor numérico.
- **Rastreabilidade:** FR-05; AC-05.1–AC-05.3; NFR-05.
- **Dependências:** T-05, T-19.
- **Arquivos prováveis:** `tests/unit/lib/temperature.test.ts`.

### T-21 — Testar o mapper Open-Meteo
- **ID:** T-21
- **Tipo:** Test
- **Descrição:** Cobrir normalização de geocoding e forecast com fixtures.
- **Critérios de aceite:** Assertar `null` para região/país ausentes; mapeamento completo; preservação de campos válidos em resposta parcial; cinco datas ordenadas; rótulo nulo para código desconhecido; forecast indisponível sem fuso; rejeição de estrutura inválida; todos os códigos WMO da spec retornam seus rótulos esperados.
- **Rastreabilidade:** AC-02.1, AC-03.1–AC-03.3, AC-04.1–AC-04.4, AC-05.1–AC-05.3.
- **Dependências:** T-06, T-19.
- **Arquivos prováveis:** `tests/unit/lib/openMeteoMapper.test.ts`.

### T-22 — Testar o service de geocoding com mock de fetch
- **ID:** T-22
- **Tipo:** Test
- **Descrição:** Testar isoladamente o service de geocoding com `fetch` substituído por mock.
- **Critérios de aceite:** O mock confirma URL/parâmetros exatos, termo acentuado, mapeamento região/país/coordenadas, retorno `[]` e encaminhamento de cancelamento; nenhum teste faz chamada de rede real.
- **Rastreabilidade:** AC-01.1, AC-01.3, AC-02.1.
- **Dependências:** T-07, T-19.
- **Arquivos prováveis:** `tests/unit/services/geocoding.test.ts`.

### T-23 — Testar o service de forecast com mock de fetch
- **ID:** T-23
- **Tipo:** Test
- **Descrição:** Testar isoladamente o service de forecast e sua classificação HTTP com `fetch` mockado.
- **Critérios de aceite:** O mock confirma parâmetros, timeout de 10 s, cancelamento, sucesso completo/parcial, JSON inválido, rede, 4xx sem retry, 429 com/sem cabeçalho, 5xx e `Retry-After` como segundos/data HTTP; nenhum teste faz chamada de rede real.
- **Rastreabilidade:** AC-03.2, AC-04.3–AC-04.4, AC-06.3–AC-06.6, AC-07.1.
- **Dependências:** T-08, T-19.
- **Arquivos prováveis:** `tests/unit/services/forecast.test.ts`.

### T-24 — Testar busca e seleção no hook
- **ID:** T-24
- **Tipo:** Test
- **Descrição:** Testar transições de busca/seleção com serviços substituíveis e promises controladas.
- **Critérios de aceite:** Verificar entrada vazia sem chamada; loading/success/empty/error; lista vazia sem forecast; resposta A atrasada descartada após B.
- **Rastreabilidade:** AC-01.2, AC-01.4, AC-06.1–AC-06.3.
- **Dependências:** T-10, T-19.
- **Arquivos prováveis:** `tests/unit/hooks/useCitySearch.test.ts`.

### T-25 — Testar clima, retry e unidade no hook
- **ID:** T-25
- **Tipo:** Test
- **Descrição:** Testar consulta da cidade selecionada, concorrência, retry e unidade.
- **Critérios de aceite:** Verificar estados idle/loading/success/error; parcial em success; resposta A descartada após selecionar B; retry único com parâmetros idênticos; unidade não chama o serviço.
- **Rastreabilidade:** AC-02.5, AC-03.2, AC-04.3, AC-05.1–AC-05.4, AC-07.1–AC-07.2.
- **Dependências:** T-11, T-19.
- **Arquivos prováveis:** `tests/unit/hooks/useWeatherApp.test.ts`.

### T-26 — Testar o campo de busca
- **ID:** T-26
- **Tipo:** Test
- **Descrição:** Testar submissão, validação e acessibilidade de `CitySearch`.
- **Critérios de aceite:** Afirmar termo acentuado preservado, trim periférico no submit, vazio sem `onSubmit`, Enter invoca uma vez e mensagem associada ao campo pelo nome acessível.
- **Rastreabilidade:** AC-01.1–AC-01.3; NFR-02.
- **Dependências:** T-12, T-19.
- **Arquivos prováveis:** `tests/unit/components/CitySearch.test.tsx`.

### T-27 — Testar resultados e estados da consulta
- **ID:** T-27
- **Tipo:** Test
- **Descrição:** Testar resultados de localização e estados loading/empty/error.
- **Critérios de aceite:** `LocationResults` no estado success exibe cada resultado e fallback de coordenadas a duas casas; `QueryStatus` nos estados loading/empty/error exibe a mensagem e role correspondentes; seleção chama `onSelect` com o item ativado; alerta não move o foco.
- **Rastreabilidade:** AC-02.1–AC-02.4, AC-06.1–AC-06.3; NFR-02.
- **Dependências:** T-13, T-14, T-19.
- **Arquivos prováveis:** `tests/unit/components/LocationResults.test.tsx`, `tests/unit/components/QueryStatus.test.tsx`.

### T-28 — Testar a apresentação do clima atual
- **ID:** T-28
- **Tipo:** Test
- **Descrição:** Verificar campos, formatação e indisponibilidade parcial no componente atual.
- **Critérios de aceite:** Afirmar valor/unidade com uma casa decimal; código desconhecido mostra condição indisponível; horário/campos ausentes são identificados; temperatura válida permanece visível em resposta parcial.
- **Rastreabilidade:** AC-03.1–AC-03.3, AC-05.1–AC-05.3; NFR-05, NFR-07.
- **Dependências:** T-15, T-19.
- **Arquivos prováveis:** `tests/unit/components/CurrentWeather.test.tsx`.

### T-29 — Testar previsão e controle de unidade
- **ID:** T-29
- **Tipo:** Test
- **Descrição:** Verificar datas, dados parciais, unidade e interação do controle.
- **Critérios de aceite:** Afirmar cinco itens ordenados, marcação de indisponíveis, fallback para código desconhecido, unidade correta e nenhum `getWeather` ao alternar unidade.
- **Rastreabilidade:** AC-04.1–AC-04.4, AC-05.1–AC-05.4; NFR-02, NFR-05.
- **Dependências:** T-16, T-17, T-25, T-19.
- **Arquivos prováveis:** `tests/unit/components/ForecastList.test.tsx`, `tests/unit/components/UnitToggle.test.tsx`.

### T-30 — Automatizar o fluxo E2E de sucesso
- **ID:** T-30
- **Tipo:** Test
- **Descrição:** Testar o caminho principal com rotas Open-Meteo interceptadas no Playwright.
- **Critérios de aceite:** No fluxo completo, fixtures selecionam a cidade retornada; UI mostra clima atual e cinco datas; alternar unidade atualiza valores e não aumenta o contador de requests Forecast. O cenário passa em Chromium desktop.
- **Rastreabilidade:** FR-01–FR-05; AC-01.1, AC-02.1–AC-02.4, AC-03.1, AC-04.1–AC-04.2, AC-05.1–AC-05.4; NFR-01–NFR-03, NFR-05, NFR-07.
- **Dependências:** T-18, T-38, T-20–T-29.
- **Arquivos prováveis:** `tests/e2e/weather-app.spec.ts`.

### T-31 — Automatizar falhas e concorrência E2E
- **ID:** T-31
- **Tipo:** Test
- **Descrição:** Testar estados vazios/erro, retry e respostas fora de ordem na UI.
- **Critérios de aceite:** Playwright afirma que vazio não chama Forecast; falha transitória permite uma tentativa; 4xx não recuperável não oferece retry; resposta A tardia não substitui B; todas as rotas externas são interceptadas.
- **Rastreabilidade:** AC-01.4, AC-02.5, AC-06.2–AC-06.6, AC-07.1–AC-07.2; NFR-04.
- **Dependências:** T-30.
- **Arquivos prováveis:** `tests/e2e/weather-app-errors.spec.ts`.

### T-32 — Configurar E2E de viewport mobile
- **ID:** T-32
- **Tipo:** Test
- **Descrição:** Adicionar cobertura Playwright para perfil iPhone e largura mínima.
- **Critérios de aceite:** Reexecutar o fluxo E2E principal completo (busca, seleção, clima atual, cinco dias e alternância de unidade) no projeto iPhone e viewport de 320 CSS px; `scrollWidth <= clientWidth`; busca, seleção e unidade são operáveis por toque.
- **Rastreabilidade:** NFR-01, NFR-02; AC-02.2, AC-05.2–AC-05.3.
- **Dependências:** T-38, T-30.
- **Arquivos prováveis:** `playwright.config.ts`, `tests/e2e/weather-app-mobile.spec.ts`.

### T-33 — Validar o SLO de desempenho
- **ID:** T-33
- **Tipo:** Test
- **Descrição:** Medir o tempo de consulta à renderização no perfil de rede definido pela spec.
- **Critérios de aceite:** Com RTT 100 ms/10 Mbps, coletar 100 consultas válidas cujo tempo de resposta do provedor seja ≤4 s; afirmar p95 do envio até renderização ≤5 s; request pendente por 10 s termina em timeout e não deixa loading ativo.
- **Rastreabilidade:** NFR-03, NFR-04; AC-06.4.
- **Dependências:** T-38, T-30.
- **Arquivos prováveis:** `tests/e2e/performance.spec.ts`, configuração Playwright.

## Entrega 7 — Hardening

### T-34 — Verificar cobertura e termos do provedor
- **ID:** T-34
- **Tipo:** Infra
- **Descrição:** Confirmar cobertura global, limites, termos e requisitos de atribuição do Open-Meteo.
- **Critérios de aceite:** `README.md` registra limites/cobertura dos endpoints, termos aplicáveis e decisão explícita sobre atribuição; sem atribuição exigida, T-35 é marcada como não aplicável.
- **Rastreabilidade:** Release Gate 1 da spec; NFR-04, NFR-06; sem AC funcional direto.
- **Dependências:** T-07, T-08.
- **Arquivos prováveis:** `README.md`.

### T-35 — Implementar atribuição do provedor quando exigida
- **ID:** T-35
- **Tipo:** UI
- **Descrição:** Exibir atribuição visível e acessível somente se T-34 confirmar que é exigida.
- **Critérios de aceite:** Se obrigatória, UI renderiza texto/link aprovado com nome acessível; se não, tarefa é registrada como não aplicável e nenhum componente é adicionado.
- **Rastreabilidade:** Decisão de fonte/atribuição da spec; NFR-02, NFR-06; sem AC funcional direto.
- **Dependências:** T-38, T-34.
- **Arquivos prováveis:** `src/components/ProviderAttribution.tsx`, `src/App.tsx`.

### T-36 — Configurar hospedagem e monitoramento
- **ID:** T-36
- **Tipo:** Infra
- **Descrição:** Configurar publicação estática e verificação periódica de disponibilidade.
- **Critérios de aceite:** URL de release retorna HTTP 2xx; probe a cada 5 minutos registra sucesso/falha da aplicação; falhas Open-Meteo são contabilizadas separadamente; janela mensal e cálculo da meta 99,5% estão documentados.
- **Rastreabilidade:** NFR-04; Release Gates 1 e 3 da spec.
- **Dependências:** T-38, T-32, T-34, T-35.
- **Arquivos prováveis:** configuração de CI/hospedagem, `README.md`.

### T-37 — Executar os gates finais do MVP
- **ID:** T-37
- **Tipo:** Test
- **Descrição:** Executar os testes automatizados e verificar acessibilidade antes da publicação.
- **Critérios de aceite:** `pnpm lint`, `pnpm build`, `pnpm test` e `pnpm test:e2e` terminam com código 0; checklist WCAG 2.2 AA registra resultado dos fluxos busca/seleção/consulta/unidade; evidências e falhas são anexadas ao release.
- **Rastreabilidade:** NFR-02; Release Gates 2 e 3 da spec.
- **Dependências:** T-31–T-36, T-38.
- **Arquivos prováveis:** Nenhum, salvo ajuste necessário à configuração de CI existente.
