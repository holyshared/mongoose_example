# Mongoose example

## 環境構築

docker-composeをインストールして、コンテナを起動する。

```
docker-compose up -d
```

## 実験

### 実験-1

ネストしたIDにObjectIdでの参照がある場合は、**populate**した時にドキュメントの構造が期待した状態にならない。  
**mapReduce**で集計した結果をフェッチする場合は、気を付ける必要がある。

```js
const query = { category: cat._id, year: 2019, month: 1 };
const options = { populate: { path: '_id', populate: { path: 'category' } } };
const report = await ReportStats.findById(query, null, options);
```

#### 期待する結果

```js
{
  _id: {
    category: { ... },
    year: 2019, 
    month: 2019,
  }
}
```

#### 結果

```js
{ _id: [], value: 1 } // _idが配列になってしまう
```
