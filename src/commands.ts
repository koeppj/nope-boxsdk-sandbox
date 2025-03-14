import { BoxCcgAuth, BoxClient, CcgConfig } from "box-typescript-sdk-gen";
import { GetFolderByIdOptionals, GetFolderByIdOptionalsInput, GetFolderByIdQueryParams } from "box-typescript-sdk-gen/lib/managers/folders.generated";
<<<<<<< HEAD
import { config } from "./config";
=======
>>>>>>> b868271c264b8555eb3a935fcb38d23a9fd72d8b

function getBoxClient(): BoxClient {
    const ccgConfig = new CcgConfig({
        clientId: config.clientId || '',
        clientSecret: config.clientSecret || '',
        enterpriseId: config.enterpriseId || ''
    });
    const auth = new BoxCcgAuth({config: ccgConfig});
    return new BoxClient({auth});
}

export async function GetPath(id: string, options: { folder?: boolean }) {
    const boxClient = getBoxClient();
    if (options.folder) {
<<<<<<< HEAD
        await boxClient.folders.getFolderById(id).then((res) => {
            const path = res.pathCollection?.entries.slice(1).map((entry) => entry.name).join("/");
            console.log(`Path to Folder called '${res.name}': /${path}`);
            return Promise.resolve();
        }).catch((error) => {
            return Promise.reject(error);
        })
=======
        const options: GetFolderByIdOptionalsInput = {
            queryParams: {
                fields: ['name,path_collection']
            }
        };
        const item = await boxClient.folders.getFolderById(id);
        console.log(`Getting path for folder ${item.name}...`);
>>>>>>> b868271c264b8555eb3a935fcb38d23a9fd72d8b
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