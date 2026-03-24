FROM node:20

WORKDIR /app

# install deps first (better caching)
COPY package*.json ./
RUN npm install

# copy project
COPY . .

# run tests
CMD ["npx", "cucumber-js"]