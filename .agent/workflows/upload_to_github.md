---
description: Upload project to a new GitHub repository
---

1. Initialize Git (if not already initialized):
   ```bash
   git init
   ```

2. Add all files to staging:
   ```bash
   git add .
   ```

3. Commit the changes:
   ```bash
   git commit -m "Initial commit"
   ```

4. Link your local repository to your new GitHub repository:
   *Replace `YOUR_USERNAME` and `YOUR_REPO_NAME` with your actual details.*
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   ```

5. Rename the default branch to main (optional but recommended):
   ```bash
   git branch -M main
   ```

6. Push your code to GitHub:
   ```bash
   git push -u origin main
   ```
