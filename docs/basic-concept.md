---
id: basic-concept
title: Basic Concept
sidebar_label: Basic Concept
---

Each service provides a _Resource_ class which can be use to interact with it. Using xUnit you can access the _Resource_ by implementing `IClassFixture<>` or `ICollectionFixture<>` and inject in into test class constructor.

```csharp
public class AccountRepositoryTests
    : IClassFixture<MongoResource>
{
    private readonly MongoResources _mongoResources;

    public AccountRepositoryTests(
        MongoResources mongoResources)
    {
        _mongoResources = mongoResources;
    }
}
```

Behind a _Resource_ can be a container or a cloud service. Those are the two concept on which Squadron is based:

## 1. Container Providers

For a single _Resource_ it will be created only one container per test Ficture.

On the first test run the corresponding container image will be downloaded. Squadron is fully managing the life cycle of the container by creating and removing it.

A liveness probe is also implemented to be sure that the service started correctly.

The following container providers are available

| Name                             | Docker image                                                                                 | Driver                                                       |
| -------------------------------- | -------------------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| [MongoDB](mongodb-getstarted.md) | [mongo:latest](https://hub.docker.com/_/mongo)                                               | [2.9.2](https://www.nuget.org/packages/MongoDB.Driver/2.9.0) |
| MS SQL                           | [microsoft/mssql-server-linux:latest](https://hub.docker.com/r/microsoft/mssql-server-linux) | .NET Core                                                    |
| PostgreSQL                       | postgres:latest                                                                              | [Npgsql 4.1.1](https://www.nuget.org/packages/Npgsql/4.1.1)  |
| Elastic search                   | docker.elastic.co/elasticsearch/elasticsearch:6.6.0                                          | NEST 6.0.2                                                   |
| RabbitMQ                         | rabbitmq:3                                                                                   | RabbitMQ.Client 5.1.1                                        |
| Redis                            | redis:latest                                                                                 | StackExchange.Redis 2.0.601                                  |

## 2. Cloud Providers

A _Resource_ can also manage a cloud service if there is no container possibility.

The following Azure cloud resources are available

| Name       | Service                                                                    | Driver                                                                   |
| ---------- | -------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| ServiceBus | [Azure ServiceBus](https://azure.microsoft.com/en-us/services/service-bus) | [4.0.0](https://www.nuget.org/packages/Microsoft.Azure.ServiceBus/4.0.0) |

> Always use dedicated test resource.
