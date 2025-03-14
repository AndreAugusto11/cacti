// Copyright IBM Corp. All Rights Reserved.
//
// SPDX-License-Identifier: Apache-2.0

// Code generated by protoc-gen-go-grpc. DO NOT EDIT.
// versions:
// - protoc-gen-go-grpc v1.3.0
// - protoc             v4.23.4
// source: relay/datatransfer.proto

package relay

import (
	context "context"
	common "github.com/hyperledger-cacti/cacti/weaver/common/protos-go/v2/common"
	grpc "google.golang.org/grpc"
	codes "google.golang.org/grpc/codes"
	status "google.golang.org/grpc/status"
)

// This is a compile-time assertion to ensure that this generated file
// is compatible with the grpc package it is being compiled against.
// Requires gRPC-Go v1.32.0 or later.
const _ = grpc.SupportPackageIsVersion7

const (
	DataTransfer_RequestState_FullMethodName    = "/relay.datatransfer.DataTransfer/RequestState"
	DataTransfer_SendState_FullMethodName       = "/relay.datatransfer.DataTransfer/SendState"
	DataTransfer_SendDriverState_FullMethodName = "/relay.datatransfer.DataTransfer/SendDriverState"
)

// DataTransferClient is the client API for DataTransfer service.
//
// For semantics around ctx use and closing/ending streaming RPCs, please refer to https://pkg.go.dev/google.golang.org/grpc/?tab=doc#ClientConn.NewStream.
type DataTransferClient interface {
	// the requesting relay sends a RequestState request to the remote relay with a
	// query defining the data it wants to receive
	RequestState(ctx context.Context, in *common.Query, opts ...grpc.CallOption) (*common.Ack, error)
	// the remote relay asynchronously sends back the requested data with
	// SendState
	SendState(ctx context.Context, in *common.ViewPayload, opts ...grpc.CallOption) (*common.Ack, error)
	// Handling state sent from the driver.
	SendDriverState(ctx context.Context, in *common.ViewPayload, opts ...grpc.CallOption) (*common.Ack, error)
}

type dataTransferClient struct {
	cc grpc.ClientConnInterface
}

func NewDataTransferClient(cc grpc.ClientConnInterface) DataTransferClient {
	return &dataTransferClient{cc}
}

func (c *dataTransferClient) RequestState(ctx context.Context, in *common.Query, opts ...grpc.CallOption) (*common.Ack, error) {
	out := new(common.Ack)
	err := c.cc.Invoke(ctx, DataTransfer_RequestState_FullMethodName, in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *dataTransferClient) SendState(ctx context.Context, in *common.ViewPayload, opts ...grpc.CallOption) (*common.Ack, error) {
	out := new(common.Ack)
	err := c.cc.Invoke(ctx, DataTransfer_SendState_FullMethodName, in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *dataTransferClient) SendDriverState(ctx context.Context, in *common.ViewPayload, opts ...grpc.CallOption) (*common.Ack, error) {
	out := new(common.Ack)
	err := c.cc.Invoke(ctx, DataTransfer_SendDriverState_FullMethodName, in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

// DataTransferServer is the server API for DataTransfer service.
// All implementations must embed UnimplementedDataTransferServer
// for forward compatibility
type DataTransferServer interface {
	// the requesting relay sends a RequestState request to the remote relay with a
	// query defining the data it wants to receive
	RequestState(context.Context, *common.Query) (*common.Ack, error)
	// the remote relay asynchronously sends back the requested data with
	// SendState
	SendState(context.Context, *common.ViewPayload) (*common.Ack, error)
	// Handling state sent from the driver.
	SendDriverState(context.Context, *common.ViewPayload) (*common.Ack, error)
	mustEmbedUnimplementedDataTransferServer()
}

// UnimplementedDataTransferServer must be embedded to have forward compatible implementations.
type UnimplementedDataTransferServer struct {
}

func (UnimplementedDataTransferServer) RequestState(context.Context, *common.Query) (*common.Ack, error) {
	return nil, status.Errorf(codes.Unimplemented, "method RequestState not implemented")
}
func (UnimplementedDataTransferServer) SendState(context.Context, *common.ViewPayload) (*common.Ack, error) {
	return nil, status.Errorf(codes.Unimplemented, "method SendState not implemented")
}
func (UnimplementedDataTransferServer) SendDriverState(context.Context, *common.ViewPayload) (*common.Ack, error) {
	return nil, status.Errorf(codes.Unimplemented, "method SendDriverState not implemented")
}
func (UnimplementedDataTransferServer) mustEmbedUnimplementedDataTransferServer() {}

// UnsafeDataTransferServer may be embedded to opt out of forward compatibility for this service.
// Use of this interface is not recommended, as added methods to DataTransferServer will
// result in compilation errors.
type UnsafeDataTransferServer interface {
	mustEmbedUnimplementedDataTransferServer()
}

func RegisterDataTransferServer(s grpc.ServiceRegistrar, srv DataTransferServer) {
	s.RegisterService(&DataTransfer_ServiceDesc, srv)
}

func _DataTransfer_RequestState_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(common.Query)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(DataTransferServer).RequestState(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: DataTransfer_RequestState_FullMethodName,
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(DataTransferServer).RequestState(ctx, req.(*common.Query))
	}
	return interceptor(ctx, in, info, handler)
}

func _DataTransfer_SendState_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(common.ViewPayload)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(DataTransferServer).SendState(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: DataTransfer_SendState_FullMethodName,
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(DataTransferServer).SendState(ctx, req.(*common.ViewPayload))
	}
	return interceptor(ctx, in, info, handler)
}

func _DataTransfer_SendDriverState_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(common.ViewPayload)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(DataTransferServer).SendDriverState(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: DataTransfer_SendDriverState_FullMethodName,
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(DataTransferServer).SendDriverState(ctx, req.(*common.ViewPayload))
	}
	return interceptor(ctx, in, info, handler)
}

// DataTransfer_ServiceDesc is the grpc.ServiceDesc for DataTransfer service.
// It's only intended for direct use with grpc.RegisterService,
// and not to be introspected or modified (even as a copy)
var DataTransfer_ServiceDesc = grpc.ServiceDesc{
	ServiceName: "relay.datatransfer.DataTransfer",
	HandlerType: (*DataTransferServer)(nil),
	Methods: []grpc.MethodDesc{
		{
			MethodName: "RequestState",
			Handler:    _DataTransfer_RequestState_Handler,
		},
		{
			MethodName: "SendState",
			Handler:    _DataTransfer_SendState_Handler,
		},
		{
			MethodName: "SendDriverState",
			Handler:    _DataTransfer_SendDriverState_Handler,
		},
	},
	Streams:  []grpc.StreamDesc{},
	Metadata: "relay/datatransfer.proto",
}
