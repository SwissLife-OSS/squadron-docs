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

## Global environment variables

You can define environment variables that will be exported in every container.

```csharp
public override void Configure(ComposeResourceBuilder builder)
{
    builder.AddGlobalEnvironmentVariable("FOO", "BAR");
    ...
}
```
