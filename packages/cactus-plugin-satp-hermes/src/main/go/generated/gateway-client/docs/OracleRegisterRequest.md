# OracleRegisterRequest

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**ContextID** | **string** |  | 
**OriginNetwork** | [**Transact200ResponseStatusResponseOriginNetwork**](Transact200ResponseStatusResponseOriginNetwork.md) |  | 
**DestinationNetwork** | Pointer to [**Transact200ResponseStatusResponseDestinationNetwork**](Transact200ResponseStatusResponseDestinationNetwork.md) |  | [optional] 
**OriginContract** | [**OracleStatusRequest200ResponseOriginContract**](OracleStatusRequest200ResponseOriginContract.md) |  | 
**DestinationContract** | Pointer to [**OracleExecuteRequestRequestDestinationContract**](OracleExecuteRequestRequestDestinationContract.md) |  | [optional] 
**EventOfInterest** | Pointer to [**OracleStatusRequest200ResponseEventOfInterest**](OracleStatusRequest200ResponseEventOfInterest.md) |  | [optional] 
**WriteFunction** | Pointer to [**OracleExecuteRequestRequestWriteFunction**](OracleExecuteRequestRequestWriteFunction.md) |  | [optional] 

## Methods

### NewOracleRegisterRequest

`func NewOracleRegisterRequest(contextID string, originNetwork Transact200ResponseStatusResponseOriginNetwork, originContract OracleStatusRequest200ResponseOriginContract, ) *OracleRegisterRequest`

NewOracleRegisterRequest instantiates a new OracleRegisterRequest object
This constructor will assign default values to properties that have it defined,
and makes sure properties required by API are set, but the set of arguments
will change when the set of required properties is changed

### NewOracleRegisterRequestWithDefaults

`func NewOracleRegisterRequestWithDefaults() *OracleRegisterRequest`

NewOracleRegisterRequestWithDefaults instantiates a new OracleRegisterRequest object
This constructor will only assign default values to properties that have it defined,
but it doesn't guarantee that properties required by API are set

### GetContextID

`func (o *OracleRegisterRequest) GetContextID() string`

GetContextID returns the ContextID field if non-nil, zero value otherwise.

### GetContextIDOk

`func (o *OracleRegisterRequest) GetContextIDOk() (*string, bool)`

GetContextIDOk returns a tuple with the ContextID field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetContextID

`func (o *OracleRegisterRequest) SetContextID(v string)`

SetContextID sets ContextID field to given value.


### GetOriginNetwork

`func (o *OracleRegisterRequest) GetOriginNetwork() Transact200ResponseStatusResponseOriginNetwork`

GetOriginNetwork returns the OriginNetwork field if non-nil, zero value otherwise.

### GetOriginNetworkOk

`func (o *OracleRegisterRequest) GetOriginNetworkOk() (*Transact200ResponseStatusResponseOriginNetwork, bool)`

GetOriginNetworkOk returns a tuple with the OriginNetwork field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetOriginNetwork

`func (o *OracleRegisterRequest) SetOriginNetwork(v Transact200ResponseStatusResponseOriginNetwork)`

SetOriginNetwork sets OriginNetwork field to given value.


### GetDestinationNetwork

`func (o *OracleRegisterRequest) GetDestinationNetwork() Transact200ResponseStatusResponseDestinationNetwork`

GetDestinationNetwork returns the DestinationNetwork field if non-nil, zero value otherwise.

### GetDestinationNetworkOk

`func (o *OracleRegisterRequest) GetDestinationNetworkOk() (*Transact200ResponseStatusResponseDestinationNetwork, bool)`

GetDestinationNetworkOk returns a tuple with the DestinationNetwork field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetDestinationNetwork

`func (o *OracleRegisterRequest) SetDestinationNetwork(v Transact200ResponseStatusResponseDestinationNetwork)`

SetDestinationNetwork sets DestinationNetwork field to given value.

### HasDestinationNetwork

`func (o *OracleRegisterRequest) HasDestinationNetwork() bool`

HasDestinationNetwork returns a boolean if a field has been set.

### GetOriginContract

`func (o *OracleRegisterRequest) GetOriginContract() OracleStatusRequest200ResponseOriginContract`

GetOriginContract returns the OriginContract field if non-nil, zero value otherwise.

### GetOriginContractOk

`func (o *OracleRegisterRequest) GetOriginContractOk() (*OracleStatusRequest200ResponseOriginContract, bool)`

GetOriginContractOk returns a tuple with the OriginContract field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetOriginContract

`func (o *OracleRegisterRequest) SetOriginContract(v OracleStatusRequest200ResponseOriginContract)`

SetOriginContract sets OriginContract field to given value.


### GetDestinationContract

`func (o *OracleRegisterRequest) GetDestinationContract() OracleExecuteRequestRequestDestinationContract`

GetDestinationContract returns the DestinationContract field if non-nil, zero value otherwise.

### GetDestinationContractOk

`func (o *OracleRegisterRequest) GetDestinationContractOk() (*OracleExecuteRequestRequestDestinationContract, bool)`

GetDestinationContractOk returns a tuple with the DestinationContract field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetDestinationContract

`func (o *OracleRegisterRequest) SetDestinationContract(v OracleExecuteRequestRequestDestinationContract)`

SetDestinationContract sets DestinationContract field to given value.

### HasDestinationContract

`func (o *OracleRegisterRequest) HasDestinationContract() bool`

HasDestinationContract returns a boolean if a field has been set.

### GetEventOfInterest

`func (o *OracleRegisterRequest) GetEventOfInterest() OracleStatusRequest200ResponseEventOfInterest`

GetEventOfInterest returns the EventOfInterest field if non-nil, zero value otherwise.

### GetEventOfInterestOk

`func (o *OracleRegisterRequest) GetEventOfInterestOk() (*OracleStatusRequest200ResponseEventOfInterest, bool)`

GetEventOfInterestOk returns a tuple with the EventOfInterest field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetEventOfInterest

`func (o *OracleRegisterRequest) SetEventOfInterest(v OracleStatusRequest200ResponseEventOfInterest)`

SetEventOfInterest sets EventOfInterest field to given value.

### HasEventOfInterest

`func (o *OracleRegisterRequest) HasEventOfInterest() bool`

HasEventOfInterest returns a boolean if a field has been set.

### GetWriteFunction

`func (o *OracleRegisterRequest) GetWriteFunction() OracleExecuteRequestRequestWriteFunction`

GetWriteFunction returns the WriteFunction field if non-nil, zero value otherwise.

### GetWriteFunctionOk

`func (o *OracleRegisterRequest) GetWriteFunctionOk() (*OracleExecuteRequestRequestWriteFunction, bool)`

GetWriteFunctionOk returns a tuple with the WriteFunction field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetWriteFunction

`func (o *OracleRegisterRequest) SetWriteFunction(v OracleExecuteRequestRequestWriteFunction)`

SetWriteFunction sets WriteFunction field to given value.

### HasWriteFunction

`func (o *OracleRegisterRequest) HasWriteFunction() bool`

HasWriteFunction returns a boolean if a field has been set.


[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


