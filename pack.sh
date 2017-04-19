#!/bin/sh

electron-packager ./sources "imgviwer" --out=dist --platform=darwin,win32 --arch=x64 --version=1.6.2
