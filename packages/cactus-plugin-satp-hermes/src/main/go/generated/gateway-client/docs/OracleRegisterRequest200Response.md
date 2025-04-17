# OracleRegisterRequest200Response

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**TaskID** | **string** | The unique identifier for the context of the repeatable task. | 
**Status** | **string** | The status of the registered data transfer task. | 

## Methods

### NewOracleRegisterRequest200Response

`func NewOracleRegisterRequest200Response(taskID string, status string, ) *OracleRegisterRequest200Response`

NewOracleRegisterRequest200Response instantiates a new OracleRegisterRequest200Response object
This constructor will assign default values to properties that have it defined,
and makes sure properties required by API are set, but the set of arguments
will change when the set of required properties is changed

### NewOracleRegisterRequest200ResponseWithDefaults

`func NewOracleRegisterRequest200ResponseWithDefaults() *OracleRegisterRequest200Response`

NewOracleRegisterRequest200ResponseWithDefaults instantiates a new OracleRegisterRequest200Response object
This constructor will only assign default values to properties that have it defined,
but it doesn't guarantee that properties required by API are set

### GetTaskID

`func (o *OracleRegisterRequest200Response) GetTaskID() string`

GetTaskID returns the TaskID field if non-nil, zero value otherwise.

### GetTaskIDOk

`func (o *OracleRegisterRequest200Response) GetTaskIDOk() (*string, bool)`

GetTaskIDOk returns a tuple with the TaskID field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetTaskID

`func (o *OracleRegisterRequest200Response) SetTaskID(v string)`

SetTaskID sets TaskID field to given value.


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



[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


