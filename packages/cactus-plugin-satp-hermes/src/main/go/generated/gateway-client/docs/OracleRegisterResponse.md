# OracleRegisterResponse

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**ContextID** | **string** | The unique identifier for the context of the data transfer task. | 
**Status** | **string** | The status of the registered data transfer task. | 
**Substatus** | **string** |  | 

## Methods

### NewOracleRegisterResponse

`func NewOracleRegisterResponse(contextID string, status string, substatus string, ) *OracleRegisterResponse`

NewOracleRegisterResponse instantiates a new OracleRegisterResponse object
This constructor will assign default values to properties that have it defined,
and makes sure properties required by API are set, but the set of arguments
will change when the set of required properties is changed

### NewOracleRegisterResponseWithDefaults

`func NewOracleRegisterResponseWithDefaults() *OracleRegisterResponse`

NewOracleRegisterResponseWithDefaults instantiates a new OracleRegisterResponse object
This constructor will only assign default values to properties that have it defined,
but it doesn't guarantee that properties required by API are set

### GetContextID

`func (o *OracleRegisterResponse) GetContextID() string`

GetContextID returns the ContextID field if non-nil, zero value otherwise.

### GetContextIDOk

`func (o *OracleRegisterResponse) GetContextIDOk() (*string, bool)`

GetContextIDOk returns a tuple with the ContextID field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetContextID

`func (o *OracleRegisterResponse) SetContextID(v string)`

SetContextID sets ContextID field to given value.


### GetStatus

`func (o *OracleRegisterResponse) GetStatus() string`

GetStatus returns the Status field if non-nil, zero value otherwise.

### GetStatusOk

`func (o *OracleRegisterResponse) GetStatusOk() (*string, bool)`

GetStatusOk returns a tuple with the Status field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetStatus

`func (o *OracleRegisterResponse) SetStatus(v string)`

SetStatus sets Status field to given value.


### GetSubstatus

`func (o *OracleRegisterResponse) GetSubstatus() string`

GetSubstatus returns the Substatus field if non-nil, zero value otherwise.

### GetSubstatusOk

`func (o *OracleRegisterResponse) GetSubstatusOk() (*string, bool)`

GetSubstatusOk returns a tuple with the Substatus field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetSubstatus

`func (o *OracleRegisterResponse) SetSubstatus(v string)`

SetSubstatus sets Substatus field to given value.



[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


