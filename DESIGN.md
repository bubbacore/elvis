---
version: alpha
name: Bubba
description: "Marca e valores-base do Bubba, gerados do pacote @bubbacore/elvis."
colors:
  primary: "#496EA1"
  action-selected: "#050505"
  action-disabled: "#B0AFAF"
  surface-paper: "#F7F7F7"
  surface-card: "#FFFFFF"
  surface-mist: "#E9EFF6"
  surface-no-sessions-day: "#EBEBEB"
  surface-logo-frame: "#504D4D"
  text-ink: "#050505"
  text-body: "#717171"
  text-blue: "#496EA1"
  text-attention: "#E03405"
  text-inverse: "#FFFFFF"
  text-disabled: "#B0AFAF"
  border-field: "#7190BC"
  border-blue: "#496EA1"
  border-attention: "#E03405"
  focus-filter: "#050505"
  focus-action: "#496EA1"
  focus-field: "#7190BC"
  halo-strong: "#7190BC"
  halo-medium: "#A5BBDB"
  halo-soft: "#C9D6E9"
typography:
  display:
    fontFamily: Bubba Serif
    fontSize: 40px
    fontWeight: 600
    lineHeight: 1.05
    letterSpacing: -0.8px
    fontFeature: '"lnum"'
  display-wide:
    fontFamily: Bubba Serif
    fontSize: 56px
    fontWeight: 600
    lineHeight: 1.05
    letterSpacing: -1.12px
    fontFeature: '"lnum"'
  character:
    fontFamily: Bubba Serif
    fontSize: 24px
    fontWeight: 400
    lineHeight: 1.25
    letterSpacing: -0.24px
    fontFeature: '"lnum"'
  character-wide:
    fontFamily: Bubba Serif
    fontSize: 28px
    fontWeight: 400
    lineHeight: 1.25
    letterSpacing: -0.28px
    fontFeature: '"lnum"'
  title-1:
    fontFamily: Bubba Serif
    fontSize: 30px
    fontWeight: 600
    lineHeight: 1.12
    letterSpacing: -0.45px
    fontFeature: '"lnum"'
  title-1-wide:
    fontFamily: Bubba Serif
    fontSize: 36px
    fontWeight: 600
    lineHeight: 1.12
    letterSpacing: -0.54px
    fontFeature: '"lnum"'
  title-2:
    fontFamily: Bubba Serif
    fontSize: 20px
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: -0.2px
    fontFeature: '"lnum"'
  title-2-wide:
    fontFamily: Bubba Serif
    fontSize: 22px
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: -0.22px
    fontFeature: '"lnum"'
  title-3:
    fontFamily: Bubba Serif
    fontSize: 17px
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: 0px
    fontFeature: '"lnum"'
  title-3-wide:
    fontFamily: Bubba Serif
    fontSize: 18px
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: 0px
    fontFeature: '"lnum"'
  body:
    fontFamily: Bubba Serif
    fontSize: 17px
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: 0px
    fontFeature: '"lnum"'
  body-small:
    fontFamily: Bubba Serif
    fontSize: 15px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0px
    fontFeature: '"lnum"'
  time:
    fontFamily: Bubba Serif
    fontSize: 16px
    fontWeight: 600
    lineHeight: 1
    letterSpacing: 0px
    fontFeature: '"lnum"'
  control:
    fontFamily: Bubba Serif
    fontSize: 15px
    fontWeight: 600
    lineHeight: 1
    letterSpacing: 0px
    fontFeature: '"lnum"'
  field:
    fontFamily: Bubba Serif
    fontSize: 15px
    fontWeight: 400
    lineHeight: 1
    letterSpacing: 0px
    fontFeature: '"lnum"'
  metadata:
    fontFamily: Antonio
    fontSize: 12px
    fontWeight: 300
    lineHeight: 1.25
    letterSpacing: 0.6px
  label:
    fontFamily: Antonio
    fontSize: 11px
    fontWeight: 500
    lineHeight: 1.25
    letterSpacing: 0.55px
  block-label:
    fontFamily: Antonio
    fontSize: 12px
    fontWeight: 500
    lineHeight: 1.25
    letterSpacing: 0.6px
  marker:
    fontFamily: Bubba Serif
    fontSize: 12px
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: 0.24px
    fontFeature: '"lnum"'
