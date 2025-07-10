@echo off
cd /d "C:\Users\kumar\Desktop\CodeVerse\CodeVerse\server\temp"
forfiles /M *.* /D -0.007 /C "cmd /c del @file"
