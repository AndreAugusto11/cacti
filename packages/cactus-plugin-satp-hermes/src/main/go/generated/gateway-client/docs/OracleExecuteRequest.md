# OracleExecuteRequest

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**TaskID** | **string** | The unique identifier for the transfer task. | 
**Payload** | **string** | The payload to be written to the destination contract. | 
**DestinationNetwork** | [**Transact200ResponseStatusResponseDestinationNetwork**](Transact200ResponseStatusResponseDestinationNetwork.md) |  | 
**DestinationContract** | [**OracleExecuteRequestRequestDestinationContract**](OracleExecuteRequestRequestDestinationContract.md) |  | 
**WriteFunction** | [**OracleExecuteRequestRequestWriteFunction**](OracleExecuteRequestRequestWriteFunction.md) |  | 

## Methods

### NewOracleExecuteRequest

`func NewOracleExecuteRequest(taskID string, payload string, destinationNetwork Transact200ResponseStatusResponseDestinationNetwork, destinationContract OracleExecuteRequestRequestDestinationContract, writeFunction OracleExecuteRequestRequestWriteFunction, ) *OracleExecuteRequest`

NewOracleExecuteRequest instantiates a new OracleExecuteRequest object
This constructor will assign default values to properties that have it defined,
and makes sure properties required by API are set, but the set of arguments
will change when the set of required properties is changed

### NewOracleExecuteRequestWithDefaults

`func NewOracleExecuteRequestWithDefaults() *OracleExecuteRequest`

NewOracleExecuteRequestWithDefaults instantiates a new OracleExecuteRequest object
This constructor will only assign default values to properties that have it defined,
but it doesn't guarantee that properties required by API are set

### GetTaskID

`func (o *OracleExecuteRequest) GetTaskID() string`

GetTaskID returns the TaskID field if non-nil, zero value otherwise.

### GetTaskIDOk

`func (o *OracleExecuteRequest) GetTaskIDOk() (*string, bool)`

GetTaskIDOk returns a tuple with the TaskID field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetTaskID

`func (o *OracleExecuteRequest) SetTaskID(v string)`

SetTaskID sets TaskID field to given value.


### GetPayload

`func (o *OracleExecuteRequest) GetPayload() string`

GetPayload returns the Payload field if non-nil, zero value otherwise.

### GetPayloadOk

`func (o *OracleExecuteRequest) GetPayloadOk() (*string, bool)`

GetPayloadOk returns a tuple with the Payload field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetPayload

`func (o *OracleExecuteRequest) SetPayload(v string)`

SetPayload sets Payload field to given value.


### GetDestinationNetwork

`func (o *OracleExecuteRequest) GetDestinationNetwork() Transact200ResponseStatusResponseDestinationNetwork`

GetDestinationNetwork returns the DestinationNetwork field if non-nil, zero value otherwise.

### GetDestinationNetworkOk

`func (o *OracleExecuteRequest) GetDestinationNetworkOk() (*Transact200ResponseStatusResponseDestinationNetwork, bool)`

GetDestinationNetworkOk returns a tuple with the DestinationNetwork field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetDestinationNetwork

`func (o *OracleExecuteRequest) SetDestinationNetwork(v Transact200ResponseStatusResponseDestinationNetwork)`

SetDestinationNetwork sets DestinationNetwork field to given value.


### GetDestinationContract

`func (o *OracleExecuteRequest) GetDestinationContract() OracleExecuteRequestRequestDestinationContract`

GetDestinationContract returns the DestinationContract field if non-nil, zero value otherwise.

### GetDestinationContractOk

`func (o *OracleExecuteRequest) GetDestinationContractOk() (*OracleExecuteRequestRequestDestinationContract, bool)`

GetDestinationContractOk returns a tuple with the DestinationContract field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetDestinationContract

`func (o *OracleExecuteRequest) SetDestinationContract(v OracleExecuteRequestRequestDestinationContract)`

SetDestinationContract sets DestinationContract field to given value.


### GetWriteFunction

`func (o *OracleExecuteRequest) GetWriteFunction() OracleExecuteRequestRequestWriteFunction`

GetWriteFunction returns the WriteFunction field if non-nil, zero value otherwise.

### GetWriteFunctionOk

`func (o *OracleExecuteRequest) GetWriteFunctionOk() (*OracleExecuteRequestRequestWriteFunction, bool)`

GetWriteFunctionOk returns a tuple with the WriteFunction field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetWriteFunction

`func (o *OracleExecuteRequest) SetWriteFunction(v OracleExecuteRequestRequestWriteFunction)`

SetWriteFunction sets WriteFunction field to given value.



[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