rounded:
  pill: 999px
  card: 12px
  highlight: 24px
spacing:
  "1": 4px
  "2": 8px
  "3": 12px
  "4": 16px
  "5": 20px
  "6": 24px
  "8": 32px
  "10": 40px
  "14": 56px
  "20": 80px
omitted:
  - section: components
    reason: "Os componentes ficam em cada canal, conforme a ADR 0018 do Bubba."
---

# Bubba

<!--
Gerado por scripts/design-md.ts no @bubbacore/elvis. Não edite este arquivo: mude as entradas e rode npm run build.
Release do Elvis: 0.6.0 x-release-please-version
Formato: DESIGN.md alpha, conferido com o @google/design.md fixado no repositório.
SHA-256 das entradas:
- tokens/primitives.tokens.json: 3ad831c8c2506eddefe4fb4d70bd603bb6329171ed6f08e4d80b6057fc90063a
- tokens/semantic.tokens.json: bbaa88948ec3bdcb86accdaca3aa3c2ca73d9049a4d985a05add9b7979970a9a
- usage-rules.md: f979498ac94095b90df50688827831133f53b7c5c52c3ec8e48d40797129769d
- voice.md: 70c9576336f1c3061b165531469034d1fb58308659bd72f2d28ced5377793344
-->

## Overview

Marca e valores-base do Bubba, um site público e gratuito com a programação dos cinemas. O layout, a elevação e os componentes ficam em cada canal.

### Direção visual

A interface é clara, quase monocromática e editorial. O fundo off-white, as superfícies brancas e as letras serifadas deixam a programação em primeiro plano. O azul tem funções definidas, e o coral indica atenção. O calor vem da voz e dos poucos momentos em que o personagem aparece.

- Use tamanho, peso e espaço para organizar a informação. Títulos e controles usam Bubba Serif, o subconjunto da Playfair Display distribuído pelo Elvis. Antonio fica nos três papéis indicados na seção Tipografia.
- Use a assinatura vetorial no cabeçalho. O personagem em 3D aparece estático nos estados previstos pelo produto e nas prévias de link, com o halo azul aprovado.
- Preserve a clareza dos horários, dos preços de bilheteria e dos avisos. O humor do personagem nunca muda nem encobre um dado.
- O tema da interface é somente claro. A variante branca da logo e a adaptação do favicon ao navegador atendem a aplicações específicas.

### Personalidade

- O Bubba fala como um amigo de verdade, que quer o seu melhor e inclui você nos próprios planos.
- O Bubba é amigável, claro e tem um caráter editorial ligado ao cinema. O personagem é um companheiro meio atrapalhado, carinhoso, leal e sempre otimista.
- O otimismo oferece uma possibilidade real; o cuidado explica o limite do dado; a lealdade mantém a informação confiável mesmo quando ela frustra um plano.
- O jeito atrapalhado fica no humor breve dos momentos do personagem. Nunca justifica uma falha, altera um dado ou faz graça com a pessoa.
- O Bubba convida a fazer planos juntos e mostra cuidado na informação que oferece.
- A personalidade fica a mesma em toda situação. O que muda é o tom.

## Colors

Estas são todas as cores da marca. Cada nome do DESIGN.md corresponde a um token semântico do Elvis, com o papel descrito no próprio token:

