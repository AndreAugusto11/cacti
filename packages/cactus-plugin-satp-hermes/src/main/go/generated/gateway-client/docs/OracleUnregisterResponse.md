# OracleUnregisterResponse

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**ContextID** | Pointer to **string** | The unique identifier for the context of the data transfer task. | [optional] 
**Status** | Pointer to **string** | The status of the unregistered data transfer task. | [optional] 
**Substatus** | Pointer to **string** |  | [optional] 

## Methods

### NewOracleUnregisterResponse

`func NewOracleUnregisterResponse() *OracleUnregisterResponse`

NewOracleUnregisterResponse instantiates a new OracleUnregisterResponse object
This constructor will assign default values to properties that have it defined,
and makes sure properties required by API are set, but the set of arguments
will change when the set of required properties is changed

### NewOracleUnregisterResponseWithDefaults

`func NewOracleUnregisterResponseWithDefaults() *OracleUnregisterResponse`

NewOracleUnregisterResponseWithDefaults instantiates a new OracleUnregisterResponse object
This constructor will only assign default values to properties that have it defined,
but it doesn't guarantee that properties required by API are set

### GetContextID

`func (o *OracleUnregisterResponse) GetContextID() string`

GetContextID returns the ContextID field if non-nil, zero value otherwise.

### GetContextIDOk

`func (o *OracleUnregisterResponse) GetContextIDOk() (*string, bool)`

GetContextIDOk returns a tuple with the ContextID field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetContextID

`func (o *OracleUnregisterResponse) SetContextID(v string)`

SetContextID sets ContextID field to given value.

### HasContextID

`func (o *OracleUnregisterResponse) HasContextID() bool`

HasContextID returns a boolean if a field has been set.

### GetStatus

`func (o *OracleUnregisterResponse) GetStatus() string`

GetStatus returns the Status field if non-nil, zero value otherwise.

### GetStatusOk

`func (o *OracleUnregisterResponse) GetStatusOk() (*string, bool)`

GetStatusOk returns a tuple with the Status field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetStatus

`func (o *OracleUnregisterResponse) SetStatus(v string)`

SetStatus sets Status field to given value.

### HasStatus

`func (o *OracleUnregisterResponse) HasStatus() bool`

HasStatus returns a boolean if a field has been set.

### GetSubstatus

`func (o *OracleUnregisterResponse) GetSubstatus() string`

GetSubstatus returns the Substatus field if non-nil, zero value otherwise.

### GetSubstatusOk

`func (o *OracleUnregisterResponse) GetSubstatusOk() (*string, bool)`

GetSubstatusOk returns a tuple with the Substatus field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetSubstatus

`func (o *OracleUnregisterResponse) SetSubstatus(v string)`

SetSubstatus sets Substatus field to given value.

### HasSubstatus

`func (o *OracleUnregisterResponse) HasSubstatus() bool`

HasSubstatus returns a boolean if a field has been set.


[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


