@echo off
echo Restoring icons...
if not exist "icons" mkdir "icons"
copy /Y "C:\Users\User\.gemini\antigravity\brain\fc911cc2-c4e5-4fe4-8239-df7093618128\uploaded_image_1_1765879693614.png" "icons\icon16.png"
copy /Y "C:\Users\User\.gemini\antigravity\brain\fc911cc2-c4e5-4fe4-8239-df7093618128\uploaded_image_2_1765879693614.png" "icons\icon48.png"
copy /Y "C:\Users\User\.gemini\antigravity\brain\fc911cc2-c4e5-4fe4-8239-df7093618128\uploaded_image_0_1765879693614.png" "icons\icon128.png"
echo Done!
pause
