@echo off
title Запуск табло ЧГК
echo Установка компонентов (только в первый раз)...
call npm install
echo Запуск приложения...
call npm start
pause