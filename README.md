<p align="center">
  <img src="https://cdn-images-1.medium.com/max/1920/1*qp3u7D_FkGlFeBPUx7hcLg.png" width="300" height="300" alt="dynamodb-to-local">
  <h1>dynamodb-to-local</h1>
</p>

Pretty neat does as described. Extracts the contents of a DynamoDB table and creates a local .csv file.

## Let's get going
```javascript
npm install
```

## Describe Table

```javascript
node dynamodb-to-local.js -d <TABLENAME>
```

## Create .csv file

```javascript
node dynamodb-to-local.js -t <TABLENAME> -f <FILENAME>
```

git filter-branch --index-filter \
'git rm --cached --ignore-unmatch config.js'


git filter-branch --force --index-filter \
'git rm --cached --ignore-unmatch dynamodb-to-local/src/config.json' \
--prune-empty --tag-name-filter cat -- --all