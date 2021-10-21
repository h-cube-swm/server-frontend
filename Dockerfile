# Dockerfile for production

# Build environment
FROM node:14 as build
WORKDIR /app
COPY src/package.json ./
COPY src/yarn.lock ./
RUN yarn install --production
COPY src/. ./
RUN yarn build

# Production environment
FROM nginx:stable-alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]