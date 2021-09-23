# FROM sickcodes/docker-osx:auto
# ARG name=zepto/DMG
# RUN curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.34.0/install.sh | bash
# RUN ls
# RUN export NVM_DIR="$HOME/.nvm"
# RUN nvm --version
# This loads nvm bash_completion

# # RUN /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
# RUN /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
# RUN brew install node@14
# RUN brew install yarn@1.22.4
# RUN brew install python@3.8
# RUN brew link --force --overwrite python@3.8
# WORKDIR /app
# COPY . .
# RUN yarn
# CMD [ "yarn", "deploy" ]




FROM node:latest
ARG name=zeptoAppImage
WORKDIR /app
RUN echo "$PWD"
COPY . .
RUN yarn
RUN yarn build:docker-app-l
#TODO: copy linux build outside