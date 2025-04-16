# OracleExecuteRequest200Response

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**TaskID** | **string** | The unique identifier for the transfer task. | 
**Status** | **string** | The status of the transfer task execution. | 
**Substatus** | **string** | The substatus of the transfer task execution. | 

## Methods

### NewOracleExecuteRequest200Response

`func NewOracleExecuteRequest200Response(taskID string, status string, substatus string, ) *OracleExecuteRequest200Response`

NewOracleExecuteRequest200Response instantiates a new OracleExecuteRequest200Response object
This constructor will assign default values to properties that have it defined,
and makes sure properties required by API are set, but the set of arguments
will change when the set of required properties is changed

### NewOracleExecuteRequest200ResponseWithDefaults

`func NewOracleExecuteRequest200ResponseWithDefaults() *OracleExecuteRequest200Response`

NewOracleExecuteRequest200ResponseWithDefaults instantiates a new OracleExecuteRequest200Response object
This constructor will only assign default values to properties that have it defined,
but it doesn't guarantee that properties required by API are set

### GetTaskID

`func (o *OracleExecuteRequest200Response) GetTaskID() string`

GetTaskID returns the TaskID field if non-nil, zero value otherwise.

### GetTaskIDOk

`func (o *OracleExecuteRequest200Response) GetTaskIDOk() (*string, bool)`

GetTaskIDOk returns a tuple with the TaskID field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetTaskID

`func (o *OracleExecuteRequest200Response) SetTaskID(v string)`

SetTaskID sets TaskID field to given value.


### GetStatus

`func (o *OracleExecuteRequest200Response) GetStatus() string`

GetStatus returns the Status field if non-nil, zero value otherwise.

### GetStatusOk

`func (o *OracleExecuteRequest200Response) GetStatusOk() (*string, bool)`

GetStatusOk returns a tuple with the Status field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetStatus

`func (o *OracleExecuteRequest200Response) SetStatus(v string)`

SetStatus sets Status field to given value.


### GetSubstatus

`func (o *OracleExecuteRequest200Response) GetSubstatus() string`

GetSubstatus returns the Substatus field if non-nil, zero value otherwise.

### GetSubstatusOk

`func (o *OracleExecuteRequest200Response) GetSubstatusOk() (*string, bool)`

GetSubstatusOk returns a tuple with the Substatus field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetSubstatus

`func (o *OracleExecuteRequest200Response) SetSubstatus(v string)`

SetSubstatus sets Substatus field to given value.



[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


