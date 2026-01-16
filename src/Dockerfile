# ======================
# Build stage
# ======================
FROM node:18-alpine AS builder

WORKDIR /app

# Dépendances
COPY package*.json ./
RUN npm install

# Code source
COPY . .

# Build (React)
RUN npm run build


# ======================
# Production stage
# ======================
FROM nginx:alpine

# Copier le build React
COPY --from=builder /app/build /usr/share/nginx/html

# Config nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