- **primary** (`color.action.primary`, `#496EA1`): Fundo da ação principal, como os botões da Seleção do link, com o texto em color.text.inverse.
- **action-selected** (`color.action.selected`, `#050505`): Fundo da pílula de filtro ativa, com o texto em color.text.inverse.
- **action-disabled** (`color.action.disabled`, `#B0AFAF`): Fundo da ação principal desabilitada, sem resposta a hover e foco. Fica fora do contraste mínimo, pelo WCAG 1.4.3.
- **surface-paper** (`color.surface.paper`, `#F7F7F7`): Fundo da página e superfície das pílulas claras dentro dos cartões brancos.
- **surface-card** (`color.surface.card`, `#FFFFFF`): Cartões, fundo dos horários e pílulas claras sobre a página e sobre o azul-névoa.
- **surface-mist** (`color.surface.mist`, `#E9EFF6`): Cartão azul-névoa, dos cartões informativos e da Seleção do link.
- **surface-no-sessions-day** (`color.surface.no-sessions-day`, `#EBEBEB`): Fundo da pílula do dia sem sessões, que continua clicável e é identificada pelo texto.
- **surface-logo-frame** (`color.surface.logo-frame`, `#504D4D`): Fundo dos quadros escuros da logo, sempre com o conteúdo branco.
- **text-ink** (`color.text.ink`, `#050505`): Títulos, links de texto no estado normal, texto digitado nos campos e texto das pílulas de filtro. É também a tinta da logo.
- **text-body** (`color.text.body`, `#717171`): Texto normal e de apoio, notas, Marcação, valores de metadado e placeholder.
- **text-blue** (`color.text.blue`, `#496EA1`): Azul funcional no texto: horários padrão, rótulo de bloco, marcador, label padrão, ação secundária e links no hover e no foco, com o sublinhado.
- **text-attention** (`color.text.attention`, `#E03405`): Atenção: texto do label de alerta e do horário da sessão que já começou. Nunca em títulos nem como fundo.
- **text-inverse** (`color.text.inverse`, `#FFFFFF`): Texto sobre a ação principal, sobre o filtro ativo e nos quadros escuros da logo.
- **text-disabled** (`color.text.disabled`, `#B0AFAF`): Texto da ação secundária desabilitada, sem resposta a hover e foco. Componentes desabilitados ficam fora do contraste mínimo, pelo WCAG 1.4.3.
- **border-field** (`color.border.field`, `#7190BC`): Borda de 1 px dos campos, igual no estado normal e no foco.
- **border-blue** (`color.border.blue`, `#496EA1`): Borda dos horários padrão, contínua com ação e pontilhada sem ação, e a sombra sólida dos que têm ação no hover e no foco.
- **border-attention** (`color.border.attention`, `#E03405`): Borda da sessão que já começou, contínua com ação e pontilhada sem ação, e a sombra sólida dela no hover e no foco.
- **focus-filter** (`color.focus.filter`, `#050505`): Contorno externo dos filtros, no hover e no foco, desenhado com focus.width e afastado por focus.offset.
- **focus-action** (`color.focus.action`, `#496EA1`): Contorno externo das ações e dos menus, no hover e no foco, desenhado com focus.width e afastado por focus.offset.
- **focus-field** (`color.focus.field`, `#7190BC`): Sombra externa sólida do campo em foco, sem afastamento nem desfoque.
- **halo-strong** (`color.halo.strong`, `#7190BC`): Tom mais forte do halo azul do personagem. É decorativo e fica fora dos pares de contraste.
- **halo-medium** (`color.halo.medium`, `#A5BBDB`): Tom médio do halo azul do personagem. É decorativo e fica fora dos pares de contraste.
- **halo-soft** (`color.halo.soft`, `#C9D6E9`): Tom mais suave do halo azul do personagem. É decorativo e fica fora dos pares de contraste.

### Cores

Use os tokens semânticos de `tokens.css` ou `tokens.json`. Os primitivos são internos. Um valor compartilhado pode atender a vários papéis, e cada aplicação deve escolher o token do seu papel.

| Valor | Papel |
| --- | --- |
| `#050505` | Tinta da logo, títulos, links no normal, texto dos campos e dos filtros; fundo dos filtros ativos |
| `#504D4D` | Quadros escuros da logo |
| `#717171` | Texto normal e de apoio, Marcação, metadados e placeholder |
| `#B0AFAF` | Componentes desativados |
| `#EBEBEB` | Fundo do dia sem sessões, que continua clicável |
| `#F7F7F7` | Fundo da página, pílulas claras dentro de cartões brancos e placa do ícone de atalho |
| `#FFFFFF` | Cartões, pílulas claras sobre a página ou azul-névoa, texto de controles preenchidos e logo branca |
| `#496EA1` | Horários padrão, ações, menu, marcadores, labels, rótulos de bloco e links no hover e no foco |
| `#7190BC` | Borda e foco dos campos; halo do personagem |
| `#A5BBDB` e `#C9D6E9` | Halo do personagem |
| `#E9EFF6` | Cartões informativos azul-névoa |
| `#E03405` | Label de atenção e sessão que já começou |

