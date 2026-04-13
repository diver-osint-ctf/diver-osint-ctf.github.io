FROM node:23-slim@sha256:86191b94d2a163be41f3dc7fe5e5fcaca8ba2f1be7275d98a06343483c17414a

RUN apt-get update && apt-get install -y --no-install-recommends wget git ca-certificates procps && rm -rf /var/lib/apt/lists/*
RUN corepack enable && corepack prepare pnpm@latest --activate
RUN useradd -m -s /bin/bash vscode

WORKDIR /workspace
