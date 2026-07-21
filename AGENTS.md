# AGENTS.md

Guidance for AI agents working in this repository.

## Project

`pulsar-spring-boot` is a **Pulsar** editor package (Pulsar is the community
successor to Atom) providing Spring Boot support, powered by the STS4
[Spring Boot Language Server](https://github.com/spring-projects/sts4).
It is a migration of the archived
[`spring-projects/atom-spring-boot`](https://github.com/spring-projects/atom-spring-boot)
package (VMware/Pivotal, EPL-1.0), adapted to run on modern Pulsar.

Features: Spring-specific code completion, live application information hints
(boot-hint decorations from a running Boot app), Java outline of Spring elements,
and editing support for `application.properties` and `application.yml`
(validation, completion, hovers). It builds on the sibling `ide-java-pulsar`
package for general Java language support.

### Layout

- **`lib/main.ts`** — package entry point; exports
  `new SpringBootLanguageClient()`.
- **`lib/spring-boot-language-client.ts`** — `SpringBootLanguageClient extends
  JavaProcessLanguageClient` (from `@pivotal-tools/atom-languageclient-commons`).
  Handles:
  - Grammar scopes (`source.java`, `source.boot-properties`,
    `source.boot-properties-yaml`, `text.xml`).
  - Pushing `spring-boot.*` config to the server as `boot-java`
    (`didChangeConfiguration`).
  - VM args, JRE-vs-JDK check (`launchVmArgs`), `preferJdk`, `getJavaOptions`.
  - Installing package dependencies via `atom-package-deps`.
- **`lib/boot-sts-adapter.ts`** — `BootStsAdapter extends StsAdapter`; renders
  live boot-hint marker decorations in the editor from `sts/highlight`
  notifications.
- **`build/`** — TypeScript compiler output (`tsc`), committed; `package.json`
  `main` points at `./build/main`.
- **`grammars/`** — `boot-properties.cson`, `boot-properties-yaml.cson`.
- **`settings/`** — `language-boot-properties-yaml.cson`.
- **`styles/`** — `hints.atom-text-editor.less` (boot-hint styling), `boot-icon.png`.
- **`script.js`** — `postinstall` step; downloads the language server jar from
  `properties.json`'s `jarUrl` into `server/`.
- **`properties.json`** — `{ jarUrl }`, the single source for the LS download URL.
- **`server/`** — downloaded language server jar; **git-ignored**, never vendored.
- **`package.json`** — declares consumed/provided Atom-IDE services, config
  schema, `package-deps`, and dependencies.

### Dependencies of note

- `@pivotal-tools/atom-languageclient-commons` `0.0.15` — the Spring/Java LSP base
  (`JavaProcessLanguageClient`, `StsAdapter`, `JavaOptions`) with a bundled
  `atom-languageclient`. Old; verify it loads under Pulsar's Electron (see the
  migration spec). `@pivotal-tools/jvm-launch-utils` (`JVM`) is imported but
  relied on transitively, not a direct dependency.
- STS4 Spring Boot Language Server — downloaded at install from the URL in
  `properties.json`. No standalone Maven artifact exists; the jar ships inside the
  VSCode "Spring Boot Tools" `.vsix` or the STS4 nightly CDN.
- `typescript` `^2.7.2` and `tslint` `^5.9.1` — both end-of-life; bumping either
  is an ask-first change.

## Conventions

- Code style matches the existing source: **4-space indent, semicolons, single
  quotes**, `const`/`let`, explicit `export class` in `lib/*.ts`. Match the file
  you are editing; do not reformat untouched code. There are no per-file license
  headers despite EPL-1.0 — do not add them unless asked.
- Config keys live under the `spring-boot.*` namespace and are pushed to the
  language server as `boot-java` via `sendConfig`.
- All Atom API access goes through the global `atom` object (`atom.config`,
  `atom.notifications`, `atom.workspace`, `atom.packages`).
- After editing any `lib/*.ts`, run `npm run build` and commit the regenerated
  `build/` output.

## Hard rules for agents

- **Do NOT author or co-author git commits.** Leave all commits to a human
  maintainer.
- **Do NOT push to any remote / upstream.** No `git push`, no PR creation.
- **Do NOT use em dashes** in prose you write into the repo.
- **Do NOT relicense.** This package is EPL-1.0 (VMware/Pivotal); keep it.
- **Do NOT commit the downloaded `server/` jar** or any secret.
- Make and edit files only; report what changed and let the maintainer commit.
- When changing the server download URL, LS version, Java floor, or VM launch
  args, verify the server still installs and starts against a real Spring Boot
  project before considering the change done.
- Ask first before: replacing the `@pivotal-tools` LSP base, raising the Java
  floor above 17, choosing the STS4 LS release, bumping `typescript`/`tslint` or
  adding dependencies, or changing the CI provider/matrix.
