---
id: introduction
title: Introduction
sidebar_label: Introduction
---

Squadron is a infrastructure framework which helps you to run tests against application dependent services. There are two concept on which Squadron is based:

1. Container Providers
2. Cloud Providers

## Container Providers

This are providers for services which can run in a container. This offers full isolation on the build server or on local machine.

> Container Providers requirers Docker to be installed.

The following container providers are available:

| Name                            | Docker image                                                                                                                   | Driver                                                                                    |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------- |
| [MongoDB](mongodb.md)           | [mongo:latest](https://hub.docker.com/_/mongo)                                                                                 | [2.9.2](https://www.nuget.org/packages/MongoDB.Driver/2.9.0)                              |
| [MS SQL](sqlserver)             | [microsoft/mssql-server-linux:latest](https://hub.docker.com/r/microsoft/mssql-server-linux)                                   | .NET Core                                                                                 |
| [PostgreSQL](postgresql)        | [postgres:latest](https://hub.docker.com/_/postgres)                                                                           | [Npgsql 4.1.1](https://www.nuget.org/packages/Npgsql/4.1.1)                               |
| [Elastic search](elasticsearch) | [docker.elastic.co/elasticsearch/elasticsearch:6.6.0](https://www.elastic.co/guide/en/elasticsearch/reference/6.6/docker.html) | [NEST 6.0.2](https://www.nuget.org/packages/NEST/6.0.2)                                   |
| [RabbitMQ](rabbitmq.md)         | [rabbitmq:3](https://hub.docker.com/_/rabbitmq)                                                                                | [RabbitMQ.Client 5.1.1](https://www.nuget.org/packages/RabbitMQ.Client/5.1.1)             |
| [Redis](redis.md)               | [redis:latest](https://hub.docker.com/_/redis)                                                                                 | [StackExchange.Redis 2.0.601](https://www.nuget.org/packages/StackExchange.Redis/2.0.601) |

You can always overwrite the used container image using [container options](container-options.md)

## Cloud Providers

This are providers which abstracts any cloud service. A variety of services which doesn't support containerization can be implemented as Cloud Provider.

The following Azure cloud resources are available

| Name       | Service                                                                    | Driver                                                                   |
| ---------- | -------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| ServiceBus | [Azure ServiceBus](https://azure.microsoft.com/en-us/services/service-bus) | [4.0.0](https://www.nuget.org/packages/Microsoft.Azure.ServiceBus/4.0.0) |

## Quick start

To [get started](quickstart.md), we have prepared examples for each service step by step.
Also you can find samples in our [samples repo](https://github.com/SwissLife-OSS/squadron/tree/master/src/samples).

## Basic Concept

To understand who this is working and what Squadron is doing "behind the scenes", we have prepared a short description of our framework.

[Basic Concepts](basic-concept.md)