Cada par exigido de texto, borda ou foco tem contraste declarado nos tokens e cumpre o WCAG 2.2 AA. Nenhuma exceção de contraste foi aceita. Os azuis claros do halo não substituem o azul funcional nos textos. Os preços de bilheteria permanecem em peso regular e não recebem um acento próprio de cor.

## Typography

Sem o `fonts.css` do pacote, use a Playfair Display no lugar da Bubba Serif, que tem o mesmo desenho, e a Antonio do Google Fonts, que não é a Anton. Os níveis em Bubba Serif levam `fontFeature: "lnum"`, os algarismos alinhados, aplicados também com `font-variant-numeric: lining-nums`. Os níveis terminados em `-wide` substituem o nível de mesmo nome a partir de 960 px de largura, e os demais não mudam.

- **display** (`typography.display.base`): Bubba Serif 600, 40px. Display, o maior título, no celular. A partir de breakpoint.wide, vale o nível wide.
- **display-wide** (`typography.display.wide`): Bubba Serif 600, 56px. Display, o maior título, em telas largas.
- **character** (`typography.character.base`): Bubba Serif 400, 24px. Título do personagem e da página 404, nas falas em primeira pessoa, no celular. A partir de breakpoint.wide, vale o nível wide.
- **character-wide** (`typography.character.wide`): Bubba Serif 400, 28px. Título do personagem e da página 404 em telas largas.
- **title-1** (`typography.title.1.base`): Bubba Serif 600, 30px. Título 1 no celular. A partir de breakpoint.wide, vale o nível wide.
- **title-1-wide** (`typography.title.1.wide`): Bubba Serif 600, 36px. Título 1 em telas largas.
- **title-2** (`typography.title.2.base`): Bubba Serif 600, 20px. Título 2 no celular. A partir de breakpoint.wide, vale o nível wide.
- **title-2-wide** (`typography.title.2.wide`): Bubba Serif 600, 22px. Título 2 em telas largas.
- **title-3** (`typography.title.3.base`): Bubba Serif 600, 17px. Título 3 no celular. A partir de breakpoint.wide, vale o nível wide.
- **title-3-wide** (`typography.title.3.wide`): Bubba Serif 600, 18px. Título 3 em telas largas.
- **body** (`typography.body`): Bubba Serif 400, 17px. Leitura: texto corrido, como a sinopse.
- **body-small** (`typography.body-small`): Bubba Serif 400, 15px. Leitura menor e a informação ao lado da Marcação, como os nomes do diretor e do elenco, que vão em font.weight.text.bold.
- **time** (`typography.time`): Bubba Serif 600, 16px. Horário da sessão, numa linha só, cada um na própria pílula, porque a Bubba Serif não tem algarismos de largura igual.
- **control** (`typography.control`): Bubba Serif 600, 15px. Controle: pílulas de filtro, botões e menus, numa linha só.
- **field** (`typography.field`): Bubba Serif 400, 15px. Campo: texto digitado e placeholder, numa linha só.
- **metadata** (`typography.metadata`): Antonio 300, 12px. Marcação: rótulo de metadado, como Dirigido por e Duração, em caixa alta, em color.text.body, em linha com a informação e alinhado à direita.
- **label** (`typography.label`): Antonio 500, 11px. Label: estado curto, em caixa alta, sem caixa, com ponto de 6 px e halo de 4 px na mesma cor com alpha 0,2, a 5 px do texto, sem animação. Em color.text.blue no padrão e em color.text.attention no alerta.
- **block-label** (`typography.block-label`): Antonio 500, 12px. Rótulo de bloco: nome de um bloco da página, em caixa alta, em color.text.blue nas superfícies claras e em color.text.inverse nos quadros escuros da logo.
- **marker** (`typography.marker`): Bubba Serif 700, 12px. Marcador: marcador de sala, como VIP e XD, só texto em color.text.blue, sem caixa, fundo ou borda, com o mesmo estilo em todo lugar.

### Tipografia

