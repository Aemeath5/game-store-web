# 商城物品图鉴资源

- 数据版本：7.0.50
- 中文物品 ID/名称：[GrasscutterCommandGenerator](https://github.com/jie65535/GrasscutterCommandGenerator) `ac1565b72a2fd0e874820a1348d00fdddbe16ec9`
- 前端运行时只读取 `index.json` 和当前页实际显示的 WebP 图片。
- `manifest.json` 记录了配置中没有可用公开图片的图标键；商城会对这些物品使用分类占位图。
- 5,941 张合格 WebP 在仓库中保存为 `icons.tar.gz.part-*` 分卷；`Dockerfile` 构建时会在本地解包成 `public/game-assets/icons/`，不会从外网下载。当前有 31 个图标因公开源文件低于质量下限而使用前端分类占位图。
- `reliquary-aliases.json` 将 730 个私服存档中的圣遗物变体 ID 映射到同套装、同部位、同星级的标准图鉴条目；32 个 `set_id=0` 的无套装模板使用明确的通用圣遗物名称和占位图。
- 额外补入 9 张米哈游 `game_record` 原始圣遗物图标，均为 256×256；它们覆盖 `UI_RelicIcon_15000_*` 以及缺失的 `UI_RelicIcon_15004_*`。
- 图标质量下限为 256×256：宽或高任一边小于 256 像素都会令 Docker 构建和前端 CI 失败。禁止把低分辨率图片简单放大后冒充高清源图；没有合格源图时使用前端分类占位图。

本目录不包含下载或生成脚本。游戏图像的权利归其各自权利人所有，用于商业环境前请自行确认授权范围。
