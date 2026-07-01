# Git Commit Guide (Conventional Commits)

## Push qilish uchun ketma-ket buyruqlar:

```bash
git init
git add .
git commit -m "init: start async-race project"

git remote add origin https://github.com/YOUR_USERNAME/async-race.git
git branch -M main
git push -u origin main
```

## Keyingi commitlar uchun namunalar:

```bash
git add src/components/Garage/
git commit -m "feat: add garage view with car list and pagination"

git add src/hooks/useRace.ts
git commit -m "feat: add useRace hook for engine animation"

git add src/store/
git commit -m "feat: add redux store with garage, race, winners slices"

git add src/api/
git commit -m "feat: add api layer for garage, engine and winners endpoints"

git add src/components/Winners/
git commit -m "feat: add winners view with sortable table"

git commit -m "feat: add ant design dark theme and ui components"

git commit -m "fix: correct winner time calculation"

git commit -m "docs: update readme with checklist and deploy link"
```

## GitHub Pages deploy (birinchi marta):

Settings → Pages → Source: gh-pages branch

GitHub Actions `.github/workflows/deploy.yml` avtomatik deploy qiladi
har `git push` qilganingizda.
