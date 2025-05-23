// Copyright IBM Corp. All Rights Reserved.
//
// SPDX-License-Identifier: Apache-2.0

// Code generated by protoc-gen-go. DO NOT EDIT.
// versions:
// 	protoc-gen-go v1.30.0
// 	protoc        v4.23.4
// source: common/events.proto

package common

import (
	protoreflect "google.golang.org/protobuf/reflect/protoreflect"
	protoimpl "google.golang.org/protobuf/runtime/protoimpl"
	reflect "reflect"
	sync "sync"
)

const (
	// Verify that this generated code is sufficiently up-to-date.
	_ = protoimpl.EnforceVersion(20 - protoimpl.MinVersion)
	// Verify that runtime/protoimpl is sufficiently up-to-date.
	_ = protoimpl.EnforceVersion(protoimpl.MaxVersion - 20)
)

type EventType int32

const (
	EventType_LEDGER_STATE EventType = 0
	EventType_ASSET_LOCK   EventType = 1
	EventType_ASSET_CLAIM  EventType = 2
)

// Enum value maps for EventType.
var (
	EventType_name = map[int32]string{
		0: "LEDGER_STATE",
		1: "ASSET_LOCK",
		2: "ASSET_CLAIM",
	}
	EventType_value = map[string]int32{
		"LEDGER_STATE": 0,
		"ASSET_LOCK":   1,
		"ASSET_CLAIM":  2,
	}
)

func (x EventType) Enum() *EventType {
	p := new(EventType)
	*p = x
	return p
}

func (x EventType) String() string {
	return protoimpl.X.EnumStringOf(x.Descriptor(), protoreflect.EnumNumber(x))
}

func (EventType) Descriptor() protoreflect.EnumDescriptor {
	return file_common_events_proto_enumTypes[0].Descriptor()
}

func (EventType) Type() protoreflect.EnumType {
	return &file_common_events_proto_enumTypes[0]
}

func (x EventType) Number() protoreflect.EnumNumber {
	return protoreflect.EnumNumber(x)
}

// Deprecated: Use EventType.Descriptor instead.
func (EventType) EnumDescriptor() ([]byte, []int) {
	return file_common_events_proto_rawDescGZIP(), []int{0}
}

type EventSubOperation int32

const (
	EventSubOperation_SUBSCRIBE   EventSubOperation = 0
	EventSubOperation_UNSUBSCRIBE EventSubOperation = 1
	EventSubOperation_UPDATE      EventSubOperation = 2
)

// Enum value maps for EventSubOperation.
var (
	EventSubOperation_name = map[int32]string{
		0: "SUBSCRIBE",
		1: "UNSUBSCRIBE",
		2: "UPDATE",
	}
	EventSubOperation_value = map[string]int32{
		"SUBSCRIBE":   0,
		"UNSUBSCRIBE": 1,
		"UPDATE":      2,
	}
)

func (x EventSubOperation) Enum() *EventSubOperation {
	p := new(EventSubOperation)
	*p = x
	return p
}

func (x EventSubOperation) String() string {
	return protoimpl.X.EnumStringOf(x.Descriptor(), protoreflect.EnumNumber(x))
}

func (EventSubOperation) Descriptor() protoreflect.EnumDescriptor {
	return file_common_events_proto_enumTypes[1].Descriptor()
}

func (EventSubOperation) Type() protoreflect.EnumType {
	return &file_common_events_proto_enumTypes[1]
}

func (x EventSubOperation) Number() protoreflect.EnumNumber {
	return protoreflect.EnumNumber(x)
}

// Deprecated: Use EventSubOperation.Descriptor instead.
func (EventSubOperation) EnumDescriptor() ([]byte, []int) {
	return file_common_events_proto_rawDescGZIP(), []int{1}
}

type EventSubscriptionState_STATUS int32

const (
	// pending ACK from remote relay
	EventSubscriptionState_SUBSCRIBE_PENDING_ACK EventSubscriptionState_STATUS = 0
	// Received ACK, waiting for event subscription confirmation from remote relay
	EventSubscriptionState_SUBSCRIBE_PENDING          EventSubscriptionState_STATUS = 1
	EventSubscriptionState_SUBSCRIBED                 EventSubscriptionState_STATUS = 2
	EventSubscriptionState_UNSUBSCRIBE_PENDING_ACK    EventSubscriptionState_STATUS = 3
	EventSubscriptionState_UNSUBSCRIBE_PENDING        EventSubscriptionState_STATUS = 4
	EventSubscriptionState_UNSUBSCRIBED               EventSubscriptionState_STATUS = 5
	EventSubscriptionState_ERROR                      EventSubscriptionState_STATUS = 6
	EventSubscriptionState_DUPLICATE_QUERY_SUBSCRIBED EventSubscriptionState_STATUS = 7
)

// Enum value maps for EventSubscriptionState_STATUS.
var (
	EventSubscriptionState_STATUS_name = map[int32]string{
		0: "SUBSCRIBE_PENDING_ACK",
		1: "SUBSCRIBE_PENDING",
		2: "SUBSCRIBED",
		3: "UNSUBSCRIBE_PENDING_ACK",
		4: "UNSUBSCRIBE_PENDING",
		5: "UNSUBSCRIBED",
		6: "ERROR",
		7: "DUPLICATE_QUERY_SUBSCRIBED",
	}
	EventSubscriptionState_STATUS_value = map[string]int32{
		"SUBSCRIBE_PENDING_ACK":      0,
		"SUBSCRIBE_PENDING":          1,
		"SUBSCRIBED":                 2,
		"UNSUBSCRIBE_PENDING_ACK":    3,
		"UNSUBSCRIBE_PENDING":        4,
		"UNSUBSCRIBED":               5,
		"ERROR":                      6,
		"DUPLICATE_QUERY_SUBSCRIBED": 7,
	}
)

func (x EventSubscriptionState_STATUS) Enum() *EventSubscriptionState_STATUS {
	p := new(EventSubscriptionState_STATUS)
	*p = x
	return p
}

func (x EventSubscriptionState_STATUS) String() string {
	return protoimpl.X.EnumStringOf(x.Descriptor(), protoreflect.EnumNumber(x))
}

func (EventSubscriptionState_STATUS) Descriptor() protoreflect.EnumDescriptor {
	return file_common_events_proto_enumTypes[2].Descriptor()
}

func (EventSubscriptionState_STATUS) Type() protoreflect.EnumType {
	return &file_common_events_proto_enumTypes[2]
}

func (x EventSubscriptionState_STATUS) Number() protoreflect.EnumNumber {
	return protoreflect.EnumNumber(x)
}

