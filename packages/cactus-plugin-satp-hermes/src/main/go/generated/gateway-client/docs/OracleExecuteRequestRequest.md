# OracleExecuteRequestRequest

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**TaskID** | **string** | The unique identifier for the transfer task. | 
**Payload** | **string** | The payload to be written to the destination contract. | 
**DestinationNetwork** | [**Transact200ResponseStatusResponseDestinationNetwork**](Transact200ResponseStatusResponseDestinationNetwork.md) |  | 
**DestinationContract** | [**OracleExecuteRequestRequestDestinationContract**](OracleExecuteRequestRequestDestinationContract.md) |  | 
**WriteFunction** | [**OracleExecuteRequestRequestWriteFunction**](OracleExecuteRequestRequestWriteFunction.md) |  | 

## Methods

### NewOracleExecuteRequestRequest

`func NewOracleExecuteRequestRequest(taskID string, payload string, destinationNetwork Transact200ResponseStatusResponseDestinationNetwork, destinationContract OracleExecuteRequestRequestDestinationContract, writeFunction OracleExecuteRequestRequestWriteFunction, ) *OracleExecuteRequestRequest`

NewOracleExecuteRequestRequest instantiates a new OracleExecuteRequestRequest object
This constructor will assign default values to properties that have it defined,
and makes sure properties required by API are set, but the set of arguments
will change when the set of required properties is changed

### NewOracleExecuteRequestRequestWithDefaults

`func NewOracleExecuteRequestRequestWithDefaults() *OracleExecuteRequestRequest`

NewOracleExecuteRequestRequestWithDefaults instantiates a new OracleExecuteRequestRequest object
This constructor will only assign default values to properties that have it defined,
but it doesn't guarantee that properties required by API are set

### GetTaskID

`func (o *OracleExecuteRequestRequest) GetTaskID() string`

GetTaskID returns the TaskID field if non-nil, zero value otherwise.

### GetTaskIDOk

`func (o *OracleExecuteRequestRequest) GetTaskIDOk() (*string, bool)`

GetTaskIDOk returns a tuple with the TaskID field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetTaskID

`func (o *OracleExecuteRequestRequest) SetTaskID(v string)`

SetTaskID sets TaskID field to given value.


### GetPayload

`func (o *OracleExecuteRequestRequest) GetPayload() string`

GetPayload returns the Payload field if non-nil, zero value otherwise.

### GetPayloadOk

`func (o *OracleExecuteRequestRequest) GetPayloadOk() (*string, bool)`

GetPayloadOk returns a tuple with the Payload field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetPayload

`func (o *OracleExecuteRequestRequest) SetPayload(v string)`

SetPayload sets Payload field to given value.


### GetDestinationNetwork

`func (o *OracleExecuteRequestRequest) GetDestinationNetwork() Transact200ResponseStatusResponseDestinationNetwork`

GetDestinationNetwork returns the DestinationNetwork field if non-nil, zero value otherwise.

### GetDestinationNetworkOk

`func (o *OracleExecuteRequestRequest) GetDestinationNetworkOk() (*Transact200ResponseStatusResponseDestinationNetwork, bool)`

GetDestinationNetworkOk returns a tuple with the DestinationNetwork field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetDestinationNetwork

`func (o *OracleExecuteRequestRequest) SetDestinationNetwork(v Transact200ResponseStatusResponseDestinationNetwork)`

SetDestinationNetwork sets DestinationNetwork field to given value.


### GetDestinationContract

`func (o *OracleExecuteRequestRequest) GetDestinationContract() OracleExecuteRequestRequestDestinationContract`

GetDestinationContract returns the DestinationContract field if non-nil, zero value otherwise.

### GetDestinationContractOk

`func (o *OracleExecuteRequestRequest) GetDestinationContractOk() (*OracleExecuteRequestRequestDestinationContract, bool)`

GetDestinationContractOk returns a tuple with the DestinationContract field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetDestinationContract

`func (o *OracleExecuteRequestRequest) SetDestinationContract(v OracleExecuteRequestRequestDestinationContract)`

SetDestinationContract sets DestinationContract field to given value.


### GetWriteFunction

`func (o *OracleExecuteRequestRequest) GetWriteFunction() OracleExecuteRequestRequestWriteFunction`

GetWriteFunction returns the WriteFunction field if non-nil, zero value otherwise.

### GetWriteFunctionOk

`func (o *OracleExecuteRequestRequest) GetWriteFunctionOk() (*OracleExecuteRequestRequestWriteFunction, bool)`

GetWriteFunctionOk returns a tuple with the WriteFunction field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetWriteFunction

`func (o *OracleExecuteRequestRequest) SetWriteFunction(v OracleExecuteRequestRequestWriteFunction)`

SetWriteFunction sets WriteFunction field to given value.



[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


