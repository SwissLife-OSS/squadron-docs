---
id: mongodb
title: MongoDB
sidebar_label: MongoDB
---

The [MongoDB](https://www.mongodb.com/) resource uses a single node docker container.

## Install

Install the Squadron nuget package Mongo for within your test project:

```bash
dotnet add package Squadron.Mongo
```

## Basic usage

Inject the MongoResource into your test class constructor:

```csharp
public class UserRepositoryTests : IClassFixture<MongoResource>
{
    private readonly MongoResource _mongoResource;

    public UserRepositoryTests(MongoResource mongoResource)
    {
        _mongoResource = mongoResource;
    }

    [Fact]
    public async Task UserRepository_Add_AddedUser()
    {
        //arrange
        var user = User.CreateSample();
        IMongoDatabase db = _mongoResource.CreateDatabase();
        var repo = new UserRepository(db);

        //act
        await repo.AddAsync(user);

        //assert
        User createdUser = await GetUserAsync(db, user.Id);
        createdUser.Should().BeEquivalentTo(user);
    }
}
```

## Create database

Use `CreateDatabase()` to create a database with a random name.

## Create collection from file

You can create a collection from an collection exported using [mongoexport](https://docs.mongodb.com/manual/reference/program/mongoexport/)

```csharp
IMongoDatabase db = _mongoResource.CreateDatabase();
var options = new CreateCollectionFromFileOptions
{
    CollectionOptions = new CreateCollectionOptions
    {
        CollectionName = "users"
    },
    File = new FileInfo("users.json")
};

IMongoCollection<User> col = await _mongoResource
    .CreateCollectionFromFileAsync<User>(db, options);
```

More samples are available in our [samples repo](https://github.com/SwissLife-OSS/squadron/tree/master/src/samples/mongo).
