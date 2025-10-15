# RetireResponse

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**TxHashRetires** | **[]string** |  | 
**RetirementCertificateIds** | Pointer to **[]float32** |  | [optional] 

## Methods

### NewRetireResponse

`func NewRetireResponse(txHashRetires []string, ) *RetireResponse`

NewRetireResponse instantiates a new RetireResponse object
This constructor will assign default values to properties that have it defined,
and makes sure properties required by API are set, but the set of arguments
will change when the set of required properties is changed

### NewRetireResponseWithDefaults

`func NewRetireResponseWithDefaults() *RetireResponse`

NewRetireResponseWithDefaults instantiates a new RetireResponse object
This constructor will only assign default values to properties that have it defined,
but it doesn't guarantee that properties required by API are set

### GetTxHashRetires

`func (o *RetireResponse) GetTxHashRetires() []string`

GetTxHashRetires returns the TxHashRetires field if non-nil, zero value otherwise.

### GetTxHashRetiresOk

`func (o *RetireResponse) GetTxHashRetiresOk() (*[]string, bool)`

GetTxHashRetiresOk returns a tuple with the TxHashRetires field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetTxHashRetires

`func (o *RetireResponse) SetTxHashRetires(v []string)`

SetTxHashRetires sets TxHashRetires field to given value.


### GetRetirementCertificateIds

`func (o *RetireResponse) GetRetirementCertificateIds() []float32`

GetRetirementCertificateIds returns the RetirementCertificateIds field if non-nil, zero value otherwise.

### GetRetirementCertificateIdsOk

`func (o *RetireResponse) GetRetirementCertificateIdsOk() (*[]float32, bool)`

GetRetirementCertificateIdsOk returns a tuple with the RetirementCertificateIds field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetRetirementCertificateIds

`func (o *RetireResponse) SetRetirementCertificateIds(v []float32)`

SetRetirementCertificateIds sets RetirementCertificateIds field to given value.

### HasRetirementCertificateIds

`func (o *RetireResponse) HasRetirementCertificateIds() bool`

HasRetirementCertificateIds returns a boolean if a field has been set.


[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


