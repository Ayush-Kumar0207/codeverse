FROM node:20-alpine AS dependencies
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

FROM node:20-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup -S codeverse && adduser -S codeverse -G codeverse
COPY --from=dependencies /app/node_modules ./node_modules
COPY package.json package-lock.json ./
COPY . .
RUN mkdir -p .data deployments && chown -R codeverse:codeverse /app
USER codeverse
EXPOSE 5000 5001
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD wget -qO- http://127.0.0.1:5000/api/health || exit 1
CMD ["npm", "start"]