- Use Bubba Serif em toda a interface, inclusive controles e marcadores. É o mesmo desenho da Playfair Display, com o nome da família alterado no subconjunto latino por exigência da OFL, que reserva o nome original.
- Use Antonio somente na Marcação, no Label e no Rótulo de bloco, sempre em caixa alta. Essa apresentação é feita pelo estilo; os textos de origem ficam em caixa normal, conforme o guia de voz.
- Use algarismos alinhados (`font-variant-numeric: lining-nums`). Bubba Serif não tem algarismos tabulares: cada horário fica na própria pílula, sem alinhamento dígito a dígito numa coluna.
- Aplique cada nível inteiro de `typography`, com família, peso, tamanho, espaço entre letras, altura de linha e algarismos. O segundo tamanho da tabela vale a partir de `breakpoint.wide`, 960 px.

| Nível no pacote | Família e peso | Tamanho | Entre letras | Altura de linha |
| --- | --- | --- | --- | --- |
| `display.base` / `display.wide` | Bubba Serif 600 | 40 / 56 px | -0,02 em | 1,05 |
| `character.base` / `character.wide` | Bubba Serif 400 | 24 / 28 px | -0,01 em | 1,25 |
| `title.1.base` / `title.1.wide` | Bubba Serif 600 | 30 / 36 px | -0,015 em | 1,12 |
| `title.2.base` / `title.2.wide` | Bubba Serif 600 | 20 / 22 px | -0,01 em | 1,25 |
| `title.3.base` / `title.3.wide` | Bubba Serif 600 | 17 / 18 px | 0 | 1,3 |
| `body` | Bubba Serif 400 | 17 px | 0 | 1,55 |
| `body-small` | Bubba Serif 400 | 15 px | 0 | 1,5 |
| `time` | Bubba Serif 600 | 16 px | 0 | 1 |
| `control` | Bubba Serif 600 | 15 px | 0 | 1 |
| `field` | Bubba Serif 400 | 15 px | 0 | 1 |
| `metadata` | Antonio 300 | 12 px | 0,05 em | 1,25 |
| `label` | Antonio 500 | 11 px | 0,05 em | 1,25 |
| `block-label` | Antonio 500 | 12 px | 0,05 em | 1,25 |
| `marker` | Bubba Serif 700 | 12 px | 0,02 em | 1,2 |

Os caminhos da tabela ficam dentro de `typography`. Marcação é o rótulo do metadado, em `#717171`, alinhado à direita e em linha com a informação. Nomes da direção, do elenco e o ano do filme usam peso 700; personagens do elenco, 400. Marcadores são texto azul, sem caixa, fundo ou borda. Labels têm ponto estático de 6 px, halo de 4 px na mesma cor com alpha 0,2 e 5 px livres até o texto.

## Layout

A escala `spacing` reproduz os tokens `space` do Elvis, e só os valores dela separam os elementos. Todo alvo de toque tem pelo menos 24 px de lado, e os controles principais no celular têm 40 px de altura. A tela larga começa em 960 px.

### Espaço, formas e toque

- A escala de espaço é de 4, 8, 12, 16, 20, 24, 32, 40, 56 e 80 px, nos tokens `space`.
- Pílulas usam raio de 999 px; cartões, 12 px; destaques, 24 px.
- Todo alvo de toque tem pelo menos 24 px de lado. Os controles principais no celular, como horários, dias, filtros e botões, têm 40 px de altura.
- Bordas dos campos e dos horários e sublinhados dos links têm 1 px. O preço de bilheteria fica fora da pílula do horário.
- Informações da sessão mais baixas que a pílula ficam centralizadas verticalmente; blocos maiores alinham pelo topo, sem esticar a pílula.
- Composição, elevação e sombras de cartões pertencem ao canal, conforme a ADR 0018.

## Shapes

Os cantos ficam em `rounded`: 999 px nas pílulas, 12 px nos cartões e 24 px nos destaques. As bordas dos campos e dos horários e o sublinhado dos links têm 1 px. O foco desenha um contorno externo de 2 px, afastado 2 px do controle; campos e horários usam uma sombra externa sólida de 1 px, sem afastamento nem desfoque. As transições duram 180 ms, com `cubic-bezier(0, 0, 0.58, 1)`.

### Foco e movimento

