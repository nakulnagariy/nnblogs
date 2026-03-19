# AWS Deployment Guide for NNBlogs

This guide covers the cheapest ways to deploy your NNBlogs application on AWS.

## Option 1: AWS Amplify (Recommended - Easiest & Cheapest)

AWS Amplify is the simplest and most cost-effective way to host a Next.js application.

### Cost Estimate
- **Free Tier**: 1000 build minutes/month, 15 GB served/month, 5 GB stored
- **After Free Tier**: ~$0.01 per build minute, $0.15 per GB served

### Deployment Steps

1. **Push your code to GitHub/GitLab/Bitbucket**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. **Go to AWS Amplify Console**
   - Navigate to [AWS Amplify Console](https://console.aws.amazon.com/amplify)
   - Click "New app" → "Host web app"

3. **Connect your repository**
   - Select your Git provider
   - Authorize AWS Amplify
   - Select your repository and branch

4. **Configure build settings**
   - Amplify will auto-detect Next.js
   - The default settings should work

5. **Add Environment Variables**
   - Go to App settings → Environment variables
   - Add all variables from `.env.local.example`

6. **Deploy**
   - Click "Save and deploy"
   - Wait for the build to complete

### Custom Domain (Optional)
- Go to App settings → Domain management
- Add your custom domain
- AWS will handle SSL certificates automatically

---

## Option 2: AWS App Runner (Simple Container-Based)

Good for when you need more control over the runtime environment.

### Cost Estimate
- **Cheapest**: ~$5-10/month for a small blog
- Pay per vCPU-second and GB-second of memory

### Deployment Steps

1. **Create a Dockerfile** (already created in your project)

2. **Push to Amazon ECR**
   ```bash
   # Install AWS CLI and configure
   aws configure

   # Create ECR repository
   aws ecr create-repository --repository-name nnblogs

   # Build and push
   aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <account-id>.dkr.ecr.us-east-1.amazonaws.com
   docker build -t nnblogs .
   docker tag nnblogs:latest <account-id>.dkr.ecr.us-east-1.amazonaws.com/nnblogs:latest
   docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/nnblogs:latest
   ```

3. **Create App Runner Service**
   - Go to AWS App Runner Console
   - Click "Create service"
   - Select "Container registry" → "Amazon ECR"
   - Select your image
   - Configure instance (0.25 vCPU, 0.5 GB is cheapest)
   - Add environment variables
   - Deploy

---

## Option 3: EC2 with Docker (Most Control, Potentially Cheapest)

For maximum control and potentially the cheapest long-term option.

### Cost Estimate
- **t3.micro/t4g.micro**: Free tier eligible (750 hours/month for 12 months)
- **After Free Tier**: ~$8-10/month for t3.micro

### Deployment Steps

1. **Launch EC2 Instance**
   ```bash
   # Use Amazon Linux 2023 or Ubuntu
   # Instance type: t3.micro (free tier) or t4g.micro
   # Enable public IP
   # Security group: Allow ports 22 (SSH), 80 (HTTP), 443 (HTTPS)
   ```

2. **Connect to your instance**
   ```bash
   ssh -i your-key.pem ec2-user@your-instance-ip
   ```

3. **Install Docker**
   ```bash
   # Amazon Linux 2023
   sudo dnf update -y
   sudo dnf install docker -y
   sudo systemctl start docker
   sudo systemctl enable docker
   sudo usermod -a -G docker ec2-user
   
   # Install Docker Compose
   sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
   sudo chmod +x /usr/local/bin/docker-compose
   ```

4. **Clone and Deploy**
   ```bash
   git clone <your-repo-url>
   cd nnblogs
   
   # Create .env.local with your environment variables
   nano .env.local
   
   # Build and run
   docker build -t nnblogs .
   docker run -d -p 80:3000 --env-file .env.local --name nnblogs nnblogs
   ```

5. **Set up Nginx (Optional - for SSL)**
   ```bash
   sudo dnf install nginx -y
   sudo systemctl start nginx
   sudo systemctl enable nginx
   
   # Install Certbot for free SSL
   sudo dnf install certbot python3-certbot-nginx -y
   sudo certbot --nginx -d yourdomain.com
   ```

---

## Option 4: AWS Lightsail (Simple VPS)

A simplified VPS experience with predictable pricing.

### Cost Estimate
- **Cheapest Plan**: $3.50/month (512 MB RAM, 1 vCPU)
- **Recommended**: $5/month (1 GB RAM, 1 vCPU)

### Deployment Steps

1. **Create Lightsail Instance**
   - Go to AWS Lightsail Console
   - Click "Create instance"
   - Choose "Node.js" blueprint or "OS Only" with Ubuntu
   - Select $5/month plan (1 GB RAM recommended for Next.js)

2. **Connect and Deploy**
   ```bash
   # SSH into your instance from Lightsail console
   
   # Install Node.js (if using OS Only)
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt-get install -y nodejs
   
   # Clone and setup
   git clone <your-repo-url>
   cd nnblogs
   npm install
   npm run build
   
   # Install PM2 for process management
   sudo npm install -g pm2
   pm2 start npm --name "nnblogs" -- start
   pm2 save
   pm2 startup
   ```

3. **Set up Static IP and DNS**
   - Create a static IP in Lightsail
   - Attach it to your instance
   - Point your domain to the static IP

---

## Cost Comparison Summary

| Option | Monthly Cost | Free Tier | Complexity |
|--------|-------------|-----------|------------|
| AWS Amplify | $0-5 | Yes | Very Easy |
| App Runner | $5-10 | No | Easy |
| EC2 | $0-10 | Yes (12 mo) | Medium |
| Lightsail | $3.50-5 | No | Easy |

## Recommendations

1. **For Getting Started**: Use **AWS Amplify** - it's the easiest and cheapest for small blogs
2. **For More Control**: Use **Lightsail** at $5/month - good balance of simplicity and control
3. **For Long-term**: **EC2** with reserved instances can be very cost-effective

## Important Notes

- Always set up proper environment variables for production
- Enable HTTPS/SSL for your domain (free with Let's Encrypt)
- Set up CloudWatch for monitoring and alerts
- Consider using CloudFront for CDN (improves performance, can reduce costs)
- Supabase handles the database hosting separately (generous free tier)

## Alternative: Vercel (Easiest Option)

If AWS complexity is a concern, Vercel (the creators of Next.js) offers:
- Free tier with generous limits
- Automatic deployments from Git
- Built-in CDN and SSL
- Zero configuration needed

```bash
npm install -g vercel
vercel
```

The free tier is often sufficient for personal blogs!
