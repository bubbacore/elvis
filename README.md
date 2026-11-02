# bubbacore/elvis

O núcleo de marca e design system do Bubba: a logo, as cores, as fontes, a voz e os valores-base que o site e os demais canais consomem.

## O que tem aqui

- **`usage-rules.md`:** as regras de uso da marca, aprovadas pelo dono: direção visual, formas, área de proteção, tamanhos e leitura, versões por fundo, usos indevidos, cores, tipografia, espaço, cantos e foco.
- **`voice.md`:** o guia de voz e tons do Bubba, com regras de escrita e exemplos certos e errados por situação, para pessoas e agentes. A voz publicada na JAM-79 se mescla à personalidade do personagem, com exemplos alinhados ao produto vigente.
- **`logo/`:** o ícone (`icon`) e as assinaturas horizontal (`horizontal-lockup`), vertical (`vertical-lockup`) e isolada (`wordmark`), em `#050505` (`black`) e em branco (`white`), além do Bubba em 3D (`bubba-3d.png`) e das assinaturas 3D.
- **`exports/`:** o ícone e as assinaturas com a área de segurança, em SVG e PNG, o Bubba em 3D com e sem o halo azul, os favicons e o ícone de atalho.
- **`tokens/`:** os valores-base no formato DTCG 2025.10:
  - `semantic.tokens.json`, o contrato público, com um token por papel e sua descrição: cores, fontes, pesos, níveis de tipografia com a altura de linha e o ponto de quebra dos tamanhos de telas largas, espaçamento, cantos, foco e alvo de toque, além dos pares de cor que precisam de contraste;
  - `primitives.tokens.json`, os valores brutos, internos, referenciados pelos semânticos.
- **`fonts/`:** Playfair Display, em toda a interface, e Antonio, na Marcação, no Label e no Rótulo de bloco, com as licenças SIL Open Font License 1.1. O pacote entrega o subconjunto da Playfair Display com o nome Bubba Serif, porque a licença dela reserva o nome da original.
- **`manifest.json`:** o SHA-256 de cada recurso aprovado.
- **`scripts/`:** a geração das saídas do pacote, como o `tokens.css`, o `fonts.css` com as fontes em WOFF2 e os exports, e a verificação dos tokens, do contraste e dos exports. Os comandos, as saídas e as convenções estão no [`CONTRIBUTING.md`](CONTRIBUTING.md).
- **`proof/`:** o consumidor de prova, que instala o pacote do npm num projeto vazio e monta com as entradas públicas a referência visual, publicada a cada release.

## Estado

A identidade nova, aprovada na JAM-138 e consolidada na ADR 0019 do Dan, substitui a assinatura com pena, as cores, as fontes e os valores-base anteriores. A JAM-139 entrega os tokens e as fontes, a JAM-140 entrega a logo e os exports, e a JAM-141 reúne as diretrizes, a referência e a entrega do v0.5.0. O histórico e a migração estão no changelog e no [`CONSUMERS.md`](CONSUMERS.md).

O site continua no v0.4.0 até a adoção planejada na fatia 1 do redesenho, na JAM-122. Um release do Elvis não altera o site sozinho.

## Como usar

A [referência visual](https://bubbacore.github.io/elvis/) mostra o último release: cada token com a amostra, o valor e a variável CSS pronta para copiar, os pares de contraste, a logo com os arquivos para baixar, os momentos do personagem e exemplos interativos de uso.

O pacote [`@bubbacore/elvis`](https://www.npmjs.com/package/@bubbacore/elvis) está no npm. Instale uma versão exata:

```sh
npm install --save-exact @bubbacore/elvis@<versão>
```

As entradas públicas são:

| Entrada | Conteúdo |
| --- | --- |
| `@bubbacore/elvis/tokens.css` | Os tokens semânticos em variáveis CSS `--bubba-*` no `:root`. |
| `@bubbacore/elvis/fonts.css` | Os `@font-face` das duas famílias, em WOFF2 de subconjunto latino. |
| `@bubbacore/elvis/fonts/*` | `fonts/bubba-serif/bubba-serif.woff2`, `fonts/antonio/antonio.woff2` e as licenças OFL. |
| `@bubbacore/elvis/tokens.json` | Os tokens semânticos em DTCG, com os valores resolvidos e os pares de cor que precisam de contraste. |
| `@bubbacore/elvis/logo/*` | Os desenhos da logo em SVG e o Bubba em 3D e as assinaturas 3D em PNG e SVG. |
| `@bubbacore/elvis/exports/*` | O ícone e as assinaturas em SVG e PNG, o Bubba em 3D em PNG, os favicons e o ícone de atalho. |
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
- A interface é clara e quase monocromática: tinta `#050505`, fundo `#F7F7F7`, cartões brancos e texto `#717171`. Filtros ativos são pretos, o azul `#496EA1` tem papéis funcionais e o coral `#E03405` indica atenção.
- Bubba Serif cobre a interface; Antonio fica na Marcação, no Label e no Rótulo de bloco. O personagem em 3D fica nos momentos previstos pelo produto, com a voz em primeira pessoa só ali.
- O Elvis entrega só formatos abertos da web, como CSS, JSON, SVG, PNG e WOFF2. Consumir ou consultar a marca não depende de framework, plugin nem conta em serviço de terceiros.
- Uma ferramenta nova só entra quando substitui um trabalho manual, com a versão fixada.
- A referência visual é gerada das entradas públicas de cada release, sem amostra nem cópia mantida à mão.
