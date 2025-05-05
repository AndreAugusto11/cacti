# \OracleApi

All URIs are relative to *http://localhost:3011/api/v1/@hyperledger/cactus-plugin-satp-hermes*

Method | HTTP request | Description
------------- | ------------- | -------------
[**ExecuteOracleTask**](OracleApi.md#ExecuteOracleTask) | **Post** /api/v1/@hyperledger/cactus-plugin-satp-hermes/oracle/execute | Execute data transfer task
[**GetOracleTaskStatus**](OracleApi.md#GetOracleTaskStatus) | **Get** /api/v1/@hyperledger/cactus-plugin-satp-hermes/oracle/status | Get oracle task status
[**RegisterOracleTask**](OracleApi.md#RegisterOracleTask) | **Post** /api/v1/@hyperledger/cactus-plugin-satp-hermes/oracle/register | Register data transfer task
[**UnregisterOracleTask**](OracleApi.md#UnregisterOracleTask) | **Post** /api/v1/@hyperledger/cactus-plugin-satp-hermes/oracle/unregister | Unregister data transfer task



## ExecuteOracleTask

> ExecuteOracleTask200Response ExecuteOracleTask(ctx).ExecuteOracleTaskRequest(executeOracleTaskRequest).Execute()

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
    executeOracleTaskRequest := *openapiclient.NewExecuteOracleTaskRequest() // ExecuteOracleTaskRequest | 

    configuration := openapiclient.NewConfiguration()
    apiClient := openapiclient.NewAPIClient(configuration)
    resp, r, err := apiClient.OracleApi.ExecuteOracleTask(context.Background()).ExecuteOracleTaskRequest(executeOracleTaskRequest).Execute()
    if err != nil {
        fmt.Fprintf(os.Stderr, "Error when calling `OracleApi.ExecuteOracleTask``: %v\n", err)
        fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
    }
    // response from `ExecuteOracleTask`: ExecuteOracleTask200Response
    fmt.Fprintf(os.Stdout, "Response from `OracleApi.ExecuteOracleTask`: %v\n", resp)
}
```

### Path Parameters



### Other Parameters

Other parameters are passed through a pointer to a apiExecuteOracleTaskRequest struct via the builder pattern


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **executeOracleTaskRequest** | [**ExecuteOracleTaskRequest**](ExecuteOracleTaskRequest.md) |  | 

### Return type

[**ExecuteOracleTask200Response**](ExecuteOracleTask200Response.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)


## GetOracleTaskStatus

> GetOracleTaskStatus200Response GetOracleTaskStatus(ctx).GetOracleTaskStatusRequest(getOracleTaskStatusRequest).Execute()

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
    getOracleTaskStatusRequest := *openapiclient.NewGetOracleTaskStatusRequest("123e4567-e89b-12d3-a456-426614174000") // GetOracleTaskStatusRequest | 

    configuration := openapiclient.NewConfiguration()
    apiClient := openapiclient.NewAPIClient(configuration)
    resp, r, err := apiClient.OracleApi.GetOracleTaskStatus(context.Background()).GetOracleTaskStatusRequest(getOracleTaskStatusRequest).Execute()
    if err != nil {
        fmt.Fprintf(os.Stderr, "Error when calling `OracleApi.GetOracleTaskStatus``: %v\n", err)
        fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
    }
    // response from `GetOracleTaskStatus`: GetOracleTaskStatus200Response
    fmt.Fprintf(os.Stdout, "Response from `OracleApi.GetOracleTaskStatus`: %v\n", resp)
}
```

### Path Parameters



### Other Parameters

Other parameters are passed through a pointer to a apiGetOracleTaskStatusRequest struct via the builder pattern


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **getOracleTaskStatusRequest** | [**GetOracleTaskStatusRequest**](GetOracleTaskStatusRequest.md) |  | 

### Return type

[**GetOracleTaskStatus200Response**](GetOracleTaskStatus200Response.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)


## RegisterOracleTask

> RegisterOracleTask200Response RegisterOracleTask(ctx).RegisterOracleTaskRequest(registerOracleTaskRequest).Execute()

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
    registerOracleTaskRequest := *openapiclient.NewRegisterOracleTaskRequest("POLLING", "READ") // RegisterOracleTaskRequest | 

    configuration := openapiclient.NewConfiguration()
    apiClient := openapiclient.NewAPIClient(configuration)
    resp, r, err := apiClient.OracleApi.RegisterOracleTask(context.Background()).RegisterOracleTaskRequest(registerOracleTaskRequest).Execute()
    if err != nil {
        fmt.Fprintf(os.Stderr, "Error when calling `OracleApi.RegisterOracleTask``: %v\n", err)
        fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
    }
    // response from `RegisterOracleTask`: RegisterOracleTask200Response
    fmt.Fprintf(os.Stdout, "Response from `OracleApi.RegisterOracleTask`: %v\n", resp)
}
```

### Path Parameters



### Other Parameters

Other parameters are passed through a pointer to a apiRegisterOracleTaskRequest struct via the builder pattern


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **registerOracleTaskRequest** | [**RegisterOracleTaskRequest**](RegisterOracleTaskRequest.md) |  | 

### Return type

[**RegisterOracleTask200Response**](RegisterOracleTask200Response.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)


## UnregisterOracleTask

> UnregisterOracleTask200Response UnregisterOracleTask(ctx).UnregisterOracleTaskRequest(unregisterOracleTaskRequest).Execute()

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
    unregisterOracleTaskRequest := *openapiclient.NewUnregisterOracleTaskRequest("123e4567-e89b-12d3-a456-426614174000") // UnregisterOracleTaskRequest | 

    configuration := openapiclient.NewConfiguration()
    apiClient := openapiclient.NewAPIClient(configuration)
    resp, r, err := apiClient.OracleApi.UnregisterOracleTask(context.Background()).UnregisterOracleTaskRequest(unregisterOracleTaskRequest).Execute()
    if err != nil {
        fmt.Fprintf(os.Stderr, "Error when calling `OracleApi.UnregisterOracleTask``: %v\n", err)
        fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
    }
    // response from `UnregisterOracleTask`: UnregisterOracleTask200Response
    fmt.Fprintf(os.Stdout, "Response from `OracleApi.UnregisterOracleTask`: %v\n", resp)
}
```

### Path Parameters



### Other Parameters

Other parameters are passed through a pointer to a apiUnregisterOracleTaskRequest struct via the builder pattern


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **unregisterOracleTaskRequest** | [**UnregisterOracleTaskRequest**](UnregisterOracleTaskRequest.md) |  | 

### Return type

[**UnregisterOracleTask200Response**](UnregisterOracleTask200Response.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)

