---
id: quickstart
title: Quickstart
sidebar_label: Quickstart
---

1. Make sure that you have [Docker](https://docs.docker.com/docker-for-windows/)
   installed on your machine.

2. Create a xUnit test project and install one of the available squadron packages.

| Provider                                      | Package                         |
| --------------------------------------------- | ------------------------------- |
| [Mongo](mongodb.md)                           | `Squadron.MongoDb`              |
| [Mongo Replica Set](mongodb-rs.md)            | `Squadron.MongoDb`              |
| [SQL Server](sqlserver.md)                    | `Squadron.SqlServer`            |
| [Elastic Search](elasticsearch.md)            | `Squadron.ElasticSearch`        |
| [PostgreSQL](postgresql.md)                   | `Squadron.PostgreSql`           |
| [Redis](redis.md)                             | `Squadron.Redis`                |
| [RabbitMQ](rabbitmq.md)                       | `Squadron.RabbitMQ`             |
| [Azure Storage](azure-storage.md)             | `Squadron.AzureStorage`         |
| [Azure ServiceBus](azure-cloud-servicebus.md) | `Squadron.AzureCloudServiceBus` |
| [Generic](generic-container.md)               | `Squadron.Core`                 |
| [Compose](compose.md)                         | `Squadron.Compose`              |

3. Use the resource in a `IClassFicture<>` to write you tests.

```csharp
public class AccountRepositoryTests
    : IClassFixture<MongoResource>
{
    private readonly MongoResource _mongoResource;

    public AccountRepositoryTests(
        MongoResource mongoResource)
    {
        _mongoResource = mongoResource;
    }

    [Fact]
    public void CreateAccount_AccountExists()
    {
        // arrange
        var database = _mongoResource.CreateDatabase();
        var accountRepository = new AccountRepository(database);
        var account = new Account();

        // act
        var addedAccount = accountRepository.Add(account);

        // assert
        addedAccount.Should().NotBeNull();
    }
}
```
