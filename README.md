# bubbacore/elvis

O núcleo de marca e design system do Bubba: a logo, as cores, as fontes, a voz e, depois, os valores-base que o site e os demais canais consomem.

## O que tem aqui

- **`usage-rules.md`:** as regras de uso da marca, aprovadas pelo dono: formas, área de proteção, tamanhos mínimos, versões por fundo, usos indevidos, cores, tipografia, espaço, cantos e foco.
- **`voice.md`:** o guia de voz e tons do Bubba, com regras de escrita e exemplos certos e errados por situação, para pessoas e agentes. Os exemplos foram aprovados pelo dono na JAM-79, em 13 de outubro de 2026.
- **`logo/`:** a assinatura `bubba` (`wordmark`) e os dois ícones derivados, o b com pena (`icon-b-feather`) e a pena (`icon-feather`), nas versões em cor, negativa e monocromática, além dos ícones em caixa quadrada.
- **`exports/`:** a assinatura e os ícones com a área de proteção, em SVG e PNG, e os favicons e atalhos.
- **`tokens/`:** os valores-base no formato DTCG 2025.10:
  - `semantic.tokens.json`, o contrato público, com um token por papel e sua descrição: cores, fontes, tamanhos, espaçamento, cantos, foco e alvo de toque, além dos pares de cor que precisam de contraste;
  - `primitives.tokens.json`, os valores brutos, internos, referenciados pelos semânticos.
- **`fonts/`:** Noto Serif Display, nos títulos, e Hanken Grotesk, na leitura, com as licenças SIL Open Font License 1.1.
- **`manifest.json`:** o SHA-256 de cada recurso aprovado.
- **`scripts/`:** a geração das saídas do pacote, como o `tokens.css`, o `fonts.css` com as fontes em WOFF2 e os exports, e a verificação dos tokens, do contraste e dos exports. Os comandos, as saídas e as convenções estão no [`CONTRIBUTING.md`](CONTRIBUTING.md).
- **`proof/`:** o consumidor de prova, que instala o pacote do npm num projeto vazio e monta com as entradas públicas a referência visual, publicada a cada release.

## Estado

Os recursos foram aprovados pelo dono na JAM-72, em 13 de outubro de 2026. Os nomes em inglês e os tokens em DTCG seguem a ADR 0014, no Dan, e vieram na JAM-78, em que o dono aprovou também o espaçamento, a escala de tamanhos e o foco. A geração das saídas e a verificação no CI vieram na JAM-80, e a publicação no npm, o consumidor de prova e os releases, na JAM-81.

## Como usar

A [referência visual](https://bubbacore.github.io/elvis/) mostra o último release: cada token com a amostra, o valor e a variável CSS pronta para copiar, os pares de contraste, a logo com os arquivos para baixar e um exemplo de uso.

O pacote [`@bubbacore/elvis`](https://www.npmjs.com/package/@bubbacore/elvis) está no npm. Instale uma versão exata:

```sh
npm install --save-exact @bubbacore/elvis@<versão>
```

As entradas públicas são:

| Entrada | Conteúdo |
| --- | --- |
| `@bubbacore/elvis/tokens.css` | Os tokens semânticos em variáveis CSS `--bubba-*` no `:root`. |
| `@bubbacore/elvis/fonts.css` | Os `@font-face` das duas famílias, em WOFF2 de subconjunto latino. |
| `@bubbacore/elvis/fonts/*` | As fontes e as licenças OFL. |
| `@bubbacore/elvis/tokens.json` | Os tokens semânticos em DTCG, com os valores resolvidos e os pares de cor que precisam de contraste. |
| `@bubbacore/elvis/logo/*` | Os desenhos da logo em SVG. |
| `@bubbacore/elvis/exports/*` | A assinatura e os ícones em SVG e PNG, os favicons e o ícone de atalho. |
| `@bubbacore/elvis/usage-rules.md` | As regras de uso da marca. |
| `@bubbacore/elvis/voice.md` | O guia de voz. |
| `@bubbacore/elvis/manifest.json` | A versão e o SHA-256 de cada arquivo do pacote. |

Os demais caminhos não fazem parte do contrato. Quem consome o pacote e como atualiza estão no [`CONSUMERS.md`](CONSUMERS.md), e as licenças, no [`LICENSE.md`](LICENSE.md).

## Onde se encaixa

```
decisões de marca e de produto (bubbacore/dan)
  → recursos e valores-base aprovados (bubbacore/elvis)
  → site, materiais e canais do Bubba
```

O Elvis entrega a marca e os valores-base: logo, cores, tipografia, espaçamento, cantos e foco. O layout e os componentes de cada canal ficam no próprio canal.

## Princípios

- Cada recurso vem de uma decisão registrada no Dan e muda só por outra.
- Os arquivos da logo são usados como estão, sem redesenho, recoloração nem recomposição.
- Os títulos usam a cor do texto. O azul da marca marca seleção, ação, links, preços e capas, e o vermelho fica na pena, no foco e nos avisos.
- O Elvis entrega só formatos abertos da web, como CSS, JSON, SVG, PNG e WOFF2. Consumir ou consultar a marca não depende de framework, plugin nem conta em serviço de terceiros.
- Uma ferramenta nova só entra quando substitui um trabalho manual, com a versão fixada.
- A referência visual é gerada das entradas públicas de cada release, sem amostra nem cópia mantida à mão.
