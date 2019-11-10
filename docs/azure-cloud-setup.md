---
id: azure-cloud-setup
title: Azure setup
sidebar_label: Setup
---

Azure resources are using the [Azure Management API](https://docs.microsoft.com/en-us/rest/api/azure/)
to provision resources in Azure and delete them when test are completed.

> Be aware that provisioning resources in Azure will cost you some \$.
> Also it can happen that resources can not be automatically removed, in this case it is your
> responsability to clean up unused resources. We recomend to use a dedicated resource group
> to run you Squadron tests.

You can use the [pricing calculator](https://azure.microsoft.com/en-us/pricing/calculator)
the estimate pricings. But for testing we should always try to use small SKU's and use the resource
only for the time of the test run. So costs should stay very low.

Squadron uses a service principal with secret to authenticate against the management api.
To use an azure based resource you first need to create a principle and configure it for squadron.

1. Create a [service principal](https://docs.microsoft.com/en-us/azure/active-directory/develop/howto-create-service-principal-portal)

2. Create a [resource group](https://docs.microsoft.com/en-us/azure/azure-resource-manager/manage-resource-groups-portal) that you want to use for your tests.

3. Assign the created service principal owner permissions to the resource group.

4. [Configure](configuration.md#azure-cloud-configuration) the principal and the resource group in your test project.

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
