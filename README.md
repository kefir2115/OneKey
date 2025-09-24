# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## How to install

1. Install dependencies

```bash
npm install
```

2. Start the app

```bash
npx expo start
```
## Before building

> Modify the .env file field `GOOGLE_MAPS_API_KEY` and provide Google API key

> Execute
> ```bash
> npx expo prebuild -c
> ``` 

## How to build

Android:
```bash
npx eas build --platform android
```

IOS:
```bash
npx eas build --platform ios
```

## Config file (user device)
```JSON
{
   "language": "en", // en for english or pl for polish
   "theme": 0, // 0-1 corresponds for light-dark
   "pin": "", // secured user pin used to auth
   "biometric": true, // should user be prompted to use fingerprint
   "account": {
      "address": "", // user wallet address
      "seed": "", // user seed
      "active": false // whether account is active
   },
   "shortcuts": [] // app icon list of devices
}
```

## Cache file (user device)
```JSON
{
   "devices": [], // Device list
   "orgs": [], // Organisations list
   "keys": [] // Keys list (unused)
}
```

## Schemas

Device
```JSON
{
    "active": boolean,
    "address": string,
    "connected": boolean,
    "description": string,
    "details": {
       "additionalDescription": string,
       "assetUrl": string,
       "deviceModel": string,
       "deviceType": string,
       "physicalAddress": {
           "addressLine1": string,
           "addressLine2": string,
           "city": string,
           "country": string,
           "floor": string,
           "postcode": string
       }
    },
    "distance": number,
    "lat": number,
    "lng": number,
    "name": string,
    "owner": string,
    "visible": boolean,
    "supplier": string,
    "key": {
        "assetId": string,
        "owner": string
    }
}
```

Organisation
```JSON
{
    "address": string,
    "name": string,
    "description": string,
    "users": string[],
    "suppliers": {
        "objects": {
           "address": string
        }[]
    }
}
```

Key
```JSON
{
    "assetId": string,
    "owner": string,
    "supplier": {
        "address": string
    }
}
```