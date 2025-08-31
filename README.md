# LINUX DO Toolkit

（它仅仅是，1款十分简陋的LINUX DO工具呀……）

---

## 已实现

- LD Live弹幕展示器

## 使用技术

- SolidJS
- Bun
- Tauri

## 构建

1. 安装[Rust](https://www.rust-lang.org/zh-CN/tools/install)、[Node.js](https://nodejs.org/zh-cn/download)与[Bun](https://bun.sh)。
2. 若没有安装`tauri-cli`，可选择执行`cargo install tauri-cli --version "^2.0.0" --locked`以安装它。
3. 执行以下命令。

```
git clone https://github.com/MoRanYue/linux_do_toolkit
cd linux_do_toolkit
cargo tauri build
```

4. 可执行文件位于`target/release/`目录中。