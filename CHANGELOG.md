# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

- Data syncing between Harmony apps running on two different machines via user account
- Timeline paging in BaaS network page
- Themeability
- Settings page overhaul
- Improved message handling - display more/better messages and errors in Harmony console
- OTA updates
- Homepage improvements
- Warning when no connections exist when creating an identity and option to create one
- Option to backup all workspaces at once
- Key generation using WASM from Rust code - JS implementation takes ~10s, Rust takes ~<2s (Requires testing)
- Contract editor improvements
- Terminal GUI for direct SSH/Shell access to servers
- Node management - Automate adding/removing nodes in an established but not yet asserted network
- Node management - Transaction signing/Node joining - Automated transaction signing process to enable new nodes to join an asserted network

## [1.5.0] - 2021-03-30

### Changed

- Fixed JSON views
- Improved Contract editor performance
- Upgraded Contract editor IntelliSense
- Upgraded Electron
- Upgraded Angular
- Upgraded other dependencies

## [1.4.0] - 2020-11-05

### Added

- BaaS (Blockchain as a Service)
  - Added blockchain management section
  - Dashboard - Displays overview of connected nodes including resource usage of select nodes and Activeledger stats
  - Network - Network configuration import and management
  - Network Builder - Network configuration creation
  - Nodes - Node management including installing Activeledger on a new server, more indepth stats, and log viewer

### Changed

- Upgraded Electron
- Upgraded Angular
- Upgraded other dependencies

### Fixed

- Dependency issues after Electron/Angular upgrade
- Issue with sidemenu full width but not showing text on first load
- Monaco editor autocomplete not working
