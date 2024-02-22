FROM oven/bun

WORKDIR /home

COPY package.json ./
RUN bun install

EXPOSE 3000

CMD [ "bun", "run", "dev" ]