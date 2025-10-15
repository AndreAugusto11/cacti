# SpecificBuyRequest

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**Marketplace** | [**Marketplace**](Marketplace.md) |  | 
**Network** | [**Network**](Network.md) |  | 
**PaymentToken** | **string** |  | 
**Items** | **map[string]string** | A mapping from address (string) to amount (string). | 

## Methods

### NewSpecificBuyRequest

`func NewSpecificBuyRequest(marketplace Marketplace, network Network, paymentToken string, items map[string]string, ) *SpecificBuyRequest`

NewSpecificBuyRequest instantiates a new SpecificBuyRequest object
This constructor will assign default values to properties that have it defined,
and makes sure properties required by API are set, but the set of arguments
will change when the set of required properties is changed

### NewSpecificBuyRequestWithDefaults

`func NewSpecificBuyRequestWithDefaults() *SpecificBuyRequest`

NewSpecificBuyRequestWithDefaults instantiates a new SpecificBuyRequest object
This constructor will only assign default values to properties that have it defined,
but it doesn't guarantee that properties required by API are set

### GetMarketplace

`func (o *SpecificBuyRequest) GetMarketplace() Marketplace`

GetMarketplace returns the Marketplace field if non-nil, zero value otherwise.

### GetMarketplaceOk

`func (o *SpecificBuyRequest) GetMarketplaceOk() (*Marketplace, bool)`

GetMarketplaceOk returns a tuple with the Marketplace field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetMarketplace

`func (o *SpecificBuyRequest) SetMarketplace(v Marketplace)`

SetMarketplace sets Marketplace field to given value.


### GetNetwork

`func (o *SpecificBuyRequest) GetNetwork() Network`

GetNetwork returns the Network field if non-nil, zero value otherwise.

### GetNetworkOk

`func (o *SpecificBuyRequest) GetNetworkOk() (*Network, bool)`

GetNetworkOk returns a tuple with the Network field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetNetwork

`func (o *SpecificBuyRequest) SetNetwork(v Network)`

SetNetwork sets Network field to given value.


### GetPaymentToken

`func (o *SpecificBuyRequest) GetPaymentToken() string`

GetPaymentToken returns the PaymentToken field if non-nil, zero value otherwise.

### GetPaymentTokenOk

`func (o *SpecificBuyRequest) GetPaymentTokenOk() (*string, bool)`

GetPaymentTokenOk returns a tuple with the PaymentToken field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetPaymentToken

`func (o *SpecificBuyRequest) SetPaymentToken(v string)`

SetPaymentToken sets PaymentToken field to given value.


### GetItems

`func (o *SpecificBuyRequest) GetItems() map[string]string`

GetItems returns the Items field if non-nil, zero value otherwise.

### GetItemsOk

`func (o *SpecificBuyRequest) GetItemsOk() (*map[string]string, bool)`

GetItemsOk returns a tuple with the Items field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetItems

`func (o *SpecificBuyRequest) SetItems(v map[string]string)`

SetItems sets Items field to given value.



[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


