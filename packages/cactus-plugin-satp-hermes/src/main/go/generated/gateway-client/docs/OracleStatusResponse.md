# OracleStatusResponse

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**ContextID** | Pointer to **string** | The unique identifier for the context of the data transfer task. | [optional] 
**OriginNetwork** | Pointer to [**Transact200ResponseStatusResponseOriginNetwork**](Transact200ResponseStatusResponseOriginNetwork.md) |  | [optional] 
**DestinationNetwork** | Pointer to [**Transact200ResponseStatusResponseDestinationNetwork**](Transact200ResponseStatusResponseDestinationNetwork.md) |  | [optional] 
**OriginContract** | Pointer to [**OracleStatusRequest200ResponseOriginContract**](OracleStatusRequest200ResponseOriginContract.md) |  | [optional] 
**DestinationContract** | Pointer to [**OracleExecuteRequestRequestDestinationContract**](OracleExecuteRequestRequestDestinationContract.md) |  | [optional] 
**EventOfInterest** | Pointer to [**OracleStatusRequest200ResponseEventOfInterest**](OracleStatusRequest200ResponseEventOfInterest.md) |  | [optional] 
**WriteFunction** | Pointer to [**OracleExecuteRequestRequestWriteFunction**](OracleExecuteRequestRequestWriteFunction.md) |  | [optional] 
**Tasks** | Pointer to [**[]OracleStatusRequest200ResponseTasksInner**](OracleStatusRequest200ResponseTasksInner.md) |  | [optional] 
**Status** | Pointer to **string** | The status of the data transfer task. | [optional] 

## Methods

### NewOracleStatusResponse

`func NewOracleStatusResponse() *OracleStatusResponse`

NewOracleStatusResponse instantiates a new OracleStatusResponse object
This constructor will assign default values to properties that have it defined,
and makes sure properties required by API are set, but the set of arguments
will change when the set of required properties is changed

### NewOracleStatusResponseWithDefaults

`func NewOracleStatusResponseWithDefaults() *OracleStatusResponse`

NewOracleStatusResponseWithDefaults instantiates a new OracleStatusResponse object
This constructor will only assign default values to properties that have it defined,
but it doesn't guarantee that properties required by API are set

### GetContextID

`func (o *OracleStatusResponse) GetContextID() string`

GetContextID returns the ContextID field if non-nil, zero value otherwise.

### GetContextIDOk

`func (o *OracleStatusResponse) GetContextIDOk() (*string, bool)`

GetContextIDOk returns a tuple with the ContextID field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetContextID

`func (o *OracleStatusResponse) SetContextID(v string)`

SetContextID sets ContextID field to given value.

### HasContextID

`func (o *OracleStatusResponse) HasContextID() bool`

HasContextID returns a boolean if a field has been set.

### GetOriginNetwork

`func (o *OracleStatusResponse) GetOriginNetwork() Transact200ResponseStatusResponseOriginNetwork`

GetOriginNetwork returns the OriginNetwork field if non-nil, zero value otherwise.

### GetOriginNetworkOk

`func (o *OracleStatusResponse) GetOriginNetworkOk() (*Transact200ResponseStatusResponseOriginNetwork, bool)`

GetOriginNetworkOk returns a tuple with the OriginNetwork field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetOriginNetwork

`func (o *OracleStatusResponse) SetOriginNetwork(v Transact200ResponseStatusResponseOriginNetwork)`

SetOriginNetwork sets OriginNetwork field to given value.

### HasOriginNetwork

`func (o *OracleStatusResponse) HasOriginNetwork() bool`

HasOriginNetwork returns a boolean if a field has been set.

### GetDestinationNetwork

`func (o *OracleStatusResponse) GetDestinationNetwork() Transact200ResponseStatusResponseDestinationNetwork`

GetDestinationNetwork returns the DestinationNetwork field if non-nil, zero value otherwise.

### GetDestinationNetworkOk

`func (o *OracleStatusResponse) GetDestinationNetworkOk() (*Transact200ResponseStatusResponseDestinationNetwork, bool)`

GetDestinationNetworkOk returns a tuple with the DestinationNetwork field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetDestinationNetwork

`func (o *OracleStatusResponse) SetDestinationNetwork(v Transact200ResponseStatusResponseDestinationNetwork)`

SetDestinationNetwork sets DestinationNetwork field to given value.

### HasDestinationNetwork

`func (o *OracleStatusResponse) HasDestinationNetwork() bool`

HasDestinationNetwork returns a boolean if a field has been set.

