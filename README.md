
<div align="center">

![Logo](docs/images/logo.png)

# AI Gist

*本仓库是 [yarin-zhang/AI-Gist](https://github.com/yarin-zhang/AI-Gist) 的 fork，由 masiya0303 维护。上游项目版权归 Yarin Zhang 所有；完整许可条款见 [LICENSE](./LICENSE)。*

![License](https://img.shields.io/badge/license-AGPL--3.0-blue) ![数据存储](https://img.shields.io/badge/数据存储-100%25本地-success?logo=database&logoColor=white) ![AI 支持](https://img.shields.io/badge/AI-支持多模型-blue?logo=openai&logoColor=white) ![桌面端](https://img.shields.io/badge/桌面端-Windows%20%7C%20macOS%20%7C%20Linux-purple?logo=electron&logoColor=white) ![移动端](https://img.shields.io/badge/移动端-Android%20%7C%20iOS-00A98F?logo=capacitor&logoColor=white)

✨ AI Gist 是一款隐私优先的 AI 提示词管理工具，致力于让个人收藏的 AI 提示词能够发挥最大价值。

支持变量替换、Jinja 模板、AI 生成与调优、历史版本记录、云端备份等核心功能。

![主要截图](docs/images/image-main.png?v=202608170119)

[🏠 访问官网](https://getaigist.com) · [📥 下载上游发布](https://github.com/yarin-zhang/AI-Gist/releases) · [🇬🇧 English README](docs/README.en.md)

</div>

## 🌱 关于本 Fork

本仓库在上游基础上做增量维护，重点围绕**移动端体验**和**CI 稳定性**。桌面端行为与上游保持一致，未启用独立的 Release 流水线——安装包请从[上游发布页](https://github.com/yarin-zhang/AI-Gist/releases)获取。

已在 `main` 分支合入的差异（截至当前）：

| 版本 | 类型 | 说明 |
|------|------|------|
| 2.2.0（待发布） | `feat(mobile)` | 详情页描述也可复制——底部两个复制按钮 |
| 2.1.5 | `fix(mobile)` | 修分类频道栏两个 bug：切分类不刷新、分类名重复显示两行 |
| 2.1.4 | `fix(mobile)` | 分类频道栏改用原生横向滚动轨道，修复 `IonScroll` 不存在的构建失败 |
| 2.1.4 | `test(ci)` | 新增 Ionic 具名导入静态校验，防止类似问题再次阻塞 CI |

完整提交历史见 [git log](https://github.com/masiya0303/AI-Gist/commits/main)。

---

## 📌 特点

AI Gist 提供基础的 AI 提示词管理功能，旨在帮助用户高效地创建、组织和使用 AI 提示词。支持 Jinja 模板。

* **变量填充**：调用模板时动态填入变量，结构清晰灵活，支持 Jinja 模板。
* **多视图管理**：集中管理提示词模板，支持卡片视图、表格视图、分类视图。
* **筛选分类**：快速筛选、查找、组织提示词，支持标签、分类、评分、收藏等功能。
* **多种历史记录**：便于重复调用与持续优化，事后可回溯。

![特点01](docs/images/image-main-dark.png?v=202608162327)

AI Gist 还集成了 AI 模型，支持自动生成和调整提示词，提升管理效率。用之前，改一改。

* **接入多种 AI 模型**：支持接入多种 AI 模型（包括本地模型 Ollama、LM Studio，以及 OpenAI 等多种常见在线模型）。
* **AI 生成**：使用 AI 快捷生成提示词，支持自定义系统提示词。
* **AI 调优**：使用 AI 改写提示词，快速让提示词更具体、更丰富，同样支持自定义。
* **AI 提取变量**：无需手动挖空，使用 AI 自动提取可能的变量。

![特点02](docs/images/image-ai-generator.png?v=202608162327)

AI Gist 关注隐私和数据安全，所有数据都存储在本地，并支持云备份功能，方便在不同设备间同步。

* **本地优先**：所有数据存储在本地，默认情况无需联网，确保隐私和安全。
* **掌控数据**：拥有完整的数据控制，支持完整导出和导入，通用格式 CSV 导出。
* **云端备份**：支持 WebDAV、iCloud 备份与恢复，方便在多设备间共享数据。

![特点03](docs/images/image-data-cloud-backup.png?v=202608162327)

* **多平台支持**：支持 Windows / macOS / Linux 桌面端，Android（APK）和 iOS（App Store）移动端。
* **多语言支持**：支持简体中文、繁体中文、英文、日语。

## ⬇️ 下载

[![GitHub release (latest by date)](https://img.shields.io/github/v/release/yarin-zhang/AI-Gist?style=flat)](https://github.com/yarin-zhang/AI-Gist/releases/latest) [![GitHub all releases](https://img.shields.io/github/downloads/yarin-zhang/AI-Gist/total?style=flat)](https://github.com/yarin-zhang/AI-Gist/releases)

| 平台 | 安装包 | 应用市场 | 说明 |
|------|----------|----------|------|
| ![Windows](https://custom-icon-badges.demolab.com/badge/Windows-0078D6?logo=windows11&logoColor=white) | [Windows Setup](https://github.com/yarin-zhang/AI-Gist/releases/latest) | [Microsoft Store](https://apps.microsoft.com/detail/9n6vb23vsk8k?hl=zh-CN&gl=US) | Windows 安装程序 |
| ![macOS](https://img.shields.io/badge/macOS-000000?style=flat&logo=apple&logoColor=white) | [macOS (Apple Silicon)](https://github.com/yarin-zhang/AI-Gist/releases/latest) | [App Store](https://apps.apple.com/us/app/ai-gist/id6762559220) | 适用于 Apple 芯片 Mac |
| ![macOS](https://img.shields.io/badge/macOS-000000?style=flat&logo=apple&logoColor=white) | [macOS (Intel)](https://github.com/yarin-zhang/AI-Gist/releases/latest) | [App Store](https://apps.apple.com/us/app/ai-gist/id6762559220) | 适用于 Intel 芯片 Mac |
| ![Linux](https://img.shields.io/badge/Linux-FCC624?style=flat&logo=linux&logoColor=black) | [Linux AppImage](https://github.com/yarin-zhang/AI-Gist/releases/latest) | [Snap Store](https://snapcraft.io/ai-gist) | 通用 Linux 应用 |
| ![Android](https://img.shields.io/badge/Android-APK-3DDC84?style=flat&logo=android&logoColor=white) | [Android APK](https://github.com/yarin-zhang/AI-Gist/releases/latest) |  | APK 安装包 |
| ![iOS](https://img.shields.io/badge/iOS-App%20Store-000000?style=flat&logo=apple&logoColor=white) | | [App Store](https://apps.apple.com/cn/app/ai-gist/id6762559220) | App Store |

## 🚀 安装说明

- **Windows：** 下载 `.exe` 文件后双击运行安装
- **macOS：** 下载 `.dmg` 文件后打开，将应用拖拽到应用程序文件夹。已签名并通过 Apple 公证的版本可直接启动；旧的未签名版本仍需在终端执行 `xattr -cr /Applications/AI\ Gist.app` 后启动。
- **Linux：** 下载 `.AppImage` 文件后添加执行权限：`chmod +x ai-gist-linux.AppImage`
- **Android：** 下载 `.apk` 文件后，根据系统提示允许安装来自浏览器或文件管理器的应用。
- **iOS：** 在 [App Store](https://apps.apple.com/cn/app/ai-gist/id6762559220) 中搜索或打开链接安装。

## 📒 使用场景

### 管理提示词

- 点击"新建提示词"
- 输入提示词模板，用 `{{变量名}}` 来插入变量，AI Gist 会��动读取其中的变量。
- 使用时直接选择模板，输入变量值。
- 点击"复制内容"，即可自动记录使用历史。

### AI 生成提示词

- 先在应用中添加 AI 模型（支持纯本地 Ollama、LM Studio 模型，以及常见的 OpenAI、DeepSeek 等在线模型）。
- 在首页点击"AI 生成"按钮，可以通过 AI 模型生成提示词。

### AI 润色提示词

- 先添加 AI 模型
- 在编辑提示词页面对现有提示词进行快速润色，例如"提取变量"、"更具体"等。也可以自定义润色提示词。

## 开发说明

### 安装依赖

```bash
yarn install
```

### 启动开发环境

```bash
yarn dev
```

如果项目位于 WSL 中，但希望直接预览 Windows 客户端，可运行：

```bash
yarn dev:win
```

渲染页面修改会由 Vite 即时热更新；Electron 主进程和 preload 修改后会自动重新编译并重启客户端。首次运行会缓存一份 Windows Electron 开发运行时，之后不需要重新打包。

如果只需要在浏览器中预览 Web 端，可运行：

```bash
yarn dev:web
```

如果需要开发 iOS / Android 移动端，先构建并同步到 Capacitor，再用 Xcode / Android Studio 打开原生项目：

```bash
yarn build:mobile   # 构建渲染层并同步到 Capacitor
yarn cap:ios        # 用 Xcode 打开 iOS 项目（需 macOS + Xcode）
yarn cap:android    # 用 Android Studio 打开 Android 项目（需 Android Studio）
```

### 其他常用命令

```bash
# 开发相关
yarn dev            # 启动应用并开启热重载
yarn dev:win        # 从 WSL 启动 Windows 客户端并开启热重载
yarn build          # 打包应用，输出目录为 "dist"

# 跨平台构建
yarn build:win      # 构建 Windows 安装包
yarn build:mac      # 构建 macOS 安装包
yarn build:linux    # 构建 Linux 安装包
```

### 开发指南

详细的开发指南请参阅 [docs](./docs) 目录：

- [项目架构指南](./docs/project-architecture.md)
- [Web 本地部署与多端差异说明](./docs/web-deployment-and-platform-differences.md)
- [移动端开发指南](./docs/mobile-development.md)
- [GitHub Actions 自动构建与发布](./docs/github-actions.md)

## 贡献

本 fork 由 **masiya0303** 维护。上游 AI Gist 由 [Yarin Zhang](https://github.com/yarin-zhang) 个人开发，所有代码在 [AGPL-3.0](./LICENSE) 下开源。

欢迎在 GitHub 上提交 Issue 或 Pull Request——特别是关于**移动端体验**、**构建流程**、**CI 稳定性**的建议和改动。

修改前请先阅读：

- [AGENTS.md](./AGENTS.md) — AI Agent 与协作者必读规范（含发布流程、版本号规则、已踩过的坑）
- [docs/AI_UI_DESIGN_PROMPT.md](./docs/AI_UI_DESIGN_PROMPT.md) — 桌面端 UI 设计规范（强制契约，新增 UI 必读）
- [docs/versioning.md](./docs/versioning.md) — 版本号与 `buildRevision` 推导规则

## 应用截图

<div align="center">

![变量填充](docs/images/image-variable-fill.png?v=202608162327)

变量填充

![编辑提示词](docs/images/image-edit-prompt.png?v=202608162327)

编辑提示词

![Jinja 模板](docs/images/image-jinja-template.png?v=202608162327)

Jinja 模板

![AI 模型管理](docs/images/image-ai-config.png?v=202608162327)

AI 模型管理

![AI 添加配置](docs/images/image-ai-add-config.png?v=202608162327)

添加 AI 配置

![AI 快速调整](docs/images/image-ai-quick-adjust.png?v=202608162327)

AI 快速调整

![高级筛选](docs/images/image-filter.png?v=202608162327)

高级筛选

![表格视图](docs/images/image-table-view.png?v=202608162327)

表格视图

![文件夹视图](docs/images/image-folder-view.png?v=202608162327)

文件夹视图

![分类管理](docs/images/image-category.png?v=202608162327)

分类管理

![数据备份](docs/images/image-data-local-backup.png?v=202608162327)

数据备份

![明亮模式](docs/images/image-main-light.png?v=202608162327)

明亮模式

</div>

## 📖 相关文档

- [项目架构指南](./docs/project-architecture.md)
- [Web 本地部署与多端差异说明](./docs/web-deployment-and-platform-differences.md)
- [移动端开发指南](./docs/mobile-development.md)
- [GitHub Actions 自动构建与发布](./docs/github-actions.md)
- [隐私政策](./PRIVACY.md) — 数据与隐私说明
- [代码签名策略](./CODE_SIGNING_POLICY.md) — 发布签名与证书管理
- [AI Agent 操作规范](./AGENTS.md) — Agent / 自动化工具必读

## 许可证

本项目采用 [AGPL-3.0](./LICENSE) 许可证。本 fork 完整保留上游的所有版权与许可证声明；分发本 fork 的派生作品须同样遵守 AGPL-3.0 条款。

