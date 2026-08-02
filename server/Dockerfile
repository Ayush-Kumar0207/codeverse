FROM node:22-alpine AS dependencies
WORKDIR /workspace/server
COPY server/package.json server/package-lock.json ./
RUN npm ci --omit=dev

FROM node:22-alpine AS runtime
WORKDIR /workspace/server
ENV NODE_ENV=production
RUN apk add --no-cache docker-cli && addgroup -S codeverse && adduser -S codeverse -G codeverse
COPY --from=dependencies /workspace/server/node_modules ./node_modules
COPY server/ ./
COPY shared/ ../shared/
RUN mkdir -p .data deployments && chown -R codeverse:codeverse /workspace
USER codeverse
EXPOSE 5000 5001
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD wget -qO- http://127.0.0.1:5000/api/health || exit 1
CMD ["npm", "start"]
