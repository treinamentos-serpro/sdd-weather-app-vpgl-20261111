# Especificação de Produto — Weather App

## Overview

O Weather App é uma aplicação web responsiva, em pt-BR, para buscar uma cidade e consultar seu clima atual e a previsão diária dos cinco dias locais seguintes. O MVP atende desktop e dispositivos móveis; não inclui aplicativo nativo, autenticação ou dados salvos entre sessões.

Decisões do MVP:

- Fonte: Open-Meteo para geocodificação e meteorologia. A aplicação deve cumprir os termos vigentes do provedor, inclusive atribuição quando exigida.
- Clima atual: temperatura, condição meteorológica e horário da observação, no horário local da cidade.
- Previsão: exatamente cinco datas locais, hoje e os quatro dias seguintes, com condição e temperaturas mínima/máxima.
- Unidade: Celsius por padrão; Celsius/Fahrenheit aplica-se a todas as temperaturas e permanece durante a sessão. Valores são exibidos com uma casa decimal.
- Busca: envio explícito pelo usuário; sem sugestões enquanto digita. Resultados vazios não iniciam consulta meteorológica.
- Cobertura de busca: global, limitada à cobertura efetivamente retornada pelo Open-Meteo; a interface e os rótulos permanecem em pt-BR.
- Atualização: dados são carregados após a seleção da cidade; não há atualização automática nem cache persistente. O horário fornecido pela fonte é exibido.
- Privacidade: sem conta, geolocalização do dispositivo, analytics ou persistência local/servidor. O nome pesquisado e as coordenadas selecionadas são enviados ao Open-Meteo para atender à consulta.

Ana, Marcos e Rita são personas hipotéticas de trabalho, não segmentos validados por pesquisa. As metas de tempo do discovery não são compromissos desta versão.

## Functional Requirements

- **FR-01 — Buscar cidades:** permitir buscar por nome de cidade após envio explícito. Remover espaços apenas no início e no fim; preservar acentos e demais caracteres do termo.
- **FR-02 — Identificar e selecionar localização:** exibir cada resultado com nome, região administrativa e país quando disponíveis; usar coordenadas como desambiguador quando não houver contexto geográfico. Exigir seleção explícita antes de consultar meteorologia.
- **FR-03 — Consultar clima atual:** para a localização selecionada, exibir temperatura, condição mapeada do código WMO para pt-BR e horário da observação no fuso local da cidade.
- **FR-04 — Consultar previsão diária:** exibir exatamente cinco datas consecutivas, hoje e os quatro dias seguintes no fuso local da cidade, com condição mapeada do código WMO para pt-BR e temperaturas mínima/máxima em cada data disponível.
- **FR-05 — Alternar unidade:** permitir alternar entre Celsius e Fahrenheit; aplicar a unidade a todos os valores de temperatura atuais e previstos. O padrão é Celsius e a escolha vale até o fim da sessão.
- **FR-06 — Comunicar estados:** comunicar carregamento, ausência de resultados, indisponibilidade parcial e falha por mensagens em pt-BR, sem apresentar dado ausente como válido.
- **FR-07 — Tentar novamente:** oferecer nova tentativa manual para falhas de rede, timeout e respostas HTTP 429 ou 5xx, usando os mesmos parâmetros e sem recarregar a aplicação. Não oferecer retry para respostas HTTP 4xx diferentes de 429, entrada inválida ou busca concluída sem resultados; não realizar tentativas automáticas.

## User Stories

- **US-01 (FR-01) — Buscar cidade:** Como Ana, quero buscar uma cidade pelo nome para encontrar o local cujo clima desejo consultar.
- **US-02 (FR-02) — Selecionar localização:** Como Ana, quero identificar e selecionar a cidade correta entre os resultados para consultar os dados da localização desejada.
- **US-03 (FR-03) — Consultar clima atual:** Como Ana, quero ver as condições atuais da cidade selecionada para decidir como me preparar para o dia.
- **US-04 (FR-04) — Consultar previsão:** Como Marcos, quero consultar a previsão de hoje e dos quatro dias seguintes para planejar minha viagem.
- **US-05 (FR-05) — Alternar unidade:** Como Rita, quero alternar entre Celsius e Fahrenheit para interpretar as temperaturas na unidade com que estou acostumada.
- **US-06 (FR-06) — Acompanhar estado da consulta:** Como Ana, quero saber se a consulta está carregando, não encontrou resultados ou falhou para entender o que está acontecendo e como prosseguir.
- **US-07 (FR-07) — Tentar novamente:** Como Marcos, quero tentar novamente uma consulta que falhou para obter os dados e continuar meu planejamento.

## Traceability Matrix

