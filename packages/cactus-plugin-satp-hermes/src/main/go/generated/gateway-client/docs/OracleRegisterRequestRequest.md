# OracleRegisterRequestRequest

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**SourceNetwork** | Pointer to **string** | The source blockchain network identifier. Only if taskType is READ or READ_AND_UPDATE. | [optional] 
**TargetNetwork** | Pointer to **string** | The target blockchain network identifier. Only if taskType is UPDATE or READ_AND_UPDATE. | [optional] 
**SourceContract** | Pointer to **string** | The contract address on the source blockchain. Only if taskType is READ or READ_AND_UPDATE. | [optional] 
**DestinationContract** | Pointer to **string** | The contract address on the destination blockchain. Only if taskType is UPDATE or READ_AND_UPDATE. | [optional] 
**EventSignature** | Pointer to **string** | The signature of the event of interest on the source blockchain. Only if taskType is READ or READ_AND_UPDATE. | [optional] 
**SourceFunctionName** | Pointer to **string** | The function to be called on the source blockchain. Only if taskType is READ or READ_AND_UPDATE. | [optional] 
**SourceFunctionParams** | Pointer to **[]string** | The parameters for the function to be called on the source blockchain. Only if taskType is READ or READ_AND_UPDATE. | [optional] 
**DestinationFunctionName** | Pointer to **string** | The function to be called on the destination blockchain. Only if taskType is UPDATE or READ_AND_UPDATE. | [optional] 
**DestinationFunctionParams** | Pointer to **[]string** | The parameters for the function to be called on the destination blockchain. Only if taskType is UPDATE or READ_AND_UPDATE. | [optional] 
**TaskMode** | **string** | The mode of operation for the repeatable task. | 
**TaskInterval** | Pointer to **int32** | The interval for polling in milliseconds. Only if taskMode is POLLING. | [optional] 
**TaskType** | **string** | The type of task to be registered. | 

## Methods

### NewOracleRegisterRequestRequest

`func NewOracleRegisterRequestRequest(taskMode string, taskType string, ) *OracleRegisterRequestRequest`

NewOracleRegisterRequestRequest instantiates a new OracleRegisterRequestRequest object
This constructor will assign default values to properties that have it defined,
and makes sure properties required by API are set, but the set of arguments
will change when the set of required properties is changed

### NewOracleRegisterRequestRequestWithDefaults

`func NewOracleRegisterRequestRequestWithDefaults() *OracleRegisterRequestRequest`

NewOracleRegisterRequestRequestWithDefaults instantiates a new OracleRegisterRequestRequest object
This constructor will only assign default values to properties that have it defined,
but it doesn't guarantee that properties required by API are set

### GetSourceNetwork

`func (o *OracleRegisterRequestRequest) GetSourceNetwork() string`

GetSourceNetwork returns the SourceNetwork field if non-nil, zero value otherwise.

### GetSourceNetworkOk

`func (o *OracleRegisterRequestRequest) GetSourceNetworkOk() (*string, bool)`

GetSourceNetworkOk returns a tuple with the SourceNetwork field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetSourceNetwork

`func (o *OracleRegisterRequestRequest) SetSourceNetwork(v string)`

SetSourceNetwork sets SourceNetwork field to given value.

### HasSourceNetwork

`func (o *OracleRegisterRequestRequest) HasSourceNetwork() bool`

HasSourceNetwork returns a boolean if a field has been set.

### GetTargetNetwork

`func (o *OracleRegisterRequestRequest) GetTargetNetwork() string`

GetTargetNetwork returns the TargetNetwork field if non-nil, zero value otherwise.

### GetTargetNetworkOk

`func (o *OracleRegisterRequestRequest) GetTargetNetworkOk() (*string, bool)`

GetTargetNetworkOk returns a tuple with the TargetNetwork field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetTargetNetwork

`func (o *OracleRegisterRequestRequest) SetTargetNetwork(v string)`

SetTargetNetwork sets TargetNetwork field to given value.

### HasTargetNetwork

`func (o *OracleRegisterRequestRequest) HasTargetNetwork() bool`

HasTargetNetwork returns a boolean if a field has been set.

### GetSourceContract

`func (o *OracleRegisterRequestRequest) GetSourceContract() string`

GetSourceContract returns the SourceContract field if non-nil, zero value otherwise.

### GetSourceContractOk

`func (o *OracleRegisterRequestRequest) GetSourceContractOk() (*string, bool)`

GetSourceContractOk returns a tuple with the SourceContract field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetSourceContract

`func (o *OracleRegisterRequestRequest) SetSourceContract(v string)`

SetSourceContract sets SourceContract field to given value.

### HasSourceContract

`func (o *OracleRegisterRequestRequest) HasSourceContract() bool`

HasSourceContract returns a boolean if a field has been set.

### GetDestinationContract

`func (o *OracleRegisterRequestRequest) GetDestinationContract() string`

GetDestinationContract returns the DestinationContract field if non-nil, zero value otherwise.

### GetDestinationContractOk

`func (o *OracleRegisterRequestRequest) GetDestinationContractOk() (*string, bool)`

GetDestinationContractOk returns a tuple with the DestinationContract field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetDestinationContract

`func (o *OracleRegisterRequestRequest) SetDestinationContract(v string)`

SetDestinationContract sets DestinationContract field to given value.

### HasDestinationContract

`func (o *OracleRegisterRequestRequest) HasDestinationContract() bool`

HasDestinationContract returns a boolean if a field has been set.

### GetEventSignature

`func (o *OracleRegisterRequestRequest) GetEventSignature() string`

