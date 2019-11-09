---
id: postgresql
title: PostgreSQL
sidebar_label: PostgreSQL
---

## Install

Install the Squadron nuget package for [PostgreSQL](https://www.postgresql.org/) within your test project:

```bash
dotnet add package Squadron.PostgreSql
```

## Basic usage

Use PostgreSql resource to create a database and initialize the db schema

```csharp

public class UserRespositoryTests : IClassFixture<PostgreSql>
{
    private readonly PostgreSqlResource _resource;

    public UserRespositoryTests(PostgreSqlResource resource)
    {
        _resource = resource;
    }

    [Fact]
    public async Task UserRepository_Add_AddedUser()
    {
        //arrange
        var initScript = File.ReadAllText("InitDatabase.sql");
        await _resource.CreateDatabaseAsync(_dbName);
        await _resource.RunSqlScriptAsync(initScript, _dbName);

        IConfiguration config = BuildInMemoryConfiguration();

        var user = new User
        {
            Id = "A1",
            Name = "John",
            Email = "john@squadron.io"
        };

        var repo = new UserRespository(config);

        //act
        await repo.AddAsync(user);

        //assert
        User createdUser = await GetUserAsync(user.Id);
        createdUser.Should().BeEquivalentTo(user);
    }
}

```

More samples are available in our [samples repo](https://github.com/SwissLife-OSS/squadron/tree/master/src/samples/postgresql)

## Create Database

Use `CreateDatabase("myName")` to create a new database on the resource.

> Note that the resource keeps the same for the defined Ficture. You may need to create a separate database for each test to not conflict with other tests

## Initialize

In most cases you'll need to initialize the database with an initial schema and seeded data.

Use `RunSqlScriptAsync()` to initialize you database.

```csharp
var initScript = File.ReadAllText("InitDatabase.sql");
await _resource.CreateDatabaseAsync("samples");
await _resource.RunSqlScriptAsync(initScript, "samples")
```
