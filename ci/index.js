;(async function() {
  let connect = (await import("@dagger.io/dagger")).connect

  connect(async (client) => {
    // const image = "index.docker.io/kylepenfound/demo-app:latest"
    const src = client.host().directory(".", {exclude:["node_modules/", "out/", "ci/"]})

    const cache = client.cacheVolume("yarn_cache")
    const npm = client.cacheVolume("node_modules")

    // Test container
    const test = client.container().pipeline("Test")
    .from("node:16@sha256:466d0a05ecb1e5b9890960592311fa10c2bc6012fc27dbfdcc74abf10fc324fc")
    .withDirectory("/src", src)
    .withWorkdir("/src")
    .withMountedCache("/cache/yarn", cache)
    .withEnvVariable("YARN_CACHE_FOLDER", "/cache/yarn")
    .withMountedCache("/src/node_modules", npm)
    .withEnvVariable("CI", "true")
    .withExec(["yarn", "install", "--frozen-lockfile"]) // some change abcd
    .withExec(["yarn", "run", "test"])

    // Test results
    const testResults = await test.stdout()
    console.log(testResults)

    // Production image build
    const build = test.withExec(["npm", "run", "build"])
    const prod = client.container().pipeline("Production Build")
    .from("cgr.dev/chainguard/nginx:latest")
    .withDirectory("/var/lib/nginx/html", build.directory("/src/build"))

    // Production image output
    await prod.export("./out/prod-image.tar")
    // await prod.publish(image)

    // Java Build
    jenkins = buildJenkins(client.pipeline("Jenkins"))
    await jenkins.file("war/target/jenkins.war").export("out/jenkins.war")
  }, {LogOutput: process.stdout})
})()


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