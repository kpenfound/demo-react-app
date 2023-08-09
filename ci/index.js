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
  }, {LogOutput: process.stdout})
})()