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
  .with(withNodeModules(client))
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

// Example pipeline to build Jenkins from a git ref
function buildJenkins(client) {
  repo = "https://github.com/jenkinsci/jenkins"

  source = client.git(repo).branch("master").tree()
  maven = client.cacheVolume("maven")

  builder = client.container().pipeline("Build Jenkins")
  .from("eclipse-temurin:17-focal")
  .withExec(["apt-get", "update"])
  .withExec(["apt-get", "install", "-y", "git"])
  .withWorkdir("/tmp")
  .withExec(["wget", "https://dlcdn.apache.org/maven/maven-3/3.9.4/binaries/apache-maven-3.9.4-bin.tar.gz"])
  .withExec(["tar", "xvf", "apache-maven-3.9.4-bin.tar.gz"])
  .withExec(["mv", "apache-maven-3.9.4", "/opt/"])
  .withEnvVariable("M2_HOME", "/opt/apache-maven-3.9.4")
  .withDirectory("/src", source)
  .withWorkdir("/src")
  .withMountedCache("/root/.m2", maven)
  .withExec(["sh", "-c", "/opt/apache-maven-3.9.4/bin/mvn -am -pl war,bom -Pquick-build clean install"])

  return builder
}