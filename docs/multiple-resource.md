---
id: multi
title: Multiple resources
sidebar_label: Multiple resources
---

Sometimes your tests will depend on more than one resource, then you have the following options:

1. Inject multiple `Fixtures` into you test class

```csharp
public class UserRespositoryTests :
    IClassFixture<MongoResource>,
    IClassFicture<AzureStorageBlobResource>
{
    private readonly MongoResourceResource _mongoResource;
    private readonly AzureStorageBlobResource _azureBlobResource;

    public UserRespositoryTests(
        MongoResource mongoResource,
        AzureStorageBlobResource azureBlobResource)
    {
        _mongoResource = mongoResource;
        _azureBlobResource = azureBlobResource
    }
}
```

2. Use a [compose resource](compose.md)

Using a compose resources is required in case you have dependencies between your resources.

> Compose resource is only availlable for container based resources at the moment.
