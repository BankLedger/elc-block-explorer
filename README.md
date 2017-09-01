# elc-block-explorer
Block explorer for Votechain


#编译说明

#一.	Ubuntu系统

1.	准备工作

    先进行apt-get更新使用命令
    
    apt-get update
    
    安装依赖包, 使用以下命令:
    
    apt-get install libtoolpkg-configautoconfautomakeuuid uuid-dev
    
    apt-get install build-essential libssl-dev libdb++-dev libboost-all-dev libqrencode-dev
    

2.	安装nvm

    首先下载nvm，这里我们需要使用git，使用以下命令
    
    apt-get install git
    
    接着使用git命令下载安装nvm
    
    git clone https://github.com/creationix/nvm.git ~/.nvm && cd ~/.nvm && git checkout `git describe --abbrev=0 --tags`
    
    使用命令打开.bashrc编辑
    
    vim .bashrc
    
    将source ~/.nvm/nvm.sh  添加进 .bashrc 中，保存退出
    
    使用命令将新增的nvm添加到系统中，
    
    source  .bashrc
    

3.	使用nvm安装node 4.6.0版本

    使用一下命令来安装,并且将其设置为默认版本。

    nvm install 4.6.0

    nvm alias default 4.6.0
    
    安装好node中会自动安装npm，node package manage
    

4.	安装编译zmq

    使用git获取libzmq
    
    git clone https://github.com/zeromq/libzmq
    
    打开目录
    
    cd libzmq

    使用以下命令编译
    
    ./autogen.sh && ./configure && make -j 4
    
    npm config set unsafe-perm true
    
    make check && make install && sudo ldconfig
    
    npm install -g zmq
    
5.	安装mongodb

    使用命令下载安装包
    
    wget http://fastdl.mongodb.org/linux/mongodb-linux-i686-1.8.2.tgz
    
    下载完成后解压缩压缩包
    
    tar zxf mongodb-linux-i686-1.8.2.tgz
    
    将mongodb移动到/usr/local/server/mongdb文件夹
    
    mv mongodb-linux-i686-1.8.2 /usr/local/mongodb
    
    创建数据库文件夹与日志文件
    
    mkdir /usr/local/mongodb/data
    
    touch /usr/local/mongodb/logs
    
    设置开机自启动
    
    将mongodb启动项目追加入rc.local保证mongodb在服务器开机时启动
    
    echo "/usr/local/server/mongodb/bin/mongod --dbpath=/usr/local/server/mongodb/data –logpath=/usr/local/server/mongodb/logs –logappend  --auth –port=27017" >> /etc/rc.local

    启动mongodb

    cd到mongodb目录下的bin文件夹启动mongodb

    至此编译结束


#二.安装bitcore

    1.将bitcore 目录移动到安装浏览器的系统 的/root/.nvm/versions/node/v4.6.0/lib/node_modules/
    
    2.参照bitcoreConf elcoinConf 目录下的README 文件部署配置文件


启动bitcore 目录下的bitcore 程序启动浏览器