- Filtros têm texto `#050505`, superfície clara e fundo `#050505` com texto branco quando ativos. Hover e foco mantêm as cores e acrescentam contorno de 2 px, afastado 2 px, em `#050505`.
- Ações principais têm fundo `#496EA1` e texto branco; secundárias têm texto azul e superfície clara, sem borda. Hover e foco acrescentam o mesmo contorno de 2 px afastado 2 px, em azul. Ações independentes têm contornos individuais imediatos.
- Só menus e filtros usam contorno compartilhado deslizante, em 180 ms ease-out. O foco do teclado tem prioridade, e o contorno acompanha quebras de linha, rolagem e redimensionamento. Na primeira entrada, aparece no item; ao sair, some se não houver foco. Sem JavaScript, cada item conserva foco visível individual.
- Campos mantêm borda de 1 px em `#7190BC`; foco acrescenta sombra externa sólida de 1 px na mesma cor, sem afastamento ou desfoque. Não há efeito de hover nem mudança de posição ou tamanho.
- Horários com ação são links com borda contínua de 1 px e sombra externa sólida de 1 px no hover e no foco. Sem ação, têm contorno pontilhado e nenhuma interação. O padrão é azul; Já começou usa `#E03405`, independentemente de haver ação. A cor de atenção fica nas superfícies com contraste declarado, como o branco.
- Links de texto são `#050505` com sublinhado pontilhado. Hover e foco passam a azul com sublinhado contínuo de 1 px. A mudança entre pontilhado e contínuo é imediata.
- Cores dos links e sombras de campos e horários mudam em 180 ms ease-out, inclusive na saída. Com movimento reduzido, nenhuma transição ou animação acontece. Labels e seus pontos são sempre estáticos.
- Componentes desativados usam `#B0AFAF`, sem hover nem foco.

## Do's and Don'ts

### Usos indevidos

Use os arquivos fornecidos como estão. Não:

- estique, comprima, gire ou recorte a figura;
- redesenhe, recoloque ou separe partes do personagem e das assinaturas;
- troque a tinta por preto puro `#000000` ou por outra cor;
- reconstrua BUBBA como texto digitado;
- aplique sombra, contorno, brilho ou efeitos aos arquivos da logo;
- use a variante branca sem contraste, ou a preta sobre fundo escuro;
- coloque a logo diretamente sobre uma fotografia que prejudique sua leitura;
- leve o personagem em 3D para o cabeçalho, anime-o ou crie novas poses sem aprovação;
- misture a pena, as fontes ou as cores da identidade anterior com a nova.

### Caixa e pontuação

- Escreva títulos, botões, rótulos e abas em caixa normal, com maiúscula só na primeira letra e nos nomes próprios.
- A apresentação visual da Marcação, do Label e do Rótulo de bloco usa Antonio em caixa alta, conforme as regras de uso. Aplique a caixa alta pelo estilo, sem mudar o texto de origem nem estendê-la aos outros papéis.
- Não ponha ponto final em títulos, botões e rótulos curtos. Ponha ponto final em frases completas.

### Números, datas e preços

- Escreva o preço com o símbolo e um espaço, como "R$ 42", e com os centavos só quando houver, como "R$ 42,50".
- Mostre só o preço de bilheteria, sem taxa de conveniência, e nunca o chame de "preço real", "valor" ou "preço do ingresso".
- Nas frases corridas, escreva os horários como "19h30" e "21h".
- No seletor de dias, use "Hoje", "Amanhã" e o dia da semana abreviado com a data, como "Dom 27".

## Logo

### Formas e hierarquia

| Forma | Uso |
| --- | --- |
| Assinatura horizontal vetorial | Forma principal, no cabeçalho do site e nos documentos |
| Assinatura vertical vetorial | Capas e espaços quadrados |
| Ícone vetorial | Identificação compacta, avatar, navegação e favicon |
| Assinatura isolada, só BUBBA | Quando o personagem já está próximo |
| Bubba em 3D e assinaturas 3D | Momentos do personagem, capas, slides e prévias de link, nunca o cabeçalho do site |

As letras da assinatura já fazem parte do desenho. Não as reconstrua com uma fonte. A Inter pertence somente aos arquivos da assinatura e não é fonte da interface.

### Área de segurança

A unidade x é o diâmetro vertical de uma pupila do ícone na escala da figura. Reserve 1x livre em cada lado do ícone e das três assinaturas vetoriais, a partir das extremidades completas do desenho, incluindo antenas e cauda.

