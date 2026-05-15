FROM node:20-alpine AS base
RUN corepack enable && corepack prepare pnpm@10.33.4 --activate
WORKDIR /app

FROM base AS build
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY packages/types/package.json ./packages/types/
COPY apps/client/package.json ./apps/client/
RUN pnpm install --frozen-lockfile --filter @velora/client...
COPY . .
RUN pnpm --filter @velora/types build && pnpm --filter @velora/client build

FROM nginx:alpine AS runner
COPY apps/client/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/apps/client/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
