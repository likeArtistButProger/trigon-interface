FROM node:13-buster

# Установка зависимостей
COPY package*.json /data/
WORKDIR /data
RUN npm install
ENV PATH /data/node_modules/.bin:$PATH

# Копирование кода проекта

COPY . /data/app/
WORKDIR /data/app/

# Запуск
ENTRYPOINT [ "npm", "testprod"]
