# RandomBuyResponse

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**TxHashSwap** | **string** |  | 
**AssetAmount** | **string** |  | 
**Tco2List** | Pointer to [**[]SpecificBuyResponseAssetAmountsInner**](SpecificBuyResponseAssetAmountsInner.md) |  | [optional] 

## Methods

### NewRandomBuyResponse

`func NewRandomBuyResponse(txHashSwap string, assetAmount string, ) *RandomBuyResponse`

NewRandomBuyResponse instantiates a new RandomBuyResponse object
This constructor will assign default values to properties that have it defined,
and makes sure properties required by API are set, but the set of arguments
will change when the set of required properties is changed

### NewRandomBuyResponseWithDefaults

`func NewRandomBuyResponseWithDefaults() *RandomBuyResponse`

NewRandomBuyResponseWithDefaults instantiates a new RandomBuyResponse object
This constructor will only assign default values to properties that have it defined,
but it doesn't guarantee that properties required by API are set

### GetTxHashSwap

`func (o *RandomBuyResponse) GetTxHashSwap() string`

GetTxHashSwap returns the TxHashSwap field if non-nil, zero value otherwise.

### GetTxHashSwapOk

`func (o *RandomBuyResponse) GetTxHashSwapOk() (*string, bool)`

GetTxHashSwapOk returns a tuple with the TxHashSwap field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetTxHashSwap

`func (o *RandomBuyResponse) SetTxHashSwap(v string)`

SetTxHashSwap sets TxHashSwap field to given value.


### GetAssetAmount

`func (o *RandomBuyResponse) GetAssetAmount() string`

GetAssetAmount returns the AssetAmount field if non-nil, zero value otherwise.

### GetAssetAmountOk

`func (o *RandomBuyResponse) GetAssetAmountOk() (*string, bool)`

GetAssetAmountOk returns a tuple with the AssetAmount field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetAssetAmount

`func (o *RandomBuyResponse) SetAssetAmount(v string)`

SetAssetAmount sets AssetAmount field to given value.


### GetTco2List

`func (o *RandomBuyResponse) GetTco2List() []SpecificBuyResponseAssetAmountsInner`

GetTco2List returns the Tco2List field if non-nil, zero value otherwise.

### GetTco2ListOk

`func (o *RandomBuyResponse) GetTco2ListOk() (*[]SpecificBuyResponseAssetAmountsInner, bool)`

GetTco2ListOk returns a tuple with the Tco2List field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetTco2List

`func (o *RandomBuyResponse) SetTco2List(v []SpecificBuyResponseAssetAmountsInner)`

SetTco2List sets Tco2List field to given value.

### HasTco2List

`func (o *RandomBuyResponse) HasTco2List() bool`

HasTco2List returns a boolean if a field has been set.


[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


