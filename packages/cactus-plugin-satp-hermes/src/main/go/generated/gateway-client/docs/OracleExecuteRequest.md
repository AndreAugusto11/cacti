# OracleExecuteRequest

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**SourceNetwork** | Pointer to **string** | The source blockchain network identifier. Only if taskType is READ or READ_AND_UPDATE. | [optional] 
**DestinationNetwork** | **string** | The target blockchain network identifier. Only if taskType is UPDATE or READ_AND_UPDATE. | 
**SourceContract** | Pointer to **string** | The contract address on the source blockchain. Only if taskType is READ or READ_AND_UPDATE. | [optional] 
**DestinationContract** | **string** | The contract address on the destination blockchain. Only if taskType is UPDATE or READ_AND_UPDATE. | 
**ReadFunction** | Pointer to **string** | The function to be called on the source blockchain. Only if taskType is READ or READ_AND_UPDATE. | [optional] 
**WriteFunction** | **string** | The function to be called on the destination blockchain. Only if taskType is UPDATE or READ_AND_UPDATE. | 
**TaskType** | Pointer to **string** | The type of task to be registered. | [optional] 

## Methods

### NewOracleExecuteRequest

`func NewOracleExecuteRequest(destinationNetwork string, destinationContract string, writeFunction string, ) *OracleExecuteRequest`

NewOracleExecuteRequest instantiates a new OracleExecuteRequest object
This constructor will assign default values to properties that have it defined,
and makes sure properties required by API are set, but the set of arguments
will change when the set of required properties is changed

### NewOracleExecuteRequestWithDefaults

`func NewOracleExecuteRequestWithDefaults() *OracleExecuteRequest`

NewOracleExecuteRequestWithDefaults instantiates a new OracleExecuteRequest object
This constructor will only assign default values to properties that have it defined,
but it doesn't guarantee that properties required by API are set

### GetSourceNetwork

`func (o *OracleExecuteRequest) GetSourceNetwork() string`

GetSourceNetwork returns the SourceNetwork field if non-nil, zero value otherwise.

### GetSourceNetworkOk

`func (o *OracleExecuteRequest) GetSourceNetworkOk() (*string, bool)`

GetSourceNetworkOk returns a tuple with the SourceNetwork field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetSourceNetwork

`func (o *OracleExecuteRequest) SetSourceNetwork(v string)`

SetSourceNetwork sets SourceNetwork field to given value.

### HasSourceNetwork

`func (o *OracleExecuteRequest) HasSourceNetwork() bool`

HasSourceNetwork returns a boolean if a field has been set.

### GetDestinationNetwork

`func (o *OracleExecuteRequest) GetDestinationNetwork() string`

GetDestinationNetwork returns the DestinationNetwork field if non-nil, zero value otherwise.

### GetDestinationNetworkOk

`func (o *OracleExecuteRequest) GetDestinationNetworkOk() (*string, bool)`

GetDestinationNetworkOk returns a tuple with the DestinationNetwork field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetDestinationNetwork

`func (o *OracleExecuteRequest) SetDestinationNetwork(v string)`

SetDestinationNetwork sets DestinationNetwork field to given value.


### GetSourceContract

`func (o *OracleExecuteRequest) GetSourceContract() string`

GetSourceContract returns the SourceContract field if non-nil, zero value otherwise.

### GetSourceContractOk

`func (o *OracleExecuteRequest) GetSourceContractOk() (*string, bool)`

GetSourceContractOk returns a tuple with the SourceContract field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetSourceContract

`func (o *OracleExecuteRequest) SetSourceContract(v string)`

SetSourceContract sets SourceContract field to given value.

### HasSourceContract

`func (o *OracleExecuteRequest) HasSourceContract() bool`

HasSourceContract returns a boolean if a field has been set.

### GetDestinationContract

`func (o *OracleExecuteRequest) GetDestinationContract() string`

GetDestinationContract returns the DestinationContract field if non-nil, zero value otherwise.

### GetDestinationContractOk

`func (o *OracleExecuteRequest) GetDestinationContractOk() (*string, bool)`

GetDestinationContractOk returns a tuple with the DestinationContract field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetDestinationContract

`func (o *OracleExecuteRequest) SetDestinationContract(v string)`

SetDestinationContract sets DestinationContract field to given value.


### GetReadFunction

`func (o *OracleExecuteRequest) GetReadFunction() string`

GetReadFunction returns the ReadFunction field if non-nil, zero value otherwise.

### GetReadFunctionOk

`func (o *OracleExecuteRequest) GetReadFunctionOk() (*string, bool)`

GetReadFunctionOk returns a tuple with the ReadFunction field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetReadFunction

`func (o *OracleExecuteRequest) SetReadFunction(v string)`

SetReadFunction sets ReadFunction field to given value.

### HasReadFunction

`func (o *OracleExecuteRequest) HasReadFunction() bool`

HasReadFunction returns a boolean if a field has been set.

### GetWriteFunction

`func (o *OracleExecuteRequest) GetWriteFunction() string`

GetWriteFunction returns the WriteFunction field if non-nil, zero value otherwise.

### GetWriteFunctionOk

`func (o *OracleExecuteRequest) GetWriteFunctionOk() (*string, bool)`

GetWriteFunctionOk returns a tuple with the WriteFunction field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetWriteFunction

`func (o *OracleExecuteRequest) SetWriteFunction(v string)`

SetWriteFunction sets WriteFunction field to given value.


### GetTaskType

`func (o *OracleExecuteRequest) GetTaskType() string`

GetTaskType returns the TaskType field if non-nil, zero value otherwise.

### GetTaskTypeOk

`func (o *OracleExecuteRequest) GetTaskTypeOk() (*string, bool)`

GetTaskTypeOk returns a tuple with the TaskType field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetTaskType

`func (o *OracleExecuteRequest) SetTaskType(v string)`

SetTaskType sets TaskType field to given value.

### HasTaskType

`func (o *OracleExecuteRequest) HasTaskType() bool`

HasTaskType returns a boolean if a field has been set.


[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


