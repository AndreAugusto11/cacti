# OracleExecuteResponse

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**TaskID** | **string** | The unique identifier for the transfer task. | 
**Outputs** | Pointer to **[]string** | The output of the transfer task execution. | [optional] 

## Methods

### NewOracleExecuteResponse

`func NewOracleExecuteResponse(taskID string, ) *OracleExecuteResponse`

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


### GetOutputs

`func (o *OracleExecuteResponse) GetOutputs() []string`

GetOutputs returns the Outputs field if non-nil, zero value otherwise.

### GetOutputsOk

`func (o *OracleExecuteResponse) GetOutputsOk() (*[]string, bool)`

GetOutputsOk returns a tuple with the Outputs field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetOutputs

`func (o *OracleExecuteResponse) SetOutputs(v []string)`

SetOutputs sets Outputs field to given value.

### HasOutputs

`func (o *OracleExecuteResponse) HasOutputs() bool`

HasOutputs returns a boolean if a field has been set.


[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