// Deprecated: Use EventSubscriptionState_STATUS.Descriptor instead.
func (EventSubscriptionState_STATUS) EnumDescriptor() ([]byte, []int) {
	return file_common_events_proto_rawDescGZIP(), []int{2, 0}
}

type EventMatcher struct {
	state         protoimpl.MessageState
	sizeCache     protoimpl.SizeCache
	unknownFields protoimpl.UnknownFields

	EventType             EventType `protobuf:"varint,1,opt,name=event_type,json=eventType,proto3,enum=common.events.EventType" json:"event_type,omitempty"`
	EventClassId          string    `protobuf:"bytes,2,opt,name=event_class_id,json=eventClassId,proto3" json:"event_class_id,omitempty"`
	TransactionLedgerId   string    `protobuf:"bytes,3,opt,name=transaction_ledger_id,json=transactionLedgerId,proto3" json:"transaction_ledger_id,omitempty"`
	TransactionContractId string    `protobuf:"bytes,4,opt,name=transaction_contract_id,json=transactionContractId,proto3" json:"transaction_contract_id,omitempty"`
	TransactionFunc       string    `protobuf:"bytes,5,opt,name=transaction_func,json=transactionFunc,proto3" json:"transaction_func,omitempty"`
}

func (x *EventMatcher) Reset() {
	*x = EventMatcher{}
	if protoimpl.UnsafeEnabled {
		mi := &file_common_events_proto_msgTypes[0]
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		ms.StoreMessageInfo(mi)
	}
}

func (x *EventMatcher) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*EventMatcher) ProtoMessage() {}

func (x *EventMatcher) ProtoReflect() protoreflect.Message {
	mi := &file_common_events_proto_msgTypes[0]
	if protoimpl.UnsafeEnabled && x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use EventMatcher.ProtoReflect.Descriptor instead.
func (*EventMatcher) Descriptor() ([]byte, []int) {
	return file_common_events_proto_rawDescGZIP(), []int{0}
}

func (x *EventMatcher) GetEventType() EventType {
	if x != nil {
		return x.EventType
	}
	return EventType_LEDGER_STATE
}

func (x *EventMatcher) GetEventClassId() string {
	if x != nil {
		return x.EventClassId
	}
	return ""
}

func (x *EventMatcher) GetTransactionLedgerId() string {
	if x != nil {
		return x.TransactionLedgerId
	}
	return ""
}

func (x *EventMatcher) GetTransactionContractId() string {
	if x != nil {
		return x.TransactionContractId
	}
	return ""
}

func (x *EventMatcher) GetTransactionFunc() string {
	if x != nil {
		return x.TransactionFunc
	}
	return ""
}

// Below message is used to communicate between dest-relay and src-relay;
// and src-relay and src-driver.
type EventSubscription struct {
	state         protoimpl.MessageState
	sizeCache     protoimpl.SizeCache
	unknownFields protoimpl.UnknownFields

	EventMatcher *EventMatcher     `protobuf:"bytes,1,opt,name=event_matcher,json=eventMatcher,proto3" json:"event_matcher,omitempty"`
	Query        *Query            `protobuf:"bytes,2,opt,name=query,proto3" json:"query,omitempty"`
	Operation    EventSubOperation `protobuf:"varint,3,opt,name=operation,proto3,enum=common.events.EventSubOperation" json:"operation,omitempty"`
}

func (x *EventSubscription) Reset() {
	*x = EventSubscription{}
	if protoimpl.UnsafeEnabled {
		mi := &file_common_events_proto_msgTypes[1]
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		ms.StoreMessageInfo(mi)
	}
}

func (x *EventSubscription) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*EventSubscription) ProtoMessage() {}

func (x *EventSubscription) ProtoReflect() protoreflect.Message {
	mi := &file_common_events_proto_msgTypes[1]
	if protoimpl.UnsafeEnabled && x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use EventSubscription.ProtoReflect.Descriptor instead.
func (*EventSubscription) Descriptor() ([]byte, []int) {
	return file_common_events_proto_rawDescGZIP(), []int{1}
}

func (x *EventSubscription) GetEventMatcher() *EventMatcher {
	if x != nil {
		return x.EventMatcher
	}
	return nil
}

func (x *EventSubscription) GetQuery() *Query {
	if x != nil {
		return x.Query
	}
	return nil
}

func (x *EventSubscription) GetOperation() EventSubOperation {
	if x != nil {
		return x.Operation
	}
	return EventSubOperation_SUBSCRIBE
}

type EventSubscriptionState struct {
	state         protoimpl.MessageState
	sizeCache     protoimpl.SizeCache
	unknownFields protoimpl.UnknownFields

	RequestId             string                        `protobuf:"bytes,1,opt,name=request_id,json=requestId,proto3" json:"request_id,omitempty"`
	PublishingRequestId   string                        `protobuf:"bytes,2,opt,name=publishing_request_id,json=publishingRequestId,proto3" json:"publishing_request_id,omitempty"`
	Status                EventSubscriptionState_STATUS `protobuf:"varint,3,opt,name=status,proto3,enum=common.events.EventSubscriptionState_STATUS" json:"status,omitempty"`
	Message               string                        `protobuf:"bytes,4,opt,name=message,proto3" json:"message,omitempty"`
	EventMatcher          *EventMatcher                 `protobuf:"bytes,5,opt,name=event_matcher,json=eventMatcher,proto3" json:"event_matcher,omitempty"`
	EventPublicationSpecs []*EventPublication           `protobuf:"bytes,6,rep,name=event_publication_specs,json=eventPublicationSpecs,proto3" json:"event_publication_specs,omitempty"`
}

func (x *EventSubscriptionState) Reset() {
	*x = EventSubscriptionState{}
	if protoimpl.UnsafeEnabled {
		mi := &file_common_events_proto_msgTypes[2]
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		ms.StoreMessageInfo(mi)
	}
}

func (x *EventSubscriptionState) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*EventSubscriptionState) ProtoMessage() {}

