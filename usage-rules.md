# Regras de uso da marca

Estas regras traduzem a identidade aprovada na JAM-138, consolidada na spec Bubba v1 e na ADR 0019, com as decisões da JAM-139 e da JAM-140 sobre Bubba Serif e favicon. Valem para a logo, o personagem, as cores, as fontes e os valores-base em qualquer canal. O layout, a elevação e os componentes ficam no próprio canal.

## Direção visual

A interface é clara, quase monocromática e editorial. O fundo off-white, as superfícies brancas e as letras serifadas deixam a programação em primeiro plano. O azul tem funções definidas, e o coral indica atenção. O calor vem da voz e dos poucos momentos em que o personagem aparece.

- Use tamanho, peso e espaço para organizar a informação. Títulos e controles usam Bubba Serif, o subconjunto da Playfair Display distribuído pelo Elvis. Antonio fica nos três papéis indicados na seção Tipografia.
- Use a assinatura vetorial no cabeçalho. O personagem em 3D aparece estático nos estados previstos pelo produto e nas prévias de link, com o halo azul aprovado.
- Preserve a clareza dos horários, dos preços de bilheteria e dos avisos. O humor do personagem nunca muda nem encobre um dado.
- O tema da interface é somente claro. A variante branca da logo e a adaptação do favicon ao navegador atendem a aplicações específicas.

## Formas e hierarquia

| Forma | Uso |
| --- | --- |
| Assinatura horizontal vetorial | Forma principal, no cabeçalho do site e nos documentos |
| Assinatura vertical vetorial | Capas e espaços quadrados |
| Ícone vetorial | Identificação compacta, avatar, navegação e favicon |
| Assinatura isolada, só BUBBA | Quando o personagem já está próximo |
| Bubba em 3D e assinaturas 3D | Momentos do personagem, capas, slides e prévias de link, nunca o cabeçalho do site |

As letras da assinatura já fazem parte do desenho. Não as reconstrua com uma fonte. A Inter pertence somente aos arquivos da assinatura e não é fonte da interface.

## Área de segurança

A unidade x é o diâmetro vertical de uma pupila do ícone na escala da figura. Reserve 1x livre em cada lado do ícone e das três assinaturas vetoriais, a partir das extremidades completas do desenho, incluindo antenas e cauda.

- Textos, bordas, imagens e outros símbolos ficam além dessa reserva. O fundo pode continuar sob ela.
- O ícone original tem x de 49,388 unidades; a assinatura horizontal e a isolada, 26,147; a vertical, 40,301. A medida acompanha a escala do arquivo.
- Os SVGs e PNGs vetoriais de `exports/` já incluem a reserva transparente. Conte essa margem ao dimensionar o arquivo no layout.
- Os desenhos de `logo/` não incluem a reserva. Quem os usar precisa acrescentá-la.
- O personagem em 3D, as assinaturas 3D, o favicon e o ícone de atalho têm enquadramentos próprios. Não aplique automaticamente a margem de 1x a eles.

## Tamanhos na tela

| Aplicação | Regra |
| --- | --- |
| Favicon | Use os arquivos próprios de 16, 32 e 48 px, ou o SVG adaptável, com o mesmo ícone vetorial |
| Ícone de atalho | Use `apple-touch-icon.png`, de 180 px, com figura de 126 px sobre placa `#F7F7F7` |
| Ícone, assinaturas e personagem em outras aplicações | Não há mínimo numérico geral aprovado para a identidade nova. Confira a leitura no tamanho real e aprove a aplicação antes de usá-la |

Os tamanhos de export são resoluções de arquivo, não mínimos de aplicação. Não reutilize os mínimos da antiga assinatura com pena. Tamanhos para impressão serão definidos com o primeiro material físico e sua prova de reprodução.

## Versões por fundo

| Fundo | Versão |
| --- | --- |
| Claro, como `#F7F7F7` ou branco | Vetorial em `#050505`, variante `black` |
| Escuro | Vetorial branco, variante `white`; os quadros de referência usam `#504D4D` |
| Fotografia | Arquivo aprovado sobre placa clara ou escura, com contraste e área de segurança preservados |
| Favicon SVG | Transparente, em `#050505`, passando a branco conforme o tema do navegador |
| Favicon PNG ou ICO | Transparente, em `#050505` |

O personagem e as assinaturas 3D conservam as cores e o desenho dos arquivos aprovados.

## Usos indevidos

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

## Cores

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

## Tipografia

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

## Espaço, formas e toque

