FROM node:lts-alpine AS base

WORKDIR /app
ENV NODE_ENV=production
COPY dist .

EXPOSE 3002
CMD ["npm", "start"]