# Use the official Node.js image as the base image
FROM node:21.3.0

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# RUN echo "nameserver 8.8.8.8" > /etc/resolv.conf

# Install dependencies
RUN npm ci

# additional build to solve bycrypt issue
RUN npm rebuild bcrypt --build-from-source

# Copy the entire project to the working directory
COPY . .

# # Build the TypeScript code
RUN npm run build

# Expose the port your app runs on (replace 3000 with your app's port if different)
EXPOSE 3000

# Define environment variables
ENV NODE_ENV=production

# Start the application
CMD ["node", "dist/index.js"]

