# Executor

This Gate 3 package builds a declarative, provider-free OCI invocation. It pins
the image by digest and fixes a non-root, read-only, no-network policy before
any container runtime is called.

It intentionally does not execute Docker, accept credentials, mount host paths
or expose a provider configuration surface.
