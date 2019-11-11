---
id: azure-cloud-servicebus
title: Azure ServiceBus
sidebar_label: ServiceBus
---

An [Azure ServiceBus](https://docs.microsoft.com/en-us/azure/service-bus/) resource can be used to write integration tests against `topics` and `queues`.

You can either use an existing ServiceBus namespace in Azure or let Squadron provision a new one for every test.

> Creating a namespace in Azure can take some minutes to complete.

## Install

Make sure you have completed the [setup steps](azure-cloud-setup.md) as described.

Install the Squadron nuget package Azure Cloud ServiceBus within your test project:

```bash
dotnet add package Squadron.AzureCloudServiceBus
```

## Basic Usage

1. Define your servicebus model by overriding the `Configure()` method on your options

```csharp
public class UserEventServiceBusOptions : AzureCloudServiceBusOptions
{
    public override void Configure(ServiceBusOptionsBuilder builder)
    {
        builder.Namespace("spc-a-squadron-sb01")
                .AddTopic("userevents")
                .AddSubscription("log", "Cmd = 'AddUser'");
    }
}
```

When a `Namespace` is defined using the builder then Squadron will use that existing namespace and
generate `topics` and `queues` with random names.
Otherwise a new namespace with a random name will be provisioned in your configured resource group.

2. Use the resource in your test.

```csharp
[Fact]
public async Task SendEvent_Received()
{
    // arrange
    var ev = new UserEvent()
    {
        Type = "USER_ADDED",
        UserId = "A1"
    };
    ITopicClient topicClient = _serviceBusResource.GetTopicClient("userevents");
    var broker = new UserEventBroker(topicClient);

    //act
    await broker.SendEventAsync(ev);

    //assert
    ISubscriptionClient subscriptionClient =
        _serviceBusResource.GetSubscriptionClient("userevents", "audit");

    var completion = new TaskCompletionSource<UserEvent>();

    subscriptionClient.RegisterMessageHandler((message, ct) =>
    {
        var json = Encoding.UTF8.GetString(message.Body);
        UserEvent ev = JsonSerializer.Deserialize<UserEvent>(json);
        completion.SetResult(ev);
        return Task.CompletedTask;

    }, new MessageHandlerOptions(ExceptionReceivedHandler));

    UserEvent reveivedEvent = await completion.Task;
    reveivedEvent.Should().BeEquivalentTo(ev);
}
```

## Access clients

The provisioned `topics`, `subscriptions` and `queues` can be accessed using the GetClient() methods.

### GetTopicClient

```csharp
ITopicClient topic = _serviceBusResource.GetTopicClient("foo");
```

### GetSubscriptionClient

```csharp
ISubscriptionClient subscriptionClient =
                _serviceBusResource.GetSubscriptionClient("userevents", "audit");
```

### GetQueueClient

```csharp
IQueueClient queueClient = _serviceBusResource.GetQueueClient("foo");
```

### ConnectionString

Access to ConnectionString which can be used for the servicebus client library.

```csharp
var topicClient = new TopicClient(
    _serviceBusResource.ConnectionString,
    "myTopic"
    );
```

## CreateTopicAsync

Create a new topic including subscriptions after the servicebus has been provisioned.

```csharp
await _serviceBusResource.CreateTopicAsync(builder =>
        {
            builder
                .Name("foo")
                .AddSubscription("bar", "Type = 'A'");
        });
```

More samples are available in our [samples repo](https://github.com/SwissLife-OSS/squadron/tree/master/src/samples/AzureCloudServiceBus)
