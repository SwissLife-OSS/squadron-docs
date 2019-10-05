---
id: elasticsearch-getstarted
title: Elasticsearch - Get Started
sidebar_label: Get Started
---

## Install:
Install the Squadron nuget package for Elasticsearch within your test project:

```bash
dotnet add package Squadron.Elasticsearch
```

## Access:
Inject ElasticsearchResource into your test class constructor:

```csharp
public class AccountRepositoryTests
    : IClassFixture<ElasticsearchResource>
{
    private readonly ElasticsearchResource _elasticsearchResource;

    public AccountRepositoryTests(
        ElasticsearchResource elasticsearchResource)
    {
        _elasticsearchResource = elasticsearchResource;
    }
}
```

## Use:
Use ElasticsearchResource to create a database and initialize your repository:

```csharp
[Fact]
public async Task CreateAccount_AccountExists()
{
    // arrange
    var accountRepository = new AccountRepository(_elasticsearchResource.Client);
    var account = new Account();

    // act
    var addedAccount = accountRepository.Add(account);

    // assert
    Snapshot.Match(addedAccount);
}
```