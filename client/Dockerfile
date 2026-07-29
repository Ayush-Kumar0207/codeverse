FROM node:22-alpine AS dependencies
WORKDIR /workspace/client
COPY client/package.json client/package-lock.json ./
RUN npm ci

FROM node:22-alpine AS builder
WORKDIR /workspace/client
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=dependencies /workspace/client/node_modules ./node_modules
COPY client/ ./
COPY shared/ ../shared/
ARG NEXT_PUBLIC_API_BASE_URL=""
ENV NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL
RUN npm run build

FROM node:22-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
RUN addgroup -S codeverse && adduser -S codeverse -G codeverse
COPY --from=builder --chown=codeverse:codeverse /workspace/client/package.json /workspace/client/package-lock.json ./
COPY --from=builder --chown=codeverse:codeverse /workspace/client/node_modules ./node_modules
COPY --from=builder --chown=codeverse:codeverse /workspace/client/.next ./.next
COPY --from=builder --chown=codeverse:codeverse /workspace/client/public ./public
USER codeverse
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
  CMD wget -qO- http://127.0.0.1:3000/ || exit 1
CMD ["npm", "start"]
