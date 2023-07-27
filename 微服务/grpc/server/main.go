package main

import (
	"fmt"
	"golang.org/x/net/context"
	"google.golang.org/grpc"
	grpcService "grpc/pb"
	"net"
)

type server struct { //取出server
	grpcService.UnimplementedTestGRPCServiceServer
}

// 挂载方法
func (s *server) TestGRPC(ctx context.Context, req *grpcService.Req) (res *grpcService.Res, err error) {
	fmt.Println("req.GetName()", req.GetName())
	return &grpcService.Res{Ans: "成功成功"}, nil
}

func main() {
	//注册服务
	l, e := net.Listen("tcp", "127.0.0.1:8888")
	fmt.Println("24", e)
	s := grpc.NewServer()
	grpcService.RegisterTestGRPCServiceServer(s, &server{})
	//创建监听
	s.Serve(l)
}
