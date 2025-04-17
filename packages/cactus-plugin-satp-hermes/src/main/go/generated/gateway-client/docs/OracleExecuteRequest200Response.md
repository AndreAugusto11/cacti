# OracleExecuteRequest200Response

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**TaskID** | **string** | The unique identifier for the transfer task. | 
**Outputs** | Pointer to **[]string** | The output of the transfer task execution. | [optional] 

## Methods

### NewOracleExecuteRequest200Response

`func NewOracleExecuteRequest200Response(taskID string, ) *OracleExecuteRequest200Response`

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


### GetOutputs

`func (o *OracleExecuteRequest200Response) GetOutputs() []string`

GetOutputs returns the Outputs field if non-nil, zero value otherwise.

### GetOutputsOk

`func (o *OracleExecuteRequest200Response) GetOutputsOk() (*[]string, bool)`

GetOutputsOk returns a tuple with the Outputs field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetOutputs

`func (o *OracleExecuteRequest200Response) SetOutputs(v []string)`

SetOutputs sets Outputs field to given value.

### HasOutputs

`func (o *OracleExecuteRequest200Response) HasOutputs() bool`

HasOutputs returns a boolean if a field has been set.


[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