GetEventSignature returns the EventSignature field if non-nil, zero value otherwise.

### GetEventSignatureOk

`func (o *OracleRegisterRequestRequest) GetEventSignatureOk() (*string, bool)`

GetEventSignatureOk returns a tuple with the EventSignature field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetEventSignature

`func (o *OracleRegisterRequestRequest) SetEventSignature(v string)`

SetEventSignature sets EventSignature field to given value.

### HasEventSignature

`func (o *OracleRegisterRequestRequest) HasEventSignature() bool`

HasEventSignature returns a boolean if a field has been set.

### GetSourceFunctionName

`func (o *OracleRegisterRequestRequest) GetSourceFunctionName() string`

GetSourceFunctionName returns the SourceFunctionName field if non-nil, zero value otherwise.

### GetSourceFunctionNameOk

`func (o *OracleRegisterRequestRequest) GetSourceFunctionNameOk() (*string, bool)`

GetSourceFunctionNameOk returns a tuple with the SourceFunctionName field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetSourceFunctionName

`func (o *OracleRegisterRequestRequest) SetSourceFunctionName(v string)`

SetSourceFunctionName sets SourceFunctionName field to given value.

### HasSourceFunctionName

`func (o *OracleRegisterRequestRequest) HasSourceFunctionName() bool`

HasSourceFunctionName returns a boolean if a field has been set.

### GetSourceFunctionParams

`func (o *OracleRegisterRequestRequest) GetSourceFunctionParams() []string`

GetSourceFunctionParams returns the SourceFunctionParams field if non-nil, zero value otherwise.

### GetSourceFunctionParamsOk

`func (o *OracleRegisterRequestRequest) GetSourceFunctionParamsOk() (*[]string, bool)`

GetSourceFunctionParamsOk returns a tuple with the SourceFunctionParams field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetSourceFunctionParams

`func (o *OracleRegisterRequestRequest) SetSourceFunctionParams(v []string)`

SetSourceFunctionParams sets SourceFunctionParams field to given value.

### HasSourceFunctionParams

`func (o *OracleRegisterRequestRequest) HasSourceFunctionParams() bool`

HasSourceFunctionParams returns a boolean if a field has been set.

### GetDestinationFunctionName

`func (o *OracleRegisterRequestRequest) GetDestinationFunctionName() string`

GetDestinationFunctionName returns the DestinationFunctionName field if non-nil, zero value otherwise.

### GetDestinationFunctionNameOk

`func (o *OracleRegisterRequestRequest) GetDestinationFunctionNameOk() (*string, bool)`

GetDestinationFunctionNameOk returns a tuple with the DestinationFunctionName field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetDestinationFunctionName

`func (o *OracleRegisterRequestRequest) SetDestinationFunctionName(v string)`

SetDestinationFunctionName sets DestinationFunctionName field to given value.

### HasDestinationFunctionName

`func (o *OracleRegisterRequestRequest) HasDestinationFunctionName() bool`

HasDestinationFunctionName returns a boolean if a field has been set.

### GetDestinationFunctionParams

`func (o *OracleRegisterRequestRequest) GetDestinationFunctionParams() []string`

GetDestinationFunctionParams returns the DestinationFunctionParams field if non-nil, zero value otherwise.

### GetDestinationFunctionParamsOk

`func (o *OracleRegisterRequestRequest) GetDestinationFunctionParamsOk() (*[]string, bool)`

GetDestinationFunctionParamsOk returns a tuple with the DestinationFunctionParams field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetDestinationFunctionParams

`func (o *OracleRegisterRequestRequest) SetDestinationFunctionParams(v []string)`

SetDestinationFunctionParams sets DestinationFunctionParams field to given value.

### HasDestinationFunctionParams

`func (o *OracleRegisterRequestRequest) HasDestinationFunctionParams() bool`

HasDestinationFunctionParams returns a boolean if a field has been set.

### GetTaskMode

`func (o *OracleRegisterRequestRequest) GetTaskMode() string`

GetTaskMode returns the TaskMode field if non-nil, zero value otherwise.

### GetTaskModeOk

`func (o *OracleRegisterRequestRequest) GetTaskModeOk() (*string, bool)`

GetTaskModeOk returns a tuple with the TaskMode field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetTaskMode

`func (o *OracleRegisterRequestRequest) SetTaskMode(v string)`

SetTaskMode sets TaskMode field to given value.


### GetTaskInterval

`func (o *OracleRegisterRequestRequest) GetTaskInterval() int32`

GetTaskInterval returns the TaskInterval field if non-nil, zero value otherwise.

### GetTaskIntervalOk

`func (o *OracleRegisterRequestRequest) GetTaskIntervalOk() (*int32, bool)`

GetTaskIntervalOk returns a tuple with the TaskInterval field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetTaskInterval

`func (o *OracleRegisterRequestRequest) SetTaskInterval(v int32)`

SetTaskInterval sets TaskInterval field to given value.

### HasTaskInterval

`func (o *OracleRegisterRequestRequest) HasTaskInterval() bool`

HasTaskInterval returns a boolean if a field has been set.

### GetTaskType

`func (o *OracleRegisterRequestRequest) GetTaskType() string`

GetTaskType returns the TaskType field if non-nil, zero value otherwise.

### GetTaskTypeOk

`func (o *OracleRegisterRequestRequest) GetTaskTypeOk() (*string, bool)`

GetTaskTypeOk returns a tuple with the TaskType field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetTaskType

`func (o *OracleRegisterRequestRequest) SetTaskType(v string)`

SetTaskType sets TaskType field to given value.



[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


