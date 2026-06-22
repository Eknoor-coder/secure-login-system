FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all files
COPY . .

# Expose ports
EXPOSE 5000 8000

# Start both server and frontend
CMD ["sh", "-c", "npm start & npx http-server -p 8000 -c-1"]
