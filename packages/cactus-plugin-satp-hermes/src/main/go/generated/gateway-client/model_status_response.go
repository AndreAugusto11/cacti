/*
SATP Gateway Client (Business Logic Orchestrator)

SATP is a protocol operating between two gateways that conducts the transfer of a digital asset from one gateway to another. The protocol establishes a secure channel between the endpoints and implements a 2-phase commit to ensure the properties of transfer atomicity, consistency, isolation and durability.  This API defines the gateway client facing API (business logic orchestrator, or BLO), which is named API-Type 1 in the SATP-Core specification.  **Additional Resources**: - [Proposed SATP Charter](https://datatracker.ietf.org/doc/charter-ietf-satp/) - [SATP Core draft](https://datatracker.ietf.org/doc/draft-ietf-satp-core) - [SATP Crash Recovery draft](https://datatracker.ietf.org/doc/draft-belchior-satp-gateway-recovery/) - [SATP Architecture draft](https://datatracker.ietf.org/doc/draft-ietf-satp-architecture/) - [SATP Use-Cases draft](https://datatracker.ietf.org/doc/draft-ramakrishna-sat-use-cases/) - [SATP Data sharing draft](https://datatracker.ietf.org/doc/draft-ramakrishna-satp-data-sharing) - [SATP View Addresses draft](https://datatracker.ietf.org/doc/draft-ramakrishna-satp-views-addresses)

API version: 0.0.2
*/

// Code generated by OpenAPI Generator (https://openapi-generator.tech); DO NOT EDIT.

package generated

import (
	"encoding/json"
	"time"
)

// checks if the StatusResponse type satisfies the MappedNullable interface at compile time
var _ MappedNullable = &StatusResponse{}

// StatusResponse Provides the current status of the SATP session including detailed information on the progress, such as substatus, stage, and step, along with the session start time and chain information.
type StatusResponse struct {
	Status string `json:"status"`
	Substatus string `json:"substatus"`
	Stage string `json:"stage"`
	Step string `json:"step"`
	StartTime time.Time `json:"startTime"`
	OriginChain Transact200ResponseStatusResponseOriginChain `json:"originChain"`
	DestinationChain Transact200ResponseStatusResponseDestinationChain `json:"destinationChain"`
}

// NewStatusResponse instantiates a new StatusResponse object
// This constructor will assign default values to properties that have it defined,
// and makes sure properties required by API are set, but the set of arguments
// will change when the set of required properties is changed
func NewStatusResponse(status string, substatus string, stage string, step string, startTime time.Time, originChain Transact200ResponseStatusResponseOriginChain, destinationChain Transact200ResponseStatusResponseDestinationChain) *StatusResponse {
	this := StatusResponse{}
	this.Status = status
	this.Substatus = substatus
	this.Stage = stage
	this.Step = step
	this.StartTime = startTime
	this.OriginChain = originChain
	this.DestinationChain = destinationChain
	return &this
}

// NewStatusResponseWithDefaults instantiates a new StatusResponse object
// This constructor will only assign default values to properties that have it defined,
// but it doesn't guarantee that properties required by API are set
func NewStatusResponseWithDefaults() *StatusResponse {
	this := StatusResponse{}
	return &this
}

// GetStatus returns the Status field value
func (o *StatusResponse) GetStatus() string {
	if o == nil {
		var ret string
		return ret
	}

	return o.Status
}

// GetStatusOk returns a tuple with the Status field value
// and a boolean to check if the value has been set.
func (o *StatusResponse) GetStatusOk() (*string, bool) {
	if o == nil {
		return nil, false
	}
	return &o.Status, true
}

// SetStatus sets field value
func (o *StatusResponse) SetStatus(v string) {
	o.Status = v
}

// GetSubstatus returns the Substatus field value
func (o *StatusResponse) GetSubstatus() string {
	if o == nil {
		var ret string
		return ret
	}

	return o.Substatus
}

// GetSubstatusOk returns a tuple with the Substatus field value
// and a boolean to check if the value has been set.
func (o *StatusResponse) GetSubstatusOk() (*string, bool) {
	if o == nil {
		return nil, false
	}
	return &o.Substatus, true
}

// SetSubstatus sets field value
func (o *StatusResponse) SetSubstatus(v string) {
	o.Substatus = v
}

// GetStage returns the Stage field value
func (o *StatusResponse) GetStage() string {
	if o == nil {
		var ret string
		return ret
	}

	return o.Stage
}

