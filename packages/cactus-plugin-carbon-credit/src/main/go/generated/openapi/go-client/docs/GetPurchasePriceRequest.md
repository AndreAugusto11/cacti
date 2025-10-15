# GetPurchasePriceRequest

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**Marketplace** | [**Marketplace**](Marketplace.md) |  | 
**Network** | [**Network**](Network.md) |  | 
**Unit** | **string** | The token address to retrieve the price for. | 
**Amount** | **string** | The amount of Units to price. | 

## Methods

### NewGetPurchasePriceRequest

`func NewGetPurchasePriceRequest(marketplace Marketplace, network Network, unit string, amount string, ) *GetPurchasePriceRequest`

NewGetPurchasePriceRequest instantiates a new GetPurchasePriceRequest object
This constructor will assign default values to properties that have it defined,
and makes sure properties required by API are set, but the set of arguments
will change when the set of required properties is changed

### NewGetPurchasePriceRequestWithDefaults

`func NewGetPurchasePriceRequestWithDefaults() *GetPurchasePriceRequest`

NewGetPurchasePriceRequestWithDefaults instantiates a new GetPurchasePriceRequest object
This constructor will only assign default values to properties that have it defined,
but it doesn't guarantee that properties required by API are set

### GetMarketplace

`func (o *GetPurchasePriceRequest) GetMarketplace() Marketplace`

GetMarketplace returns the Marketplace field if non-nil, zero value otherwise.

### GetMarketplaceOk

`func (o *GetPurchasePriceRequest) GetMarketplaceOk() (*Marketplace, bool)`

GetMarketplaceOk returns a tuple with the Marketplace field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetMarketplace

`func (o *GetPurchasePriceRequest) SetMarketplace(v Marketplace)`

SetMarketplace sets Marketplace field to given value.


### GetNetwork

`func (o *GetPurchasePriceRequest) GetNetwork() Network`

GetNetwork returns the Network field if non-nil, zero value otherwise.

### GetNetworkOk

`func (o *GetPurchasePriceRequest) GetNetworkOk() (*Network, bool)`

GetNetworkOk returns a tuple with the Network field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetNetwork

`func (o *GetPurchasePriceRequest) SetNetwork(v Network)`

SetNetwork sets Network field to given value.


### GetUnit

`func (o *GetPurchasePriceRequest) GetUnit() string`

GetUnit returns the Unit field if non-nil, zero value otherwise.

### GetUnitOk

`func (o *GetPurchasePriceRequest) GetUnitOk() (*string, bool)`

GetUnitOk returns a tuple with the Unit field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetUnit

`func (o *GetPurchasePriceRequest) SetUnit(v string)`

SetUnit sets Unit field to given value.


### GetAmount

`func (o *GetPurchasePriceRequest) GetAmount() string`

GetAmount returns the Amount field if non-nil, zero value otherwise.

### GetAmountOk

`func (o *GetPurchasePriceRequest) GetAmountOk() (*string, bool)`

GetAmountOk returns a tuple with the Amount field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetAmount

`func (o *GetPurchasePriceRequest) SetAmount(v string)`

SetAmount sets Amount field to given value.



[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


