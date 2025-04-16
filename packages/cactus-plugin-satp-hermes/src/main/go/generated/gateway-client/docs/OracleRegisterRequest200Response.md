# OracleRegisterRequest200Response

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**ContextID** | **string** | The unique identifier for the context of the data transfer task. | 
**Status** | **string** | The status of the registered data transfer task. | 
**Substatus** | **string** |  | 

## Methods

### NewOracleRegisterRequest200Response

`func NewOracleRegisterRequest200Response(contextID string, status string, substatus string, ) *OracleRegisterRequest200Response`

NewOracleRegisterRequest200Response instantiates a new OracleRegisterRequest200Response object
This constructor will assign default values to properties that have it defined,
and makes sure properties required by API are set, but the set of arguments
will change when the set of required properties is changed

### NewOracleRegisterRequest200ResponseWithDefaults

`func NewOracleRegisterRequest200ResponseWithDefaults() *OracleRegisterRequest200Response`

NewOracleRegisterRequest200ResponseWithDefaults instantiates a new OracleRegisterRequest200Response object
This constructor will only assign default values to properties that have it defined,
but it doesn't guarantee that properties required by API are set

### GetContextID

`func (o *OracleRegisterRequest200Response) GetContextID() string`

GetContextID returns the ContextID field if non-nil, zero value otherwise.

### GetContextIDOk

`func (o *OracleRegisterRequest200Response) GetContextIDOk() (*string, bool)`

GetContextIDOk returns a tuple with the ContextID field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetContextID

`func (o *OracleRegisterRequest200Response) SetContextID(v string)`

SetContextID sets ContextID field to given value.


### GetStatus

`func (o *OracleRegisterRequest200Response) GetStatus() string`

GetStatus returns the Status field if non-nil, zero value otherwise.

### GetStatusOk

`func (o *OracleRegisterRequest200Response) GetStatusOk() (*string, bool)`

GetStatusOk returns a tuple with the Status field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetStatus

`func (o *OracleRegisterRequest200Response) SetStatus(v string)`

SetStatus sets Status field to given value.


### GetSubstatus

`func (o *OracleRegisterRequest200Response) GetSubstatus() string`

GetSubstatus returns the Substatus field if non-nil, zero value otherwise.

### GetSubstatusOk

`func (o *OracleRegisterRequest200Response) GetSubstatusOk() (*string, bool)`

GetSubstatusOk returns a tuple with the Substatus field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetSubstatus

`func (o *OracleRegisterRequest200Response) SetSubstatus(v string)`

SetSubstatus sets Substatus field to given value.



[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


