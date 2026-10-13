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

Os valores e o papel de cada cor estão em `tokens/cores-e-tipografia.json`.

- Títulos e textos usam a tinta `#0D1330`.
- O azul da marca `#011D97` marca seleção, ação, links, preços e capas sem imagem.
- O vermelho da pena `#C71615` fica na pena, no foco e nos avisos, e nunca em títulos nem como fundo.

## Tipografia

- **Noto Serif Display**, peso 600 e largura 62,5%, só em títulos, nunca abaixo de 20 px.
- **Hanken Grotesk** em todo o resto: leitura em 400, destaques em 500 e 700, horários e preços em 700, com algarismos de largura igual.
- Todo título usa a cor da tinta e caixa normal, nunca caixa alta.

A escala de tamanhos de cada nível entra nos valores-base do Elvis.

## Arquivos

| Pasta | Conteúdo |
| --- | --- |
| `logo/` | Desenhos aprovados, sem área de proteção: assinatura e ícones em cor, negativa e monocromática, e ícones em caixa quadrada |
| `exports/svg/` | Assinatura, b com pena e pena com proteção, nas versões em cor (`original`), azul e clara |
| `exports/png/` | Os mesmos desenhos em PNG transparente: assinaturas com 512, 1024 e 2048 px de largura; ícones com 32 a 512 px de lado |
| `exports/favicon/` | `favicon.svg`, `favicon.ico` com 16, 32 e 48 px, PNGs de 16 a 512 px e `apple-touch-icon.png` com 180 px, sobre placa `#F7F7F2` |
| `fonts/` | Noto Serif Display e Hanken Grotesk, com as licenças SIL Open Font License 1.1 |

Os exports usam os mesmos paths dos desenhos de `logo/`; mudam só a área de desenho, a margem e o preenchimento. Os PNGs abaixo dos tamanhos mínimos servem para prova ou para usos específicos.
