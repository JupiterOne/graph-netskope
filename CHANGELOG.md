# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Ingest new entities
  - `netskope_tenant`
  - `netskope_device`
  - `netskope_user`
  - `netskope_user_configuration`
  - `netskope_app_instance`
- Build new relationships
  - `netskope_tenant_has_device`
  - `netskope_device_has_user`
  - `netskope_user_has_configuration`
  - `netskope_tenant_has_app_instance`
