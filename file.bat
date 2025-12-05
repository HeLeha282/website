@echo off
set "output=project_files.txt"
if exist "%output%" del "%output%"

for %%f in (index.html catalog.html basket.html reviews.html login.html) do (
    if exist "%%f" (
        echo ==== ФАЙЛ: %%f ==== >> "%output%"
        echo Путь: %%f >> "%output%"
        echo. >> "%output%"
        type "%%f" >> "%output%"
        echo. >> "%output%"
        echo -------------------------------------------------------------------------------- >> "%output%"
        echo. >> "%output%"
    )
)

for /r %%f in (*.html *.css *.js) do (
    set "relpath=%%f"
    setlocal enabledelayedexpansion
    set "relpath=!relpath:%~dp0=!"
    echo ==== ФАЙЛ: !relpath! ==== >> "%output%"
    echo Путь: !relpath! >> "%output%"
    echo. >> "%output%"
    type "%%f" >> "%output%"
    echo. >> "%output%"
    echo -------------------------------------------------------------------------------- >> "%output%"
    echo. >> "%output%"
    endlocal
)

echo Готово! Результат в файле: %output%
pause