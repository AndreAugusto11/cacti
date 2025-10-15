# GetPurchasePriceResponse

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**Price** | **int32** | The current price in USDC for the requested amount. | 

## Methods

### NewGetPurchasePriceResponse

`func NewGetPurchasePriceResponse(price int32, ) *GetPurchasePriceResponse`

NewGetPurchasePriceResponse instantiates a new GetPurchasePriceResponse object
This constructor will assign default values to properties that have it defined,
and makes sure properties required by API are set, but the set of arguments
will change when the set of required properties is changed

### NewGetPurchasePriceResponseWithDefaults

`func NewGetPurchasePriceResponseWithDefaults() *GetPurchasePriceResponse`

NewGetPurchasePriceResponseWithDefaults instantiates a new GetPurchasePriceResponse object
This constructor will only assign default values to properties that have it defined,
but it doesn't guarantee that properties required by API are set

### GetPrice

`func (o *GetPurchasePriceResponse) GetPrice() int32`

GetPrice returns the Price field if non-nil, zero value otherwise.

### GetPriceOk

`func (o *GetPurchasePriceResponse) GetPriceOk() (*int32, bool)`

GetPriceOk returns a tuple with the Price field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetPrice

`func (o *GetPurchasePriceResponse) SetPrice(v int32)`

SetPrice sets Price field to given value.



[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