// GetStageOk returns a tuple with the Stage field value
// and a boolean to check if the value has been set.
func (o *StatusResponse) GetStageOk() (*string, bool) {
	if o == nil {
		return nil, false
	}
	return &o.Stage, true
}

// SetStage sets field value
func (o *StatusResponse) SetStage(v string) {
	o.Stage = v
}

// GetStep returns the Step field value
func (o *StatusResponse) GetStep() string {
	if o == nil {
		var ret string
		return ret
	}

	return o.Step
}

// GetStepOk returns a tuple with the Step field value
// and a boolean to check if the value has been set.
func (o *StatusResponse) GetStepOk() (*string, bool) {
	if o == nil {
		return nil, false
	}
	return &o.Step, true
}

// SetStep sets field value
func (o *StatusResponse) SetStep(v string) {
	o.Step = v
}

// GetStartTime returns the StartTime field value
func (o *StatusResponse) GetStartTime() time.Time {
	if o == nil {
		var ret time.Time
		return ret
	}

	return o.StartTime
}

// GetStartTimeOk returns a tuple with the StartTime field value
// and a boolean to check if the value has been set.
func (o *StatusResponse) GetStartTimeOk() (*time.Time, bool) {
	if o == nil {
		return nil, false
	}
	return &o.StartTime, true
}

// SetStartTime sets field value
func (o *StatusResponse) SetStartTime(v time.Time) {
	o.StartTime = v
}

// GetOriginChain returns the OriginChain field value
func (o *StatusResponse) GetOriginChain() Transact200ResponseStatusResponseOriginChain {
	if o == nil {
		var ret Transact200ResponseStatusResponseOriginChain
		return ret
	}

	return o.OriginChain
}

// GetOriginChainOk returns a tuple with the OriginChain field value
// and a boolean to check if the value has been set.
func (o *StatusResponse) GetOriginChainOk() (*Transact200ResponseStatusResponseOriginChain, bool) {
	if o == nil {
		return nil, false
	}
	return &o.OriginChain, true
}

// SetOriginChain sets field value
func (o *StatusResponse) SetOriginChain(v Transact200ResponseStatusResponseOriginChain) {
	o.OriginChain = v
}

// GetDestinationChain returns the DestinationChain field value
func (o *StatusResponse) GetDestinationChain() Transact200ResponseStatusResponseDestinationChain {
	if o == nil {
		var ret Transact200ResponseStatusResponseDestinationChain
		return ret
	}

	return o.DestinationChain
}

// GetDestinationChainOk returns a tuple with the DestinationChain field value
// and a boolean to check if the value has been set.
func (o *StatusResponse) GetDestinationChainOk() (*Transact200ResponseStatusResponseDestinationChain, bool) {
	if o == nil {
		return nil, false
	}
	return &o.DestinationChain, true
}

// SetDestinationChain sets field value
func (o *StatusResponse) SetDestinationChain(v Transact200ResponseStatusResponseDestinationChain) {
	o.DestinationChain = v
}

func (o StatusResponse) MarshalJSON() ([]byte, error) {
	toSerialize,err := o.ToMap()
	if err != nil {
		return []byte{}, err
	}
	return json.Marshal(toSerialize)
}

func (o StatusResponse) ToMap() (map[string]interface{}, error) {
	toSerialize := map[string]interface{}{}
	toSerialize["status"] = o.Status
	toSerialize["substatus"] = o.Substatus
	toSerialize["stage"] = o.Stage
	toSerialize["step"] = o.Step
	toSerialize["startTime"] = o.StartTime
	toSerialize["originChain"] = o.OriginChain
	toSerialize["destinationChain"] = o.DestinationChain
	return toSerialize, nil
}

type NullableStatusResponse struct {
	value *StatusResponse
	isSet bool
}

func (v NullableStatusResponse) Get() *StatusResponse {
	return v.value
}

func (v *NullableStatusResponse) Set(val *StatusResponse) {
	v.value = val
	v.isSet = true
}

func (v NullableStatusResponse) IsSet() bool {
	return v.isSet
}

func (v *NullableStatusResponse) Unset() {
	v.value = nil
	v.isSet = false
}

func NewNullableStatusResponse(val *StatusResponse) *NullableStatusResponse {
	return &NullableStatusResponse{value: val, isSet: true}
}

func (v NullableStatusResponse) MarshalJSON() ([]byte, error) {
	return json.Marshal(v.value)
}

func (v *NullableStatusResponse) UnmarshalJSON(src []byte) error {
	v.isSet = true
	return json.Unmarshal(src, &v.value)
}

