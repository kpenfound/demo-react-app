;(async function() {
  let connect = (await import("@dagger.io/dagger")).connect
  connect(async (client) => {
    await frontendPipeline(client)
    await backendPipeline(client)
  }, {LogOutput: process.stdout})
})()

async function backendPipeline(client) {
  const backend = client.host().directory(".", {include:["backend/", "package-lock.json", "package.json", "yarn.lock"]})

  // Test pipeline
  const test = nodeBase(client.pipeline("Test"), backend)
  .with(backendService(client, backend))
  .withExec(["yarn", "install", "--frozen-lockfile"])
  .withExec(["node", "--test", "backend/"])

  await test.sync()
}

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

function redis(client) {
  let service = client.container().from("redis")
  .withExec(['redis-server'])
  .withExposedPort(6379)

  return (container) => {
    return container.withServiceBinding('redis', service)
    .withEnvVariable('REDIS_HOST', 'redis')
  }
}

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

   // Production image output
   await prod.export("./out/prod-image.tar")
   // await prod.publish(image)
}

function nodeBase(client, source) {
  return client.container()
  .from("node:16")
  .with(withProject(client, source))
  .with(withYarn(client))
  .with(withNodeModules(client))
}

function withProject(client, source) {
  return (container) => {
    return container.withDirectory('/src', source).withWorkdir('/src').withEnvVariable("CI", "true")
  }
}

function withYarn(client) {
  const cache = client.cacheVolume("yarn_cache")

  return (container) => {
    return container.withMountedCache("/cache/yarn", cache).withEnvVariable("YARN_CACHE_FOLDER", "/cache/yarn")
  }
}

function withNodeModules(client) {
  const cache = client.cacheVolume("node_modules")

  return (container) => {
    return container.withMountedCache("/src/node_modules", cache)
  }
}

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