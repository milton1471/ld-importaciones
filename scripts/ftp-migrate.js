const ftp = require("basic-ftp")
const path = require("path")
const fs = require("fs")

async function migrate() {
    const client = new ftp.Client()
    client.ftp.verbose = true
    try {
        console.log("Connecting to FTP...")
        await client.access({
            host: "82.29.157.119",
            user: "u16408415.gold-mink-702465.hostingersite.com",
            password: "BtWY#H9s",
            port: 21,
        })

        console.log("Success! Listing /public_html...")
        await client.cd("public_html")
        let list = await client.list()
        console.log("Current files in /public_html:", list.map(f => f.name))

        console.log("Cleaning /public_html...")
        for (const file of list) {
            if (file.name === "." || file.name === "..") continue
            if (file.isDirectory) {
                await client.removeDir(file.name)
            } else {
                await client.remove(file.name)
            }
        }

        console.log("Verifying empty directory...")
        list = await client.list()
        if (list.length === 0) {
            console.log("Directory is clean.")
        } else {
            console.log("Remaining files:", list.map(f => f.name))
        }

        const installerPath = "c:\\Users\\Milton\\Desktop\\ld-importaciones\\duplicator-files\\installer.php"
        const archivePath = "c:\\Users\\Milton\\Desktop\\ld-importaciones\\duplicator-files\\ldimportaciones_backup_d53e752e5244a5c11474_20260127150246_archive.zip"

        console.log("Uploading installer.php...")
        await client.uploadFrom(installerPath, "installer.php")
        console.log("installer.php uploaded.")

        console.log("Uploading large archive. This will take some time...")
        const totalSize = fs.statSync(archivePath).size
        let lastLogged = 0

        await client.uploadFrom(archivePath, path.basename(archivePath), {
            // Track progress
            // basic-ftp doesn't have a direct progress callback in uploadFrom but we can use upload
        })

        // Let's use a stream for better tracking if possible, 
        // but basic-ftp's uploadFrom handles streams internally.
        // Actually, basic-ftp's trackProgress is done on the client:
        client.trackProgress(info => {
            const pct = Math.round((info.bytesOverall / totalSize) * 100)
            if (pct > lastLogged) {
                console.log(`Progress: ${pct}% (${(info.bytesOverall / 1024 / 1024).toFixed(2)} MB uploaded)`)
                lastLogged = pct
            }
        })

        await client.uploadFrom(archivePath, path.basename(archivePath))
        client.trackProgress() // Stop tracking

        console.log("Verification of upload...")
        list = await client.list()
        console.log("Final file list in /public_html:", list.map(f => `${f.name} (${f.size} bytes)`))

    } catch (err) {
        console.error("Migration failed:", err)
    } finally {
        client.close()
    }
}

migrate()
