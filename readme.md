# Monorepo 架构

### 介绍

Monorepo是一种软件开发实践，其中所有的项目或库都托管在同一个Git仓库中，也就是**单体多模块仓库**。这种模式与传统的多个仓库（multirepo）模式相对。

1. 在Monorepo中，项目之间的依赖关系可以在一个仓库中更新，而不是在多个仓库中分别更新。
2. 所有的代码变更都在一个仓库中进行，这使得查看项目的整个变更历史变得更加容易。
3. 通过配置，可以减少工作空间中公用部分的依赖体积

### 参考

1. [你一定能学会Monorepo - 小野的web世界](https://www.bilibili.com/video/BV1TZz7YvEWZ/?spm_id_from=333.999.0.0&vd_source=1c6268f99220acd2592c93a3a87cbe31)

2. 和杜成讨论

3. 代码实践

### 使用pnpm搭建

> 请安装pnpm!

1. 根目录仓库初始化

   ```shell
   pnpm init # 或者 npm init -y
   ```

2. 创建并配置工作区

   在根目录下创建一个`pnpm-workspace.yaml`文件作为工作区的配置文件，该文件按照yaml文件的语法编写，但其实在这里用到的语法只有：

   1. **Sequences**，也就是**序列**，用 "-" 来表示缩进，也可以不写

   2. **通配符模式**，也就是**Glob 模式**，用于**匹配文件路径名**

   **选项**：

   1. `packages`选项来配置每个**模块应用**的工作空间，也就npm仓库

      ```yaml
      packages:
        - a # 根目录下的文件夹 a 为一个工作空间
        - "apps/*" # 根目录下的文件夹 apps 的下一级的所有目录都为一个工作空间
        - packages/* # 根目录下的文件夹下 packages 的下一级所有目录都为一个工作空间
        - "!**/test" # 排除根目录下所有的子目录（包含嵌套）test 作为工作空间
        - "demo/**" # 根目录下的 demo 文件夹下所有的子目录作为工作空间
        - server # 根目录下的文件夹 server 为一个工作空间
      ```

      

   2. `catalog`选项来配置单个npm依赖的默认版本，如果多个工作空间使用到了这个npm依赖，那么可以配置实现复用，确保版本一致。

      > 其中npm包依赖版本的控制语法同package.json中dependencies、devDependencies一致

      * 配置部分

        pnpm-workspace.yaml

        ```yaml
        # ....... 
        
        # 下面是配置单个npm依赖的默认版本
        catalog:
          webpack: ^5.100.2
          webpack-cli: ^6.0.1
          postcss: ^8.5.6
          postcss-loader: ^8.1.1
          postcss-preset-env: ^10.1.5
          gasp: ^3.13.0
          sass: ^1.86.1
          sass-loader: ^16.0.5
          
        ```


      * 复用部分
    
        工作空间**A**的package.json
    
        ```json
        {
            /* 省略部分 */
            "dependencies": {
                "postcss": "catalog:",
                "postcss-loader": "catalog:",
                "postcss-preset-env": "catalog:",
            }
        }
        ```
    
        工作空间**B**的package.json
    
        ```json
        {
            /* 省略部分 */
            "dependencies": {
                "postcss": "catalog:",
                "postcss-loader": "catalog:",
                "postcss-preset-env": "catalog:",
                "sass": "catalog:",
                "sass-loader": "catalog:"
            }
        }
        ```
    
      如上，`postcss`、`postcss-loader`、`postcss-preset-env`等依赖是按照配置部分的版本安装在各自的工作空间。
    
      还有一种情况，很多工作空间都需要安装一些固定的依赖，比如说上面的`webpack`、`webpack-cli`，难道每个子工作空间都要写一遍 `"webpack": "catalog:"`和`"webpack-cli": "catalog:"`，当然是可以，但是麻烦，难道`monorepo`这个架构推出来不是给我们偷懒的么？
    
      实际上，我们可以在根目录下安装`webpack`、`webpack-cli`，所有的子仓库都能共享根目录的依赖：
    
      * 根目录
    
        ```json
        {
            /* 省略部分 */
            "dependencies": {
                "webpack": "catalog:",
                "webpack-cli": "catalog:"
            }
        }
        ```


      * 子工作空间
    
        ```json
        {
            /* 省略部分 */
            "scripts": {
                "bundle": "npx webpack",
            },
            "dependencies": {
                "sass": "catalog:",
                "sass-loader": "catalog:"
            }
        }
        ```
        
        可以看一下pnpm官方给的一个示例：[pnpm-workspace.yaml](https://pnpm.io/pnpm-workspace_yaml)

   3. `catalogs`

      如果想对npm包分类或者是想使用同一个包的不同版本，那么使用`catalogs`是一个很好的选择，基础作用和`catalog`一样，记录npm的版本，然后在工作空间使用，但是呢它可以把一些npm作为一个集合，如：

      ```yaml
      # ....... 
      
      # 下面是对npm包进行分类
      catalogs:
        vue3:
          vue: ^3.5.13
          vite: ^6.0.6
        	"@vitejs/plugin-vue": ^5.2.1 	
        vue2:
        	vue: 2.7.16
        	webpack: ^5.54.0
        	"@vue/cli": 3.4.1
      ```

      工作空间A:

      ```json
      {
          /* 省略部分 */
          "dependencies": {
              "vue": "catalog:vue3",
              "vite": "catalog:vue3",
              "@vitejs/plugin-vue": "catalog:vue3",
          }
      }
      ```

      工作空间B:

      ```json
      {
          /* 省略部分 */
          "dependencies": {
              "vue": "catalog:vue2",
              "webpack": "catalog:vue2",
              "@vue/cli": "catalog:vue2",
          }
      }
      ```

      如上不同的工作空间使用了不同`vue`的版本，而且被分类到不同的集合中，而这些不同的集合都是围绕着分类划分的npm包，这样的语法方便去管理不同集合的npm包。

* 安装依赖

  1. 一般情况下，执行`pnpm i`会安装根目录和所有子工作空间的依赖（node_modules）

  2. 如果想对根目录的依赖进行管理需要携带`-w`CLI参数，如： `pnpm i -D webpack-dev-server -w`

  3. 子工作空间的依赖管理正常情况下照常和普通的npm仓库一样，不过一般要切换到该子工作空间的磁盘路径下进行

  4. 一个工作空间可以复用任意的另一个工作空间的内容，不过需要注意的是：

     * 被复用仓库

       需要定义仓库名，也就是该仓库的package.json的name字段，同时要保证name字段名在所有的工作空间唯一，通常以："@ + 根目录仓库名 + / + 自定义的子仓库名" 来定义

       ```json
       {
           "name": "@monorepo-series/a",
           /* 省略部分 */
       }
       ```

     * 复用仓库

       要复用另一个工作空间的内容，需要将另一个工作空间的内容作为依赖安装：

       ```shell
       pnpm i @monorepo-series/a -w # 安装子工作空间@monorepo-series/a作为依赖
       ```

       你也可以修改工作空间的package.json来实现：

       ```json
       {
           /* 省略部分 */
           "dependencies": {
               "@monorepo-series/a": "workspace:*"
           }
       }
       ```

       使用：

       ```javascript
       import { foo } from "@monorepo-series/a/src/index.js"
       foo()
       ```

     工作空间可以指子工作空间和根目录，但是呢——子工作空间无法复用根目录工作空间的内容，因为没有意义且理论上无法实现。

* 根目录执行子仓库的脚本命令

  假设有一个子工作空间，仓库名为`@monorepo-series/a`，下面是它的package.json:

  ```json
  {
      "name": "@monorepo-series/a",
      "scripts": {
          "bundle": "npx webpack"
      },
      /* 省略部分 */
  }
  ```

  那么可以在跟目录下通过`--filter`来筛选子仓库名称（name字段）执行其中的脚本命令（scripts字段）：

  ```shell
  pnpm run --filter @monorepo-series/a bundle
  ```

  其中`--filter`可以简写为`-F`

  这个CLI命令可以写在根目录的package.json的scripts中，如：`"a:bundle": "pnpm run --filter @monorepo-series/a bundle"`

### 扩展

#### 并行运行项目

为了方便运行多个项目的脚本（比如我想同时运行前端和node.js写的后端），可以安装`concurrently`，参考：[concurrently](https://github.com/open-cli-tools/concurrently?tab=readme-ov-file#usage)

**常用语法1**：

```shell
# 使用引号将单独的命令括起来，来并行运行两个命令
concurrently 'command1 arg' 'command2 arg'
```

可以用package.json来保存这个命令：

```json
{
	"scripts": {
		"start": "concurrently 'node ./index.js' 'node ./scripts.js'"
	}
}
```

其中`concurrently`可以简写为`conc`

```shell
# 使用引号将单独的命令括起来，来并行运行两个命令
conc 'command1 arg' 'command2 arg'
```

**常用语法2**：

可以通过`npm:`的语法来并行执行`package.json`中的命名

```json
{
	"scripts": {
		"index": "node ./index.js",
		"scripts": "node ./scripts.js",
		"start": "conc 'npm:index' 'npm:scripts'"
	}
}
```

然后运行`npm run start`，这里对`pnpm`一样适用。

当然`concurrently`还有很多api，可以在node.js中使用，但不属于本文章的范畴。

#### 管理版本和变更日志

为了方便管理版本（多包）和记录不同子包的变更日志，我们可以使用[changesets](https://github.com/changesets/changesets)

* 安装：

  ```shell
  # 项目内安装 changesets
  pnpm add -D -w @changesets/cli
  # 或者全局安装 changesets
  npm install -g @changesets/cli
  
  # 安装更改日志生成器包
  pnpm add -D -w @changesets/changelog-git
  ```

* 初始化

  ```shell
  changeset init
  ```

  他会生成一个.changeset文件夹，会包含changeset的配置文件`config.json`和发布版本前存储日志的文件`README.md`

  ```
  .changeset
  ├─ config.json # 配置文件
  └─ README.md
  ```

  `config.json`的配置请参考：[配置信息](https://github.com/changesets/changesets/blob/main/docs/config-file-options.md#access-restricted--public)

* 配置说明

  1. `access`

     如果你不打算发布私有包，可以将`access`写为`public`；如果打算发布私有包，可以将`access`写为`restricted`，并且需要登录到具有安装权限的npm帐户。

  2. `ignore`

     当我们使用changeset变更日志指定忽略的子包，它接收一个数组，每个数组元素都是忽略的子包的名称。

* 使用

  1. 变更日志

     可以使用命令：`npx changeset`或者`pnpm changeset`

     它会打开终端的交互式GUI，如：

     ![changeset 交互式GUI](.static\img\03.02.001.png)

     第一个步骤会让你选择添加变更日志的子包，上下箭头选择，空格键选取，enter键下一步。

     选取一个包后，下一步可以看到：

     ![03.02.002](.static/img/03.02.002.png)

     它提示这个包是不是一个大的变更，其中`major`高亮。其实在语义化版本中：

     * Major

       Major版本号是语义化版本中的第一个数字，用于表示软件的主要版本变更。当进行大规模的、不兼容的变更时，应该增加Major版本号。

       主要变更包括：

       1. **不兼容的API更改**：当你修改了软件的API，以至于旧版本的代码无法与新版本一起正常工作时，应该升级Major版本号。这可能包括删除、更改或添加API端点、参数或行为。
       2. **重大功能新增**：如果你引入了重要的新功能，这可能会改变用户的工作流程或提供新的能力，也应该升级Major版本号。
       3. **废弃旧功能**：当你计划废弃或删除旧的功能时，通常需要增加Major版本号，以提醒用户进行迁移。

     * Minor

       Minor版本号是语义化版本中的第二个数字，用于表示向后兼容的新功能添加。

       Minor版本号的变更包括：

       1. **新增功能**：当你向软件添加新的功能，但这些功能不会破坏现有的API或功能，应该增加Minor版本号。
       2. **改进现有功能**：如果你对现有功能进行了改进，但这些改进不会导致现有用户的代码无法工作，也应该升级Minor版本号。
       3. **向后兼容的API增强**：如果你增加了现有API的参数、选项或能力，而这不会破坏已有的使用方式，也应该升级Minor版本号。

     * Patch

       Patch版本号是语义化版本中的第三个数字，用于表示向后兼容的错误修复或小的改进。

       Patch版本号的变更包括：

       1. **错误修复**：当你解决现有功能或API中的错误时，应该升级Patch版本号。这些修复不应引入新的功能或改变现有的行为。
       2. **性能优化**：如果你对现有功能进行性能优化，而不会改变其行为，也应该升级Patch版本号。
       3. **小的改进或修改**：如果你进行了一些小的改进，但它们不会破坏向后兼容性，应该升级Patch版本号。
     
      讲人话就是比如：当前npm包的版本为1.0.0，
     
     ​	如果你选择`major`，大版本会递增1，也就是2.0.0。
     
     ​	如果你选择`minor`，次要版本会递增1，也就是1.1.0。
     
     ​	如果你选择`patch`，修订版本会递增1，也就是1.0.1。
     
     继续上面的，如果什么都不选择，按enter键，他会从`major` => `minor` => `patch`，当到达`patch`时，会自动进入下一步：日志描述
     
     ![03.02.003](.static/img/03.02.003.png)
     
     按回车键确认描述。
     
     ![03.02.004](.static/img/03.02.004.png)
     
     最后一步，它会问你：Is this your desired changeset?
     
     也就是“这是你想要的改变吗？”，如果确定会进行下一步骤，如果取消那么上面的步骤作废。
     
  2. 
