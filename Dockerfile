# Use Node.js image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source files
COPY . .

# Compile TypeScript files
RUN npx tsc

# Expose the port
EXPOSE 8080

# Start the server
CMD ["node", "dist/src/index.js"]
