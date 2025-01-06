### ReadMe

## Project Overview

The **Key Account Management System** streamlines the workflow of Key Account Managers (KAMs). It enables efficient lead tracking, contact management, interaction recording, call planning, and performance monitoring for large restaurant accounts. Built with modern technologies, this system ensures scalability, reliability, and ease of use.

---

## System Requirements

Ensure you have the following installed to run this project:

- **Node.js** (v16.0 or later)
- **npm** (v7.0 or later)
- **PostgreSQL** (v13 or later)
- A **Clerk** account for authentication setup
- **Vercel CLI** (optional, for deployment)

---

## Installation Instructions

1. Clone the repository:
   ```bash
   git clone https://github.com/Ujjwal-123M/KAM-Udaan.git
   cd KAM-Udaan
   ```
2. Install project dependencies:
   ```bash
   npm install
   npm install drizzle-kit
   ```

---

## Running Instructions

1. Start the development server:
   ```bash
   npm run dev
   ```
2. Push database schema changes (if applicable):
   ```bash
   npx drizzle-kit push
   ```
3. Open the Drizzle Studio for database management:
   ```bash
   npx drizzle-kit studio
   ```
4. Access the application in your browser at:
   - **Local**: `http://localhost:3000`
   - **Production**: `https://kam-udaan-ujjwal-project-ar3v0763k.vercel.app/`

---

## Test Execution Guide

Test the following functionalities:

- Add new leads and verify their information is saved correctly.
- Add multiple Points of Contact (POCs) for a single lead and ensure they are displayed accurately.
- Record interactions, including calls and orders, and view them under recent interactions.
- Verify that leads requiring calls today are displayed under the "Call Planning" section.
- Monitor account performance and check for high-performing or underperforming accounts.

---

## API Documentation

### Authentication

- **Endpoint**: `/api/auth`  
  Handles user authentication using Clerk.

### Lead Management

- **GET /api/leads**: Retrieve all leads.
- **POST /api/leads**: Add a new lead.

### Contact Management

- **GET /api/contacts/:leadId**: Retrieve all POCs for a specific lead.
- **POST /api/contacts**: Add a new POC.

### Interaction Tracking

- **GET /api/interactions/:leadId**: Retrieve interactions for a specific lead.
- **POST /api/interactions**: Record a new interaction.

### Call Planning

- **GET /api/call-planning**: Get leads requiring calls today.

### Performance Tracking

- **GET /api/performance**: Fetch performance data for all accounts.

---

## Sample Usage Examples

1. **Adding a Lead**:  
   Navigate to the "Leads" section and fill out the required details to add a new restaurant lead.
2. **Adding Multiple Contacts**:  
   Go to a specific lead's profile and add multiple POCs, specifying their roles and contact information.
3. **Tracking Interactions**:  
   Log a call or order under a lead's interaction history and view it in the recent interactions section.
4. **Video Demonstration**:  
   A recorded video is available, showcasing how to use the application effectively.
