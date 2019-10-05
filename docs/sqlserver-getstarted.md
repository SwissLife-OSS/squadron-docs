---
id: sqlserver-getstarted
title: SQL Server - Get Started
sidebar_label: Get Started
---

## Install:
Install the Squadron nuget package for SqlServer within your test project:

```bash
dotnet add package Squadron.SqlServer
```

## Access:
Inject the provided resource into your test class constructor:

```csharp
public class AccountRepositoryTests
    : IClassFixture<SqlServerResource>
{
    private readonly SqlServerResource _sqlServerResource;

    public AccountRepositoryTests(
        SqlServerResource sqlServerResource)
    {
        _sqlServerResource = sqlServerResource;
    }
}
```

## Use:
```csharp
[Fact]
public async Task CreateAccount_AccountExists()
{
    // arrange
    string sqlFile = Path.Combine("Resources", "CreateEmpty.sql");
    string databaseName = "Accounts";
    var connectionString = await _sqlServerResource
        .CreateDatabaseAsync(sqlFile, databaseName);
    _accountRepository = new AccountRepository(connectionString);
    var account = new Account();

    // act
    var addedAccount = _accountRepository.Add(account);

    // assert
    Snapshot.Match(addedAccount);
}
```