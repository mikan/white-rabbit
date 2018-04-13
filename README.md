# White Rabbit

AOSN読書会 Slack 過去ログ倉庫検索システム

## Setup

設定ファイルを作成します。

`config/debug.yml`:

```yaml
session:
  secret: "white-rabbit"
ldap:
  url: "ldap://ldap.xxx.com:389"
  bindDN: "cn=admin,dc=xxx,dc=com"
  bindCredentials: "xxxxxx"
  searchBase: "dc=xxx,dc=com"
  searchFilter: "(uid={{username}})"
mongodb:
  url: "mongodb://<MONGO_USER>:<MONGO_PASSWORD>@mongo.xxx.com:27017/slacklog?autoReconnect=true"
  db: "slacklog"
  collection: "xxx"
search:
  limit: 30
```

起動します。

```
NODE_ENV=debug nom run start
open http://localhost:3000
```

