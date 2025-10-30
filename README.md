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

## Prerequisites

- Node.js 18+
- npm or yarn
- Python 3.8+ (for pre-commit)

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

## Data Integration

Place Parquet files from Spark Gold layer in `/data` directory:
```bash
# Fetch from Spark pipeline output
cp /path/to/spark/gold/*.parquet ./data/
```

Or use mock data (default when no Parquet files found).

## Project Structure
```
├── index.js                 # Main entry point
├── src/
│   ├── routes/
│   │   └── dashboard.js     # Express routes
│   └── services/
│       └── dataService.js   # Data access layer
├── views/
│   └── dashboard.ejs        # Dashboard template
├── public/
│   └── styles.css          # Styling
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

## KPIs Displayed

1. Total Revenue (Weekly)
2. Average Trip Distance
3. Night Trip Percentage
4. Average Fare
5. Weekly Trip Volume by Borough

## Deployment

Deployed on Railway: [NYC-Taxi-Company-KPI.thanhphongle.net](https://NYC-Taxi-Company-KPI.thanhphongle.net)

## Contributing

1. Create feature branch from `develop`
2. Make changes
3. Run `pre-commit run --all-files`
4. Submit PR to `develop`

## License

ISC
