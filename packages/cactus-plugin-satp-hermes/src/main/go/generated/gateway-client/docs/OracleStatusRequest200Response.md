# OracleStatusRequest200Response

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

### NewOracleStatusRequest200Response

`func NewOracleStatusRequest200Response() *OracleStatusRequest200Response`

NewOracleStatusRequest200Response instantiates a new OracleStatusRequest200Response object
This constructor will assign default values to properties that have it defined,
and makes sure properties required by API are set, but the set of arguments
will change when the set of required properties is changed

### NewOracleStatusRequest200ResponseWithDefaults

`func NewOracleStatusRequest200ResponseWithDefaults() *OracleStatusRequest200Response`

NewOracleStatusRequest200ResponseWithDefaults instantiates a new OracleStatusRequest200Response object
This constructor will only assign default values to properties that have it defined,
but it doesn't guarantee that properties required by API are set

### GetContextID

`func (o *OracleStatusRequest200Response) GetContextID() string`

GetContextID returns the ContextID field if non-nil, zero value otherwise.

### GetContextIDOk

`func (o *OracleStatusRequest200Response) GetContextIDOk() (*string, bool)`

GetContextIDOk returns a tuple with the ContextID field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetContextID

`func (o *OracleStatusRequest200Response) SetContextID(v string)`

SetContextID sets ContextID field to given value.

### HasContextID

`func (o *OracleStatusRequest200Response) HasContextID() bool`

HasContextID returns a boolean if a field has been set.

### GetOriginNetwork

`func (o *OracleStatusRequest200Response) GetOriginNetwork() Transact200ResponseStatusResponseOriginNetwork`

GetOriginNetwork returns the OriginNetwork field if non-nil, zero value otherwise.

### GetOriginNetworkOk

`func (o *OracleStatusRequest200Response) GetOriginNetworkOk() (*Transact200ResponseStatusResponseOriginNetwork, bool)`

GetOriginNetworkOk returns a tuple with the OriginNetwork field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetOriginNetwork

`func (o *OracleStatusRequest200Response) SetOriginNetwork(v Transact200ResponseStatusResponseOriginNetwork)`

SetOriginNetwork sets OriginNetwork field to given value.

### HasOriginNetwork

`func (o *OracleStatusRequest200Response) HasOriginNetwork() bool`

HasOriginNetwork returns a boolean if a field has been set.

### GetDestinationNetwork

`func (o *OracleStatusRequest200Response) GetDestinationNetwork() Transact200ResponseStatusResponseDestinationNetwork`

GetDestinationNetwork returns the DestinationNetwork field if non-nil, zero value otherwise.

### GetDestinationNetworkOk

`func (o *OracleStatusRequest200Response) GetDestinationNetworkOk() (*Transact200ResponseStatusResponseDestinationNetwork, bool)`

GetDestinationNetworkOk returns a tuple with the DestinationNetwork field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetDestinationNetwork

`func (o *OracleStatusRequest200Response) SetDestinationNetwork(v Transact200ResponseStatusResponseDestinationNetwork)`

SetDestinationNetwork sets DestinationNetwork field to given value.

### HasDestinationNetwork

`func (o *OracleStatusRequest200Response) HasDestinationNetwork() bool`

HasDestinationNetwork returns a boolean if a field has been set.

### GetOriginContract

`func (o *OracleStatusRequest200Response) GetOriginContract() OracleStatusRequest200ResponseOriginContract`

GetOriginContract returns the OriginContract field if non-nil, zero value otherwise.

### GetOriginContractOk

`func (o *OracleStatusRequest200Response) GetOriginContractOk() (*OracleStatusRequest200ResponseOriginContract, bool)`

GetOriginContractOk returns a tuple with the OriginContract field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetOriginContract

`func (o *OracleStatusRequest200Response) SetOriginContract(v OracleStatusRequest200ResponseOriginContract)`

SetOriginContract sets OriginContract field to given value.

### HasOriginContract

