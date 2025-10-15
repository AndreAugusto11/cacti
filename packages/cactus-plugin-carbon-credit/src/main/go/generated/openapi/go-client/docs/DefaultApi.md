# \DefaultApi

All URIs are relative to *http://localhost*

Method | HTTP request | Description
------------- | ------------- | -------------
[**GetAvailableTCO2sRequest**](DefaultApi.md#GetAvailableTCO2sRequest) | **Post** /api/v1/@hyperledger/cactus-plugin-carbon-credit/get-available-tco2s | 
[**GetPurchasePriceRequest**](DefaultApi.md#GetPurchasePriceRequest) | **Post** /api/v1/@hyperledger/cactus-plugin-carbon-credit/get-purchase-price | 
[**GetVCUMetadataRequest**](DefaultApi.md#GetVCUMetadataRequest) | **Post** /api/v1/@hyperledger/cactus-plugin-carbon-credit/get-vcu-metadata | 
[**RandomBuyRequest**](DefaultApi.md#RandomBuyRequest) | **Post** /api/v1/@hyperledger/cactus-plugin-carbon-credit/random-buy | 
[**RetireRequest**](DefaultApi.md#RetireRequest) | **Post** /api/v1/@hyperledger/cactus-plugin-carbon-credit/retire | 
[**SpecificBuyRequest**](DefaultApi.md#SpecificBuyRequest) | **Post** /api/v1/@hyperledger/cactus-plugin-carbon-credit/specific-buy | 



## GetAvailableTCO2sRequest

> GetAvailableTCO2sResponse GetAvailableTCO2sRequest(ctx).GetAvailableTCO2sRequest(getAvailableTCO2sRequest).Execute()





### Example

```go
package main

import (
    "context"
    "fmt"
    "os"
    openapiclient "github.com/GIT_USER_ID/GIT_REPO_ID"
)

func main() {
    getAvailableTCO2sRequest := *openapiclient.NewGetAvailableTCO2sRequest(openapiclient.Marketplace("Toucan"), openapiclient.Network("polygon")) // GetAvailableTCO2sRequest |  (optional)

    configuration := openapiclient.NewConfiguration()
    apiClient := openapiclient.NewAPIClient(configuration)
    resp, r, err := apiClient.DefaultApi.GetAvailableTCO2sRequest(context.Background()).GetAvailableTCO2sRequest(getAvailableTCO2sRequest).Execute()
    if err != nil {
        fmt.Fprintf(os.Stderr, "Error when calling `DefaultApi.GetAvailableTCO2sRequest``: %v\n", err)
        fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
    }
    // response from `GetAvailableTCO2sRequest`: GetAvailableTCO2sResponse
    fmt.Fprintf(os.Stdout, "Response from `DefaultApi.GetAvailableTCO2sRequest`: %v\n", resp)
}
```

### Path Parameters



### Other Parameters

Other parameters are passed through a pointer to a apiGetAvailableTCO2sRequestRequest struct via the builder pattern


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **getAvailableTCO2sRequest** | [**GetAvailableTCO2sRequest**](GetAvailableTCO2sRequest.md) |  | 

### Return type

[**GetAvailableTCO2sResponse**](GetAvailableTCO2sResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)


## GetPurchasePriceRequest

> GetPurchasePriceResponse GetPurchasePriceRequest(ctx).GetPurchasePriceRequest(getPurchasePriceRequest).Execute()





### Example

```go
package main

import (
    "context"
    "fmt"
    "os"
    openapiclient "github.com/GIT_USER_ID/GIT_REPO_ID"
)

func main() {
    getPurchasePriceRequest := *openapiclient.NewGetPurchasePriceRequest(openapiclient.Marketplace("Toucan"), openapiclient.Network("polygon"), "Unit_example", "Amount_example") // GetPurchasePriceRequest |  (optional)

    configuration := openapiclient.NewConfiguration()
    apiClient := openapiclient.NewAPIClient(configuration)
    resp, r, err := apiClient.DefaultApi.GetPurchasePriceRequest(context.Background()).GetPurchasePriceRequest(getPurchasePriceRequest).Execute()
    if err != nil {
        fmt.Fprintf(os.Stderr, "Error when calling `DefaultApi.GetPurchasePriceRequest``: %v\n", err)
        fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
    }
    // response from `GetPurchasePriceRequest`: GetPurchasePriceResponse
    fmt.Fprintf(os.Stdout, "Response from `DefaultApi.GetPurchasePriceRequest`: %v\n", resp)
}
```

### Path Parameters



### Other Parameters

Other parameters are passed through a pointer to a apiGetPurchasePriceRequestRequest struct via the builder pattern


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **getPurchasePriceRequest** | [**GetPurchasePriceRequest**](GetPurchasePriceRequest.md) |  | 

### Return type

[**GetPurchasePriceResponse**](GetPurchasePriceResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)


## GetVCUMetadataRequest

> VCUMetadata GetVCUMetadataRequest(ctx).GetVCUMetadataRequest(getVCUMetadataRequest).Execute()





### Example

```go
package main

import (
    "context"
    "fmt"
    "os"
    openapiclient "github.com/GIT_USER_ID/GIT_REPO_ID"
)

func main() {
    getVCUMetadataRequest := *openapiclient.NewGetVCUMetadataRequest(openapiclient.Marketplace("Toucan"), openapiclient.Network("polygon"), "ProjectIdentifier_example", "VcuIdentifier_example") // GetVCUMetadataRequest |  (optional)

    configuration := openapiclient.NewConfiguration()
    apiClient := openapiclient.NewAPIClient(configuration)
    resp, r, err := apiClient.DefaultApi.GetVCUMetadataRequest(context.Background()).GetVCUMetadataRequest(getVCUMetadataRequest).Execute()
    if err != nil {
        fmt.Fprintf(os.Stderr, "Error when calling `DefaultApi.GetVCUMetadataRequest``: %v\n", err)
        fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
    }
    // response from `GetVCUMetadataRequest`: VCUMetadata
    fmt.Fprintf(os.Stdout, "Response from `DefaultApi.GetVCUMetadataRequest`: %v\n", resp)
}
```

### Path Parameters



### Other Parameters

Other parameters are passed through a pointer to a apiGetVCUMetadataRequestRequest struct via the builder pattern


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **getVCUMetadataRequest** | [**GetVCUMetadataRequest**](GetVCUMetadataRequest.md) |  | 

### Return type

[**VCUMetadata**](VCUMetadata.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)


## RandomBuyRequest

> RandomBuyResponse RandomBuyRequest(ctx).RandomBuyRequest(randomBuyRequest).Execute()





### Example

```go
package main

import (
    "context"
    "fmt"
    "os"
    openapiclient "github.com/GIT_USER_ID/GIT_REPO_ID"
)

func main() {
    randomBuyRequest := *openapiclient.NewRandomBuyRequest(openapiclient.Marketplace("Toucan"), openapiclient.Network("polygon"), "Amount_example") // RandomBuyRequest |  (optional)

    configuration := openapiclient.NewConfiguration()
    apiClient := openapiclient.NewAPIClient(configuration)
    resp, r, err := apiClient.DefaultApi.RandomBuyRequest(context.Background()).RandomBuyRequest(randomBuyRequest).Execute()
    if err != nil {
        fmt.Fprintf(os.Stderr, "Error when calling `DefaultApi.RandomBuyRequest``: %v\n", err)
        fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
    }
    // response from `RandomBuyRequest`: RandomBuyResponse
    fmt.Fprintf(os.Stdout, "Response from `DefaultApi.RandomBuyRequest`: %v\n", resp)
}
```

### Path Parameters



### Other Parameters

Other parameters are passed through a pointer to a apiRandomBuyRequestRequest struct via the builder pattern


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **randomBuyRequest** | [**RandomBuyRequest**](RandomBuyRequest.md) |  | 

### Return type

[**RandomBuyResponse**](RandomBuyResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)


## RetireRequest

> RetireResponse RetireRequest(ctx).RetireRequest(retireRequest).Execute()





### Example

```go
package main

import (
    "context"
    "fmt"
    "os"
    openapiclient "github.com/GIT_USER_ID/GIT_REPO_ID"
)

func main() {
    retireRequest := *openapiclient.NewRetireRequest(openapiclient.Marketplace("Toucan"), openapiclient.Network("polygon"), "EntityName_example", []string{"Tco2s_example"}, []string{"Amounts_example"}, "BeneficiaryAddress_example", "BeneficiaryName_example", "RetirementReason_example") // RetireRequest |  (optional)

    configuration := openapiclient.NewConfiguration()
    apiClient := openapiclient.NewAPIClient(configuration)
    resp, r, err := apiClient.DefaultApi.RetireRequest(context.Background()).RetireRequest(retireRequest).Execute()
    if err != nil {
        fmt.Fprintf(os.Stderr, "Error when calling `DefaultApi.RetireRequest``: %v\n", err)
        fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
    }
    // response from `RetireRequest`: RetireResponse
    fmt.Fprintf(os.Stdout, "Response from `DefaultApi.RetireRequest`: %v\n", resp)
}
```

### Path Parameters



### Other Parameters

Other parameters are passed through a pointer to a apiRetireRequestRequest struct via the builder pattern


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **retireRequest** | [**RetireRequest**](RetireRequest.md) |  | 

### Return type

[**RetireResponse**](RetireResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)


## SpecificBuyRequest

> SpecificBuyResponse SpecificBuyRequest(ctx).SpecificBuyRequest(specificBuyRequest).Execute()





### Example

```go
package main

import (
    "context"
    "fmt"
    "os"
    openapiclient "github.com/GIT_USER_ID/GIT_REPO_ID"
)

func main() {
    specificBuyRequest := *openapiclient.NewSpecificBuyRequest(openapiclient.Marketplace("Toucan"), openapiclient.Network("polygon"), "PaymentToken_example", map[string]string{"key": "Inner_example"}) // SpecificBuyRequest |  (optional)

    configuration := openapiclient.NewConfiguration()
    apiClient := openapiclient.NewAPIClient(configuration)
    resp, r, err := apiClient.DefaultApi.SpecificBuyRequest(context.Background()).SpecificBuyRequest(specificBuyRequest).Execute()
    if err != nil {
        fmt.Fprintf(os.Stderr, "Error when calling `DefaultApi.SpecificBuyRequest``: %v\n", err)
        fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
    }
    // response from `SpecificBuyRequest`: SpecificBuyResponse
    fmt.Fprintf(os.Stdout, "Response from `DefaultApi.SpecificBuyRequest`: %v\n", resp)
}
```

### Path Parameters



### Other Parameters

Other parameters are passed through a pointer to a apiSpecificBuyRequestRequest struct via the builder pattern


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **specificBuyRequest** | [**SpecificBuyRequest**](SpecificBuyRequest.md) |  | 

### Return type

[**SpecificBuyResponse**](SpecificBuyResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)

