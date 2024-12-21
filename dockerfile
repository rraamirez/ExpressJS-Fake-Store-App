FROM node:22.9.0-alpine

ENV NODE_ENV=production
ENV USER_DB=root
ENV PASS=example
ENV SECRET_KEY="dai"
# ENV DB_HOST=host.docker.internal
ENV DB_HOST: locahost
ENV buildTag=1.0

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --only=production

COPY . .

EXPOSE 8000

CMD ["npm", "start"]
