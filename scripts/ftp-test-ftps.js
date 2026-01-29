const ftp = require("basic-ftp")

async function migrate() {
    const client = new ftp.Client()
    client.ftp.verbose = true
    try {
        console.log("Connecting to FTP (Implicit FTPS)...")
        await client.access({
            host: "82.29.157.119",
            user: "u16408415.gold-mink-702465.hostingersite.com",
            password: "BtWY#H9s",
            port: 21,
            secure: true,
            secureOptions: {
                rejectUnauthorized: false
            }
        })
        console.log("Success with FTPS!")
    } catch (err) {
        console.error("FTPS failed:", err)
    } finally {
        client.close()
    }
}
migrate()
