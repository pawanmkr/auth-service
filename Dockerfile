FROM node:18-alpine

WORKDIR /app

# Copy package.json and pnpm-lock.yaml
COPY package.json .
COPY pnpm-lock.yaml .

# Install dependencies
RUN npm install -g pnpm

# Copy the rest of the application code
COPY . .

EXPOSE 8088

CMD ["pnpm", "prod:start"]