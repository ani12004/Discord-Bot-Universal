FROM node:18-alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm install --production

# Bundle app source
COPY . .

# Create data directory
RUN mkdir -p data

# Expose port (optional, if you add a web dashboard later)
# EXPOSE 3000

# Start the bot
CMD [ "node", "index.js" ]
