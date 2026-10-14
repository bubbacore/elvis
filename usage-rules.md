# Regras de uso da marca

Regras aprovadas pelo dono em 13 de outubro de 2026, na JAM-72. Valem para a assinatura, os ícones, as cores e a tipografia do Bubba em qualquer canal. O layout e os componentes de cada canal ficam no próprio canal.

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
