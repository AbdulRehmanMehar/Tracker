FROM electronuserland/builder:wine
ARG TOKEN=sadkl
ENV GH_TOKEN=$TOKEN
WORKDIR /app
COPY package.json .
RUN yarn install
COPY . .
CMD ["yarn", "deploy:docker-app-wl"]