# Use Node.js as the base image
FROM node:18

# Set the working directory
WORKDIR /usr/src/app

# Install pnpm globally
RUN npm install -g pnpm

# Copy package.json and install dependencies
COPY package*.json ./
RUN pnpm install

# Copy the rest of the app's source code
COPY . .

# Expose the app's port
EXPOSE 3000

# Start the app
CMD ["pnpm", "run", "start:dev"]
