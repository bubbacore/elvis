# Consumidores do Elvis

Este registro lista quem consome o `@bubbacore/elvis`, o que usa e como recebe as atualizações. A versão em uso não fica aqui: ela está no lockfile de cada consumidor, que é a fonte única.

## Registro

| Canal | Responsável | Recursos usados | Mecanismo de adoção |
| --- | --- | --- | --- |
| Consumidor de prova e referência visual, em `proof/` | Elvis | Todas as entradas públicas, listadas no `manifest.json` | O workflow `Proof consumer` instala do npm a versão exata depois de cada publicação, num projeto vazio, e pode rodar à mão para uma versão escolhida. A página da versão `latest` vai para o GitHub Pages. |
| Site, até a adoção da identidade nova | site | `tokens.css`, `fonts.css` e as fontes de `fonts/`, o `exports/svg/wordmark-color.svg` e, de `exports/favicon/`, o `favicon.svg`, o `favicon.ico` e o `apple-touch-icon.png`. O build também lê o `tokens.json`, as fontes e o wordmark para gerar as imagens das prévias de link. | Dependência com a versão exata no `package.json` do site. O Dependabot propõe as atualizações toda semana, num PR. |
| Site, adoção planejada na JAM-122 | site | `tokens.css`, `tokens.json`, `fonts.css`, Bubba Serif em `fonts/bubba-serif/`, Antonio em `fonts/antonio/`, assinatura horizontal `exports/svg/horizontal-lockup-black.svg`, ícone `exports/svg/icon-black.svg`, personagem `exports/png/bubba-3d-*.png` e `exports/png/bubba-3d-halo-*.png`, favicons e `apple-touch-icon.png`; `usage-rules.md` e `voice.md` orientam a aplicação. | O PR da fatia 1 fixa o v0.5.0 e migra os usos em conjunto. O site só muda depois do seu próprio release e da publicação do site. |
| Forrest, adoção futura da voz | Forrest | `voice.md` | Ainda sem mecanismo. O desenvolvimento ou a CI do Forrest fixará a versão, incorporará uma cópia derivada da voz e a entregará no release do Forrest. A VPS não acessa o Elvis nem o npm. |

## Adoção

1. Instale uma versão exata, sem faixa: `npm install --save-exact @bubbacore/elvis@<versão>`.
2. Use só as entradas públicas do `exports` do `package.json`, como `@bubbacore/elvis/tokens.css`, `@bubbacore/elvis/fonts.css` e `@bubbacore/elvis/exports/svg/horizontal-lockup-black.svg`. Os demais caminhos do pacote não fazem parte do contrato, e o Node recusa a importação.
3. Use os tokens semânticos pelas variáveis `--bubba-*` do `tokens.css` ou pelo `tokens.json`. Não copie valores para o código do canal.
4. Acrescente uma linha neste registro, no mesmo PR do Elvis que documentar a adoção, ou num PR próprio.

## Atualização

1. Um release novo do Elvis só conta como entregue quando estiver no npm, conforme o runbook de releases do Dan.
2. O consumidor recebe a atualização por proposta, como o PR semanal do Dependabot no site, e nunca de forma automática.
3. Antes de aceitar, leia o changelog do release. Um `feat` muda o que o visitante vê e pede uma revisão visual. Uma quebra, marcada no changelog, pede a migração descrita no release.
4. No site, a adoção da versão, o release do site e a publicação do site são etapas distintas.

## Depreciação

1. Um token, uma saída ou um asset que vai sair é anunciado no changelog de um release, com o substituto, antes do release que o remove, que é uma quebra.
   A troca de identidade do v0.5.0 é a exceção aprovada na ADR 0019: ela remove os recursos antigos num único release com quebra, sem release prévio de aviso. O único consumidor real é o site, com migração planejada na JAM-122.
2. Uma versão publicada com problema não é substituída: ela recebe `npm deprecate` com o motivo e a versão que a corrige, e a correção chega num release novo.
3. As versões de teste `0.0.0-proof.N` e o placeholder `0.0.0-bootstrap.0` ficam obsoletos e não servem a nenhum consumidor.

## Migração

1. Uma quebra só chega num release marcado como tal, conforme a ADR 0015 do Dan.
2. O release traz, no changelog, o que mudou e o que o consumidor troca, como o nome antigo e o novo de um token.
3. Cada consumidor migra no seu próprio PR, que atualiza a versão exata e o uso. Este registro muda quando os recursos usados mudarem.

## Migração do v0.4.0 para o v0.5.0

A mudança troca toda a identidade. O changelog do release lista as remoções e os substitutos. Os padrões abaixo descrevem famílias de caminhos, não entradas literais com asterisco para importar.

