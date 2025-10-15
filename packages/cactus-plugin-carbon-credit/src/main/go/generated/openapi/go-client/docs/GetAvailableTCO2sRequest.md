# GetAvailableTCO2sRequest

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**Marketplace** | [**Marketplace**](Marketplace.md) |  | 
**Network** | [**Network**](Network.md) |  | 
**FilterCriteria** | Pointer to **string** |  | [optional] 
**OrderBy** | Pointer to **string** |  | [optional] 
**Limit** | Pointer to **string** |  | [optional] 

## Methods

### NewGetAvailableTCO2sRequest

`func NewGetAvailableTCO2sRequest(marketplace Marketplace, network Network, ) *GetAvailableTCO2sRequest`

NewGetAvailableTCO2sRequest instantiates a new GetAvailableTCO2sRequest object
This constructor will assign default values to properties that have it defined,
and makes sure properties required by API are set, but the set of arguments
will change when the set of required properties is changed

### NewGetAvailableTCO2sRequestWithDefaults

`func NewGetAvailableTCO2sRequestWithDefaults() *GetAvailableTCO2sRequest`

NewGetAvailableTCO2sRequestWithDefaults instantiates a new GetAvailableTCO2sRequest object
This constructor will only assign default values to properties that have it defined,
but it doesn't guarantee that properties required by API are set

### GetMarketplace

`func (o *GetAvailableTCO2sRequest) GetMarketplace() Marketplace`

GetMarketplace returns the Marketplace field if non-nil, zero value otherwise.

### GetMarketplaceOk

`func (o *GetAvailableTCO2sRequest) GetMarketplaceOk() (*Marketplace, bool)`

GetMarketplaceOk returns a tuple with the Marketplace field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetMarketplace

`func (o *GetAvailableTCO2sRequest) SetMarketplace(v Marketplace)`

SetMarketplace sets Marketplace field to given value.


### GetNetwork

`func (o *GetAvailableTCO2sRequest) GetNetwork() Network`

GetNetwork returns the Network field if non-nil, zero value otherwise.

### GetNetworkOk

`func (o *GetAvailableTCO2sRequest) GetNetworkOk() (*Network, bool)`

GetNetworkOk returns a tuple with the Network field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetNetwork

`func (o *GetAvailableTCO2sRequest) SetNetwork(v Network)`

SetNetwork sets Network field to given value.


### GetFilterCriteria

`func (o *GetAvailableTCO2sRequest) GetFilterCriteria() string`

GetFilterCriteria returns the FilterCriteria field if non-nil, zero value otherwise.

### GetFilterCriteriaOk

`func (o *GetAvailableTCO2sRequest) GetFilterCriteriaOk() (*string, bool)`

GetFilterCriteriaOk returns a tuple with the FilterCriteria field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetFilterCriteria

`func (o *GetAvailableTCO2sRequest) SetFilterCriteria(v string)`

SetFilterCriteria sets FilterCriteria field to given value.

### HasFilterCriteria

`func (o *GetAvailableTCO2sRequest) HasFilterCriteria() bool`

HasFilterCriteria returns a boolean if a field has been set.

### GetOrderBy

`func (o *GetAvailableTCO2sRequest) GetOrderBy() string`

GetOrderBy returns the OrderBy field if non-nil, zero value otherwise.

### GetOrderByOk

`func (o *GetAvailableTCO2sRequest) GetOrderByOk() (*string, bool)`

GetOrderByOk returns a tuple with the OrderBy field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetOrderBy

`func (o *GetAvailableTCO2sRequest) SetOrderBy(v string)`

SetOrderBy sets OrderBy field to given value.

### HasOrderBy

`func (o *GetAvailableTCO2sRequest) HasOrderBy() bool`

HasOrderBy returns a boolean if a field has been set.

### GetLimit

`func (o *GetAvailableTCO2sRequest) GetLimit() string`

GetLimit returns the Limit field if non-nil, zero value otherwise.

### GetLimitOk

`func (o *GetAvailableTCO2sRequest) GetLimitOk() (*string, bool)`

GetLimitOk returns a tuple with the Limit field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetLimit

`func (o *GetAvailableTCO2sRequest) SetLimit(v string)`

SetLimit sets Limit field to given value.

### HasLimit

`func (o *GetAvailableTCO2sRequest) HasLimit() bool`

HasLimit returns a boolean if a field has been set.


[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


