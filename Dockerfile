FROM electronuserland/builder:wine
ARG TOKEN=sadkl
WORKDIR /app
COPY . .
ENV GH_TOKEN=$TOKEN
RUN yarn
CMD ["yarn", "deploy:docker-app-wl"]