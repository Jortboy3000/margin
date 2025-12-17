@echo off
if not exist "docs\images" mkdir "docs\images"
echo Copying images...
copy /Y "C:\Users\User\.gemini\antigravity\brain\fc911cc2-c4e5-4fe4-8239-df7093618128\uploaded_image_4_1765985553927.png" "docs\images\capture.png"
copy /Y "C:\Users\User\.gemini\antigravity\brain\fc911cc2-c4e5-4fe4-8239-df7093618128\uploaded_image_3_1765985553927.png" "docs\images\taxonomy.png"
copy /Y "C:\Users\User\.gemini\antigravity\brain\fc911cc2-c4e5-4fe4-8239-df7093618128\uploaded_image_0_1765985553927.png" "docs\images\drift.png"
copy /Y "C:\Users\User\.gemini\antigravity\brain\fc911cc2-c4e5-4fe4-8239-df7093618128\uploaded_image_2_1765985553927.png" "docs\images\community.png"
echo Done!
pause
