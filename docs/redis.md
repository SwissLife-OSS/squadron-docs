---
id: redis
title: Redis
sidebar_label: Redis
---

A Redis resource using the [StackExchange](https://stackexchange.github.io/StackExchange.Redis/) driver.

## Install

Install the Squadron nuget package for [Redis](https://redis.io/) within your test project:

```bash
dotnet add package Squadron.Redis
```

## Basic usage

```csharp
public class UserCacheTests : IClassFixture<RedisResource>
{
    private readonly RedisResource _redisResource;

    public UserCacheTests(RedisResource redisResource)
    {
        _redisResource = redisResource;
    }

    [Fact]
    public void Add_AddedUserIsEquivalent()
    {
        //arrange
        var user = User.CreateSample();
        ConnectionMultiplexer connection = _redisResource.GetConnection();
        var repo = new UserCache(connection);

        //act
        repo.Add(user);

        //assert
        User cachedUser = GetUserFromCache(user.Id);
        cachedUser.Should().BeEquivalentTo(user);
    }
}
```

More samples are available in our [samples repo](https://github.com/SwissLife-OSS/squadron/tree/master/src/samples/redis)
