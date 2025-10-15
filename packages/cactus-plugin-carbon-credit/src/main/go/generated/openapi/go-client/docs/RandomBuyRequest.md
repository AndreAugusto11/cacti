# RandomBuyRequest

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**Marketplace** | [**Marketplace**](Marketplace.md) |  | 
**Network** | [**Network**](Network.md) |  | 
**PaymentToken** | Pointer to **string** |  | [optional] 
**Amount** | **string** |  | 

## Methods

### NewRandomBuyRequest

`func NewRandomBuyRequest(marketplace Marketplace, network Network, amount string, ) *RandomBuyRequest`

NewRandomBuyRequest instantiates a new RandomBuyRequest object
This constructor will assign default values to properties that have it defined,
and makes sure properties required by API are set, but the set of arguments
will change when the set of required properties is changed

### NewRandomBuyRequestWithDefaults

`func NewRandomBuyRequestWithDefaults() *RandomBuyRequest`

NewRandomBuyRequestWithDefaults instantiates a new RandomBuyRequest object
This constructor will only assign default values to properties that have it defined,
but it doesn't guarantee that properties required by API are set

### GetMarketplace

`func (o *RandomBuyRequest) GetMarketplace() Marketplace`

GetMarketplace returns the Marketplace field if non-nil, zero value otherwise.

### GetMarketplaceOk

`func (o *RandomBuyRequest) GetMarketplaceOk() (*Marketplace, bool)`

GetMarketplaceOk returns a tuple with the Marketplace field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetMarketplace

`func (o *RandomBuyRequest) SetMarketplace(v Marketplace)`

SetMarketplace sets Marketplace field to given value.


### GetNetwork

`func (o *RandomBuyRequest) GetNetwork() Network`

GetNetwork returns the Network field if non-nil, zero value otherwise.

### GetNetworkOk

`func (o *RandomBuyRequest) GetNetworkOk() (*Network, bool)`

GetNetworkOk returns a tuple with the Network field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetNetwork

`func (o *RandomBuyRequest) SetNetwork(v Network)`

SetNetwork sets Network field to given value.


### GetPaymentToken

`func (o *RandomBuyRequest) GetPaymentToken() string`

GetPaymentToken returns the PaymentToken field if non-nil, zero value otherwise.

### GetPaymentTokenOk

`func (o *RandomBuyRequest) GetPaymentTokenOk() (*string, bool)`

GetPaymentTokenOk returns a tuple with the PaymentToken field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetPaymentToken

`func (o *RandomBuyRequest) SetPaymentToken(v string)`

SetPaymentToken sets PaymentToken field to given value.

### HasPaymentToken

`func (o *RandomBuyRequest) HasPaymentToken() bool`

HasPaymentToken returns a boolean if a field has been set.

### GetAmount

`func (o *RandomBuyRequest) GetAmount() string`

GetAmount returns the Amount field if non-nil, zero value otherwise.

### GetAmountOk

`func (o *RandomBuyRequest) GetAmountOk() (*string, bool)`

GetAmountOk returns a tuple with the Amount field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetAmount

`func (o *RandomBuyRequest) SetAmount(v string)`

SetAmount sets Amount field to given value.



[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