`func (o *OracleStatusRequest200Response) HasOriginContract() bool`

HasOriginContract returns a boolean if a field has been set.

### GetDestinationContract

`func (o *OracleStatusRequest200Response) GetDestinationContract() OracleExecuteRequestRequestDestinationContract`

GetDestinationContract returns the DestinationContract field if non-nil, zero value otherwise.

### GetDestinationContractOk

`func (o *OracleStatusRequest200Response) GetDestinationContractOk() (*OracleExecuteRequestRequestDestinationContract, bool)`

GetDestinationContractOk returns a tuple with the DestinationContract field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetDestinationContract

`func (o *OracleStatusRequest200Response) SetDestinationContract(v OracleExecuteRequestRequestDestinationContract)`

SetDestinationContract sets DestinationContract field to given value.

### HasDestinationContract

`func (o *OracleStatusRequest200Response) HasDestinationContract() bool`

HasDestinationContract returns a boolean if a field has been set.

### GetEventOfInterest

`func (o *OracleStatusRequest200Response) GetEventOfInterest() OracleStatusRequest200ResponseEventOfInterest`

GetEventOfInterest returns the EventOfInterest field if non-nil, zero value otherwise.

### GetEventOfInterestOk

`func (o *OracleStatusRequest200Response) GetEventOfInterestOk() (*OracleStatusRequest200ResponseEventOfInterest, bool)`

GetEventOfInterestOk returns a tuple with the EventOfInterest field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetEventOfInterest

`func (o *OracleStatusRequest200Response) SetEventOfInterest(v OracleStatusRequest200ResponseEventOfInterest)`

SetEventOfInterest sets EventOfInterest field to given value.

### HasEventOfInterest

`func (o *OracleStatusRequest200Response) HasEventOfInterest() bool`

HasEventOfInterest returns a boolean if a field has been set.

### GetWriteFunction

`func (o *OracleStatusRequest200Response) GetWriteFunction() OracleExecuteRequestRequestWriteFunction`

GetWriteFunction returns the WriteFunction field if non-nil, zero value otherwise.

### GetWriteFunctionOk

`func (o *OracleStatusRequest200Response) GetWriteFunctionOk() (*OracleExecuteRequestRequestWriteFunction, bool)`

GetWriteFunctionOk returns a tuple with the WriteFunction field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetWriteFunction

`func (o *OracleStatusRequest200Response) SetWriteFunction(v OracleExecuteRequestRequestWriteFunction)`

SetWriteFunction sets WriteFunction field to given value.

### HasWriteFunction

`func (o *OracleStatusRequest200Response) HasWriteFunction() bool`

HasWriteFunction returns a boolean if a field has been set.

### GetTasks

`func (o *OracleStatusRequest200Response) GetTasks() []OracleStatusRequest200ResponseTasksInner`

GetTasks returns the Tasks field if non-nil, zero value otherwise.

### GetTasksOk

`func (o *OracleStatusRequest200Response) GetTasksOk() (*[]OracleStatusRequest200ResponseTasksInner, bool)`

GetTasksOk returns a tuple with the Tasks field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetTasks

`func (o *OracleStatusRequest200Response) SetTasks(v []OracleStatusRequest200ResponseTasksInner)`

SetTasks sets Tasks field to given value.

### HasTasks

`func (o *OracleStatusRequest200Response) HasTasks() bool`

HasTasks returns a boolean if a field has been set.

### GetStatus

`func (o *OracleStatusRequest200Response) GetStatus() string`

GetStatus returns the Status field if non-nil, zero value otherwise.

### GetStatusOk

`func (o *OracleStatusRequest200Response) GetStatusOk() (*string, bool)`

GetStatusOk returns a tuple with the Status field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetStatus

`func (o *OracleStatusRequest200Response) SetStatus(v string)`

SetStatus sets Status field to given value.

### HasStatus

`func (o *OracleStatusRequest200Response) HasStatus() bool`

HasStatus returns a boolean if a field has been set.


[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


