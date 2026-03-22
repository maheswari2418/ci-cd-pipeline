# 🚀 React CI/CD Pipeline — Docker + GitHub Actions + AWS EC2

A **production-ready CI/CD pipeline** that automatically builds, tests, and deploys a Dockerized React application to AWS EC2 using GitHub Actions.

---

## 📋 Table of Contents

1. [Project Architecture](#1--project-architecture)
2. [Folder Structure](#2--folder-structure)
3. [Application Overview](#3--application-overview)
4. [Dockerfile Explained](#4--dockerfile-explained)
5. [GitHub Actions Workflow Explained](#5--github-actions-workflow-explained)
6. [Docker Hub Setup](#6--docker-hub-setup)
7. [AWS EC2 Setup & Deployment](#7--aws-ec2-setup--deployment)
8. [Step-by-Step Commands](#8--step-by-step-commands)
9. [Common Errors & Troubleshooting](#9--common-errors--troubleshooting)
10. [How to Explain This in Interviews](#10--how-to-explain-this-in-interviews)

---

## 1. 🏗 Project Architecture

```
Developer → GitHub (push) → GitHub Actions → Docker Hub → AWS EC2
```

### Pipeline Flow Diagram

```
┌──────────┐     ┌──────────┐     ┌──────────────────────────────┐
│Developer │────▶│  GitHub   │────▶│      GitHub Actions          │
│(git push)│     │   Repo    │     │                              │
└──────────┘     └──────────┘     │  ┌────────┐  ┌────────────┐  │
                                  │  │  Lint   │  │   Test     │  │
                                  │  └───┬────┘  └─────┬──────┘  │
                                  │      └──────┬──────┘         │
                                  │             ▼                │
                                  │       ┌──────────┐           │
                                  │       │  Build   │           │
                                  │       └────┬─────┘           │
                                  └────────────┼─────────────────┘
                                               ▼
                                  ┌────────────────────┐
                                  │    Docker Hub       │
                                  │  (Image Registry)   │
                                  └─────────┬──────────┘
                                            ▼
                                  ┌────────────────────┐
                                  │    AWS EC2          │
                                  │  (Docker Container) │
                                  │  Nginx → React App  │
                                  └────────────────────┘
```

### How It Works

1. **Developer pushes code** to the `main` branch on GitHub
2. **GitHub Actions triggers** the CI/CD pipeline automatically
3. **CI Stage** — Installs dependencies, runs ESLint and unit tests
4. **Build Stage** — Creates the production React bundle
5. **Docker Stage** — Builds a multi-stage Docker image and pushes it to Docker Hub
6. **Deploy Stage** — SSHs into EC2, pulls the image, and runs the container
7. **Health Check** — Verifies the app is live and responding

---

## 2. 📁 Folder Structure

```
react-cicd-app/
├── .github/
│   └── workflows/
│       └── ci-cd.yml           # 🔄 GitHub Actions pipeline
├── nginx/
│   └── default.conf            # ⚙️  Nginx configuration
├── scripts/
│   ├── deploy.sh               # 🚀 Manual deployment script
│   └── health-check.sh         # ❤️  Health check script
├── src/
│   ├── assets/                 # 🖼️  Static assets (images, SVGs)
│   ├── App.jsx                 # ⚛️  Main React component
│   ├── App.test.jsx            # 🧪 Unit tests
│   ├── App.css                 # 🎨 Component styles
│   ├── index.css               # 🎨 Global styles
│   └── main.jsx                # 🚪 Entry point
├── public/                     # 📂 Public static files
├── .dockerignore               # 🐳 Docker ignore rules
├── .env.example                # 🔐 Environment template
├── .gitignore                  # 📝 Git ignore rules
├── Dockerfile                  # 🐳 Multi-stage Docker build
├── docker-compose.yml          # 🐳 Docker Compose config
├── index.html                  # 📄 HTML entry point
├── package.json                # 📦 Node.js dependencies
├── vite.config.js              # ⚡ Vite configuration
└── eslint.config.js            # 🔍 ESLint configuration
```

---

## 3. ⚛️ Application Overview

This is a **React + Vite** application with:

- **React 19** — Latest version with modern features
- **Vite** — Lightning-fast dev server and build tool
- **ESLint** — Code linting and quality checks
- **Vitest** — Unit testing framework
- **Nginx** — Production web server (inside Docker)

The app itself is a starter React app with a counter, links, and social icons. It serves as the **payload** — the real value of this project is the CI/CD infrastructure around it.

### Key Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server (localhost:5173) |
| `npm run build` | Create production bundle in `dist/` |
| `npm run lint` | Run ESLint code checks |
| `npm run test` | Run unit tests with Vitest |
| `npm run preview` | Preview production build locally |

---

## 4. 🐳 Dockerfile Explained

The Dockerfile uses a **multi-stage build** — this is a production best practice that reduces the final image size from ~1GB to ~25MB.

```dockerfile
# ============================================================
# Stage 1: Build the React application
# ============================================================
FROM node:20-alpine AS builder         # Small Node.js image (~50MB)

WORKDIR /app

COPY package.json package-lock.json ./ # Copy deps first (layer caching!)
RUN npm ci --silent                    # Install exact versions from lock file

COPY . .                               # Copy source code
RUN npm run build                      # Create production bundle → /app/dist

# ============================================================
# Stage 2: Serve with Nginx
# ============================================================
FROM nginx:stable-alpine AS production # Tiny Nginx image (~25MB)

RUN rm /etc/nginx/conf.d/default.conf          # Remove default config
COPY nginx/default.conf /etc/nginx/conf.d/     # Use our custom config
COPY --from=builder /app/dist /usr/share/nginx/html  # Copy ONLY built files

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -qO- http://localhost/ || exit 1    # Built-in health monitoring

CMD ["nginx", "-g", "daemon off;"]             # Run Nginx in foreground
```

### Why Multi-Stage?

| Approach | Image Size | Security |
|----------|-----------|----------|
| Single stage (Node) | ~1 GB | ❌ Includes dev tools, source code |
| **Multi-stage (Nginx)** | **~25 MB** | **✅ Only static files + Nginx** |

---

## 5. 🔄 GitHub Actions Workflow Explained

The pipeline file is at `.github/workflows/ci-cd.yml`. Here's what each job does:

### Job 1: `build-and-test`

Runs on **every push and PR** to catch bugs early.

```
Checkout → Install deps → Lint → Test → Build → Upload artifacts
```

- Uses Node.js 20 with npm caching for speed
- Runs ESLint to catch code quality issues
- Runs Vitest unit tests
- Builds production bundle and uploads as artifact

### Job 2: `docker`

Runs **only on `main` branch push** (not on PRs).

```
Checkout → Setup Buildx → Login to Docker Hub → Build & Push image
```

- Uses Docker Buildx for efficient builds
- Tags image with build number + git SHA (e.g., `build-42-abc1234`)
- Also tags as `latest` for easy deployment
- Uses GitHub Actions cache for faster rebuilds

### Job 3: `deploy`

Runs **only after Docker job succeeds** on `main`.

```
SSH into EC2 → Pull image → Stop old container → Start new → Health check
```

- Uses SSH action to connect to EC2
- Pulls latest Docker image
- Gracefully replaces the running container
- Runs health check to verify deployment

### Required GitHub Secrets

| Secret | Description | Example |
|--------|-------------|---------|
| `DOCKER_USERNAME` | Docker Hub username | `johndoe` |
| `DOCKER_PASSWORD` | Docker Hub access token | `dckr_pat_xxx...` |
| `EC2_HOST` | EC2 public IP or DNS | `54.123.45.67` |
| `EC2_USERNAME` | EC2 SSH username | `ubuntu` |
| `EC2_SSH_KEY` | EC2 private key (PEM) | Contents of `.pem` file |

---

## 6. 🐳 Docker Hub Setup

### Step 1: Create a Docker Hub Account

1. Go to [hub.docker.com](https://hub.docker.com/)
2. Sign up for a free account
3. Verify your email

### Step 2: Create an Access Token

```
Docker Hub → Account Settings → Security → New Access Token
```

1. Name: `github-actions-cicd`
2. Permissions: **Read, Write, Delete**
3. Click **Generate** → **Copy the token immediately** (you won't see it again!)

### Step 3: Create a Repository (Optional)

Docker Hub auto-creates repos on first push, but you can create one manually:

```
Docker Hub → Repositories → Create Repository
Name: react-cicd-app
Visibility: Public (or Private for paid plans)
```

### Step 4: Add Secrets to GitHub

Go to your GitHub repo:

```
Settings → Secrets and variables → Actions → New repository secret
```

Add these secrets:

```
DOCKER_USERNAME = your-dockerhub-username
DOCKER_PASSWORD = your-access-token-from-step-2
```

---

## 7. ☁️ AWS EC2 Setup & Deployment

### Step 1: Launch an EC2 Instance

1. Go to [AWS Console → EC2 → Launch Instance](https://console.aws.amazon.com/ec2/)
2. Configure:
   - **Name**: `react-cicd-server`
   - **AMI**: Ubuntu 22.04 LTS (free tier)
   - **Instance type**: `t2.micro` (free tier)
   - **Key pair**: Create new → Download `.pem` file → **Keep it safe!**
   - **Security Group** — allow these inbound rules:

| Type | Port | Source | Purpose |
|------|------|--------|---------|
| SSH | 22 | Your IP | SSH access |
| HTTP | 80 | 0.0.0.0/0 | Web traffic |
| Custom TCP | 3000 | 0.0.0.0/0 | App port |

3. Click **Launch Instance**

### Step 2: Connect to EC2 & Install Docker

```bash
# Set correct permissions on key file
chmod 400 your-key.pem

# SSH into EC2
ssh -i your-key.pem ubuntu@<EC2-PUBLIC-IP>
```

Once connected, install Docker:

```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Install Docker
sudo apt install -y docker.io

# Start Docker and enable on boot
sudo systemctl start docker
sudo systemctl enable docker

# Add ubuntu user to docker group (no sudo needed for docker commands)
sudo usermod -aG docker ubuntu

# Log out and back in for group change to take effect
exit
```

SSH back in and verify:

```bash
ssh -i your-key.pem ubuntu@<EC2-PUBLIC-IP>
docker --version    # Should show Docker version
docker run hello-world   # Test Docker works
```

### Step 3: Add EC2 Secrets to GitHub

Go to your GitHub repo:

```
Settings → Secrets and variables → Actions → New repository secret
```

Add these secrets:

```
EC2_HOST     = <your-ec2-public-ip>        (e.g., 54.123.45.67)
EC2_USERNAME = ubuntu
EC2_SSH_KEY  = <paste entire .pem file contents>
```

> **⚠️ Important**: For `EC2_SSH_KEY`, paste the **entire contents** of your `.pem` file, including `-----BEGIN RSA PRIVATE KEY-----` and `-----END RSA PRIVATE KEY-----`.

### Step 4: Push Code and Watch the Magic!

```bash
git add .
git commit -m "Add CI/CD pipeline with GitHub Actions"
git push origin main
```

Then go to your GitHub repo → **Actions** tab to watch the pipeline run!

---

## 8. 📋 Step-by-Step Commands

### Local Development

```bash
# Clone the project
git clone https://github.com/your-username/react-cicd-app.git
cd react-cicd-app

# Install dependencies
npm install

# Start dev server
npm run dev
# App runs at → http://localhost:5173

# Run tests
npm run test

# Run linter
npm run lint

# Build for production
npm run build
```

### Docker (Local Testing)

```bash
# Build Docker image locally
docker build -t react-cicd-app .

# Run container locally
docker run -d --name react-cicd-app -p 3000:80 react-cicd-app
# App runs at → http://localhost:3000

# Check container status
docker ps

# View logs
docker logs react-cicd-app

# Stop and remove
docker stop react-cicd-app && docker rm react-cicd-app
```

### Docker Compose

```bash
# Start with Docker Compose
docker compose up -d

# Stop
docker compose down
```

### Manual Deployment (without CI/CD)

```bash
# Deploy using the included script
./scripts/deploy.sh latest

# Run health check
./scripts/health-check.sh http://your-server-ip:3000
```

---

## 9. 🔧 Common Errors & Troubleshooting

### GitHub Actions Errors

| Error | Cause | Fix |
|-------|-------|-----|
| `npm ci` fails | `package-lock.json` out of sync | Run `npm install` locally, commit the updated lock file |
| Docker login fails | Wrong credentials | Check `DOCKER_USERNAME` and `DOCKER_PASSWORD` secrets |
| SSH connection refused | EC2 security group | Add port 22 inbound rule for your GitHub Actions IP (or `0.0.0.0/0`) |
| Permission denied (SSH) | Wrong key or username | Verify `EC2_SSH_KEY` contains the full `.pem` contents, `EC2_USERNAME` is `ubuntu` |
| Health check fails | App not ready yet | Increase sleep time in workflow, check if container started properly |

### Docker Errors

| Error | Cause | Fix |
|-------|-------|-----|
| `COPY failed: file not found` | Missing `package-lock.json` | Run `npm install` to generate it |
| Image too large | Not using multi-stage build | Ensure Dockerfile has two `FROM` stages |
| Port already in use | Another container on same port | `docker stop <container>` or use a different port |
| Container exits immediately | Nginx config error | Check `docker logs <container>` for details |

### EC2 Errors

| Error | Cause | Fix |
|-------|-------|-----|
| Cannot connect to EC2 | Security group / instance stopped | Check AWS console, verify security group rules |
| `docker: command not found` | Docker not installed | Follow Step 2 in EC2 setup |
| `permission denied` for docker | User not in docker group | Run `sudo usermod -aG docker ubuntu`, then log out/in |
| App not accessible on port 3000 | Security group missing rule | Add Custom TCP port 3000 inbound rule |

---

## 10. 🎤 How to Explain This Project in Interviews

### Quick Elevator Pitch (30 seconds)

> "I built a production-grade CI/CD pipeline for a React application using GitHub Actions and Docker. When a developer pushes code to GitHub, the pipeline automatically runs linting and tests, builds a Docker image with a multi-stage Dockerfile using Nginx, pushes it to Docker Hub, and deploys it to an AWS EC2 instance — all within minutes, with zero manual intervention."

### Detailed Explanation (2 minutes)

**What**: "This is an end-to-end CI/CD pipeline that automates the software delivery lifecycle."

**Why**: "Manual deployments are error-prone and slow. This pipeline ensures every code change goes through quality checks before reaching production."

**How**:
1. "The React app is built with Vite and has ESLint for code quality and Vitest for unit tests."
2. "I used a multi-stage Dockerfile — Stage 1 builds the app with Node.js, Stage 2 serves it with Nginx. This reduces the image from 1GB to just 25MB."
3. "GitHub Actions orchestrates the pipeline in three jobs: Build & Test, Docker Build & Push, and Deploy."
4. "Deployment uses SSH to connect to an EC2 instance, pull the latest image, and do a zero-downtime container replacement."
5. "Health checks verify the deployment succeeded."

### Key Technical Terms to Mention

- **CI/CD** — Continuous Integration / Continuous Deployment
- **Multi-stage Docker build** — Smaller, more secure images
- **Docker Hub** — Container image registry
- **GitHub Actions** — CI/CD platform integrated with GitHub
- **Nginx** — Production web server with gzip, caching, SPA support
- **EC2** — AWS virtual server for hosting
- **Health checks** — Automated verification of deployment success
- **Infrastructure as Code** — Pipeline defined in YAML, versioned with the app

### Follow-up Questions You Might Get

| Question | Suggested Answer |
|----------|-----------------|
| "Why Docker instead of direct deployment?" | "Docker ensures the app runs identically everywhere — dev, staging, production. No 'works on my machine' issues." |
| "Why multi-stage build?" | "Security and size — the final image only has Nginx and static files, no Node.js, no source code, no dev dependencies." |
| "How do you handle secrets?" | "GitHub Secrets for CI/CD credentials, never hardcoded. `.env` files are gitignored." |
| "What if deployment fails?" | "The pipeline has health checks. The old container keeps running until the new one is verified. We could add rollback logic by keeping the previous image tag." |
| "How would you scale this?" | "For horizontal scaling I'd add a load balancer (AWS ALB), and for orchestration I'd migrate to Kubernetes or AWS ECS." |

---

## 🌟 Bonus: Future Improvements

### Add HTTPS with Let's Encrypt

```bash
# On EC2, install Certbot
sudo apt install -y certbot
sudo certbot certonly --standalone -d yourdomain.com

# Update docker-compose.yml to mount certificates
# and update nginx config to listen on 443
```

### Extend to Kubernetes (Next Level)

When you're ready to orchestrate multiple containers at scale:

1. Create a Kubernetes cluster (AWS EKS, GKE, or Minikube)
2. Create Kubernetes manifests:
   - `deployment.yaml` — Defines pod replicas
   - `service.yaml` — Exposes the app internally
   - `ingress.yaml` — Routes external traffic
3. Update the GitHub Actions deploy job to use `kubectl apply`
4. Benefits: Auto-scaling, self-healing, rolling updates, load balancing

### Add Slack/Email Notifications

Add a notification step to the GitHub Actions workflow:

```yaml
- name: 📢 Notify Slack
  uses: slackapi/slack-github-action@v1
  with:
    slack-message: "✅ Deployed react-cicd-app build #${{ github.run_number }}"
  env:
    SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }}
```

---

## 📝 License

This project is open source and available under the [MIT License](LICENSE).