# Consumidores do Elvis

Este registro lista quem consome o `@bubbacore/elvis`, o que usa e como recebe as atualizações. A versão em uso não fica aqui: ela está no lockfile de cada consumidor, que é a fonte única.

## Registro

| Canal | Responsável | Recursos usados | Mecanismo de adoção |
| --- | --- | --- | --- |
| Consumidor de prova e referência visual, em `proof/` | Elvis | Todas as entradas públicas, listadas no `manifest.json` | O workflow `Proof consumer` instala do npm a versão exata depois de cada publicação, num projeto vazio, e pode rodar à mão para uma versão escolhida. A página da versão `latest` vai para o GitHub Pages. |
| Site | site | `tokens.css`, `fonts.css` e as fontes de `fonts/`, o `exports/svg/wordmark-color.svg` e, de `exports/favicon/`, o `favicon.svg`, o `favicon.ico` e o `apple-touch-icon.png`. O build também lê o `tokens.json`, as fontes e o wordmark para gerar as imagens das prévias de link. | Dependência com a versão exata no `package.json` do site. O Dependabot propõe as atualizações toda semana, num PR. |
| Forrest, adoção futura da voz | Forrest | `voice.md` | Ainda sem mecanismo. O desenvolvimento ou a CI do Forrest fixará a versão, incorporará uma cópia derivada da voz e a entregará no release do Forrest. A VPS não acessa o Elvis nem o npm. |

## Adoção

1. Instale uma versão exata, sem faixa: `npm install --save-exact @bubbacore/elvis@<versão>`.
2. Use só as entradas públicas do `exports` do `package.json`, como `@bubbacore/elvis/tokens.css`, `@bubbacore/elvis/fonts.css` e `@bubbacore/elvis/exports/svg/wordmark-color.svg`. Os demais caminhos do pacote não fazem parte do contrato, e o Node recusa a importação.
3. Use os tokens semânticos pelas variáveis `--bubba-*` do `tokens.css` ou pelo `tokens.json`. Não copie valores para o código do canal.
4. Acrescente uma linha neste registro, no mesmo PR do Elvis que documentar a adoção, ou num PR próprio.

## Atualização

1. Um release novo do Elvis só conta como entregue quando estiver no npm, conforme o runbook de releases do Dan.
2. O consumidor recebe a atualização por proposta, como o PR semanal do Dependabot no site, e nunca de forma automática.
3. Antes de aceitar, leia o changelog do release. Um `feat` muda o que o visitante vê e pede uma revisão visual. Uma quebra, marcada no changelog, pede a migração descrita no release.
4. No site, a adoção da versão, o release do site e a publicação do site são etapas distintas.

## Depreciação

1. Um token, uma saída ou um asset que vai sair é anunciado no changelog de um release, com o substituto, antes do release que o remove, que é uma quebra.
2. Uma versão publicada com problema não é substituída: ela recebe `npm deprecate` com o motivo e a versão que a corrige, e a correção chega num release novo.
3. As versões de teste `0.0.0-proof.N` e o placeholder `0.0.0-bootstrap.0` ficam obsoletos e não servem a nenhum consumidor.

## Migração

1. Uma quebra só chega num release marcado como tal, conforme a ADR 0015 do Dan.
2. O release traz, no changelog, o que mudou e o que o consumidor troca, como o nome antigo e o novo de um token.
3. Cada consumidor migra no seu próprio PR, que atualiza a versão exata e o uso. Este registro muda quando os recursos usados mudarem.
