---
id: compose
title: Compose
sidebar_label: Compose
---

A compose resource can be used to write integration tests where more then one container is required.
In a compose resource you can also define dependencies between the resources so that
environment variables of linked resources are injected into the container.
You can use all container resources including the [generic resource ](generic-container.md) to
build a test environment.

Using Docker networks is not supported a the moment but it is on the roadmap.

## Install

Install the Squadron nuget package for compose within your test project:

```bash
dotnet add package Squadron.Compose
```

## Basic Usage

1. Compose your test environment

```csharp
public class FrontEndApp : GenericContainerOptions
{
    public override void Configure(ContainerResourceBuilder builder)
    {
        base.Configure(builder);
        builder
            .Name("frontend")
            .InternalPort(80)
            .Image("nginx");
    }
}

public class GraphQLApi : GenericContainerOptions
{
    public override void Configure(ContainerResourceBuilder builder)
    {
        base.Configure(builder);
        builder
            .Name("graphql")
            .InternalPort(80)
            .Image("mcr.microsoft.com/dotnet/core/aspnet:3.0");
    }
}

public class MongoDb : MongoDefaultOptions { }

public class TodoAppOptions : ComposeResourceOptions
{
    public override void Configure(ComposeResourceBuilder builder)
    {
        builder.AddContainer<MongoDb>("db");
        builder.AddContainer<GraphQLApi>("api")
                .AddLink("mongo", new EnvironmentVariableMapping(
                            "Sample:Database:ConnectionString",
                            "#CONNECTIONSTRING#"
                            ));

        builder.AddContainer<FrontEndApp>("ui")
                .AddLink("api", new EnvironmentVariableMapping(
                            "Sample:Api:Url", "#HTTPURL#"
                            ));
    }
}
```

2. Use your composed app in a integration test.

```csharp
public class TodoApplicationTests : IClassFixture<ComposeResource<TodoAppOptions>>
{
    private readonly ComposeResource<TodoAppOptions> _composeResource;

    public TodoApplicationTests(ComposeResource<TodoAppOptions> composeResource)
    {
        _composeResource = composeResource;
    }

    [Fact]
    public async Task OpenFrontend_Ok()
    {
        GenericContainerResource<FrontEndAppOptions> frontEnd = _composeResource
            .GetResource<GenericContainerResource<FrontEndAppOptions>>("ui");

        var client = new HttpClient
        {
            BaseAddress = frontEnd.GetContainerUri()
        };

        HttpResponseMessage frontResponse = await client.GetAsync("/");
        frontResponse.StatusCode.Should().Be(HttpStatusCode.OK);
    }
}
```

## Access to resource

You can access all resources using the `GetResource<>()` and the registered `Name`.

```csharp
MongoResource mongo = _composeResource.GetResource<MongoResource>("db");
```

## Access inbetween resources

You can connect the resources with each other by adding them to the same network. </br>
Let's enhance our first example with that:
```csharp
builder
    .Name("frontend")
    .InternalPort(80)
    .Image("nginx");
    .AddNetwork("demo-network")

...

builder
    .Name("graphql")
    .InternalPort(80)
    .ExternalPort(9090)
    .Image("mcr.microsoft.com/dotnet/core/aspnet:3.0");
    .AddNetwork("demo-network")
```
You can now add a link from the frontend to the backend by replacing the `HTTPURL` in the 
addLink(...) with `HTTPURL_INTERNAL`. 

```csharp
builder.AddContainer<FrontEndApp>("ui")
    .AddLink("api", new EnvironmentVariableMapping(
        "Sample:Api:Url", "#HTTPURL_INTERNAL#"
    ));
```

For more information about the exports, see next topic.

## Compose exports

Every container that is built with Squadron compose exports the following variables:

`HTTPURL` --> The Url to access the container from the host </br>
`HTTPSURL` --> Same as the first export, but HTTPS </br>
`HTTPURL_INTERNAL` --> The Url to access the container from inside a docker network (see topic: _Access inbetween resources_)

`HTTPURL` might look something like 'http://localhost:9090' in the upper example, while `HTTPURL_INTERNAL` will look more like 'http://squa_graphql_637327357326593912_a46d83475baadabd9938a281bc:80', which allows access from inside a docker network.

Those exports are useful for usage in `addLink(...)`, in this way you can connect your containers with each other.

In several modules of Squadron, such as Squadron.MongoDB, there can be more exports defined.
As example in MongoDB you can access `CONNECTIONSTRING` or `CONNECTIONSTRING_INTERNAL`.
Check the module documentation for further information!

## Global environment variables

You can define environment variables that will be exported in every container.

```csharp
public override void Configure(ComposeResourceBuilder builder)
{
    builder.AddGlobalEnvironmentVariable("FOO", "BAR");
    ...
}
```
