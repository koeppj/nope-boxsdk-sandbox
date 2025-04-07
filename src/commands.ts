import { BoxCcgAuth, BoxClient, CcgConfig } from "box-typescript-sdk-gen";
import { BoxApiError } from "box-typescript-sdk-gen/lib/box/errors";
import { config } from "./config";
import { GetFolderItemsOptionalsInput } from "box-typescript-sdk-gen/lib/managers/folders.generated";
import { FileFullOrFolderMiniOrWebLink } from "box-typescript-sdk-gen/lib/schemas/fileFullOrFolderMiniOrWebLink.generated";

function getBoxClient(user?: string | undefined): BoxClient {
    let ccgConfig: CcgConfig;
    if (user) {
        ccgConfig = new CcgConfig({
            clientId: config.clientId || '',
            clientSecret: config.clientSecret || '',
            userId: user,
        });
    } else {
        ccgConfig = new CcgConfig({
            clientId: config.clientId || '',
            clientSecret: config.clientSecret || '',
            enterpriseId: config.enterpriseId || ''
        });
    }
    const auth = new BoxCcgAuth({config: ccgConfig});
    return new BoxClient({auth});
}

async function getFolderItemsWithName(boxClient: BoxClient, folderId: string, name: string, type?: "file"  | "folder" | "web_link"): Promise<FileFullOrFolderMiniOrWebLink[]> {
    const items: FileFullOrFolderMiniOrWebLink[] = [];
    let getFolderListOptions: GetFolderItemsOptionalsInput = {
        queryParams: {
             limit: 1000,
             usemarker: true,
        }
     }
     try {
        let more = true;
        // loop thru the root folder contents
        while (more) {
            const topItems = await boxClient.folders.getFolderItems(folderId, getFolderListOptions);
            // look thru the entries and see if the pathParts[0] is in the list
            topItems?.entries?.forEach(entry => {
                if (entry.name === name && (!type || entry.type === type)) {
                    items.push(entry);
                }
            });
            if (topItems.entries && topItems.entries.length < 1000) {
                // Less than 1000 items means we are done
                more = false;
            } else {
                if (getFolderListOptions.queryParams) {
                    getFolderListOptions = {
                        ...getFolderListOptions,
                        queryParams: {
                            ...getFolderListOptions.queryParams,
                            marker: topItems.nextMarker as string
                        }
                    };
                }
            }
        }
        return Promise.resolve(items);
     } catch(error) {
        return Promise.reject(error)
     }
}

function printFolderItems(items: FileFullOrFolderMiniOrWebLink[]) {
    items.forEach(item => {
        console.log(`ID: ${item.id}, Name: ${item.name}, Type: ${item.type}`);
    });
}

export async function GetPath(id: string, options: any): Promise<any> {
    const boxClient = getBoxClient();
    if (options.folder) {
        await boxClient.folders.getFolderById(id).then((res) => {
            const path = res.pathCollection?.entries.slice(1).map((entry) => entry.name).join("/");
            console.log(`Path to Folder called '${res.name}': /${path}`);
            return Promise.resolve();
        }).catch((error: BoxApiError) => {
            return (error.message === "404") ? Promise.reject("Folder not found"): Promise.reject(error);
        })
    } else {
        await boxClient.files.getFileById(id).then((res) => {
            const path = res.pathCollection?.entries.slice(1).map((entry) => entry.name).join("/");
            console.log(`Path to File called '${res.name}': /${path}`);
            return Promise.resolve();
        }
        ).catch((error:BoxApiError) => {    
            return (error.message === "404") ? Promise.reject("File not found"): Promise.reject(error);
        })
    }
}

export async function GetId(path: string, options: any): Promise<any> {
    console.log(`Options are ${JSON.stringify(options,null,2)}`);
    const boxClient = getBoxClient();
    const pathParts = path.split("/").filter(part => part !== '');
    try {
        // Just one level specified then list all the items
        if (pathParts.length === 1) {
            const topsLevelIems = await getFolderItemsWithName(boxClient,"0",pathParts[0]);
            if (topsLevelIems.length === 0) {
                return Promise.reject("No Items Found")
            } else {
                printFolderItems(topsLevelIems)
                return Promise.resolve()
            }
        }

        // Just get the Folders
        const topsLevelIems = await getFolderItemsWithName(boxClient,"0",pathParts[0], "folder");
        const foundItems: FileFullOrFolderMiniOrWebLink[] = [];

        // Now loop thru the top level items and see if we can find the path
        for (const item of topsLevelIems) {
            let folderId = item.id;
            let pathIndex = 1;
            let found = true;
            let lastItemId: string | undefined = undefined
            while ((pathIndex < pathParts.length-1) && found) {
                const folderItems = await getFolderItemsWithName(boxClient,folderId,pathParts[pathIndex], "folder");
                if (folderItems.length === 0) {
                    found = false;
                } else {
                    pathIndex++;
                    folderId = folderItems[0].id
                    lastItemId = folderItems[0].id
                }
            }
            console.debug(`Stopped at id ${lastItemId} for pathItem ${pathParts[pathIndex]}`);
            if (lastItemId && found) {
                const lastItems = await getFolderItemsWithName(boxClient, lastItemId, pathParts[pathIndex])
                console.log(JSON.stringify(lastItems,null,2))
                foundItems.push(...lastItems);
            }
        }
        if (foundItems.length > 0) {
            printFolderItems(foundItems);
            return Promise.resolve()
        } else {
            return Promise.reject(`No items found matching the path ${path}`);
        }
        return Promise.resolve();
    } catch (error) {
        Promise.reject(error)
    }
}

export async function GetHoldPolicies(options: any): Promise<any> {
    const boxClient = getBoxClient(options.user);
    try {
        const retentionPolicies = await boxClient.legalHoldPolicies.getLegalHoldPolicies();
        console.log(JSON.stringify(retentionPolicies, null, 2));
        return Promise.resolve();
    } catch (error) {
        return Promise.reject(error);
    }
}

export async function GetUserByLogin(login: string, options: any): Promise<any> {
    const boxClient = getBoxClient(options.user);
    try {
        const users = await boxClient.users.getUsers();
        const user = users.entries?.find((user) => user.login === login);
        if (user === undefined) {
            return Promise.reject(`User with login ${login} not found`);
        }
        console.log(JSON.stringify(user, null, 2));
        return Promise.resolve(user);
    } catch (error) {
        return Promise.reject(error);
    }
}