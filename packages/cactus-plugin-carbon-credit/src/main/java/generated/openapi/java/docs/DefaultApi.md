# DefaultApi

All URIs are relative to *http://localhost*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**getAvailableTCO2sRequest**](DefaultApi.md#getAvailableTCO2sRequest) | **POST** /api/v1/@hyperledger/cactus-plugin-carbon-credit/get-available-tco2s |  |
| [**getPurchasePriceRequest**](DefaultApi.md#getPurchasePriceRequest) | **POST** /api/v1/@hyperledger/cactus-plugin-carbon-credit/get-purchase-price |  |
| [**getTCO2MetadataRequest**](DefaultApi.md#getTCO2MetadataRequest) | **POST** /api/v1/@hyperledger/cactus-plugin-carbon-credit/get-tco2-metadata |  |
| [**randomBuyRequest**](DefaultApi.md#randomBuyRequest) | **POST** /api/v1/@hyperledger/cactus-plugin-carbon-credit/random-buy |  |
| [**retireRequest**](DefaultApi.md#retireRequest) | **POST** /api/v1/@hyperledger/cactus-plugin-carbon-credit/retire |  |
| [**specificBuyRequest**](DefaultApi.md#specificBuyRequest) | **POST** /api/v1/@hyperledger/cactus-plugin-carbon-credit/specific-buy |  |


<a id="getAvailableTCO2sRequest"></a>
# **getAvailableTCO2sRequest**
> GetAvailableTCO2sResponse getAvailableTCO2sRequest(getAvailableTCO2sRequest)



Get a list of available TCO2s (Tokenized Carbon Offset Units).

### Example
```java
// Import classes:
import org.openapitools.client.ApiClient;
import org.openapitools.client.ApiException;
import org.openapitools.client.Configuration;
import org.openapitools.client.models.*;
import org.openapitools.client.api.DefaultApi;

public class Example {
  public static void main(String[] args) {
    ApiClient defaultClient = Configuration.getDefaultApiClient();
    defaultClient.setBasePath("http://localhost");

    DefaultApi apiInstance = new DefaultApi(defaultClient);
    GetAvailableTCO2sRequest getAvailableTCO2sRequest = new GetAvailableTCO2sRequest(); // GetAvailableTCO2sRequest | 
    try {
      GetAvailableTCO2sResponse result = apiInstance.getAvailableTCO2sRequest(getAvailableTCO2sRequest);
      System.out.println(result);
    } catch (ApiException e) {
      System.err.println("Exception when calling DefaultApi#getAvailableTCO2sRequest");
      System.err.println("Status code: " + e.getCode());
      System.err.println("Reason: " + e.getResponseBody());
      System.err.println("Response headers: " + e.getResponseHeaders());
      e.printStackTrace();
    }
  }
}
```

### Parameters

| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **getAvailableTCO2sRequest** | [**GetAvailableTCO2sRequest**](GetAvailableTCO2sRequest.md)|  | [optional] |

### Return type

[**GetAvailableTCO2sResponse**](GetAvailableTCO2sResponse.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Successful response with a list of available TCO2s. |  -  |

<a id="getPurchasePriceRequest"></a>
# **getPurchasePriceRequest**
> GetPurchasePriceResponse getPurchasePriceRequest(getPurchasePriceRequest)



Get the purchase price for a specific TCO2.

### Example
```java
// Import classes:
import org.openapitools.client.ApiClient;
import org.openapitools.client.ApiException;
import org.openapitools.client.Configuration;
import org.openapitools.client.models.*;
import org.openapitools.client.api.DefaultApi;

public class Example {
  public static void main(String[] args) {
    ApiClient defaultClient = Configuration.getDefaultApiClient();
    defaultClient.setBasePath("http://localhost");

    DefaultApi apiInstance = new DefaultApi(defaultClient);
    GetPurchasePriceRequest getPurchasePriceRequest = new GetPurchasePriceRequest(); // GetPurchasePriceRequest | 
    try {
      GetPurchasePriceResponse result = apiInstance.getPurchasePriceRequest(getPurchasePriceRequest);
      System.out.println(result);
    } catch (ApiException e) {
      System.err.println("Exception when calling DefaultApi#getPurchasePriceRequest");
      System.err.println("Status code: " + e.getCode());
      System.err.println("Reason: " + e.getResponseBody());
      System.err.println("Response headers: " + e.getResponseHeaders());
      e.printStackTrace();
    }
  }
}
```

### Parameters

| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **getPurchasePriceRequest** | [**GetPurchasePriceRequest**](GetPurchasePriceRequest.md)|  | [optional] |

### Return type

[**GetPurchasePriceResponse**](GetPurchasePriceResponse.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Successful response with the purchase price. |  -  |

<a id="getTCO2MetadataRequest"></a>
# **getTCO2MetadataRequest**
> TCO2Metadata getTCO2MetadataRequest(getTCO2MetadataRequest)



Get metadata for a specific TCO2.

### Example
```java
// Import classes:
import org.openapitools.client.ApiClient;
import org.openapitools.client.ApiException;
import org.openapitools.client.Configuration;
import org.openapitools.client.models.*;
import org.openapitools.client.api.DefaultApi;

public class Example {
  public static void main(String[] args) {
    ApiClient defaultClient = Configuration.getDefaultApiClient();
    defaultClient.setBasePath("http://localhost");

    DefaultApi apiInstance = new DefaultApi(defaultClient);
    GetTCO2MetadataRequest getTCO2MetadataRequest = new GetTCO2MetadataRequest(); // GetTCO2MetadataRequest | 
    try {
      TCO2Metadata result = apiInstance.getTCO2MetadataRequest(getTCO2MetadataRequest);
      System.out.println(result);
    } catch (ApiException e) {
      System.err.println("Exception when calling DefaultApi#getTCO2MetadataRequest");
      System.err.println("Status code: " + e.getCode());
      System.err.println("Reason: " + e.getResponseBody());
      System.err.println("Response headers: " + e.getResponseHeaders());
      e.printStackTrace();
    }
  }
}
```

### Parameters

| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **getTCO2MetadataRequest** | [**GetTCO2MetadataRequest**](GetTCO2MetadataRequest.md)|  | [optional] |

### Return type

[**TCO2Metadata**](TCO2Metadata.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Successful response with VCU metadata. |  -  |

<a id="randomBuyRequest"></a>
# **randomBuyRequest**
> RandomBuyResponse randomBuyRequest(randomBuyRequest)



Acquire a random basket of TCO2s from a marketplace.

### Example
```java
// Import classes:
import org.openapitools.client.ApiClient;
import org.openapitools.client.ApiException;
import org.openapitools.client.Configuration;
import org.openapitools.client.models.*;
import org.openapitools.client.api.DefaultApi;

public class Example {
  public static void main(String[] args) {
    ApiClient defaultClient = Configuration.getDefaultApiClient();
    defaultClient.setBasePath("http://localhost");

    DefaultApi apiInstance = new DefaultApi(defaultClient);
    RandomBuyRequest randomBuyRequest = new RandomBuyRequest(); // RandomBuyRequest | 
    try {
      RandomBuyResponse result = apiInstance.randomBuyRequest(randomBuyRequest);
      System.out.println(result);
    } catch (ApiException e) {
      System.err.println("Exception when calling DefaultApi#randomBuyRequest");
      System.err.println("Status code: " + e.getCode());
      System.err.println("Reason: " + e.getResponseBody());
      System.err.println("Response headers: " + e.getResponseHeaders());
      e.printStackTrace();
    }
  }
}
```

### Parameters

| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **randomBuyRequest** | [**RandomBuyRequest**](RandomBuyRequest.md)|  | [optional] |

### Return type

[**RandomBuyResponse**](RandomBuyResponse.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Successful response |  -  |

<a id="retireRequest"></a>
# **retireRequest**
> RetireResponse retireRequest(retireRequest)



Retire a specific basket of TCO2s on a marketplace.

### Example
```java
// Import classes:
import org.openapitools.client.ApiClient;
import org.openapitools.client.ApiException;
import org.openapitools.client.Configuration;
import org.openapitools.client.models.*;
import org.openapitools.client.api.DefaultApi;

public class Example {
  public static void main(String[] args) {
    ApiClient defaultClient = Configuration.getDefaultApiClient();
    defaultClient.setBasePath("http://localhost");

    DefaultApi apiInstance = new DefaultApi(defaultClient);
    RetireRequest retireRequest = new RetireRequest(); // RetireRequest | 
    try {
      RetireResponse result = apiInstance.retireRequest(retireRequest);
      System.out.println(result);
    } catch (ApiException e) {
      System.err.println("Exception when calling DefaultApi#retireRequest");
      System.err.println("Status code: " + e.getCode());
      System.err.println("Reason: " + e.getResponseBody());
      System.err.println("Response headers: " + e.getResponseHeaders());
      e.printStackTrace();
    }
  }
}
```

### Parameters

| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **retireRequest** | [**RetireRequest**](RetireRequest.md)|  | [optional] |

### Return type

[**RetireResponse**](RetireResponse.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Successful response |  -  |

<a id="specificBuyRequest"></a>
# **specificBuyRequest**
> SpecificBuyResponse specificBuyRequest(specificBuyRequest)



Acquire a specific basket of TCO2s from a marketplace.

### Example
```java
// Import classes:
import org.openapitools.client.ApiClient;
import org.openapitools.client.ApiException;
import org.openapitools.client.Configuration;
import org.openapitools.client.models.*;
import org.openapitools.client.api.DefaultApi;

public class Example {
  public static void main(String[] args) {
    ApiClient defaultClient = Configuration.getDefaultApiClient();
    defaultClient.setBasePath("http://localhost");

    DefaultApi apiInstance = new DefaultApi(defaultClient);
    SpecificBuyRequest specificBuyRequest = new SpecificBuyRequest(); // SpecificBuyRequest | 
    try {
      SpecificBuyResponse result = apiInstance.specificBuyRequest(specificBuyRequest);
      System.out.println(result);
    } catch (ApiException e) {
      System.err.println("Exception when calling DefaultApi#specificBuyRequest");
      System.err.println("Status code: " + e.getCode());
      System.err.println("Reason: " + e.getResponseBody());
      System.err.println("Response headers: " + e.getResponseHeaders());
      e.printStackTrace();
    }
  }
}
```

### Parameters

| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **specificBuyRequest** | [**SpecificBuyRequest**](SpecificBuyRequest.md)|  | [optional] |

### Return type

[**SpecificBuyResponse**](SpecificBuyResponse.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Successful response |  -  |

