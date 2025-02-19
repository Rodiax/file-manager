# file-manager
Desktop App that allows users to copy files into specified folders and subfolders along a given path.

## Overview
This App is useful if you need to copy files into multiple folders and subfolders of the same type. For example, if you have multiple copies of different programs with the same file structure. Just place your files into folders and subfolders of any depth, and they will be copied along this path into the folders you choose.

## Instalation
- clone this repo
- cd to directory of this repo and type `npm install` using npm manager
- after instalation type `npm start`
- if you want to check out the final build, type `npx electron-forge make`

## Current drawbacks 
- no multilingual support
- no text field for path search
- requires running as administrator.

## Technologies used
- React
- Typescript
- Zustand
- MaterialUI (MUI)
- Glob
- Electron (electron-forge)
