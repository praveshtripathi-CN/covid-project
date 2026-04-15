# =========================
# Build Stage
# =========================
FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Proper production build (no || true)
RUN npm run build -- --configuration=production

# =========================
# Nginx Stage
# =========================
FROM nginx:alpine

# Copy nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# IMPORTANT: correct Angular build output path
COPY --from=build /app/dist/frontend /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
