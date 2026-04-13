# AI Lead Generation Dashboard

A web-based dashboard that serves as the front-end control center for the AI Lead Machine Agent workflow. Users can configure lead generation campaigns, monitor pipeline status, view scraped company leads and decision-maker records, track outreach email statuses, export filtered data to CSV/Excel, and view a summary dashboard with key metrics.

## Features

- **Summary Dashboard**: View key metrics including total company leads, decision makers, emails sent, pending outreach, meetings created, and meeting conversion rate
- **Campaign Configuration**: Create new lead generation runs and manage existing campaigns
- **Company Leads**: Browse and export scraped company leads with search/filter functionality
- **Decision Makers**: View decision-maker records with filtering by status and meeting status
- **Outreach Status**: Monitor pending outreach email campaigns

## Prerequisites

- Node.js 18+ 
- npm or yarn
- Airtable API key

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and add your Airtable API key:
   ```
   VITE_AIRTABLE_API_KEY=your_airtable_api_key_here
   ```

## Running the Application

Start the development server:
```bash
npm run dev
```

The application will open at `http://localhost:3000`

## Build

To create a production build:
```bash
npm run build
```

## Project Structure

```
src/
├── components/
│   ├── Navbar.jsx          # Navigation component
│   └── Pagination.jsx      # Pagination component
├── pages/
│   ├── Dashboard.jsx       # Summary dashboard with metrics
│   ├── Campaigns.jsx       # Campaign configuration page
│   ├── CompanyLeads.jsx    # Company leads table
│   ├── DecisionMakers.jsx  # Decision makers table
│   └── OutreachStatus.jsx  # Outreach status overview
├── services/
│   ├── airtable.js         # Airtable API service
│   └── export.js           # CSV/Excel export utilities
├── styles/
│   └── App.css             # Global styles
├── App.jsx                 # Main app component
└── main.jsx                # Entry point
```

## Airtable Configuration

The application connects to the following Airtable tables:

- **Base ID**: `app1Ctf5UsDa2Ukxl`
- **Company Leads Table**: `tblzdOiL8ylQXATje`
- **Decision Makers Table**: `tbl9GD3EjWddWF3ci`
- **Role/Campaigns Table**: `tbldAg7DDd0wzrinm`

### Expected Field Names

**Company Leads Table:**
- Company Name
- Category
- Website
- Phone Number

**Decision Makers Table:**
- Person Name
- Email
- Company Name
- Type
- Personalized Email Content
- Status (Yes/No)
- Meeting (Not Created/Created/Cancelled)

**Role/Campaigns Table:**
- Company Name
- Location
- Number of Leads
- Status (Run/Done)

## Usage

### Creating a New Campaign

1. Navigate to the "Campaigns" page
2. Fill in the Company Name, Location, and Number of Leads
3. Click "Start Lead Generation Run"

### Managing Campaigns

- Edit campaign details by clicking the "Edit" button
- Mark a campaign as "Done" when processing is complete

### Exporting Data

Both Company Leads and Decision Makers pages support exporting to:
- CSV format
- Excel (.xlsx) format

Exports include all currently filtered records.

## License

ISC