Cada linha liga a User Story aos requisitos, cenários de teste e requisitos não funcionais aplicáveis. Os critérios compartilhados aparecem em mais de uma linha quando cobrem fluxos de histórias diferentes.

| User Story | Requisitos funcionais | Acceptance Criteria | Requisitos não funcionais |
|---|---|---|---|
| US-01 — Buscar cidade | FR-01, FR-06, FR-07 | AC-01.1–01.4; AC-06.1–06.6; AC-07.1–07.2 | NFR-01, NFR-02, NFR-03, NFR-04, NFR-06, NFR-07 |
| US-02 — Selecionar localização | FR-02, FR-03, FR-04 | AC-02.1–02.5; AC-03.1–03.3; AC-04.1–04.4 | NFR-01–NFR-07 |
| US-03 — Consultar clima atual | FR-03, FR-06, FR-07 | AC-02.2, AC-02.4–02.5; AC-03.1–03.3; AC-06.1, AC-06.3–06.6; AC-07.1–07.2 | NFR-01–NFR-07 |
| US-04 — Consultar previsão | FR-04, FR-06, FR-07 | AC-02.2, AC-02.4–02.5; AC-03.3; AC-04.1–04.4; AC-06.1, AC-06.3–06.6; AC-07.1–07.2 | NFR-01–NFR-07 |
| US-05 — Alternar unidade | FR-05 | AC-05.1–05.4 | NFR-01, NFR-02, NFR-05, NFR-06, NFR-07 |
| US-06 — Acompanhar estado da consulta | FR-01, FR-06, FR-07 | AC-01.2; AC-06.1–06.6; AC-07.1–07.2 | NFR-01–NFR-04, NFR-07 |
| US-07 — Tentar novamente | FR-06, FR-07 | AC-06.3–06.6; AC-07.1–07.2 | NFR-01–NFR-04, NFR-07 |

## Acceptance Criteria

Os critérios estão agrupados por requisito funcional. Nos testes, relógio e respostas do provedor devem ser controlados por fixtures; os nomes de acessibilidade e estados semânticos são parte do contrato da interface.

### FR-01 — Buscar cidades

- **AC-01.1:** **Given** que o campo contém um nome não vazio após remover espaços periféricos, **When** o usuário envia a busca e a geocodificação retorna resultados, **Then** a lista de resultados é exibida e o termo não é alterado além de remover espaços periféricos.
- **AC-01.2:** **Given** que o campo está vazio ou contém apenas espaços, **When** o usuário envia a busca, **Then** nenhuma requisição é enviada e uma mensagem de validação é associada ao campo.
- **AC-01.3:** **Given** que o termo contém acentos ou caracteres reservados, **When** a busca é enviada, **Then** o texto é codificado na requisição sem perda de caracteres e os resultados pertencem ao termo original.
- **AC-01.4:** **Given** que a busca A ainda está pendente, **When** o usuário envia a busca B e B termina antes de A, **Then** a interface mantém os resultados de B e descarta a resposta tardia de A.

### FR-02 — Identificar e selecionar uma localização

- **AC-02.1:** **Given** que a geocodificação retorna localizações, **When** os resultados são exibidos, **Then** cada um mostra nome, região administrativa e país quando fornecidos; se ambos estiverem ausentes, mostra latitude e longitude com duas casas decimais.
- **AC-02.2:** **Given** que há resultados homônimos com coordenadas diferentes, **When** o usuário seleciona um resultado, **Then** as requisições de clima atual e previsão usam exatamente as coordenadas selecionadas.
- **AC-02.3:** **Given** que há resultados de busca e nenhuma localização foi selecionada, **When** a busca termina, **Then** nenhuma requisição meteorológica é enviada.
- **AC-02.4:** **Given** que uma localização foi selecionada, **When** seus dados são exibidos, **Then** o nome e o contexto geográfico disponível dessa localização permanecem visíveis.
- **AC-02.5:** **Given** que os dados da localização A estão visíveis ou pendentes, **When** o usuário seleciona a localização B, **Then** os dados de A deixam de ser apresentados como dados atuais e qualquer resposta tardia de A é descartada; enquanto B carrega, a interface identifica B e indica carregamento.

### FR-03 — Consultar clima atual

- **AC-03.1:** **Given** que a resposta atual contém temperatura, código de condição e horário, **When** a consulta termina, **Then** a temperatura, a condição em pt-BR e o horário local da observação são exibidos.
- **AC-03.2:** **Given** que um ou mais desses campos estão ausentes ou inválidos, **When** a resposta é exibida, **Then** os campos válidos continuam visíveis e cada campo ausente é identificado como indisponível, sem valor substituto.
- **AC-03.3:** **Given** que o código de condição atual ou diário recebido não é reconhecido, **When** o clima ou a previsão é exibido, **Then** as temperaturas válidas permanecem visíveis e a condição do período aparece como indisponível.