- Textos, bordas, imagens e outros símbolos ficam além dessa reserva. O fundo pode continuar sob ela.
- O ícone original tem x de 49,388 unidades; a assinatura horizontal e a isolada, 26,147; a vertical, 40,301. A medida acompanha a escala do arquivo.
- Os SVGs e PNGs vetoriais de `exports/` já incluem a reserva transparente. Conte essa margem ao dimensionar o arquivo no layout.
- Os desenhos de `logo/` não incluem a reserva. Quem os usar precisa acrescentá-la.
- O personagem em 3D, as assinaturas 3D, o favicon e o ícone de atalho têm enquadramentos próprios. Não aplique automaticamente a margem de 1x a eles.

### Tamanhos na tela

| Aplicação | Regra |
| --- | --- |
| Favicon | Use os arquivos próprios de 16, 32 e 48 px, ou o SVG adaptável, com o mesmo ícone vetorial |
| Ícone de atalho | Use `apple-touch-icon.png`, de 180 px, com figura de 126 px sobre placa `#F7F7F7` |
| Ícone, assinaturas e personagem em outras aplicações | Não há mínimo numérico geral aprovado para a identidade nova. Confira a leitura no tamanho real e aprove a aplicação antes de usá-la |

Os tamanhos de export são resoluções de arquivo, não mínimos de aplicação. Não reutilize os mínimos da antiga assinatura com pena. Tamanhos para impressão serão definidos com o primeiro material físico e sua prova de reprodução.

### Versões por fundo

| Fundo | Versão |
| --- | --- |
| Claro, como `#F7F7F7` ou branco | Vetorial em `#050505`, variante `black` |
| Escuro | Vetorial branco, variante `white`; os quadros de referência usam `#504D4D` |
| Fotografia | Arquivo aprovado sobre placa clara ou escura, com contraste e área de segurança preservados |
| Favicon SVG | Transparente, em `#050505`, passando a branco conforme o tema do navegador |
| Favicon PNG ou ICO | Transparente, em `#050505` |

O personagem e as assinaturas 3D conservam as cores e o desenho dos arquivos aprovados.

### Personagem

No site, o personagem aparece estático na seleção sem sessões no dia, nos filtros sem resultado, na página 404 e nas prévias de cinema e de programação. Ele fala em primeira pessoa apenas nesses momentos, conforme `voice.md`.

Use o PNG aprovado com halo quando a aplicação pedir o quadro completo. O halo é exclusivamente azul, em `#7190BC`, `#A5BBDB` e `#C9D6E9`, com sete manchas radiais, desfoque de 14 px e transparência antes das bordas. O personagem ocupa 40% da largura do quadro. Não acrescente halo coral nem efeitos sobre o arquivo.

## Voice

### Princípios

#### Cuidado

- Dê primeiro a informação que ajuda a decidir: o filme, o cinema, o dia, o horário e o preço de bilheteria.
- Diga o limite do dado sempre que ele existir, no mesmo lugar em que o dado aparece.
- Aponte o canal oficial do cinema quando o Bubba não tiver o dado.

#### Companheirismo

- Fale direto com a pessoa, por "você".
- Use "vamos" e convites só quando a pessoa está começando um plano, como na primeira visita.
- Mantenha a proximidade sem intimidade forçada: nada de apelidos, gírias de ocasião ou brincadeiras com a situação da pessoa.

#### Inclusão

- Faça convites abertos, sem supor companhia, idade, gênero, gosto ou dinheiro.
- Apresente escolhas com respeito: nenhuma opção é a certa, e nenhuma decisão da pessoa é corrigida.
- Escreva rótulos de botão e de link que façam sentido fora do contexto, para quem usa leitor de tela.
- Não dependa de cor, ícone ou posição para dizer um estado. O texto do estado diz o que ele é.

#### Sinceridade

- Diga com clareza o que está disponível, o que ainda não foi divulgado e o que não pôde ser lido.
- Nunca preencha uma lacuna com suposição, nem troque um estado por outro mais confortável.
- Nunca prometa prazo, atualização, venda de ingressos ou recurso que o produto não tem.

#### Generosidade

