# OracleExecuteResponse

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**TaskID** | **string** | The unique identifier for the transfer task. | 
**Status** | **string** | The status of the transfer task execution. | 
**Substatus** | **string** | The substatus of the transfer task execution. | 

## Methods

### NewOracleExecuteResponse

`func NewOracleExecuteResponse(taskID string, status string, substatus string, ) *OracleExecuteResponse`

NewOracleExecuteResponse instantiates a new OracleExecuteResponse object
This constructor will assign default values to properties that have it defined,
and makes sure properties required by API are set, but the set of arguments
will change when the set of required properties is changed

### NewOracleExecuteResponseWithDefaults

`func NewOracleExecuteResponseWithDefaults() *OracleExecuteResponse`

NewOracleExecuteResponseWithDefaults instantiates a new OracleExecuteResponse object
This constructor will only assign default values to properties that have it defined,
but it doesn't guarantee that properties required by API are set

### GetTaskID

`func (o *OracleExecuteResponse) GetTaskID() string`

GetTaskID returns the TaskID field if non-nil, zero value otherwise.

### GetTaskIDOk

`func (o *OracleExecuteResponse) GetTaskIDOk() (*string, bool)`

GetTaskIDOk returns a tuple with the TaskID field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetTaskID

`func (o *OracleExecuteResponse) SetTaskID(v string)`

SetTaskID sets TaskID field to given value.


### GetStatus

`func (o *OracleExecuteResponse) GetStatus() string`

GetStatus returns the Status field if non-nil, zero value otherwise.

### GetStatusOk

`func (o *OracleExecuteResponse) GetStatusOk() (*string, bool)`

GetStatusOk returns a tuple with the Status field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetStatus

`func (o *OracleExecuteResponse) SetStatus(v string)`

SetStatus sets Status field to given value.


### GetSubstatus

`func (o *OracleExecuteResponse) GetSubstatus() string`

GetSubstatus returns the Substatus field if non-nil, zero value otherwise.

### GetSubstatusOk

`func (o *OracleExecuteResponse) GetSubstatusOk() (*string, bool)`

GetSubstatusOk returns a tuple with the Substatus field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetSubstatus

`func (o *OracleExecuteResponse) SetSubstatus(v string)`

SetSubstatus sets Substatus field to given value.



[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


