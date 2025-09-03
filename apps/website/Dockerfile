FROM node:lts-alpine AS base

WORKDIR /app
ENV NODE_ENV=production

# Copy the entire standalone directory structure
COPY .next/standalone ./

# Remove "type": "module" from package.json to fix ES module error
RUN sed -i '/"type": "module"/d' package.json

EXPOSE 3000

# Run the server from the correct location with proper node_modules access
CMD ["node", "apps/website/server.js"]