---
id: generic-container
title: Generic
sidebar_label: Generic
---

Using the GenericResource you can run any Docker container you want to run a test.

## Install

Install the Squadron nuget package within your test project:

```bash
dotnet add package Squadron.Core
```

## Basic Usage

In the sample here we'll create a [httpbin](http://httpbin.org/) container so that we can send "real"
http requests so that we can test `DelegatingHandler`.

1. Create an Options class and define your container options be overriding the `Configure()` method.

```csharp
public class HttpBinWebServerOptions : GenericContainerOptions
{
    public override void Configure(ContainerResourceBuilder builder)
    {
        base.Configure(builder);
        builder
            .Name("http-bin")
            .InternalPort(80)
            .Image("kennethreitz/httpbin");
    }
}
```

2. Use GenericResource in you test.

```csharp
[Fact]
public async Task Send_WithHandler_HeaderSent()
{
    //arrange
    var handler = new XtraHeadersDelegateHandler();
    var client = new HttpClient(handler);
    client.BaseAddress = _genericContainer.GetContainerUri();

    //act
    HttpResponseMessage response = await client.GetAsync("headers");

    //assert
    string json = await response.Content.ReadAsStringAsync();
    Dictionary<string, object> echoedHeaders = GetHeadersFromJson(json);
    echoedHeaders.Should().ContainKey("x-fancy");
}
```

## Access resource

To gain access to the resource you can use the `Address` property.
Additionally, for containers which expose an http endpoint you can also use `GetContainerUri()`

```csharp
string address = _genericContainer.Address.Address;
int port = _genericContainer.Address.Port;

Uri uri = _genericContainer.GetContainerUri("http");
```

## Readyness Check

By default Squadron will do a TCP readyness check to probe for container readyness.
You can also switch to a Http based check or provide your own.

### HttpStatus Checker

```csharp
public override void Configure(ContainerResourceBuilder builder)
{
    ...
    ConfigureHttpStatusChecker("status/200");
}
```

### Custom Status Checker

```csharp
public class HttpBinWebServerOptions : GenericContainerOptions
{
    public override void Configure(ContainerResourceBuilder builder)
    {
        ...
        ConfigureStatusChecker(async (address, CancellationToken) =>
        {
            //Do your status check here
            string containerAddress = address.Address;
            int port = address.Port;
            return new Status
            {
                IsReady = true
            };
        });
    }
}
```

More samples are available in our [samples repo](https://github.com/SwissLife-OSS/squadron/tree/master/src/samples/GenericResource).
