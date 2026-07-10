FROM python:3.11-slim

# Install Node.js so we can build the React frontend inside the same image
RUN apt-get update && apt-get install -y curl && \
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs && \
    rm -rf /var/lib/apt/lists/*

# Install pnpm — the project uses pnpm (pnpm-lock.yaml), not npm
RUN npm install -g pnpm

WORKDIR /app
COPY . .

RUN pnpm install && pnpm run build
RUN pip install --no-cache-dir -r backend/requirements.txt

WORKDIR /app/backend
EXPOSE 10000
CMD ["sh", "-c", "gunicorn --bind 0.0.0.0:$PORT app:app"]
