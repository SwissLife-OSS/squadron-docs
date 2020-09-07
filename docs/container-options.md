---
id: container-options
title: Container Options
sidebar_label: Container Options
---

Default container options are always provided by to resource implementation. You can overwrite
options by creating a new options class and override the `configure()` method.

Example to overwrite image tag for a Redis resource to use an alpine image

> We have tested the containers tags using the driver version and default options.
> When overriding these options it is your responsibility to ensure that tag and driver versions are compatible.

```csharp
public class RedisSpecialTagOptions : RedisDefaultOptions
{
    public override void Configure(ContainerResourceBuilder builder)
    {
        base.Configure(builder);
        builder.Tag("alpine")
    }
}
```

And use the custom resource in your test

```csharp
    public class RedisSpecialTagTests : IClassFixture<RedisResource<RedisSpecialTagOptions>>
    {
        private readonly RedisResource<RedisSpecialTagOptions> _redisResource;

        public RedisSpecialTagTests(RedisResource<RedisSpecialTagOptions> redisResource)
        {
            _redisResource = redisResource;
        }
    }
```

The following options can be configured

| Property     | Description                                                                                                                                                            | Example   |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- |
| Image        | Docker image with or without tag                                                                                                                                       | mongo:4.0 |
| Tag          | Docker image tag                                                                                                                                                       | alpine    |
| InternalPort | Internal port inside the container                                                                                                                                     | 27017     |
| ExternalPort | External not be defined whenever possible to avoid conflicts, when no port is defined a dynamic free port will be allocated                                             | 443       |
| Registry     | The name of a docker registry which will be used to pull the container. Default is Docker Hub, custom registries must be defined in [configuration](configuration.md). | MyPrivate |
| WaitTimeout  | The time to wait until a container is ready. Default is 30 seconds                                                                                                     | 60        |
| AddNetwork   | The base name of the network, of which the container should be part of (used to connect multiple containers)                                                           | demo-network |
| PreferLocal  | This option makes sure, that Squadron will search and use local images if available, before pulling them from a registry                                               | (no params) |
