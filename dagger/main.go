package main

import (
	"context"
	"fmt"
	"os"
)

type DemoReactApp struct {}

func (m *DemoReactApp) Test(ctx context.Context) error {
	// Step 1
	startGroup("Step 1")
	_, err := dag.Container().From("alpine").WithExec([]string{"echo", "hello world step 1"}).Sync(ctx)
	if err != nil {
		return err
	}
	endGroup()

	// Step 2
	startGroup("Step 2")
	_, err = dag.Container().From("alpine").WithExec([]string{"echo", "hello world step 2"}).Sync(ctx)
	if err != nil {
		return err
	}
	endGroup()
	// Step 3

	startGroup("Step 3")
	_, err = dag.Container().From("alpine").WithExec([]string{"echo", "hello world step 3"}).Sync(ctx)
	if err != nil {
		return err
	}
	endGroup()

	return nil
}

func startGroup(name string) {
	os.Stdout.Write(fmt.Sprintf("::group::%s\n", name))
}

func endGroup() {
	os.Stdout.Write("::endgroup::")
}