func (x *EventSubscriptionState) ProtoReflect() protoreflect.Message {
	mi := &file_common_events_proto_msgTypes[2]
	if protoimpl.UnsafeEnabled && x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use EventSubscriptionState.ProtoReflect.Descriptor instead.
func (*EventSubscriptionState) Descriptor() ([]byte, []int) {
	return file_common_events_proto_rawDescGZIP(), []int{2}
}

func (x *EventSubscriptionState) GetRequestId() string {
	if x != nil {
		return x.RequestId
	}
	return ""
}

func (x *EventSubscriptionState) GetPublishingRequestId() string {
	if x != nil {
		return x.PublishingRequestId
	}
	return ""
}

func (x *EventSubscriptionState) GetStatus() EventSubscriptionState_STATUS {
	if x != nil {
		return x.Status
	}
	return EventSubscriptionState_SUBSCRIBE_PENDING_ACK
}

func (x *EventSubscriptionState) GetMessage() string {
	if x != nil {
		return x.Message
	}
	return ""
}

func (x *EventSubscriptionState) GetEventMatcher() *EventMatcher {
	if x != nil {
		return x.EventMatcher
	}
	return nil
}

func (x *EventSubscriptionState) GetEventPublicationSpecs() []*EventPublication {
	if x != nil {
		return x.EventPublicationSpecs
	}
	return nil
}

type ContractTransaction struct {
	state         protoimpl.MessageState
	sizeCache     protoimpl.SizeCache
	unknownFields protoimpl.UnknownFields

	DriverId        string   `protobuf:"bytes,1,opt,name=driver_id,json=driverId,proto3" json:"driver_id,omitempty"`
	LedgerId        string   `protobuf:"bytes,2,opt,name=ledger_id,json=ledgerId,proto3" json:"ledger_id,omitempty"`
	ContractId      string   `protobuf:"bytes,3,opt,name=contract_id,json=contractId,proto3" json:"contract_id,omitempty"`
	Func            string   `protobuf:"bytes,4,opt,name=func,proto3" json:"func,omitempty"`
	Args            [][]byte `protobuf:"bytes,5,rep,name=args,proto3" json:"args,omitempty"`
	ReplaceArgIndex uint64   `protobuf:"varint,6,opt,name=replace_arg_index,json=replaceArgIndex,proto3" json:"replace_arg_index,omitempty"`
	Members         []string `protobuf:"bytes,7,rep,name=members,proto3" json:"members,omitempty"`
}

func (x *ContractTransaction) Reset() {
	*x = ContractTransaction{}
	if protoimpl.UnsafeEnabled {
		mi := &file_common_events_proto_msgTypes[3]
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		ms.StoreMessageInfo(mi)
	}
}

func (x *ContractTransaction) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*ContractTransaction) ProtoMessage() {}

func (x *ContractTransaction) ProtoReflect() protoreflect.Message {
	mi := &file_common_events_proto_msgTypes[3]
	if protoimpl.UnsafeEnabled && x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use ContractTransaction.ProtoReflect.Descriptor instead.
func (*ContractTransaction) Descriptor() ([]byte, []int) {
	return file_common_events_proto_rawDescGZIP(), []int{3}
}

func (x *ContractTransaction) GetDriverId() string {
	if x != nil {
		return x.DriverId
	}
	return ""
}

func (x *ContractTransaction) GetLedgerId() string {
	if x != nil {
		return x.LedgerId
	}
	return ""
}

func (x *ContractTransaction) GetContractId() string {
	if x != nil {
		return x.ContractId
	}
	return ""
}

func (x *ContractTransaction) GetFunc() string {
	if x != nil {
		return x.Func
	}
	return ""
}

func (x *ContractTransaction) GetArgs() [][]byte {
	if x != nil {
		return x.Args
	}
	return nil
}

func (x *ContractTransaction) GetReplaceArgIndex() uint64 {
	if x != nil {
		return x.ReplaceArgIndex
	}
	return 0
}

func (x *ContractTransaction) GetMembers() []string {
	if x != nil {
		return x.Members
	}
	return nil
}

type EventPublication struct {
	state         protoimpl.MessageState
	sizeCache     protoimpl.SizeCache
	unknownFields protoimpl.UnknownFields

	// Types that are assignable to PublicationTarget:
	//
	//	*EventPublication_Ctx
	//	*EventPublication_AppUrl
	PublicationTarget isEventPublication_PublicationTarget `protobuf_oneof:"publication_target"`
}

func (x *EventPublication) Reset() {
	*x = EventPublication{}
	if protoimpl.UnsafeEnabled {
		mi := &file_common_events_proto_msgTypes[4]
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		ms.StoreMessageInfo(mi)
	}
}

func (x *EventPublication) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*EventPublication) ProtoMessage() {}

func (x *EventPublication) ProtoReflect() protoreflect.Message {
	mi := &file_common_events_proto_msgTypes[4]
	if protoimpl.UnsafeEnabled && x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use EventPublication.ProtoReflect.Descriptor instead.
func (*EventPublication) Descriptor() ([]byte, []int) {
	return file_common_events_proto_rawDescGZIP(), []int{4}
}

func (m *EventPublication) GetPublicationTarget() isEventPublication_PublicationTarget {
	if m != nil {
		return m.PublicationTarget
	}
	return nil
}

func (x *EventPublication) GetCtx() *ContractTransaction {
	if x, ok := x.GetPublicationTarget().(*EventPublication_Ctx); ok {
		return x.Ctx
	}
	return nil
}

func (x *EventPublication) GetAppUrl() string {
	if x, ok := x.GetPublicationTarget().(*EventPublication_AppUrl); ok {
		return x.AppUrl
	}
	return ""
}

type isEventPublication_PublicationTarget interface {
	isEventPublication_PublicationTarget()
}

type EventPublication_Ctx struct {
	Ctx *ContractTransaction `protobuf:"bytes,1,opt,name=ctx,proto3,oneof"`
}

type EventPublication_AppUrl struct {
	AppUrl string `protobuf:"bytes,2,opt,name=app_url,json=appUrl,proto3,oneof"`
}

func (*EventPublication_Ctx) isEventPublication_PublicationTarget() {}

func (*EventPublication_AppUrl) isEventPublication_PublicationTarget() {}

type EventStates struct {
	state         protoimpl.MessageState
	sizeCache     protoimpl.SizeCache
	unknownFields protoimpl.UnknownFields

	States []*EventState `protobuf:"bytes,1,rep,name=states,proto3" json:"states,omitempty"`
}

func (x *EventStates) Reset() {
	*x = EventStates{}
	if protoimpl.UnsafeEnabled {
		mi := &file_common_events_proto_msgTypes[5]
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		ms.StoreMessageInfo(mi)
	}
}

func (x *EventStates) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*EventStates) ProtoMessage() {}

