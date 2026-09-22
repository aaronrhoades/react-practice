# React, React Native, and Node.js
- App runs react native and react side-by-side with a node back end
- App uses [oRPC](https://orpc.dev/) with shared classes in `/shared` folder

## Setup
- In `/server`, copy `.env.example` to `.env` with the appropriate connection string to PostgreSQL. 
- in `/client/native` create `.env.local` as a copy of .env to insert `http://<your-ip-address>:3000` for connecting to the local node server.

## Starting the Apps
- `npm run dev` or `npm run start` depending on the `package.json` file.

## Updating packages
```
cd C:\dev\react-native\my-app\shared
npm run build

cd ..\server
npm install
npm run dev

cd ..\client\web
npm install
npm run dev
```

## Troubleshooting node.js still running (not shutting down)

At the time of this writing (9/22/2026) there is an occasional bug where the node.js server does not shut down or restart properly. Follow these steps to fix it.

### To check if process is running:

```
Get-NetTCPConnection -LocalPort 3000
```

### If process is running:

```
Stop-Process -Id (Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique) -Force
```