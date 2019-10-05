---
id: basic-concept
title: Basic Concept
sidebar_label: Basic Concept
---
Each service provides a *Resource* class which can be use to interact with it. Using xUnit you can access the *Resource* by implementing `IClassFixture<>` and inject in into test class constructor.
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

Behind a *Resource* can be a container or a cloud service. Those are the two concept on which Squadron is based:

## 1. Container Providers
For a single *Resource* it will be created only one container per test class.

On the first test run the corresponding container image will be downloaded. Squadron is fully managing the life cycle of the container by creating and removing it.

A liveness probe is also implemented to be sure that the service started correctly.

## 2. Cloud Providers
A *Resource* can also manage a cloud service if there is no container possibility.

> Always use a dedicated test resource.