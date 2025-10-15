# NetworkConfig

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**RpcUrl** | **string** |  | 
**Network** | [**Network**](Network.md) |  | 

## Methods

### NewNetworkConfig

`func NewNetworkConfig(rpcUrl string, network Network, ) *NetworkConfig`

NewNetworkConfig instantiates a new NetworkConfig object
This constructor will assign default values to properties that have it defined,
and makes sure properties required by API are set, but the set of arguments
will change when the set of required properties is changed

### NewNetworkConfigWithDefaults

`func NewNetworkConfigWithDefaults() *NetworkConfig`

NewNetworkConfigWithDefaults instantiates a new NetworkConfig object
This constructor will only assign default values to properties that have it defined,
but it doesn't guarantee that properties required by API are set

### GetRpcUrl

`func (o *NetworkConfig) GetRpcUrl() string`

GetRpcUrl returns the RpcUrl field if non-nil, zero value otherwise.

### GetRpcUrlOk

`func (o *NetworkConfig) GetRpcUrlOk() (*string, bool)`

GetRpcUrlOk returns a tuple with the RpcUrl field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetRpcUrl

`func (o *NetworkConfig) SetRpcUrl(v string)`

SetRpcUrl sets RpcUrl field to given value.


### GetNetwork

`func (o *NetworkConfig) GetNetwork() Network`

GetNetwork returns the Network field if non-nil, zero value otherwise.

### GetNetworkOk

`func (o *NetworkConfig) GetNetworkOk() (*Network, bool)`

GetNetworkOk returns a tuple with the Network field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetNetwork

`func (o *NetworkConfig) SetNetwork(v Network)`

SetNetwork sets Network field to given value.



[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