### GetOriginContract

`func (o *OracleStatusResponse) GetOriginContract() OracleStatusRequest200ResponseOriginContract`

GetOriginContract returns the OriginContract field if non-nil, zero value otherwise.

### GetOriginContractOk

`func (o *OracleStatusResponse) GetOriginContractOk() (*OracleStatusRequest200ResponseOriginContract, bool)`

GetOriginContractOk returns a tuple with the OriginContract field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetOriginContract

`func (o *OracleStatusResponse) SetOriginContract(v OracleStatusRequest200ResponseOriginContract)`

SetOriginContract sets OriginContract field to given value.

### HasOriginContract

`func (o *OracleStatusResponse) HasOriginContract() bool`

HasOriginContract returns a boolean if a field has been set.

### GetDestinationContract

`func (o *OracleStatusResponse) GetDestinationContract() OracleExecuteRequestRequestDestinationContract`

GetDestinationContract returns the DestinationContract field if non-nil, zero value otherwise.

### GetDestinationContractOk

`func (o *OracleStatusResponse) GetDestinationContractOk() (*OracleExecuteRequestRequestDestinationContract, bool)`

GetDestinationContractOk returns a tuple with the DestinationContract field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetDestinationContract

`func (o *OracleStatusResponse) SetDestinationContract(v OracleExecuteRequestRequestDestinationContract)`

SetDestinationContract sets DestinationContract field to given value.

### HasDestinationContract

`func (o *OracleStatusResponse) HasDestinationContract() bool`

HasDestinationContract returns a boolean if a field has been set.

### GetEventOfInterest

`func (o *OracleStatusResponse) GetEventOfInterest() OracleStatusRequest200ResponseEventOfInterest`

GetEventOfInterest returns the EventOfInterest field if non-nil, zero value otherwise.

### GetEventOfInterestOk

`func (o *OracleStatusResponse) GetEventOfInterestOk() (*OracleStatusRequest200ResponseEventOfInterest, bool)`

GetEventOfInterestOk returns a tuple with the EventOfInterest field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetEventOfInterest

`func (o *OracleStatusResponse) SetEventOfInterest(v OracleStatusRequest200ResponseEventOfInterest)`

SetEventOfInterest sets EventOfInterest field to given value.

### HasEventOfInterest

`func (o *OracleStatusResponse) HasEventOfInterest() bool`

HasEventOfInterest returns a boolean if a field has been set.

### GetWriteFunction

`func (o *OracleStatusResponse) GetWriteFunction() OracleExecuteRequestRequestWriteFunction`

GetWriteFunction returns the WriteFunction field if non-nil, zero value otherwise.

### GetWriteFunctionOk

`func (o *OracleStatusResponse) GetWriteFunctionOk() (*OracleExecuteRequestRequestWriteFunction, bool)`

GetWriteFunctionOk returns a tuple with the WriteFunction field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetWriteFunction

`func (o *OracleStatusResponse) SetWriteFunction(v OracleExecuteRequestRequestWriteFunction)`

SetWriteFunction sets WriteFunction field to given value.

### HasWriteFunction

`func (o *OracleStatusResponse) HasWriteFunction() bool`

HasWriteFunction returns a boolean if a field has been set.

### GetTasks

`func (o *OracleStatusResponse) GetTasks() []OracleStatusRequest200ResponseTasksInner`

GetTasks returns the Tasks field if non-nil, zero value otherwise.

### GetTasksOk

`func (o *OracleStatusResponse) GetTasksOk() (*[]OracleStatusRequest200ResponseTasksInner, bool)`

GetTasksOk returns a tuple with the Tasks field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetTasks

`func (o *OracleStatusResponse) SetTasks(v []OracleStatusRequest200ResponseTasksInner)`

SetTasks sets Tasks field to given value.

### HasTasks

`func (o *OracleStatusResponse) HasTasks() bool`

HasTasks returns a boolean if a field has been set.

### GetStatus

`func (o *OracleStatusResponse) GetStatus() string`

GetStatus returns the Status field if non-nil, zero value otherwise.

### GetStatusOk

`func (o *OracleStatusResponse) GetStatusOk() (*string, bool)`

GetStatusOk returns a tuple with the Status field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetStatus

`func (o *OracleStatusResponse) SetStatus(v string)`

SetStatus sets Status field to given value.

### HasStatus

`func (o *OracleStatusResponse) HasStatus() bool`

HasStatus returns a boolean if a field has been set.


[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