func (x *EventStates) ProtoReflect() protoreflect.Message {
	mi := &file_common_events_proto_msgTypes[5]
	if protoimpl.UnsafeEnabled && x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use EventStates.ProtoReflect.Descriptor instead.
func (*EventStates) Descriptor() ([]byte, []int) {
	return file_common_events_proto_rawDescGZIP(), []int{5}
}

func (x *EventStates) GetStates() []*EventState {
	if x != nil {
		return x.States
	}
	return nil
}

// the payload that is used for the communication between the requesting relay
// and its network
type EventState struct {
	state         protoimpl.MessageState
	sizeCache     protoimpl.SizeCache
	unknownFields protoimpl.UnknownFields

	State   *RequestState `protobuf:"bytes,1,opt,name=state,proto3" json:"state,omitempty"`
	EventId string        `protobuf:"bytes,2,opt,name=event_id,json=eventId,proto3" json:"event_id,omitempty"`
	Message string        `protobuf:"bytes,3,opt,name=message,proto3" json:"message,omitempty"`
}

func (x *EventState) Reset() {
	*x = EventState{}
	if protoimpl.UnsafeEnabled {
		mi := &file_common_events_proto_msgTypes[6]
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		ms.StoreMessageInfo(mi)
	}
}

func (x *EventState) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*EventState) ProtoMessage() {}