- Facilite a decisão e o compartilhamento dos planos.
- Ofereça o próximo passo útil quando a pessoa não encontra o que buscava.
- Não dispute atenção com a programação: um texto ao lado das sessões é curto e some do caminho.

### Língua

- Escreva em português do Brasil, com linguagem cotidiana, direta e calorosa.
- Prefira frases curtas, com uma ideia por frase.
- Prefira frases centradas na pessoa, no cinema e no filme. Fora dos momentos do personagem, quando o produto precisar falar de si, use a primeira pessoa do plural, como "mostramos".
- Use a primeira pessoa do singular somente junto do personagem, na seleção sem sessões no dia, nos filtros sem resultado, na página 404 e nas prévias de cinema e de programação. O personagem fala apenas nesses momentos. Mensagens operacionais, horários, preços e avisos sobre os dados continuam diretos e claros.
- Não use jargão técnico com o visitante, como API, erro 500, build, deploy, cache ou scraping.
- Não use emojis nos textos do site nem nas mensagens operacionais ao dono.
- Use a exclamação no máximo uma vez por texto e só em convites. Nunca a use em avisos e falhas.

### Termos do domínio

- Use os termos do glossário do Bubba pelo nome, sem sinônimos, como sessão, programação, seleção, cinemas próximos, janela, dia não divulgado, dia sem sessões, dia sem funcionamento, preço de bilheteria, tipo de ingresso, classificação indicativa e aviso.
- Use "Em exibição" como rótulo público da programação. Nunca use "em cartaz" nem "grade".
- Chame de sessão uma exibição do filme. "Horário" é só a hora em que a sessão começa.
- Mostre cada cinema pelo nome popular principal, como Cinema do Centro.
- Nas mensagens ao dono, chame de alerta, nunca de aviso, a mensagem sobre um acontecimento, e use ocorrência, resumo de coleta, leitura com falha, recoleta, publicação do site e release, como o glossário os define. Nunca use "deploy", "rollback" ou "notificação".

### Tons por situação

| Situação | Tom | Onde aparece |
| --- | --- | --- |
| Convite | Caloroso, com entusiasmo leve | Primeira visita, montar a seleção, compartilhar |
| Consulta | Neutro, preciso e enxuto | Programação, página do filme, página do cinema, sessão, busca |
| Aviso | Calmo e preciso | Estados do dia, limites dos dados, preço e classificação ausentes, aviso permanente |
| Falha | Sincero, sem drama, com um caminho | Leitura com falha, localização negada, localização que não chega, link com data passada |
| Texto institucional | Claro, sóbrio e sem promessas | Rodapé, termos de uso, prévias de link, apresentações |
| Mensagem operacional ao dono | Factual, respeitoso e próximo | Alertas, resumos de coleta, ocorrências |

#### Convite

- Convide a pessoa para um plano, não para uma tarefa.
- Mostre os caminhos possíveis sem empurrar um deles.
- Diga o que acontece em cada caminho em uma frase.

#### Consulta

- Ponha a informação na frente e o comentário, se houver, depois.
- Corte toda palavra que não ajude a escolher a sessão.
- Repita o mesmo rótulo para a mesma coisa em todas as páginas.

#### Aviso

- Diga o estado com o nome dele, sem amenizar nem dramatizar.
- Diga o que a pessoa pode fazer, quando houver algo a fazer.
- Não peça desculpas por um estado que é normal, como um dia sem funcionamento.

#### Falha

- Diga o que não deu certo e o efeito para a pessoa.
- Dê um caminho: o canal oficial do cinema, outra escolha ou a programação de hoje.
- Nunca encubra a falha com uma frase tranquilizadora que prometa programação completa ou prazo de volta.

#### Texto institucional

- Diga o que o Bubba é e faz hoje, sem adjetivos de propaganda.
- Fale das cidades atendidas como a cobertura atual, não como a identidade do Bubba.
- Não anuncie recursos futuros.

#### Mensagem operacional ao dono

- Comece pelo cinema ou pelo assunto, seguido de dois-pontos.
- Diga o que aconteceu, o efeito no site e a ação necessária, nesta ordem.
- Diga quando nada precisa ser feito.
- Use o termo exato do glossário para o tipo de falha ou de alerta.
- Não use alarme, ironia ou suspense. Uma falha é um fato a resolver.
