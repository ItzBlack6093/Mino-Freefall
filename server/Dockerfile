FROM node:20-bookworm-slim

RUN apt-get update \
  && apt-get install -y --no-install-recommends python3 make g++ \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package.json ./
RUN npm install --omit=dev

COPY . ./

ENV HOST=0.0.0.0
ENV PORT=8080
ENV DB_PATH=/data/db.sqlite

EXPOSE 8080

CMD ["node", "index.js"]
