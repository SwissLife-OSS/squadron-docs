---
id: basic-concept
title: Basic Concept
sidebar_label: Basic Concept
---

Each service provides a _Resource_ class which can be use to interact with it. Using xUnit you can access the _Resource_ by implementing `IClassFixture<>` or `ICollectionFixture<>` and inject in into test class constructor.

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

Behind a _Resource_ can be a container or a cloud service. Those are the two concept on which Squadron is based:

## 1. Container Providers

For a single _Resource_ it will be created only one container per test Fixture.

On the first test run the corresponding container image will be downloaded. Squadron is fully managing the life cycle of the container by creating and removing it.

A liveness probe is also implemented to be sure that the service started correctly.

## 2. Cloud Providers

A _Resource_ can also manage a cloud service if there is no container possibility.

> Always use dedicated test resource.
