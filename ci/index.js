;(async function() {
  let connect = (await import("@dagger.io/dagger")).connect

  connect(async (client) => {
    const image = "index.docker.io/kylepenfound/demo-app:latest"
    const src = client.host().directory(".", {exclude:["node_modules/"]})

    const test = client.container()
    .from("node:16")
    .withDirectory("/src", src)
    .withWorkdir("/src")
    .withEnvVariable("CI", "true")
    .withExec(["npm", "install"])
    .withExec(["npm", "test"])

    const testResults = await test.stdout()
    console.log(testResults)

    const build = test.withExec(["npm", "run", "build"])
    const prod = client.container()
    .from("cgr.dev/chainguard/nginx:latest")
    .withDirectory("/var/lib/nginx/html", build.directory("/src/build"))

    await prod.publish(image)
  }, {LogOutput: process.stdout})
})()