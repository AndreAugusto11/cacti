# GetAvailableTCO2sResponse

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**Tco2List** | [**[]GetAvailableTCO2sResponseTco2ListInner**](GetAvailableTCO2sResponseTco2ListInner.md) |  | 
**TotalCount** | **float32** |  | 

## Methods

### NewGetAvailableTCO2sResponse

`func NewGetAvailableTCO2sResponse(tco2List []GetAvailableTCO2sResponseTco2ListInner, totalCount float32, ) *GetAvailableTCO2sResponse`

NewGetAvailableTCO2sResponse instantiates a new GetAvailableTCO2sResponse object
This constructor will assign default values to properties that have it defined,
and makes sure properties required by API are set, but the set of arguments
will change when the set of required properties is changed

### NewGetAvailableTCO2sResponseWithDefaults

`func NewGetAvailableTCO2sResponseWithDefaults() *GetAvailableTCO2sResponse`

NewGetAvailableTCO2sResponseWithDefaults instantiates a new GetAvailableTCO2sResponse object
This constructor will only assign default values to properties that have it defined,
but it doesn't guarantee that properties required by API are set

### GetTco2List

`func (o *GetAvailableTCO2sResponse) GetTco2List() []GetAvailableTCO2sResponseTco2ListInner`

GetTco2List returns the Tco2List field if non-nil, zero value otherwise.

### GetTco2ListOk

`func (o *GetAvailableTCO2sResponse) GetTco2ListOk() (*[]GetAvailableTCO2sResponseTco2ListInner, bool)`

GetTco2ListOk returns a tuple with the Tco2List field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetTco2List

`func (o *GetAvailableTCO2sResponse) SetTco2List(v []GetAvailableTCO2sResponseTco2ListInner)`

SetTco2List sets Tco2List field to given value.


### GetTotalCount

`func (o *GetAvailableTCO2sResponse) GetTotalCount() float32`

GetTotalCount returns the TotalCount field if non-nil, zero value otherwise.

### GetTotalCountOk

`func (o *GetAvailableTCO2sResponse) GetTotalCountOk() (*float32, bool)`

GetTotalCountOk returns a tuple with the TotalCount field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetTotalCount

`func (o *GetAvailableTCO2sResponse) SetTotalCount(v float32)`

SetTotalCount sets TotalCount field to given value.



[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


