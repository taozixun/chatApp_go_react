package main

import (
	"context"
	"fmt"
	"google.golang.org/grpc"
	grpcService "grpc/pb"
)

func main() {
	conn, e := grpc.Dial("localhost:8888", grpc.WithInsecure())
	fmt.Println("12", e)
	defer conn.Close()
	client := grpcService.NewTestGRPCServiceClient(conn)
	req, _ := client.TestGRPC(context.Background(), &grpcService.Req{Name: "tzx连接"})
	fmt.Println("req.GetAns()", req.GetAns())
}
