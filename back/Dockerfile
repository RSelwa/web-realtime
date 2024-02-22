FROM node:18.13.0

WORKDIR /home

COPY package.json ./
RUN yarn

EXPOSE 3001

CMD [ "yarn", "dev" ]