const ftp = require("basic-ftp")

async function migrate() {
    const client = new ftp.Client()
    client.ftp.verbose = true
    try {
        console.log("Connecting to FTP with short username...")
        await client.access({
            host: "82.29.157.119",
            user: "u16408415",
            password: "BtWY#H9s",
            port: 21,
        })
        console.log("Success with short username!")
    } catch (err) {
        console.error("Short username failed:", err)
    } finally {
        client.close()
    }
}
migrate()
