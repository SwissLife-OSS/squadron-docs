---
id: mongodb-getstarted
title: MongoDB - Get Started
sidebar_label: Get Started
---

## Install:
Install the Squadron nuget package for MongoDB within your test project:

```bash
dotnet add package Squadron.Mongo
```

## Access:
Inject the MongoResource into your test class constructor:

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
}
```

## Use:
Use MongoResources to create a database and initialize your repository:

```csharp
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
    Snapshot.Match(addedAccount);
}
```