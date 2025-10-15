# GetVCUMetadataRequest

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**Marketplace** | [**Marketplace**](Marketplace.md) |  | 
**Network** | [**Network**](Network.md) |  | 
**ProjectIdentifier** | **string** |  | 
**VcuIdentifier** | **string** |  | 

## Methods

### NewGetVCUMetadataRequest

`func NewGetVCUMetadataRequest(marketplace Marketplace, network Network, projectIdentifier string, vcuIdentifier string, ) *GetVCUMetadataRequest`

NewGetVCUMetadataRequest instantiates a new GetVCUMetadataRequest object
This constructor will assign default values to properties that have it defined,
and makes sure properties required by API are set, but the set of arguments
will change when the set of required properties is changed

### NewGetVCUMetadataRequestWithDefaults

`func NewGetVCUMetadataRequestWithDefaults() *GetVCUMetadataRequest`

NewGetVCUMetadataRequestWithDefaults instantiates a new GetVCUMetadataRequest object
This constructor will only assign default values to properties that have it defined,
but it doesn't guarantee that properties required by API are set

### GetMarketplace

`func (o *GetVCUMetadataRequest) GetMarketplace() Marketplace`

GetMarketplace returns the Marketplace field if non-nil, zero value otherwise.

### GetMarketplaceOk

`func (o *GetVCUMetadataRequest) GetMarketplaceOk() (*Marketplace, bool)`

GetMarketplaceOk returns a tuple with the Marketplace field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetMarketplace

`func (o *GetVCUMetadataRequest) SetMarketplace(v Marketplace)`

SetMarketplace sets Marketplace field to given value.


### GetNetwork

`func (o *GetVCUMetadataRequest) GetNetwork() Network`

GetNetwork returns the Network field if non-nil, zero value otherwise.

### GetNetworkOk

`func (o *GetVCUMetadataRequest) GetNetworkOk() (*Network, bool)`

GetNetworkOk returns a tuple with the Network field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetNetwork

`func (o *GetVCUMetadataRequest) SetNetwork(v Network)`

SetNetwork sets Network field to given value.


### GetProjectIdentifier

`func (o *GetVCUMetadataRequest) GetProjectIdentifier() string`

GetProjectIdentifier returns the ProjectIdentifier field if non-nil, zero value otherwise.

### GetProjectIdentifierOk

`func (o *GetVCUMetadataRequest) GetProjectIdentifierOk() (*string, bool)`

GetProjectIdentifierOk returns a tuple with the ProjectIdentifier field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetProjectIdentifier

`func (o *GetVCUMetadataRequest) SetProjectIdentifier(v string)`

SetProjectIdentifier sets ProjectIdentifier field to given value.


### GetVcuIdentifier

`func (o *GetVCUMetadataRequest) GetVcuIdentifier() string`

GetVcuIdentifier returns the VcuIdentifier field if non-nil, zero value otherwise.

### GetVcuIdentifierOk

`func (o *GetVCUMetadataRequest) GetVcuIdentifierOk() (*string, bool)`

GetVcuIdentifierOk returns a tuple with the VcuIdentifier field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetVcuIdentifier

`func (o *GetVCUMetadataRequest) SetVcuIdentifier(v string)`

SetVcuIdentifier sets VcuIdentifier field to given value.



[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


