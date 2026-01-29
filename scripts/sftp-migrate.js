const SftpClient = require("ssh2-sftp-client")
const fs = require("fs")
const path = require("path")

async function migrate() {
    const sftp = new SftpClient()
    const config = {
        host: "82.29.157.119",
        port: 22,
        username: "u16408415.gold-mink-702465.hostingersite.com", // This might be the FTP user, 
        // Hostinger SFTP user is often just the main uXXXXXX account.
        // Let's try u16408415 if the long one fails.
        password: "BtWY#H9s"
    }

    try {
        console.log("Connecting via SFTP...")
        await sftp.connect(config)
        console.log("Connected!")

        console.log("Listing /public_html...")
        const list = await sftp.list("/public_html")
        console.log("Current files:", list.map(f => f.name))

        // ... rest of the logic ...
    } catch (err) {
        console.error("SFTP Connection failed:", err)
        // Try alternate username if it's the short one
        if (config.username.includes(".")) {
            console.log("Retrying with short username...")
            config.username = "u16408415"
            try {
                await sftp.connect(config)
                console.log("Connected with short username!")
            } catch (err2) {
                console.error("Both attempts failed.", err2)
            }
        }
    } finally {
        await sftp.end()
    }
}

migrate()
