;(async function() {
  let connect = (await import("@dagger.io/dagger")).connect
  connect(async (client) => {
    // Backend CI
    await backendPipeline(client.pipeline('Backend'))
    // Frontend CI
    await frontendPipeline(client.pipeline('Frontend'))
  })
})()

// Pipeline for Backend's CI
async function backendPipeline(client) {
  const backend = client.host().directory(".", {include:["backend/", "package-lock.json", "package.json", "yarn.lock"]})

  // Test pipeline
  const test = nodeBase(client.pipeline("Test"), backend)
  .with(backendService(client, backend))
  .withExec(["yarn", "install", "--frozen-lockfile"])
  .withExec(["node", "--test", "backend/"])

  await test.sync()

  // Production Image Build
  const prod = client.pipeline('Production').container()
  .from("node:16")
  .with(withProject(client, backend))
  .withExec(["yarn", "install", "--frozen-lockfile"])

  return prod
}

// Sidecar that runs Backend
function backendService(client, source) {
  let backend = nodeBase(client, source)
  .with(redis(client))
  .withExec(['yarn', 'install', '--frozen-lockfile'])
  .withExec(['node', './backend/index.mjs'])
  .withExposedPort(3000)

  return (container) => {
    return container.withServiceBinding('backend', backend)
    .withEnvVariable('TEST_SERVER', 'backend:3000')
  }
}

// Sidecar that runs Redis
function redis(client) {
  let service = client.container().from("redis")
  .withExec(['redis-server'])
  .withExposedPort(6379)

  return (container) => {
    return container.withServiceBinding('redis', service)
    .withEnvVariable('REDIS_HOST', 'redis')
  }
}

// Pipeline for Frontend's CI
async function frontendPipeline(client) {
  const frontend = client.host().directory(".", {include:["src/", "public/", "package-lock.json", "package.json", "yarn.lock"]})

   // Test pipeline
   const test = nodeBase(client.pipeline("Test"), frontend)
   .withExec(["yarn", "install", "--frozen-lockfile"])
   .withExec(["yarn", "run", "test"])

   // Test results
   await test.sync()

   // Production image build
   const build = test.withExec(["npm", "run", "build"])
   const prod = client.container().pipeline("Production Build")
   .from("cgr.dev/chainguard/nginx:latest")
   .withDirectory("/var/lib/nginx/html", build.directory("/src/build"))

   return prod
}

// Environment for Node projects
function nodeBase(client, source) {
  return client.container()
  .from("node:16")
  .with(withProject(client, source))
  .with(withYarn(client))
}

// Helper to mount a source code directory
function withProject(client, source) {
  return (container) => {
    return container.withDirectory('/src', source).withWorkdir('/src').withEnvVariable("CI", "true")
  }
}

// Helper to configure Yarn cache
function withYarn(client) {
  const cache = client.cacheVolume("yarn_cache")

  return (container) => {
    return container.withMountedCache("/cache/yarn", cache).withEnvVariable("YARN_CACHE_FOLDER", "/cache/yarn")
  }
}
