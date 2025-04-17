# \OracleApi

All URIs are relative to *http://localhost:3011/api/v1/@hyperledger/cactus-plugin-satp-hermes*

Method | HTTP request | Description
------------- | ------------- | -------------
[**OracleExecuteRequest**](OracleApi.md#OracleExecuteRequest) | **Post** /api/v1/@hyperledger/cactus-plugin-satp-hermes/oracle/execute | Execute data transfer task
[**OracleRegisterRequest**](OracleApi.md#OracleRegisterRequest) | **Post** /api/v1/@hyperledger/cactus-plugin-satp-hermes/oracle/register | Register data transfer task
[**OracleStatusRequest**](OracleApi.md#OracleStatusRequest) | **Get** /api/v1/@hyperledger/cactus-plugin-satp-hermes/oracle/status | Get oracle task status
[**OracleUnregisterRequest**](OracleApi.md#OracleUnregisterRequest) | **Post** /api/v1/@hyperledger/cactus-plugin-satp-hermes/oracle/unregister | Unregister data transfer task



## OracleExecuteRequest

> OracleExecuteRequest200Response OracleExecuteRequest(ctx).OracleExecuteRequestRequest(oracleExecuteRequestRequest).Execute()

Execute data transfer task



### Example

```go
package main

import (
    "context"
    "fmt"
    "os"
    openapiclient "github.com/hyperledger/cacti/packages/cactus-plugin-satp-hermes/src/main/go/generated"
)

func main() {
    oracleExecuteRequestRequest := *openapiclient.NewOracleExecuteRequestRequest("HyperledgerFabric", "9.808299006075645E+47", "recordTransfer") // OracleExecuteRequestRequest | 

    configuration := openapiclient.NewConfiguration()
    apiClient := openapiclient.NewAPIClient(configuration)
    resp, r, err := apiClient.OracleApi.OracleExecuteRequest(context.Background()).OracleExecuteRequestRequest(oracleExecuteRequestRequest).Execute()
    if err != nil {
        fmt.Fprintf(os.Stderr, "Error when calling `OracleApi.OracleExecuteRequest``: %v\n", err)
        fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
    }
    // response from `OracleExecuteRequest`: OracleExecuteRequest200Response
    fmt.Fprintf(os.Stdout, "Response from `OracleApi.OracleExecuteRequest`: %v\n", resp)
}
```

### Path Parameters



### Other Parameters

Other parameters are passed through a pointer to a apiOracleExecuteRequestRequest struct via the builder pattern


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **oracleExecuteRequestRequest** | [**OracleExecuteRequestRequest**](OracleExecuteRequestRequest.md) |  | 

### Return type

[**OracleExecuteRequest200Response**](OracleExecuteRequest200Response.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)


## OracleRegisterRequest

> OracleRegisterRequest200Response OracleRegisterRequest(ctx).OracleRegisterRequestRequest(oracleRegisterRequestRequest).Execute()

Register data transfer task



### Example

```go
package main

import (
    "context"
    "fmt"
    "os"
    openapiclient "github.com/hyperledger/cacti/packages/cactus-plugin-satp-hermes/src/main/go/generated"
)

func main() {
    oracleRegisterRequestRequest := *openapiclient.NewOracleRegisterRequestRequest("POLLING", "READ") // OracleRegisterRequestRequest | 

    configuration := openapiclient.NewConfiguration()
    apiClient := openapiclient.NewAPIClient(configuration)
    resp, r, err := apiClient.OracleApi.OracleRegisterRequest(context.Background()).OracleRegisterRequestRequest(oracleRegisterRequestRequest).Execute()
    if err != nil {
        fmt.Fprintf(os.Stderr, "Error when calling `OracleApi.OracleRegisterRequest``: %v\n", err)
        fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
    }
    // response from `OracleRegisterRequest`: OracleRegisterRequest200Response
    fmt.Fprintf(os.Stdout, "Response from `OracleApi.OracleRegisterRequest`: %v\n", resp)
}
```

### Path Parameters



### Other Parameters

Other parameters are passed through a pointer to a apiOracleRegisterRequestRequest struct via the builder pattern


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **oracleRegisterRequestRequest** | [**OracleRegisterRequestRequest**](OracleRegisterRequestRequest.md) |  | 

### Return type

[**OracleRegisterRequest200Response**](OracleRegisterRequest200Response.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)


## OracleStatusRequest

> OracleStatusRequest200Response OracleStatusRequest(ctx).OracleStatusRequestRequest(oracleStatusRequestRequest).Execute()

Get oracle task status



### Example

```go
package main

import (
    "context"
    "fmt"
    "os"
    openapiclient "github.com/hyperledger/cacti/packages/cactus-plugin-satp-hermes/src/main/go/generated"
)

func main() {
    oracleStatusRequestRequest := *openapiclient.NewOracleStatusRequestRequest() // OracleStatusRequestRequest | 

    configuration := openapiclient.NewConfiguration()
    apiClient := openapiclient.NewAPIClient(configuration)
    resp, r, err := apiClient.OracleApi.OracleStatusRequest(context.Background()).OracleStatusRequestRequest(oracleStatusRequestRequest).Execute()
    if err != nil {
        fmt.Fprintf(os.Stderr, "Error when calling `OracleApi.OracleStatusRequest``: %v\n", err)
        fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
    }
    // response from `OracleStatusRequest`: OracleStatusRequest200Response
    fmt.Fprintf(os.Stdout, "Response from `OracleApi.OracleStatusRequest`: %v\n", resp)
}
```

### Path Parameters



### Other Parameters

Other parameters are passed through a pointer to a apiOracleStatusRequestRequest struct via the builder pattern


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **oracleStatusRequestRequest** | [**OracleStatusRequestRequest**](OracleStatusRequestRequest.md) |  | 

### Return type

[**OracleStatusRequest200Response**](OracleStatusRequest200Response.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)


## OracleUnregisterRequest

> OracleUnregisterRequest200Response OracleUnregisterRequest(ctx).OracleUnregisterRequestRequest(oracleUnregisterRequestRequest).Execute()

Unregister data transfer task



### Example

```go
package main

import (
    "context"
    "fmt"
    "os"
    openapiclient "github.com/hyperledger/cacti/packages/cactus-plugin-satp-hermes/src/main/go/generated"
)

func main() {
    oracleUnregisterRequestRequest := *openapiclient.NewOracleUnregisterRequestRequest("123e4567-e89b-12d3-a456-426614174000") // OracleUnregisterRequestRequest | 

    configuration := openapiclient.NewConfiguration()
    apiClient := openapiclient.NewAPIClient(configuration)
    resp, r, err := apiClient.OracleApi.OracleUnregisterRequest(context.Background()).OracleUnregisterRequestRequest(oracleUnregisterRequestRequest).Execute()
    if err != nil {
        fmt.Fprintf(os.Stderr, "Error when calling `OracleApi.OracleUnregisterRequest``: %v\n", err)
        fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
    }
    // response from `OracleUnregisterRequest`: OracleUnregisterRequest200Response
    fmt.Fprintf(os.Stdout, "Response from `OracleApi.OracleUnregisterRequest`: %v\n", resp)
}
```

### Path Parameters



### Other Parameters

Other parameters are passed through a pointer to a apiOracleUnregisterRequestRequest struct via the builder pattern


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **oracleUnregisterRequestRequest** | [**OracleUnregisterRequestRequest**](OracleUnregisterRequestRequest.md) |  | 

### Return type

[**OracleUnregisterRequest200Response**](OracleUnregisterRequest200Response.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)

