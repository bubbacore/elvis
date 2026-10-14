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
- **`manifest.json`:** o SHA-256 de cada recurso.

## Estado

Os recursos foram aprovados pelo dono na JAM-72, em 13 de outubro de 2026. Os nomes em inglês e os tokens em DTCG seguem a ADR 0014, no Dan, e vieram na JAM-78. Ainda não há geração de CSS, pacotes nem releases, que seguem o brief do núcleo de design, no Dan.

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
