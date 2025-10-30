# NYC Taxi KPI Dashboard
<!-- /README.md -->

Node.js full-stack dashboard for visualizing NYC Taxi KPIs from Spark batch data pipeline.

## Features

- **Real-time KPI Display**: Revenue, trip metrics, night trip percentage
- **Interactive Charts**: Weekly trip volume by borough using Chart.js
- **Parquet Integration**: Reads Gold layer outputs from Spark pipeline
- **Security**: Pre-commit hooks with detect-secrets
- **Design Patterns**: Factory, Dependency Injection, Middleware patterns from Node.js Design Patterns 4th Edition

## Tech Stack

- **Runtime**: Node.js with ES Modules
- **Framework**: Express.js v5
- **Template Engine**: EJS
- **Data**: Parquet.js for reading Spark outputs
- **Visualization**: Chart.js
- **Security**: detect-secrets, pre-commit hooks
- **Containerization**: Docker with multi-stage builds
- **Deployment**: Railway.app

## Prerequisites

- Node.js 18+
- npm or yarn
- Python 3.8+ (for pre-commit)
- Docker (optional, for containerized deployment)

## Installation
```bash
# Clone repository
git clone git@github.com:ltphongssvn/nyc-taxi-kpi-dashboard.git
cd nyc-taxi-kpi-dashboard

# Install dependencies
npm install

# Install pre-commit hooks
pre-commit install
```

## Usage

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

Visit `http://localhost:3000`

### Docker
```bash
# Build image
docker build -t nyc-taxi-dashboard .

# Run container
docker run -p 3000:3000 nyc-taxi-dashboard
```

## Data Integration

Place Parquet files from Spark Gold layer in `/data` directory:
```bash
# Fetch from Spark pipeline output
cp /path/to/spark/gold/*.parquet ./data/
```

Or use mock data (default when no Parquet files found).

### Generate Mock Gold Layer Data
```bash
node scripts/generateGoldData.js
```

## Project Structure
```
├── index.js                 # Main entry point
├── Dockerfile              # Multi-stage Docker build
├── .dockerignore           # Docker build exclusions
├── src/
│   ├── routes/
│   │   └── dashboard.js     # Express routes
│   └── services/
│       └── dataService.js   # Data access layer
├── views/
│   └── dashboard.ejs        # Dashboard template
├── public/
│   └── styles.css          # Styling
├── scripts/
│   └── generateGoldData.js # Mock data generator
├── test/
│   └── dataService.test.js # Unit tests
├── data/                    # Parquet files (gitignored)
└── .pre-commit-config.yaml # Security hooks
```

## Design Patterns Used

- **Factory Pattern**: Data service for Parquet reader instantiation
- **Dependency Injection**: Service layer injected into routes
- **Middleware Pattern**: Error handling, static file serving
- **Router Pattern**: Modular route organization

## Security

- Pre-commit hooks scan for secrets before each commit
- Environment variables for sensitive data
- See [SECURITY.md](SECURITY.md) for details

## Testing
```bash
# Run unit tests
npm test
```

## KPIs Displayed

1. Total Revenue (Weekly)
2. Average Trip Distance
3. Night Trip Percentage
4. Average Fare
5. Weekly Trip Volume by Borough

## Deployment

**Live URL**: [NYC-Taxi-Company-KPI.thanhphongle.net](https://NYC-Taxi-Company-KPI.thanhphongle.net)

### Railway Deployment Process

This application is deployed on Railway using Docker containerization:

#### Prerequisites
- Railway CLI installed: `npm install -g @railway/cli`
- Railway account authenticated: `railway login`

#### Deployment Steps

1. **Initialize Railway Project**
```bash
   railway init
   # Select workspace and provide project name: NYC-Taxi-Company-KPI
```

2. **Link Service**
```bash
   railway service
   # Select or create service
```

3. **Deploy Application**
```bash
   railway up
```

#### Deployment Configuration

**Dockerfile** (Multi-stage build):
- Stage 1: Build dependencies with `npm ci --only=production`
- Stage 2: Copy built artifacts for minimal image size
- Exposes port 3000
- Uses Node.js 20 Alpine for security and efficiency

**Key Files**:
- `Dockerfile`: Container build instructions
- `.dockerignore`: Excludes dev dependencies, tests, and logs
- `package-lock.json`: Required for reproducible builds with `npm ci`

**Railway Auto-Detection**:
Railway automatically detects and uses Dockerfile for deployment.

#### Custom Domain Setup

Configure custom domain in Railway dashboard:
1. Navigate to project settings
2. Add custom domain: `NYC-Taxi-Company-KPI.thanhphongle.net`
3. Update DNS records as specified by Railway

#### Environment Variables

Set in Railway dashboard if needed:
- `PORT`: Automatically provided by Railway (defaults to 8080)
- `NODE_ENV`: Set to `production`

#### Deployment Features

- **Automatic Deployments**: Triggered on git push to linked branch
- **Zero-Downtime**: Rolling deployments
- **HTTPS**: Automatically provisioned SSL certificates
- **Monitoring**: Built-in logs and metrics via `railway logs`
- **Scaling**: Horizontal scaling available in Railway dashboard

#### Deployment Verification
```bash
# Check deployment status
railway status

# View live logs
railway logs

# Open deployed application
railway open
```

#### CI/CD Integration

Current workflow:
1. Commit changes to `develop` branch
2. Push to GitHub: `git push origin develop`
3. Deploy to Railway: `railway up`
4. Railway builds Docker image and deploys

For automated deployments, connect Railway to GitHub repository in Railway dashboard.

## GitFlow Workflow

This project follows GitFlow branching strategy:

- **main**: Production-ready code
- **develop**: Integration branch for features
- **feature/***: Individual feature branches

### Contributing

1. Create feature branch from `develop`
```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/your-feature
```

2. Make changes and commit
```bash
   git add <files>
   git commit -m "feat: description"
```

3. Pre-commit hooks automatically run:
   - Secret scanning with detect-secrets
   - Code quality checks

4. Push and create PR to `develop`
```bash
   git push origin feature/your-feature
```

5. After PR approval, merge to `develop`, then deploy

## Development Timeline

- **Initial Setup**: Node.js + Express + EJS structure
- **Data Layer**: Parquet.js integration for Gold layer KPIs
- **Visualization**: Chart.js implementation
- **Security**: Pre-commit hooks with detect-secrets
- **Testing**: Mocha + Chai unit tests
- **Containerization**: Docker multi-stage builds
- **Deployment**: Railway.app with custom domain

## License

ISC
