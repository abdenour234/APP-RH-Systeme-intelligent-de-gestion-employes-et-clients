FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install @tanstack/react-query@latest axios@latest
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
