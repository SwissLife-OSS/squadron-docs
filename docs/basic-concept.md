---
id: basic-concept
title: Basic Concept
sidebar_label: Basic Concept
---
There are two concept on which Squadron is based:

## 1. Container Providers
On the first test run the corresponding container image will be downloaded. Squadron is fully managing the life cycle of the container by creating and removing it. A liveness probe is also implemented to be sure that the service started correctly.

## 2. Cloud Providers
By connecting directly to cloud service Squadron is completely managing the resources created through the tests.

> Use a dedicated test resource.