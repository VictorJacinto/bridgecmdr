import { app, BrowserWindow } from "electron";
import installExtension, { VUEJS_DEVTOOLS } from "electron-devtools-installer";

const devToolExtensions = [VUEJS_DEVTOOLS];

const isProduction = process.env.NODE_ENV === "production";

let window: BrowserWindow|null = null;

async function createWindow(): Promise<void> {
    window = new BrowserWindow({
        width:          800,
        height:         600,
        webPreferences: {
            devTools:        !isProduction,
            nodeIntegration: true,
        },
    });

    window.removeMenu();
    if (isProduction) {
        window.setFullScreen(true);
    }

    if (!isProduction) {
        window.webContents.openDevTools({
            mode: "undocked",
        });
    }

    window.on("closed", (): void => {
        // The window was closed, so we want to dereference it to indicate the interface is no longer running.  This is
        // really only relevant on macOS.
        window = null;
    });

    try {
        await window.loadFile("dist/render/index.html");
        console.log("Starting BridgeCmdr...");
    } catch (error: unknown) {
        console.error(error);
        process.exit(1);
    }
}

process.on("SIGTERM", () => {
    if (window !== null) {
        window.close();
    }
});

app.allowRendererProcessReuse = false;

app.on("ready", async (): Promise<void> => {
    if (!isProduction) {
        await Promise.all(devToolExtensions.map(async extension => {
            try {
                const name = await installExtension(extension);
                console.log(`Installing ${name}`);
            } catch (error: unknown) {
                console.error(error);
            }
        }));
    }

    await createWindow();
});

app.on("window-all-closed", (): void => {
    if (process.platform !== "darwin") {
        // On macOS, it is common to leave the application running even after all windows are closed.  Only on other
        // platform will we quit.
        app.quit();
    }
});

app.on("activate", async (): Promise<void> => {
    if (window === null) {
        // If an attempt is made to activate the application again, only create a new window if the current one was
        // closed. This should only happen on macOS where it is common to leave the application running even after all
        // windows for it are closed.
        await createWindow();
    }
});

console.log(app.getPath("appData"));
console.log(app.getPath("userData"));
console.log(app.getPath("cache"));
console.log(app.getPath("temp"));
