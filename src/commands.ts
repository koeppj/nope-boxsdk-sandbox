import { BoxCcgAuth, BoxClient, CcgConfig } from "box-typescript-sdk-gen";
import { GetFolderByIdOptionals, GetFolderByIdOptionalsInput, GetFolderByIdQueryParams } from "box-typescript-sdk-gen/lib/managers/folders.generated";
import { config } from "./config";

function getBoxClient(): BoxClient {
    const ccgConfig = new CcgConfig({
        clientId: config.clientId || '',
        clientSecret: config.clientSecret || '',
        enterpriseId: config.enterpriseId || ''
    });
    const auth = new BoxCcgAuth({config: ccgConfig});
    return new BoxClient({auth});
}

export async function GetPath(id: string, options: any) {
    const boxClient = getBoxClient();
    if (options.folder) {
        await boxClient.folders.getFolderById(id).then((res) => {
            const path = res.pathCollection?.entries.slice(1).map((entry) => entry.name).join("/");
            console.log(`Path to Folder called '${res.name}': /${path}`);
            return Promise.resolve();
        }).catch((error) => {
            return Promise.reject(error);
        })
    } else {
        await boxClient.files.getFileById(id).then((res) => {
            const path = res.pathCollection?.entries.slice(1).map((entry) => entry.name).join("/");
            console.log(`Path to File '${res.name}': /${path}`);
            return Promise.resolve();
        }
        ).catch((error) => {    
            return Promise.reject(error);
        })
    }
}