Mapeamento de códigos WMO para rótulos em pt-BR, aplicado ao clima atual e à previsão:

| Código(s) | Rótulo |
|---|---|
| 0 | Céu limpo |
| 1 | Predominantemente limpo |
| 2 | Parcialmente nublado |
| 3 | Encoberto |
| 45, 48 | Neblina |
| 51, 53, 55 | Garoa |
| 56, 57 | Garoa congelante |
| 61, 63, 65 | Chuva |
| 66, 67 | Chuva congelante |
| 71, 73, 75 | Neve |
| 77 | Grãos de neve |
| 80, 81, 82 | Pancadas de chuva |
| 85, 86 | Pancadas de neve |
| 95 | Trovoada |
| 96, 99 | Trovoada com granizo |

### FR-04 — Consultar previsão de cinco dias

- **AC-04.1:** **Given** que uma localização com fuso horário conhecido foi selecionada e há previsão diária, **When** a previsão é exibida, **Then** aparecem exatamente as cinco datas locais de hoje até hoje + 4 dias, sem datas extras.
- **AC-04.2:** **Given** que uma data tem previsão válida, **When** a previsão é exibida, **Then** essa data mostra condição e temperaturas mínima e máxima na unidade selecionada.
- **AC-04.3:** **Given** que faltam dados para uma ou mais datas do intervalo, **When** a previsão é exibida, **Then** as cinco datas continuam identificadas e as datas sem dados são marcadas como indisponíveis, sem valores inventados.
- **AC-04.4:** **Given** que o provedor não retorna um fuso horário válido para a localização, **When** a previsão é solicitada, **Then** a previsão é marcada como indisponível com erro compreensível, o clima atual continua visível se válido e nenhum dado usa silenciosamente o fuso do dispositivo.

### FR-05 — Alternar unidade de temperatura

- **AC-05.1:** **Given** que a sessão começou sem escolha de unidade, **When** qualquer temperatura é exibida, **Then** o valor usa Celsius e o sufixo `°C`.
- **AC-05.2:** **Given** que temperaturas são exibidas em Celsius, **When** o usuário seleciona Fahrenheit, **Then** cada valor atual e previsto é convertido por `F = (C * 9 / 5) + 32`, arredondado a uma casa decimal e identificado com `°F`.
- **AC-05.3:** **Given** que temperaturas são exibidas em Fahrenheit, **When** o usuário seleciona Celsius, **Then** cada valor atual e previsto é convertido por `C = (F - 32) * 5 / 9`, arredondado a uma casa decimal e identificado com `°C`.
- **AC-05.4:** **Given** que a unidade foi alterada, **When** o usuário seleciona outra cidade na mesma sessão, **Then** os novos valores permanecem na unidade escolhida; após encerrar e iniciar nova sessão, o padrão volta a Celsius.

### FR-06 — Comunicar estados da consulta

- **AC-06.1:** **Given** que uma requisição está pendente, **When** a interface é atualizada, **Then** há um indicador visível exposto como status acessível e anunciado sem mover o foco.
- **AC-06.2:** **Given** que a geocodificação termina com sucesso e retorna zero resultados, **When** a resposta é processada, **Then** uma mensagem de ausência de resultados é exibida, o termo permanece no campo e nenhuma consulta meteorológica é enviada.
- **AC-06.3:** **Given** que uma requisição falha por rede, timeout, resposta inválida ou erro do provedor, **When** a falha é processada, **Then** uma mensagem em pt-BR é exibida em região de alerta, sem expor o erro técnico bruto.
- **AC-06.4:** **Given** que uma requisição permanece pendente por 10 segundos, **When** o limite é atingido, **Then** ela é cancelada, o carregamento termina e a falha de timeout é apresentada.
- **AC-06.5:** **Given** que o provedor retorna HTTP 429 com `Retry-After`, **When** o erro é exibido, **Then** a nova tentativa fica indisponível até o instante indicado e a mensagem informa a espera; sem esse cabeçalho, a nova tentativa manual fica disponível imediatamente.
- **AC-06.6:** **Given** que o provedor retorna HTTP 4xx diferente de 429, **When** a falha é processada, **Then** uma mensagem de erro é exibida e a opção de nova tentativa não é apresentada.

### FR-07 — Tentar novamente após falha

- **AC-07.1:** **Given** que ocorreu falha de rede, timeout ou resposta HTTP 429/5xx e a nova tentativa está habilitada, **When** o usuário aciona “Tentar novamente”, **Then** exatamente uma nova requisição é enviada com os mesmos parâmetros e sem recarregar a aplicação.
- **AC-07.2:** **Given** que uma nova tentativa está pendente, **When** a interface é atualizada, **Then** o estado de carregamento volta a ser anunciado e o controle de nova tentativa não envia requisições duplicadas.

