---
id: configuration
title: Configuration
sidebar_label: Configuration
---

For basic container test no configuration is required.

You'll need to provide your configuration for the
following scenarios:

1. Use custom container registry which requires authentication
2. Use an Azure Cloud resource
3. Override defaults

Configuration are loaded using the built in .NET Core configuration system.
The default provider will use the resolve the configurations using the following order:

1. `appsettings.json`
2. `appsettings.user.json` (Usually excluded using .gitgnore)
3. Environment variables

You can always provide your own [configuration resolver](configuration.md#custom-resolver) when required.

## Container configuration

```json
{
  "Squadron": {
    "Docker": {
      "Registries": [
        {
          "Name": "samples",
          "Address": "squadron-samples.azurecr.io",
          "Username": "admin",
          "Password": "donttellanyone"
        }
      ]
    }
  }
}
```

## Azure Cloud configuration

```json
{
  "Squadron": {
    "Azure": {
      "SubscriptionId": "ac78e464-c99d-462f-a617-c29975c59e1c",
      "ResourceGroup": "squadron-samples",
      "DefaultLocation": "switzerlandnorth",
      "Credentials": {
        "TenantId": "b6677038-5309-4040-a59e-2efa08c65e41",
        "ClientId": "7106b86f-dcc0-4e55-98c0-a0ffc112bf3a",
        "Secret": "SECRET"
      }
    }
  }
}
```

> To keep sensitive data outside your `appsettings.json` you can also use environment variables which
> you then set on you build server.

Examples:

```bash
export Squadron.Docker.Registries.0.Password=donttellanyone
export Squadron.Azure.Credentials.Secret=SECRET
```

In Windows use `set` instead of `export`

## Custom resolver

In case you require a different way to resolve the configurations you can use the options on the
resource to set your custom resolver.

```csharp
public class SampleAppResourceOptions : GenericContainerOptions
{
    public override void Configure(ContainerResourceBuilder builder)
    {
        base.Configure(builder);
        builder
            .Name("sample")
            .InternalPort(4200)
            .Image("sqaudron-samples.azurecr.io/testapp:latest")
            .Registry("sqaudron-samples")
            .SetDockerConfigResolver(ResolveDockerConfig);
    }

    public DockerConfiguration ResolveDockerConfig()
    {
        DockerConfiguration config = LoadFromFanyConfigSource();
        return config;
    }
}
```
