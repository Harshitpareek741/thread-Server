FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install
EXPOSE 8080
CMD ["node", "src/index.ts"]