- A escala de espaço é de 4, 8, 12, 16, 20, 24, 32, 40, 56 e 80 px, nos tokens `space`.
- Pílulas usam raio de 999 px; cartões, 12 px; destaques, 24 px.
- Todo alvo de toque tem pelo menos 24 px de lado. Os controles principais no celular, como horários, dias, filtros e botões, têm 40 px de altura.
- Bordas dos campos e dos horários e sublinhados dos links têm 1 px. O preço de bilheteria fica fora da pílula do horário.
- Informações da sessão mais baixas que a pílula ficam centralizadas verticalmente; blocos maiores alinham pelo topo, sem esticar a pílula.
- Composição, elevação e sombras de cartões pertencem ao canal, conforme a ADR 0018.

## Foco e movimento

- Filtros têm texto `#050505`, superfície clara e fundo `#050505` com texto branco quando ativos. Hover e foco mantêm as cores e acrescentam contorno de 2 px, afastado 2 px, em `#050505`.
- Ações principais têm fundo `#496EA1` e texto branco; secundárias têm texto azul e superfície clara, sem borda. Hover e foco acrescentam o mesmo contorno de 2 px afastado 2 px, em azul. Ações independentes têm contornos individuais imediatos.
- Só menus e filtros usam contorno compartilhado deslizante, em 180 ms ease-out. O foco do teclado tem prioridade, e o contorno acompanha quebras de linha, rolagem e redimensionamento. Na primeira entrada, aparece no item; ao sair, some se não houver foco. Sem JavaScript, cada item conserva foco visível individual.
- Campos mantêm borda de 1 px em `#7190BC`; foco acrescenta sombra externa sólida de 1 px na mesma cor, sem afastamento ou desfoque. Não há efeito de hover nem mudança de posição ou tamanho.
- Horários com ação são links com borda contínua de 1 px e sombra externa sólida de 1 px no hover e no foco. Sem ação, têm contorno pontilhado e nenhuma interação. O padrão é azul; Já começou usa `#E03405`, independentemente de haver ação. A cor de atenção fica nas superfícies com contraste declarado, como o branco.
- Links de texto são `#050505` com sublinhado pontilhado. Hover e foco passam a azul com sublinhado contínuo de 1 px. A mudança entre pontilhado e contínuo é imediata.
- Cores dos links e sombras de campos e horários mudam em 180 ms ease-out, inclusive na saída. Com movimento reduzido, nenhuma transição ou animação acontece. Labels e seus pontos são sempre estáticos.
- Componentes desativados usam `#B0AFAF`, sem hover nem foco.

## Personagem

No site, o personagem aparece estático na seleção sem sessões no dia, nos filtros sem resultado, na página 404 e nas prévias de cinema e de programação. Ele fala em primeira pessoa apenas nesses momentos, conforme `voice.md`.

Use o PNG aprovado com halo quando a aplicação pedir o quadro completo. O halo é exclusivamente azul, em `#7190BC`, `#A5BBDB` e `#C9D6E9`, com sete manchas radiais, desfoque de 14 px e transparência antes das bordas. O personagem ocupa 40% da largura do quadro. Não acrescente halo coral nem efeitos sobre o arquivo.

## Arquivos

| Caminho | Conteúdo |
| --- | --- |
| `logo/` | Ícone e assinaturas vetoriais `horizontal-lockup`, `vertical-lockup` e `wordmark`, em `black` e `white`, sem área de segurança; `bubba-3d.png` e assinaturas 3D aprovadas |
| `exports/svg/` | As quatro formas vetoriais com área de segurança, em `black` e `white` |
| `exports/png/` | Ícone de 32 a 512 px; horizontal e isolada de 512, 1024 e 2048 px; vertical de 256, 512 e 1024 px; personagem de 256, 512 e 1024 px; personagem com halo de 480 e 960 px |
| `exports/favicon/` | `favicon.svg`, `favicon.ico`, PNGs de 16, 32 e 48 px e `apple-touch-icon.png` de 180 px |
| `fonts/bubba-serif/` e `fonts/antonio/` | WOFF2 de subconjunto latino e respectivas licenças OFL 1.1 |
| `tokens.css` e `tokens.json` | Tokens semânticos públicos em CSS e DTCG resolvido, com pares de contraste no JSON |
| `fonts.css` | Declarações `@font-face` de Bubba Serif e Antonio |
| `usage-rules.md` e `voice.md` | Regras de uso e guia de voz distribuídos |
| `manifest.json` | Nome e versão do pacote e SHA-256 dos arquivos distribuídos |

Importe os recursos por `@bubbacore/elvis/<caminho>`. As fontes de tokens em `tokens/` são internas ao repositório; o consumidor usa as saídas públicas. Os caminhos antigos e seus substitutos estão no changelog e no registro de consumidores.
