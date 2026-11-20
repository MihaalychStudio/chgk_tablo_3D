const { app, BrowserWindow, ipcMain, screen } = require('electron');
const path = require('path');

let mainWindow = null; // Главное окно (панель ведущего)
let scoreboardWindow = null; // Окно табло
let currentDisplayIndex = 0; // Индекс текущего монитора для табло

// Функция создания главного окна
function createMainWindow() {
    mainWindow = new BrowserWindow({
        width: 400, // Начальные размеры, которые потом пересчитает index.html
        height: 300,
        show: false, // Показываем только когда всё загрузится
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    mainWindow.loadFile('index.html');
    mainWindow.setMenuBarVisibility(false); // Скрываем меню для чистоты интерфейса

    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
    });

    // НОВОЕ: Когда панель ведущего получает фокус (клик по ней), табло всплывает наверх
    mainWindow.on('focus', () => {
        if (scoreboardWindow && !scoreboardWindow.isDestroyed()) {
            scoreboardWindow.setAlwaysOnTop(true, 'screen-saver');
            scoreboardWindow.moveTop();
        }
    });

    // НОВОЕ: Когда панель ведущего теряет фокус (открыли FastStone), табло уходит назад
    mainWindow.on('blur', () => {
        if (scoreboardWindow && !scoreboardWindow.isDestroyed()) {
            scoreboardWindow.setAlwaysOnTop(false);
        }
    });

    // Если главное окно закрывается, закрываем и табло
    mainWindow.on('closed', () => {
        mainWindow = null;
        if (scoreboardWindow) {
            scoreboardWindow.close();
        }
    });
}

// Инициализация приложения
app.whenReady().then(() => {
    createMainWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createMainWindow();
        }
    });
});

// Закрытие приложения
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

// ==========================================
// ОБРАБОТЧИКИ СОБЫТИЙ ОТ ПАНЕЛИ ВЕДУЩЕГО (index.html)
// ==========================================

// 1. Изменение размера окна под контент
ipcMain.on('resize-window', (event, width, height) => {
    if (mainWindow) {
        mainWindow.setSize(Math.ceil(width), Math.ceil(height));
    }
});

// 2. Управление окном табло (ИСПРАВЛЕНО: теперь управляет scoreboardWindow)
ipcMain.on('set-scoreboard-on-top', (event, isOnTop) => {
    if (scoreboardWindow && !scoreboardWindow.isDestroyed()) {
        if (isOnTop) {
            scoreboardWindow.setAlwaysOnTop(true, 'screen-saver');
            scoreboardWindow.moveTop();
        } else {
            scoreboardWindow.setAlwaysOnTop(false);
        }
    }
});

// 3. Открытие табло и поочередное переключение мониторов
ipcMain.on('open-scoreboard-next-monitor', (event, url) => {
    const displays = screen.getAllDisplays(); // Получаем список всех мониторов

    if (scoreboardWindow && !scoreboardWindow.isDestroyed()) {
        // Если окно уже открыто, переключаем монитор
        if (displays.length > 1) {
            currentDisplayIndex = (currentDisplayIndex + 1) % displays.length;
            const targetDisplay = displays[currentDisplayIndex];
            
            // Временно выходим из полноэкранного режима, чтобы корректно переместить окно
            scoreboardWindow.setFullScreen(false);
            
            // Небольшая задержка, чтобы ОС успела обработать выход из фуллскрина
            setTimeout(() => {
                if (scoreboardWindow && !scoreboardWindow.isDestroyed()) {
                    scoreboardWindow.setBounds(targetDisplay.bounds);
                    scoreboardWindow.setFullScreen(true);
                    scoreboardWindow.focus();
                }
            }, 100);
        } else {
            scoreboardWindow.focus();
        }
    } else {
        // Если окно еще не открыто, создаем его на первом мониторе
        const targetDisplay = displays[0];
        
        scoreboardWindow = new BrowserWindow({
            x: targetDisplay.bounds.x,
            y: targetDisplay.bounds.y,
            width: targetDisplay.bounds.width,
            height: targetDisplay.bounds.height,
            fullscreen: true,
            frame: false, // Безрамочное окно
            autoHideMenuBar: true,
            webPreferences: {
                nodeIntegration: true,
                contextIsolation: false
            }
        });

        // НОВОЕ: Если панель ведущего в фокусе, сразу ставим табло поверх
        scoreboardWindow.setAlwaysOnTop(mainWindow ? mainWindow.isFocused() : true, 'screen-saver');

        // Передаем URL с параметром ?view=audience
        scoreboardWindow.loadURL(url);

        // При закрытии окна обнуляем переменную, чтобы в следующий раз оно открылось заново
        scoreboardWindow.on('closed', () => {
            scoreboardWindow = null;
            currentDisplayIndex = 0; // Сбрасываем индекс при закрытии
        });
    }
});