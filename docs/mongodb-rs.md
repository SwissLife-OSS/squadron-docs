---
id: mongodb-rs
title: MongoDB Replica Set
sidebar_label: MongoDB Replica Set
---

The [MongoDB Replica Set](https://docs.mongodb.com/manual/tutorial/deploy-replica-set/) is derived
from the [Mongo](mongodb.md) resource but additionally Replica Set.
Some features like [Transactions](https://docs.mongodb.com/manual/core/transactions/) and
[Change Streams](https://docs.mongodb.com/manual/changeStreams/) require a Replica Set to work.

## Install

Install the Squadron nuget package Mongo for within your test project:

```bash
dotnet add package Squadron.Mongo
```

## Basic usage

Inject the MongoReplicaSetResource into your test class constructor:

```csharp
public class UserRepositoryWithTransactionTests
    : IClassFixture<MongoReplicaSetResource>
{
    private readonly MongoReplicaSetResource _mongoRsResource;

    public UserRepositoryWithTransactionTests(MongoReplicaSetResource mongoRsResource)
    {
        _mongoRsResource = mongoRsResource;
    }

    [Fact]
    public async Task AddUserAndAddAudit_Commit_RecordsExists()
    {
        //arrange
        var user = User.CreateSample();
        var audit = UserAudit.CreateSample(user.Id);

        IMongoDatabase db = _mongoRsResource.CreateDatabase();
        await db.CreateCollectionAsync("users");
        await db.CreateCollectionAsync("audit");

        using (IClientSessionHandle session =
            await _mongoRsResource.Client.StartSessionAsync() )
        {
            var repo = new UserRepositoryWithTransaction(db);
            session.StartTransaction();

            //act
            await repo.AddAsync(user, session);
            await repo.AddAuditAsync(audit, session);

            await session.CommitTransactionAsync();
        }


        //assert
        User createdUser = await GetUserAsync(db, user.Id);
        createdUser.Should().BeEquivalentTo(user);

        UserAudit createdAudit = await GetUserAuditAsync(db, audit.Id);
        createdAudit.Should().BeEquivalentTo(audit);
    }
}
```

> When using transaction in mongo you need to create the collection prior starting a transaction.

More samples are available in our [samples repo](https://github.com/SwissLife-OSS/squadron/tree/master/src/samples/mongo).
