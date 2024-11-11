# Use the official Node.js image
FROM node:18

# Set working directory in container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Build TypeScript files to the dist folder
RUN npm run build

# Expose the port
EXPOSE 8080

# Start the app from the compiled JavaScript files in the dist folder
CMD ["node", "dist/src/index.js"]
