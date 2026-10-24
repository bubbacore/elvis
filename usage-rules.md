# Regras de uso da marca

Regras aprovadas pelo dono em 13 de outubro de 2026, na JAM-72, e completadas no mesmo dia, na JAM-78, com a escala de tamanhos, o espaçamento e o foco, aprovados numa amostra visual. Em 24 de outubro de 2026, na JAM-116, o dono aprovou o texto da direção visual e as alturas de linha dos níveis de tipografia, também numa amostra visual. Valem para a assinatura, os ícones, as cores, a tipografia e os valores-base do Bubba em qualquer canal. O layout e os componentes de cada canal ficam no próprio canal.

## Direção visual

A direção do Bubba é a "Sala clara com as cores do Cartaz", escolhida pelo dono em 13 de outubro de 2026, na JAM-72. Ela junta a composição da direção Sala, que o dono achou a mais harmônica e confortável, com as cores da direção Cartaz, tiradas do pôster americano de Forrest Gump, de 1994.

- **Sala clara:** a tela é clara e calma, como uma sala com a luz acesa antes da sessão. A programação vem primeiro, com espaço generoso e poucos elementos por tela, e a hierarquia vem do tamanho e do peso das letras.
- **Cores do Cartaz:** papel branco, apoio azul-acinzentado e tinta azul-escura, nunca preto. O azul da assinatura é o único acento frequente e mostra onde agir e o que custa: seleção, ação, links e preços. O vermelho da pena é raro e fica no foco e nos avisos, para não competir com a pena.
- **Letras do Cartaz:** os títulos usam a Noto Serif Display estreita, de alto contraste e serifas finas, próxima da letra do título do pôster, sempre em caixa normal e na cor da tinta. Todo o resto usa a Hanken Grotesk, sóbria e legível, com algarismos de largura igual nos horários e nos preços.
- **Formas discretas:** bordas de 1 px, cantos de 6 px nos controles e o preço numa caixa com borda. A marca é o único ornamento: a personalidade vem dos títulos, das cores e da voz, sem texturas nem efeitos decorativos.
- **Acolhimento:** a interface ajuda a pessoa a decidir quando e onde ver um filme e não disputa atenção com a programação.

## Formas e hierarquia

| Forma | Uso |
| --- | --- |
| Assinatura `bubba` | Identificação completa: cabeçalho do site, apresentações, documentos e materiais institucionais |
| b com pena | Identificação compacta: favicon, ícone de app, avatar nos canais e navegação |
| Pena | Acento secundário onde o Bubba já está identificado, como marcador de lista e grafismo de slide |

A assinatura é a forma principal. Os ícones nascem dela e são usados sozinhos, nunca ao lado da assinatura, que já contém a pena.

## Área de proteção

A medida x é a largura da haste do primeiro b: 19,2 unidades do desenho. Ela acompanha qualquer ampliação ou redução.

- A assinatura tem x livre em todos os lados.
- Os ícones têm x/2 livre em todos os lados.
- A medida começa na figura inteira, pontas da pena incluídas.
- Textos, imagens, linhas, bordas e outros símbolos ficam fora dessa área.

Os SVGs e PNGs de `exports/` já incluem a área de proteção.

## Tamanhos mínimos na tela

| Forma | Mínimo |
| --- | --- |
| Assinatura | 32 px de altura da figura, sem a área de proteção; no arquivo com proteção, cerca de 46 px. O cabeçalho do site usa 32 px |
| b com pena | Caixa quadrada de 32 px, com o arquivo quadrado, que já inclui a margem |
| Pena | Caixa quadrada de 48 px; a figura tem 36 px de largura dentro dela |
| Favicon | 16, 32 e 48 px, com o arquivo próprio de `exports/favicon/` |

Os tamanhos para impressão serão definidos com o primeiro material físico e sua prova de reprodução.

## Versões por fundo

| Fundo | Versão |
| --- | --- |
| Papel `#FFFFFF` ou apoio `#F3F5FB` | Em cor |
| Azul da marca `#011D97` ou tinta `#0D1330` | Clara, em `#F7F7F2` |
| Impressão em uma cor | Azul |
| Fotografia | Em cor, sobre uma placa branca que respeite a área de proteção |

## Usos indevidos

Use sempre os arquivos fornecidos, como estão. Evite:

- esticar, comprimir ou girar;
- trocar as cores das letras e da pena;
- aplicar sombra, contorno, brilho ou outro efeito;
- remover, separar ou recompor a pena;
- usar a versão em cor sobre o azul da marca;
- usar o vermelho como fundo;
- aplicar a logo sobre uma foto sem a placa.

## Cores

Os valores e o papel de cada cor estão nos tokens semânticos, em `tokens/semantic.tokens.json`, que referenciam os valores brutos de `tokens/primitives.tokens.json`. Use sempre os tokens semânticos: os primitivos são internos.

