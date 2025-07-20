FROM node:lts-alpine AS base

WORKDIR /app
ENV NODE_ENV=production
COPY dist .

EXPOSE 3001
CMD ["npm", "start"]