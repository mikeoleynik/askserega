FROM node:22-alpine AS build

WORKDIR /app

COPY package.json package-lock.json .npmrc ./
RUN npm ci

COPY next.config.js tsconfig.json next-env.d.ts tailwind.config.ts postcss.config.js ./
COPY public ./public
COPY content ./content
COPY src ./src

RUN npm run build

FROM nginx:alpine

COPY config/nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/out /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
