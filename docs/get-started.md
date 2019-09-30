---
id: get-started
title: Get Started
sidebar_label: Get Started
---

As getting started we've prepared a simple example how to use Squadron with *MongoDB*.

## Install Nuget Package:
Install the Squadron nuget package for MongoDB (or other supported service) within your test project:

```bash
dotnet add package Squadron.Mongo
```

## Use provided resource:
Inject the provided resource into your test class constructor and initialize your repository or service:

```csharp
public class AccountRepositoryTests
 : IClassFixture<MongoResource>
{
    private readonly IAccountRepository _accountRepository;

    public AccountRepositoryTests(
        MongoResources mongoResources)
    {
        var database = mongoResources.CreateDatabase();
        _accountRepository = new AccountRepository(database);
    }
}
```

## Use repository in your test:
```csharp
[Fact]
public void CreateAccount_AccountExists()
{
    // arrange
    var account = new Account();

    // act
    var addedAccount = _accountRepository.Add(account);

    // assert
    Snapshot.Match(addedAccount);
}
```