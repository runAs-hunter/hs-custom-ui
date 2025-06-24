# HubSpot Custom UI Projects

This repository contains custom UI projects for HubSpot, including custom cards, extensions, and serverless functions.

## Projects

### Record Audit Tracker
A HubSpot custom card that tracks and displays audit information for records.

### Test Project
A sample project demonstrating HubSpot custom UI development.

## Getting Started

1. Install the HubSpot CLI:
   ```bash
   npm install -g @hubspot/cli
   ```

2. Set up your HubSpot configuration:
   ```bash
   # Copy the example configuration file
   cp hubspot.config.yml.example hubspot.config.yml
   
   # Edit the file with your HubSpot credentials
   # You'll need to get these from your HubSpot developer account
   ```

3. Authenticate with your HubSpot account:
   ```bash
   hs auth
   ```

4. Navigate to a specific project directory and install dependencies:
   ```bash
   cd record-audit-tracker
   npm install
   ```

5. Upload the project to HubSpot:
   ```bash
   hs upload
   ```

## Configuration

The `hubspot.config.yml.example` file shows the structure needed for your HubSpot configuration. You'll need to:

1. Replace `YOUR_PORTAL_ID` with your HubSpot portal ID
2. Replace `YOUR_ACCESS_TOKEN` with your HubSpot access token
3. Replace `YOUR_PERSONAL_ACCESS_KEY` with your HubSpot personal access key
4. Replace `YOUR_PARENT_ACCOUNT_ID` with your parent account ID (if applicable)

**Important**: Never commit your actual `hubspot.config.yml` file to version control as it contains sensitive credentials.

## Development

Each project contains its own configuration and dependencies. See individual project README files for specific setup instructions.

## Structure

- `record-audit-tracker/` - Record audit tracking custom card
- `test-project/` - Sample HubSpot custom UI project
- `hubspot.config.yml.example` - Example HubSpot configuration template

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file in each project directory for details. 