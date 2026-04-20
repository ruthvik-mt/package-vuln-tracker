# 🏢 Traditional VPS Deployment Guide (Professional)

This guide explains the "Traditional" industry-standard way to deploy a complex microservices project using a **Virtual Private Server (VPS)**.

## 🚀 Why Use a VPS?
Platforms like Render or Vercel are "Platform as a Service" (PaaS). They limit you (e.g., "Only 1 Free DB"). 
A **VPS** (AWS, DigitalOcean, Azure) is a "Infrastructure as a Service" (IaaS). You get a full Linux computer in the cloud.
*   **Zero Limits**: Run as many databases and services as the RAM allows.
*   **Total Control**: You manage the security, networking, and scaling.
*   **Real World Experience**: This is how senior engineers at top tech companies deploy distributed systems.

---

## 🛠️ Step 1: Get a Server
1.  Create an account on **DigitalOcean**, **AWS**, or **Linode**.
2.  Launch a "Droplet" or "EC2 Instance" with **Ubuntu 22.04 LTS**.
3.  A $5/month server is enough for this project.

---

## ⚙️ Step 2: One-Time Server Setup
Once you log into your server via SSH, run this command to install the entire Docker stack:

```bash
# Install Docker and Docker Compose
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
```

---

## 📦 Step 3: Deploy Everything (The Simple Way)
Because we have a `docker-compose.yml`, you can deploy all 5 services with **one single command** on your server.

1.  **Clone your GitHub repo**:
    ```bash
    git clone https://github.com/ruthvik-mt/package-vuln-tracker.git
    cd package-vuln-tracker
    ```

2.  **Launch the System**:
    ```bash
    # This starts both Databases, both Backends, and the Frontend in the background
    sudo docker compose up -d --build
    ```

---

## 🌐 Step 4: Go Live
Your project is now running on your server's IP address!
*   **Dashboard**: `http://YOUR_SERVER_IP:3000`
*   **Backends**: Ports 8001 and 8002.

### 🛡️ For a "Presentation-Ready" URL:
If you want a real domain name (e.g., `audit.yourname.com`) and HTTPS (the green lock), we simply add a **Reverse Proxy** like Nginx:

```bash
sudo apt install nginx certbot python3-certbot-nginx
# Certbot will automatically give you an SSL certificate for free!
```

---

## 📊 Comparison Summary

| Feature | Render/Vercel (PaaS) | **Traditional VPS (IaaS)** |
| :--- | :--- | :--- |
| **Database Limit** | 1 Free DB | **Unlimited** |
| **Control** | Standard | **Complete Control** |
| **Professionalism** | Entry Level | **Senior Level** |
| **Reliability** | Shared Resources | **Dedicated Resources** |

> [!TIP]
> Presenting your project on a dedicated IP address (e.g. `http://157.245.xxx.xxx:3000`) is a powerful way to show recruiters that you know how to manage cloud infrastructure!
