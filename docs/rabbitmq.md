---
id: rabbitmq
title: RabbitMQ
sidebar_label: RabbitMQ
---

A [RabbitMQ](https://www.rabbitmq.com/) resource using the [RabbitMQ Client](https://github.com/rabbitmq/rabbitmq-dotnet-client)

## Install

Install the Squadron nuget package to your test project:

```bash
dotnet add package Squadron.RabbitMQ
```

## Basic usage
1. Create class that inherits from ContainerResourceOptions and override the Configure method. Here you 

```csharp
    public class RabbitMQDefaultOptions : ContainerResourceOptions
    {
        public override void Configure(ContainerResourceBuilder builder)
        {
            builder
                .Name("rabbit")
                .Image("rabbitmq:3")
                .WaitTimeout(60)
                .InternalPort(5672)
                .Username("guest")
                .Password("guest");
        }
    }
```
You can also use the above default configuration which is part of the Squadron.RabbitMQ package.

2. Create XUnit test method and implement the IClassFixture<T> interface with RabbitMQResource<Options> or RabbitMQResource that uses the default options. The resource is injected into constructor.

```csharp
    public class OrderBrokerTests : IClassFixture<RabbitMQResource<RabbitMQDefaultOptions>>
    {
        private readonly RabbitMQResource<RabbitMQDefaultOptions> _rabbitMQResource;

        public OrderBrokerTests(
            RabbitMQResource<RabbitMQDefaultOptions> rabbitMQResource)
        {
            _rabbitMQResource = rabbitMQResource;
        }

        [Fact]
        public async Task SendEvent_Received()
        {
            // arrange
            var ev = new OrderEvent()
            {
                ProductId = "Product 1",
                Price = 100.01m
            };

            IConnectionFactory connectionFactory = _rabbitMQResource.CreateConnectionFactory();
            var broker = new OrderEventBroker(connectionFactory);

            //act
            broker.SendEvent(ev);

            OrderEvent resultEvent = null;

            using IConnection connection = connectionFactory.CreateConnection();
            using IModel channel = connection.CreateModel();
            channel.QueueDeclare(
                OrderEventBroker.QueueName,
                false,
                false,
                false,
                null);

            BasicGetResult queueResult = channel.BasicGet(OrderEventBroker.QueueName, true);
            if (queueResult != null)
            {
                var json = Encoding.UTF8.GetString(queueResult.Body);
                resultEvent = JsonSerializer.Deserialize<OrderEvent>(json);
            }

            //assert
            resultEvent.Should().BeEquivalentTo(ev);
        }
    }
```
Below sample of publishing an event on a queue.

```csharp
    public class OrderEventBroker
    {
        public static string QueueName => "neworders";

        private readonly IConnectionFactory _connectionFactory;

        public OrderEventBroker(IConnectionFactory connectionFactory)
        {
            _connectionFactory = connectionFactory;
        }

        public void SendEvent(OrderEvent @event)
        {
            using IConnection connection = _connectionFactory.CreateConnection();
            using IModel channel = connection.CreateModel();
            channel.QueueDeclare(
                QueueName,
                false,
                false,
                false,
                null);

            channel.BasicPublish(
                string.Empty,
                QueueName,
                null,
                BuildMessage(@event));
        }

        private static byte[] BuildMessage(OrderEvent @event)
        {
            var json = JsonSerializer.Serialize(@event);
            var msg = Encoding.UTF8.GetBytes(json);
            return msg;
        }
    }
```
3. CreateConnectionFactory()
The method CreateConnectionFactory() will return the IConnectionFactory from RabbitMQ.Client that's used to create connections and channels.

The connection factory, connection and channel comes from the [RabbitMQ.Client](https://www.nuget.org/packages/RabbitMQ.Client) NuGet package. It's documentation and samples can be found here: [RabbitMQ](https://www.rabbitmq.com/tutorials/tutorial-three-dotnet.html).

More samples are available in our [samples repo](https://github.com/SwissLife-OSS/squadron/tree/master/src/samples/RabbitMQ)
