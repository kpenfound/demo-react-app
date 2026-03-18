// A generated module for Test functions
//
// This module has been generated via dagger init and serves as a reference to
// basic module structure as you get started with Dagger.
//
// Two functions have been pre-created. You can modify, delete, or add to them,
// as needed. They demonstrate usage of arguments and return types using simple
// echo and grep commands. The functions can be called from the dagger CLI or
// from one of the SDKs.
//
// The first line in this comment block is a short description line and the
// rest is a long description with more detail on the module's purpose or usage,
// if appropriate. All modules should have a short description.

package main

import (
	"context"
	"dagger/test/internal/dagger"
)

type TestSecret struct{}

// Returns a container that echoes whatever string argument is provided
// +check
func (m *TestSecret) Foo(
	ctx context.Context,
	// +optional
	bar *dagger.Secret,
	// +optional
	baz *dagger.Secret,
) error {
	ctr := dag.Container().From("alpine:latest")
	if bar != nil {
		ctr = ctr.WithSecretVariable("BAR", bar).WithExec([]string{"echo", "Mounted Secret Bar"})
	}
	if baz != nil {
		ctr = ctr.WithSecretVariable("BAZ", baz).WithExec([]string{"echo", "Mounted Secret Baz"})
	}
	_, err := ctr.Sync(ctx)
	return err
}
