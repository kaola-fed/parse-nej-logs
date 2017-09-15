# parse-nej-logs

> 解析 nej 打包构建后的日志，并筛选出期望的警告信息，以决定是否中断构建流程

## 安装
```
$ npm i -D parse-nej-logs
```

## 启用
1. `package.json`， 中新增 `parseNejLogs` scripts
```json
{
  "dependencies": {
      "parse-nej-logs": "1.0.0" 
  },
  "scripts": {
    "parseNejLogs": "node ./parse-nej-logs.js",
    "nejbuildtest": "node --max-old-space-size=4096 \"node_modules/nej/bin/build.js\" \"release_test.conf\" && npm run parseNejLogs",
    "nejbuildpre": "node --max-old-space-size=4096 \"node_modules/nej/bin/build.js\" \"release_pre.conf\" && npm run parseNejLogs",
    "nejbuildprod": "node --max-old-space-size=4096 \"node_modules/nej/bin/build.js\" \"release.conf\" && npm run parseNejLogs",
  }
}
```

2. 新建 `parse-nej-logs.js` 文件
```js
const parseNejLogs = require('parse-nej-logs');

parseNejLogs({
    dirname: './',
    interruptLevel: 99, // 100 - miss js, 99 - miss html, 98 - miss css
    getWarningLevel: null
}).catch(e => {
    console.error(e); // 或其他日志输出方式
    process.exit(1); // 中断 npm 构建流程
});
```
## 参数说明
* dirname - 日志目录，需要输入一个合法的路径
* interruptLevel - 中断流程的级别(建议 99即可)
    * 100 - 缺失 `javascript` 文件
    * 99 - 缺失 `html` 文件
    * 98 - 缺失 `css` 文件
* getWarningLevel - 自定义 level 指定方式

## License

MIT