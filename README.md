# bubbacore/elvis

O núcleo de marca e design system do Bubba: a logo, as cores, as fontes e, depois, a voz e os valores-base que o site e os demais canais consomem.

## O que tem aqui

- **`regras-de-uso.md`:** as regras de uso da marca, aprovadas pelo dono: formas, área de proteção, tamanhos mínimos, versões por fundo, usos indevidos, cores e tipografia.
- **`logo/`:** a assinatura `bubba` e os dois ícones derivados, o b com pena e a pena, nas versões em cor, negativa e monocromática, além dos ícones em caixa quadrada.
- **`exports/`:** a assinatura e os ícones com a área de proteção, em SVG e PNG, e os favicons e atalhos.
- **`tokens/cores-e-tipografia.json`:** as cores aprovadas, com o papel de cada uma, e as duas famílias de fonte, com suas regras de uso. Os caminhos de arquivo citados ali são relativos à raiz do repositório.
- **`fonts/`:** Noto Serif Display, nos títulos, e Hanken Grotesk, na leitura, com as licenças SIL Open Font License 1.1.
- **`manifest.json`:** o SHA-256 de cada recurso.

## Estado

Os recursos foram aprovados pelo dono na JAM-72, em 13 de outubro de 2026. Ainda não há geração de tokens, CSS, pacotes nem releases. Essa entrega segue o brief do núcleo de design, no Dan, com um contrato próprio.

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