| Uso anterior | Adoção na identidade nova |
| --- | --- |
| `exports/svg/wordmark-color.svg`, `wordmark-blue.svg`, `wordmark-light.svg` | `exports/svg/horizontal-lockup-black.svg` ou `horizontal-lockup-white.svg`, para a assinatura principal. A assinatura isolada é `wordmark-black.svg` ou `wordmark-white.svg`, só perto do personagem. Ajuste também o enquadramento e a margem de 1x pupila |
| `logo/wordmark-*.svg` antigo | `logo/horizontal-lockup-black.svg` ou `horizontal-lockup-white.svg`, sem margem; prefira os exports que já a incluem |
| `icon-b-feather-*`, `icon-feather-*` e seus PNGs | `exports/svg/icon-black.svg` ou `icon-white.svg`, e os PNGs correspondentes. A pena saiu; não há ornamento substituto |
| PNGs da assinatura antiga | `exports/png/horizontal-lockup-{black,white}-{512,1024,2048}.png` |
| `exports/favicon/*` | Mantenha `favicon.svg`, `favicon.ico`, `favicon-16.png`, `favicon-32.png`, `favicon-48.png` e `apple-touch-icon.png`, agora com o ícone vetorial novo. Saíram `favicon-192.png` e `favicon-512.png`. Não copie arquivos antigos para esses caminhos |
| `fonts/noto-serif-display/` e `fonts/hanken-grotesk/` | `fonts/bubba-serif/bubba-serif.woff2` e `fonts/antonio/antonio.woff2`. Use `fonts.css` para os nomes corretos: Bubba Serif e Antonio. Playfair Display é a origem, não o nome CSS distribuído |
| `font.family.title`, `font.weight.title` e `font.width.title` | `font.family.text` e níveis completos de `typography`. A largura e o `font-stretch` saem. O papel `font.family.text` agora é Bubba Serif |
| `font.size.title.*`, `typography.title.{xs,sm,md,lg,xl}` | `typography.title.{1,2,3}.{base,wide}`, `typography.display.{base,wide}` ou `typography.character.{base,wide}`, conforme o papel. A troca base/wide acontece em 960 px |
| `font.size.text.*`, `typography.text.{sm,md,lg}`, `typography.figures` | `typography.body`, `typography.body-small`, `typography.time`, `typography.control`, `typography.field`, `typography.metadata`, `typography.label`, `typography.block-label` e `typography.marker`. Horários usam 600 e pílula própria; preços usam 400. Remova a suposição de algarismos tabulares e aplique `lining-nums` |
| `color.text.ink-muted`, `brand-blue`, `on-brand-blue` | `color.text.body`, `color.text.blue`, `color.text.inverse`; links começam em `color.text.ink` e ficam azuis só no hover/foco. Preços deixam o azul |
| `color.surface.support`, `past`, `brand-blue` | Escolha pelo papel: `color.surface.card`, `color.surface.mist`, `color.surface.no-sessions-day`, `color.surface.logo-frame` ou `color.action.selected`. Já começou fica no texto e na borda de atenção, sem fundo próprio |
| `color.action.brand-blue` | `color.action.primary` nas ações e `color.action.selected` nos filtros ativos |
| `color.border.control`, `color.border.divider` | `color.border.field`, `color.border.blue` ou `color.border.attention` nos papéis previstos. O divisor e a caixa de preço não têm substituto |
| `color.focus.feather-red`, `color.alert.feather-red` | `color.focus.filter`, `color.focus.action`, `color.focus.field` e `color.text.attention`. Foco muda conforme o controle; não troque todo o vermelho antigo por coral |
| `space.12`, `space.16` | Saíram os espaços de 48 e 64 px. Reavalie a composição com `space.14` (56 px), `space.20` (80 px) e os demais passos preservados |
| `radius.control`, `radius.app-icon` | `radius.pill`, `radius.card`, `radius.highlight`, conforme a forma. O PNG do ícone de atalho já tem o enquadramento aprovado |
| `target.min-size` de 44 px | Mínimo de 24 px e `target.control-height` de 40 px para os controles principais no celular |

Cada caminho de token vira uma variável com prefixo `--bubba-` e pontos trocados por hífens. Um nível tipográfico vira uma variável por propriedade, como `--bubba-typography-title-1-base-line-height`. Remova os usos de `font-width` e aplique também `font-variant-numeric`, presente na extensão do JSON. Os nomes públicos de entrada do pacote permanecem; o conteúdo e os caminhos internos de assets mudam.

A JAM-122 deve revisar os imports, as variáveis CSS, os rótulos em Antonio, as pílulas e os estados de interação, as imagens de prévia e os favicons. Confira teclado, movimento reduzido, fontes carregadas e as larguras de celular e tela larga antes de publicar o site. A referência visual é gerada do pacote; seu exemplo de composição não substitui os layouts aprovados do site.