- Títulos e textos usam a tinta `#0D1330`.
- O azul da marca `#011D97` marca seleção, ação, links, preços e capas sem imagem.
- O vermelho da pena `#C71615` fica na pena, no foco e nos avisos, e nunca em títulos nem como fundo.
- O divisor `#DDE1EC` é decorativo: nenhuma informação depende só dele.
- Cada par de texto e fundo, de borda e de foco tem contraste declarado nos tokens e cumpre o WCAG 2.2 AA.

## Tipografia

- **Noto Serif Display**, peso 600 e largura 62,5%, só em títulos, nunca abaixo de 20 px.
- **Hanken Grotesk** em todo o resto: leitura em 400, destaques em 500 e 700, horários e preços em 700, com algarismos de largura igual.
- Todo título usa a cor da tinta e caixa normal, nunca caixa alta.
- Os títulos vão de 20 a 48 px, em cinco tamanhos, e o texto usa 14, 16 e 18 px, conforme `font.size` nos tokens semânticos.
- Cada uso do texto tem um nível de tipografia, em `typography` nos tokens semânticos, com a família, o peso, o tamanho, o espaço entre letras e a altura de linha, além da largura nos títulos. Use o nível inteiro, sem escrever a altura de linha à mão.

| Nível | Uso | Fonte | Altura de linha |
| --- | --- | --- | --- |
| `title.xs` | Nome do filme numa lista de sessões | Noto Serif Display 600, 20 px | 1,2 (24 px) |
| `title.sm` | Título de seção, como o cinema ou o dia | Noto Serif Display 600, 24 px | 1,2 (28,8 px) |
| `title.md` | Título da página no celular | Noto Serif Display 600, 32 px | 1,1 (35,2 px) |
| `title.lg` | Título da página em telas largas | Noto Serif Display 600, 40 px | 1,1 (44 px) |
| `title.xl` | Destaques e capas em telas largas | Noto Serif Display 600, 48 px | 1,1 (52,8 px) |
| `text.sm` | Rótulos e informações de apoio | Hanken Grotesk 400, 14 px | 1,4 (19,6 px) |
| `text.md` | Leitura e controles | Hanken Grotesk 400, 16 px | 1,5 (24 px) |
| `text.lg` | Texto de abertura e sinopse | Hanken Grotesk 400, 18 px | 1,5 (27 px) |
| `figures` | Horários e preços | Hanken Grotesk 700, 16 px | 1,2 (19,2 px) |

- Os títulos pequenos têm 1,2 porque um nome longo de filme quebra em duas ou três linhas, e a maiúscula acentuada da Noto Serif Display, como o Á, alcança a descendente da linha de cima abaixo de 1,17. Os títulos grandes têm 1,1, que mantém o bloco compacto, e em geral cabem numa linha.
- O texto corrido tem 1,5, a altura de linha que o WCAG recomenda para parágrafos. Os rótulos, quase sempre numa linha só, têm 1,4.
- Os horários e os preços têm 1,2, porque ficam numa linha só, centrados em controles de pelo menos 44 px.

## Espaço, cantos e foco

- Todo espaçamento usa a escala `space`, em múltiplos de 4 px.
- Controles e caixas têm canto de 6 px, e o ícone de app, de 12 px.
- Bordas de controles, divisórias e a caixa do preço têm 1 px.
- Todo controle mostra o foco com um anel de 2 px no vermelho da pena, afastado 2 px do controle, para que o anel fique sobre a superfície em volta.
- A área de toque de todo controle tem pelo menos 44 px de lado.

## Arquivos

| Pasta | Conteúdo |
| --- | --- |
| `logo/` | Desenhos aprovados, sem área de proteção: a assinatura `wordmark`, o b com pena `icon-b-feather` e a pena `icon-feather`, em cor, negativa (`negative`) e monocromática (`monochrome`), e os ícones em caixa quadrada (`square`) |
| `exports/svg/` | Assinatura, b com pena e pena com proteção, nas versões em cor (`color`), azul (`blue`) e clara (`light`) |
| `exports/png/` | Os mesmos desenhos em PNG transparente: assinaturas com 512, 1024 e 2048 px de largura; ícones com 32 a 512 px de lado |
| `exports/favicon/` | `favicon.svg`, `favicon.ico` com 16, 32 e 48 px, PNGs de 16 a 512 px e `apple-touch-icon.png` com 180 px, sobre placa `#F7F7F2` |
| `fonts/` | Noto Serif Display e Hanken Grotesk, com as licenças SIL Open Font License 1.1 |
| `tokens/` | Os tokens em DTCG: os semânticos, que são o contrato público, e os primitivos, internos |

Os exports usam os mesmos paths dos desenhos de `logo/`; mudam só a área de desenho, a margem e o preenchimento. Os PNGs abaixo dos tamanhos mínimos servem para prova ou para usos específicos.
