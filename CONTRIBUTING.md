# Como contribuir com o Elvis

Este guia reúne o que vale para qualquer mudança neste repositório, feita por uma pessoa ou por um agente. Ele descreve o padrão que os scripts e a CI já aplicam.

## Antes de começar

- **Spec primeiro:** implemente só tickets de uma spec ou de um agent brief aprovado.
- **Decisões de marca:** cada recurso vem de uma decisão registrada no `bubbacore/dan` e muda só por outra. Um valor de token, um desenho da logo ou um export novo precisam da aprovação do dono antes do commit.
- **Commits:** siga o [Conventional Commits](https://www.conventionalcommits.org/pt-br/v1.0.0/), com a mensagem em inglês e no imperativo. Mantenha o assunto abaixo de 72 caracteres, faça uma mudança lógica por commit e cite o ticket no rodapé, como `Refs JAM-80`.
- **Tipo do commit:** classifique pelo efeito no consumidor, conforme a [ADR 0015](https://github.com/bubbacore/dan/blob/main/docs/adr/0015-versao-dos-entregaveis-de-design.md). Uma mudança aprovada num valor visível é `feat`, e não `fix`. Marque com `!` ou `BREAKING CHANGE` o commit que remove ou renomeia um token semântico, uma saída ou o caminho de um asset.
- **Escopos dos commits:**
  - `tokens` para `tokens/` e as saídas `tokens.css` e `tokens.json`;
  - `logo` para `logo/` e `exports/`;
  - `fonts` para `fonts/` e a saída `fonts.css`;
  - `guidelines` para as diretrizes distribuídas, `usage-rules.md` e `voice.md`;
  - sem escopo para o repositório inteiro, como a CI, os scripts e as ferramentas.
- **Idioma:** o código, os comentários, os commits e o título e a descrição dos PRs ficam em inglês, e o que o dono, o público e os consumidores leem fica em português, como as descrições dos tokens, as diretrizes e o relato do trabalho no comentário do ticket no Linear, conforme a [ADR 0012](https://github.com/bubbacore/dan/blob/main/docs/adr/0012-codigo-e-prs-em-ingles-e-textos-em-portugues.md) do `bubbacore/dan`. Os nomes dos tokens, dos arquivos e das pastas ficam em inglês, porque fazem parte do contrato público, conforme a [ADR 0014](https://github.com/bubbacore/dan/blob/main/docs/adr/0014-elvis-como-nucleo-de-design-publico-no-npm.md).

## Ambiente e verificações locais

Requer o Node 24 LTS, fixado em `.nvmrc`, e o npm. O `devEngines` do `package.json` faz o npm recusar outra versão do Node neste repositório. Todas as ferramentas têm a versão exata no `package.json` e no `package-lock.json`, e o Playwright do consumidor de prova, no `proof/package.json` e no `proof/package-lock.json`.

```sh
nvm use
npm ci
```

Rode tudo o que o job `Generation and checks` do workflow `Tests` roda, na mesma ordem:

```sh
npm run build
npm run build
npm run check
```

O job `Package consumer` empacota o que foi gerado e roda o consumidor de prova sobre o tarball, como um consumidor faria depois da publicação:

```sh
(cd proof && npm ci && npx playwright install chromium)
npx tsc -p proof
npm run build
npm pack --pack-destination "$TMPDIR"
node proof/consumer.ts --package "$TMPDIR"/bubbacore-elvis-*.tgz
```

- `npm run build` gera todas as saídas do pacote em `dist/`, apagando a pasta antes. O workflow gera duas vezes e compara os manifestos, para confirmar que a geração é reproduzível.
- `npm run check` roda o `biome ci`, o `tsc --noEmit` e as verificações de `scripts/check.ts`. Ele lê o `dist/`, então rode o `build` antes.
- `npm run format` aplica a formatação e as correções seguras do Biome.
- O Biome cobre os scripts em TypeScript e os arquivos JSON e CSS do repositório, com linha de 100 colunas, ou 120 nos tokens. Os assets de `logo/`, `exports/` e `fonts/` ficam fora dele, porque são usados como estão.

## Saídas

As saídas ficam em `dist/`, que não é versionado e não recebe edição manual. Uma saída só muda pela sua fonte, conforme a [ADR 0013](https://github.com/bubbacore/dan/blob/main/docs/adr/0013-padrao-de-codigo-nas-ferramentas-e-na-ci.md): para mudar o `tokens.css`, mude o token e gere de novo.

| Saída | Fonte | Gerada por |
| --- | --- | --- |
| `tokens.css` | `tokens/` | Style Dictionary, em `scripts/style-dictionary.ts` |
| `tokens.json` | `tokens/` | Style Dictionary, em `scripts/style-dictionary.ts` |
| `fonts.css` e `fonts/<família>/<família>.woff2` | `fonts/` e os primitivos de família | `subset-font`, em `scripts/fonts.ts` |
| `fonts/<família>/OFL.txt` | `fonts/` | cópia |
| `exports/svg/`, `exports/png/` e `exports/favicon/` | `logo/` | `@resvg/resvg-js`, em `scripts/exports.ts` |
| `logo/`, `usage-rules.md` e `voice.md` | os mesmos arquivos | cópia |
| `manifest.json` | as demais saídas | `scripts/manifest.ts` |

- **`tokens.css`:** só os tokens semânticos, em variáveis CSS no `:root`, com os valores resolvidos e a descrição de cada token num comentário. O nome é `--bubba-` seguido do caminho do token em kebab-case, como `--bubba-color-text-ink` para `color.text.ink` e `--bubba-space-4` para `space.4`. O `font.width` sai em porcentagem, como `62.5%`, para uso direto no `font-stretch`.
- **`tokens.json`:** os tokens semânticos no formato DTCG, com `$type`, `$description` e o `$value` já resolvido, e os pares de contraste com os mínimos por tipo, em `$extensions["@bubbacore/elvis"].contrast`, como na fonte, citando os tokens semânticos pelo caminho.
- **`fonts.css`:** um `@font-face` por família, com o nome dos primitivos de família, os eixos variáveis lidos da própria fonte e os caminhos relativos ao pacote. As WOFF2 usam o subconjunto latino do Google Fonts, que cobre o português, os sinais de preço e horário, `º` e `ª`.
- **`manifest.json`:** o nome e a versão do pacote e o SHA-256 de cada arquivo de `dist/`, em ordem.

## Pacote e publicação

- **Contrato:** o `exports` do `package.json` lista as entradas públicas do pacote. Um caminho fora dele não pode ser importado, e o consumidor de prova confere essa recusa. Acrescentar uma entrada é `feat`, e remover ou renomear uma é quebra, conforme a ADR 0015.
- **Conteúdo:** o pacote leva só o `dist/`, o `LICENSE.md`, o `README.md` e o `package.json`. Uma saída nova entra pelo `dist/` e pelo manifesto, nunca por outra pasta.
- **Licença:** o `LICENSE.md` separa as fontes, sob a OFL 1.1, da marca, com todos os direitos reservados, e dos tokens e das diretrizes. Uma mudança nele pede a aprovação do dono.
- **Releases:** seguem o [runbook de releases](https://github.com/bubbacore/dan/blob/main/docs/runbooks/releases.md) do Dan. O Release Please abre a release PR, e o merge dela pelo dono é a aprovação. Depois do release, o workflow `Release` gera e verifica de novo a partir da tag, publica no npm por trusted publishing, sem token guardado, anexa o tarball e o `manifest.json` ao release do GitHub e confere que o npm serve o mesmo tarball, com o mesmo SHA-512. Uma publicação parcial falha o workflow, e uma nova execução publica só o que falta.
- **Arquivo do publicador:** o npm aceita a publicação só do `.github/workflows/release.yml`. Não renomeie o arquivo sem trocar antes o publicador confiável no npm.
- **Versões de teste:** o workflow `Release`, rodado à mão com um número N, publica `0.0.0-proof.N` com a dist-tag `proof`, nunca `latest`. Rode do branch que tiver a mudança de teste, sem levá-la à `main`, e marque a versão como obsoleta com `npm deprecate` depois da prova.
- **Consumidor de prova:** o workflow `Proof consumer` instala do npm uma versão exata num projeto vazio, fora do repositório, e confere as entradas públicas, as fontes, os arquivos do manifesto e as variáveis CSS contra o `tokens.json`, com uma captura da página como artefato. Ele roda depois de cada publicação e à mão, com a opção de instalar antes outra versão para provar a atualização. Ele lê só o `proof/` e o `.nvmrc`.
- **Consumidores:** o [`CONSUMERS.md`](CONSUMERS.md) registra quem consome o pacote e os procedimentos de adoção, atualização, depreciação e migração.

## Tokens

- Os tokens seguem o formato DTCG 2025.10. Os tipos aceitos são `color`, `dimension`, `fontFamily`, `fontWeight` e `number`; um tipo novo pede a verificação do seu valor em `scripts/tokens.ts`.
- Os primitivos, em `tokens/primitives.tokens.json`, guardam valores brutos e não referenciam outros tokens. Cada token semântico, em `tokens/semantic.tokens.json`, referencia um primitivo.
- Nas cores, o `hex` precisa corresponder aos `components`.
- Todo par de cor que precisa de contraste fica declarado em `$extensions["@bubbacore/elvis"].contrast.pairs`, com o tipo `text`, `large-text` ou `ui`. A verificação aplica o WCAG 2.2 AA: 4,5:1 para texto, 3:1 para texto grande e 3:1 para bordas, indicadores e foco. Os mínimos declarados no arquivo não podem ficar abaixo desses.
- A verificação também exige `focus.width` de pelo menos 2 px e `target.min-size` de pelo menos 44 px.

## Exports

- Os exports aprovados ficam versionados em `exports/`. A verificação regera cada um a partir de `logo/` e compara com o aprovado: o SVG pelos bytes e o PNG pelos pixels, com o `pixelmatch`, sem tolerância. No `favicon.ico`, compara cada imagem embutida.
- Os quadros com a área de proteção, os tamanhos, as variantes e a placa do favicon ficam em `scripts/exports.ts`.
- Se um export regerado diferir do aprovado, a verificação falha. Não troque o arquivo aprovado para fazê-la passar: reporte no ticket, com a comparação, e espere a decisão do dono. Um export novo ou trocado entra com a aprovação do dono, junto do `manifest.json` da raiz, que guarda o SHA-256 dos recursos aprovados.

## Ferramentas

- Atualize uma ferramenta num ticket próprio, com a versão exata. Compare o `dist/manifest.json` antes e depois: se uma saída mudar, a mudança segue a classificação da ADR 0015, e um export diferente segue a seção anterior.
