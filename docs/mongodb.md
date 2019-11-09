---
id: mongodb
title: MongoDB
sidebar_label: MongoDB
---

The Mongo resource uses a sigle node docker container.

## Install

Install the Squadron nuget package for [MongoDB](https://www.mongodb.com/) within your test project:

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

More samples are available in our [samples repo](https://github.com/SwissLife-OSS/squadron/tree/master/src/samples/mongo)
