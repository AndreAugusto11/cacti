# OracleRegisterRequestOracleRegisterRequestParameter

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**SourceNetwork** | Pointer to **string** | The source blockchain network identifier. | [optional] 
**TargetNetwork** | Pointer to **string** | The target blockchain network identifier. | [optional] 
**OriginContract** | **string** | The contract address on the source blockchain. | 
**DestinationContract** | Pointer to **string** | The contract address on the destination blockchain. | [optional] 
**EventOfInterest** | Pointer to **string** | The event of interest on the source blockchain. | [optional] 
**WriteFunction** | Pointer to **string** | The function to be called on the destination blockchain. | [optional] 

## Methods

### NewOracleRegisterRequestOracleRegisterRequestParameter

`func NewOracleRegisterRequestOracleRegisterRequestParameter(originContract string, ) *OracleRegisterRequestOracleRegisterRequestParameter`

NewOracleRegisterRequestOracleRegisterRequestParameter instantiates a new OracleRegisterRequestOracleRegisterRequestParameter object
This constructor will assign default values to properties that have it defined,
and makes sure properties required by API are set, but the set of arguments
will change when the set of required properties is changed

### NewOracleRegisterRequestOracleRegisterRequestParameterWithDefaults

`func NewOracleRegisterRequestOracleRegisterRequestParameterWithDefaults() *OracleRegisterRequestOracleRegisterRequestParameter`

NewOracleRegisterRequestOracleRegisterRequestParameterWithDefaults instantiates a new OracleRegisterRequestOracleRegisterRequestParameter object
This constructor will only assign default values to properties that have it defined,
but it doesn't guarantee that properties required by API are set

### GetSourceNetwork

`func (o *OracleRegisterRequestOracleRegisterRequestParameter) GetSourceNetwork() string`

GetSourceNetwork returns the SourceNetwork field if non-nil, zero value otherwise.

### GetSourceNetworkOk

`func (o *OracleRegisterRequestOracleRegisterRequestParameter) GetSourceNetworkOk() (*string, bool)`

GetSourceNetworkOk returns a tuple with the SourceNetwork field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetSourceNetwork

`func (o *OracleRegisterRequestOracleRegisterRequestParameter) SetSourceNetwork(v string)`

SetSourceNetwork sets SourceNetwork field to given value.

### HasSourceNetwork

`func (o *OracleRegisterRequestOracleRegisterRequestParameter) HasSourceNetwork() bool`

HasSourceNetwork returns a boolean if a field has been set.

### GetTargetNetwork

`func (o *OracleRegisterRequestOracleRegisterRequestParameter) GetTargetNetwork() string`

GetTargetNetwork returns the TargetNetwork field if non-nil, zero value otherwise.

### GetTargetNetworkOk

`func (o *OracleRegisterRequestOracleRegisterRequestParameter) GetTargetNetworkOk() (*string, bool)`

GetTargetNetworkOk returns a tuple with the TargetNetwork field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetTargetNetwork

`func (o *OracleRegisterRequestOracleRegisterRequestParameter) SetTargetNetwork(v string)`

SetTargetNetwork sets TargetNetwork field to given value.

### HasTargetNetwork

`func (o *OracleRegisterRequestOracleRegisterRequestParameter) HasTargetNetwork() bool`

HasTargetNetwork returns a boolean if a field has been set.

### GetOriginContract

`func (o *OracleRegisterRequestOracleRegisterRequestParameter) GetOriginContract() string`

GetOriginContract returns the OriginContract field if non-nil, zero value otherwise.

### GetOriginContractOk

`func (o *OracleRegisterRequestOracleRegisterRequestParameter) GetOriginContractOk() (*string, bool)`

GetOriginContractOk returns a tuple with the OriginContract field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetOriginContract

`func (o *OracleRegisterRequestOracleRegisterRequestParameter) SetOriginContract(v string)`

SetOriginContract sets OriginContract field to given value.


### GetDestinationContract

`func (o *OracleRegisterRequestOracleRegisterRequestParameter) GetDestinationContract() string`

GetDestinationContract returns the DestinationContract field if non-nil, zero value otherwise.

### GetDestinationContractOk

`func (o *OracleRegisterRequestOracleRegisterRequestParameter) GetDestinationContractOk() (*string, bool)`

GetDestinationContractOk returns a tuple with the DestinationContract field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetDestinationContract

`func (o *OracleRegisterRequestOracleRegisterRequestParameter) SetDestinationContract(v string)`

SetDestinationContract sets DestinationContract field to given value.

### HasDestinationContract

`func (o *OracleRegisterRequestOracleRegisterRequestParameter) HasDestinationContract() bool`

HasDestinationContract returns a boolean if a field has been set.

### GetEventOfInterest

`func (o *OracleRegisterRequestOracleRegisterRequestParameter) GetEventOfInterest() string`

GetEventOfInterest returns the EventOfInterest field if non-nil, zero value otherwise.

### GetEventOfInterestOk

`func (o *OracleRegisterRequestOracleRegisterRequestParameter) GetEventOfInterestOk() (*string, bool)`

GetEventOfInterestOk returns a tuple with the EventOfInterest field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetEventOfInterest

`func (o *OracleRegisterRequestOracleRegisterRequestParameter) SetEventOfInterest(v string)`

SetEventOfInterest sets EventOfInterest field to given value.

### HasEventOfInterest

`func (o *OracleRegisterRequestOracleRegisterRequestParameter) HasEventOfInterest() bool`

HasEventOfInterest returns a boolean if a field has been set.

### GetWriteFunction

`func (o *OracleRegisterRequestOracleRegisterRequestParameter) GetWriteFunction() string`

GetWriteFunction returns the WriteFunction field if non-nil, zero value otherwise.

### GetWriteFunctionOk

`func (o *OracleRegisterRequestOracleRegisterRequestParameter) GetWriteFunctionOk() (*string, bool)`

GetWriteFunctionOk returns a tuple with the WriteFunction field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetWriteFunction

`func (o *OracleRegisterRequestOracleRegisterRequestParameter) SetWriteFunction(v string)`

SetWriteFunction sets WriteFunction field to given value.

### HasWriteFunction

`func (o *OracleRegisterRequestOracleRegisterRequestParameter) HasWriteFunction() bool`

HasWriteFunction returns a boolean if a field has been set.


[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