func (x *EventState) ProtoReflect() protoreflect.Message {
	mi := &file_common_events_proto_msgTypes[6]
	if protoimpl.UnsafeEnabled && x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use EventState.ProtoReflect.Descriptor instead.
func (*EventState) Descriptor() ([]byte, []int) {
	return file_common_events_proto_rawDescGZIP(), []int{6}
}

func (x *EventState) GetState() *RequestState {
	if x != nil {
		return x.State
	}
	return nil
}

func (x *EventState) GetEventId() string {
	if x != nil {
		return x.EventId
	}
	return ""
}

func (x *EventState) GetMessage() string {
	if x != nil {
		return x.Message
	}
	return ""
}

var File_common_events_proto protoreflect.FileDescriptor

var file_common_events_proto_rawDesc = []byte{
	0x0a, 0x13, 0x63, 0x6f, 0x6d, 0x6d, 0x6f, 0x6e, 0x2f, 0x65, 0x76, 0x65, 0x6e, 0x74, 0x73, 0x2e,
	0x70, 0x72, 0x6f, 0x74, 0x6f, 0x12, 0x0d, 0x63, 0x6f, 0x6d, 0x6d, 0x6f, 0x6e, 0x2e, 0x65, 0x76,
	0x65, 0x6e, 0x74, 0x73, 0x1a, 0x12, 0x63, 0x6f, 0x6d, 0x6d, 0x6f, 0x6e, 0x2f, 0x71, 0x75, 0x65,
	0x72, 0x79, 0x2e, 0x70, 0x72, 0x6f, 0x74, 0x6f, 0x1a, 0x12, 0x63, 0x6f, 0x6d, 0x6d, 0x6f, 0x6e,
	0x2f, 0x73, 0x74, 0x61, 0x74, 0x65, 0x2e, 0x70, 0x72, 0x6f, 0x74, 0x6f, 0x22, 0x84, 0x02, 0x0a,
	0x0c, 0x45, 0x76, 0x65, 0x6e, 0x74, 0x4d, 0x61, 0x74, 0x63, 0x68, 0x65, 0x72, 0x12, 0x37, 0x0a,
	0x0a, 0x65, 0x76, 0x65, 0x6e, 0x74, 0x5f, 0x74, 0x79, 0x70, 0x65, 0x18, 0x01, 0x20, 0x01, 0x28,
	0x0e, 0x32, 0x18, 0x2e, 0x63, 0x6f, 0x6d, 0x6d, 0x6f, 0x6e, 0x2e, 0x65, 0x76, 0x65, 0x6e, 0x74,
	0x73, 0x2e, 0x45, 0x76, 0x65, 0x6e, 0x74, 0x54, 0x79, 0x70, 0x65, 0x52, 0x09, 0x65, 0x76, 0x65,
	0x6e, 0x74, 0x54, 0x79, 0x70, 0x65, 0x12, 0x24, 0x0a, 0x0e, 0x65, 0x76, 0x65, 0x6e, 0x74, 0x5f,
	0x63, 0x6c, 0x61, 0x73, 0x73, 0x5f, 0x69, 0x64, 0x18, 0x02, 0x20, 0x01, 0x28, 0x09, 0x52, 0x0c,
	0x65, 0x76, 0x65, 0x6e, 0x74, 0x43, 0x6c, 0x61, 0x73, 0x73, 0x49, 0x64, 0x12, 0x32, 0x0a, 0x15,
	0x74, 0x72, 0x61, 0x6e, 0x73, 0x61, 0x63, 0x74, 0x69, 0x6f, 0x6e, 0x5f, 0x6c, 0x65, 0x64, 0x67,
	0x65, 0x72, 0x5f, 0x69, 0x64, 0x18, 0x03, 0x20, 0x01, 0x28, 0x09, 0x52, 0x13, 0x74, 0x72, 0x61,
	0x6e, 0x73, 0x61, 0x63, 0x74, 0x69, 0x6f, 0x6e, 0x4c, 0x65, 0x64, 0x67, 0x65, 0x72, 0x49, 0x64,
	0x12, 0x36, 0x0a, 0x17, 0x74, 0x72, 0x61, 0x6e, 0x73, 0x61, 0x63, 0x74, 0x69, 0x6f, 0x6e, 0x5f,
	0x63, 0x6f, 0x6e, 0x74, 0x72, 0x61, 0x63, 0x74, 0x5f, 0x69, 0x64, 0x18, 0x04, 0x20, 0x01, 0x28,
	0x09, 0x52, 0x15, 0x74, 0x72, 0x61, 0x6e, 0x73, 0x61, 0x63, 0x74, 0x69, 0x6f, 0x6e, 0x43, 0x6f,
	0x6e, 0x74, 0x72, 0x61, 0x63, 0x74, 0x49, 0x64, 0x12, 0x29, 0x0a, 0x10, 0x74, 0x72, 0x61, 0x6e,
	0x73, 0x61, 0x63, 0x74, 0x69, 0x6f, 0x6e, 0x5f, 0x66, 0x75, 0x6e, 0x63, 0x18, 0x05, 0x20, 0x01,
	0x28, 0x09, 0x52, 0x0f, 0x74, 0x72, 0x61, 0x6e, 0x73, 0x61, 0x63, 0x74, 0x69, 0x6f, 0x6e, 0x46,
	0x75, 0x6e, 0x63, 0x22, 0xc0, 0x01, 0x0a, 0x11, 0x45, 0x76, 0x65, 0x6e, 0x74, 0x53, 0x75, 0x62,
	0x73, 0x63, 0x72, 0x69, 0x70, 0x74, 0x69, 0x6f, 0x6e, 0x12, 0x40, 0x0a, 0x0d, 0x65, 0x76, 0x65,
	0x6e, 0x74, 0x5f, 0x6d, 0x61, 0x74, 0x63, 0x68, 0x65, 0x72, 0x18, 0x01, 0x20, 0x01, 0x28, 0x0b,
	0x32, 0x1b, 0x2e, 0x63, 0x6f, 0x6d, 0x6d, 0x6f, 0x6e, 0x2e, 0x65, 0x76, 0x65, 0x6e, 0x74, 0x73,
	0x2e, 0x45, 0x76, 0x65, 0x6e, 0x74, 0x4d, 0x61, 0x74, 0x63, 0x68, 0x65, 0x72, 0x52, 0x0c, 0x65,
	0x76, 0x65, 0x6e, 0x74, 0x4d, 0x61, 0x74, 0x63, 0x68, 0x65, 0x72, 0x12, 0x29, 0x0a, 0x05, 0x71,
	0x75, 0x65, 0x72, 0x79, 0x18, 0x02, 0x20, 0x01, 0x28, 0x0b, 0x32, 0x13, 0x2e, 0x63, 0x6f, 0x6d,
	0x6d, 0x6f, 0x6e, 0x2e, 0x71, 0x75, 0x65, 0x72, 0x79, 0x2e, 0x51, 0x75, 0x65, 0x72, 0x79, 0x52,
	0x05, 0x71, 0x75, 0x65, 0x72, 0x79, 0x12, 0x3e, 0x0a, 0x09, 0x6f, 0x70, 0x65, 0x72, 0x61, 0x74,
	0x69, 0x6f, 0x6e, 0x18, 0x03, 0x20, 0x01, 0x28, 0x0e, 0x32, 0x20, 0x2e, 0x63, 0x6f, 0x6d, 0x6d,
	0x6f, 0x6e, 0x2e, 0x65, 0x76, 0x65, 0x6e, 0x74, 0x73, 0x2e, 0x45, 0x76, 0x65, 0x6e, 0x74, 0x53,
	0x75, 0x62, 0x4f, 0x70, 0x65, 0x72, 0x61, 0x74, 0x69, 0x6f, 0x6e, 0x52, 0x09, 0x6f, 0x70, 0x65,
	0x72, 0x61, 0x74, 0x69, 0x6f, 0x6e, 0x22, 0xa6, 0x04, 0x0a, 0x16, 0x45, 0x76, 0x65, 0x6e, 0x74,
	0x53, 0x75, 0x62, 0x73, 0x63, 0x72, 0x69, 0x70, 0x74, 0x69, 0x6f, 0x6e, 0x53, 0x74, 0x61, 0x74,
	0x65, 0x12, 0x1d, 0x0a, 0x0a, 0x72, 0x65, 0x71, 0x75, 0x65, 0x73, 0x74, 0x5f, 0x69, 0x64, 0x18,
	0x01, 0x20, 0x01, 0x28, 0x09, 0x52, 0x09, 0x72, 0x65, 0x71, 0x75, 0x65, 0x73, 0x74, 0x49, 0x64,
	0x12, 0x32, 0x0a, 0x15, 0x70, 0x75, 0x62, 0x6c, 0x69, 0x73, 0x68, 0x69, 0x6e, 0x67, 0x5f, 0x72,
	0x65, 0x71, 0x75, 0x65, 0x73, 0x74, 0x5f, 0x69, 0x64, 0x18, 0x02, 0x20, 0x01, 0x28, 0x09, 0x52,
	0x13, 0x70, 0x75, 0x62, 0x6c, 0x69, 0x73, 0x68, 0x69, 0x6e, 0x67, 0x52, 0x65, 0x71, 0x75, 0x65,
	0x73, 0x74, 0x49, 0x64, 0x12, 0x44, 0x0a, 0x06, 0x73, 0x74, 0x61, 0x74, 0x75, 0x73, 0x18, 0x03,
	0x20, 0x01, 0x28, 0x0e, 0x32, 0x2c, 0x2e, 0x63, 0x6f, 0x6d, 0x6d, 0x6f, 0x6e, 0x2e, 0x65, 0x76,
	0x65, 0x6e, 0x74, 0x73, 0x2e, 0x45, 0x76, 0x65, 0x6e, 0x74, 0x53, 0x75, 0x62, 0x73, 0x63, 0x72,
	0x69, 0x70, 0x74, 0x69, 0x6f, 0x6e, 0x53, 0x74, 0x61, 0x74, 0x65, 0x2e, 0x53, 0x54, 0x41, 0x54,
	0x55, 0x53, 0x52, 0x06, 0x73, 0x74, 0x61, 0x74, 0x75, 0x73, 0x12, 0x18, 0x0a, 0x07, 0x6d, 0x65,
	0x73, 0x73, 0x61, 0x67, 0x65, 0x18, 0x04, 0x20, 0x01, 0x28, 0x09, 0x52, 0x07, 0x6d, 0x65, 0x73,
	0x73, 0x61, 0x67, 0x65, 0x12, 0x40, 0x0a, 0x0d, 0x65, 0x76, 0x65, 0x6e, 0x74, 0x5f, 0x6d, 0x61,
	0x74, 0x63, 0x68, 0x65, 0x72, 0x18, 0x05, 0x20, 0x01, 0x28, 0x0b, 0x32, 0x1b, 0x2e, 0x63, 0x6f,
	0x6d, 0x6d, 0x6f, 0x6e, 0x2e, 0x65, 0x76, 0x65, 0x6e, 0x74, 0x73, 0x2e, 0x45, 0x76, 0x65, 0x6e,
	0x74, 0x4d, 0x61, 0x74, 0x63, 0x68, 0x65, 0x72, 0x52, 0x0c, 0x65, 0x76, 0x65, 0x6e, 0x74, 0x4d,
	0x61, 0x74, 0x63, 0x68, 0x65, 0x72, 0x12, 0x57, 0x0a, 0x17, 0x65, 0x76, 0x65, 0x6e, 0x74, 0x5f,
	0x70, 0x75, 0x62, 0x6c, 0x69, 0x63, 0x61, 0x74, 0x69, 0x6f, 0x6e, 0x5f, 0x73, 0x70, 0x65, 0x63,
	0x73, 0x18, 0x06, 0x20, 0x03, 0x28, 0x0b, 0x32, 0x1f, 0x2e, 0x63, 0x6f, 0x6d, 0x6d, 0x6f, 0x6e,
	0x2e, 0x65, 0x76, 0x65, 0x6e, 0x74, 0x73, 0x2e, 0x45, 0x76, 0x65, 0x6e, 0x74, 0x50, 0x75, 0x62,
	0x6c, 0x69, 0x63, 0x61, 0x74, 0x69, 0x6f, 0x6e, 0x52, 0x15, 0x65, 0x76, 0x65, 0x6e, 0x74, 0x50,
	0x75, 0x62, 0x6c, 0x69, 0x63, 0x61, 0x74, 0x69, 0x6f, 0x6e, 0x53, 0x70, 0x65, 0x63, 0x73, 0x22,
	0xbd, 0x01, 0x0a, 0x06, 0x53, 0x54, 0x41, 0x54, 0x55, 0x53, 0x12, 0x19, 0x0a, 0x15, 0x53, 0x55,
	0x42, 0x53, 0x43, 0x52, 0x49, 0x42, 0x45, 0x5f, 0x50, 0x45, 0x4e, 0x44, 0x49, 0x4e, 0x47, 0x5f,
	0x41, 0x43, 0x4b, 0x10, 0x00, 0x12, 0x15, 0x0a, 0x11, 0x53, 0x55, 0x42, 0x53, 0x43, 0x52, 0x49,
	0x42, 0x45, 0x5f, 0x50, 0x45, 0x4e, 0x44, 0x49, 0x4e, 0x47, 0x10, 0x01, 0x12, 0x0e, 0x0a, 0x0a,
	0x53, 0x55, 0x42, 0x53, 0x43, 0x52, 0x49, 0x42, 0x45, 0x44, 0x10, 0x02, 0x12, 0x1b, 0x0a, 0x17,
	0x55, 0x4e, 0x53, 0x55, 0x42, 0x53, 0x43, 0x52, 0x49, 0x42, 0x45, 0x5f, 0x50, 0x45, 0x4e, 0x44,
	0x49, 0x4e, 0x47, 0x5f, 0x41, 0x43, 0x4b, 0x10, 0x03, 0x12, 0x17, 0x0a, 0x13, 0x55, 0x4e, 0x53,
	0x55, 0x42, 0x53, 0x43, 0x52, 0x49, 0x42, 0x45, 0x5f, 0x50, 0x45, 0x4e, 0x44, 0x49, 0x4e, 0x47,
	0x10, 0x04, 0x12, 0x10, 0x0a, 0x0c, 0x55, 0x4e, 0x53, 0x55, 0x42, 0x53, 0x43, 0x52, 0x49, 0x42,
	0x45, 0x44, 0x10, 0x05, 0x12, 0x09, 0x0a, 0x05, 0x45, 0x52, 0x52, 0x4f, 0x52, 0x10, 0x06, 0x12,
	0x1e, 0x0a, 0x1a, 0x44, 0x55, 0x50, 0x4c, 0x49, 0x43, 0x41, 0x54, 0x45, 0x5f, 0x51, 0x55, 0x45,
	0x52, 0x59, 0x5f, 0x53, 0x55, 0x42, 0x53, 0x43, 0x52, 0x49, 0x42, 0x45, 0x44, 0x10, 0x07, 0x22,
	0xde, 0x01, 0x0a, 0x13, 0x43, 0x6f, 0x6e, 0x74, 0x72, 0x61, 0x63, 0x74, 0x54, 0x72, 0x61, 0x6e,
	0x73, 0x61, 0x63, 0x74, 0x69, 0x6f, 0x6e, 0x12, 0x1b, 0x0a, 0x09, 0x64, 0x72, 0x69, 0x76, 0x65,
	0x72, 0x5f, 0x69, 0x64, 0x18, 0x01, 0x20, 0x01, 0x28, 0x09, 0x52, 0x08, 0x64, 0x72, 0x69, 0x76,
	0x65, 0x72, 0x49, 0x64, 0x12, 0x1b, 0x0a, 0x09, 0x6c, 0x65, 0x64, 0x67, 0x65, 0x72, 0x5f, 0x69,
	0x64, 0x18, 0x02, 0x20, 0x01, 0x28, 0x09, 0x52, 0x08, 0x6c, 0x65, 0x64, 0x67, 0x65, 0x72, 0x49,
	0x64, 0x12, 0x1f, 0x0a, 0x0b, 0x63, 0x6f, 0x6e, 0x74, 0x72, 0x61, 0x63, 0x74, 0x5f, 0x69, 0x64,
	0x18, 0x03, 0x20, 0x01, 0x28, 0x09, 0x52, 0x0a, 0x63, 0x6f, 0x6e, 0x74, 0x72, 0x61, 0x63, 0x74,
	0x49, 0x64, 0x12, 0x12, 0x0a, 0x04, 0x66, 0x75, 0x6e, 0x63, 0x18, 0x04, 0x20, 0x01, 0x28, 0x09,
	0x52, 0x04, 0x66, 0x75, 0x6e, 0x63, 0x12, 0x12, 0x0a, 0x04, 0x61, 0x72, 0x67, 0x73, 0x18, 0x05,
	0x20, 0x03, 0x28, 0x0c, 0x52, 0x04, 0x61, 0x72, 0x67, 0x73, 0x12, 0x2a, 0x0a, 0x11, 0x72, 0x65,
	0x70, 0x6c, 0x61, 0x63, 0x65, 0x5f, 0x61, 0x72, 0x67, 0x5f, 0x69, 0x6e, 0x64, 0x65, 0x78, 0x18,
	0x06, 0x20, 0x01, 0x28, 0x04, 0x52, 0x0f, 0x72, 0x65, 0x70, 0x6c, 0x61, 0x63, 0x65, 0x41, 0x72,
	0x67, 0x49, 0x6e, 0x64, 0x65, 0x78, 0x12, 0x18, 0x0a, 0x07, 0x6d, 0x65, 0x6d, 0x62, 0x65, 0x72,
	0x73, 0x18, 0x07, 0x20, 0x03, 0x28, 0x09, 0x52, 0x07, 0x6d, 0x65, 0x6d, 0x62, 0x65, 0x72, 0x73,
	0x22, 0x7b, 0x0a, 0x10, 0x45, 0x76, 0x65, 0x6e, 0x74, 0x50, 0x75, 0x62, 0x6c, 0x69, 0x63, 0x61,
	0x74, 0x69, 0x6f, 0x6e, 0x12, 0x36, 0x0a, 0x03, 0x63, 0x74, 0x78, 0x18, 0x01, 0x20, 0x01, 0x28,
	0x0b, 0x32, 0x22, 0x2e, 0x63, 0x6f, 0x6d, 0x6d, 0x6f, 0x6e, 0x2e, 0x65, 0x76, 0x65, 0x6e, 0x74,
	0x73, 0x2e, 0x43, 0x6f, 0x6e, 0x74, 0x72, 0x61, 0x63, 0x74, 0x54, 0x72, 0x61, 0x6e, 0x73, 0x61,
	0x63, 0x74, 0x69, 0x6f, 0x6e, 0x48, 0x00, 0x52, 0x03, 0x63, 0x74, 0x78, 0x12, 0x19, 0x0a, 0x07,
	0x61, 0x70, 0x70, 0x5f, 0x75, 0x72, 0x6c, 0x18, 0x02, 0x20, 0x01, 0x28, 0x09, 0x48, 0x00, 0x52,
	0x06, 0x61, 0x70, 0x70, 0x55, 0x72, 0x6c, 0x42, 0x14, 0x0a, 0x12, 0x70, 0x75, 0x62, 0x6c, 0x69,
	0x63, 0x61, 0x74, 0x69, 0x6f, 0x6e, 0x5f, 0x74, 0x61, 0x72, 0x67, 0x65, 0x74, 0x22, 0x40, 0x0a,
	0x0b, 0x45, 0x76, 0x65, 0x6e, 0x74, 0x53, 0x74, 0x61, 0x74, 0x65, 0x73, 0x12, 0x31, 0x0a, 0x06,
	0x73, 0x74, 0x61, 0x74, 0x65, 0x73, 0x18, 0x01, 0x20, 0x03, 0x28, 0x0b, 0x32, 0x19, 0x2e, 0x63,
	0x6f, 0x6d, 0x6d, 0x6f, 0x6e, 0x2e, 0x65, 0x76, 0x65, 0x6e, 0x74, 0x73, 0x2e, 0x45, 0x76, 0x65,
	0x6e, 0x74, 0x53, 0x74, 0x61, 0x74, 0x65, 0x52, 0x06, 0x73, 0x74, 0x61, 0x74, 0x65, 0x73, 0x22,
	0x73, 0x0a, 0x0a, 0x45, 0x76, 0x65, 0x6e, 0x74, 0x53, 0x74, 0x61, 0x74, 0x65, 0x12, 0x30, 0x0a,
	0x05, 0x73, 0x74, 0x61, 0x74, 0x65, 0x18, 0x01, 0x20, 0x01, 0x28, 0x0b, 0x32, 0x1a, 0x2e, 0x63,
	0x6f, 0x6d, 0x6d, 0x6f, 0x6e, 0x2e, 0x73, 0x74, 0x61, 0x74, 0x65, 0x2e, 0x52, 0x65, 0x71, 0x75,
	0x65, 0x73, 0x74, 0x53, 0x74, 0x61, 0x74, 0x65, 0x52, 0x05, 0x73, 0x74, 0x61, 0x74, 0x65, 0x12,
	0x19, 0x0a, 0x08, 0x65, 0x76, 0x65, 0x6e, 0x74, 0x5f, 0x69, 0x64, 0x18, 0x02, 0x20, 0x01, 0x28,
	0x09, 0x52, 0x07, 0x65, 0x76, 0x65, 0x6e, 0x74, 0x49, 0x64, 0x12, 0x18, 0x0a, 0x07, 0x6d, 0x65,
	0x73, 0x73, 0x61, 0x67, 0x65, 0x18, 0x03, 0x20, 0x01, 0x28, 0x09, 0x52, 0x07, 0x6d, 0x65, 0x73,
	0x73, 0x61, 0x67, 0x65, 0x2a, 0x3e, 0x0a, 0x09, 0x45, 0x76, 0x65, 0x6e, 0x74, 0x54, 0x79, 0x70,
	0x65, 0x12, 0x10, 0x0a, 0x0c, 0x4c, 0x45, 0x44, 0x47, 0x45, 0x52, 0x5f, 0x53, 0x54, 0x41, 0x54,
	0x45, 0x10, 0x00, 0x12, 0x0e, 0x0a, 0x0a, 0x41, 0x53, 0x53, 0x45, 0x54, 0x5f, 0x4c, 0x4f, 0x43,
	0x4b, 0x10, 0x01, 0x12, 0x0f, 0x0a, 0x0b, 0x41, 0x53, 0x53, 0x45, 0x54, 0x5f, 0x43, 0x4c, 0x41,
	0x49, 0x4d, 0x10, 0x02, 0x2a, 0x3f, 0x0a, 0x11, 0x45, 0x76, 0x65, 0x6e, 0x74, 0x53, 0x75, 0x62,
	0x4f, 0x70, 0x65, 0x72, 0x61, 0x74, 0x69, 0x6f, 0x6e, 0x12, 0x0d, 0x0a, 0x09, 0x53, 0x55, 0x42,
	0x53, 0x43, 0x52, 0x49, 0x42, 0x45, 0x10, 0x00, 0x12, 0x0f, 0x0a, 0x0b, 0x55, 0x4e, 0x53, 0x55,
	0x42, 0x53, 0x43, 0x52, 0x49, 0x42, 0x45, 0x10, 0x01, 0x12, 0x0a, 0x0a, 0x06, 0x55, 0x50, 0x44,
	0x41, 0x54, 0x45, 0x10, 0x02, 0x42, 0x79, 0x0a, 0x31, 0x6f, 0x72, 0x67, 0x2e, 0x68, 0x79, 0x70,
	0x65, 0x72, 0x6c, 0x65, 0x64, 0x67, 0x65, 0x72, 0x2e, 0x63, 0x61, 0x63, 0x74, 0x69, 0x2e, 0x77,
	0x65, 0x61, 0x76, 0x65, 0x72, 0x2e, 0x70, 0x72, 0x6f, 0x74, 0x6f, 0x73, 0x2e, 0x63, 0x6f, 0x6d,
	0x6d, 0x6f, 0x6e, 0x2e, 0x65, 0x76, 0x65, 0x6e, 0x74, 0x73, 0x5a, 0x44, 0x67, 0x69, 0x74, 0x68,
	0x75, 0x62, 0x2e, 0x63, 0x6f, 0x6d, 0x2f, 0x68, 0x79, 0x70, 0x65, 0x72, 0x6c, 0x65, 0x64, 0x67,
	0x65, 0x72, 0x2d, 0x63, 0x61, 0x63, 0x74, 0x69, 0x2f, 0x63, 0x61, 0x63, 0x74, 0x69, 0x2f, 0x77,
	0x65, 0x61, 0x76, 0x65, 0x72, 0x2f, 0x63, 0x6f, 0x6d, 0x6d, 0x6f, 0x6e, 0x2f, 0x70, 0x72, 0x6f,
	0x74, 0x6f, 0x73, 0x2d, 0x67, 0x6f, 0x2f, 0x76, 0x32, 0x2f, 0x63, 0x6f, 0x6d, 0x6d, 0x6f, 0x6e,
	0x62, 0x06, 0x70, 0x72, 0x6f, 0x74, 0x6f, 0x33,
}

var (
	file_common_events_proto_rawDescOnce sync.Once
	file_common_events_proto_rawDescData = file_common_events_proto_rawDesc
)

func file_common_events_proto_rawDescGZIP() []byte {
	file_common_events_proto_rawDescOnce.Do(func() {
		file_common_events_proto_rawDescData = protoimpl.X.CompressGZIP(file_common_events_proto_rawDescData)
	})
	return file_common_events_proto_rawDescData
}

var file_common_events_proto_enumTypes = make([]protoimpl.EnumInfo, 3)
var file_common_events_proto_msgTypes = make([]protoimpl.MessageInfo, 7)
var file_common_events_proto_goTypes = []interface{}{
	(EventType)(0),                     // 0: common.events.EventType
	(EventSubOperation)(0),             // 1: common.events.EventSubOperation
	(EventSubscriptionState_STATUS)(0), // 2: common.events.EventSubscriptionState.STATUS
	(*EventMatcher)(nil),               // 3: common.events.EventMatcher
	(*EventSubscription)(nil),          // 4: common.events.EventSubscription
	(*EventSubscriptionState)(nil),     // 5: common.events.EventSubscriptionState
	(*ContractTransaction)(nil),        // 6: common.events.ContractTransaction
	(*EventPublication)(nil),           // 7: common.events.EventPublication
	(*EventStates)(nil),                // 8: common.events.EventStates
	(*EventState)(nil),                 // 9: common.events.EventState
	(*Query)(nil),                      // 10: common.query.Query
	(*RequestState)(nil),               // 11: common.state.RequestState
}
var file_common_events_proto_depIdxs = []int32{
	0,  // 0: common.events.EventMatcher.event_type:type_name -> common.events.EventType
	3,  // 1: common.events.EventSubscription.event_matcher:type_name -> common.events.EventMatcher
	10, // 2: common.events.EventSubscription.query:type_name -> common.query.Query
	1,  // 3: common.events.EventSubscription.operation:type_name -> common.events.EventSubOperation
	2,  // 4: common.events.EventSubscriptionState.status:type_name -> common.events.EventSubscriptionState.STATUS
	3,  // 5: common.events.EventSubscriptionState.event_matcher:type_name -> common.events.EventMatcher
	7,  // 6: common.events.EventSubscriptionState.event_publication_specs:type_name -> common.events.EventPublication
	6,  // 7: common.events.EventPublication.ctx:type_name -> common.events.ContractTransaction
	9,  // 8: common.events.EventStates.states:type_name -> common.events.EventState
	11, // 9: common.events.EventState.state:type_name -> common.state.RequestState
	10, // [10:10] is the sub-list for method output_type
	10, // [10:10] is the sub-list for method input_type
	10, // [10:10] is the sub-list for extension type_name
	10, // [10:10] is the sub-list for extension extendee
	0,  // [0:10] is the sub-list for field type_name
}

func init() { file_common_events_proto_init() }
func file_common_events_proto_init() {
	if File_common_events_proto != nil {
		return
	}
	file_common_query_proto_init()
	file_common_state_proto_init()
	if !protoimpl.UnsafeEnabled {
		file_common_events_proto_msgTypes[0].Exporter = func(v interface{}, i int) interface{} {
			switch v := v.(*EventMatcher); i {
			case 0:
				return &v.state
			case 1:
				return &v.sizeCache
			case 2:
				return &v.unknownFields
			default:
				return nil
			}
		}
		file_common_events_proto_msgTypes[1].Exporter = func(v interface{}, i int) interface{} {
			switch v := v.(*EventSubscription); i {
			case 0:
				return &v.state
			case 1:
				return &v.sizeCache
			case 2:
				return &v.unknownFields
			default:
				return nil
			}
		}
		file_common_events_proto_msgTypes[2].Exporter = func(v interface{}, i int) interface{} {
			switch v := v.(*EventSubscriptionState); i {
			case 0:
				return &v.state
			case 1:
				return &v.sizeCache
			case 2:
				return &v.unknownFields
			default:
				return nil
			}
		}
		file_common_events_proto_msgTypes[3].Exporter = func(v interface{}, i int) interface{} {
			switch v := v.(*ContractTransaction); i {
			case 0:
				return &v.state
			case 1:
				return &v.sizeCache
			case 2:
				return &v.unknownFields
			default:
				return nil
			}
		}
		file_common_events_proto_msgTypes[4].Exporter = func(v interface{}, i int) interface{} {
			switch v := v.(*EventPublication); i {
			case 0:
				return &v.state
			case 1:
				return &v.sizeCache
			case 2:
				return &v.unknownFields
			default:
				return nil
			}
		}
		file_common_events_proto_msgTypes[5].Exporter = func(v interface{}, i int) interface{} {
			switch v := v.(*EventStates); i {
			case 0:
				return &v.state
			case 1:
				return &v.sizeCache
			case 2:
				return &v.unknownFields
			default:
				return nil
			}
		}
		file_common_events_proto_msgTypes[6].Exporter = func(v interface{}, i int) interface{} {
			switch v := v.(*EventState); i {
			case 0:
				return &v.state
			case 1:
				return &v.sizeCache
			case 2:
				return &v.unknownFields
			default:
				return nil
			}
		}
	}
	file_common_events_proto_msgTypes[4].OneofWrappers = []interface{}{
		(*EventPublication_Ctx)(nil),
		(*EventPublication_AppUrl)(nil),
	}
	type x struct{}
	out := protoimpl.TypeBuilder{
		File: protoimpl.DescBuilder{
			GoPackagePath: reflect.TypeOf(x{}).PkgPath(),
			RawDescriptor: file_common_events_proto_rawDesc,
			NumEnums:      3,
			NumMessages:   7,
			NumExtensions: 0,
			NumServices:   0,
		},
		GoTypes:           file_common_events_proto_goTypes,
		DependencyIndexes: file_common_events_proto_depIdxs,
		EnumInfos:         file_common_events_proto_enumTypes,
		MessageInfos:      file_common_events_proto_msgTypes,
	}.Build()
	File_common_events_proto = out.File
	file_common_events_proto_rawDesc = nil
	file_common_events_proto_goTypes = nil
	file_common_events_proto_depIdxs = nil
}
