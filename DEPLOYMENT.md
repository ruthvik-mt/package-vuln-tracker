# 🚀 Production Deployment Guide

This guide explains how to deploy the **Vulnerability Tracker** to a production environment.

## 📋 Prerequisites
1.  **A Linux Server**: (e.g., DigitalOcean Droplet, AWS EC2, or Azure VM). Recommended: Ubuntu 22.04 LTS.
2.  **A Domain Name**: (Optional, but recommended for professional look).
3.  **GitHub Account**: To transfer your code.

---

## 1. Prepare your production environment
Log into your server via SSH and install the Docker Engine:

```bash
# Update and install Docker
sudo apt-get update
sudo apt-get install ca-certificates cursor curl gnupg
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

# Add the repository to Apt sources:
echo \
  "deb [arch="$(dpkg --print-architecture)" signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  "$(. /etc/os-release && echo "$VERSION_CODENAME")" stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update
sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

---

## 2. Deploy the Project
Once Docker is installed, follow these steps:

1.  **Push your code to GitHub**:
    *   Create a private repository.
    *   Push your local folder: `git add .`, `git commit -m "Deployment ready"`, `git push origin main`.

2.  **Clone on the Server**:
    ```bash
    git clone https://github.com/yourusername/package-vuln-tracker.git
    cd package-vuln-tracker
    ```

3.  **Launch in Production Mode**:
    ```bash
    # Run in detached mode (background)
    sudo docker compose up -d --build
    ```

---

## 3. Production Hardening (CRITICAL)

> [!WARNING]
> **Change Default Credentials**: 
> In a real deployment, you MUST change the `ADMIN_PASSWORD_HASH` and `JWT_SECRET` in your `docker-compose.yml` or `.env` file. Do not use "admin" on a public server!

> [!IMPORTANT]
> **Database Backups**:
> Set up a "Cron Job" on your Linux server to back up your PostgreSQL volumes daily.

---

## 4. Setting up HTTPS (SSL)
To get the green padlock in the browser, use **Nginx** as a reverse proxy with **Let's Encrypt**:

1.  Install Nginx on the server: `sudo apt install nginx`.
2.  Install Certbot: `sudo apt install certbot python3-certbot-nginx`.
3.  Run: `sudo certbot --nginx -d yourdomain.com`.

---

## 🛠️ Typical "Real World" Operations
*   **Checking Logs**: `docker compose logs -f`
*   **Scaling**: `docker compose up -d --scale package-service=3` (to handle more traffic!)
*   **Updates**: Just run `git pull` followed by `docker compose up -d --build`.
