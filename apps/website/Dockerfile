FROM node:lts-alpine AS base

WORKDIR /app
ENV NODE_ENV=production
COPY .next/standalone .

EXPOSE 3000
CMD ["npm", "start", "--prefix", "apps/website"]