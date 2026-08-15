# game-market-web

玩家交易平台前端第一阶段。

## 技术栈

- Vue 3
- TypeScript
- Vite
- Vue Router
- Pinia
- Tailwind CSS 4
- shadcn-vue 风格基础组件
- Docker
- Nginx

后端Go
Gin
MySQL
Redis
WebSocket
本地储存


## 当前页面

- 首页
- 交易市场
- 商品详情
- 我的上架
- 我的订单
- 实时聊天界面
- 个人中心
- 登录页面

页面进入动画暂未加入。

## 当前状态

已接入商城后端登录态与真实玩家快照：登录后根据绑定的 `game_uid` 显示昵称、UID、原石、摩拉和分页背包数据。挂单、订单与交易统计接口仍待后续接入，未接入的数字在页面中显示为 `—`。

前端请求统一以 `/api/v1` 为基础路径：

- `GET /auth/me`：恢复商城登录用户
- `GET /player/me?page=1&page_size=100`：读取当前用户绑定的玩家快照

GitHub Actions 会执行前端构建和 Docker 镜像运行检查。

## 本地开发

```bash
npm install
npm run dev
```

默认前端地址：`http://localhost:5173`

默认代理后端：`http://localhost:8081`

如需覆盖 API 基础路径，可复制 `.env.example` 并设置 `VITE_API_BASE_URL`。

## Docker 启动

```bash
docker compose up -d --build
```

启动后访问：

```text
http://服务器IP:9090
```

查看状态：

```bash
docker compose ps
docker compose logs -f web
```

停止容器：

```bash
docker compose down
```

外部端口固定为 `9090`，容器内部由 Nginx 监听 `80`。健康检查地址为 `/healthz`。
