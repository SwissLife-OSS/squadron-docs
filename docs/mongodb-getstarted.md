---
id: mongodb-getstarted
title: MongoDB - Get Started
sidebar_label: Get Started
---

As getting started we've prepared a simple example how to use Squadron with *MongoDB*.

## Install:
Install the Squadron nuget package for MongoDB (or other supported service) within your test project:

```bash
dotnet add package Squadron.Mongo
```

## Access:
Inject the provided resource into your test class constructor:

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

## Use:
```csharp
[Fact]
public void CreateAccount_AccountExists()
{
    // arrange
    var database = mongoResources.CreateDatabase();
    _accountRepository = new AccountRepository(database);
    var account = new Account();

    // act
    var addedAccount = _accountRepository.Add(account);

    // assert
    Snapshot.Match(addedAccount);
}
```