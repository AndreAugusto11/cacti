# RetireRequest

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**Marketplace** | [**Marketplace**](Marketplace.md) |  | 
**Network** | [**Network**](Network.md) |  | 
**EntityName** | **string** |  | 
**Tco2s** | **[]string** |  | 
**Amounts** | **[]string** |  | 
**BeneficiaryAddress** | **string** |  | 
**BeneficiaryName** | **string** |  | 
**Message** | Pointer to **string** |  | [optional] 
**RetirementReason** | **string** |  | 

## Methods

### NewRetireRequest

`func NewRetireRequest(marketplace Marketplace, network Network, entityName string, tco2s []string, amounts []string, beneficiaryAddress string, beneficiaryName string, retirementReason string, ) *RetireRequest`

NewRetireRequest instantiates a new RetireRequest object
This constructor will assign default values to properties that have it defined,
and makes sure properties required by API are set, but the set of arguments
will change when the set of required properties is changed

### NewRetireRequestWithDefaults

`func NewRetireRequestWithDefaults() *RetireRequest`

NewRetireRequestWithDefaults instantiates a new RetireRequest object
This constructor will only assign default values to properties that have it defined,
but it doesn't guarantee that properties required by API are set

### GetMarketplace

`func (o *RetireRequest) GetMarketplace() Marketplace`

GetMarketplace returns the Marketplace field if non-nil, zero value otherwise.

### GetMarketplaceOk

`func (o *RetireRequest) GetMarketplaceOk() (*Marketplace, bool)`

GetMarketplaceOk returns a tuple with the Marketplace field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetMarketplace

`func (o *RetireRequest) SetMarketplace(v Marketplace)`

SetMarketplace sets Marketplace field to given value.


### GetNetwork

`func (o *RetireRequest) GetNetwork() Network`

GetNetwork returns the Network field if non-nil, zero value otherwise.

### GetNetworkOk

`func (o *RetireRequest) GetNetworkOk() (*Network, bool)`

GetNetworkOk returns a tuple with the Network field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetNetwork

`func (o *RetireRequest) SetNetwork(v Network)`

SetNetwork sets Network field to given value.


### GetEntityName

`func (o *RetireRequest) GetEntityName() string`

GetEntityName returns the EntityName field if non-nil, zero value otherwise.

### GetEntityNameOk

`func (o *RetireRequest) GetEntityNameOk() (*string, bool)`

GetEntityNameOk returns a tuple with the EntityName field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetEntityName

`func (o *RetireRequest) SetEntityName(v string)`

SetEntityName sets EntityName field to given value.


### GetTco2s

`func (o *RetireRequest) GetTco2s() []string`

GetTco2s returns the Tco2s field if non-nil, zero value otherwise.

### GetTco2sOk

`func (o *RetireRequest) GetTco2sOk() (*[]string, bool)`

GetTco2sOk returns a tuple with the Tco2s field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetTco2s

`func (o *RetireRequest) SetTco2s(v []string)`

SetTco2s sets Tco2s field to given value.


### GetAmounts

`func (o *RetireRequest) GetAmounts() []string`

GetAmounts returns the Amounts field if non-nil, zero value otherwise.

### GetAmountsOk

`func (o *RetireRequest) GetAmountsOk() (*[]string, bool)`

GetAmountsOk returns a tuple with the Amounts field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetAmounts

`func (o *RetireRequest) SetAmounts(v []string)`

SetAmounts sets Amounts field to given value.


### GetBeneficiaryAddress

`func (o *RetireRequest) GetBeneficiaryAddress() string`

GetBeneficiaryAddress returns the BeneficiaryAddress field if non-nil, zero value otherwise.

### GetBeneficiaryAddressOk

`func (o *RetireRequest) GetBeneficiaryAddressOk() (*string, bool)`

GetBeneficiaryAddressOk returns a tuple with the BeneficiaryAddress field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetBeneficiaryAddress

`func (o *RetireRequest) SetBeneficiaryAddress(v string)`

SetBeneficiaryAddress sets BeneficiaryAddress field to given value.


### GetBeneficiaryName

`func (o *RetireRequest) GetBeneficiaryName() string`

GetBeneficiaryName returns the BeneficiaryName field if non-nil, zero value otherwise.

### GetBeneficiaryNameOk

`func (o *RetireRequest) GetBeneficiaryNameOk() (*string, bool)`

GetBeneficiaryNameOk returns a tuple with the BeneficiaryName field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetBeneficiaryName

`func (o *RetireRequest) SetBeneficiaryName(v string)`

SetBeneficiaryName sets BeneficiaryName field to given value.


### GetMessage

`func (o *RetireRequest) GetMessage() string`

GetMessage returns the Message field if non-nil, zero value otherwise.

### GetMessageOk

`func (o *RetireRequest) GetMessageOk() (*string, bool)`

GetMessageOk returns a tuple with the Message field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetMessage

`func (o *RetireRequest) SetMessage(v string)`

SetMessage sets Message field to given value.

### HasMessage

`func (o *RetireRequest) HasMessage() bool`

HasMessage returns a boolean if a field has been set.

### GetRetirementReason

`func (o *RetireRequest) GetRetirementReason() string`

GetRetirementReason returns the RetirementReason field if non-nil, zero value otherwise.

### GetRetirementReasonOk

`func (o *RetireRequest) GetRetirementReasonOk() (*string, bool)`

GetRetirementReasonOk returns a tuple with the RetirementReason field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetRetirementReason

`func (o *RetireRequest) SetRetirementReason(v string)`

SetRetirementReason sets RetirementReason field to given value.



[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


