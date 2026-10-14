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

Requer o Node 24 LTS, fixado em `.nvmrc`, e o npm. Todas as ferramentas têm a versão exata no `package.json` e no `package-lock.json`.

```sh
nvm use
npm ci
```

Rode tudo o que o workflow `Tests` roda, na mesma ordem:

```sh
npm run build
npm run build
npm run check
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
- **`tokens.json`:** os tokens semânticos no formato DTCG, com `$type`, `$description` e o `$value` já resolvido.
- **`fonts.css`:** um `@font-face` por família, com o nome dos primitivos de família, os eixos variáveis lidos da própria fonte e os caminhos relativos ao pacote. As WOFF2 usam o subconjunto latino do Google Fonts, que cobre o português, os sinais de preço e horário, `º` e `ª`.
- **`manifest.json`:** o nome e a versão do pacote e o SHA-256 de cada arquivo de `dist/`, em ordem.

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
