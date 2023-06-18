FROM --platform=linux/arm64/v8 node:18-alpine

WORKDIR /app

COPY package.json ./

ENV TZ=Asia/Seoul
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

RUN npm install

COPY . .

RUN npm run build

ENTRYPOINT [ "npm","run", "start" ]