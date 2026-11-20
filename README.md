Приложение написано с нуля с помощью ИИ. Опыта работы с ИИ и с программированием у меня нет. Мой первый опыт. 
Для работы с проектом нужно скачать Electron. Папку node_modules. Но когда я её удаляю из папки проекта и нажимаю "Запустить", появляется такая ошибка:
G:\Что где когда\chgk_tablo_3D\node_modules\electron\index.js:17
    throw new Error('Electron failed to install correctly, please delete node_modules/electron and try installing again');
    ^

Error: Electron failed to install correctly, please delete node_modules/electron and try installing again
    at getElectronPath (G:\Что где когда\chgk_tablo_3D\node_modules\electron\index.js:17:11)
    at Object.<anonymous> (G:\Что где когда\chgk_tablo_3D\node_modules\electron\index.js:21:18)
    at Module._compile (node:internal/modules/cjs/loader:1968:14)
    at Object..js (node:internal/modules/cjs/loader:2108:10)
    at Module.load (node:internal/modules/cjs/loader:1690:32)
    at Module._load (node:internal/modules/cjs/loader:1480:12)
    at wrapModuleLoad (node:internal/modules/cjs/loader:261:19)
    at Module.require (node:internal/modules/cjs/loader:1713:12)
    at require (node:internal/modules/helpers:318:16)
    at Object.<anonymous> (G:\Что где когда\chgk_tablo_3D\node_modules\electron\cli.js:3:18)

Node.js v26.13.0
Поэтому я приложил файл exe. Табло 3D ЧГК by Mihaalych. Это полностью рабочее приложение.
<img width="1919" height="1079" alt="Снимок экрана 2026-11-20 152142" src="https://github.com/user-attachments/assets/0bfc4d4e-21c0-4f61-a2b2-2a8248004d01" />
<img width="345" height="256" alt="Снимок экрана 2026-11-20 152150" src="https://github.com/user-attachments/assets/372ab708-fda6-424a-ae27-8e9d1168c001" />