## Non-Functional Requirements

- **NFR-01 — Plataforma e compatibilidade:** web responsiva, largura suportada de 320 a 1920 CSS px, sem rolagem horizontal nos fluxos principais. Suportar as duas versões estáveis mais recentes de Chrome, Edge, Firefox e Safari, incluindo Safari em iOS e Chrome em Android.
- **NFR-02 — Acessibilidade:** conformidade WCAG 2.2 AA nos fluxos de busca, seleção, consulta e unidade; operação integral por teclado, foco visível, nomes acessíveis e anúncio de estados conforme os ACs.
- **NFR-03 — Desempenho:** em teste de release com RTT de 100 ms e largura de banda de 10 Mbps, p95 do envio da consulta até a renderização dos resultados não deve exceder 5 s quando o provedor responder em até 4 s. Cada requisição expira em 10 s.
- **NFR-04 — Disponibilidade e resiliência:** meta mensal de disponibilidade da aplicação de 99,5%, excluindo indisponibilidade do Open-Meteo, que deve ser contabilizada separadamente. Nenhuma operação pode permanecer em carregamento após timeout; não há retry automático.
- **NFR-05 — Clareza temporal e unidades:** datas e horário da observação usam o fuso da localização selecionada; temperaturas exibem uma casa decimal e sufixo de unidade em todos os estados.
- **NFR-06 — Privacidade:** não solicitar geolocalização, criar conta, enviar analytics ou persistir buscas/preferências. A busca manual e as coordenadas selecionadas são enviadas ao Open-Meteo; nenhuma localização do dispositivo é coletada.
- **NFR-07 — Idioma e formatação:** conteúdo, erros e condições meteorológicas em pt-BR; datas e horas formatadas segundo a localidade e o fuso da cidade selecionada.

## Edge Cases
Os casos limite de busca, respostas parciais, fuso ausente, código meteorológico desconhecido, timeout e limite do provedor são cobertos pelos critérios AC-01.2 a AC-07.2. Esses critérios são a fonte única para os testes automatizados.

## Assumptions

- A pessoa usuária tem conexão com a internet e informa manualmente o nome da cidade; não há uso sem conexão nem detecção automática de localização.
- A cobertura global e a disponibilidade dos dados dependem do Open-Meteo; localidades sem correspondência retornada são tratadas como sem resultados.
- O fuso horário e os horários meteorológicos fornecidos pelo provedor são a referência para datas e horários exibidos. A aplicação não valida independentemente a precisão ou a atualidade dos dados.
- Códigos meteorológicos seguem a tabela WMO especificada; códigos desconhecidos e campos ausentes seguem os fallbacks definidos nos critérios de aceite.
- As personas e suas metas de tempo são hipóteses não validadas e não constituem critérios de aceite.

## Risks

| Risco | Probabilidade | Impacto | Mitigação |
|---|---|---|---|
| Indisponibilidade, limite de uso ou mudança nos termos do Open-Meteo. | Média | Alto | Tratar falhas conforme FR-06/FR-07; verificar limites, cobertura, termos e atribuição antes do lançamento; monitorar falhas do provedor separadamente da disponibilidade da aplicação. |
| Resposta incompleta ou código meteorológico não reconhecido. | Média | Médio | Aplicar AC-03.2/AC-03.3 e AC-04.3; nunca substituir dados ausentes por valores que pareçam reais. |

## Out of Scope

Fora do escopo do MVP:

- Contas, autenticação, sincronização ou persistência de cidades e preferências entre sessões.
- Favoritos, histórico de buscas, listas salvas e comparação simultânea de cidades.
- Geolocalização do dispositivo, uso offline, atualização automática ou controle dedicado de atualização dos dados. Os dados são carregados ao selecionar uma cidade; retry só está disponível após falha.
- Sugestões de busca enquanto digita e correção automática de nomes.
- Previsões horárias, históricas ou para períodos além dos cinco dias especificados.
- Alertas, notificações, mapas, radar e imagens de satélite.
- Sensação térmica, vento, umidade e precipitação como dados exibidos; unidades alternativas para essas variáveis.
- Aplicativos nativos e idiomas diferentes de pt-BR.

## Release Gates

- Confirmar termos, limites, cobertura global e requisitos de atribuição do Open-Meteo.
- Executar testes automatizados para todos os critérios de aceite e teste manual de WCAG 2.2 AA nos fluxos principais.
- Validar os SLOs de desempenho e disponibilidade em ambiente de release; registrar separadamente falhas da aplicação e do provedor.