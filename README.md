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

2. Authenticate with your HubSpot account:
   ```bash
   hs auth
   ```

3. Navigate to a specific project directory and install dependencies:
   ```bash
   cd record-audit-tracker
   npm install
   ```

4. Upload the project to HubSpot:
   ```bash
   hs upload
   ```

## Development

Each project contains its own configuration and dependencies. See individual project README files for specific setup instructions.

## Structure

- `record-audit-tracker/` - Record audit tracking custom card
- `test-project/` - Sample HubSpot custom UI project
- `hubspot.config.yml` - Global HubSpot configuration

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file in each project directory for details. 