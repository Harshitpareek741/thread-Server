# Use Node.js image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the Prisma schema and generate Prisma Client
COPY prisma ./prisma
RUN npx prisma generate

# Copy the rest of the application files
COPY . .

# Compile TypeScript files (if needed)
RUN npx tsc

# Expose the port
EXPOSE 8080

# Start the server
CMD ["node", "build/index"]
