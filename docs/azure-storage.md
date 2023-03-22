---
id: azure-storage
title: Azure Storage
sidebar_label: Azure Storage
---

An [Azure Storage](https://azure.microsoft.com/en-us/services/storage/) resource using the [Azurite V3](https://github.com/Azure/Azurite) docker image.
This image supports most of the Blob and Queue features of Azure storage.

The support matrix can be found on the Github repo of [Azurite](https://github.com/Azure/Azurite)

## Install

Install the Squadron nuget package for within your test project:

```bash
dotnet add package Squadron.AzureStorage
```

## Basic Usage

### Blob

```csharp
public class MyContainerTest : IClassFixture<AzureStorageBlobResource>
{
    private readonly AzureStorageBlobResource _azureStorageResource;

    public MyContainerTest(AzureStorageBlobResource azureStorageResource)
    {
        _azureStorageResource = azureStorageResource;
    }
    
    [Fact]
    public async Task CreateBlobClient_UploadFile_ContentMatch()
    {
        //Arrange
        BlobServiceClient blobServiceClient = _azureStorageResource.CreateBlobServiceClient();
        BlobContainerClient containerClient = blobServiceClient.GetBlobContainerClient("foo");
        await containerClient.CreateIfNotExistsAsync();
        string inputText = "Hello_AzureStorage";
        var data = Encoding.UTF8.GetBytes(inputText);
       
        //Act
        BlobClient textFile = containerClient.GetBlobClient("test.txt");
        await textFile.UploadAsync(new BinaryData(data));
        //Assert
        Response<BlobDownloadResult> downloaded = await textFile.DownloadContentAsync();
        var downloadedFileContent = Encoding.UTF8.GetString(downloaded.Value.Content.ToArray());
        downloadedFileContent.Should().Be(inputText);
    }
}
```

### Queue
