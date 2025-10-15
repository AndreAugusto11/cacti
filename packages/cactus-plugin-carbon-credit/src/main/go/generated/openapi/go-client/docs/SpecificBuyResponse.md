# SpecificBuyResponse

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**TxHashSwap** | **string** |  | 
**BuyTxHash** | **string** |  | 
**AssetAmounts** | [**[]SpecificBuyResponseAssetAmountsInner**](SpecificBuyResponseAssetAmountsInner.md) |  | 

## Methods

### NewSpecificBuyResponse

`func NewSpecificBuyResponse(txHashSwap string, buyTxHash string, assetAmounts []SpecificBuyResponseAssetAmountsInner, ) *SpecificBuyResponse`

NewSpecificBuyResponse instantiates a new SpecificBuyResponse object
This constructor will assign default values to properties that have it defined,
and makes sure properties required by API are set, but the set of arguments
will change when the set of required properties is changed

### NewSpecificBuyResponseWithDefaults

`func NewSpecificBuyResponseWithDefaults() *SpecificBuyResponse`

NewSpecificBuyResponseWithDefaults instantiates a new SpecificBuyResponse object
This constructor will only assign default values to properties that have it defined,
but it doesn't guarantee that properties required by API are set

### GetTxHashSwap

`func (o *SpecificBuyResponse) GetTxHashSwap() string`

GetTxHashSwap returns the TxHashSwap field if non-nil, zero value otherwise.

### GetTxHashSwapOk

`func (o *SpecificBuyResponse) GetTxHashSwapOk() (*string, bool)`

GetTxHashSwapOk returns a tuple with the TxHashSwap field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetTxHashSwap

`func (o *SpecificBuyResponse) SetTxHashSwap(v string)`

SetTxHashSwap sets TxHashSwap field to given value.


### GetBuyTxHash

`func (o *SpecificBuyResponse) GetBuyTxHash() string`

GetBuyTxHash returns the BuyTxHash field if non-nil, zero value otherwise.

### GetBuyTxHashOk

`func (o *SpecificBuyResponse) GetBuyTxHashOk() (*string, bool)`

GetBuyTxHashOk returns a tuple with the BuyTxHash field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetBuyTxHash

`func (o *SpecificBuyResponse) SetBuyTxHash(v string)`

SetBuyTxHash sets BuyTxHash field to given value.


### GetAssetAmounts

`func (o *SpecificBuyResponse) GetAssetAmounts() []SpecificBuyResponseAssetAmountsInner`

GetAssetAmounts returns the AssetAmounts field if non-nil, zero value otherwise.

### GetAssetAmountsOk

`func (o *SpecificBuyResponse) GetAssetAmountsOk() (*[]SpecificBuyResponseAssetAmountsInner, bool)`

GetAssetAmountsOk returns a tuple with the AssetAmounts field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetAssetAmounts

`func (o *SpecificBuyResponse) SetAssetAmounts(v []SpecificBuyResponseAssetAmountsInner)`

SetAssetAmounts sets AssetAmounts field to given value.



[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


