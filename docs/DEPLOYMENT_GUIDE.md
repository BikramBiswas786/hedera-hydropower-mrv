# Production Deployment Guide

## Prerequisites

- **Docker** 20.10+
- **Docker Compose** 2.0+
- **PostgreSQL** 14+ (or use Docker)
- **Domain name** with SSL certificate (for HTTPS)
- **Hedera testnet/mainnet account** with HBAR balance

---

## Quick Start (Docker Compose)

### 1. Clone Repository

```bash
git clone https://github.com/BikramBiswas786/hedera-hydropower-mrv.git
cd hedera-hydropower-mrv
```

### 2. Configure Environment

Create `.env` file:

```bash
# Database
DB_PASSWORD=your-secure-password
DATABASE_URL=postgresql://mrv_user:your-secure-password@postgres:5432/hedera_mrv

# Hedera (get from portal.hedera.com)
HEDERA_OPERATOR_ID=0.0.YOUR_ACCOUNT
HEDERA_OPERATOR_KEY=302e020100300506032b657004220420YOUR_PRIVATE_KEY
AUDIT_TOPIC_ID=0.0.7462776
REC_TOKEN_ID=0.0.7964264

# API Security
VALID_API_KEYS=your-api-key-1,your-api-key-2
CORS_ORIGIN=https://yourdomain.com

# Monitoring
GRAFANA_PASSWORD=your-grafana-password
```

### 3. Start Services

```bash
docker-compose up -d
```

### 4. Verify Deployment

```bash
# Check API
curl http://localhost:3000/health

# Check metrics
curl http://localhost:3000/metrics

# Check Grafana
open http://localhost:3001  # admin / your-grafana-password
```

---

## Manual Deployment (Without Docker)

### 1. Install Dependencies

```bash
# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs postgresql-14

# Clone repo
git clone https://github.com/BikramBiswas786/hedera-hydropower-mrv.git
cd hedera-hydropower-mrv

# Install packages
npm install --production
```

### 2. Setup Database

```bash
# Create database
sudo -u postgres psql
CREATE DATABASE hedera_mrv;
CREATE USER mrv_user WITH PASSWORD 'your-password';
GRANT ALL PRIVILEGES ON DATABASE hedera_mrv TO mrv_user;
\q

# Run migrations
export DATABASE_URL="postgresql://mrv_user:your-password@localhost:5432/hedera_mrv"
npm run db:migrate
npm run db:seed
```

### 3. Configure Environment

Create `.env` file (see Docker section above).

### 4. Start API Server

```bash
# Production mode
NODE_ENV=production npm start

# Or with PM2 for process management
npm install -g pm2
pm2 start src/api/server.js --name hedera-mrv-api
pm2 save
pm2 startup
```

### 5. Setup Nginx Reverse Proxy

```nginx
server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

---

## Vercel Deployment (Serverless)

### 1. Install Vercel CLI

```bash
npm install -g vercel
```

### 2. Configure `vercel.json`

Create `vercel.json`:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "src/api/server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "src/api/server.js"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}
```

### 3. Deploy

```bash
# Add environment variables in Vercel dashboard
vercel env add HEDERA_OPERATOR_ID
vercel env add HEDERA_OPERATOR_KEY
vercel env add VALID_API_KEYS
# ... add all required vars

# Deploy
vercel --prod
```

**Note:** Vercel is serverless - not ideal for long-running Hedera operations. Use Docker or VM for production.

---

## Monitoring Setup

### Prometheus

Add to `prometheus.yml`:

```yaml
scrape_configs:
  - job_name: 'hedera-mrv'
    static_configs:
      - targets: ['yourdomain.com:3000']
    metrics_path: '/metrics'
```

### Grafana Dashboard

Import dashboard from `monitoring/grafana-dashboards/hedera-mrv.json`.

---

## Production Checklist

- [ ] HTTPS enabled with valid SSL certificate
- [ ] Database backups configured (daily)
- [ ] API keys rotated and stored securely
- [ ] Rate limiting configured
- [ ] Monitoring alerts set up (Prometheus AlertManager)
- [ ] Log aggregation configured (ELK, Loki, etc.)
- [ ] Firewall rules applied (only ports 80/443 exposed)
- [ ] Health checks configured in load balancer
- [ ] Auto-scaling rules defined (if using cloud)
- [ ] Disaster recovery plan documented

---

## Maintenance

### Update Application

```bash
git pull origin main
npm install
npm run db:migrate  # if schema changed
docker-compose build
docker-compose up -d
```

### Backup Database

```bash
pg_dump $DATABASE_URL > backup-$(date +%Y%m%d).sql
```

### View Logs

```bash
# Docker
docker-compose logs -f api

# PM2
pm2 logs hedera-mrv-api

# Systemd
journalctl -u hedera-mrv -f
```