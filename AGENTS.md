# AI Gist agent instructions

Before creating or changing any desktop or desktop-Web interface under `src/renderer`, read and follow [`docs/AI_UI_DESIGN_PROMPT.md`](docs/AI_UI_DESIGN_PROMPT.md).

The design prompt is a required implementation contract. New UI must use the canonical design tokens and the bordered, tinted-surface design language defined there. Do not add local theme systems or revive deprecated variables.

Ionic mobile pages retain native mobile structure; apply only the shared token rules unless the task explicitly requests a mobile redesign.

> Desktop UI contributions must follow [AI_UI_DESIGN_PROMPT.md](docs/AI_UI_DESIGN_PROMPT.md).

## Local CLI for prompt data

AI Gist's data lives only inside the running desktop app (Electron renderer's IndexedDB). To create, read, update, fill, or "挖空" (add `{{variable}}` placeholders to) prompts and categories from a terminal or from an agent session, use the bundled CLI instead of touching IndexedDB directly — there is no other supported way to reach this data from outside the app process:

```bash
node bin/ai-gist.js --help
```

The CLI talks to a running copy of AI Gist over a local, token-authenticated loopback connection that is off by default; the user must enable it once in Settings → Local CLI. Run `node bin/ai-gist.js status` first to confirm connectivity, then `node bin/ai-gist.js --help` (and `... <command> --help`) for the full command reference — that help text, not this file, is the source of truth for available commands and flags.

## 版本号

版本信息只在 `package.json` 的 `version` 和 `buildRevision` 里手写（读作 `2.1.1 (1)`），各平台的构建号从这两个字段推导，改完后运行 `yarn version:sync` 同步到原生工程。规则见 [`docs/versioning.md`](docs/versioning.md)，不要手改 `build.gradle` 或 `project.pbxproj` 里的版本字段。

## CI 与发布（改动前先读这一节）

**第一道真正的构建是 GitHub Actions。** 工作机上的 `node_modules` 不完整（`@ionic`、`vite`、`@vitest/*`、`eslint` 都缺），本地跑不了 `vite build` / `vitest` / `eslint`，所以改动只能靠静态自查，首次执行发生在 CI。

发布流水线（`.github/workflows/build-release.yml`）的触发条件和硬约束：

- 只在推 `v*.*.*` 标签时触发；**推 main 不触发任何工作流**，没有自动把关。
- 标签名必须与 `package.json` 的 `version` 完全一致，否则直接失败（`Release version must match package.json`）。手动 `workflow_dispatch` 还要求标签指向当前 checkout 的 commit。
- `Create Draft Release` 步用的是 `draft: false`，会直接发布，不是草稿。
- 当前流水线只构建 Android（`build-android` job）；桌面端 win/mac/linux 打包在「精简 workflow」那两次提交里已经移除。
- 发布步骤：改 `package.json` 的 `version`（必要时含 `buildRevision`）→ `node scripts/sync-version.js` 同步原生构建号 → commit → 打同名 tag → push。`node scripts/sync-version.js --check` 可随时校验一致性。

**用户要求：修完 bug 直接触发发布，不要先问。** 用户原话「你下次直接触发发布」——做完一个有意义的改动（尤其是修 bug），直接走上面那四步把新版本发出去，不要停下来问「要我发吗」。版本号按语义递增：bugfix 递增 patch，功能递增 minor，不要自作主张跨大版本。用户不想出包时会主动说。

**曾经因此失败的改动，别重复。** `@ionic/vue` 并没有导出 `IonScroll`，分类频道栏最初用了 `<ion-scroll>`，推上去后 `vite build` 在 rollup 阶段直接报 `"IonScroll" is not exported`，发布中断。教训：

- 引用 `@ionic/vue` 的具名导出前，先确认它真实存在；不确定就用原生 HTML + CSS（例如横向滚动直接用 `div` + `overflow-x: auto`）。
- 回归测试见 [`test/mobile/ionic-vue-imports.test.ts`](test/mobile/ionic-vue-imports.test.ts)：它会扫 `src/renderer` 下所有 `import { ... } from '@ionic/vue'`，逐个和已安装包的入口文件核对，CI 上依赖是全量的，这类问题在那里会被挡住。改这个文件时注意，导入项里的别名不能用 `split('as')` 解析——`toastController` 本身含有 `as` 子串，会被错误切成 `to`。
