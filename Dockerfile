# Build frontend
FROM node:20-alpine as frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Main application
FROM node:20-alpine
WORKDIR /app

# Install dumb-init to handle signals properly
RUN apk add --no-cache dumb-init

# Copy backend code
COPY backend/package*.json ./backend/
RUN cd backend && npm install --production

# Copy built frontend
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

# Copy backend source
COPY backend/ ./backend/

# Set environment variables
ENV NODE_ENV=production
ENV PORT=5000

# Expose port
EXPOSE 5000

# Use dumb-init to run node
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "backend/server.js"]
