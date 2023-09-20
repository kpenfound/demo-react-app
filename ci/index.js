;(async function() {
  let connect = (await import("@dagger.io/dagger")).connect
  connect(async (client) => {
    // Frontend CI
    let frontendImage = await frontendPipeline(client.pipeline('Frontend'))
    // Backend CI
   let backendImage = await backendPipeline(client.pipeline('Backend'))

    // Registry config
    const registry = process.env.REGISTRY
    const registry_user = process.env.REGISTRY_USER
    const registry_token = process.env.REGISTRY_TOKEN

    // Production image output
    if(registry_token == undefined) {
     await frontendImage.export("./out/prod-frontend-image.tar")
     await backendImage.export("./out/prod-backend-image.tar")
    } else {
      const token_secret = client.setSecret('registry_token', registry_token)
      await frontendImage.withRegistryAuth(registry, registry_user, token_secret).publish(`${registry}/docker/frontend:latest`)
     await backendImage.withRegistryAuth(registry, registry_user, token_secret).publish(`${registry}/docker/backend:latest`)
    }
  }, {LogOutput: process.stdout})
})()

// Pipeline for Backend's CI
async function backendPipeline(client) {
  const backend = getBackend(client)

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
  const frontend = getFrontend(client)

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
//  .with(withNodeModules(client))
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

// Helper to configure node_modules cache
function withNodeModules(client) {
  const cache = client.cacheVolume("node_modules")

  return (container) => {
    return container.withMountedCache("/src/node_modules", cache)
  }
}

// Helper to get frontend code
function getFrontend(client) {
  if (isCi()) {
    console.log(ciRef())
    gitdir = client.git("github.com/kpenfound/demo-react-app").commit(ciRef()).tree()
    return gitdir//return client.directory().withDirectory(".", gitdir, {include:["src/", "public/", "package-lock.json", "package.json", "yarn.lock"]})
  }
  return client.host().directory(".", {include:["src/", "public/", "package-lock.json", "package.json", "yarn.lock"]})
}

// Helper to get backend code
function getBackend(client) {
  if (isCi()) {
    gitdir = client.git("github.com/kpenfound/demo-react-app").commit(ciRef()).tree()
    return gitdir//return client.directory().withDirectory(".", gitdir, {include:["backend/", "package-lock.json", "package.json", "yarn.lock"]})
  }
  return client.host().directory(".", {include:["backend/", "package-lock.json", "package.json", "yarn.lock"]})
}

// Determine if we are in CI
function isCi() {
  return process.env.CI == "trueNEVER"
}

function ciRef() {
  return process.env.GITHUB_REF_NAME
}