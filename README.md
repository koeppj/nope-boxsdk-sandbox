# Box SDK in Node

Simple NODE command line utility to perform simple tasks using the [Box SDK for Typescript](https://github.com/box/box-typescript-sdk-gen).  

## Setup 

1. Set up a Box Client Credential App
2. Create a .env file in the project root and populate with the client key, client secret and enterprise ID from step 1 (see [.env.sample](.env.sample)).

## Running

* To see command and options run.
``` ps
> npm run start -- --help
```
* To get the path of a Box File
```
> npm run start getpath <id>
```
* The same opteration for a folder
```
> npm run start getpath -f <id>
```
* To get information of a Box item at a given path (could be a file, folder or weblink)
```
> npm run start getid <path with or without forward slash>
```
### Notes
* By default API calls are run as the service account user.  To run as a mananged user add the -u <userid> option to any command.
* Remember that all path expressions relative to folder 0 (All Files) and will differ based on the "effective" user making the API Calls.
